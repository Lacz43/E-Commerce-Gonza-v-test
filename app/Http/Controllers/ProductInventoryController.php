<?php

namespace App\Http\Controllers;

use App\Models\InventoryReason;
use App\Models\Product;
use App\Models\ProductInventory;
use App\Services\InventoryMovementService;
use App\Services\AttachmentService;
use App\Services\QueryFilters;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Support\Facades\Auth;

class ProductInventoryController extends Controller
{
    /**
     * Listado base del inventario con paginación y filtros simples (placeholder).
     */
    public function index(Request $request)
    {
        // TODO: aplicar filtros específicos de inventario (stock, low_stock, etc.)
        $products = (new QueryFilters($request))->apply(
            Product::query()->with(['productInventory', 'defaultImage:product_id,image'])->whereHas('productInventory')
        );
        $filtersFields = Product::getFilterableFields();
        $sortFields = Product::getSortableFields();

        return Inertia::render('Products/Inventory/Index', [
            'products' => $products,
            'filtersFields' => $filtersFields,
            'sortFields' => $sortFields,
        ]);
    }

    /**
     * Muestra formulario de ajuste de stock (placeholder).
     */
    public function edit(Product $product)
    {
        $product = $product->only(['id', 'name', 'price']);
        return Inertia::render('Product/Inventory/Edit', [
            'product' => $product,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product' => 'required|exists:products,id',
            'items.*.stock' => 'required|numeric',
            'reason' => 'nullable|string',
            'files' => 'nullable|array',
            'files.*' => 'nullable|file|mimes:jpeg,jpg,png,pdf,doc,docx,xlsx,xls,csv|max:2048',
        ]);

        try {
            $movements = [];
            $reason = InventoryReason::firstOrCreate(['name' => $request->reason], ['description' => $request->reason]);

            foreach ($request->items as $item) {
                [$productInventory, $inventoryMovement] = InventoryMovementService::inventoryMovement(
                    $item['product'],
                    $item['stock'],
                    ProductInventory::class,
                    null,
                    Auth::user()->id,
                    $reason->id
                );
                $movements[] = $inventoryMovement;
            }

            // Adjuntar archivos a cada movimiento si existen
            if ($request->hasFile('files')) {
                foreach ($movements as $movement) {
                    foreach ($request->file('files') as $file) {
                        AttachmentService::attachFile($file, $movement, disk: 'local');
                    }
                }
            }

            return response()->json([
                'message' => 'Inventario actualizado correctamente',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar el inventario',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualiza campos de inventario (placeholder, pendiente de validación y lógica de stock).
     */
    public function update(Request $request, ProductInventory $product)
    {
        $request->validate([
            'stock' => 'required|numeric',
            'reason' => 'nullable|string',
            'files' => 'nullable|array',
            'files.*' => 'nullable|file|mimes:jpeg,jpg,png,pdf,doc,docx,xlsx,xls,csv|max:2048',
        ]);

        try {
            $reason = InventoryReason::firstOrCreate(['name' => $request->reason], ['description' => $request->reason]);
            [$productInventory, $inventoryMovement] = InventoryMovementService::inventoryMovement(
                $product->id,
                $request->stock,
                get_class($product),
                $product->id,
                Auth::user()->id,
                $reason->id
            );

            // Adjuntar archivos al movimiento si existen
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    AttachmentService::attachFile($file, $inventoryMovement, disk: 'local');
                }
            }

            return response()->json([
                'message' => 'Inventario actualizado correctamente',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al actualizar el inventario',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Elimina (si aplica) un registro de inventario (placeholder).
     */
    public function destroy(Product $product)
    {
        // TODO: decidir política de borrado (soft delete, restricciones, etc.)
        // $product->delete();
        return response()->json([
            'message' => 'Operación de eliminación pendiente de implementación',
        ], 202);
    }
}

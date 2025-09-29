<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductInventory;
use App\Services\InventoryMovementService;
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
            Product::query()->with(['productInventory'])->whereHas('productInventory')
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

    /**
     * Actualiza campos de inventario (placeholder, pendiente de validación y lógica de stock).
     */
    public function update(Request $request, ProductInventory $product)
    {
        $request->validate([
            'stock' => 'required|numeric',
        ]);

        InventoryMovementService::inventoryMovement(
            $product->id,
            $request->stock,
            get_class($product),
            $product->id,
            Auth::user()->id,
            'ProductInventoryController@update'
        );
        return response()->json([
            'message' => 'Inventario actualizado (placeholder)',
        ]);
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

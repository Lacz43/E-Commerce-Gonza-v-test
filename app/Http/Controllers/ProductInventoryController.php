<?php

namespace App\Http\Controllers;

use App\Models\Products;
use App\Services\QueryFilters;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\Debugbar\Facades\Debugbar;

class ProductInventoryController extends Controller
{
    /**
     * Listado base del inventario con paginación y filtros simples (placeholder).
     */
    public function index(Request $request)
    {
        // TODO: aplicar filtros específicos de inventario (stock, low_stock, etc.)
        $products = (new QueryFilters($request))->apply(
            Products::query()->with(['productInventory'])->whereHas('productInventory')
        );
        $filtersFields = Products::getFilterableFields();
        $sortFields = Products::getSortableFields();

        return Inertia::render('Products/Inventory/Index', [
            'products' => $products,
            'filtersFields' => $filtersFields,
            'sortFields' => $sortFields,
        ]);
    }

    /**
     * Muestra formulario de ajuste de stock (placeholder).
     */
    public function edit(Products $product)
    {
        $product = $product->only(['id', 'name', 'price']);
        return Inertia::render('Products/Inventory/Edit', [
            'product' => $product,
        ]);
    }

    /**
     * Actualiza campos de inventario (placeholder, pendiente de validación y lógica de stock).
     */
    public function update(Request $request, Products $product)
    {
        // TODO: Validar y aplicar cambios (ej: stock actual, stock mínimo, alertas)
        // $product->update([...]);
        return response()->json([
            'message' => 'Inventario actualizado (placeholder)',
        ]);
    }

    /**
     * Elimina (si aplica) un registro de inventario (placeholder).
     */
    public function destroy(Products $product)
    {
        // TODO: decidir política de borrado (soft delete, restricciones, etc.)
        // $product->delete();
        return response()->json([
            'message' => 'Operación de eliminación pendiente de implementación',
        ], 202);
    }
}

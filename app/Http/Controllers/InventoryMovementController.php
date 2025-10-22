<?php

namespace App\Http\Controllers;

use App\Models\InventoryMovement;
use App\Services\QueryFilters;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryMovementController extends Controller
{
    /**
     * Listado del historial de movimientos de inventario.
     */
    public function index(Request $request)
    {
        $movements = (new QueryFilters($request))->apply(
            InventoryMovement::query()
                ->with(['productInventory.product', 'user'])
        );
        $modelsName = [
            'ProductInventory' => 'Inventario',
            'Order' => 'Ventas',
        ];
        $filtersAvailable = InventoryMovement::getFilterableFields();
        $sortAvailable = InventoryMovement::getSortableFields();

        return Inertia::render('Products/Inventory/MovementsIndex', [
            'movements' => $movements,
            'modelsName' => $modelsName,
            'filtersAvailable' => $filtersAvailable,
            'sortAvailable' => $sortAvailable,
        ]);
    }

    /**
     * Mostrar detalles de un movimiento.
     */
    public function show(InventoryMovement $movement)
    {
        return response()->json($movement->load(['productInventory.product', 'user', 'attachments', 'reason']));
    }

    /**
     * Obtener movimientos por producto.
     */
    public function getByProduct($productId)
    {
        $movements = InventoryMovement::whereHas('productInventory', function ($query) use ($productId) {
            $query->where('product_id', $productId);
        })
        ->with(['productInventory.product', 'user'])
        ->orderBy('created_at', 'desc')
        ->take(5)
        ->get();

        return response()->json($movements);
    }
}
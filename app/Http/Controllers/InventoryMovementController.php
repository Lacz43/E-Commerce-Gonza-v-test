<?php

namespace App\Http\Controllers;

use App\Models\InventoryMovement;
use App\Services\QueryFilters;
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

        return Inertia::render('Products/Inventory/MovementsIndex', [
            'movements' => $movements,
        ]);
    }
}

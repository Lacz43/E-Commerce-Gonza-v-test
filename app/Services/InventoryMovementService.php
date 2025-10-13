<?php

namespace App\Services;

use App\Models\InventoryMovement;
use App\Models\ProductInventory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request; // añadi esto

class InventoryMovementService
{
    /**
     * Registra un movimiento de inventario.
     *
     * @param int $productId ID del producto
     * @param int $quantity Cantidad del movimiento
     * @param string $modelType Tipo del modelo donde se ejecutó el movimiento
     * @param int|null $modelId ID del modelo donde se ejecutó el movimiento
     * @param int $userId ID del usuario que realizó el movimiento
     * @return array
     */
    public static function inventoryMovement(int $productId, int $quantity, string $modelType, ?int $modelId, int $userId)
    {
        $productInventory = ProductInventory::firstOrCreate(['product_id' => $productId], ['stock' => 0]);

        $controllerName = request()->route()->getAction()['controller'];

        // Capturamos la razón manualmente del request (si existe)
        $reason = Request::input('reason');

        $inventoryMovement = InventoryMovement::create([
            'product_inventory_id' => $productInventory->id,
            'quantity' => $quantity,
            'previous_stock' => $productInventory->stock,
            'type' => $quantity > 0 ? 'ingress' : 'egress',
            'model_type' => $modelType,
            'model_id' => $modelId,
            'user_id' => $userId,
            'controller_name' => $controllerName,
            'reason' => $reason, // 👈 ahora correcto
        ]);

        // Actualizamos stock
        $productInventory->stock += $quantity;
        $productInventory->save();

        return [$productInventory, $inventoryMovement];
    }
}
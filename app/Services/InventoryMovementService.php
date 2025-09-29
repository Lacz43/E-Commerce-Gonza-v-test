<?php

namespace App\Services;

use App\Models\InventoryMovement;
use App\Models\ProductInventory;
use Illuminate\Database\Eloquent\Model;

class InventoryMovementService
{
    /**
     * Registra un movimiento de inventario.
     *
     * @param int $quantity Cantidad del movimiento
     * @param string $modelType Tipo del modelo donde se ejecutó el movimiento
     * @param int|null $modelId ID del modelo donde se ejecutó el movimiento
     * @param int $userId ID del usuario que realizó el movimiento
     * @param string $controllerName Nombre del controlador desde donde se llamó
     * @return array
     */
    public static function inventoryMovement(int $productId, int $quantity, string $modelType, ?int $modelId, int $userId, string $controllerName)
    {
        $productInventory = ProductInventory::where('product_id', $productId)->first();
        $productInventory->stock += $quantity;

        $inventoryMovement = InventoryMovement::create([
            'product_inventory_id' => $productInventory->id,
            'quantity' => $quantity,
            'type' => $quantity > 0 ? 'ingress' : 'egress',
            'model_type' => $modelType,
            'model_id' => $modelId,
            'user_id' => $userId,
            'controller_name' => $controllerName,
        ]);

        $productInventory->save();

        return [$productInventory, $inventoryMovement];
    }
}

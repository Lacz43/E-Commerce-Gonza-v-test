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
     * @param Model $model Modelo donde se ejecutó el movimiento
     * @param int $userId ID del usuario que realizó el movimiento
     * @param string $controllerName Nombre del controlador desde donde se llamó
     * @return array
     */
    public function inventoryMovement(int $productId, int $quantity, Model $model, int $userId, string $controllerName)
    {
        $productInventory = ProductInventory::where('product_id', $productId)->first();
        $productInventory->stock += $quantity;

        $inventoryMovement = InventoryMovement::create([
            'product_inventory_id' => $productInventory->id,
            'quantity' => $quantity,
            'type' => $quantity > 0 ? 'ingress' : 'egress',
            'model_type' => get_class($model),
            'model_id' => $model->id,
            'user_id' => $userId,
            'controller_name' => $controllerName,
        ]);

        $productInventory->save();

        return [$productInventory, $inventoryMovement];
    }
}

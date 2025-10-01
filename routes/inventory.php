<?php

use App\Http\Controllers\InventoryMovementController;
use App\Http\Controllers\ProductInventoryController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'permission:show product_inventory')
    ->get('/inventory/index', [ProductInventoryController::class, 'index'])
    ->name('inventory.index');

Route::middleware('auth', 'permission:edit product_inventory')
    ->put('/inventory/update/{product}', [ProductInventoryController::class, 'update'])
    ->name('inventory.update');

Route::middleware('auth', 'permission:edit product_inventory')
    ->post('/inventory/store', [ProductInventoryController::class, 'store'])
    ->name('inventory.store');

Route::middleware('auth', 'permission:show product_inventory')
    ->get('/inventory/movements', [InventoryMovementController::class, 'index'])
    ->name('inventory.movements.index');

Route::middleware('auth', 'permission:show product_inventory')
    ->get('/inventory/movements/{movement}', [InventoryMovementController::class, 'show'])
    ->name('inventory.movements.show');

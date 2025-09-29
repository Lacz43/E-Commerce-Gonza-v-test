<?php

use App\Http\Controllers\ProductInventoryController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'permission:show product_inventory')
    ->get('/inventory', [ProductInventoryController::class, 'index'])
    ->name('inventory.index');

Route::middleware('auth', 'permission:edit product_inventory')
    ->put('/inventory/update/{product}', [ProductInventoryController::class, 'update'])
    ->name('inventory.update');

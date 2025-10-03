<?php

use App\Http\Controllers\OrdersController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin|seller'])->group(function () {
    Route::get('/orders/index', [OrdersController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrdersController::class, 'show'])->name('orders.show');
    Route::put('/orders/{order}', [OrdersController::class, 'update'])->name('orders.update');
});

Route::post('/order/store', [OrdersController::class, 'store'])->name('order.store');
<?php

use App\Http\Controllers\OrdersController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/orders', [OrdersController::class, 'index'])->name('orders.index');
});

Route::post('/order/store', [OrdersController::class, 'store'])->name('order.store');
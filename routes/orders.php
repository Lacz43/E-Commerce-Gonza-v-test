<?php

use App\Http\Controllers\OrdersController;
use Illuminate\Support\Facades\Route;

Route::post('/order/store', [OrdersController::class, 'store'])->name('order.store');
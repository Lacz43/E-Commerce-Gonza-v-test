<?php

use App\Http\Controllers\MetricsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'role:admin')->group(function () {
    Route::get('/metrics/products', [MetricsController::class, 'getProductMetrics'])->name('metrics.products');
    Route::get('/metrics/orders', [MetricsController::class, 'getOrderMetrics'])->name('metrics.orders');
    Route::get('/metrics/dashboard', [MetricsController::class, 'dashboard'])->name('metrics.dashboard');
});

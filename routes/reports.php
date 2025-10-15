<?php

use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'role:admin')
    ->get('/reports', [ReportController::class, 'index'])
    ->name('reports.index');

Route::middleware('auth', 'permission:show product_inventory')
    ->get('/reports/movements/{movement}/download', [ReportController::class, 'downloadMovement'])
    ->name('reports.movements.download');

Route::middleware('auth', 'role:admin')
    ->get('/reports/products/download', [ReportController::class, 'downloadProductsReport'])
    ->name('reports.products.download');

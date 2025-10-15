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
    ->get('/reports/inventory/status/download', [ReportController::class, 'downloadInventoryStatus'])
    ->name('reports.inventory.status');

Route::middleware('auth', 'role:admin')
    ->get('/reports/inventory/low-stock/download', [ReportController::class, 'downloadLowStockReport'])
    ->name('reports.inventory.low-stock');

Route::middleware('auth', 'role:admin')
    ->get('/reports/sales/orders/download', [ReportController::class, 'downloadSalesOrders'])
    ->name('reports.sales.orders');

Route::middleware('auth', 'role:admin')
    ->get('/reports/sales/analysis/download', [ReportController::class, 'downloadSalesAnalysis'])
    ->name('reports.sales.analysis');

Route::middleware('auth', 'role:admin')
    ->get('/reports/sales/top-products/download', [ReportController::class, 'downloadTopProducts'])
    ->name('reports.sales.top-products');

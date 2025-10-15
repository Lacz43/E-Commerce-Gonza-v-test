<?php

use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'permission:show reports')->group(function () {
    Route::get('/reports/sales', [ReportController::class, 'sales'])
        ->name('reports.sales');

    Route::get('/reports/inventory', [ReportController::class, 'inventory'])
        ->name('reports.inventory');

    Route::get('/reports/movements', [ReportController::class, 'movements'])
        ->name('reports.movements');
});

Route::middleware('auth', 'permission:show reports')->group(function () {
    Route::get('/reports/movements/all/download', [ReportController::class, 'downloadMovementsAll'])
        ->name('reports.movements.all');

    Route::get('/reports/inventory/status/download', [ReportController::class, 'downloadInventoryStatus'])
        ->name('reports.inventory.status');

    Route::get('/reports/inventory/low-stock/download', [ReportController::class, 'downloadLowStockReport'])
        ->name('reports.inventory.low-stock');

    Route::get('/reports/sales/orders/download', [ReportController::class, 'downloadSalesOrders'])
        ->name('reports.sales.orders');

    Route::get('/reports/sales/analysis/download', [ReportController::class, 'downloadSalesAnalysis'])
        ->name('reports.sales.analysis');

    Route::get('/reports/sales/top-products/download', [ReportController::class, 'downloadTopProducts'])
        ->name('reports.sales.top-products');
});

Route::middleware('auth', 'permission:show product_inventory')
    ->get('/reports/movements/{movement}/download', [ReportController::class, 'downloadMovement'])
    ->name('reports.movements.download');

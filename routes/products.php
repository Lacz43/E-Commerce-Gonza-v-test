<?php

use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'permission:show products')->get('/products/index', [ProductsController::class, 'index'])->name('products.index');

Route::middleware('auth', 'permission:create products')->group(function () {
    Route::get('/products/create', [ProductsController::class, 'create'])->name('products.create');
    Route::post('/products/storage', [ProductsController::class, 'storage'])->name('products.storage');
});

Route::get('/products', [ProductsController::class, 'products'])->name('products');
Route::get('/products/categories', [ProductCategoryController::class, 'categories'])->name('products.categories');

<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'permission:show products')->get('/products/index', [ProductsController::class, 'index'])->name('products.index');
Route::middleware('auth', 'permission:delete products')->delete('/products/delete/{product}', [ProductsController::class, 'destroy'])->name('products.delete');

Route::middleware('auth', 'permission:create products')->group(function () {
    Route::get('/products/create', [ProductsController::class, 'create'])->name('products.create');
    Route::post('/products/storage', [ProductsController::class, 'storage'])->name('products.storage');
});

Route::middleware('auth', 'permission:edit products')->group(function () {
    Route::get('/products/edit/{product}', [ProductsController::class, 'edit'])->name('products.edit');
    //Route::patch('/products/update/{product}', [ProductsController::class, 'update'])->name('products.update');
});

Route::middleware('auth', 'permission:show product_categories')
    ->get('/products/categories/index', [ProductCategoryController::class, 'index'])
    ->name('products.categories.index');

Route::get('/products', [ProductsController::class, 'products'])->name('products');
Route::get('/products/categories', [ProductCategoryController::class, 'categories'])->name('products.categories');
Route::get('/products/brands', [BrandController::class, 'brands'])->name('products.brands');

<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\ProductCategoryController;
use App\Http\Controllers\ProductInventoryController;
use App\Http\Controllers\ProductsController;
use App\Models\ProductInventory;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Contracts\Role;

Route::middleware('auth', 'permission:show products')->get('/products/index', [ProductsController::class, 'index'])->name('products.index');
Route::middleware('auth', 'permission:delete products')->delete('/products/delete/{product}', [ProductsController::class, 'destroy'])->name('products.delete');

Route::middleware('auth', 'permission:create products')->group(function () {
    Route::get('/products/create', [ProductsController::class, 'create'])->name('products.create');
    Route::post('/products/storage', [ProductsController::class, 'storage'])->name('products.storage');
});

Route::middleware('auth', 'permission:edit products')->group(function () {
    Route::get('/products/edit/{product}', [ProductsController::class, 'edit'])->name('products.edit');
    Route::patch('/products/update/{product}', [ProductsController::class, 'update'])->name('products.update');
});

Route::middleware('auth', 'permission:show product_categories')
    ->get('/products/categories/index', [ProductCategoryController::class, 'index'])
    ->name('products.categories.index');

Route::middleware('auth', 'permission:delete product_categories')
    ->delete('/products/categories/delete/{category}', [ProductCategoryController::class, 'destroy'])
    ->name('products.categories.delete');

Route::middleware('auth', 'permission:create product_categories')
    ->post('/products/categories/store', [ProductCategoryController::class, 'store'])
    ->name('products.categories.store');

Route::middleware('auth', 'permission:edit product_categories')
    ->patch('/products/categories/update/{category}', [ProductCategoryController::class, 'update'])
    ->name('products.categories.update');

Route::middleware('auth', 'permission:show product_brands')
    ->get('/products/brands/index', [BrandController::class, 'index'])
    ->name('products.brands.index');

Route::middleware('auth', 'permission:delete product_brands')
    ->delete('/products/brands/delete/{brand}', [BrandController::class, 'destroy'])
    ->name('products.brands.delete');

Route::middleware('auth', 'permission:create product_brands')
    ->post('/products/brands/store', [BrandController::class, 'store'])
    ->name('products.brands.store');

Route::middleware('auth', 'permission:edit product_brands')
    ->patch('/products/brands/update/{brand}', [BrandController::class, 'update'])
    ->name('products.brands.update');

Route::get('/products', [ProductsController::class, 'products'])->name('products');
Route::get('/products/categories', [ProductCategoryController::class, 'categories'])->name('products.categories');
Route::get('/products/brands', [BrandController::class, 'brands'])->name('products.brands');

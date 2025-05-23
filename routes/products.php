<?php

use App\Http\Controllers\ProductsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'permission:show products')->get('/products/index', [ProductsController::class, 'index'])->name('products.index');

Route::middleware('auth', 'permission:create products')->get('/products/create', [ProductsController::class, 'create'])->name('products.create');

Route::get('/products', [ProductsController::class, 'products'])->name('products');

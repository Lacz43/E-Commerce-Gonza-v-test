<?php

use App\Http\Controllers\ProductsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'permission:show products')->get('/products/index', [ProductsController::class, 'index'])->name('products.index');

Route::get('/products', [ProductsController::class, 'products'])->name('products');

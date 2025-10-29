<?php

use App\Http\Controllers\PaymentMethodsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'permission:edit settings')->group(function () {
    Route::get('/settings/payment-methods', [PaymentMethodsController::class, 'index'])->name('payment-methods.index');
    Route::post('/settings/payment-methods', [PaymentMethodsController::class, 'store'])->name('payment-methods.store');
    Route::put('/settings/payment-methods/{paymentMethod}', [PaymentMethodsController::class, 'update'])->name('payment-methods.update');
    Route::delete('/settings/payment-methods/{paymentMethod}', [PaymentMethodsController::class, 'destroy'])->name('payment-methods.destroy');
    Route::post('/settings/payment-methods/{paymentMethod}/toggle', [PaymentMethodsController::class, 'toggle'])->name('payment-methods.toggle');
});

// Ruta pública para obtener métodos de pago activos
Route::get('/payment-methods/active', [PaymentMethodsController::class, 'getActiveMethods'])->name('payment-methods.active');

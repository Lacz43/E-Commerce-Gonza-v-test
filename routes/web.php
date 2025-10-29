<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

Route::get('/dashboard', function () {
    $user = Auth::user();

    // Si el usuario tiene el rol 'seller', redirigir a pedidos
    if ($user->hasRole('seller')) {
        return redirect()->route('orders.index');
    }

    // Si el usuario no tiene roles específicos, redirigir a sus pedidos
    if ($user->roles->isEmpty()) {
        return redirect()->route('user.orders');
    }

    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
require __DIR__.'/products.php';
require __DIR__.'/inventory.php';
require __DIR__.'/user.php';
require __DIR__.'/settings.php';
require __DIR__.'/attachments.php';
require __DIR__.'/orders.php';
require __DIR__.'/metrics.php';
require __DIR__.'/reports.php';
require __DIR__.'/payment_methods.php';

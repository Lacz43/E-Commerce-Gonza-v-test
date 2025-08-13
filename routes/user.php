<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'role:admin')->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/roles', [UserController::class, 'roles'])->name('roles');
});

Route::middleware('auth', 'permission:delete users')->delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

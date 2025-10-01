<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'role:admin')->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/roles', [UserController::class, 'roles'])->name('roles');
    Route::get('/users/activities', [ActivityController::class, 'index'])->name('users.activities');
    Route::get('/users/sessions', [SessionController::class, 'index'])->name('users.sessions');
});

Route::middleware('auth')->get('/permissions', [UserController::class, 'permissions'])->name('user.permissions');

Route::middleware('auth', 'permission:delete users')->delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

Route::middleware('auth', 'permission:create users')->post('/users', [UserController::class, 'store'])->name('users.store');
Route::middleware('auth', 'permission:edit users')->match(['put','patch'],'/users/{user}', [UserController::class, 'update'])->name('users.update');

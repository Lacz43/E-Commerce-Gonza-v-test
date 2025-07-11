<?php

use App\Http\Controllers\BackupAndRestoreController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'permission:show settings')->group(function () {
    Route::get('/settings/index', [BackupAndRestoreController::class, 'index'])->name('backup.index');
    Route::post('/settings/backup', [BackupAndRestoreController::class, 'triggerBackup'])->name('backup.trigger');
});

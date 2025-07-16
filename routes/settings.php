<?php

use App\Http\Controllers\BackupAndRestoreController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'permission:show settings')->group(function () {
    Route::get('/settings/backup/index', [BackupAndRestoreController::class, 'index'])->name('backup.index');
    Route::post('/settings/backup', [BackupAndRestoreController::class, 'triggerBackup'])->name('backup.trigger');
    Route::get('/settings/backup/download/{file}', [BackupAndRestoreController::class, 'download'])->name('backup.download');
    Route::post('/settings/backup/restore', [BackupAndRestoreController::class, 'restoreBackup'])->name('backup.restore');
});

Route::middleware('auth', 'permission:delete settings')->group(function () {
    Route::delete('/settings/backup/delete', [BackupAndRestoreController::class, 'destroy'])->name('backup.delete');
});

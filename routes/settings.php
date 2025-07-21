<?php

use App\Http\Controllers\BackupAndRestoreController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth', 'permission:show backups')->group(function () {
    Route::get('/settings/backup/index', [BackupAndRestoreController::class, 'index'])->name('backup.index');
    Route::get('/settings/backup/download/{file}', [BackupAndRestoreController::class, 'download'])->name('backup.download');
    Route::get('/settings/backup', [BackupAndRestoreController::class, 'backupSettings'])->name('backup.settings');
});

Route::middleware('auth', 'permission:create backups')->group(function () {
    Route::post('/settings/backup', [BackupAndRestoreController::class, 'triggerBackup'])->name('backup.trigger');
    Route::post('/settings/backup/restore', [BackupAndRestoreController::class, 'restoreBackup'])->name('backup.restore');
});

Route::middleware('auth', 'permission:edit backups')->group(function () {
    Route::post('/settings/backup/toggle', [BackupAndRestoreController::class, 'toggleBackup'])->name('backup.toggle');
});

Route::middleware('auth', 'permission:delete backups')->group(function () {
    Route::delete('/settings/backup/delete', [BackupAndRestoreController::class, 'destroy'])->name('backup.delete');
});

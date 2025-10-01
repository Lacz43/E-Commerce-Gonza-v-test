<?php

use App\Http\Controllers\AttachmentsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])
    ->get('/attachments/inventory-movement/{id}/download', [AttachmentsController::class, 'downloadInventoryMovementAttachment'])
    ->name('attachments.downloadInventoryMovementAttachment');

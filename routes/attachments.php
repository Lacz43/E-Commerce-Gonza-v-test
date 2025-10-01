<?php

use App\Http\Controllers\AttachmentsController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])
    ->get('/attachments/{id}/download', [AttachmentsController::class, 'download'])
    ->name('attachments.download');

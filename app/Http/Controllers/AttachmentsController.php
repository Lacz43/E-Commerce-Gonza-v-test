<?php

namespace App\Http\Controllers;

use App\Services\AttachmentService;
use Illuminate\Http\Request;

class AttachmentsController extends Controller
{
    /**
     * Descarga un archivo adjunto.
     */
    public function downloadInventoryMovementAttachment($id)
    {
        $response = AttachmentService::downloadFile($id, disk: 'local');

        if (!$response) {
            abort(404, 'Archivo no encontrado');
        }

        return $response;
    }
}

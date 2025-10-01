<?php

namespace App\Http\Controllers;

use App\Services\AttachmentService;
use Illuminate\Http\Request;

class AttachmentsController extends Controller
{
    /**
     * Descarga un archivo adjunto.
     */
    public function download($id)
    {
        $response = AttachmentService::downloadFile($id);

        if (!$response) {
            abort(404, 'Archivo no encontrado');
        }

        return $response;
    }
}

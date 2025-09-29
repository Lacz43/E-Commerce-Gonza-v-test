<?php

namespace App\Services;

use App\Models\Attachment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\File;

class AttachmentService
{
    /**
     * Adjunta un archivo a un modelo polimórfico.
     *
     * @param UploadedFile $file Archivo subido
     * @param Model $attachable Modelo al que se adjuntará el archivo
     * @param string|null $path Ruta personalizada para almacenar el archivo
     * @param string $disk Disco de almacenamiento (por defecto 'public')
     * @return Attachment
     */
    public static function attachFile(UploadedFile $file, Model $attachable, ?string $path = null, string $disk = 'public'): Attachment
    {
        // Validar el archivo
        Validator::validate(['attachment' => $file], [
            'attachment' => [
                'required',
                File::types([
                    'jpeg',
                    'jpg',
                    'png',
                    'pdf',
                    'doc',
                    'docx',
                    'xlsx',
                    'xls',
                    'csv',
                    'mp3',
                    'wav'
                ])
                    ->max(12 * 1024),
            ],
        ]);

        // Generar nombre único para el archivo
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $fileName = Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '_' . time() . '.' . $extension;

        // Ruta de almacenamiento
        $storagePath = $path ? trim($path, '/') . '/' . $fileName : 'attachments/' . $fileName;

        // Almacenar el archivo
        $storedPath = $file->storeAs($path ?: 'attachments', $fileName, $disk);

        // Crear el registro en la base de datos
        return $attachable->attachments()->create([
            'file_name' => $originalName,
            'file_path' => $storedPath,
            'mime_type' => $file->getMimeType(),
            'file_size' => $file->getSize(),
        ]);
    }

    /**
     * Desadjunta un archivo y lo elimina del almacenamiento.
     *
     * @param int $attachmentId ID del adjunto
     * @param string $disk Disco de almacenamiento (por defecto 'public')
     * @return bool
     */
    public static function detachFile(int $attachmentId, string $disk = 'public'): bool
    {
        $attachment = Attachment::find($attachmentId);

        if (!$attachment) {
            return false;
        }

        // Eliminar el archivo del almacenamiento
        if (Storage::disk($disk)->exists($attachment->file_path)) {
            Storage::disk($disk)->delete($attachment->file_path);
        }

        // Eliminar el registro de la base de datos
        return $attachment->delete();
    }

    /**
     * Obtiene todos los adjuntos de un modelo.
     *
     * @param Model $attachable Modelo del que obtener adjuntos
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getAttachments(Model $attachable)
    {
        return $attachable->attachments;
    }

    /**
     * Obtiene la URL del archivo adjunto.
     *
     * @param Attachment $attachment
     * @param string $disk Disco de almacenamiento (por defecto 'public')
     * @return string
     */
    public static function getFileUrl(Attachment $attachment, string $disk = 'public'): string
    {
        return Storage::disk($disk)->url($attachment->file_path);
    }

    /**
     * Descarga un archivo adjunto.
     *
     * @param int $attachmentId ID del adjunto
     * @param string $disk Disco de almacenamiento (por defecto 'public')
     * @return \Symfony\Component\HttpFoundation\StreamedResponse|null
     */
    public static function downloadFile(int $attachmentId, string $disk = 'public')
    {
        $attachment = Attachment::find($attachmentId);

        if (!$attachment || !Storage::disk($disk)->exists($attachment->file_path)) {
            return null;
        }

        return Storage::disk($disk)->download($attachment->file_path, $attachment->file_name);
    }
}

<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImageService
{
    /**
     * Convierte una imagen a formato PNG optimizado.
     *
     * @param UploadedFile $file Archivo de imagen subido
     * @param int $quality Calidad de compresión (0-100, por defecto 90)
     * @param string $disk Disco de almacenamiento (por defecto 'public')
     * @return array Información del archivo convertido
     */
    public static function convertToOptimizedPng(UploadedFile $file, int $quality = 90, string $disk = 'public'): array
    {
        // Validar que sea una imagen
        $allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
        if (!in_array($file->getMimeType(), $allowedMimes)) {
            throw new \InvalidArgumentException('El archivo debe ser una imagen válida.');
        }

        // Generar nombre único para el archivo
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $fileName = Str::slug($originalName) . '_' . time() . '.png';

        // Procesar la imagen con Intervention Image
        $manager = new ImageManager(new Driver());
        $image = $manager->read($file);

        // Convertir a PNG optimizado
        $encodedImage = $image->toPng();

        // Almacenar la imagen convertida
        $path = 'optimized-images/' . $fileName;
        Storage::disk($disk)->put($path, $encodedImage);

        return [
            'original_name' => $file->getClientOriginalName(),
            'file_name' => $fileName,
            'file_path' => $path,
            'mime_type' => 'image/png',
            'file_size' => strlen((string) $encodedImage),
            'original_size' => $file->getSize(),
            'url' => Storage::disk($disk)->url($path),
        ];
    }

    /**
     * Convierte múltiples imágenes a PNG optimizado.
     *
     * @param array $files Array de archivos UploadedFile
     * @param int $quality Calidad de compresión (0-100, por defecto 90)
     * @param string $disk Disco de almacenamiento (por defecto 'public')
     * @return array Array con información de los archivos convertidos
     */
    public static function convertMultipleToOptimizedPng(array $files, int $quality = 90, string $disk = 'public'): array
    {
        $results = [];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                $results[] = self::convertToOptimizedPng($file, $quality, $disk);
            }
        }

        return $results;
    }

    /**
     * Convierte una imagen desde una ruta existente a PNG optimizado.
     *
     * @param string $inputPath Ruta del archivo de entrada
     * @param string|null $outputPath Ruta del archivo de salida (opcional)
     * @param int $quality Calidad de compresión (0-100, por defecto 90)
     * @param string $disk Disco de almacenamiento (por defecto 'public')
     * @return array Información del archivo convertido
     */
    public static function convertPathToOptimizedPng(string $inputPath, ?string $outputPath = null, int $quality = 90, string $disk = 'public'): array
    {
        if (!Storage::disk($disk)->exists($inputPath)) {
            throw new \InvalidArgumentException('El archivo de entrada no existe.');
        }

        // Generar ruta de salida si no se proporciona
        if (!$outputPath) {
            $fileName = pathinfo($inputPath, PATHINFO_FILENAME) . '_optimized_' . time() . '.png';
            $outputPath = 'optimized-images/' . $fileName;
        }

        // Procesar la imagen
        $manager = new ImageManager(new Driver());
        $image = $manager->read(Storage::disk($disk)->get($inputPath));
        $encodedImage = $image->toPng();

        // Almacenar la imagen convertida
        Storage::disk($disk)->put($outputPath, $encodedImage);

        return [
            'original_path' => $inputPath,
            'file_path' => $outputPath,
            'mime_type' => 'image/png',
            'file_size' => strlen((string) $encodedImage),
            'url' => Storage::disk($disk)->url($outputPath),
        ];
    }

    /**
     * Optimiza una imagen PNG existente reduciendo su calidad.
     *
     * @param string $filePath Ruta del archivo PNG
     * @param int $quality Calidad de compresión (0-100, por defecto 90)
     * @param string $disk Disco de almacenamiento (por defecto 'public')
     * @return array Información del archivo optimizado
     */
    public static function optimizePng(string $filePath, int $quality = 90, string $disk = 'public'): array
    {
        if (!Storage::disk($disk)->exists($filePath)) {
            throw new \InvalidArgumentException('El archivo PNG no existe.');
        }

        // Verificar que sea PNG
        $mimeType = Storage::disk($disk)->mimeType($filePath);
        if ($mimeType !== 'image/png') {
            throw new \InvalidArgumentException('El archivo debe ser formato PNG.');
        }

        // Procesar la imagen
        $manager = new ImageManager(new Driver());
        $image = $manager->read(Storage::disk($disk)->get($filePath));
        $encodedImage = $image->toPng();

        // Reemplazar el archivo original con la versión optimizada
        Storage::disk($disk)->put($filePath, $encodedImage);

        return [
            'file_path' => $filePath,
            'mime_type' => 'image/png',
            'file_size' => strlen((string) $encodedImage),
            'url' => Storage::disk($disk)->url($filePath),
        ];
    }

    /**
     * Elimina una imagen optimizada.
     *
     * @param string $filePath Ruta del archivo a eliminar
     * @param string $disk Disco de almacenamiento (por defecto 'public')
     * @return bool
     */
    public static function deleteOptimizedImage(string $filePath, string $disk = 'public'): bool
    {
        if (Storage::disk($disk)->exists($filePath)) {
            return Storage::disk($disk)->delete($filePath);
        }

        return false;
    }

    /**
     * Obtiene la URL de una imagen optimizada.
     *
     * @param string $filePath Ruta del archivo
     * @param string $disk Disco de almacenamiento (por defecto 'public')
     * @return string
     */
    public static function getOptimizedImageUrl(string $filePath, string $disk = 'public'): string
    {
        return Storage::disk($disk)->url($filePath);
    }
}

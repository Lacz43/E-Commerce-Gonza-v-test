<?php

namespace App\Models;

use App\Services\ImageService;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class ProductImage extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $fillable = ['image', 'default', 'product_id'];

    public function product(): BelongsTo
    {
        return $this->belongsTo('products', 'product_id', 'id');
    }

    public static function saveImages(int $product_id, array $images, ?int $default)
    {
        foreach ($images as $index => $image) {
            // Convertir y optimizar la imagen a PNG usando ImageService
            $optimizedResult = ImageService::convertToOptimizedPng($image, 90, 'public');
            $path = 'products/' . $product_id . '/' . basename($optimizedResult['file_path']);

            // Mover el archivo optimizado a la ubicación correcta
            \Illuminate\Support\Facades\Storage::disk('public')->move($optimizedResult['file_path'], $path);

            // Función para determinar si es la imagen por defecto
            $defaultImage = function ($index, $default) use ($images) {
                // Verifica que existan imágenes subidas
                $uploadedImages = $images ?? [];

                // Si no hay imágenes usadas o el índice es menor al número de imágenes
                if (empty($default) || $default >= count($uploadedImages)) {
                    return $index == 0; // Asigna como defecto la primera imagen
                }

                // Si el índice coincide con la imagen usada
                return $default == $index;
            };

            // Guardar en la base de datos
            ProductImage::create([
                'product_id' => $product_id,
                'image' => $path,
                'default' => $defaultImage($index, $default),
            ]);
        }

    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['image', 'default', 'product_id'])
            ->logOnlyDirty()
            ->dontLogIfAttributesChangedOnly(['updated_at']);
    }
}

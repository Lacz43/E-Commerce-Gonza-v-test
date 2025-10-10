<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class ProductCategory extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $fillable = ['name', 'created_by'];

    /**
     * Campos permitidos para filtrado
     */
    public static function getFilterableFields(): array
    {
        return [
            'id',
            'name',
            'created_by',
            'created_at',
            'updated_at',
        ];
    }

    /**
     * Campos permitidos para ordenamiento
     */
    public static function getSortableFields(): array
    {
        return [
            'id',
            'name',
            'created_at',
            'updated_at',
        ];
    }

    /**
     * Campos permitidos para búsqueda
     */
    public static function getSearchableFields(): array
    {
        return [
            'name',
        ];
    }

    public static function createOrReadCategory(string $categoryName)
    {
        $user = Auth::user();

        // Buscar categoría existente por nombre
        $category = ProductCategory::where('name', $categoryName)->orWhere('id', $categoryName)->first();

        if ($category) {
            // Devolver ID si ya existe
            return $category->id;
        }

        // Verificar permiso antes de crear
        if (!$user->hasPermissionTo("create product_categories")) {
            return null;
        }

        // Crear nueva categoría
        $category = ProductCategory::create([
            'name' => $categoryName,
            'created_by' => $user->id,
        ]);

        return $category->id;
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logOnlyDirty();
    }
}

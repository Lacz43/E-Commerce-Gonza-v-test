<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class ProductCategory extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'created_by'];

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
}

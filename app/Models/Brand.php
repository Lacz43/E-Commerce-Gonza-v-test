<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Brand extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $fillable = ['name', 'created_by'];

    public static function createOrReadBrand(string $brandName)
    {
        $user = Auth::user();

        // Buscar marca existente por nombre (sin considerar el creador)
        $brand = Brand::where('name', $brandName)->orWhere('id', $brandName)->first();

        if ($brand) {
            // Marca existente: devolver su ID
            return $brand->id;
        }

        // Si no existe, verificar permiso antes de crear
        if (!$user->hasPermissionTo("create product_brands")) {
            return null; // No se puede crear, pero no se devuelve error
        }

        // Crear nueva marca con el creador actual
        $brand = Brand::create([
            'name' => $brandName,
            'created_by' => $user->id,
        ]);

        return $brand->id;
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logOnlyDirty();
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class ProductInventory extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'product_id',
        'stock',
    ];

    /**
     * Campos permitidos para filtrado
     */
    public static function getFilterableFields(): array
    {
        return [
            'id',
            'product_id',
            'stock',
            'created_at',
            'updated_at',
            'product',
            'product.name',
        ];
    }

    /**
     * Campos permitidos para ordenamiento
     */
    public static function getSortableFields(): array
    {
        return [
            'id',
            'product_id',
            'stock',
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
            'product.name',
            'product'
        ];
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['product_id', 'stock'])
            ->logOnlyDirty()
            ->dontLogIfAttributesChangedOnly(['updated_at'])
            ->useLogName('inventory');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class OrderItem extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $fillable = ['order_id', 'product_id', 'quantity', 'price'];

    protected $casts = [
        'quantity' => 'integer',
        'price' => 'decimal:2',
    ];

    /**
     * Campos permitidos para filtrado
     */
    public static function getFilterableFields(): array
    {
        return [
            'id',
            'order_id',
            'product_id',
            'quantity',
            'price',
            'created_at',
            'updated_at',
            'order',
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
            'order_id',
            'product_id',
            'quantity',
            'price',
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
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['order_id', 'product_id', 'quantity', 'price'])
            ->logOnlyDirty()
            ->dontLogIfAttributesChangedOnly(['updated_at']);
    }
}

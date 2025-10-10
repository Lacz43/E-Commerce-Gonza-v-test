<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class InventoryMovement extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $fillable = [
        'product_inventory_id',
        'quantity',
        'previous_stock',
        'type',
        'model_type',
        'model_id',
        'user_id',
        'controller_name',
    ];

    public function productInventory(): BelongsTo
    {
        return $this->belongsTo(ProductInventory::class);
    }

    public function model(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function attachments()
    {
        return $this->morphMany(Attachment::class, 'attachable');
    }

    /**
     * Campos permitidos para filtrado
     */
    public static function getFilterableFields(): array
    {
        return [
            'id',
            'quantity',
            'previous_stock',
            'type',
            'created_at',
            'product_inventory',
            'product_inventory.product.name',
            'user', // Relación permitida
            'user.name',
            'product_inventory.product',
            'model_type',
        ];
    }

    /**
     * Relaciones permitidas para filtrado
     */
    public static function getFilterableRelations(): array
    {
        return [
            'product_inventory',
            'user',
        ];
    }

    /**
     * Campos permitidos para ordenamiento
     */
    public static function getSortableFields(): array
    {
        return [
            'id',
            'quantity',
            'previous_stock',
            'type',
            'created_at',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['product_inventory_id', 'quantity', 'previous_stock', 'type', 'model_type', 'model_id', 'user_id', 'controller_name'])
            ->logOnlyDirty()
            ->dontLogIfAttributesChangedOnly(['updated_at']);
    }
}

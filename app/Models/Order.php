<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Order extends Model
{
    use HasFactory;
    use \App\Models\Traits\FilterableAndSortable;
    use LogsActivity;

    protected $fillable = ['user_id', 'status'];

    protected $casts = [
        'status' => 'string',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public static function getStatus(): array
    {
        return [
            'cancelled' => 'Cancelado',
            'pending' => 'Pendiente',
            'expired' => 'Expirado',
            'completed' => 'Completado',
            'paid' => 'Pagado',
        ];
    }

    public static function getFilterableFields(): array
    {
        return [
            'id',
            'status',
            'user',
            'created_at',
        ];
    }

    public static function getSortableFields(): array
    {
        return [
            'id',
            'status',
            'created_at',
        ];
    }

    public static function getSearchableFields(): array
    {
        return [
            'id',
            'status',
            'user.name',
        ];
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['user_id', 'status'])
            ->logOnlyDirty()
            ->dontLogIfAttributesChangedOnly(['updated_at']);
    }
}

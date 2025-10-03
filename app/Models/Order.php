<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;
    use \App\Models\Traits\FilterableAndSortable;

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
}

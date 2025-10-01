<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Session extends Model
{
    protected $table = 'sessions';

    public $timestamps = false;

    protected $fillable = [
        'id',
        'user_id',
        'ip_address',
        'user_agent',
        'payload',
        'last_activity',
    ];

    protected $casts = [
        'last_activity' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Campos permitidos para filtrado
     */
    public static function getFilterableFields(): array
    {
        return [
            'id',
            'user_id',
            'ip_address',
            'user_agent',
            'last_activity',
            'user.name',
        ];
    }

    /**
     * Campos permitidos para ordenamiento
     */
    public static function getSortableFields(): array
    {
        return [
            'id',
            'last_activity',
            'user_id',
        ];
    }
}

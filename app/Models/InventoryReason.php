<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryReason extends Model
{
    use HasFactory;

    protected $fillable = [
        'movement_id',
        'name',
        'description',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function movement()
    {
        return $this->belongsTo(InventoryMovement::class);
    }
}

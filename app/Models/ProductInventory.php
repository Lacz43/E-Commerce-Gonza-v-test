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

    public function product()
    {
        return $this->belongsTo(Products::class);
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logOnlyDirty();
    }
}

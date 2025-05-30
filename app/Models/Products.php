<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Products extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'barcode', 'category_id', 'description', 'price'];

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class, 'product_id', 'id');
    }

    public function defaultImage(): HasOne
    {
        return $this->hasOne(ProductImage::class, 'product_id', 'id')->where('default', true);
    }
}

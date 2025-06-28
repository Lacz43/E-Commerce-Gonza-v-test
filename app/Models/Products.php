<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Products extends Model
{
    use HasFactory;
    use LogsActivity;

    protected $fillable = ['name', 'barcode', 'category_id', 'description', 'price'];

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class, 'product_id', 'id');
    }

    public function defaultImage(): HasOne
    {
        return $this->hasOne(ProductImage::class, 'product_id', 'id')->where('default', true);
    }

    public function brand(): HasOne
    {
        return $this->hasOne(ProductBrand::class, 'product_id', 'id');
    }

    public function category(): HasOne
    {
        return $this->hasOne(ProductCategory::class, 'id', 'category_id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logOnlyDirty();
    }
}

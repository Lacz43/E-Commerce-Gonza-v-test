<?php

namespace App\Models;

use App\Models\Traits\FilterableAndSortable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasOneThrough;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Product extends Model
{
    use HasFactory;
    use LogsActivity;
    use FilterableAndSortable;

    protected $fillable = ['name', 'barcode', 'category_id', 'description', 'price'];

    public static function getFilterableFields(): array
    {
        return ['id', 'name', 'barcode', 'category_id', 'price', 'description'];
    }

    public static function getSortableFields(): array
    {
        return ['id', 'name', 'barcode', 'category_id', 'price'];
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class, 'product_id', 'id');
    }

    public function defaultImage(): HasOne
    {
        return $this->hasOne(ProductImage::class, 'product_id', 'id')->where('default', true);
    }

    public function brand(): HasOneThrough
    {
        return $this->hasOneThrough(Brand::class, ProductBrand::class, 'product_id', 'id', 'id', 'brand_id');
    }

    public function productBrand(): HasOne
    {
        return $this->hasOne(ProductBrand::class, 'product_id', 'id');
    }

    public function category(): HasOne
    {
        return $this->hasOne(ProductCategory::class, 'id', 'category_id');
    }

    public function productInventory(): HasOne
    {
        return $this->hasOne(ProductInventory::class, 'product_id', 'id');
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logOnlyDirty();
    }
}

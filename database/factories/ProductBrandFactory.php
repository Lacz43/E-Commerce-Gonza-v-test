<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\ProductBrand;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ProductBrandFactory extends Factory
{
    protected $model = ProductBrand::class;

    public function definition()
    {
        return [
            'brand_id' => Brand::inRandomOrder()->first()->id,
        ];
    }
}

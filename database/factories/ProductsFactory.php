<?php

namespace Database\Factories;

use App\Models\ProductBrand;
use App\Models\ProductCategory;
use App\Models\ProductImage;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class ProductsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'barcode' => $this->faker->unique()->numberBetween(000000000000000, 9999999999999),
            'category_id' => ProductCategory::inRandomOrder()->first()->id,
            'description' => $this->faker->text(),
            'price' => $this->faker->randomFloat(2, 60, 600),
        ];
    }

    public function withImages(int $count = 3)
    {
        return $this->has(ProductImage::factory()->count($count), 'images');
    }

    public function withBrands()
    {
        return $this->has(ProductBrand::factory(), 'productBrand');
    }
}

<?php

namespace Database\Factories;

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
            'name' => $this->faker->word(),
            'image' => 'https://picsum.photos/' . $this->faker->numberBetween(400, 800) . '/' . $this->faker->numberBetween(300, 600),
            'barcode' => $this->faker->unique()->numberBetween(000000000000000, 9999999999999),
            'description' => $this->faker->text(),
            'price' => $this->faker->randomFloat(2, 60, 600),
        ];
    }
}

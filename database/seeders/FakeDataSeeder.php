<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\ProductCategory;
use App\Models\Product;
use Illuminate\Database\Seeder;

class FakeDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([PermissionSeeder::class]);

        $this->call([AdminSeeder::class]);

        ProductCategory::factory()->count(5)->create();
        Brand::factory()->count(10)->create();
        Product::factory()->count(20)->withImages(3)->withBrands()->withInventory()->create();
    }
}

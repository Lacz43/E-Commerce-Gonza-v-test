<?php

namespace Database\Seeders;

use App\Models\ProductCategory;
use App\Models\ProductImage;
use App\Models\ProductImages;
use App\Models\Products;
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
        Products::factory()->count(20)->withImages(3)->create();
    }
}

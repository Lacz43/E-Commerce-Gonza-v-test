<?php

namespace Database\Seeders;

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

        Products::factory()->count(66)->create();
    }
}

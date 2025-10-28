<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class SellerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $role = Role::firstOrCreate(['name' => 'seller']);

        $user = User::factory()->create([
            'name' => 'Seller User',
            'email' => 'seller@example.com',
        ]);

        $user->assignRole($role);
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run(): void
    {
        $modules = config('modules');
        $permissions = config('permission.permissions');
        $roles = config('roles');

        foreach ($permissions as $permission) {
            foreach ($modules as $module) {
                Permission::firstOrCreate(['name' => "{$permission} {$module}"]);
            }
        }

        foreach ($roles as $roleName => $modules) {
            $role = Role::firstOrCreate(['name' => $roleName]);

            $rolePermissions = [];

            foreach ($modules as $module) {
                foreach ($permissions as $permission) {
                    $rolePermissions[] = "{$permission} {$module}";
                }
            }

            $role->syncPermissions($rolePermissions);
        }
    }
}

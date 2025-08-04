<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('backup.active', false);
        $this->migrator->add('backup.schedule', 'daily');
        $this->migrator->add('backup.time', null);
    }
};

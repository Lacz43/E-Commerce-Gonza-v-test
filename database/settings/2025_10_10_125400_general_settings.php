<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.company_name', '');
        $this->migrator->add('general.company_logo', null);
        $this->migrator->add('general.company_phone', null);
        $this->migrator->add('general.company_address', null);
        $this->migrator->add('general.company_rif', null);
        $this->migrator->add('general.company_email', null);
        $this->migrator->add('general.currency', 'VES');
        $this->migrator->add('general.reference_price', null);
    }
};

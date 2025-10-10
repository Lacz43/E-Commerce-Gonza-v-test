<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

/**
 * INFO: GeneralSettings
 * company_name: nombre de la empresa
 * company_logo: ruta del logo de la empresa en storage
 */
class GeneralSettings extends Settings
{
    public string $company_name = '';
    public ?string $company_logo = null;

    public static function group(): string
    {
        return 'general';
    }
}

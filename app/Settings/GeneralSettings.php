<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

/**
 * INFO: GeneralSettings
 * company_name: nombre de la empresa
 * company_logo: ruta del logo de la empresa en storage
 * company_phone: número de teléfono de la empresa
 * company_address: dirección de la empresa
 * company_rif: RIF de la empresa
 * company_email: email de la empresa
 * currency: moneda utilizada (USD o VES)
 * reference_price: precio de referencia (ej. tasa de cambio)
 */
class GeneralSettings extends Settings
{
    public string $company_name = '';
    public ?string $company_logo = null;
    public ?string $company_phone = null;
    public ?string $company_address = null;
    public ?string $company_rif = null;
    public ?string $company_email = null;
    public string $currency = 'USD';

    public static function group(): string
    {
        return 'general';
    }
}

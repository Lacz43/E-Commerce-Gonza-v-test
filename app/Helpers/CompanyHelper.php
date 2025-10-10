<?php

use App\Settings\GeneralSettings;
use Illuminate\Support\Facades\Storage;

if (!function_exists('getCompanySettings')) {
    /**
     * Obtener la configuración general de la empresa
     *
     * @return GeneralSettings
     */
    function getCompanySettings(): GeneralSettings
    {
        return app(GeneralSettings::class);
    }
}

if (!function_exists('getCompanyInfo')) {
    /**
     * Obtener información básica de la empresa para reportes
     *
     * @return array
     */
    function getCompanyInfo(): array
    {
        $settings = getCompanySettings();

        return [
            'name' => $settings->company_name ?? 'Gonza Go',
            'phone' => $settings->company_phone ?? '',
            'address' => $settings->company_address ?? '',
            'rif' => $settings->company_rif ?? '',
            'email' => $settings->company_email ?? '',
            'logo_url' => $settings->company_logo ? Storage::disk('public')->url($settings->company_logo) : null,
        ];
    }
}

if (!function_exists('getCompanyName')) {
    /**
     * Obtener solo el nombre de la empresa
     *
     * @return string
     */
    function getCompanyName(): string
    {
        return getCompanySettings()->company_name ?? 'Gonza Go';
    }
}

if (!function_exists('getCompanyLogoUrl')) {
    /**
     * Obtener la URL del logo de la empresa
     *
     * @return string|null
     */
    function getCompanyLogoUrl(): ?string
    {
        $logo = getCompanySettings()->company_logo;
        return $logo ? Storage::disk('public')->url($logo) : null;
    }
}

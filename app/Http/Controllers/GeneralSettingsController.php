<?php

namespace App\Http\Controllers;

use App\Settings\GeneralSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class GeneralSettingsController extends Controller
{
    /**
     * Display the general settings page.
     */
    public function index()
    {
        $settings = app(GeneralSettings::class);

        return Inertia::render('Settings/General/Index', [
            'settings' => [
                'company_name' => $settings->company_name ?? '',
                'company_logo' => $settings->company_logo ?? null,
                'company_logo_url' => $settings->company_logo ? Storage::disk('public')->url($settings->company_logo) : null,
                'company_phone' => $settings->company_phone ?? '',
                'company_address' => $settings->company_address ?? '',
                'company_rif' => $settings->company_rif ?? '',
                'company_email' => $settings->company_email ?? '',
                'currency' => $settings->currency ?? 'VES',
            ],
        ]);
    }

    /**
     * Get general settings for public use (logo, company name).
     */
    public function getPublicSettings()
    {
        $settings = app(GeneralSettings::class);

        return response()->json([
            'company_name' => $settings->company_name ?? 'Gonza Go',
            'company_logo_url' => $settings->company_logo ? Storage::disk('public')->url($settings->company_logo) : null,
            'company_phone' => $settings->company_phone ?? '',
            'company_address' => $settings->company_address ?? '',
            'company_email' => $settings->company_email ?? '',
            'currency' => $settings->currency ?? 'VES',
        ]);
    }

    /**
     * Update general settings including company logo.
     */
    public function update(Request $request, GeneralSettings $settings)
    {
        $request->validate([
            'company_name' => 'nullable|string|max:255',
            'company_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048', // 2MB max
            'company_phone' => 'nullable|string|max:20',
            'company_address' => 'nullable|string|max:500',
            'company_rif' => 'nullable|string|max:20',
            'company_email' => 'nullable|email|max:255',
            'currency' => 'required|string|in:USD,VES',
        ]);

        $oldSettings = [
            'company_name' => $settings->company_name,
            'company_logo' => $settings->company_logo,
            'company_phone' => $settings->company_phone,
            'company_address' => $settings->company_address,
            'company_rif' => $settings->company_rif,
            'company_email' => $settings->company_email,
            'currency' => $settings->currency,
        ];

        // Handle company logo upload
        if ($request->hasFile('company_logo')) {
            // Delete old logo if exists
            if ($settings->company_logo && Storage::disk('public')->exists($settings->company_logo)) {
                Storage::disk('public')->delete($settings->company_logo);
            }

            // Store new logo
            $logoPath = $request->file('company_logo')->store('logos', 'public');
            $settings->company_logo = $logoPath;
        }

        // Update company fields
        $settings->company_name = $request->company_name ?? '';
        $settings->company_phone = $request->company_phone ?? null;
        $settings->company_address = $request->company_address ?? null;
        $settings->company_rif = $request->company_rif ?? null;
        $settings->company_email = $request->company_email ?? null;
        $settings->currency = $request->currency;

        $settings->save();

        // Registrar la actividad de actualización de configuración
        $user = Auth::user();
        $changes = [];

        // Check each field for changes
        $fieldsToCheck = [
            'company_name', 'company_phone', 'company_address',
            'company_rif', 'company_email', 'currency'
        ];

        foreach ($fieldsToCheck as $field) {
            if ($oldSettings[$field] !== $settings->$field) {
                $changes[$field] = [
                    'old' => $oldSettings[$field],
                    'new' => $settings->$field,
                ];
            }
        }

        if ($oldSettings['company_logo'] !== $settings->company_logo) {
            $changes['company_logo'] = [
                'old' => $oldSettings['company_logo'],
                'new' => $settings->company_logo,
                'uploaded' => $request->hasFile('company_logo'),
            ];
        }

        Activity::create([
            'log_name' => 'settings',
            'description' => 'Configuración general actualizada',
            'subject_type' => null,
            'subject_id' => null,
            'causer_type' => 'App\Models\User',
            'causer_id' => $user ? $user->id : null,
            'properties' => [
                'changes' => $changes,
                'new_settings' => [
                    'company_name' => $settings->company_name,
                    'company_logo' => $settings->company_logo,
                    'company_phone' => $settings->company_phone,
                    'company_address' => $settings->company_address,
                    'company_rif' => $settings->company_rif,
                    'company_email' => $settings->company_email,
                    'currency' => $settings->currency,
                ],
                'user_name' => $user ? $user->name : 'Sistema',
                'user_email' => $user ? $user->email : 'system@gonzago.com',
            ],
            'event' => 'general_settings_updated',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Configuración general actualizada correctamente',
            'settings' => [
                'company_name' => $settings->company_name,
                'company_logo' => $settings->company_logo,
                'company_logo_url' => $settings->company_logo ? Storage::disk('public')->url($settings->company_logo) : null,
                'company_phone' => $settings->company_phone,
                'company_address' => $settings->company_address,
                'company_rif' => $settings->company_rif,
                'company_email' => $settings->company_email,
                'currency' => $settings->currency,
            ],
        ]);
    }

    /**
     * Delete company logo.
     */
    public function deleteLogo(GeneralSettings $settings)
    {
        $oldLogo = $settings->company_logo;

        if ($settings->company_logo && Storage::disk('public')->exists($settings->company_logo)) {
            Storage::disk('public')->delete($settings->company_logo);
            $settings->company_logo = null;
            $settings->save();

            // Registrar la actividad de eliminación del logo
            $user = Auth::user();
            Activity::create([
                'log_name' => 'settings',
                'description' => 'Logo de empresa eliminado',
                'subject_type' => null,
                'subject_id' => null,
                'causer_type' => 'App\Models\User',
                'causer_id' => $user ? $user->id : null,
                'properties' => [
                    'deleted_logo' => $oldLogo,
                    'user_name' => $user ? $user->name : 'Sistema',
                    'user_email' => $user ? $user->email : 'system@gonzago.com',
                ],
                'event' => 'company_logo_deleted',
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Logo eliminado correctamente',
        ]);
    }
}

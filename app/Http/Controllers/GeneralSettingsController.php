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
            ],
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
        ]);

        $oldSettings = [
            'company_name' => $settings->company_name,
            'company_logo' => $settings->company_logo,
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

        // Update company name
        $settings->company_name = $request->company_name ?? '';

        $settings->save();

        // Registrar la actividad de actualización de configuración
        $user = Auth::user();
        $changes = [];

        if ($oldSettings['company_name'] !== $settings->company_name) {
            $changes['company_name'] = [
                'old' => $oldSettings['company_name'],
                'new' => $settings->company_name,
            ];
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

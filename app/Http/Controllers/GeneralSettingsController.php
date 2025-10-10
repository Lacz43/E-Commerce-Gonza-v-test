<?php

namespace App\Http\Controllers;

use App\Settings\GeneralSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

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
        if ($settings->company_logo && Storage::disk('public')->exists($settings->company_logo)) {
            Storage::disk('public')->delete($settings->company_logo);
            $settings->company_logo = null;
            $settings->save();
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Logo eliminado correctamente',
        ]);
    }
}

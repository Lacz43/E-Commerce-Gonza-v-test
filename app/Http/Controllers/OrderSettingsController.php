<?php

namespace App\Http\Controllers;

use App\Settings\OrderSettings;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderSettingsController extends Controller
{
    public function index()
    {
        $settings = app(OrderSettings::class);

        return Inertia::render('Settings/Order/Index', [
            'settings' => [
                'max_payment_wait_time_hours' => $settings->max_payment_wait_time_hours,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'max_payment_wait_time_hours' => 'nullable|integer|min:1|max:24',
        ]);

        $settings = app(OrderSettings::class);
        $settings->max_payment_wait_time_hours = $request->max_payment_wait_time_hours;
        $settings->save();

        return back()->with('success', 'Configuración de órdenes actualizada correctamente.');
    }
}

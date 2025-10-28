<?php

namespace App\Http\Controllers;

use App\Settings\OrderSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderSettingsController extends Controller
{
    public function index()
    {
        $settings = app(OrderSettings::class);

        return Inertia::render('Settings/Order/Index', [
            'settings' => [
                'max_payment_wait_time_hours' => $settings->max_payment_wait_time_hours,
                'max_guest_orders_per_hour' => $settings->max_guest_orders_per_hour,
                'max_guest_order_amount' => $settings->max_guest_order_amount,
                'max_guest_order_items' => $settings->max_guest_order_items,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'max_payment_wait_time_hours' => 'nullable|integer|min:1|max:24',
            'max_guest_orders_per_hour' => 'required|integer|min:1|max:100',
            'max_guest_order_amount' => 'nullable|numeric|min:0|max:10000',
            'max_guest_order_items' => 'nullable|integer|min:1|max:50',
        ]);

        $settings = app(OrderSettings::class);

        // Capture old values for logging
        $oldValues = [
            'max_payment_wait_time_hours' => $settings->max_payment_wait_time_hours,
            'max_guest_orders_per_hour' => $settings->max_guest_orders_per_hour,
            'max_guest_order_amount' => $settings->max_guest_order_amount,
            'max_guest_order_items' => $settings->max_guest_order_items,
        ];

        // Update settings
        $settings->max_payment_wait_time_hours = $request->max_payment_wait_time_hours;
        $settings->max_guest_orders_per_hour = $request->max_guest_orders_per_hour;
        $settings->max_guest_order_amount = $request->max_guest_order_amount;
        $settings->max_guest_order_items = $request->max_guest_order_items;
        $settings->save();

        // Capture new values for logging
        $newValues = [
            'max_payment_wait_time_hours' => $settings->max_payment_wait_time_hours,
            'max_guest_orders_per_hour' => $settings->max_guest_orders_per_hour,
            'max_guest_order_amount' => $settings->max_guest_order_amount,
            'max_guest_order_items' => $settings->max_guest_order_items,
        ];

        // Log the activity
        activity()
            ->causedBy(Auth::user())
            ->withProperties([
                'old' => $oldValues,
                'new' => $newValues,
                'changes' => array_diff_assoc($newValues, $oldValues),
                'settings_type' => 'order_settings',
            ])
            ->log('Configuración de órdenes actualizada');

        return back()->with('success', 'Configuración de órdenes actualizada correctamente.');
    }

    /**
     * Get public order settings.
     */
    public function getPublicSettings()
    {
        $settings = app(OrderSettings::class);

        return response()->json([
            'max_payment_wait_time_hours' => $settings->max_payment_wait_time_hours ?? 2,
            'max_guest_orders_per_hour' => $settings->max_guest_orders_per_hour ?? 3,
            'max_guest_order_amount' => $settings->max_guest_order_amount ?? 1000.00,
            'max_guest_order_items' => $settings->max_guest_order_items ?? 10,
        ]);
    }
}

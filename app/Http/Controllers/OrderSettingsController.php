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
        $settings->max_payment_wait_time_hours = $request->max_payment_wait_time_hours;
        $settings->max_guest_orders_per_hour = $request->max_guest_orders_per_hour;
        $settings->max_guest_order_amount = $request->max_guest_order_amount;
        $settings->max_guest_order_items = $request->max_guest_order_items;
        $settings->save();

        return back()->with('success', 'Configuración de órdenes actualizada correctamente.');
    }
}

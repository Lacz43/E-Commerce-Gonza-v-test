<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class PaymentMethodsController extends Controller
{
    /**
     * Display a listing of payment methods.
     */
    public function index()
    {
        $paymentMethods = PaymentMethod::active()->orderBy('type')->orderBy('name')->get();

        // Group by type for better display
        $groupedMethods = $paymentMethods->groupBy('type')->map(function ($methods) {
            return $methods->map(function ($method) {
                return [
                    'id' => $method->id,
                    'type' => $method->type,
                    'type_label' => $method->type_label,
                    'name' => $method->name,
                    'account_details' => $method->account_details,
                    'is_active' => $method->is_active,
                    'created_at' => $method->created_at,
                    'updated_at' => $method->updated_at,
                ];
            });
        });

        return Inertia::render('Settings/PaymentMethods/Index', [
            'paymentMethods' => $groupedMethods,
        ]);
    }

    /**
     * Store a newly created payment method.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:pago_movil,transferencia_bancaria,zelle,binance',
            'name' => 'required|string|max:255',
            'account_details' => 'required|array',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Datos inválidos',
                'errors' => $validator->errors(),
            ], 422);
        }

        $paymentMethod = PaymentMethod::create([
            'type' => $request->type,
            'name' => $request->name,
            'account_details' => $request->account_details,
            'is_active' => $request->is_active ?? true,
        ]);

        // Log activity
        Activity::create([
            'log_name' => 'payment_methods',
            'description' => 'Método de pago creado',
            'subject_type' => 'App\Models\PaymentMethod',
            'subject_id' => $paymentMethod->id,
            'causer_type' => 'App\Models\User',
            'causer_id' => Auth::id(),
            'properties' => [
                'payment_method' => [
                    'type' => $paymentMethod->type,
                    'name' => $paymentMethod->name,
                    'account_details' => $paymentMethod->account_details,
                ],
                'user_name' => Auth::user()->name,
                'user_email' => Auth::user()->email,
            ],
            'event' => 'payment_method_created',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Método de pago creado correctamente',
            'payment_method' => $paymentMethod,
        ]);
    }

    /**
     * Update the specified payment method.
     */
    public function update(Request $request, PaymentMethod $paymentMethod)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|in:pago_movil,transferencia_bancaria,zelle,binance',
            'name' => 'required|string|max:255',
            'account_details' => 'required|array',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Datos inválidos',
                'errors' => $validator->errors(),
            ], 422);
        }

        $oldData = [
            'type' => $paymentMethod->type,
            'name' => $paymentMethod->name,
            'account_details' => $paymentMethod->account_details,
            'is_active' => $paymentMethod->is_active,
        ];

        $paymentMethod->update([
            'type' => $request->type,
            'name' => $request->name,
            'account_details' => $request->account_details,
            'is_active' => $request->is_active ?? true,
        ]);

        // Log activity
        Activity::create([
            'log_name' => 'payment_methods',
            'description' => 'Método de pago actualizado',
            'subject_type' => 'App\Models\PaymentMethod',
            'subject_id' => $paymentMethod->id,
            'causer_type' => 'App\Models\User',
            'causer_id' => Auth::id(),
            'properties' => [
                'changes' => [
                    'old' => $oldData,
                    'new' => [
                        'type' => $paymentMethod->type,
                        'name' => $paymentMethod->name,
                        'account_details' => $paymentMethod->account_details,
                        'is_active' => $paymentMethod->is_active,
                    ],
                ],
                'user_name' => Auth::user()->name,
                'user_email' => Auth::user()->email,
            ],
            'event' => 'payment_method_updated',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Método de pago actualizado correctamente',
            'payment_method' => $paymentMethod,
        ]);
    }

    /**
     * Remove the specified payment method.
     */
    public function destroy(PaymentMethod $paymentMethod)
    {
        // Log activity before deletion
        Activity::create([
            'log_name' => 'payment_methods',
            'description' => 'Método de pago eliminado',
            'subject_type' => 'App\Models\PaymentMethod',
            'subject_id' => $paymentMethod->id,
            'causer_type' => 'App\Models\User',
            'causer_id' => Auth::id(),
            'properties' => [
                'payment_method' => [
                    'type' => $paymentMethod->type,
                    'name' => $paymentMethod->name,
                    'account_details' => $paymentMethod->account_details,
                ],
                'user_name' => Auth::user()->name,
                'user_email' => Auth::user()->email,
            ],
            'event' => 'payment_method_deleted',
        ]);

        $paymentMethod->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Método de pago eliminado correctamente',
        ]);
    }

    /**
     * Toggle active status of payment method.
     */
    public function toggle(PaymentMethod $paymentMethod)
    {
        $paymentMethod->update([
            'is_active' => !$paymentMethod->is_active,
        ]);

        // Log activity
        Activity::create([
            'log_name' => 'payment_methods',
            'description' => 'Estado del método de pago cambiado',
            'subject_type' => 'App\Models\PaymentMethod',
            'subject_id' => $paymentMethod->id,
            'causer_type' => 'App\Models\User',
            'causer_id' => Auth::id(),
            'properties' => [
                'payment_method' => [
                    'type' => $paymentMethod->type,
                    'name' => $paymentMethod->name,
                    'is_active' => $paymentMethod->is_active,
                ],
                'user_name' => Auth::user()->name,
                'user_email' => Auth::user()->email,
            ],
            'event' => 'payment_method_toggled',
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Estado del método de pago actualizado correctamente',
            'payment_method' => $paymentMethod,
        ]);
    }

    /**
     * Get active payment methods for public use.
     */
    public function getActiveMethods()
    {
        $paymentMethods = PaymentMethod::active()
            ->orderBy('type')
            ->orderBy('name')
            ->get()
            ->map(function ($method) {
                return [
                    'id' => $method->id,
                    'type' => $method->type,
                    'type_label' => $method->type_label,
                    'name' => $method->name,
                    'account_details' => $method->account_details,
                ];
            });

        return response()->json([
            'payment_methods' => $paymentMethods,
        ]);
    }
}

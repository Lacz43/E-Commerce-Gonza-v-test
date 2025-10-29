<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentMethodsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $paymentMethods = [
            [
                'type' => 'pago_movil',
                'name' => 'Pago Móvil Principal',
                'account_details' => json_encode([
                    'phone' => '04141234567',
                    'bank' => 'Banco de Venezuela',
                    'account_holder' => 'GonzaGo C.A.',
                    'document_number' => '12345678'
                ]),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'transferencia_bancaria',
                'name' => 'Cuenta Corriente Banesco',
                'account_details' => json_encode([
                    'bank' => 'Banesco',
                    'account_type' => 'corriente',
                    'account_number' => '12345678901234567890',
                    'account_holder' => 'GonzaGo C.A.',
                ]),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'zelle',
                'name' => 'Zelle Principal',
                'account_details' => json_encode([
                    'email' => 'payments@gonzago.com',
                    'account_holder' => 'GonzaGo LLC'
                ]),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'type' => 'binance',
                'name' => 'Binance Pay',
                'account_details' => json_encode([
                    'wallet_address' => '0x1234567890abcdef1234567890abcdef12345678',
                    'user_id' => 1,
                    'email' => 'payments@gonzago.com',
                    'merchant_id' => 'gonzago_merchant',
                ]),
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('payment_methods')->insert($paymentMethods);
    }
}

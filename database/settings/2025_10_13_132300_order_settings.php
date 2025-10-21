<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('orders.max_payment_wait_time_hours', 2);
        $this->migrator->add('orders.max_guest_orders_per_hour', 3);
        $this->migrator->add('orders.max_guest_order_amount', 1000.00); // Monto máximo por orden para guests
        $this->migrator->add('orders.max_guest_order_items', 10); // Cantidad máxima de items por orden para guests
    }
};

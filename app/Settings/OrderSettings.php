<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class OrderSettings extends Settings
{
    public ?int $max_payment_wait_time_hours = 2;

    public int $max_guest_orders_per_hour = 3;

    public ?float $max_guest_order_amount = 1000.00;

    public ?int $max_guest_order_items = 10;

    public static function group(): string
    {
        return 'orders';
    }
}

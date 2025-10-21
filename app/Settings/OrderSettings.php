<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class OrderSettings extends Settings
{
    public ?int $max_payment_wait_time_hours = 2;

    public static function group(): string
    {
        return 'orders';
    }
}

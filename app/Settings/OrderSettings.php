<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class OrderSettings extends Settings
{
    public ?int $max_payment_wait_time_hours;

    public static function group(): string
    {
        return 'orders';
    }
}

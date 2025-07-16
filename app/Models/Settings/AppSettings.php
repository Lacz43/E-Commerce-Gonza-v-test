<?php

namespace App\Models\Settings;

use Spatie\LaravelSettings\Settings;

class AppSettings extends Settings
{
    public string $backup_time;

    public static function group(): string
    {
        return 'general';
    }
}

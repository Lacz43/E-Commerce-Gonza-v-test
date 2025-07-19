<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class BackupSettings extends Settings
{
    public bool $active;
    public string $schedule;
    public ?string $time;

    public static function group(): string
    {
        return 'backup';
    }
}

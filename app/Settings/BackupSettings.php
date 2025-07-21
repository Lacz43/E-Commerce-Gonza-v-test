<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

/**
 * INFO: BackupSettings
 * active: si se debe realizar el respaldo automático
 * schedule: frecuencia de respaldo
 * time: hora de ejecución del respaldo
 */
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

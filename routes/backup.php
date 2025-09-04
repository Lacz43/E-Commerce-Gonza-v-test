<?php

use App\Settings\BackupSettings;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\Facades\Schema;

// Si la tabla todavía no existe, no programamos nada.
if (!Schema::hasTable('settings')) {
    return;
}

/*
 * INFO:
 * Se usa el scheduler para ejecutar el comando de respaldo
 * Si la configuracion de respaldo esta activa, se ejecuta el comando de respaldo
 */

$settings = app(BackupSettings::class);

if ($settings && $settings->active) {
    $schedule = app(Schedule::class);

    $task = $schedule->command('backup:run --only-db');

    match ($settings->schedule) {
        'daily' => $task->daily(),
        'weekly' => $task->weekly(),
        'monthly' => $task->monthly(),
        'yearly' => $task->yearly(),
        default => $task->daily(),
    };

    if (!empty($settings->time)) {
        $task->at($settings->time);
    }
}

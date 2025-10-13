<?php

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\Facades\Schema;

// Si la tabla todavía no existe, no programamos nada.
if (!Schema::hasTable('settings')) {
    return;
}

/*
 * INFO:
 * Se usa el scheduler para ejecutar el comando de expiración de órdenes
 * Si la configuración de tiempo de expiración no es null, se ejecuta el comando
 */

$settings = app(\App\Settings\OrderSettings::class);

if ($settings && $settings->max_payment_wait_time_hours !== null) {
    $schedule = app(Schedule::class);

    $schedule->command('orders:expire')->hourly();
}

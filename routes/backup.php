<?php

use App\Settings\BackupSettings;
use Illuminate\Console\Scheduling\Schedule;

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

<?php

namespace App\Models;

use Spatie\Activitylog\Models\Activity as SpatieActivity;

class ActivityLog extends SpatieActivity
{
    /**
     * Campos permitidos para filtrado
     */
    public static function getFilterableFields(): array
    {
        return [
            'description',
            'event',
            'causer.name',
            'subject_type',
        ];
    }

    /**
     * Campos permitidos para ordenamiento
     */
    public static function getSortableFields(): array
    {
        return [
            'id',
            'created_at',
            'description',
            'event',
        ];
    }
}

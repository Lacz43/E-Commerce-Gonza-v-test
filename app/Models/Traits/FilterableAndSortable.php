<?php

namespace App\Models\Traits;

trait FilterableAndSortable
{
    public static function getFilterableFields(): array
    {
        return [];
    }

    public static function getSortableFields(): array
    {
        return [];
    }
}

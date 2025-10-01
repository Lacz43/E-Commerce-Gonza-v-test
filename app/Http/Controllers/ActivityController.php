<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Services\QueryFilters;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityController extends Controller
{
    /**
     * Display a listing of the activity logs.
     */
    public function index(Request $request)
    {
        $activities = (new QueryFilters($request))->apply(
            ActivityLog::query()
                ->with(['causer', 'subject'])
        );

        $filtersAvailable = ActivityLog::getFilterableFields();
        $sortAvailable = ActivityLog::getSortableFields();

        return Inertia::render('Activity/Index', [
            'activities' => $activities,
            'filtersAvailable' => $filtersAvailable,
            'sortAvailable' => $sortAvailable,
        ]);
    }
}

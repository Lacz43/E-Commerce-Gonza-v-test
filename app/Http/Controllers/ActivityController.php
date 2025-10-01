<?php

namespace App\Http\Controllers;

use App\Services\QueryFilters;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Activitylog\Models\Activity;

class ActivityController extends Controller
{
    /**
     * Display a listing of the activity logs.
     */
    public function index(Request $request)
    {
        $activities = (new QueryFilters($request))->apply(
            Activity::query()
                ->with(['causer', 'subject'])
        );

        $filtersAvailable = ['description', 'event', 'causer.name', 'subject_type'];
        $sortAvailable = ['id', 'created_at', 'description', 'event'];

        return Inertia::render('Activity/Index', [
            'activities' => $activities,
            'filtersAvailable' => $filtersAvailable,
            'sortAvailable' => $sortAvailable,
        ]);
    }
}

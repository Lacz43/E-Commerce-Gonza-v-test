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
        $modelsName = config('modules.model_names');
        $events = [
            'created' => 'Creado',
            'updated' => 'Actualizado',
            'deleted' => 'Eliminado',
        ];

        return Inertia::render('Activity/Index', [
            'activities' => $activities,
            'filtersAvailable' => $filtersAvailable,
            'sortAvailable' => $sortAvailable,
            'modelsName' => $modelsName,
            'events' => $events,
        ]);
    }

    /**
     * Display the specified activity log.
     */
    public function show(ActivityLog $activity)
    {
        $events = [
            'created' => 'Creado',
            'updated' => 'Actualizado',
            'deleted' => 'Eliminado',
        ];

        $modelsName = config('modules.model_names');

        $activityData = $activity->load(['causer', 'subject'])->toArray();

        return response()->json([
            'activity' => $activityData,
            'translations' => [
                'event' => $events[$activity->event] ?? $activity->event,
                'subject_type' => $modelsName[class_basename($activity->subject_type)] ?? $activity->subject_type,
            ],
        ]);
    }
}

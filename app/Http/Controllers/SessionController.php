<?php

namespace App\Http\Controllers;

use App\Models\Session;
use App\Services\QueryFilters;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SessionController extends Controller
{
    /**
     * Display a listing of the user sessions.
     */
    public function index(Request $request)
    {
        $sessions = (new QueryFilters($request))->apply(
            Session::query()
                ->with(['user'])
        );

        $filtersAvailable = Session::getFilterableFields();
        $sortAvailable = Session::getSortableFields();

        return Inertia::render('Session/Index', [
            'sessions' => $sessions,
            'filtersAvailable' => $filtersAvailable,
            'sortAvailable' => $sortAvailable,
        ]);
    }
}

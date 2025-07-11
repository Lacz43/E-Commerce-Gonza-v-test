<?php

namespace App\Http\Controllers;

use App\Models\BackupAndRestore;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BackupAndRestoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // List files in the 'backups' disk and optional path subfolder
        $path = config('backup.destination.path', '');
        $files = Storage::disk('backups')->allFiles($path);

        // Prepare data for frontend
        $backups = collect($files)->map(function ($file) {
            return [
                'name' => basename($file),
                'size' => Storage::disk('backups')->size($file),
                'lastModified' => Storage::disk('backups')->lastModified($file),
                //'url' => route('backups.download', ['file' => encrypt($file)]),
            ];
        });
        Debugbar::info($backups);

        return Inertia::render('Settings/BackupAndRestore/Index', [
            'backups' => $backups,
        ]);
    }

    public function triggerBackup()
    {
        try {
            Artisan::call('backup:run --only-db');
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ]);
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Respaldo realizado correctamente',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(BackupAndRestore $backupAndRestore)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(BackupAndRestore $backupAndRestore)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BackupAndRestore $backupAndRestore)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BackupAndRestore $backupAndRestore)
    {
        //
    }
}

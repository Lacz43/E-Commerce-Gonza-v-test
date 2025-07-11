<?php

namespace App\Http\Controllers;

use App\Models\BackupAndRestore;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Inertia\Inertia;

class BackupAndRestoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       return Inertia::render('Settings/BackupAndRestore/Index');
    }

    public function triggerBackup()
    {
        try {
            Artisan::call('backup:run');
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

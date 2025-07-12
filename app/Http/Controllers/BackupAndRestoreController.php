<?php

namespace App\Http\Controllers;

use App\Models\BackupAndRestore;
use Barryvdh\Debugbar\Facades\Debugbar;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BackupAndRestoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // List files in the 'backups' disk and optional path subfolder
        $path = config('backup.backup.destination.path', '');
        $files = Storage::disk('backups')->files($path);

        // Prepare data for frontend
        $backups = collect($files)->map(function ($file) {
            return [
                'id' => $file,
                'name' => basename($file),
                'size' => Storage::disk('backups')->size($file),
                'lastModified' => Storage::disk('backups')->lastModified($file),
                'url' => route('backup.download', ['file' => encrypt($file)]),
            ];
        })->sortByDesc('lastModified');

        $perPage = $request->get('perPage', 20);
        $currentPage = $request->get('page', 1);
        $totalItems = $backups->count();

        // Crear paginador manualmente
        $paginatedBackups = new LengthAwarePaginator(
            $backups->forPage($currentPage, $perPage)->values(),
            $totalItems,
            $perPage,
            $currentPage,
            [
                'path' => Paginator::resolveCurrentPath(),
                'pageName' => 'page',
            ]
        );

        return Inertia::render('Settings/BackupAndRestore/Index', [
            'backups' => $paginatedBackups,
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

    public function download($file)
    {
        // Decrypt file path
        $path = decrypt($file);

        if (! Storage::disk('backups')->exists($path)) {
            abort(404);
        }

        // Stream download
        return Storage::disk('backups')->download($path, basename($path));
    }

    public function restoreBackup(Request $request)
    {
        try {
            // Validar que se haya cargado un archivo
            $request->validate([
                'file' => 'required|file|mimes:zip,sql|max:10240', // 10MB
            ]);

            $file = $request->file('file');
            $fileName = $file->hashName();
            $filePath = 'backups/' . $fileName;

            // Guardar el archivo en el directorio de respaldos
            Storage::disk('backups')->put($filePath, File::get($file));

            // Ejecutar el comando de restauración
            Artisan::call('backup:restore', ['--backup-name' => $fileName]);

            return response()->json([
                'message' => 'Restauración completada con éxito.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'error' => 'Error al restaurar el respaldo: ' . $e->getMessage(),
            ], 500);
        }
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

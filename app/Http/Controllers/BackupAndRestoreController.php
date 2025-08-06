<?php

namespace App\Http\Controllers;

use App\Settings\BackupSettings;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use ZipArchive;

class BackupAndRestoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Lista todos los archivos en el disco 'backups'
        $path = config('backup.backup.destination.path', '');
        $files = Storage::disk('backups')->files($path);

        // obtingemos los datos para enviar al frontend
        $backups = collect($files)->map(function ($file) {
            return [
                'id' => $file,
                'name' => basename($file),
                'size' => Storage::disk('backups')->size($file),
                'lastModified' => Storage::disk('backups')->lastModified($file),
                'url' => route('backup.download', ['file' => encrypt($file)]),
            ];
        })->sortByDesc('lastModified'); // ordenamos por fecha de modificacion

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

    /**
     * Ejecuta el comando de respaldo
     */
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
     * Descarga el archivo de respaldo
     */
    public function download($file)
    {
        //  desciframo el archivo
        $path = decrypt($file);

        if (! Storage::disk('backups')->exists($path)) {
            abort(404);
        }

        // descarga el archivo
        return Storage::disk('backups')->download($path, basename($path));
    }

    /**
     * Restaura el archivo de respaldo
     */
    public function restoreBackup(Request $request)
    {
        $request->validate([
            'file' => 'required|array|max:1',
            'file.*' => 'required|file|extensions:zip,sql|max:10240', // 10MB
        ]);

        try {
            $file = $request->file('file')[0];
            $fileName = $file->hashName();
            $filePath = 'uploads/' . $fileName;

            // Guardar el archivo en el directorio de respaldos
            Storage::disk('backups')->put($filePath, File::get($file));

            if ($file->getClientOriginalExtension() === 'zip') {
                // Obtener ruta absoluta del ZIP usando el disco de respaldos
                $zipPath = Storage::disk('backups')->path($filePath);

                // Ruta para extraer el ZIP (usando el mismo disco)
                $extractPath = 'extracted/' . $file->hashName();
                $extractPathAbsolute = Storage::disk('backups')->path($extractPath);

                // Crear directorio si no existe
                if (!File::exists($extractPathAbsolute)) {
                    File::makeDirectory($extractPathAbsolute, 0777, true);
                }

                // Extraer el ZIP
                $zip = new ZipArchive();
                if ($zip->open($zipPath) === true) {
                    $zip->extractTo($extractPathAbsolute);
                    $zip->close();
                } else {
                    throw new Exception('Error al abrir o extraer el archivo ZIP.');
                }

                // Buscar archivo SQL dentro del ZIP
                $dumpFiles = File::allFiles($extractPathAbsolute);
                $dumpFile = collect($dumpFiles)->first(function ($fileInfo) {
                    return preg_match('/\.sql(\.gz)?$/', $fileInfo->getFilename()) === 1;
                });

                if (!$dumpFile) {
                    throw new Exception('No se encontró un archivo SQL válido en el ZIP.');
                }

                $dumpPath = $dumpFile->getPathname();
                $this->importDatabase($dumpPath);
            } elseif ($file->getClientOriginalExtension() === 'sql') {
                // Ruta directa para archivos SQL
                $dumpPath = Storage::disk('backups')->path($filePath);
                $this->importDatabase($dumpPath);
            } else {
                throw new Exception('Formato de archivo no soportado. Solo se permiten archivos ZIP y SQL.');
            }
            Storage::disk('backups')->delete($filePath);

            return response()->json([
                'message' => 'Restauración completada con éxito.',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'message' => 'Error al restaurar el respaldo: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ejecuta el comando de restauracion de la base de datos
     */
    protected function importDatabase($dumpPath)
    {
        $dbHost = env('DB_HOST');
        $dbUsername = env('DB_USERNAME');
        $dbPassword = env('DB_PASSWORD');
        $dbName = env('DB_DATABASE');

        // Comando con parámetros escapados para seguridad
        $command = 'mysql ' .
            escapeshellarg("--host={$dbHost}") . ' ' .
            escapeshellarg("--user={$dbUsername}") . ' ' .
            escapeshellarg("--password={$dbPassword}") . ' ' .
            escapeshellarg($dbName) . ' ' .
            '< ' . escapeshellarg($dumpPath);

        $output = shell_exec($command);

        if ($output === null) {
            throw new Exception('Error al ejecutar la restauración de la base de datos.');
        }
    }

    /**
     * Cambia la configuracion de respaldo automático
     */
    public function toggleBackup(Request $request, BackupSettings $settings)
    {
        $request->validate([
            'active' => 'sometimes|boolean',
            'time' => 'sometimes|string|nullable',
            'schedule' => 'sometimes|string',
        ]);

        // Actualizar los settings directamente
        if ($request->has('active')) {
            $settings->active = $request->active;
        }
        if ($request->has('schedule')) {
            $settings->schedule = $request->schedule;
        }
        if ($request->has('time')) {
            $settings->time = $request->time;
        }

        // Guardar todos los cambios
        $settings->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Configuración de backup actualizada']);

    }

    /**
     * Obtiene la configuracion de respaldo
     */
    public function backupSettings()
    {
        $settings = app(BackupSettings::class);
        return response()->json([
            'active' => $settings->active,
            'schedule' => $settings->schedule,
            'time' => $settings->time,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $request->validate(['file' => 'required|string']);
        $path = config('backup.backup.destination.path', '');
        Storage::disk('backups')->delete($path.'/'.$request->file);

        return response()->json([
            'message' => 'Respaldo borrado con éxito.',
        ]);
    }
}

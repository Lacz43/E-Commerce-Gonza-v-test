<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Services\QueryFilters;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class BrandController extends Controller
{
    public function brands()
    {
        $brands = Brand::get();
        return json_encode($brands);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $brands = (new QueryFilters($request))->apply(Brand::query());
        $filtersFields = Brand::getFilterableFields();
        $sortFields = Brand::getSortableFields();
        return Inertia::render('Products/Brands/Index', [
            'brands' => $brands,
            'filtersFields' => $filtersFields,
            'sortFields' => $sortFields,
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
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:brands,name',
            ]);

            Brand::create([
                'name' => $request->name,
                'created_by' => Auth::id(),
            ]);

            return response()->json([
                'message' => 'Marca creada exitosamente',
            ]);
        } catch (QueryException $e) {
            // Manejar errores de duplicados en la base de datos
            if ($e->getCode() == 23000) { // Código de error para violación de restricción
                $errorMessage = $e->getMessage();

                if (str_contains($errorMessage, 'brands_name_unique')) {
                    return response()->json([
                        'message' => 'Ya existe una marca con este nombre. Por favor, utiliza un nombre diferente.',
                        'field' => 'name'
                    ], 422);
                }

                // Error genérico de duplicado
                return response()->json([
                    'message' => 'Ya existe una marca con estos datos. Por favor, verifica la información e intenta nuevamente.',
                ], 422);
            }

            // Re-lanzar otros tipos de errores
            throw $e;
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Brand $brand)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Brand $brand)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Brand $brand)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255|unique:brands,name,' . $brand->id,
            ]);

            $brand->update([
                'name' => $request->name,
            ]);

            return response()->json([
                'message' => 'Marca actualizada exitosamente',
            ]);
        } catch (QueryException $e) {
            // Manejar errores de duplicados en la base de datos
            if ($e->getCode() == 23000) { // Código de error para violación de restricción
                $errorMessage = $e->getMessage();

                if (str_contains($errorMessage, 'brands_name_unique')) {
                    return response()->json([
                        'message' => 'Ya existe otra marca con este nombre. Por favor, utiliza un nombre diferente.',
                        'field' => 'name'
                    ], 422);
                }

                // Error genérico de duplicado
                return response()->json([
                    'message' => 'Ya existe una marca con estos datos. Por favor, verifica la información e intenta nuevamente.',
                ], 422);
            }

            // Re-lanzar otros tipos de errores
            throw $e;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Brand $brand)
    {
        $brand->delete();
        return response()->json([
            'message' => 'Marca eliminada exitosamente',
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductCategoryRequest;
use App\Models\ProductCategory;
use App\Services\QueryFilters;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductCategoryController extends Controller
{
    public function categories()
    {
        $categories = ProductCategory::get();
        Debugbar::info($categories);
        return json_encode($categories);
    }

    public function index(Request $request)
    {
        $categories = (new QueryFilters($request))->apply(
            ProductCategory::query()
        );

        $filtersAvailable = ProductCategory::getFilterableFields();
        $sortAvailable = ProductCategory::getSortableFields();

        return Inertia::render('Products/Categories/Index', [
            'categories' => $categories,
            'filtersAvailable' => $filtersAvailable,
            'sortAvailable' => $sortAvailable,
        ]);
    }

    public function destroy(ProductCategory $category)
    {
        $category->delete();
        return response()->json([
            'status' => 'success',
            'message' => 'Categoria eliminada correctamente'
        ]);
    }

    public function store(ProductCategoryRequest $request)
    {
        try {
            ProductCategory::create([
                'name' => $request->name,
                'created_by' => Auth::user()->id,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Categoria creada correctamente',
            ]);
        } catch (QueryException $e) {
            // Manejar errores de duplicados en la base de datos
            if ($e->getCode() == 23000) { // Código de error para violación de restricción
                $errorMessage = $e->getMessage();

                if (str_contains($errorMessage, 'product_categories_name_unique')) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Ya existe una categoría con este nombre. Por favor, utiliza un nombre diferente.',
                        'field' => 'name'
                    ], 422);
                }

                // Error genérico de duplicado
                return response()->json([
                    'status' => 'error',
                    'message' => 'Ya existe una categoría con estos datos. Por favor, verifica la información e intenta nuevamente.',
                ], 422);
            }

            // Re-lanzar otros tipos de errores
            throw $e;
        }
    }

    public function update(ProductCategoryRequest $request, ProductCategory $category)
    {
        try {
            $category->update([
                'name' => $request->name,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Categoria actualizada correctamente',
            ]);
        } catch (QueryException $e) {
            // Manejar errores de duplicados en la base de datos
            if ($e->getCode() == 23000) { // Código de error para violación de restricción
                $errorMessage = $e->getMessage();

                if (str_contains($errorMessage, 'product_categories_name_unique')) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Ya existe otra categoría con este nombre. Por favor, utiliza un nombre diferente.',
                        'field' => 'name'
                    ], 422);
                }

                // Error genérico de duplicado
                return response()->json([
                    'status' => 'error',
                    'message' => 'Ya existe una categoría con estos datos. Por favor, verifica la información e intenta nuevamente.',
                ], 422);
            }

            // Re-lanzar otros tipos de errores
            throw $e;
        }
    }
}

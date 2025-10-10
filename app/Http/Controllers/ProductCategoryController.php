<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductCategoryRequest;
use App\Models\ProductCategory;
use App\Services\QueryFilters;
use Barryvdh\Debugbar\Facades\Debugbar;
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
        ProductCategory::create([
            'name' => $request->name,
            'created_by' => Auth::user()->id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Categoria creada correctamente',
        ]);
    }

    public function update(ProductCategoryRequest $request, ProductCategory $category){
        $category->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Categoria actualizada correctamente',
        ]);
    }
}

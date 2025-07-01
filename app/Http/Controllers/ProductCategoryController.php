<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductCategoryRequest;
use App\Models\ProductCategory;
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
        $categories = ProductCategory::paginate($request->query("perPage", 20));
        return Inertia::render('Products/Categories/Index', [
            'categories' => $categories
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
}

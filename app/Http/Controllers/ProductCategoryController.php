<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Http\Request;
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
}

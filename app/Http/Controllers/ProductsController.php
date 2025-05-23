<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductsController extends Controller
{
    public function index(Request $request)
    {
        $products = Products::paginate($request->query("perPage", 20));
        return Inertia::render('Products/Index', ['products' => $products]);
    }

    public function products(Request $request)
    {
        $products = Products::paginate(20);
        Debugbar::info($products);

        return json_encode([
            'products' => $products,
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }
}

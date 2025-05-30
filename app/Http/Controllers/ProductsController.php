<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $products = Products::with(['defaultImage:product_id,image'])->paginate(20);

        Debugbar::info($products);

        return json_encode([
            'products' => $products,
        ]);
    }

    public function create()
    {
        return Inertia::render('Products/Create');
    }

    public function storage(Request $request)
    {
        Debugbar::info($request);
        $data = $request->validate([
            'name' => 'required|string',
            'barcode' => 'required|string',
            'price' => 'required|numeric|min:0',
            'category' => 'required|exists:product_categories,id',
            'description' => 'nullable|string',
            'images' => 'required|array',
            'images.*' => ['sometimes', function ($attribute, $value, $fail) {
                Debugbar::info($value);
                if (!is_file($value) && !is_string($value)) {
                    $fail("El elemento {$attribute} debe ser un archivo o una cadena.");
                }
            }],
        ]);

        Products::create([
            'name' => $data['name'],
            'barcode' => $data['barcode'],
            'price' => $data['price'],
            'category_id' => $data['category'],
            'description' => $data['description'],
            'image' => 'http://test.com',
            'created_by' => Auth::user()->id,
        ]);
        return json_encode(["test" => "test"]);
    }
}

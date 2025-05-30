<?php

namespace App\Http\Controllers;

use App\Models\ProductImage;
use App\Models\Products;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Str;

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
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $product = Products::create([
            'name' => $data['name'],
            'barcode' => $data['barcode'],
            'price' => $data['price'],
            'category_id' => $data['category'],
            'description' => $data['description'],
            'created_by' => Auth::user()->id,
        ]);

        foreach ($request->file('images') as $index => $image) {
            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension(); // Nombre único
            $path = $image->storeAs('products/' . $product->id, $filename, 'public'); // Almacenar en storage/app/public/products/{id_producto}

            // Guardar en la base de datos
            ProductImage::create([
                'product_id' => $product->id,
                'image' => $path,
                'default' => $index === 0, // Marcar la primera como default
            ]);
        }
        return json_encode(["test" => "test"]);
    }
}

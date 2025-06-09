<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use App\Models\ProductImage;
use App\Models\Products;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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
            'category' => 'required|numeric|string',
            'description' => 'nullable|string',
            'image_used' => 'nullable|numeric',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $exists = DB::table('product_categories')
            ->where('id', $data['category'])
            ->orWhere('name', $data['category'])
            ->exists();


        $category = function () use ($exists, $data) {
            if (!$exists) {
                return ProductCategory::create([
                    'name' => $data['category']
                ])->id;
            } else {
                return $data['category'];
            }
        };

        $product = Products::create([
            'name' => $data['name'],
            'barcode' => $data['barcode'],
            'price' => $data['price'],
            'category_id' => $category(),
            'description' => $data['description'],
            'created_by' => Auth::user()->id,
        ]);

        foreach ($request->file('images') as $index => $image) {
            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension(); // Nombre único
            $path = $image->storeAs('products/' . $product->id, $filename, 'public'); // Almacenar en storage/app/public/products/{id_producto}

            // Función para determinar si es la imagen por defecto
            $defaultImage = function () use ($index, $data, $request) {
                // Verifica que existan imágenes subidas
                $uploadedImages = $request->file('images') ?? [];

                // Si no hay imágenes usadas o el índice es menor al número de imágenes
                if (empty($data['image_used']) || $data['image_used'] >= count($uploadedImages)) {
                    return $index == 0; // Asigna como defecto la primera imagen
                }

                // Si el índice coincide con la imagen usada
                return $data['image_used'] == $index;
            };

            // Guardar en la base de datos
            ProductImage::create([
                'product_id' => $product->id,
                'image' => $path,
                'default' => $defaultImage(),
            ]);
        }
        return json_encode(["test" => "test"]);
    }
}

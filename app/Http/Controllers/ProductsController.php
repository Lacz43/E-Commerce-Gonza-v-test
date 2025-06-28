<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\ProductBrand;
use App\Models\ProductCategory;
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
            'category' => 'required|string',
            'brand' => 'required|string',
            'description' => 'nullable|string',
            'image_used' => 'nullable|numeric',
            'images' => 'required|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $category = ProductCategory::createOrReadCategory($data['category']);
        if (!$category) {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para crear categorias.']);
        }

        $brand = Brand::createOrReadBrand($data['brand']);
        if (!$brand) {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para crear marcas.']);
        }

        $product = Products::create([
            'name' => $data['name'],
            'barcode' => $data['barcode'],
            'price' => $data['price'],
            'category_id' => $category,
            'description' => $data['description'],
            'created_by' => Auth::user()->id,
        ]);

        ProductBrand::firstOrCreate([
            'product_id' => $product->id,
            'brand_id' => $brand,
        ]);

        ProductImage::saveImages($product->id, $request->file('images'), $data['image_used'] ?? null);
        return json_encode(["test" => "test"]);
    }

    public function edit(Products $product)
    {
        $product = Products::with(['images', 'brand', 'category'])->find($product->id);
        Debugbar::info($product);
        return Inertia::render('Products/Edit', ['product' => $product]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Products $product)
    {
        Debugbar::info($product);
        $product = Products::destroy($product->id);
        return redirect()->route('products.index');
    }

}

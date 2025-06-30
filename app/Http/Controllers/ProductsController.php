<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Brand;
use App\Models\ProductBrand;
use App\Models\ProductCategory;
use App\Models\ProductImage;
use App\Models\Products;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
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

    public function storage(ProductRequest $request)
    {
        Debugbar::info($request);

        $category = ProductCategory::createOrReadCategory($request['category']);
        if (!$category) {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para crear categorias.']);
        }

        $brand = Brand::createOrReadBrand($request['brand']);
        if (!$brand) {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para crear marcas.']);
        }

        $product = Products::create([
            'name' => $request['name'],
            'barcode' => $request['barcode'],
            'price' => $request['price'],
            'category_id' => $category,
            'description' => $request['description'],
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
        $product = $product->with(['images', 'brand', 'category'])->first();
        Debugbar::info($product);
        return Inertia::render('Products/Edit', ['product' => $product]);
    }

    public function update(Products $product, ProductRequest $request)
    {
        Debugbar::info($request, $product);

        $category = ProductCategory::createOrReadCategory($request['category']);
        if (!$category) {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para crear categorias.']);
        }

        $brand = Brand::createOrReadBrand($request['brand']);
        if (!$brand) {
            return redirect()->back()->withErrors(['error' => 'No tienes permiso para crear marcas.']);
        }

        $product->update([
            'name' => $request['name'],
            'barcode' => $request['barcode'],
            'price' => $request['price'],
            'category_id' => $category,
            'description' => $request['description'],
        ]);

        ProductBrand::where('product_id', $product->id)->update(['brand_id' => $brand]);
        ProductImage::where('product_id', $product->id)->delete();
        Storage::disk('public')->deleteDirectory('products/' . $product->id);
        ProductImage::saveImages($product->id, $request->file('images'), $request['image_used'] ?? null);

        return json_encode(["test" => "test"]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Products $product)
    {
        Debugbar::info($product);
        $product->delete();
        return redirect()->route('products.index');
    }

}

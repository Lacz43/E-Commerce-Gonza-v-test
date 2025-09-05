<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Brand;
use App\Models\ProductBrand;
use App\Models\ProductCategory;
use App\Models\ProductImage;
use App\Models\Products;
use App\Services\QueryFilters;
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
        $products = (new QueryFilters($request))->apply(Products::query());
        $filtersFields = Products::getFilterableFields();
        $sortFields = Products::getSortableFields();
        return Inertia::render('Products/Index', ['products' => $products, 'filtersFields' => $filtersFields, 'sortFields' => $sortFields]);
    }

    public function products(Request $request)
    {
        $query = Products::with(['defaultImage:product_id,image', 'productInventory:id,product_id,stock']);

        // Parámetros opcionales de búsqueda:
        // 1) ?id=XXXXXXXX (coincidencia exacta)
        // 2) ?barcode=XXXXXXXX (coincidencia exacta)
        // 3) ?name=texto (LIKE %texto%)
        // 4) ?search=valor (busca por barcode exacto O nombre LIKE)
        $id = trim((string)$request->query('id', ''));
        $barcode = trim((string)$request->query('barcode', ''));
        $name = trim((string)$request->query('name', ''));
        $search = trim((string)$request->query('search', ''));

        if ($id !== '') {
            $query->where('id', $id);
        } elseif ($barcode !== '') {
            $query->where('barcode', $barcode);
        } elseif ($name !== '') {
            $query->where('name', 'like', "%$name%");
        } elseif ($search !== '') {
            $query->where(function($q) use ($search) {
                $q->where('barcode', $search)
                  ->orWhere('name', 'like', "%$search%");
            });
        }

        $perPage = (int)$request->query('perPage', 20);
        $products = $query->paginate($perPage);

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
            return response()->json(['message' => 'No tienes permiso para crear categorias.'], 403);
        }

        $brand = Brand::createOrReadBrand($request['brand']);
        if (!$brand) {
            return response()->json(['message' => 'No tienes permiso para crear marcas.'], 403);
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
        return response()->json([
            'message' => 'Producto creado exitosamente',
        ]);
    }

    public function edit(Products $product)
    {
        $product = $product->load(['images', 'brand', 'category']);
        Debugbar::info($product);
        return Inertia::render('Products/Edit', ['product' => $product]);
    }

    public function update(Products $product, ProductRequest $request)
    {
        Debugbar::info($request, $product);

        $category = ProductCategory::createOrReadCategory($request['category']);
        if (!$category) {
            return response()->json(["message" => "No tienes permiso para crear categorias."], 403);
        }

        $brand = Brand::createOrReadBrand($request['brand']);
        if (!$brand) {
            return response()->json(["message" => "No tienes permiso para crear categorias."], 403);
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

        return response()->json(["message" => "Producto actualizado exitosamente"]);
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

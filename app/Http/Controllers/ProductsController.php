<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductRequest;
use App\Models\Brand;
use App\Models\ProductBrand;
use App\Models\ProductCategory;
use App\Models\ProductImage;
use App\Models\Product;
use App\Services\QueryFilters;
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
        $products = (new QueryFilters($request))->apply(Product::query());
        $filtersFields = Product::getFilterableFields();
        $sortFields = Product::getSortableFields();
        return Inertia::render('Products/Index', ['products' => $products, 'filtersFields' => $filtersFields, 'sortFields' => $sortFields]);
    }

    public function products(Request $request)
    {
        $query = Product::with(['defaultImage:product_id,image', 'brand:id,name']);

        $query->leftJoin('product_inventories', 'products.id', '=', 'product_inventories.product_id')
            ->select('products.*', 'product_inventories.stock');

        if($request->query('minStock')) {
            $query->where('product_inventories.stock', '>=', $request->query('minStock'));
        }

        if($request->query('minAvailableStock')) {
            $query->leftJoin(DB::raw('(SELECT product_id, SUM(quantity) as total_ordered FROM order_items oi INNER JOIN orders o ON oi.order_id = o.id WHERE o.status IN ("pending", "paid", "completed") GROUP BY product_id) as ordered'), 'products.id', '=', 'ordered.product_id')
                ->addSelect(DB::raw('product_inventories.stock - COALESCE(ordered.total_ordered, 0) as available_stock'))
                ->whereRaw('(product_inventories.stock - COALESCE(ordered.total_ordered, 0)) >= ?', [$request->query('minAvailableStock')]);
        }

        if ($request->query('useImage')) {
            $query->whereHas('defaultImage');
        }

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
            $query->where('products.id', $id);
        } elseif ($barcode !== '') {
            $query->where('products.barcode', $barcode);
        } elseif ($name !== '') {
            $query->where('products.name', 'like', "%$name%");
        } elseif ($search !== '') {
            $query->where(function($q) use ($search) {
                $q->where('products.barcode', $search)
                  ->orWhere('products.name', 'like', "%$search%");
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

        $product = Product::create([
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

    public function edit(Product $product)
    {
        $product = $product->load(['images', 'brand', 'category']);
        Debugbar::info($product);
        return Inertia::render('Products/Edit', ['product' => $product]);
    }

    public function update(Product $product, ProductRequest $request)
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
    public function destroy(Product $product)
    {
        Debugbar::info($product);
        $product->delete();
        return redirect()->route('products.index');
    }

}

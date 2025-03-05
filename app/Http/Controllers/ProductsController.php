<?php

namespace App\Http\Controllers;

use App\Models\Products;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Http\Request;


class ProductsController extends Controller
{
    public function index(Request $request)
    {
        $products = Products::paginate(20);
        Debugbar::info($products);

        return json_encode([
            'products' => $products,
        ]);
    }
}

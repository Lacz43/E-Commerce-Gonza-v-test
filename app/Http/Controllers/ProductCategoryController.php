<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{
    public function categories()
    {
        $categories = ProductCategory::get();
        Debugbar::info($categories);
        return json_encode($categories);
    }
}

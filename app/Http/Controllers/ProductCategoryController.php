<?php

namespace App\Http\Controllers;

use App\Models\ProductCategory;
use Illuminate\Http\Request;

class ProductCategoryController extends Controller
{
    public function categories()
    {
        $categories = ProductCategory::get();
        return json_encode(['categories' => $categories]);
    }
}

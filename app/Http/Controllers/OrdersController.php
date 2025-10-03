<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Services\QueryFilters;
use Inertia\Inertia;

class OrdersController extends Controller
{
    public function index(Request $request)
    {
        $orders = (new QueryFilters($request))->apply(Order::query()->with(['user', 'orderItems.product']));
        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }
    
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $items = $request->items;

        // Check availability for each product
        foreach ($items as $item) {
            $product = Product::find($item['product_id']);
            if ($product->available_stock < $item['quantity']) {
                return response()->json([
                    'message' => "Stock insuficiente para el producto {$product->name}. Disponible: {$product->available_stock}, Solicitado: {$item['quantity']}"
                ], 400);
            }
        }

        // Create order and items in transaction
        try {
            $order = DB::transaction(function () use ($items) {
                $order = Order::create([
                    'user_id' => Auth::check() ? Auth::id() : null,
                    'status' => 'pending',
                ]);

                foreach ($items as $item) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item['product_id'],
                        'quantity' => $item['quantity'],
                        'price' => Product::find($item['product_id'])->price, // Assuming current price
                    ]);
                }

                return $order;
            });

            return response()->json(['order_id' => $order->id, 'message' => 'Orden creada exitosamente'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al crear la orden: ' . $e->getMessage()], 500);
        }
    }
}

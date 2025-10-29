<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\InventoryMovementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Services\QueryFilters;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;
use App\Settings\OrderSettings;

class OrdersController extends Controller
{
    public function index(Request $request)
    {
        $orders = (new QueryFilters($request))->apply(Order::query()->with(['user', 'orderItems.product']));

        $filters = Order::getFilterableFields();
        $sortables = Order::getSortableFields();
        $statuses = Order::getStatus();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
            'filters' => $filters,
            'sortables' => $sortables,
            'statuses' => $statuses,
        ]);
    }

    public function userOrders(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $orders = (new QueryFilters($request))->apply(Order::query()
            ->where('user_id', $user->id)
            ->with(['user', 'orderItems.product']));

        $count = Order::where('user_id', $user->id)->count();
        $pending = Order::where('user_id', $user->id)->where('status', 'pending')->count();
        $completed = Order::where('user_id', $user->id)->where('status', 'completed')->count();
        

        return Inertia::render('User/Orders', [
            'orders' => $orders,
            'count' => $count,
            'pending' => $pending,
            'completed' => $completed,
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'orderItems.product']);
        return response()->json($order);
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:cancelled,pending,expired,completed,paid',
        ]);

        $order->update(['status' => $request->status]);

        if ($request->status === 'completed') {
            $order->orderItems->each(function ($orderItem) {
                InventoryMovementService::inventoryMovement($orderItem->product_id, -$orderItem->quantity, Order::class, $orderItem->order_id, Auth::id());
            });
        }

        return response()->json(['message' => 'Estado actualizado exitosamente']);
    }

    public function cancel(Order $order)
    {
        if($order->user_id !== Auth::id()) {
            return response()->json(['message' => 'No tienes permisos para cancelar este pedido'], 403);
        }
        $order->update(['status' => 'cancelled']);
        return response()->json(['message' => 'Pedido cancelado exitosamente']);
    }

    public function store(Request $request)
    {
        // Rate limiting for guest users
        if (!Auth::check()) {
            $ip = $request->ip();
            $cacheKey = "guest_orders_{$ip}";
            $maxOrders = app(OrderSettings::class)->max_guest_orders_per_hour ?? 3; // Default to 3 if not set
            $orderCount = Cache::get($cacheKey, 0);

            // Allow maximum orders per hour per IP for guests
            if ($orderCount >= $maxOrders) {
                return response()->json([
                    'message' => 'Demasiados pedidos desde esta dirección IP. Por favor, regístrese para continuar.'
                ], 429);
            }
        }

        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $items = $request->items;

        // Calculate order total and validate guest limits
        $orderTotal = 0;
        $totalItems = 0;

        foreach ($items as $item) {
            $product = Product::find($item['product_id']);
            $orderTotal += $product->price * $item['quantity'];
            $totalItems += $item['quantity'];

            if ($product->available_stock < $item['quantity']) {
                return response()->json([
                    'message' => "Stock insuficiente para el producto {$product->name}. Disponible: {$product->available_stock}, Solicitado: {$item['quantity']}"
                ], 400);
            }
        }

        // Additional validations for guest users
        if (!Auth::check()) {
            $settings = app(OrderSettings::class);

            // Check order amount limit (only if set)
            if ($settings->max_guest_order_amount !== null && $orderTotal > $settings->max_guest_order_amount) {
                return response()->json([
                    'message' => "El monto total de la orden supera el límite máximo de $" . number_format($settings->max_guest_order_amount, 2) . " para usuarios no registrados."
                ], 400);
            }

            // Check total items limit (only if set)
            if ($settings->max_guest_order_items !== null && $totalItems > $settings->max_guest_order_items) {
                return response()->json([
                    'message' => "La cantidad total de productos supera el límite máximo de {$settings->max_guest_order_items} items por orden para usuarios no registrados."
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

            // Increment order counter for guest users
            if (!Auth::check()) {
                $ip = $request->ip();
                $cacheKey = "guest_orders_{$ip}";
                Cache::put($cacheKey, Cache::get($cacheKey, 0) + 1, now()->addHour()); // Expire in 1 hour
            }

            return response()->json(['order_id' => $order->id, 'message' => 'Orden creada exitosamente'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error al crear la orden: ' . $e->getMessage()], 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\InventoryMovement;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MetricsController extends Controller
{
    public function getProductMetrics(Request $request)
    {
        // Movimientos de inventario por tipo (in/out) agrupados por mes
        $movements = InventoryMovement::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            'type',
            DB::raw('SUM(quantity) as total_quantity')
        )
        ->groupBy('month', 'type')
        ->orderBy('month')
        ->get()
        ->groupBy('month');

        // Stock total actual
        $totalStock = DB::table('product_inventories')->sum('stock');

        // Productos con bajo stock (ej. < 10)
        $lowStockProducts = DB::table('product_inventories')
            ->join('products', 'product_inventories.product_id', '=', 'products.id')
            ->where('product_inventories.stock', '<', 10)
            ->select('products.name', 'product_inventories.stock')
            ->get();

        return response()->json([
            'movements' => $movements,
            'total_stock' => $totalStock,
            'low_stock_products' => $lowStockProducts,
        ]);
    }

    public function getOrderMetrics(Request $request)
    {
        // Pedidos por mes
        $ordersByMonth = Order::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('COUNT(*) as total_orders'),
            'status'
        )
        ->groupBy('month', 'status')
        ->orderBy('month')
        ->get()
        ->groupBy('month');

        // Ingresos por mes (sum de quantity * price en order_items para orders completadas/pagadas)
        $revenueByMonth = DB::table('orders')
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->whereIn('orders.status', ['completed', 'paid'])
            ->select(
                DB::raw('DATE_FORMAT(orders.created_at, "%Y-%m") as month'),
                DB::raw('SUM(order_items.quantity * order_items.price) as total_revenue')
            )
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'orders_by_month' => $ordersByMonth,
            'revenue_by_month' => $revenueByMonth,
        ]);
    }

    public function dashboard(Request $request)
    {
        $productMetrics = $this->getProductMetrics($request)->getData();
        $orderMetrics = $this->getOrderMetrics($request)->getData();

        return response()->json([
            'product_metrics' => $productMetrics,
            'order_metrics' => $orderMetrics,
        ]);
    }
}

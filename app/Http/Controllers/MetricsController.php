<?php

namespace App\Http\Controllers;

use App\Models\InventoryMovement;
use App\Models\Order;
use App\Models\OrderItem;
use Barryvdh\Debugbar\Facades\Debugbar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MetricsController extends Controller
{
    public function getProductMetrics(Request $request)
    {
        $period = $request->query('period', 'monthly');
        $dateFormat = $this->getDateFormat($period);

        $query = InventoryMovement::select(
            DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
            'type',
            DB::raw('SUM(quantity) as total_quantity')
        );

        if ($period === 'custom') {
            $start = $this->getStartDate($request);
            $end = $this->getEndDate($request);
            $query->whereBetween('created_at', [$start, $end]);
        } else {
            $start = $this->getStartDate($request);
            $query->where('created_at', '>=', $start);
        }

        $movements = $query
            ->groupBy('period', 'type')
            ->orderBy('period')
            ->get()
            ->groupBy('period');

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
        $period = $request->query('period', 'monthly');
        $dateFormat = $this->getDateFormat($period);

        $ordersQuery = Order::select(
            DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
            DB::raw('COUNT(*) as total_orders'),
            'status'
        );

        $revenueQuery = DB::table('orders')
            ->join('order_items', 'orders.id', '=', 'order_items.order_id')
            ->whereIn('orders.status', ['completed', 'paid'])
            ->select(
                DB::raw("DATE_FORMAT(orders.created_at, '{$dateFormat}') as period"),
                DB::raw('SUM(order_items.quantity * order_items.price) as total_revenue')
            );

        if ($period === 'custom') {
            $start = $this->getStartDate($request);
            $end = $this->getEndDate($request);
            $ordersQuery->whereBetween('created_at', [$start, $end]);
            $revenueQuery->whereBetween('orders.created_at', [$start, $end]);
        } else {
            $start = $this->getStartDate($request);
            $ordersQuery->where('created_at', '>=', $start);
            $revenueQuery->where('orders.created_at', '>=', $start);
        }

        $ordersByMonth = $ordersQuery
            ->groupBy('period', 'status')
            ->orderBy('period')
            ->get()
            ->groupBy('period');

        $revenueByMonth = $revenueQuery
            ->groupBy('period')
            ->orderBy('period')
            ->get();

        $type = $request->query('type', 'sold');
        $topProducts = $this->buildTopProductsQuery($type, $request)->get();

        return response()->json([
            'orders_by_month' => $ordersByMonth,
            'revenue_by_month' => $revenueByMonth,
            'top_products' => $topProducts,
        ]);
    }

    private function getDateFormat($period)
    {
        switch ($period) {
            case 'daily':
                return '%Y-%m-%d';
            case 'weekly':
                return '%Y-%U';
            case 'monthly':
                return '%Y-%m';
            case 'annual':
                return '%Y';
            case 'custom':
                return '%Y-%m-%d'; // for custom range, use daily granularity
            default:
                return '%Y-%m';
        }
    }

    private function getStartDate($request)
    {
        $period = $request->query('period');
        $now = now();

        if ($period === 'custom') {
            $start = $request->query('start_date');
            // For custom, we use start_date as start, but in where, we'll use between if needed
            return $start ? \Carbon\Carbon::parse($start) : $now->subMonths(12);
        }

        switch ($period) {
            case 'daily':
                return $now->subDays(1);
            case 'weekly':
                return $now->subWeeks(1);
            case 'monthly':
                return $now->subMonths(1);
            case 'annual':
                return $now->subYears(1);
            default:
                return $now->subMonths(12);
        }
    }

    private function getEndDate($request)
    {
        $period = $request->query('period');
        $now = now();

        if ($period === 'custom') {
            $end = $request->query('end_date');
            return $end ? \Carbon\Carbon::parse($end) : $now;
        }

        return $now;
    }

    private function buildTopProductsQuery($type, $request)
    {
        $period = $request->query('period', 'monthly');
        $limit = $request->query('limit', 10);

        if ($type === 'sold') {
            $query = DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->whereIn('orders.status', ['completed', 'paid'])
                ->select(
                    'products.name',
                    DB::raw('SUM(order_items.quantity) as total_sold'),
                    DB::raw('(SELECT image FROM product_images WHERE product_id = order_items.product_id AND `default` = 1 LIMIT 1) as image')
                )
                ->groupBy('order_items.product_id', 'products.name')
                ->orderBy('total_sold', 'desc')
                ->limit($limit);

            if ($period === 'custom') {
                $start = $this->getStartDate($request);
                $end = $this->getEndDate($request);
                $query->whereBetween('orders.created_at', [$start, $end]);
            } else {
                $start = $this->getStartDate($request);
                $query->where('orders.created_at', '>=', $start);
            }

            return $query;
        } elseif ($type === 'rating') {
            $query = DB::table('products')
                ->leftJoin('product_reviews', 'products.id', '=', 'product_reviews.product_id')
                ->select(
                    'products.name',
                    DB::raw('AVG(product_reviews.rating) as average_rating'),
                    DB::raw('(SELECT image FROM product_images WHERE product_id = products.id AND `default` = 1 LIMIT 1) as image')
                )
                ->groupBy('products.id', 'products.name')
                ->havingRaw('AVG(product_reviews.rating) IS NOT NULL')
                ->orderBy('average_rating', 'desc')
                ->limit($limit);

            if ($period === 'custom') {
                $start = $this->getStartDate($request);
                $end = $this->getEndDate($request);
                $query->whereBetween('product_reviews.created_at', [$start, $end]);
            } else {
                $start = $this->getStartDate($request);
                $query->where('product_reviews.created_at', '>=', $start);
            }


            return $query;
        }

        throw new \InvalidArgumentException('Invalid type');
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

    public function getTopProducts(Request $request)
    {
        $type = $request->query('type', 'sold');

        try {
            $topProducts = $this->buildTopProductsQuery($type, $request)->get();
            return response()->json($topProducts);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}

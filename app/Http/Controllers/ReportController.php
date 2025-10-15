<?php

namespace App\Http\Controllers;

use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\User;
use App\Models\Order;
use App\Models\InventoryMovement as InventoryMovementModel;
use App\Settings\GeneralSettings;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Mpdf\Mpdf;

class ReportController extends Controller
{
    /**
     * Dashboard de reportes del sistema.
     */
    public function index(Request $request)
    {
        // Aquí se pueden agregar métricas y datos para los reportes
        $data = [
            'totalProducts' => Product::count(),
            'totalMovements' => InventoryMovement::count(),
            'totalOrders' => Order::count(),
            'totalUsers' => User::count(),
        ];

        return Inertia::render('Reports/Index', [
            'data' => $data,
        ]);
    }

    /**
     * Vista de reportes de inventario.
     */
    public function inventory(Request $request)
    {
        return Inertia::render('Reports/Inventory');
    }

    /**
     * Generar PDF de un movimiento de inventario.
     */
    public function downloadMovement(InventoryMovement $movement): Response
    {
        $movement->load(['productInventory.product', 'user', 'reason']);

        $settings = app(GeneralSettings::class);

        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 15,
            'margin_right' => 15,
            'margin_top' => 20,
            'margin_bottom' => 20,
        ]);

        $html = view('pdf.movements.movement_pdf', compact('movement', 'settings'))->render();

        $mpdf->WriteHTML($html);

        $filename = 'movimiento_' . $movement->id . '_' . date('Y-m-d') . '.pdf';

        return response($mpdf->Output($filename, 'S'), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Generar PDF de reporte de productos.
     */
    public function downloadProductsReport(Request $request): Response
    {
        $settings = app(GeneralSettings::class);

        $products = Product::with('productInventory')->get();

        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 15,
            'margin_right' => 15,
            'margin_top' => 20,
            'margin_bottom' => 20,
        ]);

        $html = view('pdf.products.products_report', compact('settings', 'products'))->render();

        $mpdf->WriteHTML($html);

        $filename = 'reporte_productos_' . date('Y-m-d') . '.pdf';

        return response($mpdf->Output($filename, 'S'), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Aplicar filtros opcionales a la query de inventario.
     */
    private function applyInventoryFilters($query, Request $request)
    {
        if ($request->has('stock_min') && $request->stock_min !== '') {
            $query->where('stock', '>=', $request->stock_min);
        }

        if ($request->has('stock_max') && $request->stock_max !== '') {
            $query->where('stock', '<=', $request->stock_max);
        }

        if ($request->has('created_from') && $request->created_from !== '') {
            $query->whereDate('created_at', '>=', $request->created_from);
        }

        if ($request->has('created_to') && $request->created_to !== '') {
            $query->whereDate('created_at', '<=', $request->created_to);
        }

        if ($request->has('updated_from') && $request->updated_from !== '') {
            $query->whereDate('updated_at', '>=', $request->updated_from);
        }

        if ($request->has('updated_to') && $request->updated_to !== '') {
            $query->whereDate('updated_at', '<=', $request->updated_to);
        }

        return $query;
    }

    /**
     * Generar PDF del estado general del inventario.
     */
    public function downloadInventoryStatus(Request $request): Response
    {
        $settings = app(GeneralSettings::class);

        $query = ProductInventory::with('product');
        $query = $this->applyInventoryFilters($query, $request);
        $inventory = $query->get();

        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 15,
            'margin_right' => 15,
            'margin_top' => 20,
            'margin_bottom' => 20,
        ]);

        $title = 'Estado General del Inventario';
        $html = view('pdf.inventory.status', compact('settings', 'inventory', 'title'))->render();

        $mpdf->WriteHTML($html);

        $filename = 'estado_inventario_' . date('Y-m-d') . '.pdf';

        return response($mpdf->Output($filename, 'S'), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Generar PDF de productos con stock bajo.
     */
    public function downloadLowStockReport(Request $request): Response
    {
        $settings = app(GeneralSettings::class);

        $query = ProductInventory::with('product');
        $query = $this->applyInventoryFilters($query, $request);

        // Consideramos stock bajo cuando es menor o igual a 10 unidades
        $lowStockProducts = $query->where('stock', '<=', 10)
            ->where('stock', '>', 0)
            ->get();

        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 15,
            'margin_right' => 15,
            'margin_top' => 20,
            'margin_bottom' => 20,
        ]);

        $title = 'Productos con Stock Bajo';
        $html = view('pdf.inventory.low-stock', compact('settings', 'lowStockProducts', 'title'))->render();

        $mpdf->WriteHTML($html);

        $filename = 'productos_stock_bajo_' . date('Y-m-d') . '.pdf';

        return response($mpdf->Output($filename, 'S'), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Generar PDF de valoración del inventario.
     */
    public function downloadInventoryValuation(Request $request): Response
    {
        $settings = app(GeneralSettings::class);

        $query = ProductInventory::with('product');
        $query = $this->applyInventoryFilters($query, $request);
        $inventory = $query->get();

        // Calcular valoración total
        $totalValue = $inventory->sum(function ($item) {
            return $item->stock * ($item->product->price ?? 0);
        });

        $mpdf = new Mpdf([
            'mode' => 'utf-8',
            'format' => 'A4',
            'margin_left' => 15,
            'margin_right' => 15,
            'margin_top' => 20,
            'margin_bottom' => 20,
        ]);

        $title = 'Valoración del Inventario';
        $html = view('pdf.inventory.valuation', compact('settings', 'inventory', 'totalValue', 'title'))->render();

        $mpdf->WriteHTML($html);

        $filename = 'valoracion_inventario_' . date('Y-m-d') . '.pdf';

        return response($mpdf->Output($filename, 'S'), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}

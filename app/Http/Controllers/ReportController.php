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
}

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

        $html = $this->generateMovementHtml($movement, $settings);

        $mpdf->WriteHTML($html);

        $filename = 'movimiento_' . $movement->id . '_' . date('Y-m-d') . '.pdf';

        return response($mpdf->Output($filename, 'S'), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Generar HTML para el PDF del movimiento.
     */
    private function generateMovementHtml(InventoryMovement $movement, GeneralSettings $settings): string
    {
        $logoHtml = '';
        if ($settings->company_logo) {
            $logoPath = storage_path('app/public/' . $settings->company_logo);
            if (file_exists($logoPath)) {
                $logoData = base64_encode(file_get_contents($logoPath));
                $logoHtml = '<img src="data:image/png;base64,' . $logoData . '" style="max-height: 80px; max-width: 200px;" />';
            }
        }

        $reasonText = $movement->reason ? $movement->reason->name : 'Sin especificar';

        return '
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Reporte de Movimiento de Inventario</title>
            <style>
                body { font-family: Arial, sans-serif; font-size: 12px; }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
                .company-info { margin-bottom: 20px; }
                .movement-info { margin: 20px 0; }
                .info-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                .info-table td { padding: 5px; border: 1px solid #ddd; }
                .info-table .label { background-color: #f5f5f5; font-weight: bold; width: 30%; }
                .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                ' . $logoHtml . '
                <h1>Reporte de Movimiento de Inventario</h1>
                <h2>' . ($settings->company_name ?: 'Empresa') . '</h2>
            </div>

            <div class="company-info">
                <table class="info-table">
                    <tr>
                        <td class="label">Empresa:</td>
                        <td>' . ($settings->company_name ?: 'N/A') . '</td>
                    </tr>
                    <tr>
                        <td class="label">Teléfono:</td>
                        <td>' . ($settings->company_phone ?: 'N/A') . '</td>
                    </tr>
                    <tr>
                        <td class="label">Email:</td>
                        <td>' . ($settings->company_email ?: 'N/A') . '</td>
                    </tr>
                    <tr>
                        <td class="label">Dirección:</td>
                        <td>' . ($settings->company_address ?: 'N/A') . '</td>
                    </tr>
                    <tr>
                        <td class="label">RIF:</td>
                        <td>' . ($settings->company_rif ?: 'N/A') . '</td>
                    </tr>
                </table>
            </div>

            <div class="movement-info">
                <h3>Información del Movimiento</h3>
                <table class="info-table">
                    <tr>
                        <td class="label">ID del Movimiento:</td>
                        <td>' . $movement->id . '</td>
                    </tr>
                    <tr>
                        <td class="label">Producto:</td>
                        <td>' . ($movement->productInventory->product->name ?? 'N/A') . '</td>
                    </tr>
                    <tr>
                        <td class="label">Código del Producto:</td>
                        <td>' . ($movement->productInventory->product->barcode ?? 'N/A') . '</td>
                    </tr>
                    <tr>
                        <td class="label">Tipo de Movimiento:</td>
                        <td>' . ($movement->type === 'ingress' ? 'Entrada' : 'Salida') . '</td>
                    </tr>
                    <tr>
                        <td class="label">Cantidad:</td>
                        <td>' . $movement->quantity . '</td>
                    </tr>
                    <tr>
                        <td class="label">Stock Anterior:</td>
                        <td>' . $movement->previous_stock . '</td>
                    </tr>
                    <tr>
                        <td class="label">Stock Posterior:</td>
                        <td>' . ($movement->previous_stock + $movement->quantity) . '</td>
                    </tr>
                    <tr>
                        <td class="label">Razón:</td>
                        <td>' . $reasonText . '</td>
                    </tr>
                    <tr>
                        <td class="label">Usuario:</td>
                        <td>' . ($movement->user->name ?? 'N/A') . '</td>
                    </tr>
                    <tr>
                        <td class="label">Fecha:</td>
                        <td>' . $movement->created_at->format('d/m/Y H:i:s') . '</td>
                    </tr>
                </table>
            </div>

            <div class="footer">
                <p>Reporte generado el ' . date('d/m/Y H:i:s') . '</p>
                <p>Sistema de Gestión de Inventario - GonzaGo</p>
            </div>
        </body>
        </html>';
    }
}

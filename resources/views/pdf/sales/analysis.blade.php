<!-- resources/views/pdf/sales/analysis.blade.php -->
@extends('pdf.base', compact('settings', 'title'))

@section('content')
<div style="margin: 20px 0;">
    <!-- Métricas principales -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
        <div style="padding: 20px; background-color: #e8f5e8; border-radius: 8px; border-left: 4px solid #2e7d32;">
            <h3 style="margin: 0 0 10px 0; color: #2e7d32; font-size: 14px;">Total de Órdenes</h3>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #2e7d32;">{{ $totalOrders }}</p>
        </div>

        <div style="padding: 20px; background-color: #e3f2fd; border-radius: 8px; border-left: 4px solid #1976d2;">
            <h3 style="margin: 0 0 10px 0; color: #1976d2; font-size: 14px;">Ingresos Totales</h3>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #1976d2;">${{ number_format($totalRevenue, 2) }}</p>
        </div>

        <div style="padding: 20px; background-color: #fff3e0; border-radius: 8px; border-left: 4px solid #f57c00;">
            <h3 style="margin: 0 0 10px 0; color: #f57c00; font-size: 14px;">Órdenes Completadas</h3>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #f57c00;">{{ $completedOrdersCount }}</p>
        </div>

        <div style="padding: 20px; background-color: #fce4ec; border-radius: 8px; border-left: 4px solid #c2185b;">
            <h3 style="margin: 0 0 10px 0; color: #c2185b; font-size: 14px;">Órdenes Pendientes</h3>
            <p style="margin: 0; font-size: 24px; font-weight: bold; color: #c2185b;">{{ $pendingOrders }}</p>
        </div>
    </div>

    @if($orders->count() > 0)
        <!-- Estadísticas adicionales -->
        <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
            <h4 style="margin: 0 0 15px 0; color: #333;">Estadísticas del Período</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                <div>
                    <strong>Tasa de conversión:</strong><br>
                    {{ $totalOrders > 0 ? round(($completedOrdersCount / $totalOrders) * 100, 1) : 0 }}%
                </div>
                <div>
                    <strong>Ticket promedio:</strong><br>
                    ${{ $completedOrdersCount > 0 ? number_format($totalRevenue / $completedOrdersCount, 2) : '0.00' }}
                </div>
                <div>
                    <strong>Órdenes canceladas:</strong><br>
                    {{ $cancelledOrders }}
                </div>
                <div>
                    <strong>Valor promedio por orden:</strong><br>
                    ${{ $totalOrders > 0 ? number_format($orders->sum(function($order) { return $order->orderItems->sum(function($item) { return $item->quantity * $item->price; }); }) / $totalOrders, 2) : '0.00' }}
                </div>
            </div>
        </div>
    @else
        <div style="text-align: center; padding: 40px; background-color: #f9f9f9; border-radius: 5px;">
            <p style="font-size: 16px; color: #666; margin: 0;">
                No se encontraron órdenes que coincidan con los filtros aplicados.
            </p>
        </div>
    @endif
</div>
@endsection

@push('styles')
<style>
    table { font-size: 10px; }
    th { background-color: #f5f5f5 !important; }
    .page-break { page-break-before: always; }
    h3 { color: #333 !important; }
    h4 { color: #333 !important; margin-bottom: 15px !important; }
</style>
@endpush

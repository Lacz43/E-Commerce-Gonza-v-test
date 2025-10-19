<!-- resources/views/pdf/inventory/valuation.blade.php -->
@extends('pdf.base', compact('settings', 'title'))

@section('content')
<div class="inventory-valuation">
    <!-- Resumen Ejecutivo -->
    <div style="margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #dee2e6;">
        <h3 style="margin: 0 0 15px 0; color: #495057; text-align: center;">💰 Valoración Total del Inventario</h3>
        <div style="text-align: center;">
            <span style="font-size: 24px; font-weight: bold; color: #28a745;">
                {{ $settings->currency === "VES" ? "Bs" : "$" }} {{ number_format($totalValue, 2) }}
            </span>
            <p style="margin: 5px 0 0 0; color: #6c757d; font-size: 14px;">
                Valor total basado en precios de venta
            </p>
        </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
            <tr style="background-color: #f8f9fa;">
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: left; font-weight: bold;">Producto</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center; font-weight: bold;">Stock</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center; font-weight: bold;">Precio Unit.</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center; font-weight: bold;">Valor Total</th>
                <th style="border: 1px solid #dee2e6; padding: 12px; text-align: center; font-weight: bold;">% del Total</th>
            </tr>
        </thead>
        <tbody>
            @php
                $runningTotal = 0;
            @endphp
            @foreach($inventory as $item)
                @php
                    $itemValue = $item->stock * ($item->product->price ?? 0);
                    $runningTotal += $itemValue;
                    $percentage = $totalValue > 0 ? ($itemValue / $totalValue) * 100 : 0;
                @endphp
            <tr>
                <td style="border: 1px solid #dee2e6; padding: 12px; font-weight: 500;">
                    {{ $item->product->name ?? 'Producto no encontrado' }}
                    @if($item->location)
                        <br><small style="color: #6c757d;">Ubicación: {{ $item->location }}</small>
                    @endif
                </td>
                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">
                    {{ $item->stock }}
                </td>
                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">
                    {{ $settings->currency === "VES" ? "Bs" : "$" }} {{ number_format($item->product->price ?? 0, 2) }}
                </td>
                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center; font-weight: bold;">
                    {{ $settings->currency === "VES" ? "Bs" : "$" }} {{ number_format($itemValue, 2) }}
                </td>
                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">
                    {{ number_format($percentage, 2) }}%
                </td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr style="background-color: #e9ecef; font-weight: bold;">
                <td colspan="3" style="border: 1px solid #dee2e6; padding: 12px; text-align: right; font-weight: bold;">
                    TOTAL DEL INVENTARIO:
                </td>
                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center; font-size: 16px; color: #28a745;">
                    {{ $settings->currency === "VES" ? "Bs" : "$" }} {{ number_format($totalValue, 2) }}
                </td>
                <td style="border: 1px solid #dee2e6; padding: 12px; text-align: center;">
                    100.00%
                </td>
            </tr>
        </tfoot>
    </table>

    <!-- Análisis Adicional -->
    <div style="margin-top: 30px; display: flex; gap: 20px;">
        <div style="flex: 1; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #495057;">📊 Estadísticas</h4>
            <p style="margin: 5px 0;"><strong>Productos totales:</strong> {{ $inventory->count() }}</p>
            <p style="margin: 5px 0;"><strong>Productos con valor:</strong> {{ $inventory->where('product.price', '>', 0)->count() }}</p>
            <p style="margin: 5px 0;"><strong>Productos sin precio:</strong> {{ $inventory->where('product.price', null)->count() }}</p>
        </div>

        <div style="flex: 1; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <h4 style="margin: 0 0 10px 0; color: #495057;">💡 Observaciones</h4>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Valor calculado basado en precios de venta</li>
                <li>Productos sin precio asignado aparecen con valor $0</li>
                <li>Este reporte es útil para seguros y análisis financiero</li>
            </ul>
        </div>
    </div>
</div>
@endsection

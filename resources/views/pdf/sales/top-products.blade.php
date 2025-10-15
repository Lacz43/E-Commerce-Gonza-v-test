<!-- resources/views/pdf/sales/top-products.blade.php -->
@extends('pdf.base', compact('settings', 'title'))

@section('content')
<div style="margin: 20px 0;">
    @if($topProducts->count() > 0)
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr style="background-color: #f5f5f5;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">Posición</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: bold;">Producto</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">Unidades Vendidas</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">Ingresos Generados</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">Precio Unitario Promedio</th>
                </tr>
            </thead>
            <tbody>
                @foreach($topProducts as $index => $product)
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; font-size: 14px;">
                        {{ $index + 1 }}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                        <strong>{{ $product->product->name ?? 'Producto no encontrado' }}</strong>
                        @if($product->product && $product->product->sku)
                            <br><small style="color: #666;">SKU: {{ $product->product->sku }}</small>
                        @endif
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; color: #1976d2;">
                        {{ number_format($product->total_quantity) }}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold; color: #2e7d32;">
                        ${{ number_format($product->total_revenue, 2) }}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">
                        ${{ $product->total_quantity > 0 ? number_format($product->total_revenue / $product->total_quantity, 2) : '0.00' }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Resumen -->
        <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
            <h4 style="margin: 0 0 15px 0; color: #333;">Resumen de Ventas por Producto</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div>
                    <strong>Total de productos vendidos:</strong><br>
                    <span style="font-size: 18px; font-weight: bold; color: #1976d2;">
                        {{ number_format($topProducts->sum('total_quantity')) }}
                    </span>
                </div>
                <div>
                    <strong>Ingresos totales:</strong><br>
                    <span style="font-size: 18px; font-weight: bold; color: #2e7d32;">
                        ${{ number_format($topProducts->sum('total_revenue'), 2) }}
                    </span>
                </div>
                <div>
                    <strong>Producto más vendido:</strong><br>
                    <span style="font-weight: bold;">
                        {{ $topProducts->first()->product->name ?? 'N/A' }}
                    </span><br>
                    <small style="color: #666;">
                        {{ number_format($topProducts->first()->total_quantity) }} unidades
                    </small>
                </div>
                <div>
                    <strong>Mayor generador de ingresos:</strong><br>
                    <span style="font-weight: bold;">
                        {{ $topProducts->sortByDesc('total_revenue')->first()->product->name ?? 'N/A' }}
                    </span><br>
                    <small style="color: #666;">
                        ${{ number_format($topProducts->sortByDesc('total_revenue')->first()->total_revenue, 2) }}
                    </small>
                </div>
            </div>
        </div>
    @else
        <div style="text-align: center; padding: 40px; background-color: #f9f9f9; border-radius: 5px;">
            <p style="font-size: 16px; color: #666; margin: 0;">
                No se encontraron productos vendidos en el período seleccionado.
            </p>
        </div>
    @endif
</div>
@endsection

@push('styles')
<style>
    table { font-size: 11px; }
    th { background-color: #f5f5f5 !important; }
    .page-break { page-break-before: always; }
    h4 { color: #333 !important; margin-bottom: 15px !important; }
</style>
@endpush

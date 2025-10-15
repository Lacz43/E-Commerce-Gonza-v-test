<!-- resources/views/pdf/inventory/low-stock.blade.php -->
@extends('pdf.base')

@section('content')
<div class="low-stock-report">
    <p style="text-align: center; margin-bottom: 20px; color: #666;">
        Reporte generado el {{ date('d/m/Y H:i') }}
    </p>
    <p style="text-align: center; margin-bottom: 20px; color: #d32f2f; font-weight: bold;">
        ⚠️ Productos que requieren atención inmediata para reabastecimiento
    </p>

    @if($lowStockProducts->count() > 0)
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr style="background-color: #ffebee;">
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: left; font-weight: bold; color: #d32f2f;">Producto</th>
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold; color: #d32f2f;">Stock Actual</th>
                    <th style="border: 1px solid #ddd; padding: 10px; text-align: center; font-weight: bold; color: #d32f2f;">Prioridad</th>
                </tr>
            </thead>
            <tbody>
                @foreach($lowStockProducts as $item)
                <tr>
                    <td style="border: 1px solid #ddd; padding: 10px; font-weight: bold;">
                        {{ $item->product->name ?? 'Producto no encontrado' }}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center; color: #d32f2f; font-weight: bold;">
                        {{ $item->stock }}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 10px; text-align: center;">
                        @if($item->stock == 0)
                            <span style="background-color: #d32f2f; color: white; padding: 3px 8px; border-radius: 3px; font-weight: bold;">CRÍTICA</span>
                        @elseif($item->stock <= 3)
                            <span style="background-color: #f57c00; color: white; padding: 3px 8px; border-radius: 3px; font-weight: bold;">ALTA</span>
                        @else
                            <span style="background-color: #f9a825; color: white; padding: 3px 8px; border-radius: 3px; font-weight: bold;">MEDIA</span>
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div style="text-align: center; margin: 50px 0; padding: 30px; background-color: #e8f5e8; border: 1px solid #c8e6c9; border-radius: 5px;">
            <h3 style="color: #388e3c; margin-bottom: 10px;">✅ ¡Excelente estado del inventario!</h3>
            <p style="color: #388e3c; margin: 0;">No hay productos con stock bajo en este momento.</p>
        </div>
    @endif
</div>
@endsection

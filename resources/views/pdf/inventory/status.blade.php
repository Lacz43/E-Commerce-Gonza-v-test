<!-- resources/views/pdf/inventory/status.blade.php -->
@extends('pdf.base')

@section('content')
<div class="inventory-status">
    <h2 style="text-align: center; margin-bottom: 30px; color: #333;">Estado General del Inventario</h2>
    <p style="text-align: center; margin-bottom: 20px; color: #666;">
        Reporte generado el {{ date('d/m/Y H:i') }}
    </p>

    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <thead>
            <tr style="background-color: #f5f5f5;">
                <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: bold;">Producto</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">Stock Actual</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($inventory as $item)
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">
                    {{ $item->product->name ?? 'Producto no encontrado' }}
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                    {{ $item->stock }}
                </td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                    @if($item->stock <= 0)
                        <span style="color: #d32f2f; font-weight: bold;">BAJO</span>
                    @elseif($item->stock <= 3)
                        <span style="color: #f57c00; font-weight: bold;">MEDIO</span>
                    @else
                        <span style="color: #388e3c; font-weight: bold;">BUENO</span>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
        <h3 style="margin: 0 0 10px 0; color: #333;">Resumen del Inventario</h3>
        <p style="margin: 5px 0;"><strong>Total de productos:</strong> {{ $inventory->count() }}</p>
        <p style="margin: 5px 0;"><strong>Productos con stock bajo:</strong> {{ $inventory->where('stock', '<=', 10)->count() }}</p>
        <p style="margin: 5px 0;"><strong>Productos sin stock:</strong> {{ $inventory->where('stock', 0)->count() }}</p>
    </div>
</div>
@endsection

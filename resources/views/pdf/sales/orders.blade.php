<!-- resources/views/pdf/sales/orders.blade.php -->
@extends('pdf.base', compact('settings', 'title'))

@section('content')
<div style="margin: 20px 0;">
    @if($orders->count() > 0)
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr style="background-color: #f5f5f5;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: bold;">ID Orden</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: bold;">Fecha</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: bold;">Cliente</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">Estado</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">Total</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: bold;">Productos</th>
                </tr>
            </thead>
            <tbody>
                @foreach($orders as $order)
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">
                        #{{ $order->id }}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                        {{ $order->created_at->format('d/m/Y H:i') }}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                        {{ $order->user->name ?? 'Cliente no registrado' }}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                        <span style="padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;
                            @if($order->status === 'completed')
                                background-color: #e8f5e8; color: #2e7d32;
                            @elseif($order->status === 'pending')
                                background-color: #fff3e0; color: #ef6c00;
                            @elseif($order->status === 'cancelled')
                                background-color: #ffebee; color: #c62828;
                            @else
                                background-color: #f5f5f5; color: #666;
                            @endif">
                            @if($order->status === 'completed')
                                Completada
                            @elseif($order->status === 'pending')
                                Pendiente
                            @elseif($order->status === 'cancelled')
                                Cancelada
                            @elseif($order->status === 'refunded')
                                Reembolsada
                            @else
                                {{ ucfirst($order->status) }}
                            @endif
                        </span>
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">
                        ${{ number_format($order->orderItems->sum(function($item) { return $item->quantity * $item->price; }), 2) }}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                        @if($order->orderItems && $order->orderItems->count() > 0)
                            @foreach($order->orderItems as $item)
                                {{ $item->quantity }}x {{ $item->product->name ?? 'Producto' }}<br>
                            @endforeach
                        @else
                            Sin productos
                        @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Resumen -->
        <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
            <h4 style="margin: 0 0 15px 0; color: #333;">Resumen del Período</h4>
            <div style="display: flex; gap: 30px; flex-wrap: wrap;">
                <div>
                    <strong>Total de órdenes:</strong> {{ $orders->count() }}
                </div>
                <div>
                    <strong>Valor total:</strong> ${{ number_format($orders->sum(function($order) { return $order->orderItems->sum(function($item) { return $item->quantity * $item->price; }); }), 2) }}
                </div>
                <div>
                    <strong>Órdenes completadas:</strong> {{ $orders->where('status', 'completed')->count() }}
                </div>
                <div>
                    <strong>Órdenes pendientes:</strong> {{ $orders->where('status', 'pending')->count() }}
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
</style>
@endpush

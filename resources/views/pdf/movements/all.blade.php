<!-- resources/views/pdf/movements/all.blade.php -->
@extends('pdf.base', compact('settings', 'title'))

@section('content')
<div style="margin: 20px 0;">
    @if($movements->count() > 0)
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
                <tr style="background-color: #f5f5f5;">
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: bold;">Fecha</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: bold;">Producto</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">Tipo</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">Cantidad</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: bold;">Usuario</th>
                    <th style="border: 1px solid #ddd; padding: 8px; text-align: left; font-weight: bold;">Módulo</th>
                </tr>
            </thead>
            <tbody>
                @foreach($movements as $movement)
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                        {{ $movement->created_at->format('d/m/Y H:i') }}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                        {{ $movement->productInventory->product->name ?? 'N/A' }}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                        <span class="movement-type {{ $movement->type === 'ingress' ? 'entry-badge' : 'exit-badge' }}">
                            {{ $movement->type === 'ingress' ? 'Entrada' : 'Salida' }}
                        </span>
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold;">
                        {{ $movement->quantity }}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                        {{ $movement->user->name ?? 'Sistema' }}
                    </td>
                    <td style="border: 1px solid #ddd; padding: 8px;">
                        {{ $movement->controller_name ?? 'N/A' }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px;">
                <strong>Total de movimientos:</strong> {{ $movements->count() }}
            </p>
        </div>
    @else
        <div style="text-align: center; padding: 40px; background-color: #f9f9f9; border-radius: 5px;">
            <p style="font-size: 16px; color: #666; margin: 0;">
                No se encontraron movimientos que coincidan con los filtros aplicados.
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
    .movement-type {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: bold;
    }
    .entry-badge {
        background-color: #e8f5e8;
        color: #2e7d32;
    }
    .exit-badge {
        background-color: #ffebee;
        color: #c62828;
    }
</style>
@endpush

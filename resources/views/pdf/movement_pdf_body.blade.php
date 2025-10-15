<!-- resources/views/pdf/movement_pdf_body.blade.php -->
<div class="movement-info">
    <h3>Información del Movimiento</h3>
    <table class="info-table">
        <tr>
            <td class="label">ID del Movimiento:</td>
            <td>{{ $movement->id }}</td>
        </tr>
        <tr>
            <td class="label">Producto:</td>
            <td>{{ $movement->productInventory->product->name ?? 'N/A' }}</td>
        </tr>
        <tr>
            <td class="label">Código del Producto:</td>
            <td>{{ $movement->productInventory->product->barcode ?? 'N/A' }}</td>
        </tr>
        <tr>
            <td class="label">Tipo de Movimiento:</td>
            <td>{{ $movement->type === 'ingress' ? 'Entrada' : 'Salida' }}</td>
        </tr>
        <tr>
            <td class="label">Cantidad:</td>
            <td>{{ $movement->quantity }}</td>
        </tr>
        <tr>
            <td class="label">Stock Anterior:</td>
            <td>{{ $movement->previous_stock }}</td>
        </tr>
        <tr>
            <td class="label">Stock Posterior:</td>
            <td>{{ $movement->previous_stock + $movement->quantity }}</td>
        </tr>
        <tr>
            <td class="label">Razón:</td>
            <td>{{ $movement->reason ? $movement->reason->name : 'Sin especificar' }}</td>
        </tr>
        <tr>
            <td class="label">Usuario:</td>
            <td>{{ $movement->user->name ?? 'N/A' }}</td>
        </tr>
        <tr>
            <td class="label">Fecha:</td>
            <td>{{ $movement->created_at->format('d/m/Y H:i:s') }}</td>
        </tr>
    </table>
</div>

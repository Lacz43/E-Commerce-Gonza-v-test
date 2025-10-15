<!-- resources/views/pdf/products_report.blade.php -->
@php $title = 'Reporte de Productos' @endphp

@extends('pdf.base', compact('settings', 'title'))

@section('content')
<div class="products-info">
    <h3>Inventario de Productos</h3>
    <table class="info-table">
        <thead>
            <tr>
                <th class="label">ID</th>
                <th class="label">Nombre</th>
                <th class="label">Código</th>
                <th class="label">Stock</th>
                <th class="label">Precio</th>
            </tr>
        </thead>
        <tbody>
            @foreach($products ?? [] as $product)
            <tr>
                <td>{{ $product->id }}</td>
                <td>{{ $product->name }}</td>
                <td>{{ $product->barcode }}</td>
                <td>{{ $product->productInventory->stock ?? 0 }}</td>
                <td>{{ $product->price ?? 'N/A' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection

@push('styles')
<style>
    .products-info { margin: 20px 0; }
    .info-table th { background-color: #e0e0e0; font-weight: bold; text-align: left; }
</style>
@endpush

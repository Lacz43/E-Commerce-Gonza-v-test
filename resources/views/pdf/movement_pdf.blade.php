<!-- resources/views/pdf/movement_pdf.blade.php -->
@php $title = 'Reporte de Movimiento de Inventario' @endphp

@extends('pdf.base', compact('settings', 'title'))

@section('content')
    @include('pdf.movement_pdf_body', ['movement' => $movement, 'settings' => $settings])
@endsection

@push('styles')
<style>
    .movement-info { margin: 20px 0; }
</style>
@endpush

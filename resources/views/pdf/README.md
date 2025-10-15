<!--
PDF Templates Structure
========================

Los templates de PDF están organizados de manera modular para reutilización en todos los reportes del sistema.

Estructura:
- base.blade.php                    -> Template base con estilos comunes y estructura
- header.blade.php                  -> Header genérico con logo y título configurable
- footer.blade.php                  -> Footer genérico con fecha y marca
- [report_name].blade.php           -> Templates específicos que extienden base.blade.php
- [report_name]_body.blade.php      -> Contenido específico del reporte

Templates de ejemplo:
- movement_pdf.blade.php            -> Reporte de movimientos de inventario
- movement_pdf_body.blade.php       -> Contenido específico de movimientos
- products_report.blade.php         -> Ejemplo de reporte de productos

Uso:
1. Crear un template específico que extienda 'pdf.base'
2. Definir $title en el template específico
3. Implementar la sección @section('content')
4. Opcionalmente agregar estilos específicos con @push('styles')

Ejemplo:
```blade
@php $title = 'Mi Reporte Personalizado' @endphp
@extends('pdf.base', compact('settings', 'title'))

@section('content')
    <!-- Contenido específico del reporte -->
@endsection

@push('styles')
<style>
    /* Estilos específicos si son necesarios */
</style>
@endpush
```

Ventajas:
- Header y Footer consistentes en todos los reportes
- Reutilización completa de componentes comunes
- Fácil creación de nuevos reportes
- Mantenimiento centralizado de estilos y estructura
- Separación clara entre layout y contenido específico
-->

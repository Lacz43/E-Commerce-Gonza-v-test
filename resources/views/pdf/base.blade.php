<!-- resources/views/pdf/base.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title ?? 'Reporte del Sistema' }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .info-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .info-table td { padding: 5px; border: 1px solid #ddd; }
        .info-table .label { background-color: #f5f5f5; font-weight: bold; width: 30%; }
        .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #666; }
        .page-break { page-break-before: always; }
    </style>
    @stack('styles')
</head>
<body>
    @include('pdf.header', ['settings' => $settings, 'title' => $title])

    @yield('content')

    @include('pdf.footer')
</body>
</html>

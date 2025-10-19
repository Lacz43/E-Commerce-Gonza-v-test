<!-- resources/views/pdf/header.blade.php -->
<div class="header" style="margin-bottom: 20px;">
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="width: 60%; vertical-align: top;">
                @if($settings->company_logo && file_exists(storage_path('app/public/' . $settings->company_logo)))
                @php
                    $logoPath = storage_path('app/public/' . $settings->company_logo);
                    $logoData = @file_get_contents($logoPath);
                    if ($logoData !== false) {
                        $logoBase64 = base64_encode($logoData);
                @endphp
                <img src="data:image/png;base64,{{ $logoBase64 }}" style="max-height: 60px; max-width: 150px; vertical-align: top;" />
                @php
                    }
                @endphp
                @endif
                <h2 style="margin: 5px 0; font-size: 14px;">{{ $settings->company_name ?: 'Empresa' }}</h2>
            </td>
            <td style="width: 40%; vertical-align: top; text-align: right; font-size: 10pt;">
                <strong>Teléfono:</strong> {{ $settings->company_phone ?: 'N/A' }}<br>
                <strong>Email:</strong> {{ $settings->company_email ?: 'N/A' }}<br>
                <strong>RIF:</strong> {{ $settings->company_rif ?: 'N/A' }}<br>
                <strong>Dirección:</strong> {{ $settings->company_address ?: 'N/A' }}<br>
                <strong>Generado por:</strong> {{ Auth::user()->name }}
            </td>
        </tr>
    </table>

    <div style="text-align: center; margin-top: 10px;">
        <h1 style="margin: 0; font-size: 18px;">{{ $title ?? 'Reporte del Sistema' }}</h1>
    </div>
</div>
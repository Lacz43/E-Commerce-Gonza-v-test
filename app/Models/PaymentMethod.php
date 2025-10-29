<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'name',
        'account_details',
        'is_active',
    ];

    protected $casts = [
        'account_details' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Scopes
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Accessors
     */
    public function getTypeLabelAttribute()
    {
        return match($this->type) {
            'pago_movil' => 'Pago Móvil',
            'transferencia_bancaria' => 'Transferencia Bancaria',
            'zelle' => 'Zelle',
            'binance' => 'Binance',
            default => ucfirst(str_replace('_', ' ', $this->type))
        };
    }

    /**
     * Check if payment method is of specific type
     */
    public function isPagoMovil()
    {
        return $this->type === 'pago_movil';
    }

    public function isTransferenciaBancaria()
    {
        return $this->type === 'transferencia_bancaria';
    }

    public function isZelle()
    {
        return $this->type === 'zelle';
    }

    public function isBinance()
    {
        return $this->type === 'binance';
    }
}

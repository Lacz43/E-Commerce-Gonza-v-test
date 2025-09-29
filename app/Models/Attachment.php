<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attachment extends Model
{
    protected $fillable = [
        'file_name',
        'file_path',
        'mime_type',
        'file_size',
    ];

    // Relacion polimorfica
    public function attachable()
    {
        return $this->morphTo();
    }
}

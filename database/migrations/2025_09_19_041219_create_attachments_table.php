<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->id();
            $table->string('file_name');   // Nombre original del archivo
            $table->string('file_path');   // Ruta de almacenamiento
            $table->string('mime_type')->nullable(); // Tipo MIME
            $table->unsignedBigInteger('file_size')->nullable(); // Tamaño en bytes
            $table->morphs('attachable');  // Relaciones polimórficas (attachable_id + attachable_type)
            $table->timestamps();
        });
    }

    //revierte la migracion
    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};

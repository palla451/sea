<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('incidents', function (Blueprint $table) {
            $table->id(); // id => 6826
            $table->string('title'); // "Suspicious Application Or Network Behaviour"
            $table->text('description'); // "Detected execution of an application..."
            $table->string('severity'); // es: "High"
            $table->string('critically')->nullable(); // "TO_BE_FILLED"
            $table->text('summary')->nullable(); // Summary dettagliato
            $table->string('tags')->nullable(); // CSV: "gyala, gyala_incident, ..."
            $table->string('status')->default('New'); // "New"
            $table->timestamp('created_at')->nullable(); // "2025-07-30T10:35:00.415+00:00"
            $table->timestamp('updated_at')->nullable(); // "2025-07-30T10:35:00.415+00:00"

            $table->timestamp('creation_date')->nullable(); // "2025-07-30T10:35:45.869+00:00"

            // Embedded asset info (deck, frame, mvz)
            $table->string('asset_deck')->nullable();
            $table->string('asset_frame')->nullable();
            $table->string('asset_mvz')->nullable();

//            $table->timestamps(); // created_at, updated_at gestiti da Laravel
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};

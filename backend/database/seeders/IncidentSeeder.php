<?php

namespace Database\Seeders;

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Schema;

class IncidentSeeder extends Seeder
{
    public function run(): void
    {
        $table = 'incidents';
        $connection = "pgsql";

        // effettuo controllo se esiste la tabella incident allora faccio un truncate
        // evito problema
        if(Schema::connection($connection)->hasTable($table)) {
            DB::connection($connection)->table($table)->truncate();
        }else{
            $this->command->warn("Table $table does not exist. Skipping truncate.");
        }


        DB::table('incidents')->insert([
            'id' => 6826,
            'title' => 'Suspicious Application Or Network Behaviour',
            'description' => 'Detected execution of an application reported as known malware.',
            'severity' => 'High',
            'critically' => 'TO_BE_FILLED',
            'summary' => "Incident Categories: ['gyala', 'gyala_incident', 'gyala_incident_open'] (Severity: Medium)\nDescription: Suspicious Application Or Network Behaviour: Detected execution of an application reported as known malware.\nRisk information: TO_BE_FILLED",
            'tags' => 'gyala, gyala_incident, gyala_incident_open, MITRE-T1497.001, MITRE-T1562',
            'status' => 'New',
            'created_at' => Carbon::parse('2025-07-30T10:35:00.415Z'),
            'creation_date' => Carbon::parse('2025-07-30T10:35:45.869Z'),
            'asset_deck' => '3',
            'asset_frame' => '200',
            'asset_mvz' => '5',
            'updated_at' => now(),
        ]);
    }
}

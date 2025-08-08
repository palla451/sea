<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

class ConfigurationController extends Controller
{

    // lista completa degli incidenti
    public function all()
    {
        // Se non c'è in cache, leggi dal file e salvalo
        if (!Cache::has('incident')) {
            $json = File::get(storage_path('app/demo/incident_start.json'));
            $incidentData = json_decode($json, true);
            Cache::put('incident', $incidentData);
        }

        return response()->json(Cache::get('incident'));
    }

    public function single_incident()
    {
        if (!Cache::has('single_incident')) {
            $json = File::get(storage_path('app/demo/incident1_start.json'));
            $incidentData = json_decode($json, true);
            Cache::put('single_incident', $incidentData);
        }

        return response()->json(Cache::get('single_incident'));
    }


    // resetta e porta di nuovo il sistema alla condizione iniziale
    public function reset()
    {
        Cache::forget('function');
        Cache::forget('incident');
        Cache::forget('asset');
        Cache::forget('single_incident');
        return response()->json(['message' => 'Tutta la cache è stata cancellata']);
    }

    // mostra tutti gli assets
    public function all_assets()
    {
        // Se non c'è in cache, leggi dal file e salvalo
        if (!Cache::has('asset')) {
            $json = File::get(storage_path('app/demo/asset_start.json'));
            $incidentData = json_decode($json, true);
            Cache::put('asset', $incidentData);
        }

        return response()->json(Cache::get('asset'));
    }

    // calcolo della reliability
    public function function()
    {
        if (!Cache::has('function')) {

            $json = File::get(storage_path('app/demo/function_start.json'));
            $incidentData = json_decode($json, true);
            Cache::put('function', $incidentData);
        }

        return response()->json(Cache::get('function'));
    }


}

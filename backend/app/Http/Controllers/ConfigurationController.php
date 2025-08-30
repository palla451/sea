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
            $json = File::get(storage_path('app/demo/start/incident_start.json'));
            $incidentData = json_decode($json, true);
            Cache::put('incident', $incidentData);
        }

        return response()->json(Cache::get('incident'));
    }

    public function single_incident()
    {
        if (!Cache::has('single_incident')) {
            $json = File::get(storage_path('app/demo/start/incident_start.json'));
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
        if (Cache::has('remediationAttackOne')) {
            Cache::forget('remediationAttackOne');
        }

        if (Cache::has('restoreOperatingPercentage')) {
            Cache::forget('restoreOperatingPercentage');
        }
 //       Cache::forget('remediationAttackOne');
        return response()->json(['message' => 'Tutta la cache è stata cancellata']);
    }

    // mostra tutti gli assets
    public function all_assets()
    {
        // Se non c'è in cache, leggi dal file e salvalo
        if (!Cache::has('asset')) {
            $json = File::get(storage_path('app/demo/start/asset_start.json'));
            $incidentData = json_decode($json, true);
            Cache::put('asset', $incidentData);
        }

        return response()->json(Cache::get('asset'));
    }

    // calcolo della reliability
    public function function()
    {
        if (!Cache::has('function')) {

            $json = File::get(storage_path('app/demo/start/function_start.json'));
            $incidentData = json_decode($json, true);
            Cache::put('function', $incidentData);
        }

        return response()->json(Cache::get('function'));
    }

    public function attack_one()
    {
        $this->reset();


        if (!Cache::has('incident')) {
            $json = File::get(storage_path('app/demo/attack_one/incident_start.json'));
            $incidentData = json_decode($json, true);
            Cache::put('incident', $incidentData);
        }

        if (!Cache::has('single_incident')) {
            $json = File::get(storage_path('app/demo/attack_one/incident_start.json'));
            $incidentData = json_decode($json, true);
            Cache::put('single_incident', $incidentData);
        }

        if (!Cache::has('function')) {
            $json = File::get(storage_path('app/demo/attack_one/function_start.json'));
            $incidentData = json_decode($json, true);
            Cache::put('function', $incidentData);
        }

        // Se non c'è in cache, leggi dal file e salvalo
        if (!Cache::has('asset')) {
            $json = File::get(storage_path('app/demo/attack_one/asset_start.json'));
            $incidentData = json_decode($json, true);
            Cache::put('asset', $incidentData);
        }

        return response()->json('attack successfully');

    }

    public function functionAssetRemediationAttackOne(Request $request)
    {
        $remediationId = $request->get('remediationId');
        #ATTACCK ONE
        if($remediationId = 8668){
            $json = File::get(storage_path('app/demo/attack_one/functionAssetRemediation.json'));
            $incidentData = json_decode($json, true);
            Cache::put('remediationAttackOne', $incidentData);
        }

        // ATTACK TWO

        return response()->json(Cache::get('remediationAttackOne'));
    }

    public function restoreOperatingPercentage(Request $request)
    {
        $asset = $request->get('hostName');

        #ATTACCK ONE
        if($asset = 'mcsp-rke2-edge-01-tst-pl-all-01-qvkph-67mpv'){
            $json = File::get(storage_path('app/demo/attack_one/functionAssetRemediation.json'));
            $incidentData = json_decode($json, true);
            Cache::put('restoreOperatingPercentageAttackOne', $incidentData);
        }

        // ATTACK TWO

        return response()->json(Cache::get('restoreOperatingPercentageAttackOne'));
    }

}

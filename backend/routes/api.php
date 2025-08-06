<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');


Route::get('test',function (){
    return 'test ok';
});


Route::get('incident', function () {
    // Se non c'è in cache, leggi dal file e salvalo
    if (!Cache::has('incidents')) {
        $json = File::get(storage_path('app/demo/incidents.json'));
        $incidentData = json_decode($json, true);
        Cache::put('incidents', $incidentData);
    }

    return response()->json(
        Cache::get('incidents')
    );
});


Route::prefix('case')->group(function () {
    Route::prefix('incident')->group(function () {

        Route::get('', function () {
            // Se non c'è in cache, leggi dal file e salvalo
            if (!Cache::has('incident')) {
                $json = File::get(storage_path('app/demo/incident.json'));
                $incidentData = json_decode($json, true);
                Cache::put('incident', $incidentData);
            }

            return response()->json(Cache::get('incident'));
        });

        Route::get('{incidentId}', function () {
            // Se non c'è in cache, leggi dal file e salvalo
            if (!Cache::has('single_incident')) {
                $json = File::get(storage_path('app/demo/incident1.json'));
                $incidentData = json_decode($json, true);
                Cache::put('single_incident', $incidentData);
            }

            return response()->json(Cache::get('single_incident'));
        });

    });


    Route::get('clear', function () {
        Cache::forget('function');
        Cache::forget('incident');
        Cache::forget('asset');
        Cache::forget('single_incident');
        return response()->json(['message' => 'Tutta la cache è stata cancellata']);
    });
});


Route::prefix('asset')->group(function () {
    Route::get('asset',function (){
        // Se non c'è in cache, leggi dal file e salvalo
        if (!Cache::has('asset')) {
            $json = File::get(storage_path('app/demo/asset.json'));
            $incidentData = json_decode($json, true);
            Cache::put('asset', $incidentData);
        }

        return response()->json(Cache::get('asset'));

    });

    Route::get('function',function (){

        if (!Cache::has('function')) {

            $json = File::get(storage_path('app/demo/function.json'));
            $incidentData = json_decode($json, true);
            Cache::put('function', $incidentData);
        }

        return response()->json(Cache::get('function'));
    });
});








<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ConfigurationController;


// test per corretto funzionamento backend http://localhost:8282/api/test
Route::get('test',function (){
    return 'test ok';
});



Route::get('reset',[ConfigurationController::class,'reset']);


Route::prefix('case')->group(function () {
    Route::prefix('incident')->group(function () {
        Route::get('',[ConfigurationController::class,'all']);
        Route::get('{incidentId}',[ConfigurationController::class,'single_incident']);
    });

});


Route::prefix('asset')->group(function () {
    Route::get('asset', [ConfigurationController::class,'all_assets']);
    Route::get('function', [ConfigurationController::class,'function']);
});








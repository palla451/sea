<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Route::get('/user', function (Request $request) {
//    return $request->user();
//})->middleware('auth:sanctum');


Route::get('test',function (){
    return 'test ok';
});

Route::prefix('case')->group(function () {
    Route::get('incidents',function (){
        return \Illuminate\Support\Facades\DB::table('incidents')->get();
    });
});



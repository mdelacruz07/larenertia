<?php

use App\Http\Controllers\CrudItemController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/about', function () {
    return Inertia::render('About');
});

Route::get('/contact', function () {
    return Inertia::render('Contact');
});

Route::get('/prices', function () {
    return Inertia::render('Prices');
});

Route::controller(CrudItemController::class)->group(function () {
    Route::get('/crud', 'index')->name('crud.index');
    Route::post('/crud', 'store')->name('crud.store');
    Route::put('/crud/{crudItem}', 'update')->name('crud.update');
    Route::delete('/crud/{crudItem}', 'destroy')->name('crud.destroy');
});

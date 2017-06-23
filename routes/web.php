<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('index');
});

Route::post('/login', 'LoginController@authenticate');

Route::post('/logout', 'LoginController@logout');

Route::middleware('auth')->post('/getuser', 'LoginController@getuser');
Route::middleware('auth')->post('/adduser', 'LoginController@adduser');
// Route::get('/index', function () {
//     return view('welcome');
// });
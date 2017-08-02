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

Route::middleware('auth')->post('/getuser', 'UserController@getuser');
Route::middleware('auth')->post('/adduser', 'UserController@adduser');
Route::middleware('auth')->post('/updateuser', 'UserController@updateuser');
Route::middleware('auth')->post('/deleteuser', 'UserController@deleteuser');

Route::middleware('auth')->post('/getArticle', 'ArticleController@getArticle');
Route::middleware('auth')->post('/getArticleDetail', 'ArticleController@getArticleDetail');

Route::middleware('auth')->post('/getOrderArticleList', 'ArticleController@getOrderArticleList');

Route::middleware('auth')->post('/saveWriter', 'ArticleController@saveWriter');

Route::middleware('auth')->post('/visitCountUp', 'ArticleController@visitCountUp');

// Route::get('/index', function () {
//     return view('welcome');
// });
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

/**
    用户表相关操作
**/
Route::middleware('auth')->post('/getuser', 'UserController@getuser');
Route::middleware('auth')->post('/adduser', 'UserController@adduser');
Route::middleware('auth')->post('/updateuser', 'UserController@updateuser');
Route::middleware('auth')->post('/deleteuser', 'UserController@deleteuser');
// 修改密码
Route::middleware('auth')->post('/modifypass', 'UserController@modifypass');
// 获取所有普通用户列表
Route::middleware('auth')->get('/getUserList', 'UserController@getUserList');
/**
    分类模块
**/
Route::middleware('auth')->post('/addCategory', 'CategoryController@add');
Route::middleware('auth')->post('/getCategory', 'CategoryController@get');
Route::middleware('auth')->post('/deleteCategory', 'CategoryController@delete');


/**
    文章模块
**/
Route::middleware('auth')->post('/getArticle', 'ArticleController@getArticle');
// 根据登录用户获取文章列表
Route::middleware('auth')->post('/getArticleByUser', 'ArticleController@getArticleByUser');

// 根据不同用户获取文章列表
Route::middleware('auth')->post('/getArticlesByHero', 'ArticleController@getArticlesByHero');

Route::middleware('auth')->post('/getArticleDetail', 'ArticleController@getArticleDetail');
Route::middleware('auth')->post('/deleteArticle', 'ArticleController@delete');
Route::middleware('auth')->post('/getArticleByCategory', 'ArticleController@getByCategory');


Route::middleware('auth')->post('/getOrderArticleList', 'ArticleController@getOrderArticleList');

Route::middleware('auth')->post('/saveWriter', 'ArticleController@saveWriter');
Route::middleware('auth')->post('/updateDetail', 'ArticleController@updateDetail');
Route::middleware('auth')->get('/getEditDetail','ArticleController@getEditDetail');


Route::middleware('auth')->post('/saveUploadImg', 'ArticleController@saveUploadImg');
Route::middleware('auth')->post('/postfile', 'AttachfileController@saveUploadAttachFile');
Route::middleware('auth')->post('/deletefile', 'AttachfileController@deleteUploadAttachFile');

Route::middleware('auth')->get('/downloadfile', 'AttachfileController@downloadAttachFile');

Route::middleware('auth')->post('/visitCountUp', 'ArticleController@visitCountUp');

// 搜索文章
Route::middleware('auth')->post('/searchArticle', 'ArticleController@searchArticle');

// 获取用户发布的文章数量的列表
Route::middleware('auth')->get('/getHeroList', 'ArticleController@getHeroList');


/**
    设备管理模块
**/
Route::middleware('auth')->get('/getDeviceList', 'DeviceController@getDeviceList');
Route::middleware('auth')->post('/addDevice', 'DeviceController@addDevice');
Route::middleware('auth')->post('/updateDevice', 'DeviceController@updateDevice');
Route::middleware('auth')->post('/deleteDevice', 'DeviceController@deleteDevice');

// Route::get('/index', function () {
//     return view('welcome');
// });
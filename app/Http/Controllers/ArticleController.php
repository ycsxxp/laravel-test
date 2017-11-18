<?php
namespace App\Http\Controllers;

use App\Article;
use App\Attachfile;
use App\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\DB;

class ArticleController extends Controller {
    
    // 存储图片
    public function saveUploadImg(Request $request) {
        // $file from Symfony\Component\HttpFoundation\File 
        $file = $request['img'];
        if($file->isValid()) {
            $loginUser = Auth::user();
            $file_dir = $loginUser->account;
            $file_name = date('YmdHis').'.'.$file->getClientOriginalExtension();
            $path = $request->file('img')->storeAs($file_dir, $file_name, 'images');
            $url = Storage::disk('images')->url($path);
            return response()->json(['url' => $url]);
        }else {
            return response()->json(['status' => 418, 'msg' => 'File invalid']);
        }
    }

    public function saveWriter(Request $request) {
        $loginUser = Auth::user();
        if (intval($request->user_id) !== $loginUser->id) {
            return response()->json(['status' => 402, 'msg' => 'auth error']);
        }
        
        $result = Article::create([
            'title' => $request->title,
            'content' => $request->content,
            // 'content' => $request->htmlcontent,
            'attachfiles_id' => $request->attachfiles_id,
            // 'visit_count' => $request->visit_count,
            // 'like_count' => $request->like_count,
            // 'hot' => $request->hot,
            'category_id' => intval($request->category_id),
            'user_id' => intval($request->user_id)
        ]);
        $article_id = $result->id;
        $share_user_id = $request->share_user_id;
        $insert_arr = array(array('article_id'=>$article_id, 'user_id'=>intval($request->user_id)));
        foreach ($share_user_id as $value) {
            array_push($insert_arr, array('article_id'=>$article_id, 'user_id'=>$value));
        }
        if (DB::table('article_user')->insert($insert_arr)) {
            return response()->json(['status' => 200, 'msg' => 'success']);
        } else {
            return response()->json(['status' => 402, 'msg' => 'error']);
        }
    }

    // 更新文章详细信息
    public function updateDetail(Request $request) {
        $loginUser = Auth::user();
        // 判断当前用户有没有文章的权限
        if (!$this->articleAuth(intval($request->id))) {
            return response()->json(['status' => 402, 'msg' => 'auth error']);
        }
        $result = Article::where([ ['id', intval($request->id)], ['user_id', intval($request->user_id)] ])->update([
            'title' => $request->title,
            'content' => $request->content,
            // 'content' => $request->htmlcontent,
            'attachfiles_id' => json_encode($request->attachfiles_id),
            'category_id' => intval($request->category_id),
            'updated_user' => $loginUser->name,
        ]);
        if ($result) {
            return response()->json(['status' => 200, 'msg' => 'success']);
        }
    }

    // 获取待编辑的文章详细信息
    public function getEditDetail(Request $request) {
        $loginUser = Auth::user();
        $article_id = intval($request->id);
        // 判断当前用户有没有文章的权限
        if (!$this->articleAuth($article_id)) {
            return response()->json(['status' => 402, 'msg' => 'auth error']);
        }
        $articleDetail = Article::find($article_id);
        
        // 获取共同编辑的用户id 除登录用户之外
        $shareUserId = DB::table('article_user')->where([ ['article_id', $article_id], ['user_id', '!=', $loginUser->id] ])->pluck('user_id')->toArray();

        if($articleDetail->attachfiles_id != 'null' && $articleDetail->attachfiles_id != '') {
            $attachfiles = Attachfile::select('id', 'f_name as name', 'f_path')->whereIn('id', $articleDetail->attachfiles_id)->get();
        }else {
            $attachfiles = array();
        }
        return array('articleDetail' => $articleDetail, 'attachfiles' => $attachfiles, 'shareUserId' => $shareUserId);
    }

    // 获取所有文章
    public function getArticle(Request $request) {
        // 每页条数
        $size = intval($request->size);
        // 页数
        $page = intval($request->page);

        // DB::enableQueryLog();
        $articles = Article::with('username')->orderBy('created_at', 'desc')->offset( ($page-1)*$size )->limit($size)->get()->toArray();
        $articles = array_map(
                        function($item) { 
                            $item['username'] = $item['username']['name'];
                            return $item;
                        }, 
                        $articles
                    );
        $total = Article::count();
        $result = array('articles' => $articles, 'total' => $total );
        return $result;
    }

    // 根据登录用户获取文章列表 包括可以共同编辑的文章
    public function getArticleByUser(Request $request) {
        $loginUser = Auth::user();
        if( $loginUser->role == 1 ){
            // 每页条数
            $size = intval($request->size);
            // 页数
            $page = intval($request->page);

            // 获取当前用户是否有共享编辑的文档
            $article_id = array();
            $user_info = array();
            $articleIdArr = DB::table('article_user')->where('user_id', $loginUser->id)->orderBy('article_id')->pluck('article_id')->toArray();
            // dd(DB::getQueryLog());
            // 获取共同编辑文档的所有用户名
            foreach ($articleIdArr as $articleId) {
                $result = DB::table('article_user')->select('users.id as userid', 'users.name as username')->join('users', 'users.id', '=', 'article_user.user_id')->where('article_id', $articleId)->orderBy('article_id')->get()->toArray();
                $user_info[$articleId] = array_map('get_object_vars', $result);
            }
            // DB::enableQueryLog();
            $articles = Article::with('username')->where('user_id', $loginUser->id)->orWhereIn('id', $articleIdArr)->orderBy('created_at', 'desc')->offset( ($page-1)*$size )->limit($size)->get()->toArray();
            // dd(DB::getQueryLog());
            foreach ($articles as $key => $value) {
                $articles[$key]['username'] = $value['username']['name'];
                if (!empty($user_info[$value['id']])) {
                    $articles[$key]['share'] = implode(' | ', array_column($user_info[$value['id']], 'username'));
                } else {
                    $articles[$key]['share'] = '无';
                }
            }
            $total = DB::table('article_user')->where('user_id', $loginUser->id)->count();
            $result = array('articles' => $articles, 'total' => $total );
            return $result;
        }else {
            return response()->json(['status'=>400 , 'msg'=>'权限错误']);
        }
    }

    public function getByCategory(Request $request) {
        $category_id = intval($request->id);
        return Article::where('category_id', $category_id)->get()->toJson();
    }

    // 获取详细信息
    public function getArticleDetail(Request $request) {
        $id = intval($request->id);
        // 阅读量 +1
        $this->visitCountUp($id);

        $articles = Article::with('username')->find($id)->toArray();
        $articles['username'] = $articles['username']['name'];
        if($articles['attachfiles_id'] != 'null' && $articles['attachfiles_id'] != '') {
            $attachfiles = Attachfile::select('id', 'f_name')->whereIn('id', $articles['attachfiles_id'])->get();    
        }else {
            $attachfiles = array();
        }
        return array('articles' => $articles, 'attachfiles' => $attachfiles);
    }

    public function getOrderArticleList() {
        $order_by_visit = Article::orderBy('visit_count', 'desc')->limit(5)->get();
        $order_by_like = Article::orderBy('like_count', 'desc')->limit(5)->get();
        $orderList = array('order_by_visit' => $order_by_visit , 'order_by_like' => $order_by_like);
        return $orderList;
    }

    public function visitCountUp($id) {
        $article = Article::find($id);
        $article->timestamps = false;
        $article->visit_count += 1;
        $article->save();
        // return Article::orderBy('visit_count', 'desc')->limit('5')->get()->toJson();
        // return Article::all()->toJson();
    }

    public function delete(Request $request) {
        $loginUser = Auth::user();
        $article_id = intval($request->id);
        if( $loginUser->role == 0 ){
            $user_id = intval($request->user_id);
            $deletedRows = Article::where([ ['id', $article_id], ['user_id', $user_id] ])->delete();
            if($deletedRows) {
                return $this->getArticle($request);
            }
        }elseif( $loginUser->role == 1 ) {
            $user_id = $loginUser->id;
            $deletedRows = Article::where([ ['id', $article_id], ['user_id', $user_id] ])->delete();
            if($deletedRows) {
                $deletedRows = DB::table('article_user')->where('article_id', $article_id)->delete();
                if ($deletedRows) {
                    return $this->getArticleByUser($request);
                }
                
            }
        }else {
            return response()->json(['status' => 400, 'msg' => '权限错误']);
        }
    }

    // 判断当前用户是否拥有文章权限
    public function articleAuth($article_id) {
        $loginUser = Auth::user();
        $count = DB::table('article_user')->where([ ['article_id', $article_id], ['user_id', $loginUser->id] ])->count();
        if ($count <= 0) {
            // 如果没有访问权限
            return false;
        } else {
            return true;
        }
    }
}
?>
<?php
namespace App\Http\Controllers;

use App\Article;
use App\Attachfile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\DB;

class ArticleController extends Controller {
    
    public function saveWriter(Request $request) {
        return Article::create([
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
    }

    // 更新文章详细信息
    public function updateDetail(Request $request) {
        $result = Article::where([ ['id', intval($request->id)], ['user_id', intval($request->user_id)] ])->update([
            'title' => $request->title,
            'content' => $request->content,
            // 'content' => $request->htmlcontent,
            'attachfiles_id' => json_encode($request->attachfiles_id),
            'category_id' => intval($request->category_id)
        ]);
        dd($result);
    }

    // 获取待编辑的文章详细信息
    public function getEditDetail(Request $request) {
        $article_id = intval($request->id);
        $articleDetail = Article::find($article_id);
        if($articleDetail->attachfiles_id != 'null' && $articleDetail->attachfiles_id != '') {
            $attachfiles = Attachfile::select('id', 'f_name as name')->whereIn('id', $articleDetail->attachfiles_id)->get();    
        }else {
            $attachfiles = array();
        }
        return array('articleDetail' => $articleDetail, 'attachfiles' => $attachfiles);
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

    // 根据登录用户获取文章列表
    public function getArticleByUser(Request $request) {
        $loginUser = Auth::user();
        if( $loginUser->role == 1 ){
            // 每页条数
            $size = intval($request->size);
            // 页数
            $page = intval($request->page);

            // DB::enableQueryLog();
            $articles = Article::with('username')->where('user_id', $loginUser->id)->orderBy('created_at', 'desc')->offset( ($page-1)*$size )->limit($size)->get()->toArray();
            $articles = array_map(
                            function($item) { 
                                $item['username'] = $item['username']['name'];
                                return $item;
                            }, 
                            $articles
                        );
            $total = Article::where('user_id', $loginUser->id)->count();
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
                return $this->getArticleByUser($request);
            }
        }else {
            return response()->json(['status' => 400, 'msg' => '权限错误']);
        }
    }
}
?>
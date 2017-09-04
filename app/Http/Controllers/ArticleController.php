<?php
namespace App\Http\Controllers;

use App\Article;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\DB;

class ArticleController extends Controller {
    public function saveWriter(Request $request) {
        return Article::create([
            'title' => $request->title,
            'content' => $request->content,
            // 'visit_count' => $request->visit_count,
            // 'like_count' => $request->like_count,
            // 'hot' => $request->hot,
            'category' => intval($request->cate),
            'user_id' => intval($request->user_id)
        ]);
    }

    public function getArticle(Request $request) {
        // 每页条数
        $size = intval($request->size);
        // 页数
        $page = intval($request->page);

        // DB::enableQueryLog();
        $articles = Article::with('username')->orderBy('created_at', 'desc')->offset( ($page-1)*$size )->limit($size)->get();
        $total = Article::count();
        $result = array('articles' => $articles, 'total' => $total );
        return $result;
    }

    public function getByCategory(Request $request) {
        $category_id = intval($request->id);
        return Article::where('category', $category_id)->get()->toJson();
    }

    public function getArticleDetail(Request $request) {
        $id = intval($request->id);
        // 阅读量 +1
        $this->visitCountUp($id);

        return Article::find($id)->toJson();
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
        $id = intval($request->id);
        $user_id = intval($request->user_id);
        $deletedRows = Article::where([ ['id', $id], ['user_id', $user_id] ])->delete();
        if($deletedRows) {
            return $this->getArticle($request);
        }
    }
}
?>
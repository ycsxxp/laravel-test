<?php
namespace App\Http\Controllers;

use App\Models\Article;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ArticleController extends Controller {
    public function saveWriter(Request $request) {
        // var_dump($request->title);
        return Article::create([
            'title' => $request->title,
            'content' => $request->content,
            // 'visit_count' => $request->visit_count,
            // 'like_count' => $request->like_count,
            // 'hot' => $request->hot,
            'category' => '测试分类',
            'user_id' => '4'
        ]);
    }

    public function getArticle() {
        $articles = Article::all();
        return $articles->toJson();
    }
}
?>
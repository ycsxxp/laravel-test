<?php

namespace App\Http\Controllers;

use App\Models\Category;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    //
    private $category_result = array();
    //
    public function add(Request $request) {
        
        if($request->parent != 0) {
            $parent = Category::where("id", intval($request->parent))->first()->toArray();
            $parent_level = $parent['c_level'];
        }else {
            $parent_level = 0;
        }
        
        return Category::create([
            'c_title' => $request->title,
            'c_parent' => intval($request->parent),
            'c_level' => intval($parent_level) + 1,
            'c_order' => 1,
        ]);
    }
    // 处理分类列表为树
    public function getCategoryTree($items) {
        foreach ($items as $item) {
            $items[$item['c_parent']]['child'][$item['id']] = &$items[$item['id']];
        }
        return isset($items[0]['child']) ? $items[0]['child'] : array();
    }
    // 将分类树处理成顺序数组方便页面显示
    public function getCategoryResult($tree) {
        foreach ($tree as $key => $value) {
            $value['c_title'] = $value['c_title'];
            if(isset($value['child'])) {
                $child = $value['child'];
                unset($value['child']);
                $child = array_values($child);
                array_push($this->category_result, $value);
                $this->getCategoryResult($child);
            }else {
                array_push($this->category_result, $value);
            }
        }
    }

    public function get() {
        $category_all_arr = Category::orderBy('c_parent', 'asc')->get()->toArray();
        $category_list = array();
        foreach ($category_all_arr as $key => $value) {
            $category_list[$value['id']] = $value;
        }
        
        $category_tree = $this->getCategoryTree($category_list);
        $this->getCategoryResult($category_tree);
        return $this->category_result;
    }

    public function delete(Request $request) {
        $id = (int)$request->id;
        $c_title = (string)$request->c_title;

        $childCount = Category::where('c_parent', $id)->count();
        if($childCount > 0) {
            // 如果存在子分类 不允许删除
            return "haschild";
        }else {
            $deletedRows = Category::where([ ['id', $id], ['c_title', $c_title] ])->delete();
            if($deletedRows) {
                return $this->get();
            }
        }
    }
}

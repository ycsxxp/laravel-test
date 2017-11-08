<?php

namespace App\Http\Controllers;

use App\Attachfile;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class AttachfileController extends Controller
{
    public function saveUploadAttachFile(Request $request) {
        // $file from Symfony\Component\HttpFoundation\File 
        $file = $request['file'];
        if($file->isValid()) {
            $loginUser = Auth::user();
            
            $file_dir = $loginUser->account;
            $file_name = date('YmdHis').'.'.$file->getClientOriginalExtension();
            $path = $request->file('file')->storeAs($file_dir, $file_name, 'public');
            
            return Attachfile::create([
                'f_name' => $file->getClientOriginalName(),
                'f_path' => $path,
                'user_id' => $loginUser->id,
                'user_name' => $loginUser->name,
            ]);
        }else {
            return response()->json(['success' => 'false', 'msg' => 'File invalid']);
        }
    }

    // 删除上传的文件
    public function deleteUploadAttachFile(Request $request) {
        $file = $request->file;
        $article_id = intval($file['id']);
        $loginUser = Auth::user();
        $result = Attachfile::where([ ['id', $article_id], ['user_id', $loginUser->id] ])->delete();
        if($result) {
            $f_path = $file['f_path'];
            if(Storage::disk('public')->delete($f_path)) {
                return response()->json(['success' => 'true', 'msg' => '删除成功']);
            }else {
                return response()->json(['success' => 'false', 'msg' => '删除失败']);
            }
        }
    }

    // 下载文件
    public function downloadAttachFile(Request $request) {
        $loginUser = Auth::user();
        $file_id = intval($request->id);
        // $file = Attachfile::where([ ['id', $file_id], ['user_id', $loginUser->id] ])->first(['f_name', 'f_path']);
        $file = Attachfile::where([ ['id', $file_id] ])->first(['f_name', 'f_path']);
        $download_path = Storage::disk('public')->getAdapter()->getPathPrefix().$file->f_path;
        $download_name = $file->f_name;
        $headers = array(
            'Content-type: application/octet-stream'
        );
        return response()->download($download_path, $download_name, $headers);
    }
}

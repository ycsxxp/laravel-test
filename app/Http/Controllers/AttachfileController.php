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
    // 存储图片 暂时注释
    // public function saveUploadImg(Request $request) {
    //     $path = $request->file('upload')->store(date('Ymd/His'), 'images');
    //     $path = "uploads/images/".$path;
    //     return $path;
    // }
    public function saveUploadAttachFile(Request $request) {
        // $file from Symfony\Component\HttpFoundation\File 
        $file = $request['file'];
        if($file->isValid()) {
            $path = $request->file('file')->store(date('Ymd/His'), 'public');
            $loginUser = Auth::user();
            return Attachfile::create([
                'f_name' => $file->getClientOriginalName(),
                'f_path' => $path,
                'user_id' => $loginUser->id,
                'user_name' => $loginUser->name,
            ]);
        }else {
            return response()->json(['error' => 'File invalid'], 418);
        }
    }

    // 下载文件
    public function downloadAttachFile(Request $request) {
        $loginUser = Auth::user();
        $file_id = intval($request->id);
        $file = Attachfile::where([ ['id', $file_id], ['user_id', $loginUser->id] ])->first(['f_name', 'f_path']);
        $download_path = Storage::disk('public')->getAdapter()->getPathPrefix().$file->f_path;
        $download_name = $file->f_name;
        $headers = array(
            'Content-type: application/octet-stream'
        );
        return response()->download($download_path, $download_name, $headers);
    }
}

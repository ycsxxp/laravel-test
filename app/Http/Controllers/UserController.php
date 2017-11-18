<?php
namespace App\Http\Controllers;

use App\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller {

    public function getuser() {
        $users = User::all();
        return $users->toJson();
    }

    public function adduser(Request $request) {
        return User::create([
            'name' => $request->name,
            'address' => $request->address,
            'email' => $request->email,
            'account' => $request->account,
            'password' => bcrypt($request->password),
            'role' => 1,
        ]);
    }

    public function updateuser(Request $request) {
        $id = (int)$request->id;
        $name = (string)$request->name;
        $data = ['name' => $name, 'address' => (string)$request->address, 'email' => (string)$request->email, 'account' => (string)$request->account, 'password' => bcrypt($request->password)];
        return User::where([ ['id', $id],['name', $name] ])->update($data);
    }

    public function deleteuser(Request $request) {
        $id = (int)$request->id;
        $name = (string)$request->name;
        $deletedRows = User::where([ ['id', $id], ['name', $name] ])->delete();
        if($deletedRows) {
            return $this->getuser();
        }
    }

    // 修改密码
    public function modifypass(Request $request) {
        $oripass = $request->oripass;
        $newpass = $request->newpass;
        $confirm = $request->confirm;

        $loginUser = Auth::user();
        $user_id = $loginUser->id;
        if(password_verify($oripass, $loginUser->password) && $newpass === $confirm) {
            $result = User::where('id', $user_id)->update(['password' => bcrypt($newpass)]);
            return $result == true ? response()->json(['status' => 200, 'msg' => 'success']) : response()->json(['status' => 400, 'msg' => 'fail']);
        }else {
            return response()->json(['status' => 400, 'msg' => 'password error']);
        }
    }

    // 获取所有普通用户
    public function getUserList(Request $request) {
        $loginUser = Auth::user();
        $user_id = $loginUser->id;

        $user_list = User::select('id', 'name', 'account')->where([ ['id', '!=', $user_id], ['role', '!=', 0] ])->orderBy('name', 'asc')->get()->toJson();
        return $user_list;
    }
}
?>
<?php
namespace App\Http\Controllers;

use App\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller {
    /**
     * Handle an authentication attempt.
     *
     * @return Response
     */
    public function authenticate(Request $request)
    {
        $email = $request->input('user');
        $password = $request->input('password');
        // var_dump(Auth::attempt(['email' => $email, 'password' => $password]));exit();
        if (Auth::attempt(['email' => $email, 'password' => $password])) {
            // Authentication passed...
            // return redirect()->intended('dashboard');
            // 重定向操作由前端来做该出不需要返回
            return redirect()->intended();
        }
    }

    public function logout() {
        if(Auth::check()) {
            Auth::logout();
        }
    }

    public function adduser(Request $request) {
        return User::create([
            'name' => $request->name,
            'age' => $request->age,
            'address' => $request->address,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);
    }

    public function getuser() {
        $users = User::all();
        return $users->toJson();
	}
}
?>
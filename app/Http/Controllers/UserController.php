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
            'age' => $request->age,
            'address' => $request->address,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 1,
        ]);
    }

    public function updateuser(Request $request) {
        $id = (int)$request->id;
        $name = (string)$request->name;
        $data = ['name' => $name, 'age' => (int)$request->age, 'address' => (string)$request->address, 'email' => (string)$request->email, 'password' => bcrypt($request->password)];
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
}
?>
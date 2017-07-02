<?php

use Illuminate\Database\Seeder;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
    	DB::table('users')->insert([
            'name' => '杨超',
            'age' => 20,
            'address' => 'beijing',
            'email' => 'ycsxxp@126.com',
            'password' => bcrypt('123456'),
        ]);
    }
}

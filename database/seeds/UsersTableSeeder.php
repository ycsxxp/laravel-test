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
            'name' => 'Admin',
            'age' => 1,
            'address' => 'beijing',
            'email' => 'admin@admin.com',
            'password' => bcrypt('123456'),
            'role' => 0
        ]);
    }
}

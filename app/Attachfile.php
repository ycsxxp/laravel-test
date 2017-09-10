<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Attachfile extends Model
{
    //
    protected $table = 'attachfiles';

    protected $fillable = [
        'f_name', 'f_path', 'user_id', 'user_name',
    ];
}

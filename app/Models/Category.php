<?php
namespace App\Models;

// use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;

class Category extends Model {
    // use Notifiable;

    protected $table = 'category';

    protected $fillable = [
        'c_title', 'c_level', 'c_parent', 'c_order',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        
    ];

    public $timestamps = true;
}
?>
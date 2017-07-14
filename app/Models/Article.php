<?php
namespace App\Models;

// use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;

class Article extends Model {
    // use Notifiable;

    protected $table = 'articles';

    protected $fillable = [
        'title', 'content', 'visit_count', 'like_count', 'hot', 'category', 'user_id',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        
    ];
}
?>
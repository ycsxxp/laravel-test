<?php
namespace App;

// use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Model;

class Article extends Model {
    // use Notifiable;

    protected $table = 'articles';

    protected $fillable = [
        'title', 'content', 'attachfiles_id', 'visit_count', 'like_count', 'hot', 'category', 'user_id',
    ];

    /**
     * 应该被转换成原生类型的属性。
     *
     * @var array
     */
    protected $casts = [
        'attachfiles_id' => 'array',
    ];
    
    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        
    ];

    public $timestamps = true;

    public function username() {
        return $this->belongsTo('App\User', 'user_id');
    }

}
?>
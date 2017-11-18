<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticleUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('article_user', function (Blueprint $table) {
            $table->increments('id');
            // 外键
            $table->unsignedInteger('article_id');
            $table->foreign('article_id')->references('id')->on('articles'); // 文章 id
            // 外键
            $table->unsignedInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users'); // 作者 id
            // 联合唯一
            $table->unique(['article_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('article_user');
    }
}

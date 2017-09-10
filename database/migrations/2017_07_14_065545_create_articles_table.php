<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('articles', function (Blueprint $table) {
            $table->increments('id');
            // 标题
            $table->string('title');
            // 内容
            $table->longText('content');
            // 附件ID JSON
            $table->json('attachfiles_id');
            // 阅读量
            $table->integer('visit_count')->default(0);
            // 点赞量
            $table->integer('like_count')->default(0);
            // 热门指数
            $table->integer('hot')->default(0);
            // 分类
            $table->integer('category');
            // 注意: 当创建一个参照递增整数类型的外键的时候，记得把外键字段的类型定义为无符号。
            $table->unsignedInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users'); // 作者 id
            // Adds created_at and updated_at columns
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        //
    }
}

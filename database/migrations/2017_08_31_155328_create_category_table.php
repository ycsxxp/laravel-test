<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCategoryTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        //
        Schema::create('category', function (Blueprint $table) {
            $table->increments('id');
            // 分类名
            $table->string('c_title');
            // 分类级别 0表示顶级分类
            $table->integer('c_level')->default(0);
            // 父分类 0表示没有父分类 填写父id
            $table->integer('c_parent')->default(0);
            // 分类顺序 
            $table->integer('c_order')->default(1);
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

<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAttachfilesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('attachfiles', function (Blueprint $table) {
            // 附件id
            $table->increments('id');
            // 附件文件名
            $table->string('f_name');
            // 附件存储路径
            $table->string('f_path')->unique();
            // 附件上传用户
            $table->integer('user_id');
            // 附件上传用户名
            $table->string('user_name');
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
        Schema::dropIfExists('attachfiles');
    }
}

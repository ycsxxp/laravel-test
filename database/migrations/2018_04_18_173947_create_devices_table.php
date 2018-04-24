<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateDevicesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     * 资产编号	设备编号 设备型号 硬件型号 扩展槽 资产归属 使用者 设备状态 统一管理IP 备注
     */
    public function up()
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->increments('id');
            // 资产编号
            $table->string('asset_id')->nullable()->default('null')->unique();
            // 设备编号
            $table->string('device_id')->nullable()->default('null')->unique();
            // 设备型号
            $table->string('device_model')->nullable()->default('null');
            // 硬件型号
            $table->string('hardware_model')->nullable()->default('null');
            // 扩展槽
            $table->string('expansion_slot')->nullable()->default('null');
            // 资产归属
            $table->string('asset_ownership')->nullable()->default('null');
            // 使用者
            $table->string('user')->nullable()->default('null');
            // 设备状态
            $table->string('device_status')->nullable()->default('null');
            // 统一管理IP
            $table->string('allot_ip')->nullable()->default('null');
            // 备注
            $table->string('remarks')->nullable()->default('null');
            
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
        Schema::dropIfExists('devices');
    }
}

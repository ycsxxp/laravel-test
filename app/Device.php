<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    //
    protected $table = 'devices';

    protected $fillable = [
        'asset_id', 'device_id', 'device_model', 'hardware_model', 'expansion_slot', 'asset_ownership', 'user', 'device_status', 'allot_ip', 'remarks'
    ];

    public $timestamps = true;
}

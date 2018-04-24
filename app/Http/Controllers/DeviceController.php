<?php

namespace App\Http\Controllers;

use App\Device;
use Illuminate\Http\Request;

class DeviceController extends Controller
{
    /**
     * 获取列表
     */
    public function getDeviceList()
    {
        $devices = Device::get()->toArray();
        return $devices;
    }

    /**
     * 添加设备
     */
    public function addDevice(Request $request)
    {
        //
        try {
            $result = Device::create([
                'asset_id' => $request->asset_id,
                'device_id' => $request->device_id,
                'device_model' => $request->device_model,
                'hardware_model' => $request->hardware_model,
                'expansion_slot' => $request->expansion_slot,
                'asset_ownership' => $request->asset_ownership,
                'user' => $request->user,
                'device_status' => $request->device_status,
                'allot_ip' => $request->allot_ip,
                'remarks' => $request->remarks
            ]);
            if ($result) {
                return response()->json(['status' => 200, 'msg' => 'success']);
            } else {
                return response()->json(['status' => 402, 'msg' => 'error']);
            }
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23000') {
                // 说明字段重复
                return response()->json(['status' => 40023000, 'msg' => '编号重复']);
            }
        }
    }

    /**
     * 更新设备
     */
    public function updateDevice(Request $request) {
        $id = (int)$request->id;
        $data = [
            'asset_id' => (string)$request->asset_id,
            'device_id' => (string)$request->device_id,
            'device_model' => (string)$request->device_model,
            'hardware_model' => (string)$request->hardware_model,
            'expansion_slot' => (string)$request->expansion_slot,
            'asset_ownership' => (string)$request->asset_ownership,
            'user' => (string)$request->user,
            'device_status' => (string)$request->device_status,
            'allot_ip' => (string)$request->allot_ip,
            'remarks' => (string)$request->remarks
        ];
        try {
            $result = Device::where('id', $id)->update($data);
            if ($result) {
                return response()->json(['status' => 200, 'msg' => 'success']);
            } else {
                return response()->json(['status' => 402, 'msg' => 'error']);
            }
        } catch (\Illuminate\Database\QueryException $e) {
            if ($e->getCode() === '23000') {
                // 说明字段重复
                return response()->json(['status' => 40023000, 'msg' => '编号重复']);
            }
        }
    }

    /**
     * 删除设备
     */
    public function deleteDevice(Request $request)
    {
        //
        $id = intval($request->id);
        try {
            $deletedRows = Device::where('id', $id)->delete();
            if ($deletedRows) {
                return $this->getDeviceList();
            } else {
                return response()->json(['status' => 402, 'msg' => 'error']);
            }
        } catch (\Illuminate\Database\QueryException $e) {
            return response()->json(['status' => 402, 'msg' => '删除失败']);
        }
    }

    
    /**
     * Display the specified resource.
     *
     * @param  \App\Device  $device
     * @return \Illuminate\Http\Response
     */
    public function show(Device $device)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Device  $device
     * @return \Illuminate\Http\Response
     */
    public function edit(Device $device)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Device  $device
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Device $device)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Device  $device
     * @return \Illuminate\Http\Response
     */
    public function destroy(Device $device)
    {
        //
    }
}

<style>
.addDeviceForm {
	width: 350px;
	padding: 20px 0 20px 0;
}
</style>
<template>
	<div class="addDeviceForm">
		<Form ref="deviceInfo" :model="deviceInfo" :label-width="80" :rules="deviceValidate">
		  <Form-item label="资产编号" prop="asset_id">
		    <Input type="text" v-model="deviceInfo.asset_id" placeholder="请输入资产编号"></Input>
		  </Form-item>
		  <Form-item label="设备编号" prop="device_id">
		    <Input type="text" v-model="deviceInfo.device_id" placeholder="请输入设备编号"></Input>
		  </Form-item>
      <Form-item label="设备型号" prop="device_model">
        <Input type="text" v-model="deviceInfo.device_model" placeholder="请输入设备型号"></Input>
      </Form-item>
      <Form-item label="硬件型号" prop="hardware_model">
        <Input type="text" v-model="deviceInfo.hardware_model" placeholder="请输入硬件型号"></Input>
      </Form-item>
      <Form-item label="扩展槽" prop="expansion_slot">
        <Input type="text" v-model="deviceInfo.expansion_slot" placeholder="请输入扩展槽"></Input>
      </Form-item>
      <Form-item label="资产归属" prop="asset_ownership">
        <Input type="text" v-model="deviceInfo.asset_ownership" placeholder="请输入资产归属"></Input>
      </Form-item>
      <Form-item label="使用者" prop="user">
        <Input type="text" v-model="deviceInfo.user" placeholder="请输入使用者"></Input>
      </Form-item>
      <Form-item label="设备状态" prop="device_status">
        <Input type="text" v-model="deviceInfo.device_status" placeholder="请输入设备状态"></Input>
      </Form-item>
      <Form-item label="统一管理IP" prop="allot_ip">
        <Input type="text" v-model="deviceInfo.allot_ip" placeholder="请输入统一管理IP"></Input>
      </Form-item>
      <Form-item label="备注" prop="remarks">
        <Input type="text" v-model="deviceInfo.remarks" placeholder="请输入备注IP"></Input>
      </Form-item>
		  <Form-item>
		  	<Button type="primary" @click="handleSubmit('deviceInfo')">提交</Button>
		  	<Button type="ghost" @click="handleReset('deviceInfo')" style="margin-left: 8px">重置</Button>
      </Form-item>
		</Form>
	</div>
</template>
<script>
export default {
	data () {
	  return {
      type: this.$route.params.type,
      apiurl: '',
	    deviceInfo: {
	      asset_id: '',
	      device_id: '',
        address: '',
        device_model: '',
        hardware_model: '',
        expansion_slot: '',
        asset_ownership: '',
        user: '',
        device_status: '',
        allot_ip: '',
        remarks: ''
	    },
	    deviceValidate: {
	      asset_id: [
	        { required: true, message: '资产编号不能为空', trigger: 'blur' }
	      ],
        device_id: [
          { required: true, message: '设备编号不能为空', trigger: 'blur' }
        ]
	    }
	  }
  },
  created () {
    if(this.type == 'edit') {
      this.deviceInfo = this.$store.state.data.deviceFormData.row
    }
  },
  methods: {
  	handleSubmit (name) {
  		this.$refs[name].validate((valid) => {
  			if (valid) {
          this.deviceInfo._token = window.Laravel.csrfToken
          if(this.type == 'add') {
            this.apiurl = '/addDevice'
          }else {
            this.apiurl = '/updateDevice'
          }
          this.$http.post(this.apiurl, this.deviceInfo).then(
            response => {
              if (response.data.status !== 200) {
                this.$Message.error(response.data.msg)
              } else {
                this.$Message.success('添加成功!');
                this.$router.push({ path: '/device' })
              }
            },
            response => {
              this.$Message.error(this.$store.state.responseErrorMsg)
            }
          );
  			} else {
  				this.$Message.error('表单验证失败!');
  			}
	    })
  	},
  	handleReset (name) {
  		this.$refs[name].resetFields();
  	}
  }
}
</script>
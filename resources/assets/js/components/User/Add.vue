<style>
.addUserForm {
	width: 350px;
	padding: 20px 0 20px 0;
}
</style>
<template>
	<div class="addUserForm">
		<Form ref="userInfo" :model="userInfo" :label-width="80" :rules="userValidate">
		  <Form-item label="姓名" prop="username">
		    <Input type="text" v-model="userInfo.username" placeholder="请输入" />
		  </Form-item>
		  <Form-item label="年龄" prop="userage">
		    <Input-number :max="1000" :min="1" v-model="userInfo.userage"></Input-number>
		  </Form-item>
		  <Form-item label="城市" prop="usercity">
		    <Select v-model="userInfo.usercity" placeholder="请选择所在地">
		        <Option value="beijing">北京市</Option>
		        <Option value="shanghai">上海市</Option>
		        <Option value="shenzhen">深圳市</Option>
		    </Select>
		  </Form-item>
		  <Form-item>
		  	<Button type="primary" @click="handleSubmit('userInfo')">提交</Button>
		  	<Button type="ghost" @click="handleReset('userInfo')" style="margin-left: 8px">重置</Button>
      </Form-item>
		</Form>
	</div>
</template>
<script>
export default {
	data () {
	  return {
	    userInfo: {
	      username: '',
	      userage: 1
	    },
	    userValidate: {
	      username: [
	        { required: true, message: '姓名不能为空', trigger: 'blur' }
	      ],
	      usercity: [
	        { required: true, message: '请选择城市', trigger: 'change' }
	      ]
	    }
	  }
  },
  methods: {
  	handleSubmit (name) {
  		this.$refs[name].validate((valid) => {
  			if (valid) {
  				this.$Message.success('提交成功!');
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
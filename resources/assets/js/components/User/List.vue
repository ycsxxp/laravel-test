<!-- 引入自定义样式 -->
<style>
.panel-heading {
  height: 50px;
  text-align: right;
}
</style>
<template>
	<div class="container">
    <div class="row">
      <div class="col-md-8 col-md-offset-2">
        <div class="panel panel-default">
          <div class="panel-heading">
            <Input v-model="value2" placeholder="请输入..." style="width: 150px"></Input>
            <Button type="primary" icon="ios-search" shape="circle"></Button>
            <Button type="primary" @click="addUser" >新增</Button>
          </div>
          <div class="panel-body">
            <Table border stripe :columns="userColumns" :data="userlist"></Table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
	export default {
    data () {
      return {
        value2: "",
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
        },
        userColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '年龄',
            key: 'age'
          },
          {
            title: '地址',
            key: 'address'
          }
        ],
        userlist: []
      }
    },
    methods: {
      addUser () {
        this.$router.push({ path: '/user-add' })
      }
    },
		mounted() {
        console.log(this.$router)
    }
	}
</script>
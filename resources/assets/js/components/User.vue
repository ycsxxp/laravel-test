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
            <Button type="primary" @click="modal1 = true" >新增</Button>
          </div>
          <div class="panel-body">
            <Table border stripe :columns="userColumns" :data="userlist"></Table>
          </div>
        </div>
      </div>
    </div>
    <Modal v-model="modal1" title="新增用户" :mask-closable="false" @on-ok="ok" @on-cancel="cancel">
      <Form :model="userInfo">
        <Form-item prop="username">
          <Input type="text" v-model="userInfo.username" placeholder="Username">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </Form-item>
      </Form>
    </Modal>
  </div>
</template>
<script>
	export default {
    data () {
      return {
        value2: "",
        modal1: false,
        userInfo: {
          username: ''
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
        console.log("a")
      },
      ok () {
        this.$Message.info('点击了确定');
      },
      cancel () {
        this.$Message.info('点击了取消');
      }
    },
		mounted() {
        console.log(this.$router)
    }
	}
</script>
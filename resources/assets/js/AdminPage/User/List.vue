<style>
.row-header {
  margin-bottom: 10px; 
}
.control-bar {
  text-align: right;
}
</style>
<template>
	<div class="container">
    <Row type="flex" justify="end" class="row-header">
      <Col span="8">
        <div class="control-bar">
          <Input v-model="value2" placeholder="请输入..." style="width: 150px"></Input>
          <Button type="primary" icon="ios-search" shape="circle"></Button>
          <Button type="primary" @click="addUser" >新增</Button>
        </div>
      </Col>
    </Row>
    <Row>
      <Table border stripe :columns="userColumns" :data="userList"></Table>
    </Row>
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
            width: 120,
            key: 'name'
          },
          {
            title: '账号',
            key: 'account'
          },
          {
            title: '邮箱',
            key: 'email'
          },
          {
            title: '地址',
            key: 'address'
          },
          {
            title: '操作',
            key: 'action',
            render: (createElement, params) => {
              return createElement(
                'div',
                [
                  createElement('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.editUser(params)
                      }
                    }
                  }, '编辑'),
                  createElement('Poptip', 
                    {
                      props: {
                        confirm: true,
                        title: "确认删除这条内容吗?",
                      },
                      on: {
                        'on-ok': () => {
                          this.deleteUser(params.row.id, params.row.name)
                        }
                      }
                    },
                    [
                      createElement('Button', {
                        props: {
                          type: 'error',
                          size: 'small'
                        }
                      }, '删除')
                    ]
                  )
                ]
              )
            }
          }
        ],
        userList: []
      }
    },
    methods: {
      addUser () {
        this.$store.commit('addBreadCrumb', {'title': '添加用户'})
        this.$router.push({ path: '/user/add' })
      },
      editUser (params) {
        this.$store.commit('addBreadCrumb', {'title': '编辑用户'})
        this.$store.state.data.userFormData = params
        this.$router.push({ path: '/user/edit' })
      },
      getUser () {
        this.$http.post('/getuser', {_token: window.Laravel.csrfToken}).then(
          response => {
            this.userList = response.data
          },
          response => {
            this.$Message.error(this.$store.state.responseErrorMsg)
          }
        )
      },
      deleteUser (id, name) {
        this.$http.post('/deleteuser', {id: id, name: name, _token: window.Laravel.csrfToken}).then(
          response => {
            this.userList = response.data
          },
          response => {
            this.$Message.error(this.$store.state.responseErrorMsg)
          }
        )
      }
    },
    beforeMount () {
      this.getUser()
    },
		mounted() {
    }
	}
</script>
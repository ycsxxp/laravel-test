<style rel="stylesheet/scss" lang="scss" scoped>
  .wrapper {
    width: 100%;
    // height: 100%;
  }
  .wrapper-header {
    .ivu-menu-horizontal {
      height: 80px;
      line-height: 80px;
    }
    .wrapper-header-nav {
      height: 80px;
      width: 90%;
      margin: 0 auto;
      .wrapper-header-nav-logo{
        margin-top: 15px;
        height: 50px;
        float: left;
        img {
          height: 100%;
        }
      }
      .wrapper-header-nav-user{
        float: right;
        margin-left: 50px;
      }
      .wrapper-header-nav-list {
        height: inherit;
        float: right;
      }
    }
  }

  .wrapper-container {
    background: #fff;
    width: 90%;
    margin: 30px auto 20px;
    border-radius: 6px;
    box-shadow: 0 1px 1px 0 rgba(0,0,0,.1);
  }
</style>
<template>
  <div class="wrapper">
    <div class="wrapper-header">
      <Menu mode="horizontal" theme="light" active-name="homepage" @on-select="routeTo">
        <div class="wrapper-header-nav">
          <a href="/" class="wrapper-header-nav-logo">
            <img src="images/logo.png">
          </a>
          <div class="wrapper-header-nav-user">
            <Dropdown trigger="hover" @on-click="userTodo">
              <div :style="{ float: 'left', marginRight: '10px' }">Hi, {{ this.$store.state.loginUserInfo.name }}</div>
              <Button type="info" shape="circle" icon="ios-person">
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name='modifypass'>修改密码</DropdownItem>
                <DropdownItem divided name='logout'>退出</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Modal
              v-model="modalShow"
              title="修改登录密码"
              width="380"
              :mask-closable="false"
              >
              <Form ref="passFormItem" :model="passFormItem" :label-width="60" :rules="passValidate">
                <FormItem label="当前密码" prop="oripass">
                  <Input type="password" v-model="passFormItem.oripass" placeholder="请输入当前密码"></Input>
                </FormItem>
                <FormItem label="新密码" prop="newpass">
                  <Input type="password" v-model="passFormItem.newpass" placeholder="请输入新密码"></Input>
                </FormItem>
                <FormItem label="再次确认" prop="confirm">
                  <Input type="password" v-model="passFormItem.confirm" placeholder="请再次输入新密码"></Input>
                </FormItem>
              </Form>
              <div slot="footer">
                <Button type="ghost" @click="handleReset('passFormItem')" style="margin-left: 8px">重置</Button>
                <Button type="primary" @click="handleSubmit('passFormItem')">提交</Button>
              </div>
            </Modal>
          </div>
          <div class="wrapper-header-nav-list">
            <Menu-item name="homepage">
              首页
            </Menu-item>
            <Menu-item name="cate">
              文章分类
            </Menu-item>
            <Menu-item name="writer">
              发布文章
            </Menu-item>
            <Menu-item name="mine">
              我的
            </Menu-item>
          </div>
        </div>
      </Menu>
    </div>
    <div class="wrapper-container">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    const validateOriPass = (rule, value, callback) => {
      console.log(value.length)
      if(value.length < 6) {
        callback(new Error('密码长度不能小于6位'));
      }else {
        callback();
      }
    }
    const validateNewPass = (rule, value, callback) => {
      if(value.length < 6) {
        callback(new Error('新密码长度不能小于6位'));
      }else {
        if(this.passFormItem.newpass !== '') {
          this.$refs.passFormItem.validateField('confirm')
        }
        callback();
      }
    }
    const validateConfirm = (rule, value, callback) => {
      if(value === '') {
        callback(new Error('请再次输入新密码'));
      }else if (value !== this.passFormItem.newpass){
        callback(new Error('两次输入不一致'));
      }else {
        callback();
      }
    }
    return {
      modalShow: false,
      passFormItem: {
        oripass: '',
        newpass: '',
        confirm: ''
      },
      passValidate: {
        oripass: [
          { validator: validateOriPass, trigger: 'blur' }
        ],
        newpass: [
          { validator: validateNewPass, trigger: 'blur' }
        ],
        confirm: [
          { validator: validateConfirm, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.$router.push({ path: '/homepage' });
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post('/modifypass', this.passFormItem).then(
            response => {
              // 请求成功
            },
            response => {
              // 请求失败
            }
          )
          this.$Message.success('提交成功!');

        } else {
          this.$Message.error('表单验证失败!');
        }
      })
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    routeTo(e) {
      // 跳转
      this.$router.push({ path: '/'+e });
    },
    userTodo(name) {
      if (name=='modifypass') {
        this.passFormItem = {
          oripass: '',
          newpass: '',
          confirm: ''
        }
        this.modalShow = true
      }
      if(name=='logout') this.logout();
    },
    logout() {
      this.$http.post('/logout', { _token: window.Laravel.csrfToken }).then(
        response => {
          this.$store.commit('logoutSuccess')
          this.$router.push({ path: '/' });
        },
        response => {

        }
      )
    }
  }
}
</script>
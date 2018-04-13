<style rel="stylesheet/scss" lang="scss" scoped>
  .wrapper {
    width: 100%;
    // height: 100%;
  }
  .wrapper-header {
    display: flex;
    flex-direction: row;
    
    .ivu-menu-horizontal {
      height: 65px;
      flex-grow: 1;
    }
    .wrapper-header-nav {
      margin: 0px 60px;
      height: 65px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;

      .wrapper-header-nav-logo{
        height: 50px;
        img {
          height: 100%;
        }
      }

      .wrapper-header-nav-search {
        flex-grow: 1;
        margin-left: 100px;

      }
      .wrapper-header-nav-list {
        margin-left: 100px;
      }
      .wrapper-header-nav-user{
        margin-left: 100px;
      }
    }
  }

  .wrapper-container {
    background: #fff;
    margin: 15px;
    border-radius: 6px;
    box-shadow: 0 1px 1px 0 rgba(0,0,0,.1);
  }

  :global(.search-input input) {
    font-size: 20px;
    height: 36px;
  }
  :global(.search-input .ivu-input-icon) {
    font-size: 20px;
    height: 36px;
    line-height: 36px;
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
          <div class="wrapper-header-nav-search">
            <Input class="search-input" v-model="searchKeyword" icon="ios-search" placeholder="搜索文章..." @on-enter="doSearch"></Input>
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
        </div>
      </Menu>
    </div>
    <div class="wrapper-container">
      <router-view v-model="isSerach"></router-view>
    </div>
    <BackTop></BackTop>
  </div>
</template>
<script>
export default {
  data() {
    const validateOriPass = (rule, value, callback) => {
      if(value.length < 5) {
        callback(new Error('密码长度不能小于5位'));
      }else {
        callback();
      }
    }
    const validateNewPass = (rule, value, callback) => {
      if(value.length < 5) {
        callback(new Error('新密码长度不能小于5位'));
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
      isSerach: false,
      searchKeyword: '',
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
              if(response.data.status === 200) {
                this.$Notice.success({
                  title: '密码修改成功，请重新登录'
                });
                this.logout();
              }else if(response.data.status === 400) {
                this.$refs.passFormItem.resetFields()
                this.$Notice.error({
                  title: '密码错误修改失败, 请重试',
                  duration: 3
                });
              }
            },
            response => {
              // 请求失败
              this.$Message.error(this.$store.state.responseErrorMsg)
            }
          )
          

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
    doSearch() {
      this.$router.push({ path: '/search/'+ this.searchKeyword });
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
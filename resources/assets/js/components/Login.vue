<style scoped>
  .login {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position-x: 40%;
  }
  .formDiv {
    width: 320px;
    margin: 0 auto;
    top: 20%;
    right: 6%;
    position: absolute;
  }
  .ivu-card {
    background: rgba(255, 255, 255, 0.2);
  }
  .content {
    padding-top: 10px;
  }
  .loginBtn {
    width: 100%;
  }
</style>
<template>
  <div class="login" :style="backgroundImg">
    <div class="formDiv" @keydown.enter="handleSubmit('formInline')">
      <Card :bordered="false">
        <p slot="title">
          <Icon type="log-in"></Icon>
          欢迎登陆Wiki
        </p>
        <div class="content">
          <Form ref="formInline" :model="formInline" :rules="ruleInline" >
            <Form-item prop="user">
              <Input type="text" v-model="formInline.user" placeholder="请输入用户名">
                <Icon type="person" slot="prepend" style="font-size:16px;"></Icon>
              </Input>
            </Form-item>
            <Form-item prop="password">
              <Input type="password" v-model="formInline.password" placeholder="请输入密码">
                <Icon type="locked" slot="prepend" style="font-size:16px;"></Icon>
              </Input>
            </Form-item>
            <Form-item>
              <Button class="loginBtn" type="primary" @click="handleSubmit('formInline')">登录</Button>
            </Form-item>
          </Form>
        </div>
        
      </Card>
    </div>
  </div>
  
</template>
<script>
export default {
  data () {
    return {
      formInline: {
        user: '',
        password: '',
        // _token: window.Laravel.csrfToken
      },
      ruleInline: {
        user: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { type: 'string', min: 5, message: '密码长度不能小于5位', trigger: 'blur' }
        ]
      },
      backgroundImg: {
        backgroundImage: 'url("'+window.location.origin+'/images/login_bg.jpg")'
      }
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          if(sessionStorage.getItem("loginStatus") == "true") {
            // 如果已经登录 不允许重复登录
            this.$Notice.error({
              title: '重复登录',
              desc: '已经登录，请勿重复登录',
              duration: 3
            });
          }else {
            this.$http.post('/login',this.formInline).then(
              response => {
                // 请求成功
                if(response.data != '') {
                  // 登录成功 并将用户信息修改
                  this.$store.commit('loginSuccess', response.data)
                  if(this.$store.state.loginUserInfo.role == '0') {
                    this.$router.push({ path:'/index'})
                  }else {
                    this.$router.push({ path:'/home'})
                  }
                }else {
                  this.$Message.error('登录失败！账号或密码错误');
                }
              },
              response => {
                // 请求失败
                this.$Message.error(this.$store.state.responseErrorMsg)
              }
            )
          }
        } else {
          this.$Message.error('表单验证失败!');
        }
      })
    }
  }
}
</script>
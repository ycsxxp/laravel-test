<style scoped>
  .formDiv {
    margin: 0 auto;
    text-align: center;
    width: 100%;
    top: 30%;
    position: absolute;
  }
  .loginForm {
    width: 300px;
    float: right;
    margin-right: 150px;
  }
  .loginBtn {
    width: 100%;
  }
</style>
<template>
  <div class="formDiv">
    <Form class="loginForm" ref="formInline" :model="formInline" :rules="ruleInline" >
      <Form-item prop="user">
        <Input type="text" v-model="formInline.user" placeholder="请输入用户名">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
        </Input>
      </Form-item>
      <Form-item prop="password">
        <Input type="password" v-model="formInline.password" placeholder="请输入密码">
            <Icon type="ios-locked-outline" slot="prepend"></Icon>
        </Input>
      </Form-item>
      <Form-item>
        <Button class="loginBtn" type="primary" @click="handleSubmit('formInline')">登录</Button>
      </Form-item>
    </Form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formInline: {
        user: '',
        password: '',
        _token: window.Laravel.csrfToken
      },
      ruleInline: {
        user: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          // this.$Message.success('提交成功!');
          this.$http.post('/login',this.formInline).then(
            response => {
              // 请求成功
              if(response.data != '') {
                // 登录成功
                this.$store.commit('loginSuccess')
                this.$router.push({ path:'/index'});
              }else {
                this.$Message.error('登录失败！账号或密码错误');
              }
            },
            response => {
              // 请求失败
              console.log("b")
            }
          )
        } else {
          this.$Message.error('表单验证失败!');
        }
      })
    }
  }
}
</script>
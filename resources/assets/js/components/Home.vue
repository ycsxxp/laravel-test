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
              <Dropdown-menu slot="list">
                <Dropdown-item name='logout'>退出</Dropdown-item>
              </Dropdown-menu>
            </Dropdown>
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
  mounted () {
    this.$router.push({ path: '/homepage' });
  },
  methods: {
    routeTo(e) {
      // 跳转
      this.$router.push({ path: '/'+e });
    },
    userTodo(name) {
      if(name='logout') this.logout();
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
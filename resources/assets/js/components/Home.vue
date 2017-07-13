<style rel="stylesheet/scss" lang="scss" scoped>
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
    height: 100%;
    overflow: hidden;
  }
</style>
<template>
  <div class="wrapper">
    <div class="wrapper-header">
      <Menu mode="horizontal" theme="light" active-name="ceshi" @on-select="routeTo">
        <div class="wrapper-header-nav">
          <a href="/" class="wrapper-header-nav-logo">
            <img src="https://file.iviewui.com/dist/fe8d29da1225d943e30f9ee1bddce78f.png">
          </a>
          <div class="wrapper-header-nav-list">
            <Menu-item name="ceshi">
              首页
            </Menu-item>
            <Menu-item name="writer">
              发布文章
            </Menu-item>
            <Menu-item name="other">
              其他
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
    this.$router.push({ path: '/ceshi' });
  },
  methods: {
    routeTo(e) {
      // 跳转
      this.$router.push({ path: '/'+e });
    }
  }
}
</script>
<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: auto;
    height: 100%;
  }
  .layout-breadcrumb{
    padding: 10px 15px 0;
  }
  .layout-content{
    min-height: 200px;
    margin: 15px;
    overflow: auto;
    background: #fff;
    border-radius: 4px;
  }
  .layout-content-main{
    padding: 10px;
  }
  .layout-copy{
    bottom: 0;
    width: 100%;
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
  .layout-menu-left{
    /*background: #1c2438;*/
    background: #495060;
  }
  .layout-header{
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
    padding-right: 50px;
  }
  .layout-logo-left{
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }
  .layout-ceiling-main a{
    color: #9ba7b5;
  }
  .layout-hide-text .layout-text{
    display: none;
  }
  .ivu-col{
    overflow: auto;
    transition: width .2s ease-in-out;
  }
  .rowDiv {
    height: 100%;
  }
  .ivu-icon-ios-arrow-down:before{
    content: "";
  }
  .userIconDrop {
    float: right;
  }
  .userIcon {
    margin-top: 9px;
    height: 41px;
  }
</style>
<template>
  <div class="layout" :class="{'layout-hide-text': spanLeft < 3}">
    <Row type="flex" class-name="rowDiv" justify="center">
      <i-col :span="spanLeft" class="layout-menu-left">
        <div class="layout-logo-left"></div>
        <Menu mode="vertical" theme="dark" width="auto" active-name="article" :open-names="['1']" @on-select="routeTo" accordion>
          
          <Submenu v-for="menu in menuArr" :name="menu.name" :key="menu.id">
            <template slot="title">
              <Icon :type="menu.icon" :size="iconSize"></Icon>
              <span class="layout-text">{{menu.title}}</span>
            </template>
            <Menu-item v-for="submenu in menu.child" :name="submenu.name" :key="submenu.id">{{submenu.title}}</Menu-item>
          </Submenu>
        </Menu>
      </i-col>
      <i-col :span="spanRight">
        <div class="layout-header">
          <!-- <i-button type="text" @click="toggleClick">
              <Icon type="navicon" size="32"></Icon>
          </i-button> -->
          <Dropdown class="userIconDrop" trigger="hover" @on-click="userTodo">
            <div :style="{ float: 'left', marginRight: '10px', lineHeight: '60px' }">Hi, {{ this.$store.state.loginUserInfo.name }}</div>
            <Button class="userIcon" type="info" shape="circle">
              <Icon type="person" ></Icon>
            </Button>
            <Dropdown-menu slot="list">
              <Dropdown-item name='logout'>退出</Dropdown-item>
            </Dropdown-menu>
          </Dropdown>
        </div>
        <div class="layout-breadcrumb">
            <Breadcrumb>
                <Breadcrumb-item href="#">首页</Breadcrumb-item>
                <Breadcrumb-item v-for="(item,index) in breadCrumb" href="#" :key="index">{{ item.title }}</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="layout-content">
          <div class="layout-content-main">
            <transition mode="out-in">
              <router-view></router-view>
            </transition>
          </div>
        </div>
        <div class="layout-copy">
          2011-2016 &copy; NF - Wiki
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      breadCrumb: [],
      spanLeft: 3,
      spanRight: 21,
      menuArr: [
        {
          id: '1',
          name: '1',
          title: '内容管理',
          icon: 'ios-paper',
          child: [
              {
                  id: '1',
                  name: 'article',
                  title: '文章管理'
              },
              {
                  id: '2',
                  name: 'category',
                  title: '分类管理'
              },
              {
                  id: '3',
                  name: 'test',
                  title: '评论管理'
              }
          ]
        },
        {
          id: '2',
          name: '2',
          title: '用户管理',
          icon: 'ios-people',
          child: [
            {
              id: '1',
              name: 'user',
              title: '用户列表'
            },
            {
              id: '2',
              name: 'useractive',
              title: '活跃用户'
            }
          ]
        },
        {
          id: '3',
          name: '3',
          title: '设备管理',
          icon: 'monitor',
          child: [
            {
              id: '1',
              name: 'device',
              title: '设备列表'
            }
          ]
        }
      ]
    }
  },
  mounted () {
    // 获取面包屑显示
    this.$store.commit('setBreadCrumb', { 'clickName': this.menuArr[0].child[0].name, 'menuArr': this.menuArr, 'breadCrumb': this.breadCrumb})
    this.breadCrumb = this.$store.state.breadCrumb
    this.$router.push({ path: '/'+this.menuArr[0].child[0].name });
  },
  computed: {
    iconSize () {
      return this.spanLeft === 3 ? 14 : 24;
    }
  },
  methods: {
    toggleClick () {
      if (this.spanLeft === 3) {
        this.spanLeft = 2;
        this.spanRight = 22;
      } else {
        this.spanLeft = 3;
        this.spanRight = 21;
      }
    },
    userTodo(name) {
      if(name='logout') this.logout();
    },
    routeTo(e) {
      // 获取面包屑显示
      this.$store.commit('setBreadCrumb', { 'clickName': e, 'menuArr': this.menuArr, 'breadCrumb': this.breadCrumb})
      this.breadCrumb = this.$store.state.breadCrumb
      // 跳转
      this.$router.push({ path: '/'+e });
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
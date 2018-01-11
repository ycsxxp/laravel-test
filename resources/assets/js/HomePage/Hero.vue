<style rel="stylesheet/scss" lang="scss" scoped>
@for $i from 0 through 10 {
  .list-item-#{$i} .hero-name, .list-item-#{$i} .article-count { 
    // color: rgba(random(255), random(255), random(255), 1 ) ; 
    background: -webkit-linear-gradient(left, rgb(random(255), random(255), random(255)) , #fe5d4b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
<template>
  <Row>
    <Row class="title">
      <h2>英雄榜</h2>
    </Row>
    <Row class="hero-list">
      <Row class="list-item" :class="'list-item-'+index" v-for="(item,index) in heroList" :key="index" :style="{fontSize: 1.2 + 0.2 * Math.max(1, 5 - index ) + 'em'}">
        <Col span="8" class="hero-name">{{ item.username }}</Col>
        <Col span="16" class="article-count">{{ item.total }} Kill</Col>
      </Row>
    </Row>
  </Row>
</template>
<script>
export default {
  data () {
    return {
      heroList: {
        name: '',
        total: 0
      }
    }
  },
  mounted () {
    this.getHeroList()
  },
  methods: {
    getHeroList() {
      let payload = {
        _token: window.Laravel.csrfToken
      }
      this.$http.get( '/getHeroList', payload ).then(
        response => {
          // 请求成功 得到排序后的列表
          this.heroList = response.data
        },
        response => {
          // 请求失败
          this.$Message.error(this.$store.state.responseErrorMsg)
        }
      )
    },
  }
}
</script>
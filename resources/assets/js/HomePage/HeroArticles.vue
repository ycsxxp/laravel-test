<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'resources/assets/sass/_homepage.scss';

  .content .content_left {
    width: 100%;
    .article_section {
      width: 85%;
    }
  }

</style>
<template>
  <Row class="content">
    <Col class="content_left">
      <section class="article_section" v-for="article in articleInfo">
        <div class="title">
          <h2>{{article.title}}</h2>
        </div>
        <div class="cover">
          <!-- <img src="images/72620b440e684eae9376c87a8d60f050.webp"> -->
        </div>
        <div class="summary" v-html="article.content">
        </div>
        <div class="infoDiv">
          <Button class="readmore" type="info"  @click="showDetail(article.id)">详细</Button>
          <span class="visit_span"><Icon type="ios-eye" color=""></Icon> 访问量 {{article.visit_count}}</span>
          <span class="username_span"><Icon type="person" color=""></Icon> {{article.username}}</span>
          <span class="time_span"><Icon type="ios-clock"></Icon> {{article.created_at}}</span>
        </div>
      </section>
    </Col>
  </Row>
</template>
<script>

export default {
  data () {
    return {
      articleInfo: {}
    }
  },
  mounted() {
    this.getArticlesByHero(this.$route.params.user_id)
  },
  watch: {
    // 监测路由变化
    $route() {
      this.getArticlesByHero(this.$route.params.user_id)
    }
  },
  methods: {
    getArticlesByHero(user_id) {
      let payload = {
        user_id: user_id,
        _token: window.Laravel.csrfToken
      }
      this.$http.post('/getArticlesByHero', payload).then(
        response => {
          this.articleInfo = response.data
        },
        response => {
          // 请求失败
          this.$Message.error(this.$store.state.responseErrorMsg)
        }
      )
    },
    showDetail(id) {
      this.$router.push({ path: '/detail/'+id })
    }
  },
}
</script>
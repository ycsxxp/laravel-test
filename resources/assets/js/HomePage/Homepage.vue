<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'resources/assets/sass/_homepage.scss';
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
          <span class="time_span"><Icon type="ios-clock"></Icon> {{article.created_at}}</span>
        </div>
      </section>
      <div class="pagination">
        <Page :total="paginationInit.total" placement="top" size="small" show-elevator show-sizer :current="paginationInit.page" :page-size="paginationInit.size" :page-size-opts="paginationInit.sizeOpt" @on-change="changePage" @on-page-size-change="setPageSize"></Page>
      </div>
    </Col>
    <Col class="content-right">
      <Row>
        <hero></hero>
      </Row>
      <Row>
        <catalog></catalog>
      </Row>
    </Col>
  </Row>
</template>
<script>
import Hero from './Hero.vue'
import Catalog from './Catalog.vue'

export default {
  data () {
    return {
      articleInfo: {},
      hotArticleList: {},
      recentArticleList: {},
      articleDetail: {},
      paginationInit: {
        total: 1,
        page: this.$store.state.pageConfig.currentPage,
        size: this.$store.state.pageConfig.pageSize,
        sizeOpt: [5, 10, 15, 20]
      }
    }
  },
  components: {
    Catalog,
    Hero
  },
  created () {
    this.getArticle()
  },
  methods: {
    getArticle() {
      let payload = {
        size: this.paginationInit.size,
        page: this.paginationInit.page
      }
      this.$http.post('/getArticle', payload).then(
        response => {
          this.articleInfo = response.data.articles
          this.paginationInit.total = response.data.total
          this.hotArticleList = this.articleInfo
          this.recentArticleList = this.articleInfo
        },
        response => {
          this.$Message.error(this.$store.state.responseErrorMsg)
        }
      )
    },
    showDetail (id) {
      this.$router.push({ path: '/detail/'+id })
      // // 保持打开时定位在文章顶部
      // this.$nextTick(function () {
      //   document.body.scrollTop = 0
      //   document.documentElement.scrollTop = 0
      // })
    },
    changePage (page) {
      let payload = {
        page: page,
        size: this.paginationInit.size
      }
      this.$store.commit('setPageConfig', payload)
      this.paginationInit.page = page
      this.getArticle()
    },
    setPageSize (size) {
      let payload = {
        page: this.paginationInit.page,
        size: size
      }
      this.$store.commit('setPageConfig', payload)
      this.paginationInit.size = size
      this.getArticle()
    }
  },
}
</script>
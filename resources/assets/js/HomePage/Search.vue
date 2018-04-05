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
          <span class="time_span"><Icon type="ios-clock"></Icon> {{article.created_at}}</span>
        </div>
      </section>
      <div class="pagination">
        <Page :total="paginationInit.total" placement="top" size="small" show-elevator show-sizer :current="paginationInit.page" :page-size="paginationInit.size" :page-size-opts="paginationInit.sizeOpt" @on-change="changePage" @on-page-size-change="setPageSize"></Page>
      </div>
    </Col>
  </Row>
</template>
<script>

export default {
  data () {
    return {
      articleInfo: {},
      // articleDetail: {},
      paginationInit: {
        total: 1,
        page: this.$store.state.searchPageConfig.currentPage,
        size: this.$store.state.searchPageConfig.pageSize,
        sizeOpt: [5, 10, 15, 20]
      }
    }
  },
  mounted() {
    this.getSearchResult(this.$route.params.keyword)
  },
  watch: {
    // 监测路由变化
    $route() {
      this.getSearchResult(this.$route.params.keyword)
    }
  },
  methods: {
    changePage (page) {
      let payload = {
        page: page,
        size: this.paginationInit.size
      }
      this.$store.commit('setSearchPageConfig', payload)
      this.paginationInit.page = page
      this.getSearchResult(this.$route.params.keyword)
    },
    setPageSize (size) {
      let payload = {
        page: this.paginationInit.page,
        size: size
      }
      this.$store.commit('setSearchPageConfig', payload)
      this.paginationInit.size = size
      this.getSearchResult(this.$route.params.keyword)
    },
    getSearchResult(searchKeyword) {
      let payload = {
        size: this.paginationInit.size,
        page: this.paginationInit.page,
        searchKeyword: searchKeyword,
        _token: window.Laravel.csrfToken
      }
      this.$http.post('/searchArticle', payload).then(
        response => {
          this.articleInfo = response.data.articles
          this.paginationInit.total = response.data.total
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
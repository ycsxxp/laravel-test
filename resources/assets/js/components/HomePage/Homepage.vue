<style rel="stylesheet/scss" lang="scss" scoped>
  .content {
    width: 100%;
    .backBtn {
      width: 100px;
      position: absolute;
      float: right;
      margin-left: 690px;
      margin-top: 30px;
    }
    .content_left {
      width: 70%;
      float: left;
      .wenzhang_section {
        width: 70%;
        margin: 0 auto;
        margin-bottom: 20px;
        padding: 20px 15px 15px 20px;
        .title {
          height: 30px;
          margin: 0 0 10px 0;
        }
        .cover {
          width: 100%;
          img {
            width: auto;  
            height: auto;  
            max-width: 100%;  
            max-height: 100%;
          }
        }
        .summary {
          margin: 20px 0 20px 0;
          height: 50px;
        }
        .readmore {

        }
      }

      .detail_section {
        padding: 30px 50px 0 50px;
        .title_detail {
          // margin-bottom: 
        }
        .content_detail {
          margin-top: 30px;
        }  
      }
      
    }
    .content-right {
      width: 30%;
      float: left;
      .remen-section {
        padding: 20px 15px 15px 20px;
        .remen-list {
          margin: 20px 0 0 20px;
        }
      }
      .recent-section {
        padding: 20px 15px 15px 20px;
        .recent-list {
          margin: 20px 0 0 20px;
        }
      }
    }
  }
</style>
<template>
  <div class="content">
    <div class="backBtn" v-show="detail"><Button type="success" @click="back">返回</Button></div>
    <div class="content_left">
      <section v-show="!detail" class="wenzhang_section" v-for="article in articleInfo">
        <div class="title">
          <h2>{{article.title}}</h2>
        </div>
        <div class="cover">
          <img src="images/72620b440e684eae9376c87a8d60f050.webp">
        </div>
        <div class="summary" v-html="summaryFilter(article.content)">
        </div>
        <div class="readmore" @click="showDetail(article)">
          <Button type="info">详细</Button>
        </div>
      </section>
      <section class="detail_section" v-show="detail">
        <div class="title_detail">
          <h2>{{articleDetail.title}}</h2>
        </div>
        <div class="title_span">
          最后编辑于 {{articleDetail.updated_at}}
        </div>
        <div class="content_detail">
          <div v-html="articleDetail.content">
          </div>
        </div>
      </section>
    </div>
    <div class="content-right">
      <section class="remen-section">
        <div class="title">
          <h2>热门文章</h2>
        </div>
        <ul class="remen-list">
          <li v-for="article in visitOrderedArticleInfo">
            {{article.title}}
          </li>
        </ul>
      </section>
      <section class="recent-section">
        <div class="title">
          <h2>最新文章</h2>
        </div>
        <ul class="recent-list">
          <li v-for="article in hotOrderedArticleInfo">
            {{article.title}}
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      detail: false,
      articleInfo: {
        title: '',
        content: '',
      },
      articleDetail: {}
    }
  },
  beforeMount () {
    this.getArticle()
  },
  computed: {
    // 过滤器
    visitOrderedArticleInfo: function () {
      return _.orderBy(this.articleInfo, 'visit_count', 'desc')
    },
    hotOrderedArticleInfo: function () {
      return _.orderBy(this.articleInfo, 'created_at', 'asc')
    }
  },
  methods: {
    summaryFilter (val) {
      return (val || "").substring(0, 100)
    },
    back () {
      this.detail = false
    },
    getArticle () {
      this.$http.post('/getArticle', {_token: window.Laravel.csrfToken}).then(
        response => {
          this.articleInfo = response.data
          console.log(this.articleInfo)
        },
        response => {
          this.$Message.error('获取失败,请重试!');
        }
      )
    },
    showDetail (article) {
      this.detail = true
      // 查看详细之后 阅读量增加
      this.visitCountUp(article.id)
      // 保持打开时定位在文章顶部
      this.$nextTick(function () {
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      })
      this.articleDetail = article
    },
    visitCountUp (id) {
      let payload = {
        id: id,
        _token: window.Laravel.csrfToken
      }
      this.$http.post('/visitCountUp', payload).then(
        response => {
          // 请求成功
          console.log(response.data)
        },
        response => {
          // 请求失败
          this.$Message.error('阅读量增加失败')
        }
      )
    }
  },
}
</script>
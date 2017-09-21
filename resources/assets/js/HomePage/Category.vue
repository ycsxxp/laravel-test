<style rel="stylesheet/scss" lang="scss" scoped>
  .content {
    width: 100%;
    height: 100%;
    // padding-top: 20px;
    .backBtn {
      width: 100px;
      position: absolute;
      float: right;
      margin-left: 690px;
      margin-top: 30px;
    }
    .content_left {
      color: #495060;
      width: 20%;
      height: 100%;
      float: left;
      .cate_nav {
        height: 100%;
        padding-top: 20px;
        li {
          padding-top: 8px;
          padding-bottom: 8px;
        }
        @for $i from 1 through 10 {
          .li-level-#{$i} { 
            padding-left: 20px + 20px * ($i - 1) ; 
            font-size: 14px - 2px * ($i - 1);
          }
        }
      }
    }
    .content_right {
      width: 80%;
      float: left;
      padding-top: 50px;
      .article_section {
        width: 90%;
        margin: 0 auto;
        margin-bottom: 20px;
        padding: 10px 15px 10px 15px;
        border-style: solid;
        border-width: 1px;
        .title {
          height: 30px;
          margin: 0 0 10px 0;
        }
        .summary {
          margin: 0px 0 10px 0;
          height: 89px;
          overflow: hidden;
        }
        .infoDiv {
          position: relative;
          .visit_span {
            position: absolute;
            bottom: 0px;
            margin-left: 20px;
          }
          .time_span {
            position: absolute;
            bottom: 0px;
            right: 20px;
          }
        }
      }
      .pagination {
        float: right;
        margin: 20px 120px 30px 0px;
      }
    }

    .content_right:after {
      content: "";
      display: block;
      width: 1px;
      background: #d7dde4;
      position: absolute;
      top: 0;
      bottom: 0;
      left: -1px;
    }
  }
</style>
<template>
  <Row class="content">
    <Col class="content_left">
      <ul class="ivu-menu ivu-menu-light ivu-menu-vertical cate_nav">
        <li v-for="(item, index) in categoryList" :class="['ivu-menu-item', {'ivu-menu-item-active ivu-menu-item-selected': activeId == item.id}, 'li-level-'+item.c_level]" @click="getArticleByCategory(item.id)">
            {{ item.c_title }}
        </li>
      </ul>
    </Col>
    <Col class="content_right">
      <section class="article_section" v-for="(article, index) in articleList">
        <div class="title">
          <h2>{{article.title}}</h2>
        </div>
        <div class="summary" v-html="article.content">
        </div>
        <div class="infoDiv">
          <Button class="readmore" type="info"  @click="showDetail(article.id)">详细</Button>
          <span class="visit_span"><Icon type="ios-eye" color=""></Icon> 访问量 {{article.visit_count}}</span>
          <span class="time_span"><Icon type="ios-clock"></Icon> {{article.created_at}}</span>
        </div>
      </section>
    </Col>
  </Row>
</template>
<script>
  export default {
    data() {
      return {
        activeId: '1',
        categoryInfo: {
          title: '',
          parent: '0',
          order: '',
        },
        categoryList: {},
        articleList: {}
      }
    },
    computed: {
    },
    mounted() {
      this.getCatory()
      this.getArticleByCategory(this.activeId)
    },
    methods: {
      showDetail (id) {
        this.$router.push({ path: '/detail/'+id })
        // 保持打开时定位在文章顶部
        this.$nextTick(function () {
          document.body.scrollTop = 0
          document.documentElement.scrollTop = 0
        })
      },
      getCatory() {
        let payload = {
          // _token: window.Laravel.csrfToken
        }
        this.$http.post('/getCategory' , payload).then(
          response => {
            // 请求成功
            this.categoryList = response.data
          },
          response => {
            // 请求失败
            this.$Message.error(this.$store.state.responseErrorMsg)
          }
        )
      },
      getArticleByCategory(id) {
        this.activeId = id
        let payload = {
          id: id,
          // _token: window.Laravel.csrfToken
        }
        this.$http.post('/getArticleByCategory' , payload).then(
          response => {
            // 请求成功
            this.articleList = response.data
          },
          response => {
            // 请求失败
            this.$Message.error(this.$store.state.responseErrorMsg)
          }
        )
      }
    }
  }
</script>
<template>
  <div>
    <section class="remen-section">
      <div class="title">
        <h2>热门文章</h2>
      </div>
      <ul class="remen-list">
        <li v-for="article in hotArticleInfo">
          <a @click="showDetail(article.id)">{{article.title}}</a>
        </li>
      </ul>
    </section>
    <section class="recent-section">
      <div class="title">
        <h2>推荐文章</h2>
      </div>
      <ul class="recent-list">
        <li v-for="article in recentArticleInfo">
          <a @click="showDetail(article.id)">{{article.title}}</a>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
export default {
  data () {
    return {
      orderArticleList: {
        visitList: {},
        likeList: {}
      }
    }
  },
  // 对传进来的 recent, hot 参数监听 父组件修改后 同步修改到子组件
  watch: {
    recent(val) {
      this.visitList = val;//新增result的watch，监听变更并同步到myResult上
    },
    hot(val) {
      this.likeList = val;//新增result的watch，监听变更并同步到myResult上
    },
  },
  mounted () {
    this.getOrderArticleList()
  },
  computed: {
    // 过滤器
    hotArticleInfo: function () {
      return _.orderBy(this.orderArticleList.likeList, 'like_count', 'desc').slice(0, 5)
    },
    recentArticleInfo: function () {
      return _.orderBy(this.orderArticleList.visitList, 'visit_count', 'desc').slice(0, 5)
    }
  },
  methods: {
    getOrderArticleList() {
      let payload = {
        _token: window.Laravel.csrfToken
      }
      this.$http.post( '/getOrderArticleList', payload ).then(
        response => {
          // 请求成功 得到排序后的列表
          this.orderArticleList.likeList = response.data.order_by_like
          this.orderArticleList.visitList = response.data.order_by_visit
        },
        response => {
          // 请求失败
          this.$Message.error('网络错误,请重试!')
        }
      )
    },
    showDetail(id) {
      this.$router.push({ path: '/detail/'+id })
    }
  }
}
</script>
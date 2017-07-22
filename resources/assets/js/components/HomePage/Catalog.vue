<template>
  <div class="content-right">
    <section class="remen-section">
      <div class="title">
        <h2>热门文章</h2>
      </div>
      <ul class="remen-list">
        <li v-for="article in hotArticleInfo">
          <a @click="showDetail(article)">{{article.title}}</a>
        </li>
      </ul>
    </section>
    <section class="recent-section">
      <div class="title">
        <h2>推荐文章</h2>
      </div>
      <ul class="recent-list">
        <li v-for="article in recentArticleInfo">
          <a @click="showDetail(article)">{{article.title}}</a>
        </li>
      </ul>
    </section>
  </div>
</template>
<script>
export default {
  props: ["list"],
  data () {
    return {
      articleInfo: this.list
    }
  },
  // 对传进来的 list参数监听 父组件修改后 同步修改到子组件
  watch: {
    list(val) {
      this.articleInfo = val;//新增result的watch，监听变更并同步到myResult上
    }
  },
  mounted () {
    console.log(this.list)
  },
  computed: {
    // 过滤器
    hotArticleInfo: function () {
      return _.orderBy(this.articleInfo, 'like_count', 'desc').slice(0, 5)
    },
    recentArticleInfo: function () {
      return _.orderBy(this.articleInfo, 'visit_count', 'desc').slice(0, 5)
    }
  },
  methods: {
    showDetail (article) {
      console.log(article)
    }
  }
}
</script>
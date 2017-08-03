<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'resources/assets/sass/_homepage.scss';
</style>
<template>
  <div class="content">
    <div class="content_left">
      <div class="backBtn"><Button type="success" @click="back">返回</Button></div>
      <section class="detail_section">
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
      <catalog></catalog>  
    </div>
  </div>
</template>
<script>
import Catalog from './Catalog.vue'

export default {
  // props: ["id"],
  data () {
    return {
      // articleId: this.id,
      articleDetail: {}
    }
  },
  components: {
    Catalog
  },
  // 对传进来的 recent, hot 参数监听 父组件修改后 同步修改到子组件
  // watch: {
  //   id(val) {
  //     this.articleId = val //新增result的watch，监听变更并同步到myResult上
  //     this.getArticleDetail(this.articleId)
  //   },
  // },
  mounted() {
    this.getArticleDetail(parseInt(this.$route.params.id))
  },
  methods: {
    back() {
      this.$router.push({ path: '/homepage' })
    },
    getArticleDetail(articleId) {
      let payload = {
        id: articleId,
        _token: window.Laravel.csrfToken
      }
      this.$http.post('/getArticleDetail', payload).then(
        response => {
          // 请求成功 返回当前id文章
          this.articleDetail = response.data
        },
        response => {
          // 请求失败
          this.$Message.error('获取失败')
        }
      )
    }
  }
}
</script>
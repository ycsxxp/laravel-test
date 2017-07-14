<style rel="stylesheet/scss" lang="scss" scoped>
  .content {
    width: 100%;
    .content-left {
      width: 70%;
      float: left;
      .wenzhang-section {
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
    <div class="content-left">
      <section class="wenzhang-section" v-for="article in articleInfo">
        <div class="title">
          <h2>{{article.title}}</h2>
        </div>
        <div class="cover">
          <img src="https://static.wixstatic.com/media/72620b440e684eae9376c87a8d60f050.jpg/v1/fill/w_550,h_367,al_c,q_80,usm_0.66_1.00_0.01/72620b440e684eae9376c87a8d60f050.webp">
        </div>
        <div class="summary" v-html="article.content.substring(0, 100)">
        </div>
        <div class="readmore">
          <Button type="info">Readmore</Button>
        </div>
      </section>
    </div>
    <div class="content-right">
      <section class="remen-section">
        <div class="title">
          <h2>热门文章</h2>
        </div>
        <ul class="remen-list">
          <li>不知道写什么就随便一下</li>
          <li>不知道写什么就随便一下</li>
          <li>不知道写什么就随便一下</li>
          <li>不知道写什么就随便一下</li>
        </ul>
      </section>
      <section class="recent-section">
        <div class="title">
          <h2>最新文章</h2>
        </div>
        <ul class="recent-list">
          <li>不知道写什么就随便一下</li>
          <li>不知道写什么就随便一下</li>
          <li>不知道写什么就随便一下</li>
          <li>不知道写什么就随便一下</li>
        </ul>
      </section>
    </div>
  </div>
</template>
<script>
// Vue.filter('summaryCut', str)
export default {
  data () {
    return {
      articleInfo: {
        title: '',
        content: '',
      },
    }
  },
  beforeMount () {
    this.getArticle()
  },
  methods: {
    getArticle () {
      this.$http.post('/getArticle', {_token: window.Laravel.csrfToken}).then(
        response => {
          this.articleInfo = response.data
        },
        response => {
          this.$Message.error('获取失败,请重试!');
        }
      )
    },
  },
  filter () {

  }
}
</script>
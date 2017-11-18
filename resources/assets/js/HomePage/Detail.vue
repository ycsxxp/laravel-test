<style rel="stylesheet/scss" lang="scss" scoped>
  @import 'resources/assets/sass/_homepage.scss';
  .detail_section {
    padding: 30px 50px 30px 50px;
    overflow: hidden;
    .title_detail {
      margin-bottom: 5px;
    }
    .content_detail {
      float: left;
      margin-top: 20px;
      width: 100%;
    }
  }
  :global(.content_detail img) {
    max-width: 650px;
  }
  .attachfile_list {
    float: left;
    width: 100%;
    margin-top: 20px;
    border: 1px solid #dddee1;
  }
  .backBtn {
    width: 100%;
    text-align: right;
    position: absolute;
    float: right;
    margin-top: 30px;
    padding-right: 50px;
  }
  :global(.ivu-upload-list-file) {
    float: left;
  }
</style>
<template>
  <Row class="content">
    <Col class="content_left">
      <div class="backBtn">
        <Button type="success" @click="back">返回</Button>
      </div>
      <section class="detail_section">
        <div class="title_detail">
          <h2>{{articleDetail.title}}</h2>
        </div>
        <div class="title_span">
          <span style="margin-right:10px;">{{articleDetail.updated_user}}</span>最后编辑于 {{articleDetail.updated_at}}
        </div>
        <div class="attachfile_list" v-show="attachfiles.length > 0">
          <label>包含附件</label>
          <ul class="ivu-upload-list" style="margin-top:0px;">
            <li v-for="(item, index) in attachfiles" class="ivu-upload-list-file ivu-upload-list-file-finish" :style="{ paddingRight:'20px' }">
              <a :href="'/downloadfile?id='+item.id" :download="item.f_name"><i class="ivu-icon ivu-icon-document-text"></i>{{item.f_name}}</a>
            </li>
          </ul>
        </div>
        <div class="content_detail">
          <!-- <div v-html="articleDetail.content">
          </div> -->
          <mavon-editor v-model='articleDetail.content' style="height: 100%"
            :editable="false"
            :subfield="false"
            :toolbarsFlag="false"
            :ishljs="true"
            code_style="code-hybrid"
            default_open="preview"
          ></mavon-editor>
        </div>
      </section>
    </Col>
    <Col class="content-right">
      <catalog></catalog>  
    </Col>
  </Row>
</template>
<script>
import Catalog from './Catalog.vue'

import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  // props: ["id"],
  data () {
    return {
      // articleId: this.id,
      articleDetail: {},
      attachfiles: {}
    }
  },
  components: {
    Catalog,
    mavonEditor
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
  // updated() {
  //   this.getArticleDetail(parseInt(this.$route.params.id))
  // },
  methods: {
    back() {
      // this.$router.push({ path: '/homepage' })
      this.$router.go(-1)
    },
    getArticleDetail(articleId) {
      let payload = {
        id: articleId,
        _token: window.Laravel.csrfToken
      }
      this.$http.post('/getArticleDetail', payload).then(
        response => {
          // 请求成功 返回当前id文章
          this.articleDetail = response.data.articles
          this.attachfiles = response.data.attachfiles
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
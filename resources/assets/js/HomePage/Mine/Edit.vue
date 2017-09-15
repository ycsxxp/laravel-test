<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  width: 100%;
  padding: 40px 80px 20px 80px;
}
:global(.quilleditor .ql-editor) {
  height: 480px;
}
:global(.ivu-input .ivu-input-large) {
  border: none;
}
@for $i from 2 through 10 {
  .option-#{$i} { padding-left: 20px * $i ; }
}
</style>
<template>
  <Row class="content">
    <Form ref="articleDetail" :model="articleDetail" label-position="top" :rules="articleValidate">
      <FormItem label="标题" prop="title">
        <Input v-model="articleDetail.title" size="large"></Input>
      </FormItem>
      <FormItem label="分类" prop="category">
        <Select v-model="articleDetail.category" >
          <Option v-for="(item,index) in categoryList" :value="item.id" :key="index" :class="'option-'+item.c_level">{{ item.c_title }}
          </Option>
        </Select>
      </FormItem>
      <FormItem class="editor_container" label="正文" prop="content">
        <quill-editor v-model="articleDetail.content" class="quilleditor" ref="myQuillEditor" :option="editorOption" @ready="onEditorReady($event)"></quill-editor>
      </FormItem>
      <FormItem>
        <a @click="addAttachToggle">{{ addAttach ? '取消添加':'添加附件' }}</a>
      </FormItem>
      <FormItem label="附件" prop="attach" v-show="addAttach">
        <Upload
          ref="upload"
          multiple
          type="drag"
          action="/postfile"
          :default-file-list="defaultList"
          >
          <div style="padding: 20px 0">
            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
            <p>点击或将文件拖拽到这里上传</p>
          </div>
        </Upload>
      </FormItem>
      <FormItem class="submitBtn">
        <Button type="info" @click="handleSubmit()">发布</Button>
      </FormItem>
    </Form>
  </Row>
</template>
<script>
// 富文本编辑器 https://github.com/surmon-china/vue-quill-editor
import { quillEditor } from 'vue-quill-editor'

export default {
  data() {
    return {
      defaultList: [
        {
          name: '测试默认显示'
        },
        {
          name: '仍然测试'
        }
      ],
      articleDetail: {
        // title: '这里是文章标题',
        // cate: '',
        // content: '',
        // user_id: this.$store.state.loginUserInfo.id,
      },
      attachfiles: {},
      categoryList: {},
      editorOption: {

      },
      addAttach: false,
      articleValidate: {
        title: [
          { required: true, message: '文章标题不能为空', trigger: 'blur' }
        ],
        cate: [
          { required: true, message: '文章分类不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '文章内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    quillEditor
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted () {
    this.getCatoryForSelect()
    this.getEditDetail(parseInt(this.$route.params.id))
  },
  methods: {
    onEditorReady(editor) {
      // console.log('editor ready!', editor)
    },
    addAttachToggle() {
      this.addAttach = !this.addAttach
    },
    getCatoryForSelect () {
      let payload = {
        _token: window.Laravel.csrfToken
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
    getEditDetail(articleId) {
      let payload = {
        params: {
          id: articleId
        }
      }
      this.$http.get('/getEditDetail', payload).then(
        response => {
          // 请求成功
          console.log(response)
          this.articleDetail = response.data.articleDetail
          this.addAttach = JSON.parse(this.articleDetail.attachfiles_id)==null ? false : true
          this.attachfiles = response.data.attachfiles
        },
        response => {
          // 请求失败
          this.$Message.error(this.$store.state.responseErrorMsg)
        }
      )
    }
  }
  // let payload = {
  //       // 文章id
  //       id: params.row.id,
  //       // 用户id
  //       user_id: params.row.user_id
  //     }
  //     this.$http.post('/editArticleDetail', payload).then(
  //       response => {
          
  //       },
  //       response => {

  //       }
  //     )
}
</script>
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
        <!-- <quill-editor v-model="articleDetail.content" class="quilleditor" ref="myQuillEditor" :option="editorOption" @ready="onEditorReady($event)"></quill-editor> -->
        <div style="height: 580px;">
          <mavon-editor ref="myMavonEditor" v-model='articleDetail.content' style="height: 100%" 
            :ishljs="true"
            code_style="code-hybrid"
          ></mavon-editor>
        </div>
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
          :on-success="postfileSuccess"
          :on-remove="postfileRemove"
          :format="['txt', 'doc', 'docx', 'xlsx']"
          :max-size="2048"
          :on-format-error="postfileFormatError"
          :on-exceeded-size="postfileMaxSize"
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

import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  data() {
    return {
      defaultList: [],
      articleDetail: {},
      attachfiles: [],
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
    quillEditor,
    mavonEditor
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
    postfileRemove (file) {
      // 从 upload 实例删除数据
      // const fileList = this.$refs.upload.fileList;
      // this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
    },
    postfileSuccess (res, file) {
      // 因为上传过程为实例，这里模拟添加 url
      let attachfile_id = res.id
      this.articleDetail.attachfiles_id.push(attachfile_id)
    },
    postfileFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件 ' + file.name + ' 格式不正确，请上传 txt,doc,docx,xlsx 格式的文件。'
      });
    },
    postfileMaxSize (file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
      });
    },
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
          console.log(response.data)
          this.articleDetail = response.data.articleDetail
          this.addAttach = this.articleDetail.attachfiles_id.length == 0 ? false : true
          this.defaultList = response.data.attachfiles
        },
        response => {
          // 请求失败
          this.$Message.error(this.$store.state.responseErrorMsg)
        }
      )
    },
    handleSubmit() {
      this.$http.post( '/updateDetail', this.articleDetail ).then(
        response => {
          this.$Message.success('添加成功!')
          this.$router.push({ path: '/homepage' })
        },
        response => {
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
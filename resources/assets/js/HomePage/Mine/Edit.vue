<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  width: 100%;
  padding: 40px 80px 20px 80px;
}
:global(.ivu-input .ivu-input-large) {
  border: none;
}

:global(.v-note-wrapper) {
  z-index: 0;
}
:global(.v-note-wrapper.fullscreen) {
  z-index: 1501;
}

@for $i from 2 through 10 {
  .option-#{$i} { padding-left: 20px * $i ; }
}
</style>
<template>
  <Row class="content">
    <Form ref="articleDetail" :model="articleDetail" label-position="top" :rules="articleValidate">
      <Row>
        <Col span="10">
          <FormItem label="标题" prop="title" style="width:95%">
            <Input v-model="articleDetail.title" size="large"></Input>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="分类" prop="category_id" style="width:95%">
            <Select v-model="articleDetail.category_id" >
              <Option v-for="(item,index) in categoryList" :value="item.id" :key="index" :class="'option-'+item.c_level">{{ item.c_title }}
              </Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="6">
          <FormItem label="共同编辑人" prop="" style="width:100%">
            <Select
              v-model="shareUserId"
              v-bind:disabled="!shareSelectShow"
              multiple
              filterable
              placeholder="可选择"
            >
              <Option v-for="(item,index) in userList" :value="item.id" :key="index">{{ item.name }}
              </Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <FormItem class="editor_container" label="正文" prop="content">
          <!-- <quill-editor v-model="articleDetail.content" class="quilleditor" ref="myQuillEditor" :option="editorOption" @ready="onEditorReady($event)"></quill-editor> -->
          <div style="height: 580px;">
            <mavon-editor ref="myMavonEditor" v-model='articleDetail.content' style="height: 100%" 
              :ishljs="true"
              code_style="code-hybrid"
              @imgAdd="$imgAdd"
            ></mavon-editor>
          </div>
        </FormItem>
      </Row>
      <Row>
        <FormItem>
          <a @click="addAttachToggle">{{ addAttach ? '收起':'附件' }}</a>
        </FormItem>
      </Row>
      <Row>
        <FormItem prop="attach" v-show="addAttach">
          <Upload
            ref="upload"
            multiple
            type="drag"
            action="/postfile"
            :default-file-list="defaultList"
            :on-success="postfileSuccess"
            :on-remove="postfileRemove"
            :format="['txt', 'doc', 'docx', 'xlsx']"
            :max-size="5120"
            :on-format-error="postfileFormatError"
            :on-exceeded-size="postfileMaxSize"
            >
            <div style="padding: 20px 0">
              <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
              <p>点击或将文件拖拽到这里上传</p>
            </div>
          </Upload>
        </FormItem>
      </Row>
      <Row>
        <FormItem class="submitBtn">
          <Button type="info" @click="handleSubmit()">发布</Button>
        </FormItem>
      </Row>
    </Form>
  </Row>
</template>
<script>
// 富文本编辑器 https://github.com/surmon-china/vue-quill-editor
// import { quillEditor } from 'vue-quill-editor'

import { mavonEditor } from 'mavon-editor'

export default {
  data() {
    return {
      defaultList: [],
      articleDetail: {},
      attachfiles: [],
      categoryList: {},
      shareSelectShow: true,
      shareUserId: [],
      userList: {},
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
    // quillEditor,
    mavonEditor
  },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted () {
    this.getCatoryForSelect()
    this.getUserList()
    this.getEditDetail(parseInt(this.$route.params.id))
  },
  methods: {
    $imgAdd(pos, $file){
      let formdata = new FormData();
      formdata.append('img', $file);
      let $vm = this.$refs.myMavonEditor
      this.$http.post('/saveUploadImg' , formdata).then(
        response => {
          // 请求成功
          // 修改MD内容中的路径 ./0 为 ./相对路径
          $vm.$img2Url(pos, response.data.url)
          // 修改在上传图片处显示的 ./0 为 ./相对路径
          for (var i = $vm.$refs.toolbar_left.img_file.length - 1; i >= 0; i--) {
            $vm.$refs.toolbar_left.img_file[i][0] = response.data.url
          }
        },
        response => {
          // 请求失败
          this.$Message.error(this.$store.state.responseErrorMsg)
        }
      )
    },
    postfileRemove (file) {
      let payload = {
        file: typeof(file.id) !=='undefined' ? file : file.response
      }
      this.$http.post('/deletefile', payload).then(
        response => {
          // 请求成功
          this.$Message.success(response.data.msg)
        },
        response => {
          // 请求失败
          this.$Message.error(this.$store.state.responseErrorMsg)
        }
      )
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
        desc: '文件 ' + file.name + ' 太大，不能超过 5M。'
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
    getUserList() {
      let payload = {
        _token: window.Laravel.csrfToken
      }
      this.$http.get('/getUserList', payload).then(
        response => {
          // 请求成功
          this.userList = response.data
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
          this.articleDetail = response.data.articleDetail
          this.shareSelectShow = this.articleDetail.user_id === this.$store.state.loginUserInfo.id
          this.addAttach = this.articleDetail.attachfiles_id.length == 0 ? false : true
          this.defaultList = response.data.attachfiles
          // 共同编辑人
          this.shareUserId = response.data.shareUserId
        },
        response => {
          // 请求失败
          this.$Message.error(this.$store.state.responseErrorMsg)
        }
      )
    },
    handleSubmit() {
      this.articleDetail.share_user_id = this.shareUserId
      this.$http.post( '/updateDetail', this.articleDetail ).then(
        response => {
          if (response.data.msg == "success") {
            this.$Message.success('编辑成功!')
            this.$router.push({ path: '/homepage' })
          }
        },
        response => {
          this.$Message.error(this.$store.state.responseErrorMsg)
        }
      )
    }
  }
}
</script>
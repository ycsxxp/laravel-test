<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  width: 100%;
  padding: 40px 80px 40px 80px;
  .editor_container {
    margin-bottom: 120px;
    .quilleditor {
      height: 480px;
    }
  }
}
:global(.ivu-input .ivu-input-large) {
  border: none;
}
@for $i from 2 through 10 {
  .option-#{$i} { padding-left: 20px * $i ; }
}
</style>
<template>
  <div class="content">
    <Form ref="articleInfo" :model="articleInfo" label-position="top" :rules="articleValidate">
      <FormItem label="标题" prop="title">
        <Input v-model="articleInfo.title" size="large"></Input>
      </FormItem>
      <FormItem label="分类" prop="cate">
        <Select v-model="articleInfo.cate" >
          <Option v-for="(item,index) in categoryList" :value="item.id" :key="index" :class="'option-'+item.c_level">{{ item.c_title }}
          </Option>
        </Select>
      </FormItem>
      <FormItem class="editor_container" label="正文" prop="content">
        <quill-editor v-model="articleInfo.content" class="quilleditor" ref="myQuillEditor" :option="editorOption" @ready="onEditorReady($event)"></quill-editor>
      </FormItem>
      <FormItem>
        <Button type="info" @click="handleSubmit()">发布</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
// 富文本编辑器 https://github.com/surmon-china/vue-quill-editor
import { quillEditor } from 'vue-quill-editor'

export default {
  data () {
    return {
      articleInfo: {
        title: '这里是文章标题',
        cate: '',
        content: '文章内容',
        user_id: this.$store.state.loginUserInfo.id
      },
      categoryList: {},
      editorOption: {

      },
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
  // get the current quill instace object.
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    }
  },
  mounted () {
    console.log(this.$store.state.loginUserInfo.id)
    this.getCatoryForSelect()
  },
  methods: {
    onEditorReady(editor) {
      // console.log('editor ready!', editor)
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
          this.$Message.error('获取失败,请重试!')
        }
      )
    },
    handleSubmit() {
      this.articleInfo._token = window.Laravel.csrfToken
      console.log(this.articleInfo)
      this.$http.post( '/saveWriter', this.articleInfo ).then(
        response => {
          this.$Message.success('添加成功!')
          this.$router.push({ path: '/homepage' })
        },
        response => {
          this.$Message.error('网络错误,请重试!')
        }
      )
    }
  }
}
</script>
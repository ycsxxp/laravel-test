<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  width: 100%;
  padding: 40px 80px 40px 80px;
  .title_input {
    width: 100%;
    margin-bottom: 30px;
  }
  .editor_container {
    margin-bottom: 80px;
    .quilleditor {
      height: 480px;
    }
  }
  .submit_btn {
  }
}
:global(.ivu-input .ivu-input-large) {
  border: none;
}
</style>
<template>
  <div class="content">
    <div class="title_input">
      <Input v-model="articleInfo.title" size="large"></Input>
    </div>
    <div class="editor_container">
      <quill-editor v-model="articleInfo.content" class="quilleditor" ref="myQuillEditor" :option="editorOption" @ready="onEditorReady($event)"></quill-editor>
    </div>
    <div class="submit_btn">
      <Button type="info" @click="handleSubmit()">发布</Button>
    </div>
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
        content: '文章内容',
      },
      editorOption: {

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
  methods: {
    onEditorReady(editor) {
      console.log('editor ready!', editor)
    },
    handleSubmit() {
      this.articleInfo._token = window.Laravel.csrfToken
      this.$http.post( '/saveWriter', this.articleInfo ).then(
        response => {
          this.$Message.success('添加成功!');
        },
        response => {
          this.$Message.error('提交失败,请重试!');
        }
      )
    }
  }
}
</script>
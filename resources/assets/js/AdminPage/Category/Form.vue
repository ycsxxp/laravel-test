<style rel="stylesheet/scss" lang="scss" scoped>
.addUserForm {
  width: 350px;
  padding: 20px 0 20px 0;
}
@for $i from 2 through 10 {
  .option-#{$i} { padding-left: 20px * $i ; }
}
</style>
<template>
  <div class="addUserForm">
    <Form ref="categoryInfo" :model="categoryInfo" :label-width="80" :rules="categoryValidate">
      <Form-item label="分类名" prop="title">
        <Input type="text" v-model="categoryInfo.title" placeholder="请输入分类名" />
      </Form-item>
      <Form-item label="父分类" prop="parent">
        <Select v-model="categoryInfo.parent" >
          <Option value="0">顶级分类</Option>
          <Option v-for="(item,index) in categoryList" :value="item.id" :key="index" :class="'option-'+item.c_level">{{ item.c_title }}
          </Option>
        </Select>
        <!-- <Input type="text" v-model="categoryInfo.address" placeholder="请输入" /> -->
      </Form-item>
      <Form-item label="顺序" prop="order">
        <Input v-model="categoryInfo.order" placeholder="请输入"></Input>
      </Form-item>
      <Form-item>
        <Button type="primary" @click="handleSubmit('categoryInfo')">提交</Button>
        <Button type="ghost" @click="handleReset('categoryInfo')" style="margin-left: 8px">重置</Button>
      </Form-item>
    </Form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      type: this.$route.params.type,
      apiurl: '',
      categoryInfo: {
        title: '',
        parent: '0',
        order: '',
      },
      categoryList: {},
      categoryValidate: {
        title: [
          { required: true, message: '分类名不能为空', trigger: 'blur' }
        ],
        order: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if(this.type == 'edit') {
      this.categoryInfo = this.$store.state.data.categoryFormData.row
    }
    this.getCatoryForSelect()
  },
  methods: {
    getCatoryForSelect () {
      let payload = {
        _token: window.Laravel.csrfToken
      }
      this.$http.post('/getCategory' , payload).then(
        response => {
          // 请求成功
          this.categoryList = response.data
          console.log(this.categoryList)
        },
        response => {
          // 请求失败
          this.$Message.error(this.$store.state.responseErrorMsg)
        }
      )
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.categoryInfo._token = window.Laravel.csrfToken
          if(this.type == 'add') {
            this.apiurl = '/addCategory'
          }else {
            this.apiurl = '/updateuser'
          }
          this.$http.post(this.apiurl, this.categoryInfo).then(
            response => {
              this.$Message.success('添加成功!');
              this.$router.push({ path: '/category' })
            },
            response => {
              this.$Message.error(this.$store.state.responseErrorMsg)
            }
          );
        } else {
          this.$Message.error('表单验证失败!');
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields();
    }
  }
}
</script>
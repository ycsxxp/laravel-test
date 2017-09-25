<style rel="stylesheet/scss" lang="scss">
.row-header {
  margin-bottom: 10px; 
}
.control-bar {
  text-align: right;
}
@for $i from 2 through 10 {
  .ivu-table .td-item-#{$i} { padding-left: 20px * ($i - 1) ; }
}
</style>
<template>
  <div class="container">
    <Row type="flex" justify="end" class="row-header">
      <Col span="8">
        <div class="control-bar">
          <Input v-model="value2" placeholder="请输入..." style="width: 150px"></Input>
          <Button type="primary" icon="ios-search" shape="circle"></Button>
          <Button type="primary" @click="add" >新增</Button>
        </div>
      </Col>
    </Row>
    <Row>
      <Table border stripe :columns="categoryColumns" :data="categoryList"></Table>
    </Row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value2: '',
      categoryColumns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'ID',
            width: 100,
            key: 'id'
          },
          {
            title: '类别名',
            key: 'c_title'
          },
          {
            title: '操作',
            key: 'action',
            render: (createElement, params) => {
              return createElement(
                'div',
                [
                  createElement(
                    'Button',
                    {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.editCategory(params)
                        }
                      }
                    },
                    '编辑'
                  ),
                  createElement('Poptip', 
                    {
                      props: {
                        confirm: true,
                        title: "确认删除这条内容吗?",
                      },
                      on: {
                        'on-ok': () => {
                          this.delete(params.row.id, params.row.c_title)
                        }
                      }
                    },
                    [
                      createElement('Button', {
                        props: {
                          type: 'error',
                          size: 'small'
                        }
                      }, '删除')
                    ]
                  )
                ]
              )
            }
          }
      ],
      categoryList: []
    }
  },
  mounted() {
    let payload = {
      _token: window.Laravel.csrfToken
    }
    this.$http.post('/getCategory', payload).then(
      response => {
        // 请求成功
        // 向返回的数组中 增加样式字段 cellClassName 用来展示
        this.categoryList = this.handleResultList(response.data)
      },
      response => {
        // 请求失败
        this.$Message.error(this.$store.state.responseErrorMsg)
      }
    )
  },
  methods: {
    handleResultList(data) {
      for (var i = data.length - 1; i >= 0; i--) {
        data[i]['cellClassName'] = { c_title: "td-item-" + data[i]['c_level'] } 
      }
      return data;
    },
    add () {
      this.$store.commit('addBreadCrumb', {'title': '添加分类'})
      this.$router.push({ path: '/category/add' })
    },
    delete (id, c_title) {
      let payload = {
        _token: window.Laravel.csrfToken,
        id: id,
        c_title: c_title
      }
      this.$http.post('/deleteCategory', payload).then(
        response => {
          if(response.data == "haschild") {
            this.$Notice.error({
              title: '删除失败',
              desc: '存在子分类，不能直接删除!',
              duration: 3
            });
          }else {
            this.categoryList = this.handleResultList(response.data)  
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
<style>
.row-header {
  margin-bottom: 10px; 
}
.control-bar {
  text-align: right;
}
.pagination {
  margin-top: 20px;
}
</style>
<template>
  <div class="container">
    <Row type="flex" justify="end" class="row-header">
      <Col span="8">
        <div class="control-bar">
          <Input v-model="value2" placeholder="请输入..." style="width: 150px"></Input>
          <Button type="primary" icon="ios-search" shape="circle"></Button>
        </div>
      </Col>
    </Row>
    <Row>
      <Table border stripe :columns="articleColumns" :data="articleList"></Table>
    </Row>
    <Row class="pagination">
      <Page :total="paginationInit.total" placement="top" size="small" show-elevator show-sizer :current="paginationInit.page" :page-size="paginationInit.size" :page-size-opts="paginationInit.sizeOpt" @on-change="changePage" @on-page-size-change="setPageSize"></Page>
    </Row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value2: '',
      paginationInit: {
        total: 1,
        page: 1,
        size: 10,
        sizeOpt: [10, 20, 50, 100]
      },
      articleColumns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '文章标题',
          key: 'title'
        },
        {
          title: '摘要',
          key: 'title'
        },
        {
          title: '发布人',
          key: 'username'
        },
        {
          title: '操作',
          key: 'action',
          render: (createElement, params) => {
            return createElement(
              'div',
              [
                // createElement(
                //   'Button',
                //   {
                //     props: {
                //       type: 'primary',
                //       size: 'small'
                //     },
                //     style: {
                //       marginRight: '5px'
                //     },
                //     on: {
                //       click: () => {
                //         this.editCategory(params)
                //       }
                //     }
                //   },
                //   '编辑'
                // ),
                createElement('Poptip', 
                  {
                    props: {
                      confirm: true,
                      title: "确认删除这条内容吗?",
                    },
                    on: {
                      'on-ok': () => {
                        this.delete(params)
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
      articleList: []
    }
  },
  mounted() {
    this.getArticle()
  },
  methods: {
    getArticle() {
      let payload = {
        size: this.paginationInit.size,
        page: this.paginationInit.page,
        _token: window.Laravel.csrfToken
      }
      this.$http.post('/getArticle', payload).then(
        response => {
          // 请求成功
          this.articleList = response.data.articles
          this.paginationInit.total = response.data.total
        },
        response => {
          // 请求失败
          this.$Message.error(this.$store.state.responseErrorMsg)
        }
      )
    },
    changePage (page) {
      let payload = {
        page: page,
        size: this.paginationInit.size
      }
      this.paginationInit.page = page
      this.getArticle()
    },
    setPageSize (size) {
      let payload = {
        page: this.paginationInit.page,
        size: size
      }
      this.paginationInit.size = size
      this.getArticle()
    },
    delete(params) {
      let payload = {
        _token: window.Laravel.csrfToken,
        id: params.row.id,
        user_id: params.row.user_id,
        size: 10,
        page: 1,
      }
      this.$http.post('/deleteArticle', payload).then(
        response => {
          // 请求成功
          let articles = response.data.articles
          // 处理得到的数据
          for (let i = 0; i < articles.length; i++) {
            let item = articles[i]
            for( let key in item) {
              if(key=='username') {
                item['username'] = item['username'].name
              }
            }
          }
          this.articleList = articles

          this.$Notice.success({
            title: '删除成功',
            duration: 3
          });
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
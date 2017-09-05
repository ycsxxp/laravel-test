<style rel="stylesheet/scss" lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  padding: 40px 80px 40px 80px;
}
.rowHeader {
  margin-bottom: 20px; 
}
.rowTable {
  margin-bottom: 30px; 
}
.control-bar {
  text-align: right;
}
</style>
<template>
  <div class="content">
    <Row type="flex" justify="end" class="rowHeader">
      <Col span="8">
        <div class="control-bar">
          <Input v-model="value2" placeholder="请输入..." style="width: 150px"></Input>
          <Button type="primary" icon="ios-search" shape="circle"></Button>
        </div>
      </Col>
    </Row>
    <Row class="rowTable">
      <Table border stripe :columns="articleColumns" :data="articleList"></Table>
    </Row>
    <Row>
      <div class="pagination">
        <Page :total="paginationInit.total" placement="top" size="small" show-elevator show-sizer :current="paginationInit.page" :page-size="paginationInit.size" :page-size-opts="paginationInit.sizeOpt" @on-change="changePage" @on-page-size-change="setPageSize"></Page>
      </div>
    </Row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      paginationInit: {
        total: 1,
        page: this.$store.state.pageConfig.currentPage,
        size: this.$store.state.pageConfig.pageSize,
        sizeOpt: [5, 10, 15, 20]
      },
      value2: '',
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
                  createElement(
                    'Button',
                    {
                      props: {
                        type: 'error',
                        size: 'small'
                      },
                      on: {
                        click: () => {
                          this.delete(params)
                        }
                      }
                    },
                    '删除'
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
    this.get()
  },
  methods: {
    get() {
      let payload = {
        size: 10,
        page: 1,
        // _token: window.Laravel.csrfToken
      }
      this.$http.post('/getArticleByUser', payload).then(
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
        },
        response => {
          // 请求失败
          this.$Message.error(this.$store.state.responseErrorMsg)
        }
      )
    },
    delete(params) {
      let payload = {
        // _token: window.Laravel.csrfToken,
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
<style>
.row-header {
  margin-bottom: 10px; 
}
.control-bar {
  text-align: right;
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
  </div>
</template>
<script>
export default {
  data () {
    return {
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
            key: 'action'
          }
      ],
      articleList: []
    }
  },
  mounted() {
    let payload = {
      size: 10,
      page: 1,
      _token: window.Laravel.csrfToken
    }
    this.$http.post('/getArticle', payload).then(
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
        this.$Message.error('获取失败,请重试!')
      }
    )
  },
}
</script>
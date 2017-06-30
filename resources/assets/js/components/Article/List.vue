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
            key: 'name'
          },
          {
            title: '摘要',
            key: 'summary'
          },
          {
            title: '发布人',
            key: 'user'
          },
          {
            title: '操作',
            key: 'action'
          }
      ],
      articleList: []
    }
  }
}
</script>
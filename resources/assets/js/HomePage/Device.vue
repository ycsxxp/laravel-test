<style rel="stylesheet/scss" lang="scss">
.content {
  width: 100%;
  height: 100%;
  padding: 30px 30px 30px 30px;
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

.ivu-table-small th {
  height: 50px;
}
.ivu-table-cell {
  padding-left: 3px;
  padding-right: 3px;
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
      <Table border stripe size="small" :columns="deviceColumns" :data="deviceList"></Table>
    </Row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      value2: '',
      deviceColumns: [
        {
          title: '序号',
          width: 50,
          key: 'id',
          align: 'center'
        },
        {
          title: '资产编号',
          // width: 150,
          key: 'asset_id',
          align: 'center'
        },
        {
          title: '设备编号',
          // width: 150,
          key: 'device_id',
          align: 'center'
        },
        {
          title: '设备型号',
          width: 130,
          key: 'device_model',
          align: 'center'
        },
        {
          title: '硬件型号',
          width: 150,
          key: 'hardware_model',
          align: 'center'
        },
        {
          title: '扩展槽',
          width: 80,
          key: 'expansion_slot',
          align: 'center'
        },
        {
          title: '资产归属',
          width: 80,
          key: 'asset_ownership',
          align: 'center'
        },
        {
          title: '使用者',
          width: 110,
          key: 'user',
          align: 'center'
        },
        {
          title: '设备状态',
          width: 80,
          key: 'device_status',
          align: 'center'
        },
        {
          title: '统一管理IP',
          width: 100,
          key: 'allot_ip',
          align: 'center'
        },
        {
          title: '备注',
          width: 80,
          key: 'remarks',
          align: 'center'
        }
      ],
      deviceList: []
    }
  },
  mounted() {
    this.get()
  },
  methods: {
    get() {
      let payload = {
        _token: window.Laravel.csrfToken
      }
      this.$http.get('/getDeviceList', payload).then(
        response => {
          // 请求成功
          this.deviceList = response.data
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
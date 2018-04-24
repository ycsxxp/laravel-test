<style>
.row-header {
  margin-bottom: 10px; 
}
.control-bar {
  text-align: right;
}
.ivu-checkbox-wrapper {
  margin-right: 0px;
}
.ivu-table-small th {
  height: 40px;
}
.ivu-table-small td {
  height: 50px;
}
.ivu-table-cell {
  padding-left: 3px;
  padding-right: 3px;
}
.ivu-btn-small {
  padding: 2px 5px;
}
</style>
<template>
	<div class="container">
    <Row type="flex" justify="end" class="row-header">
      <Col span="8">
        <div class="control-bar">
          <Input v-model="value2" placeholder="请输入..." style="width: 150px"></Input>
          <Button type="primary" icon="ios-search" shape="circle"></Button>
          <Button type="primary" @click="addDevice" >新增</Button>
        </div>
      </Col>
    </Row>
    <Row>
      <Table border stripe size="small" :columns="deviceColumns" :data="deviceList"></Table>
    </Row>
  </div>
</template>
<script>
	export default {
    data () {
      return {
        value2: "",
        userInfo: {
          username: '',
          userage: 1
        },
        deviceColumns: [
          {
            type: 'selection',
            width: 25,
            align: 'center'
          },
          {
            title: '资产编号',
            // width: 135,
            key: 'asset_id',
            align: 'center'
          },
          {
            title: '设备编号',
            // width: 145,
            key: 'device_id',
            align: 'center'
          },
          {
            title: '设备型号',
            // width: 90,
            key: 'device_model',
            align: 'center'
          },
          {
            title: '硬件型号',
            // width: 130,
            key: 'hardware_model',
            align: 'center'
          },
          {
            title: '扩展槽',
            width: 70,
            key: 'expansion_slot',
            align: 'center'
          },
          {
            title: '资产归属',
            width: 60,
            key: 'asset_ownership',
            align: 'center'
          },
          {
            title: '使用者',
            width: 60,
            key: 'user',
            align: 'center'
          },
          {
            title: '设备状态',
            width: 60,
            key: 'device_status',
            align: 'center'
          },
          {
            title: '统一管理IP',
            width: 90,
            key: 'allot_ip',
            align: 'center'
          },
          {
            title: '备注',
            width: 60,
            key: 'remarks',
            align: 'center'
          },
          {
            title: '操作',
            width: 89,
            key: 'action',
            align: 'center',
            render: (createElement, params) => {
              return createElement(
                'div',
                [
                  createElement('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '2px'
                    },
                    on: {
                      click: () => {
                        this.editUser(params)
                      }
                    }
                  }, '编辑'),
                  createElement('Poptip', 
                    {
                      props: {
                        confirm: true,
                        title: "确认删除这条内容吗?",
                        placement: 'top-end'
                      },
                      on: {
                        'on-ok': () => {
                          this.deleteDevice(params.row.id)
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
        deviceList: [
          {
            asset_id: '6000-S-0868',
            device_id: 'NIPS-600A01-1107A-019',
            device_model: 'SG600',
            hardware_model: 'NEXCOM 1000U 16G',
            expansion_slot: '4扩展槽',
            asset_ownership: '李欣',
            user: '李欣',
            device_status: '测试',
            allot_ip: '10.241.41.200',
            remarks: 'null'
          },{
            asset_id: '编号200002131200028',
            device_id: 'NIPS-600A01-1107A-019',
            device_model: 'EP2670单CPU16核',
            hardware_model: 'AEWIN CB-1617A 4G',
            expansion_slot: '4扩展槽',
            asset_ownership: '姚尚平',
            user: '姚尚平',
            device_status: '测试',
            allot_ip: '10.241.41.200',
            remarks: 'null'
          }
        ]
      }
    },
    methods: {
      addDevice () {
        this.$store.commit('addBreadCrumb', {'title': '添加设备'})
        this.$router.push({ path: '/device/add' })
      },
      editUser (params) {
        this.$store.commit('addBreadCrumb', {'title': '编辑设备列表'})
        this.$store.state.data.deviceFormData = params
        this.$router.push({ path: '/device/edit' })
      },
      getDevice () {
        this.$http.get('/getDeviceList', {_token: window.Laravel.csrfToken}).then(
          response => {
            this.deviceList = response.data
          },
          response => {
            this.$Message.error(this.$store.state.responseErrorMsg)
          }
        )
      },
      deleteDevice (id) {
        this.$http.post('/deleteDevice', {id: id, _token: window.Laravel.csrfToken}).then(
          response => {
            this.deviceList = response.data
          },
          response => {
            this.$Message.error(this.$store.state.responseErrorMsg)
          }
        )
      }
    },
    beforeMount () {
      this.getDevice()
    },
		mounted() {
    }
	}
</script>
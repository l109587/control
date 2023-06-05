import React from 'react'
import { Button, Select, Form, Input, Switch, message, Modal } from 'antd'
import ProTable from '@/components/Module/ProtableModule'
import {
  ModalForm,
  ProFormText,
  ProFormSwitch,
  ProFormSelect,
} from '@ant-design/pro-form'
import { modalFormLayout } from '@/utils/helper'
import { post } from '@/services/https'
import '@/utils/index.less'

let tableHeight = document.body.clientHeight - 295

const confirm = Modal.confirm

class Mirror extends React.Component {
  formRef = React.createRef()
  state = {
    keys: [],
    setIsModalVisible: false, //弹框
    showMirrorList: [],
    initialValues: {
      status: 0,
      note: '',
    },
    id: '',
    ifaceids: '',
    loading: true,
    incID:0
  }
  //初始化时自调用一次，用于请求借口数据
  componentDidMount() {
    this.showMirrorList()
  }
  showMirrorList() {
    post('/cfg.php?controller=netSetting&action=showMirrorList', {}).then(
      (res) => {
        if (res.success) {
          this.setState({ showMirrorList: res.data })
        }
      }
    )
  }
  //添加
  onAddgt = () => {
    this.setState({
      setIsModalVisible: true,
    })
  }
  //删除
  showConfirm = (record) => {
    let that = this
    confirm({
      title: '你确定要删除这个镜像吗？ ',
      content: '请注意，该操作不可逆',
      onOk() {
        that.handleDel(record)
      },
    })
  }
  handleDel = (record) => {
    let data = {
      id: record.id,
      iface: record.iface,
      ifidx: record.ifidx,
      alias: record.alias,
      busid :record.busid
    }
    post('/cfg.php?controller=confMirror&action=delMirror', data).then(
      (res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
          this.setState({
            incID:this.state.incID+1
          })
        } else {
          res.msg && message.error(res.msg)
        }
      }
    )
  }
  handleSaveBtn = () => {
    let that = this
    const values = that.formRef.current.getFieldsValue(true)
    if (this.state.id == '') {
      values.op = 'add'
    } else {
      values.op = 'mod'
      values.id = this.state.id
    }
    values.status = values.status ? Number(values.status) : 0
    this.state.showMirrorList.map((item) => {
      if (item.value == this.state.ifaceids) {
        values.iface = item.text
        values.busid = item.busid
      }
    })
    values.ifidx = this.state.ifaceids
    post('/cfg.php?controller=confMirror&action=setMirror', values)
      .then((res) => {
        if (res.success) {
          let that = this
          res.msg && message.success(res.msg)
          that.formRef.current.resetFields()
          that.setState({ setIsModalVisible: false, id: '' })
          that.setState({
            incID:this.state.incID+1
          })
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  SwitchBtn = (status, value) => {
    value.op = 'mod'
    value.status = status
    post('/cfg.php?controller=confMirror&action=setMirror', value).then(
      (res) => {
        if (res.success) {
          let that = this
          res.msg && message.success(res.msg)
        } else {
          res.msg && message.error(res.msg)
        }
      }
    )
  }
  onClickset = (id, item) => {
    let that = this
    that.setState({ setIsModalVisible: true })
    let initialValues = item
    initialValues.iface1 = initialValues.ifidx
    this.ifaceid(initialValues.ifidx)
    that.setState({ id: item.id })
    setTimeout(function () {
      that.formRef.current.setFieldsValue(initialValues)
    }, 500)
  }
  ifaceid = (value) => {
    this.setState({ ifaceids: value })
  }

  render() {
    const {
      setIsModalVisible,
      showMirrorList,
      ifaceids,
      incID
    } = this.state
    const options = []
    showMirrorList.forEach((item) => {
      options.push({ label: item.text, value: item.value })
    })
    const columns = [
      {
        title: '镜像名称',
        dataIndex: 'alias',
        key: '1',
        align: 'center',
        width: '30%',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: '2',
        align: 'center',
        width: 100,
        render: (text, record) => {
          if (text == 0) {
            return (
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                onClick={() => this.SwitchBtn(1, record)}
              />
            )
          } else {
            return (
              <Switch
                checkedChildren="开启"
                unCheckedChildren="关闭"
                defaultChecked
                onClick={() => this.SwitchBtn(0, record)}
              />
            )
          }
        },
      },
      {
        title: '接口名称',
        dataIndex: 'iface',
        key: '3',
        align: 'center',
        width: 100,
      },
      {
        title: '接口ID',
        dataIndex: 'ifidx',
        key: '4',
        align: 'center',
        width: 100,
      },
      {
        title: '备注',
        dataIndex: 'note',
        key: '5',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'id',
        align: 'center',
        key: '9',
        width: 180,
        render: (text, record) => {
          return (
            <div>
              <Button type="link" onClick={() => this.onClickset(1, record)}>
                修改
              </Button>
              <Button
                type="link"
                style={{ color: 'red' }}
                onClick={() => this.showConfirm(record)}
              >
                删除
              </Button>
            </div>
          )
        },
      },
    ]

    return (
      <div>
        <ProTable
          columns={columns}
          apishowurl="/cfg.php?controller=confMirror&action=showMirror"
          clientHeight={tableHeight}
          tableKey="mirror"
          setcolumnKey="pro-table-singe-demos-mirror"
          columnvalue="mirrorColumnvalue "
          addButton={true}
          addClick={this.onAddgt}
          incID={incID}
        />
        {/* 弹框 */}
        <ModalForm
          {...modalFormLayout}
          formRef={this.formRef}
          title="镜像配置"
          visible={setIsModalVisible}
          modalProps={{
            maskClosable: false,
            destroyOnClose: true,
            onCancel: () =>
              this.setState({
                setIsModalVisible: false,
                id: '',
                ifaceids: '',
              }),
            okText: '设置',
          }}
          onFinish={this.handleSaveBtn}
        >
          <ProFormSwitch
            label="状态"
            name="status"
            fieldProps={{ checkedChildren: '开启', unCheckedChildren: '关闭' }}
          />
          <ProFormText
            label="镜像名称"
            name="alias"
            rules={[
              {
                required: true,
              },
            ]}
          />
          <ProFormSelect
            label="接口名称"
            name="iface"
            options={options}
            fieldProps={{
              disabled: this.state.id != '',
              onChange: this.ifaceid,
            }}
          />
          <ProFormText label="接口ID">
            <div>{ifaceids}</div>
          </ProFormText>
          <ProFormText label="备注" name="note" />
        </ModalForm>
      </div>
    )
  }
}

export default Mirror

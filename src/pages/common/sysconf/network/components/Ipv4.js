import React from 'react'
import {
  Row,
  Col,
  Form,
  Button,
  Table,
  Modal,
  Input,
  message,
  Tooltip,
} from 'antd'
import { formItemLayoutTan } from '@/utils/helper'
import styles from './index.less'
import '@/utils/index.less'
import { regIpList, regMacList } from '@/utils/regExp'
import { post } from '@/services/https'
import Pagination from '@/utils/Pagination'
import { InfoCircleOutlined } from '@ant-design/icons'
class Ipv4 extends React.Component {
  formRef = React.createRef()
  state = {
    title: '添加',
    total: 0, //总页数
    current: 1,
    pageSize: 10,
    isModalVisible: false,
    dataSource: [],
    initialValues: {},
    selectedRowKeys: [],
    selectedRows: {},
    selectId: [],
    idL: '',
  }
  columns = [
    {
      title: '目的地址/掩码',
      dataIndex: 'destip',
      key: 'destip',
    },
    {
      title: '下一跳IP地址',
      dataIndex: 'nextip',
      key: 'nextip',
    },
    {
      title: '下一跳MAC地址',
      dataIndex: 'nextmac',
      key: 'nextmac',
    },
    {
      title: '标记',
      dataIndex: 'flag',
      key: 'flag',
    },
    {
      title: '操作',
      dataIndex: 'id',
      key: 'id',
      render: (text, record) => {
        return (
          <Button type="link" onClick={() => this.Qiyong(2, record)}>
            修改
          </Button>
        )
      },
    },
  ]
  componentDidMount() {
    this.onChangeCurPageOrPageSize(1, 10)
  }
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }
  getData = () => {
    post('/admin/cfg.php?controller=network&action=showRoute').then((res) => {
      this.setState({ dataSource: res.data })
    })
  }
  onChangeCurPageOrPageSize = (current, pageSize) => {
    this.setState(
      () => ({ current, pageSize }),
      () => {
        this.getData()
      }
    )
  }
  Qiyong = (i, record) => {
    let that = this
    if (i == 1) {
      that.setState({ isModalVisible: true })
    } else {
      that.setState({ isModalVisible: true, id: record.id })
      let initialValues = record
      setTimeout(function () {
        that.formRef.current.setFieldsValue(initialValues)
      }, 500)
    }
  }
  handleOk = () => {
    this.formRef.current.resetFields()
    this.setState({ isModalVisible: false })
  }
  handleSaveBtn = (values) => {
    // values.id = this.state.selectedRows.id
    if (this.state.id == '') {
      post('/admin/cfg.php?controller=network&action=addRoute', values).then(
        (res) => {
          if (res.success) {
            message.success('新增成功')
            this.setState({ isModalVisible: false })
            this.getData()
          } else {
            message.error(res.msg)
          }
        }
      )
    } else {
      values.id = this.state.id
      post('/admin/cfg.php?controller=network&action=addRoute', values).then(
        (res) => {
          if (res.success) {
            message.success('新增成功')
            this.setState({ isModalVisible: false })
            this.getData()
          } else {
            message.error('新增失败')
          }
        }
      )
      return
    }
  }
  selectRow = (record) => {
    let selectedRowKeys = [record.id]
    this.setState({ selectedRowKeys: selectedRowKeys, selectedRows: record })
  }
  onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    let record = selectedRows[0]
    this.setState({
      selectedRowKeys,
      selectId: selectedRows,
      selectedRows: record,
    })
  }
  render() {
    const {
      isModalVisible,
      dataSource,
      initialValues,
      selectedRowKeys,
      title,
    } = this.state
    const rowSelection = {
      type: 'radio',
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    }
    const formProps = {
      name: 'basic',
      onFinish: this.handleSaveBtn,
      initialValues,
      ref: this.formRef,
    }
    return (
      <div>
        <Row className="Row_c">
          <Col span={12} className="Col_end"></Col>
          <Col span={12} className="Col_flex_end">
            <Button type="primary" onClick={() => this.Qiyong(1)}>
              新建
            </Button>
            <Button
              onClick={() => this.Qiyong(2)}
              style={{ marginLeft: '15px' }}
            >
              删除
            </Button>
          </Col>
        </Row>
        <Row className="Table_Pa">
          <Table
            size="small"
            rowKey="id"
            rowSelection={rowSelection}
            style={{ width: '100%' }}
            bordered
            dataSource={dataSource}
            columns={this.columns}
            pagination={false}
            onRow={(record) => {
              return {
                onClick: (e) => {
                  this.selectRow(record)
                },
              }
            }}
          />
          <Pagination
            current={this.state.current}
            pageSize={this.state.pageSize}
            total={this.state.total}
            handleChange={this.onChangeCurPageOrPageSize} //当前页及条数改变都会从子组件触发此方法，用于传递页码和条数
            pageSizeOptions={['10', '20', '30', '40', '50', '100']} // 针对不同的组件需求传递每次多少条，不传已在分页组件写默认值了
          ></Pagination>
        </Row>
        <Modal
          title={title}
          visible={isModalVisible}
          onCancel={this.handleOk}
          footer={null}
        >
          <Form {...formItemLayoutTan} {...formProps}>
            <Form.Item
              label="目的地址"
              name="destip"
              rules={[
                {
                  required: true,
                },
                {
                  pattern: regIpList.ipv4.regex,
                  message: '输入正确的IP地址',
                },
              ]}
            >
              <Input
                className="Ip_70"
                suffix={
                  <Tooltip title="例如 10.1.1.1/24">
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
              />
            </Form.Item>
            <Form.Item
              label="下一跳IP地址"
              name="nextip"
              rules={[
                {
                  pattern: regIpList.ip.regex,
                  message: '输入正确的IP地址',
                },
                {
                  required: true,
                  message: '输入正确的IP地址!',
                },
              ]}
            >
              <Input
                className="Ip_70"
                suffix={
                  <Tooltip title="例如 10.1.1.1">
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
              />
            </Form.Item>
            <Form.Item
              label="下一跳MAC地址"
              name="nextmac"
              rules={[
                {
                  required: true,
                },
                {
                  pattern: regMacList.mac.regex,
                  message: '输入正确的mac',
                },
              ]}
            >
              <Input
                className="Ip_70"
                suffix={
                  <Tooltip title="例如 00:32:12:67:89:10">
                    <InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
                  </Tooltip>
                }
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                style={{ marginLeft: '41%' }}
                className={styles.Po_Le}
                htmlType="submit"
              >
                设置
              </Button>
              <Button onClick={this.handleOk}>取消</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default Ipv4

import React from 'react'
import { Row, Table, Card, Tree } from 'antd'
import { post } from '@/services/https'
import '@/utils/index.less'
let H = document.body.clientHeight - 345
var clientHeight = H / 2.5
class Systemaudit extends React.Component {
  formRef = React.createRef()
  state = {
    keys: [],
    dataSource: [],
    data: [],
    loading: false,
    checkedKeys: ['1', '2', '3', '4', '5', '6', '7', '8'],
  }
  //初始化时自调用一次，用于请求借口数据
  componentDidMount() {
    this.getUser('hour')
  }
  getUser(interval) {
    let data = {
      start: 0,
      pageSize: 1000,
      interval: interval,
    }
    post('/cfg.php?controller=sysAnalysis&action=showAppsTable', data).then(
      (res) => {
        if (res.success) {
          this.setState({
            dataSource: res.data,
            loading: false,
          })
        } else {
          this.setState({
            dataSource: res.data,
            loading: false,
          })
        }
      }
    )
  }
  onCheck = (checkedKeys, info) => {
    //列表控制
    this.setState({ checkedKeys })
  }
  //搜索
  handsearch = (values) => {
    this.setState({ user_name: values })
    this.getUser()
  }
  render() {
    const { dataSource, loading, checkedKeys } = this.state
    const columns = [
      {
        title: '应用名',
        dataIndex: 'appcn',
        key: '1',
        align: 'center',
      },
      {
        title: '连接数',
        dataIndex: 'conn',
        key: '2',
        align: 'center',
      },
      {
        title: '上行流量',
        dataIndex: 'sendbyte',
        key: '3',
        align: 'center',
      },
      {
        title: '上行数据包数',
        dataIndex: 'sendpkts',
        key: '4',
        align: 'center',
      },
      {
        title: '下限流量',
        dataIndex: 'recvbyte',
        key: '5',
        align: 'center',
      },
      {
        title: '下限数据包数',
        dataIndex: 'recvpkts',
        key: '6',
        align: 'center',
      },
      {
        title: '总流量',
        dataIndex: 'totbyte',
        key: '7',
        align: 'center',
      },
      {
        title: '总数据包数',
        dataIndex: 'totpkts',
        key: '8',
        align: 'center',
      },
    ]
    let new_title_list = []
    checkedKeys.map((item) => {
      columns.map((item1) => {
        if (item1.key == item) {
          new_title_list.push(item1)
        }
      })
    })
    return (
      <div>
        <Card title="">
          <Row className="Table_Pa">
            <Table
              scroll={{ y: clientHeight }}
              loading={loading}
              size="small"
              rowKey="id"
              style={{ width: '100%' }}
              bordered
              dataSource={dataSource}
              columns={new_title_list}
              pagination={false}
            />
          </Row>
        </Card>
      </div>
    )
  }
}

export default Systemaudit

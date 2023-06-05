// 网络配置
import React from 'react'
import { Card, Tabs } from 'antd'
import './index.less'
import { Dns, Ipv4, Ipv6, Nicset } from './components'
import { language } from '@/utils/language'
import { ProCard } from '@ant-design/pro-components'
const { TabPane } = Tabs
class NetworkConfiguration extends React.Component {
  state = {}
  render() {
    return (
      <div className="networkCard">
        <Tabs defaultActiveKey="1" type="card" size="Large">
          <TabPane tab={language('project.sysconf.network.networkset')} key="1">
            <Nicset />
          </TabPane>
          <TabPane tab={language('sysconf.netconf.dnsconf')}>
            <Dns />
          </TabPane>
          {/* <TabPane tab="IPv4路由表" key="2">
              <Ipv4 />
            </TabPane>
            <TabPane tab="IPv6路由表" key="3">
              <Ipv6 />
            </TabPane>
         */}
        </Tabs>
      </div>
    )
  }
}
export default NetworkConfiguration

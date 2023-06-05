import React from 'react'
import PropTypes from 'prop-types'
import { connect, Link } from 'umi'
import { withI18n } from '@lingui/react'
import { language } from '@/utils/language';
import { Card, Tabs } from 'antd'
import styles from './index.less'
import {
  IP,
  Domain,
  Url,
  Account
} from './components'
const { TabPane } = Tabs;
const Thetarget = () => {
  return (
    <div>
      <Tabs defaultActiveKey="1" type="card" size="Large">
        <TabPane tab={language('alarmdt.targetip')} key="1">
          <IP />
        </TabPane>
        <TabPane tab={language('alarmdt.targetadt.Domain')} key="2">
          <Domain />
        </TabPane>
        <TabPane tab={language('alarmdt.targetadt.Url')} key="3">
          <Url />
        </TabPane>
        <TabPane tab={language('alarmdt.targetadt.Account')} key="4">
          <Account />
        </TabPane>
      </Tabs>
    </div>
  )
}
export default Thetarget

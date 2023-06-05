import React from 'react'
import PropTypes from 'prop-types'
import { connect, Link } from 'umi'
import { withI18n } from '@lingui/react'
import { Card, Tabs } from 'antd'
import { language } from '@/utils/language';
import styles from './index.less'
import {
  Suspicious,
  Remote,
  Abnormal,
  General
} from './components'
const { TabPane } = Tabs;
const Unknown = () => {
  return (
    <div>
      <Tabs defaultActiveKey="1" type="card" size="Large">
        <TabPane tab={language('alarmdt.unknown.Suspicious')} key="1">
          <Suspicious />
        </TabPane>
        <TabPane tab={language('alarmdt.unknown.Remote')} key="2">
          <Remote />
        </TabPane>
        <TabPane tab={language('alarmdt.unknown.Abnormal')} key="3">
          <Abnormal />
        </TabPane>
        <TabPane tab={language('alarmdt.unknown.General')} key="4">
          <General />
        </TabPane>
      </Tabs>
    </div>
  )
}
export default Unknown

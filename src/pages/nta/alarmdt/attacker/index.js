import React from 'react'
import PropTypes from 'prop-types'
import { connect, Link } from 'umi'
import { withI18n } from '@lingui/react'
import { Card, Tabs } from 'antd'
import '@/utils/index.less';
import { language } from '@/utils/language';
import styles from './index.less'
import {
  Trojan,
  Vulnerability,
  Malicious,
} from './components'
const { TabPane } = Tabs;

const Attacks = () => {
  return (
    <div>
      <Tabs defaultActiveKey="1" type="card" size="Large">
        <TabPane tab={language('alarmdt.attacker.Trojan')} key="1">
          <Trojan />
        </TabPane>
        <TabPane tab={language('alarmdt.attacker.Vulnerability')} key="2">
          <Vulnerability />
        </TabPane>
        <TabPane tab={language('alarmdt.attacker.Malicious')} key="3">
          <Malicious />
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Attacks

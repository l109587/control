import React, { useRef, useState, useEffect } from 'react'
import { SwtichScan, DiscoverConfig } from './components'
import styles from './index.less'
import { Tabs } from 'antd'
import { language } from '@/utils/language'
const { TabPane } = Tabs

export default function () {
  return (
    <Tabs defaultActiveKey="1" className={styles.tab} type="card">
      <TabPane tab={language('monitor.devtmpl.SwtichScan')} key="1">
        <SwtichScan />
      </TabPane>
      <TabPane tab={language('monitor.devtmpl.DiscoverConfig')} key="2">
        <DiscoverConfig />
      </TabPane>
    </Tabs>
  )
}

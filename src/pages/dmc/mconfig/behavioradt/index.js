import React, { useRef, useState, useEffect } from 'react';
import { Card, Tabs } from 'antd'
import '@/utils/index.less';
import { language } from '@/utils/language';
import { Behareport, Behavrule } from './components'
import './behavioradt.less'
const { TabPane } = Tabs;

export default () => {
  return (<>
    <Tabs type="card" size="Large">
      <TabPane tab={language('dmcoconfig.behavioradt.behareport')} key='1'>
        <Behareport />
      </TabPane>
      <TabPane tab={language('dmcoconfig.behavioradt.behavrule')} key='2'>
        <Behavrule />
      </TabPane>
    </Tabs>
  </>)
}
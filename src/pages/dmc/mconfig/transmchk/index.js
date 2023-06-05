import React, { useRef, useState, useEffect } from 'react';
import { Card, Tabs } from 'antd'
import '@/utils/index.less';
import { language } from '@/utils/language';
import { Keyword, Encryption, Compress, Picture } from './components'
import './transmchk.less'
const { TabPane } = Tabs;

export default () => {
  return (<>
    <Tabs type="card" size="Large">
      <TabPane tab={language('dmcoconfig.transmchk.keyword')} key='1'>
        <Keyword />
      </TabPane>
      <TabPane tab={language('dmcoconfig.transmchk.encryption')} key='2'>
        <Encryption />
      </TabPane>
      <TabPane tab={language('dmcoconfig.transmchk.compress')} key='3'>
        <Compress />
      </TabPane>
      <TabPane tab={language('dmcoconfig.transmchk.picture')} key='4'>
        <Picture />
      </TabPane>
    </Tabs>
  </>)
}
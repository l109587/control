import React, { useRef, useState, useEffect } from 'react';
import { Card, Tabs } from 'antd'
import '@/utils/index.less';
import { ProCard, ProForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { language } from '@/utils/language';
import './attachchk.less'
import { Troation, Vunabiltion, Malapgtion, Unknacktion } from './components'
const { TabPane } = Tabs;

export default () => {

  return (<>
    <Tabs defaultActiveKey="1" type="card" size="Large">
      <TabPane tab={language('dmcoconfig.attachck.troation')} key='1'>
        <Troation />
      </TabPane>
      <TabPane tab={language('dmcoconfig.attachck.vunabiltion')} key='2'>
        <Vunabiltion />
      </TabPane>
      <TabPane tab={language('dmcoconfig.attachck.malapgtion')} key='3'>
        <Malapgtion />
      </TabPane>
      <TabPane tab={language('dmcoconfig.attachck.unknacktion')} key='4'>
        <Unknacktion />
      </TabPane>
    </Tabs>
  </>)
}
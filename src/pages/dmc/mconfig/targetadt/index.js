import React, { useRef, useState, useEffect } from 'react';
import { Card, Tabs } from 'antd'
import '@/utils/index.less';
import { ProCard, ProForm, ProFormText, ProTable } from '@ant-design/pro-components';
import { language } from '@/utils/language';
import './targetadt.less'
import { Ipaudit, Domainame, Url, Account } from './components'
const { TabPane } = Tabs;

export default () => {

  return (<>
    <Tabs type="card" size="Large">
      <TabPane tab={language('dmcoconfig.targetadt.ipaudit')} key='1'>
        <Ipaudit />
      </TabPane>
      <TabPane tab={language('dmcoconfig.targetadt.domainame')} key='2'>
        <Domainame />
      </TabPane>
      <TabPane tab={language('dmcoconfig.targetadt.url')} key='3'>
        <Url />
      </TabPane>
      <TabPane tab={language('dmcoconfig.targetadt.account')} key='4'>
        <Account />
      </TabPane>
    </Tabs>
  </>)
}
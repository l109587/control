import React from 'react'
import { Card, Tabs } from 'antd'
import './index.less'
import { language } from '@/utils/language';
import { Off, Keyword, Encryption, Multilayer, Plate } from './components'
const { TabPane } = Tabs;

const Classified = () => {

  return (
    <div className='classifiled'>
      <Tabs defaultActiveKey="1" type="card" >
        <TabPane tab={language('alarmdt.transfer.Off')} key="1">
          <Off />
        </TabPane>
        <TabPane tab={language('alarmdt.transfer.Keyword')} key="2">
          <Keyword />
        </TabPane>
        <TabPane tab={language('alarmdt.transfer.Encryption')} key="3">
          <Encryption />
        </TabPane>
        <TabPane tab={language('alarmdt.transfer.Multilayer')} key="4">
          <Multilayer />
        </TabPane>
        <TabPane tab={language('alarmdt.transfer.Plate')} key="5">
          <Plate />
        </TabPane>
      </Tabs>
    </div>
  )
}
export default Classified

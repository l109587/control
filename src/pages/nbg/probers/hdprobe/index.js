import React, { useState, useEffect} from "react";
import { Tabs } from 'antd';
import { language } from '@/utils/language';
import { Hdprobeconfig, Hdprobelist } from './components'
import './hdprobe.less'
const { TabPane } = Tabs;

export default () => {
  return (<div className="hdprobeContain">
      <Tabs type="card" >
        <TabPane tab={language('probers.hdprobe.hdprobeconfig')} key='1'>
          <Hdprobeconfig />
        </TabPane >
        <TabPane tab={language('probers.hdprobe.hdprobelist')} key='2'>
          <Hdprobelist />
        </TabPane>
      </Tabs>
  </div>)
}

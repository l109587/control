import React, { useEffect, useState } from 'react';
import ProCard from '@ant-design/pro-card';
import { Tabs } from 'antd';
import { language } from '@/utils/language';
import { Networkapply, Changeapply, Cancellapply } from './components';
import { post, get } from '@/services/https';
import './index.less';
const { TabPane } = Tabs;
let H = document.body.clientHeight - 143
var clientHeight = H

export default () => {

  return (
    <div className="apllocationcard card-apcontainer" >
      <Tabs type="card">
        <TabPane tab={language('project.assmngt.applyrcd.entry')} key="1">
          <Networkapply />
        </TabPane>
        <TabPane tab={language('project.assmngt.applyrcd.change')} key="2">
          <Changeapply />
        </TabPane>
        <TabPane tab={language('project.assmngt.applyrcd.retreatnetwork')} key="3">
          <Cancellapply />
        </TabPane>
      </Tabs>
    </div>
  );
}
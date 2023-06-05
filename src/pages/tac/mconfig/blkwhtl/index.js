import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { language } from '@/utils/language';
import './index.less';
import { WhtList, BlkList, MacBlkList, MacWhtList, ServerWhtList  } from './components';
const { TabPane } = Tabs;
let H = document.body.clientHeight - 143
var clientHeight = H
export default () => {
  return (
    <>
      <div className="blkwhtlcard card-container" >
        <Tabs type="card">
          <TabPane tab={language('project.mconfig.blkwhtl.ipwht')} key="1">
            <WhtList />
          </TabPane>
          <TabPane tab={language('project.mconfig.blkwhtl.ipblk')} key="2">
            <BlkList />
          </TabPane>
          <TabPane tab={language('project.mconfig.blkwhtl.macwht')} key="3">
            <MacWhtList />
          </TabPane>
          <TabPane tab={language('project.mconfig.blkwhtl.macblk')} key="4">
            <MacBlkList />
          </TabPane>
          <TabPane tab={language('project.mconfig.blkwhtl.serverwht')} key="5">
            <ServerWhtList />
          </TabPane>
        </Tabs>
      </div>
    </>

  );
}
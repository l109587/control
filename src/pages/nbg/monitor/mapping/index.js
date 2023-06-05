import React, { useRef,useState ,useEffect } from 'react';
import { Button, Input, Alert, message, Tabs } from 'antd';
import { AssetIdentification, AssetType } from './components';
import { language } from '@/utils/language';
const { TabPane } = Tabs;
export default () => {
    return (
        <div className="card-container" >
        <Tabs type="card">
          <TabPane tab={language('project.sysconf.analysis.assetsdistinguish')} key="1">
            <AssetIdentification />
          </TabPane>
          <TabPane tab={language('project.sysconf.analysis.cardtitle')} key="2" >
          <AssetType />
          </TabPane>
        </Tabs>
      </div>
        
      );
}
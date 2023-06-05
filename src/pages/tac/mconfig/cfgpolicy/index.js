import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { language } from '@/utils/language';
import './cfgpolicy.less';
import { AuthConfig, RoleAuth } from './components';
const { TabPane } = Tabs;
export default () => {
  const [incTID, setIncTID] = useState(1);
  return (
    <>
      <div className="nacpilicycard card-container" >
        <Tabs type="card"
          destroyInactiveTabPane={true}
          onTabClick={(key) => {
            setIncTID(incTID + 1);
          }}
        >
          <TabPane tab={language('mconfig.cfgpolicy.accessrightsconfiguration')} key="1">
            <AuthConfig incTID={incTID} />
          </TabPane>
          <TabPane tab={language('mconfig.cfgpolicy.roleconfiguration')} key="2">
            <RoleAuth incTID={incTID} />
          </TabPane>
        </Tabs>
      </div>
    </>

  );
}
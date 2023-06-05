import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { language } from '@/utils/language';
import './agtpolicy.less';
import { Authentication, Security } from './components';
const { TabPane } = Tabs;
export default () => {
  const [incTID, setIncTID] = useState(1);
  return (
    <>
      <div className="agtpilicycard card-container" >
        <Tabs type="card"
          destroyInactiveTabPane={true}
          onTabClick={(key) => {
            setIncTID(incTID + 1);
          }}
        >
          <TabPane tab={language('mconfig.agtpolicy.accessauthenticationpolicy')} key="1">
            <Authentication incTID={incTID} />
          </TabPane>
        </Tabs>
      </div>
    </>

  );
}
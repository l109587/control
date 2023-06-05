import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { language } from '@/utils/language';
import './nacpolicy.less';
import { AccTerminal, RegReview, AccessControl } from './components';
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
          <TabPane tab={language('mconfig.nacpolicy.registerauditpolicy')} key="1">
            <RegReview incTID={incTID} />
          </TabPane>
          <TabPane tab={language('mconfig.nacpolicy.terminalaccessstrategy')} key="2">
            <AccTerminal incTID={incTID} />
          </TabPane>
          <TabPane tab={language('mconfig.nacpolicy.accesscontrolpolicy')} key="3">
            <AccessControl incTID={incTID} />
          </TabPane>
        </Tabs>
      </div>
    </>

  );
}
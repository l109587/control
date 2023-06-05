import React, { useRef,useState ,useEffect } from 'react';
import { Button, Input, Alert, message, Tabs } from 'antd';
import { Probetion, Probelist } from './components';
import './index.less';
import { language } from '@/utils/language';
const { TabPane } = Tabs;
let H = document.body.clientHeight - 143
var clientHeight = H

export default () => {
    return (
        <div className="temincontain" >
			<Tabs type="card">
				<TabPane tab={language('project.temporary.terminal.probetion')} key="1">
					<Probetion />
				</TabPane>
				<TabPane tab={language('project.temporary.terminal.probelist')} key="2">
					<Probelist />
				</TabPane>
			</Tabs>
      	</div>
      );
}
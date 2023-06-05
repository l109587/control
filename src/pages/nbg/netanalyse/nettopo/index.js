import React, { useRef, useState, useEffect } from 'react'
import { Tabs } from 'antd'
import { Charts, TopoTable } from './components'
import '@/utils/index.less'
import './index.less'
import { language } from '@/utils/language'
const { TabPane } = Tabs

export default () => {
  const [checkedTabKey, setCheckedTabKey] = useState(1)

  const onChange = (key) => {
    setCheckedTabKey(key)
  }
  return (
    <div className="topocontain">
      <Tabs type="card" onChange={onChange} >
        <TabPane tab={language('netanalyse.nettopo.Charts')} key="1">
          <Charts checkedTabKey={checkedTabKey} />
        </TabPane>
        <TabPane tab={language('netanalyse.nettopo.TopoTable')} key="2">
          <TopoTable />
        </TabPane>
      </Tabs>
    </div>
  )
}

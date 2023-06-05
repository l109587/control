import React, { useEffect, useState, useRef } from 'react'
import { Input, Button } from 'antd'
import { Topo, TopoList } from '@/components'
import { useSelector } from 'umi'

const Charts = (props) => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 72
  let getTopoPosUrl = '/cfg.php?controller=assetMapping&action=getTopoPos' //topo布局
  let saveTopoUrl = '/cfg.php?controller=assetMapping&action=saveTopoPos' //保存位置
  let scanTopoUrl = '/cfg.php?controller=assetMapping&action=scanTopology' //计算topo
  let topoShowUrl = '/cfg.php?controller=assetMapping&action=showTopology'
  let topoModalShowUrl = '/cfg.php?controller=assetMapping&action=showSwitchDetail'
  return (
    <Topo
      getTopoPosUrl={getTopoPosUrl}
      saveTopoUrl={saveTopoUrl}
      scanTopoUrl={scanTopoUrl}
      topoShowUrl={topoShowUrl}
      topoModalShowUrl={topoModalShowUrl}
      height={clientHeight}
      checkedTabKey={props.checkedTabKey}
    />
  )
}

export default Charts

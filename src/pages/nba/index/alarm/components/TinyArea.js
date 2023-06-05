import React, { useEffect, useRef, useState } from 'react'
import { Row, Col } from 'antd'
import { post } from '@/services/https'
import { language } from '@/utils/language'
import CateCard from '@/components/Index/CateCard/CateCard'
import { ProCard } from '@ant-design/pro-components'

const TinyArea = () => {
  const [cpuData, setCpuData] = useState([])
  const [cpuLine, setCpuLine] = useState([])
  const [memData, setMemData] = useState([])
  const [memLine, setMemLine] = useState([])
  let statusTimer

  useEffect(() => {
    getCpuData()
    getMemData()
    getStatusData()
    return () => {
      clearInterval(statusTimer)
    }
  }, [])

  const getStatusData = () => {
    statusTimer = setInterval(() => {
      getCpuData()
      getMemData()
    }, 3000)
  }

  /* CPU数据 */
  const getCpuData = () => {
    post('/cfg.php?controller=sysHeader&action=showSysChart', {
      chartype: 'cpu',
    }).then((res) => {
      let list = []
      res.lines.map((item, index) => {
        list.push(item.value)
      })
      setCpuData(res)
      setCpuLine(list)
    })
  }

  /* 内存数据 */
  const getMemData = () => {
    post('/cfg.php?controller=sysHeader&action=showSysChart', {
      chartype: 'mem',
    }).then((res) => {
      let list = []
      res.lines.map((item, index) => {
        list.push(item.value)
      })
      setMemLine(list)
      setMemData(res)
    })
  }

  return (
    <ProCard ghost gutter={[16, 16]}>
      <ProCard ghost>
        <CateCard
          title={cpuData?.title}
          usagecpu={cpuData?.usage}
          lines={cpuLine}
        />
      </ProCard>
      <ProCard ghost>
        <CateCard
          title={memData?.title}
          usagecpu={memData?.usage}
          lines={memLine}
        />
      </ProCard>
    </ProCard>
  )
}

export default TinyArea

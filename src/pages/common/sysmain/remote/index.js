import { useState, useEffect, useReducer, useRef } from 'react'
import Remote from './sshd'
import Wireshark from './pcap'
import Debugexp from './debug'
import Trol from './console'
import { post, get } from '@/services/https'
import { language } from '@/utils/language';
import { Tabs } from 'antd'
import styles from './index.less'

const { TabPane } = Tabs

export default function Debug() {
  const [isShowAgtlog, setIsShowAgtlog] = useState(true) // 是否展示导出调试中终端日志
  const [key, setkKey] = useState('0')
  const [tabParams, setTabParams] = useState([])
  const stateRef = useRef()

  const titleMap = {
    console: language( 'project.sysdebug.title.console' ),
    export: language('project.sysdebug.title.export' ),
    remote: language('project.sysdebug.title.remote' ),
    ntpcap: language('project.sysdebug.title.wireshark'),
  }
  const contentMap = {
    console: <Trol />,
    export: <Debugexp isShowAgtlog={stateRef} />,
    remote: <Remote />,
    ntpcap: <Wireshark />,
  }

  useEffect(() => {
    stateRef.current = isShowAgtlog
    return () => {}
  }, [isShowAgtlog])

  useEffect(() => {
    getPageContent()
  }, [])

  const onChange = (key) => {
    setkKey(key)
  }

  const getPageContent = () => {
    post('/cfg.php?controller=mtaDebug&action=getPageContent')
      .then((res) => {
        if (res.success) {
          const agtLog = res.data.filter((item) => {
            return item.name === 'export'
          })
          const isShowAgtlog = agtLog[0].child[0].show === 'Y' ? true : false
          setIsShowAgtlog(isShowAgtlog)

          const newData = res.data.filter((item) => {
            return item.show === 'Y'
          })
          console.log(newData)
          newData.forEach((item) => {
            item.contents = contentMap[item.name]
          })
          newData.forEach((item) => {
            item.name = titleMap[item.name]
          })
          setTabParams(newData)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <>
      <Tabs
        onChange={onChange}
        type="card"
        activeKey={key}
        className={styles.tab}
        destroyInactiveTabPane={true}
      >
        {tabParams.map((item, index) => (
          <TabPane tab={item.name} key={index}>
            {item.contents}
          </TabPane>
        ))}
      </Tabs>
    </>
  )
}

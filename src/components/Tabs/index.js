import { Tabs } from 'antd'
import React, { useState, useEffect } from 'react'
const { TabPane } = Tabs
import styles from './index.less'


export default function Tab(props) {
  const { titles=[], keys=[], contents=[] } = props  //这是必要的传入的数据 均为数组 titles 代表标题/keys key/contents 组件内容
  const [key, setkKey] = useState(keys[0])
  const [tabParams, setTabParams] = useState([])

  useEffect(() => {
    const arr = []
    titles.map((item) => {
      arr.push({ title: item })
    })

    keys.map((item, index) => {
      arr[index] = { ...arr[index], key: item }
    })

    contents.map((item, index) => {
      arr[index] = { ...arr[index], content: item }
    })
    setTabParams(arr)
  }, [])

  const onChange = (key) => {
    setkKey(key)
  }

  return (
    <Tabs
      onChange={onChange}
      type="card"
      activeKey={key}
      className={styles.tab}
    >
      {tabParams.map((item) => (
        <TabPane tab={item.title} key={item.key}>
          {item.content}
        </TabPane>
      ))}
    </Tabs>
  )
}

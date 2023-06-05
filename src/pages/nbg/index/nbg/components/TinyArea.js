import React, { useEffect, useRef, useState } from 'react';
import { Row, Col } from 'antd';
import { post } from '@/services/https';
import { language } from '@/utils/language';
import CateCard from '@/components/Index/CateCard/CateCard'

const TinyArea = (props) => {
  const [data, setData] = useState([]);
  const [usage, setUsage] = useState([]);
  const [title, setTitle] = useState('');
  const [cpudata, setCpudata] = useState([]);
  const [cpusage, setCpusage] = useState([]);
  const [cputitle, setCpuitle] = useState('');
  let timer = null

  useEffect(()=>{
    getData();
    getCpudata();
    setTimer()
    return ()=>{
      clearInterval(timer)
    }
  },[])

  const setTimer = ()=>{
    timer = setInterval(() => {
      getData();
      getCpudata();
    }, 3000);
  } 

  const getCpudata = () => {
    post('/cfg.php?controller=sysHeader&action=showSysChart', { chartype: 'cpu' }).then((res) => {
      let list = []
      res.lines.map((item, index) => {
        list.push(item.value)
      })
      setCpudata(list);
      setCpusage(res.usage);
      setCpuitle(res.title);
    })
  }

  const getData = () => {
    post('/cfg.php?controller=sysHeader&action=showSysChart', { chartype: 'mem' }).then((res) => {
      let list = []
      res.lines.map((item, index) => {
        list.push(item.value)
      })
      setData(list);
      setUsage(res.usage);
      setTitle(res.title);
    })
  }

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <CateCard title={cputitle} usagecpu={cpusage} lines={cpudata} />
        </Col>
        <Col span={12}>
          <CateCard title={title} usagecpu={usage} lines={data} usetitle={language('index.nbg.usetitle')} />
        </Col>
      </Row>
    </div>
  )

}
export default TinyArea
import React, { useRef, useState, useEffect } from 'react';
import { Tabs } from 'antd';
import { post } from '@/services/https';
import { language } from '@/utils/language';
import BasicInfo from './components/basicinfo';
import StatusInfo from './components/statusinfo';
import DevlistClose from '@/assets/dmc/devlist_close.svg';
import '@/utils/index.less';
import './../index.less';

const { TabPane } = Tabs;
let H = document.body.clientHeight - 105
var clientHeight = H
export default (props) => {
  let device_id = props.match.params.id;//设置默认设置id
  const [detailInfo, setDetailInfo] = useState([]);

  useEffect(() => {
    detail();
  }, [])

  const detail = () => {
    let data = [];
    data.device_id = device_id;
    post('/cfg.php?controller=confDevice&action=detail', data).then((res) => {
      if (res.success) {
        setDetailInfo(res.data);
        console.log(res.data)
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  return (
    <>
      <div className='seebigbox'>
        <Tabs className='lefttabsbox' tabPosition='left' style={{ height: clientHeight, backgroundColor: '#FFFFFF' }}>
          <TabPane tab={<div className='dmcseetabstitle'>{language('cfgmngt.devlist.basicinfo')}</div>} key="1">
            <div style={{ height: clientHeight }}>
              <BasicInfo detailInfo={detailInfo} />
            </div>
          </TabPane>
          <TabPane tab={<div className='dmcseetabstitle'>{language('cfgmngt.devlist.statusinfo')}</div>} key="2">
            <div style={{ height: clientHeight }}>
              <StatusInfo detailInfo={detailInfo} />
            </div>
          </TabPane>
        </Tabs>
        <div onClick={() => {
          window.history.back();
        }} className='blackclose'>
          <img src={DevlistClose} />
        </div>
      </div>
    </>
  )

}
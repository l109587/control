import React from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Prot, Outreach } from './components';
import '@/utils/index.less';
import './index.less'
let H = document.body.clientHeight / 2 - 60
var clientHeight = H

const Configuration = () => {

  return (
    <div className='basecfgContent'>
      <ProCard className='basecfgCard' ghost direction='column' gutter={[13, 13]}>
        <ProCard ghost style={{
          backgroundColor: 'white'
        }}>
          <Prot  />
        </ProCard>

        <ProCard ghost style={{
          backgroundColor: 'white'
        }} >
          <Outreach />
        </ProCard>
      </ProCard>
    </div>
  )
}

export default Configuration

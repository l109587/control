import React, { useRef, useState, useEffect } from 'react';
import { Dropdown, Menu } from 'antd';
import { ViewGridList, LinkTwo } from '@icon-park/react';
import './cutdropdowm.less';
export default (props) => {
  let { menu, addrlist } = props
  return (
    <Dropdown overlay={<Menu items={menu} />} overlayClassName='menudropdown' 
      trigger={['click']} placement='bottomLeft' >
      <div className='addrlistspace' onClick={false} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div onClick={false} style={{ width: '80%', overflow: 'hidden' }}>{addrlist?.join(';')}</div>
        <div><ViewGridList theme="outline" size="20" fill="#FF7429" strokeWidth={3} /></div>
      </div>
    </Dropdown>
  );

}
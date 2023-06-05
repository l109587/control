import React, { useRef, useState, useEffect } from 'react';

const osIconList = (props) => {
  let icon = props?props.toLowerCase():'';
  if(icon == 'linux') {
    return (<i className='fa fa-linux' style={{ fontSize: '15px', marginRight: '5px' }}></i>)
  }
  else if(icon.includes("window")) {
    return (<i className='fa fa-windows' style={{ fontSize: '15px', marginRight: '5px' }}></i>)
  }
  else if(icon == 'uos') {
    return (<i className='iconfont icon-tongxin-' style={{ fontSize: '15px', marginRight: '5px' }}></i>)
  }
  else if(icon == 'unix-like') {
    return (<i className='iconfont icon-Unix' style={{ fontSize: '15px', marginRight: '5px' }}></i>)
  }
  else if(icon == 'unix') {
    return (<i className='iconfont icon-a-ziyuan66' style={{ fontSize: '15px', marginRight: '5px' }}></i>)
  }
  else if(icon == 'ubuntu') {
    return (<i className='iconfont icon-Ubuntu' style={{ fontSize: '15px', marginRight: '5px' }}></i>)
  }
  else if(icon == 'h3c comware') {
    return (<i className='iconfont icon-H3C' style={{ fontSize: '15px', marginRight: '5px' }}></i>)
  }
  else if(icon == 'debian') {
    return (<i className='iconfont icon-debian' style={{ fontSize: '15px', marginRight: '5px' }}></i>)
  }
  else if(icon == 'cisco ios') {
    return (<i className='iconfont icon-Cisco' style={{ fontSize: '15px', marginRight: '5px' }}></i>)
  }
  else if(icon == 'centoS') {
    return (<i className='fa fa-linux' style={{ fontSize: '15px', marginRight: '5px' }}></i>)
  }
  else if(icon == 'kylinos') {
    return (<i className='iconfont icon-dongtuqilin' style={{ fontSize: '15px', marginRight: '5px' }}></i>)
  }
  else if(icon == 'vrp') {
    return (<i className='iconfont icon-Huawei' style={{ fontSize: '15px', marginRight: '5px' }}></i>)
  }
  else if(icon == 'macos') {
    return (<i className='iconfont icon-macos' style={{ fontSize: '15px', marginRight: '5px' }}></i>)
  }
  else {
    return (<i className='iconfont icon-fuwuqi1' style={{ fontSize: '15px', marginRight: '5px' }}></i>)
  }
}


export default osIconList
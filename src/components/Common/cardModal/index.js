import React, { useRef, useState, useEffect } from 'react';
import { language } from '@/utils/language';
import ProCard from '@ant-design/pro-card';
import '@/utils/index.less';
import './index.less';

export default (props) => {
  const {cardHeight, leftContent, rightContent, title, type } = props
  const [moveStatus, setMoveStatus] = useState('');
  return (
    <>
      <ProCard ghost gutter={moveStatus == 'front' ? false : [13, 13]}>
        <ProCard className='ztreecard'
          // ghost={type ? true : false}
          style={
            type  ? {  height: cardHeight } : { height: cardHeight}
          }
          colSpan={moveStatus == 'front' ? '0px' : '238px'}
          title={title ? title : false}>
            {leftContent}
          <div className={moveStatus == 'front' ? 'zdislpayArrow zarrowfront' : 'zdislpayArrow zarrowafter'} evt='close' onClick={() => {
            if (!moveStatus || moveStatus == 'after') {
              setMoveStatus('front');
            } else {
              setMoveStatus('after');
            }
          }}><a className={moveStatus == 'front' ? 'pngfix open' : 'pngfix'} href="javascript:void(0);"></a></div>
        </ProCard>
        <ProCard className='treecardbuttmomove'
           colSpan={moveStatus == 'front' ? 'calc(100% )' : 'calc(100% - 238px)'}
          ghost style={{ height: cardHeight, backgroundColor: 'white', }}>
            {rightContent}
        </ProCard>

      </ProCard>

    </>
  )

}
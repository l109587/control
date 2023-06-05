import { Tag } from 'antd'
import React from 'react'

export default (props) => {
  const { color, name} = props;
  let style = props.style ? props.style : {};
  style.marginRight = '0px';
  return (
    <Tag style={style} color={color ? color : 'warning'} >{name ? name : ''}</Tag>
  )
}

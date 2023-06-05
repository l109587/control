import React from 'react'
import './CircleIcon.less'

export default (props) => {
  const { title, name } = props;
  return (
    <div className='circularbox'>
      {name}
    </div>
  )
}
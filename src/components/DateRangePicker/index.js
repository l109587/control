import React, { useState } from 'react'
import {
  ProFormText,
  ProFormDatePicker,
  ProFormDigit,
} from '@ant-design/pro-form'
import { language } from '@/utils/language'
import moment from 'moment'
import './DateRangePicker.less';

const DateRangePicker = (props) => {

  const { disabledDateFn, formName, width, labelText,onChange } = props

  return (
    <>
      <ProFormDatePicker
        label={labelText} 
        width={width}
        name={formName}
        fieldProps={
          {
            disabledDate: disabledDateFn,
            onChange:(value)=>{
              onChange(value)
            }
          }
        }
      />
    </>
  )
}

export default DateRangePicker

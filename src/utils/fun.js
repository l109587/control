import React from 'react'
import { message } from 'antd'

export const msg = (res) => {
  if (res.success) {
    onSuccess(res)
  } else {
    onError(res)
  }
}

export const onSuccess = (res) => {
  if (res.msg) {
    message.success(res.msg)
  }
}
export const onError = (res) => {
  if (res.msg) {
    message.error(res.msg)
  }
}

import React from 'react';
import ProForm, { ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { language } from '@/utils/language';
import { regList } from '@/utils/regExp';


/**
 * 最大长度方法
 * @param {*文字内容} val 
 * @param {*限制长度} limitLen 
 * @param {限制类型最大最小长度} type 
 * @returns 
 */
const sizeLenght = (val, limitLen, type = 'max') => {
  var str = val;
  var i = 0;
  var c = 0;
  var unicode = 0;
  var len = 0;
  len = str.length;
  for (i = 0; i < len; i++) {
    unicode = str.charCodeAt(i);
    if (unicode < 127) { //判断是单字符还是双字符
      c += 1;
    } else { //chinese
      c += 3;
    }
  }
  if (type == 'max') {
    if (c > limitLen) {
      return false;
    } else {
      return true;
    }
  } else {
    if (c < limitLen) {
      return false;
    } else {
      return true;
    }
  }

}

/**
 * 自定义正则方法
 * @param {*正则} rules 
 * @param {*输入内容} value 
 * @param {*回调信息} callback 
 * @param {*最大字节长度} maxLen 
 * @param {*最小字节长度} minLen 
 */
const validatorFn = (rules = '', value, callback, maxLen = '', minLen = '') => {
  if (value) {
    if (rules) {
      let reg = rules[0].pattern;
      if (!reg.test(value)) {
        callback(rules[0].message)
      }
    }
    if (minLen) {
      let res = sizeLenght(value, minLen, 'min')
      if (!res) {
        callback(minText(minLen))
      }
    }
    if (maxLen) {
      let res = sizeLenght(value, maxLen)
      if (!res) {
        callback(maxText(maxLen))
      }
    }
    callback()
  } else {
    callback()
  }
}

/**
 * 最小长度文本
 * @param {长度} num 
 * @returns 
 */
const minText = (num) => {
  if (num < 3) {
    return language('project.strtextminbyte', { maxLen: num })
  } else {
    let sizeNum = parseInt(num / 3);
    return language('project.strtextmin', { maxSize: sizeNum, maxLen: num })
  }
}

/**
 * 最大长度文本
 * @param {长度} num 
 * @returns 
 */
const maxText = (num) => {
  let sizeNum = parseInt(num / 3);
  return language('project.strtextmax', { maxSize: sizeNum, maxLen: num })
}


/**
 * 
 * @param {提交参数名称} name 
 * @param {标题内容} label 
 * @param {正则验证内容} rules 
 * @param {内容是否必填} required 
 * @param {宽度} width 
 * @param {样式} style 
 * @param {最大字节长度} max 
 * @param {最小字节长度} min 
 * @returns 
 */
export const NameText = (data = {}) => {
  let max = 64;
  let min = 3;
  return (
    <ProFormText
      name={data.name || data.name === false ? data.name : 'name'}
      disabled={data.disabled ? true : false}
      width={data.width ? data.width : ''}
      label={data.label || data.label === false ? data.label : language('project.devname')}
      style={data.style ? data.style : false}
      tooltip={data.tooltip ? data.tooltip : false}
      rules={[
        data.min || min ? { required: data.required ? true : false, message: minText(data.min ? data.min : min) } : { required: data.required ? true : false },
        {
          validator: (rule, value, callback) => {
            validatorFn(data.rules ? data.rules : [{
              pattern: regList.strtext.regex,
              message: regList.strtext.alertText
            }], value, callback, data.max ? data.max : max, data.min ? data.min : min)
          }
        }
      ]}
    />
  )
}

/**
 * 
 * @param {提交参数名称} name 
 * @param {标题内容} label 
 * @param {正则验证内容} rules 
 * @param {内容是否必填} required 
 * @param {宽度} width 
 * @param {备注框类型} type 
 * @returns 
 */
export const NotesText = (data = {}) => {
  let max = '384';
  let min = '';
  if (data.type == 'text') {
    return (
      <ProFormText
        name={data.name ? data.name : 'notes'}
        disabled={data.disabled ? true : false}
        width={data.width ? data.width : ''}
        label={data.label || data.label === false ? data.label : language('project.remark')}
        style={data.style ? data.style : false}
        tooltip={data.tooltip ? data.tooltip : false}
        rules={[
          data.min || min ? { required: data.required ? true : false, message: minText(data.min ? data.min : min) } : { required: data.required ? true : false },
          {
            validator: (rule, value, callback) => {
              validatorFn(data.rules ? data.rules : [{
                required: data.required ? true : false,
                pattern: regList.notesText.regex,
                message: regList.notesText.alertText
              }], value, callback, data.max ? data.max : max, data.min ? data.min : min)
            }
          }
        ]}
      />
    )
  } else {
    return (
      <ProFormTextArea
        name={data.name ? data.name : 'notes'}
        disabled={data.disabled ? true : false}
        width={data.width ? data.width : ''}
        label={data.label || data.label === false ? data.label : language('project.remark')}
        style={data.style ? data.style : false}
        rules={[
          data.min || min ? { required: data.required ? true : false, message: minText(data.min ? data.min : min) } : { required: data.required ? true : false },
          {
            validator: (rule, value, callback) => {
              validatorFn(data.rules ? data.rules : [{
                required: data.required ? true : false,
                pattern: regList.notesText.regex,
                message: regList.notesText.alertText
              }], value, callback, data.max ? data.max : max, data.min ? data.min : min)
            }
          }
        ]}
      />
    )
  }

}


/**
 * 
 * @param {提交参数名称} name 
 * @param {标题内容} label 
 * @param {正则验证内容} rules 
 * @param {内容是否必填} required 
 * @param {宽度} width 
 * @returns 
 */
export const ContentText = (data = {}) => {
  let max = 192;
  let min = 1;
  return (
    <ProFormText
      name={data.name || data.name === false ? data.name : 'name'}
      disabled={data.disabled ? true : false}
      width={data.width ? data.width : ''}
      label={data.label || data.label === false ? data.label : language('project.devname')}
      style={data.style ? data.style : false}
      placeholder={data.placeholder ? data.placeholder : false}
      tooltip={data.tooltip ? data.tooltip : false}
      rules={[
        data.min || min ? { required: data.required ? true : false, message: minText(data.min ? data.min : min) } : { required: data.required ? true : false },
        {
          validator: (rule, value, callback) => {
            validatorFn(data.rules ? data.rules : [{
              required: data.required ? true : false,
              pattern: regList.strtext.regex,
              message: regList.strtext.alertText
            }], value, callback, data.max ? data.max : max, data.min ? data.min : min)
          }
        }
      ]}
    />
  )
}




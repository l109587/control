import React, { useRef, useState, useEffect } from 'react';
import { DeleteFilled, QuestionCircleFilled, UploadOutlined } from '@ant-design/icons';
import './webUpload.less';
import { Button, Col, message, Row, Modal, Upload } from 'antd';
import axios from 'axios';
import store from 'store'
import { createElement } from 'react'
import { language } from '@/utils/language';
import { fetchAuth } from '@/utils/common';
const { confirm } = Modal;

// 注： 自动上传如需取消，需展示进度条 maxSize、maxCount、为自动导入必传项
// maxSize 文件最大大小，单位为m，
// isShowUploadList为是否展示文件上传列表及上传进度条，
// upurl是上传接口
// accept是上传类型限制
// maxCount是上传数量限制
// parameter是接口负载参数
// 手动上传如需选择多文件则父组件传multiple = 'multiple'
// upbutext是上传按钮文字
// 上传按钮样式调整需再页面文件对应样式中设置如 .xxx .ant-btn { background-color: #1890ff; }
// 父组件传isUpsuccess为true可调用onSuccess onSuccess 是导入成功后的方法, 父组件传isUploading为true可调用onError onError是导入失败后的方法. 
// showModal 为手动上传是否需要弹框 
// isCheck 为是否需要检测, checkFun是检测的方法
// modalText 为弹框文字
// isRequired 为是否需要表单必填项，值为true/false
// paramValue 为手动上传表单必填项的同步传值， 详见sysmain/mtalog
// isReqmsg 为表单必填项未填的文本

export default (props) => {
  const writable = fetchAuth()
  const [fileList, setFileList] = useState([]);
  const [fileName, setFileName] = useState('');
  let token = store.get('token');

  const { upbutext, maxSize, isShowUploadList, upurl, accept, maxCount, parameter, isAuto, isIcon, showModal, isCheck, checkFun, modalText, isUploading, isUpsuccess, isError, onUploading, onSuccess, onError, isRequired,name=false,autoBtnType='default',handBtnType='default', ruleFn } = props;

  const uploadProps = {
    action: process.env.NODE_ENV === 'development' ? URL+upurl : upurl,
    accept: accept,
    maxCount: maxCount,
    data: name?{...parameter,fileName:fileName}:parameter,
    headers: {
      token: token,
    },
    beforeUpload: (file) => {
      setFileName(file.name)
      let autoFileName = file.name
      let FileSuffix = autoFileName.substr(autoFileName.lastIndexOf("."))
      let isPass = accept.indexOf(FileSuffix)
      if (isPass == -1) {
        message.error(language('project.upload.fileSuffix.error', { accept: accept }))
        return Upload.LIST_IGNORE || false
      }
      const isfileSize = file.size / 1024 / 1024 < maxSize;
      if(!isfileSize) {
        message.error(language('project.upload.filesizemsg', { maxSize: maxSize }))
        return Upload.LIST_IGNORE || false
      }
    },
    onChange(info) {
      if(info.file.status === 'uploading') {
        if(isUploading === true) {
          onUploading(info)
        }
      }
      if(info.file.status === 'done') {
        if(isUpsuccess === true) {
          onSuccess(info.file.response, info.file)
        }
      } else if(info.file.status === 'error') {
        if (isError === true) {
          onError()
        }
      }
    },
  };

  let xhr;
  const uploadFile = () => {
    let url =  process.env.NODE_ENV === 'development' ? URL+upurl : upurl;
    let formData = new FormData();
    if(fileList.length > maxCount) {
      message.error(language('project.upload.filelength', { maxCount: maxCount }));
      throw '';
    }
    fileList.map((file) => {
      let docuName = file.name
      let suffix = docuName.substr(docuName.lastIndexOf("."))
      let isSuffix = accept.indexOf(suffix)
      if (isSuffix == -1) {
        message.error(language('project.upload.fileSuffix.error', { accept: accept }))
        Modal.destroyAll();
        throw '';
      }
      const isfileSize = file.size / 1024 / 1024 < maxSize;
      if(!isfileSize) {
        message.error(language('project.upload.filesizemsg', { maxSize: maxSize }))
        setFileList([]);
        Modal.destroyAll();
        throw '';
      }
      formData.append('file', file);
      if(parameter) {
        for(const key in parameter) {
            formData.append(key, props.paramValue.current)
        }
      }
    });
    xhr = new XMLHttpRequest();  // XMLHttpRequest 对象
    xhr.open("post", url, true); //post方式，url为服务器请求地址，true 该参数规定请求是否异步处理。
    xhr.setRequestHeader("token", token)
    xhr.onload = uploadComplete; //请求完成
    xhr.onerror = uploadFailed; //请求失败
    xhr.upload.onprogress = progressFunction;//【上传进度调用方法实现】
    xhr.send(formData); //开始上传，发送form数据
  }

  //上传成功响应
  function uploadComplete(evt) {
    setFileList([])
    //服务端接收完文件返回的结果 xhr.responseText
    let info = xhr.responseText
    let res = eval("("+info+")") // 不能直接获取返回值，需进行转换
    message.success(res.msg);
    if(isCheck === true) {
      checkFun(); // 检测是否操作完成
    }
  }

  //上传失败
  function uploadFailed(evt) {
    message.error(language('project.upload.errormsg'));
  }

  // 进度条方法
  function progressFunction(evt) {
    let load = document.getElementById("load");
    let divProgress = document.getElementById('divProgress');
    let loadWidth = 0;
    loadWidth = Math.round(evt.loaded / evt.total * 100);
    if(isShowUploadList === true) {
      if(0 < loadWidth < 100) {
        divProgress.style.display = 'block';
        load.style.display = 'block';
      }
      if(loadWidth == 100) {
        divProgress.style.display = 'none';
        load.style.display = 'none';
      }
      load.style.width = loadWidth + '%';
    }
  }

  // 取消上传
  const cancelUpload = () => {
    if(xhr === undefined) {
      let load = document.getElementById("load");
      let divProgress = document.getElementById('divProgress');
      divProgress.style.display = 'none';
      load.style.display = 'none';
    } else {
      xhr.abort();
      let load = document.getElementById("load");
      let divProgress = document.getElementById('divProgress');
      divProgress.style.display = 'none';
      load.style.display = 'none';
    }
  }

  // 手动上传相关配置
  const manprops = {
    accept: accept,
    maxCount: maxCount,
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      cancelUpload();
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  /* 手动上传确认弹框 */
  const askModal = () => {
    confirm({
      className: 'askModal',
      icon: <QuestionCircleFilled />,
      title: language('project.operate'),
      content: modalText,
      okText: language('project.mconfig.devices.ok'),
      cancelText: language('project.mconfig.devices.cancel'),
      onOk() {
        uploadFile();
      }
    });
  };


  const handleOK = () => {
    if (isRequired === true || ruleFn) {
      if (!props.paramValue.current || ruleFn(props.paramValue.current) == false ) {
        message.error(props.isReqmsg)
        throw ''
      } else if (showModal === true) {
        askModal();
      } else {
        uploadFile();
      }
    }
     else {
      if(showModal === true) {
        askModal();
      } else {
        uploadFile();
      }
    }
  }

  return (
    isAuto === true ?
      <Upload {...uploadProps} showUploadList={isShowUploadList}>
        <Button className='AutoUpButton' type={autoBtnType} disabled={!writable} icon={isIcon ===false ?'':<UploadOutlined />}>{upbutext}</Button>
      </Upload> :
      <div className='manualDiv'>
        <Row gutter={8}>
          <Col span={16}>
            <Upload {...manprops} showUploadList={isShowUploadList}>
              <Button className='checkButton' type={handBtnType} disabled={!writable} icon={<UploadOutlined />}>{upbutext}</Button>
            </Upload>
          </Col>
          <Col span={8}>
            <Button
              type="primary"
              className='okButton'
              onClick={
               () => {
                setTimeout(() => {
                  handleOK()
                }, 500)
               }
              }
              disabled={fileList.length === 0 || fileList.length > maxCount}
            >
              {language('project.upload.okbuttontext')}
            </Button>
          </Col>
        </Row>
        {isShowUploadList === true ? <div id='divProgress' className='divProgress'>
          <div className='load' id='load'></div>
        </div> : <></>}
      </div>
  )
}

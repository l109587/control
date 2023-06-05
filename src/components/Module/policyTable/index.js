import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import { Input, message, Tooltip, Popconfirm } from 'antd';
import { language } from '@/utils/language';
import { post, postAsync } from '@/services/https';
import SyncRevoketable from './SyncRevoketable'
import { CheckCircleFilled } from '@ant-design/icons';
import { LoadingOne, WorriedFace } from '@icon-park/react';
import './index.less'
const { Search } = Input;

const Policy = forwardRef(({ ...props }, ref) => {
  useImperativeHandle(ref, () => ({
    openEdModal
  }))
  let exportTimer = '';
  const {
    recordFind, // 当前行内容
    syncundosaveurl, // 撤销分发接口 
    syncundoshowurl, // 撤销分发回显接口 
    assocshowurl, // 关联设备回显接口
    cfg_type_type, // 设备列表类型
    modalVal, // 判断页面弹出内容 'distribute'=  分发  remoke= 撤销  assoc=关联设备表头
    setIncID,
    incID,
    isDefaultCheck,
    tableKeyVal,// 列表唯一key
    isOptionHide, 
    isHandleShow, // 关联设备操作项是否开启
    assocType,// 判断关联设备进入页面类型 1 策略中心策略  否则 黑白名单为2
    module,
    projectType
  } = props;

  const openEdModal = (status) => {
    if (status == 'Y') {
      setIncIDDev(incIDDev + 1);
      setEditmodalSta(true)
    } else {
      clearTimeout(exportTimer);
      setEditmodalSta(false);
    }
  }

  /* 分发撤销表头 */
  const editcolumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      ellipsis: true,
      width: 80,
    },
    {
      title: language('adminacc.label.status'),
      dataIndex: 'isOnline',
      key: 'isOnline',
      align: 'center',
      width: 80,
      ellipsis: true,
      filters: [
        { text: language('project.logmngt.devctl.online'), value: 1 },
        { text: language('project.logmngt.devctl.offline'), value: 0 },
      ],
      filterMultiple: false,
      valueEnum: {
        1: { text: language('project.logmngt.devctl.online'), status: 2 },
        0: { text: language('project.logmngt.devctl.offline'), status: 0 },
      },
    },
    {
      title: language('project.devid'),
      dataIndex: 'devid',
      key: 'devid',
      align: 'left',
      width: 160,
      ellipsis: true,
    },
    {
      title: language('project.logmngt.devname'),
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      width: 140,
      ellipsis: true,
    },
    {
      title: language('project.devip'),
      dataIndex: 'ip',
      key: 'ip',
      align: 'left',
      width: 140,
      ellipsis: true,
      hideInTable: isOptionHide ? false : true,
    },
    {
      title: language('adminacc.label.zone'),
      dataIndex: 'zoneName',
      key: 'zoneName',
      align: 'left',
      width: 80,
      ellipsis: true,
    },
    {
      title: language('project.logmngt.result'),
      dataIndex: 'end',
      key: 'end',
      align: 'center',
      width: 80,
      ellipsis: true,
      hideInTable: isOptionHide ? false : true,
      render: (text, record) => {
        if (record.end === 1) {
          return (
            <CheckCircleFilled style={{ color: '#12C189', size: 16 }} />
          )
        } else if (record.end === 2) {
          return (<div className='resultDiv'>
            <WorriedFace theme="outline" size="16" fill='#FA561F' />
          </div>)
        } else if (record.end === 0) {
          return (<div className='resultDiv'>
            <LoadingOne theme="outline" size="16" fill='#37C3FC' strokeWidth={3} />
          </div>)
        } else {
          return <></>;
        }
      }
    }
  ]

  /* 关联设备表头 */
  const assoccolumns = [
    {
      title: language('project.mconfig.cfnid'),
      dataIndex: 'id',
      align: 'left',
      hideInTable: true,
    },
    {
      title: language('project.devid'),
      dataIndex: 'devid',
      align: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.mconfig.equipmentname'),
      dataIndex: 'name',
      align: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.devip'),
      dataIndex: 'ip',
      align: 'left',
      ellipsis: true,
      width: 130,
      hideInTable: isOptionHide ? false : true,
    },
    {
      title: language('project.mconfig.fromzone'),
      dataIndex: 'zoneName',
      align: 'left',
      ellipsis: true,
      width: 90,
    },
    {
      title: language('project.mconfig.state'),
      dataIndex: 'result',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.mconfig.time'),
      dataIndex: 'update_time',
      align: 'left',
      ellipsis: true,
      width: 150,
    },
    {
      title: language('project.mconfig.operate'),
      align: 'center',
      key: 'operate',
      valueType: 'option',
      fixed: 'right',
      hideInTable: isOptionHide ? isHandleShow ? true : false : true,
      width: 80,
      render: (text, record, index) => {
        if (record.state == 1) {
          if (assocType === 1) {
            return (<>
              <Popconfirm title={language('project.mconfig.determinerevoke')} onConfirm={() => {
                AssocFn('revoke', record)
              }}>
                <Tooltip title={language('project.revoke')} >
                  <span className='operateSpan'>
                    <i className="fa fa-recycle revokeIcon" aria-hidden="true" />
                  </span>
                </Tooltip>
              </Popconfirm>
            </>)
          }
        } else {
          return (<>
            <Popconfirm title={language('project.mconfig.determinedistrbute')} onConfirm={() => {
              AssocFn('distribute', record)
            }}>
              <Tooltip title={language('project.distribute')} >
                <span className='operateSpan'>
                  <i className="ri-mail-send-fill distribuIcon" />
                </span>
              </Tooltip>
            </Popconfirm>
          </>)
        }
      }
    }
  ]

  const editformRef = useRef();
  const listStatusUrl = '/cfg.php?controller=device&action=checkSyncState';
  const [editmodalSta, setEditmodalSta] = useState(false);
  const [queryVal, setQueryVal] = useState();
  const [incIDDev, setIncIDDev] = useState(1);
  const editableKey = modalVal == 'distribute' ? 'distribute' : 'revoke';
  const assocTableKey = 'assocTable'
  const editcolumnvalue = modalVal == 'distribute' ? tableKeyVal + 'distributecolumnvalue' : tableKeyVal + 'revokecolumnvalue';
  let rowkey = (record => isOptionHide ? record.ip : record.devid);
  let rowKeyID = isOptionHide ? 'ip' : 'devid';
  let searchVal = { [isOptionHide?'cfg_inter_id':'id']: recordFind?.id, cfg_type_type: cfg_type_type, devgrpID: recordFind?.devgrpID, queryVal: queryVal, type: projectType, module: module, queryType: 'fuzzy', rule_id: recordFind.rule_id };//顶部搜索框值 传入接口
  if(modalVal == 'assoc'){
    searchVal.hashow = 'on'
  }

  const [loading, setLoading] = useState(false);
  const concealColumns = {
    id: { show: false },
  }

  const [contentList, setContentList] = useState({});
  const [selectData, setSelectData] = useState([])

  const tableTopSearch = () => {
    return (
      <Search placeholder={ isOptionHide ? language('dmcoconfig.attachck.tacsechholder') : language('dmcoconfig.attachck.searchholder')}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncIDDev(incIDDev + 1);
        }} />
    )
  }

  // 查询同步数据是否处理完成
  const syncReovke = async (op) => {
    clearTimeout(exportTimer);
    setLoading(true);
    let data = {};
    data.id = recordFind.id;
    data.op = op;
    data.cfgType = cfg_type_type;
    data.devips = selectData.join(',');
    let res = await postAsync(listStatusUrl, data);
    if (!res.success) {
      message.error(res.msg);
      return false;
    }
    setContentList(res.data);
    if (!res.finished) {
      exportTimer = setTimeout(() => {
        syncReovke(op);
      }, 1000);
    } else {
      setTimeout(() => {
        openEdModal('N');
        setLoading(false);
        setIncID(incID + 1);
      }, 1000);
      setSelectData([]);//清空选择数据
    }
  }

  //批量同步撤销
  const OperateFn = (op) => {
    let data = {};
    data.id = recordFind.id;
    data.rule_id = recordFind.rule_id;
    data.op = op;
    if (isOptionHide) {
      data.devips = selectData.join(',');
    } else {
      data.devids = selectData.join(',');
      data.module = module;
    }
    post(syncundosaveurl, data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setLoading(true);
      if (isOptionHide) {
        syncReovke(op);
      } else {
        openEdModal('N');
        setIncID(incID + 1);
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  //操作栏同步撤销 单个
  const AssocFn = (op, record) => {
    let data = {};
    data.id = recordFind.id;
    data.op = op;
    data.devips = record.ip;
    post(syncundosaveurl, data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      openEdModal('N');
      setIncID(incID + 1);
    }).catch(() => {
      console.log('mistake')
    })
  }

  return (<>
    <ModalForm formRef={editformRef} submitTimeout={2000}
      visible={editmodalSta} onVisibleChange={setEditmodalSta}
      title={modalVal == 'distribute' ? language('dmcoconfig.attachck.distributeTitle') : modalVal == 'assoc' ? language('dmcoconfig.attachck.assocTitle') : language('dmcoconfig.attachck.revokeTitle')}
      submitter={modalVal == 'assoc' ? false : {
        searchConfig: {
          submitText: modalVal == 'distribute' ? language('project.distribute') : language('project.revoke')
        },
        submitButtonProps: {
          type: modalVal == 'distribute' ? 'primary' : 'danger',
          loading: isOptionHide ? loading : false
        }
      }}
      modalProps={{
        maskClosable: false,
        bodyStyle: {
          paddingTop: 0,
          paddingBottom: modalVal == 'assoc' ? 0 : 10,
        },
        onCancel: () => {
          openEdModal('N')
        }
      }} onFinish={async (values) => {
        OperateFn(modalVal);
      }}>
      <SyncRevoketable contentList={contentList} columns={modalVal == 'assoc' ? assoccolumns : editcolumns} clientHeight={300} concealColumns={concealColumns} rowkey={rowkey} searchText={tableTopSearch()} apishowurl={modalVal == 'assoc' ? assocshowurl : syncundoshowurl ? syncundoshowurl : assocshowurl} tableKey={modalVal == 'assoc' ? assocTableKey : editableKey} searchVal={searchVal} columnvalue={editcolumnvalue} rowSelection={modalVal == 'assoc' ? false : true} setSelectData={setSelectData} incID={incIDDev} isDefaultCheck={isDefaultCheck} rowKeyID={rowKeyID} 
      />
    </ModalForm>
  </>)
})

export default Policy

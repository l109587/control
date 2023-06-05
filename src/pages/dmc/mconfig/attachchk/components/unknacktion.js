import React, { useRef, useState, useEffect } from 'react'
import { ModalForm, ProCard, ProForm, ProFormText, ProFormSwitch, ProFormSelect, ProFormCheckbox, ProFormTextArea, ProFormDigit } from '@ant-design/pro-components';
import { Input, Modal, Space, Switch, Tag, Tooltip, message, Popconfirm } from 'antd';
import { LinkTwo, LoadingOne, Maximum, WorriedFace } from '@icon-park/react';
import { EditFilled, ExclamationCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { TableLayout } from '@/components';
import { PolicyTable } from '@/components';
import { post } from '@/services/https';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

let H = document.body.clientHeight - 336
var clientHeight = H

const Malapgtion = () => {

  /* 页面表格表头 */
  const columnlist = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'left',
      ellipsis: true,
      width: 80,
    },
    {
      title: language('project.analyse.status'),
      dataIndex: 'state',
      key: 'state',
      align: 'center',
      width: 80,
      filters: [
        { text: language('project.logmngt.devctl.online'), value: "Y" },
        { text: language('project.logmngt.devctl.offline'), value: "N" },
      ],
      filterMultiple: false,
      render: (text, record, index) => {
        let checked = true;
        if (record.state == 'N') {
          checked = false;
        }
        return (<Switch
          checkedChildren={language('project.open')}
          unCheckedChildren={language('project.close')}
          checked={checked}
          onChange={async (checked) => { SwitchBtn(record, checked) }}
        />)
      }
    },
    {
      title: language('alarmdt.ruleID'),
      dataIndex: 'rule_id',
      key: 'rule_id',
      align: 'left',
      width: 100,
      ellipsis: true,
    },
    {
      title: language('dmcoconfig.attachck.abn_type'),
      dataIndex: 'abn_type',
      key: 'abn_type',
      align: 'left',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => {
        let color = 'volcano';
        let title = language('dmcoconfig.attachck.abn_type.all');
        if (record?.info?.abn_type == '0') {
          title = language('dmcoconfig.attachck.abn_type.all');
        } else if (record?.info?.abn_type == '1') {
          title = language('dmcoconfig.attachck.abn_type.suspicious');
        } else if (record?.info?.abn_type == '2') {
          title = language('dmcoconfig.attachck.abn_type.remote');
        } else if (record?.info?.abn_type == '3') {
          title = language('dmcoconfig.attachck.abn_type.exceprotocol');
        } else if (record.info.abn_type == '4') {
          title = language('dmcoconfig.attachck.abn_type.exceproxy');
        }
        return(<Tag style={{ marginRight: 0, padding: '0 10px' }} color={color} key={record.info.abn_type}>{title}</Tag>)
      }
    },
    {
      title: language('dmcoconfig.attachck.allow_file'),
      dataIndex: 'allow_file',
      key: 'allow_file',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        if (record?.info?.allow_file == '0') {
          return language('dmcoconfig.refuse')
        } else {
          return language('dmcoconfig.allow')
        }
      }
    },
    {
      title: language('dmcoconfig.attachck.risk_min'),
      dataIndex: 'risk_min',
      key: 'risk_min',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        let color = 'success';
        let title;
        if (record?.info?.risk_min == '0') {
          color = '#BEBEBE';
          title = language('alarmdt.risk.safe')
        } else if (record?.info?.risk_min == '1') {
          color = '#93D2F3';
          title = language('alarmdt.risk.kind')
        } else if (record?.info?.risk_min == '2') {
          color = '#FA561F';
          title = language('alarmdt.risk.follow')
        } else if (record?.info?.risk_min == '3') {
          color = '#FF0000';
          title = language('alarmdt.risk.serious')
        } else if (record?.info?.risk_min == '4') {
          color = '#BD3124';
          title = language('alarmdt.risk.urgent')
        }
        return (
          <Tag style={{ marginRight: 0, padding: '0 10px' }} color={color} key={record?.info?.risk}>{title}</Tag>
        )
      }
    },
    {
      title: language('dmcoconfig.attachck.file_size_limit'),
      dataIndex: 'file_size_limit',
      key: 'record',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        if (record?.info?.file_size_limit > 0) {
          return(record?.info?.file_size_limit+'KB')
        } else {
          return record?.info?.file_size_limit
        }
      }
    },
    {
      title: language('dmcoconfig.attachck.rate_limit'),
      dataIndex: 'rate_limit',
      key: 'rate_limit',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        if (record?.info?.rate_limit > 0) {
          return(record?.info?.rate_limit+'KB')
        } else {
          return(record?.info?.rate_limit)
        }
      }
    },
    {
      title: language('dmcoconfig.attachck.file_num_hour'),
      dataIndex: 'file_num_hour',
      key: 'file_num_hour',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        if (record?.info?.file_num_hour > 0) {
          return(record?.info?.file_num_hour+'KB')
        } else {
          return(record?.info?.file_num_hour)
        }
      }
    },
    {
      title:  language('dmcoconfig.desc'),
      dataIndex: 'desc',
      key: 'desc',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        return(record?.desc)
      }
    },
    {
      title: language('dmcoconfig.from'),
      dataIndex: 'from',
      key: 'from',
      align: 'left',
      ellipsis: true,
      width: 90,
      render: (text, record, index) => {
        let color = 'cyan'
        let title = language('project.mconfig.local')
        if (record.from == "local") {
          color = 'cyan'
          title = language('project.mconfig.local')
        } else {
          color = 'volcano'
          title = language('project.mconfig.remote')
        }
        return (
          <Tag style={{ marginRight: '0px', padding: '0 10px' }} color={color}>{title}</Tag>
        )
      }
    },
    {
      title: language('dmcoconfig.refcnt'),
      dataIndex: 'refcnt',
      key: 'refcnt',
      align: 'left',
      ellipsis: true,
      width: 80,
      fixed: 'right',
      render: (text, record, index) => {
        let color = '#8E8D8D'
        if (record.refcnt > 0) {
          color = '#FF7429'
        } else {
          color = '#8E8D8D'
        }
        return (
          <Space className='assocDiv' align='left'>
            <div className='refcntNum'>{record.refcnt}</div>
            {
              record.refcnt > 0 ? <LinkTwo theme="outline" size="20" fill={color} strokeWidth={3} style={{ cursor: 'pointer' }} onClick={() => {disModal('assoc', record) }} />:<LinkTwo theme="outline" size="20" fill={color} strokeWidth={3} style={{ cursor: 'not-allowed' }} />
            }
          </Space>
        )
      }
    },
    {
      title: language('project.mconfig.operate'),
      align: 'center',
      key: 'operate',
      valueType: 'option',
      width: 120,
      fixed: 'right',
      render: (text, record) => {
        return (
          <Space className='attoperateDiv'>
          <Tooltip title={language('project.deit')} >
            <EditFilled className='editIcon' onClick={() => {
              modifyFn(record, 'mod')
            }} />
          </Tooltip>
          <Tooltip title={language('project.distribute')} >
            <span onClick={() => {
              disModal('distribute', record)
            }}>
              <i className="ri-mail-send-fill distribuIcon" />
            </span>
          </Tooltip>
          <Tooltip title={language('project.revoke')} >
            <span onClick={() => {
              disModal('revoke', record)
            }}>
              <i className="fa fa-recycle revokeIcon" aria-hidden="true" />
            </span>
          </Tooltip>
        </Space>
        )
      }
    },
  ]

  const module = 'abnormal';
  const formRef = useRef();
  const columnvalue = 'UnknackColumnvalue';
  const tableKey = 'Unknacktion';
  const [op, setOp] = useState('')
  const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
  const apishowurl = '/cfg.php?controller=confPolicy&action=show';
  const assocshowurl = '/cfg.php?controller=confPolicy&action=showDevice';
  const syncundoshowurl = '/cfg.php?controller=confDevice&action=showSynclist'; // 分发撤销回显接口
  const syncundosaveurl = '/cfg.php?controller=confPolicy&action=sync';//同步撤销接口
  const [queryVal, setQueryVal] = useState();
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy', module: 'abnormal' };
  const addButton = true;
  const addTitle = language('project.newbuild');
  let rowkey = (record => record.rule_id);
  const delButton = true;
  const rowSelection = true;
  const concealColumns = {
    id: { show: false },
  }
  const [rowRecord, setRowRecord] = useState([]);//记录当前信息
  const [incID, setIncID] = useState(0);
  const [modalVal, setModalVal] = useState();//当前点击弹框类型 distrbute | revoke | assocTable
  const recordFind = rowRecord; // 当前行id
  const isOptionHide = false;
  const isDefaultCheck = true;
  const projectType = 'policy';
   // 表格列
   const [columns, setColumns] = useState(columnlist);
   const [riskData, setRiskData] = useState([]);
   const [abntypeDate, setAbntypeDate] = useState([]);

   useEffect(() => {
     getSelectData();
   }, [])
 
   const getSelectData = () => {
     post('/cfg.php?controller=confPolicy&action=showData', { module: module }).then((res) => {
       setRiskData(res?.data?.risk_min);
       setAbntypeDate(res?.data?.abn_type)
       let riskFilter = res?.data?.risk_min?.map(item => ({
         text: item.label,
         value: item.value
       }));
       let abnTypeFilter = res?.data?.abn_type?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let fromFilter = res?.data?.from?.map(item => ({
        text: item.label,
        value: item.value
      }));
      columnlist.map((item, index) => {
        if (item.dataIndex == 'risk_min') {
          item.filters = riskFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == "from") {
          item.filters = fromFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == 'abn_type') {
          item.filters = abnTypeFilter;
          item.filterMultiple = false;
        }
       })
       setColumns([...columnlist]);
     })
   }

  /**分发  撤销功能 start  */
  const sRef = useRef(null);
  //调用子组件接口判断弹框状态
  const disModal = (op = '', record = {}) => {
    setRowRecord(record);
    modMethod(op);
    if (sRef.current) {
      sRef.current.openEdModal('Y');
    }
  }

  const tableTopSearch = () => {
    return (
      <Search placeholder={language('dmcoconfig.attachack.unknacktion.searchtext')}
        onSearch={(queryVal) => {
          setQueryVal(queryVal)
          setIncID(incID + 1)
        }} allowClear />
    )
  }

  const modMethod = (type) => {
    setModalVal(type);
  }

  const modifyFn = (each, op) => {
    let values = { ...each.info };
    values.state = each.state == 'Y' || each.state == true ? true : false;
    if (values.allow_file == 2) {
      values.allow_file = false
    };
    values.rule_id = each.rule_id;
    values.desc = each.desc;
    setTimeout(function () {
      formRef.current.setFieldsValue(values)
    }, 100)
    openModal('Y', op)
  }

  const openModal = (status, op) => {
    setOp(op);
    if (status == 'Y') {
      setModalStatus(true);
    } else {
      formRef.current.resetFields();
      setModalStatus(false);
    }
  }

  const closeModal = () => {
    formRef.current.resetFields();
    openModal('N');
  }

  const addClick = () => {
    openModal('Y', 'add')
  }

  const handleSave = (obj) => {
    let operateUrl = op == 'add' ? '/cfg.php?controller=confPolicy&action=add' : '/cfg.php?controller=confPolicy&action=set';
    let data = {};
    data.module = 'abnormal';
    data.rule_id = obj.rule_id;
    let state = 'N';
    if (obj.state == 'Y' || obj.state == true) {
      state = 'Y';
    }
    data.state = state;
    delete obj.state;
    data.desc = obj.desc;
    delete obj.desc;
    if (!obj.store_pcap) {
      obj.store_pcap = 2;
    } else {
      obj.store_pcap = 1;
    }
    data.info = JSON.stringify(obj);
    post(operateUrl, data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      setIncID(incID + 1);
      openModal('N')
    })
  }

  const delClick = (selectedRowKeys, dataList, selectedRows) => {
    let sum = selectedRowKeys.length;
    confirm({
      className: 'delclickbox',
      icon: <ExclamationCircleOutlined />,
      title: language('project.delconfirm'),
      content: language('project.cancelcon', { sum: sum }),
      onOk() {
        handleDel(selectedRowKeys, selectedRows)
      }
    });
  }

  /*删除接口  */
  const handleDel = (selectedRowKeys, selectedRows) => {
    let data = {}
    let ruleIDArr = selectedRows.map((e) => e.rule_id);
    data.rule_id = ruleIDArr.toString();
    post('/cfg.php?controller=confPolicy&action=del', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      setIncID(incID + 1);
    })
  }

  /* 启用禁用 */
  const SwitchBtn = (each, checked) => {
    let data = {};
    data.rule_id = each.rule_id;
    let state = 'N';
    if (checked) {
      state = 'Y';
    }
    data.state = state;
    post('/cfg.php?controller=confPolicy&action=enable', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      setIncID(incID => incID + 1);
    }).catch(() => {
      console.log('mistake')
    })
  }

  const afterDiv = (unit) => {
    return <div className='afterDiv'>{unit}</div>
  }

  return (<>
    <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={clientHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowkey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} addTitle={addTitle} components={true} />
    <PolicyTable ref={sRef} modalVal={modalVal} recordFind={recordFind} assocshowurl={assocshowurl} syncundoshowurl={syncundoshowurl} setIncID={setIncID} incID={incID} isOptionHide={isOptionHide} syncundosaveurl={syncundosaveurl} isDefaultCheck={isDefaultCheck} module={module} projectType={projectType}/>
    <ModalForm formRef={formRef} {...modalFormLayout} submitTimeout={2000}
      autoFocusFirstInput title={language('dmcoconfig.attachack.unknacktion.modaltitle')}
      visible={modalStatus} onVisibleChange={setModalStatus} width='520px'
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          closeModal()
        }
      }} onFinish={async (values) => {
        handleSave(values)
    }}>
      <ProFormText name='rule_id' hidden />
      <ProFormSwitch name='state'  label={language('dmcoconfig.attachck.plicystatus')} checkedChildren={language('project.open')} unCheckedChildren={language('project.close')} />
      <ProFormSelect label={language('dmcoconfig.attachck.abn_type')} name='abn_type' options={abntypeDate} rules={[{
        required: true,
        message: language('project.messageselect')
      }]}  />
      <ProFormSelect name='risk_min' label={language('dmcoconfig.attachck.risk_min')} options={riskData} rules={[{
        required: true,
        message: language('project.messageselect')
      }]} />
      <ProFormCheckbox label={language('dmcoconfig.attachck.allowupload')} name='allow_file' >{language('dmcoconfig.attachck.allowupload.text')}</ProFormCheckbox>
      <div className='flexDiv'>
        <ProFormText width={210} name='file_size_limit' label={language('dmcoconfig.attachck.file_size_limit')} addonAfter={afterDiv('KB')} rules={[
          {
            validator: (rule, value) => {
              if (Number(value) < 0 || Number(value) > 102400) {
                return Promise.reject(language('dmcoconfig.attachack.filesizemsg'));
              } else {
                return Promise.resolve();
              }
            }
          },
          {
            required: true,
            message: language('project.messageselect')
          }
        ]} />
        <ProFormText width={210} name='rate_limit' label={language('dmcoconfig.attachck.rate_limit')} addonAfter={afterDiv('KB')}  rules={[
          {
            validator: (rule, value) => {
              if (Number(value) < 0 || Number(value) > 1000) {
                return Promise.reject(language('dmcoconfig.attachack.ratelimitmsg'));
              } else {
                return Promise.resolve();
              }
            }
          },
          {
            required: true,
            message: language('project.messageselect')
          }
        ]} />
        <ProFormText width={210} name='file_num_hour' label={language('dmcoconfig.attachck.file_num_hour')} addonAfter={afterDiv(language('dmcoconfig.attachack.filenum.unit'))} rules={[
          {
            validator: (rule, value) => {
              if (Number(value) < 0 || Number(value) > 102400) {
                return Promise.reject(language('dmcoconfig.attachack.filenummsg'));
              } else {
                return Promise.resolve();
              }
            }
          },
          {
            required: true,
            message: language('project.messageselect')
          }
        ]} />
      </div>
      <ProFormText name='desc'  label={language('dmcoconfig.desc')} />
    </ModalForm>
  </>)
}

export default Malapgtion

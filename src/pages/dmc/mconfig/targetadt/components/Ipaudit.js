import React, { useRef, useState, useEffect } from 'react'
import { ModalForm, ProFormText, ProFormSwitch, ProFormSelect, ProFormCheckbox, ProFormRadio } from '@ant-design/pro-components';
import { Input, Modal, Space, Switch, Tag, Tooltip, message, Popconfirm } from 'antd';
import { LinkTwo, LoadingOne, User, WorriedFace } from '@icon-park/react';
import { EditFilled, ExclamationCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { TableLayout, PolicyTable } from '@/components';
import { post } from '@/services/https';
import { regIpList, regMacList, regCustomList, regList } from '@/utils/regExp';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

let H = document.body.clientHeight - 336
var clientHeight = H

const Ipaudit = () => {

  const columnlist = [
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
      title: language('alarmdt.risk'),
      dataIndex: 'risk',
      key: 'risk',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (text, record, index) => {
        let color = 'success';
        let title = language('analyse.resrisk.level.low');
        if (record?.info?.risk == '0') {
          color = '#BEBEBE';
          title = language('alarmdt.risk.safe')
        } else if (record?.info?.risk == '1') {
          color = '#93D2F3';
          title = language('alarmdt.risk.kind')
        } else if (record?.info?.risk == '2') {
          color = '#FA561F';
          title = language('alarmdt.risk.follow')
        } else if (record?.info?.risk == '3') {
          color = '#FF0000';
          title = language('alarmdt.risk.serious')
        } else if (record?.info?.risk == '4') {
          color = '#BD3124';
          title = language('alarmdt.risk.urgent')
        }
        return (
          <Tag style={{ marginRight: 0, padding: '0 10px' }} color={color} key={record?.info?.risk}>{title}</Tag>
        )
      }
    },
    {
      title: language('dmcoconfig.targetadt.sip'),
      dataIndex: 'sip',
      key: 'sip',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        return record?.info?.sip
      }
    },
    {
      title:language('dmcoconfig.targetadt.sport'),
      dataIndex: 'sport',
      key: 'sport',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        return record?.info?.sport
      }
    },
    {
      title: language('dmcoconfig.targetadt.dip'),
      dataIndex: 'dip',
      key: 'dip',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        return record?.info?.dip
      }
    },
    {
      title: language('dmcoconfig.targetadt.dport'),
      dataIndex: 'dport',
      key: 'dport',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        return record?.info?.dport
      }
    },
    {
      title: language('dmcoconfig.targetadt.protocol'),
      dataIndex: 'protocol',
      key: 'protocol',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        if (record?.info?.protocol == 6) {
          return 'TCP'
        } else if (record?.info?.protocol == 17) {
          return 'UDP'
        } else if (record?.info?.protocol == 0) {
          return language('dmcoconfig.targetadt.protocol.all')
        }
      }
    },
    {
      title: language('dmcoconfig.desc'), // 文档没有
      dataIndex: 'desc',
      key: 'desc',
      align: 'left',
      ellipsis: true,
      width: 240,
      render: (text, record, index) => {
        return record?.desc
      }
    },
    {
      title: language('dmcoconfig.from'), // 文档没有
      dataIndex: 'from',
      key: 'from',
      align: 'left',
      ellipsis: true,
      width: 120,
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
      fixed: 'right',
      width: 80,
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
              record.refcnt > 0 ? <LinkTwo theme="outline" size="20" fill={color} strokeWidth={3} style={{ cursor: 'pointer' }} onClick={() => {
                disModal('assoc', record)
              }} /> : <LinkTwo theme="outline" size="20" fill={color} strokeWidth={3} style={{ cursor: 'not-allowed' }} />
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
                <i className="fa fa-recycle revokeIcon" />
              </span>
            </Tooltip>
          </Space>
        )
      }
    }
  ]

  const formRef = useRef()
  const [incID, setIncID] = useState(0);
  const [columns, setColumns] = useState(columnlist);
  const [queryVal, setQueryVal] = useState('');
  const [op, setOp] = useState('');
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const [riskData, setRiskData] = useState([]);
  const [protocolData, setProtocolData] = useState([]);

  const [rowRecord, setRowRecord] = useState([]); // 记录当前信息
  const [modalVal, setModalVal] = useState();

  const module = 'ip_listen';

  /* 页面表格传参区 */
  const components = true;
  const tableKey = 'Ipaudit'
  let rowkey = (record => record.rule_id);
  const apiShowurl = '/cfg.php?controller=confPolicy&action=show';
  const columnvalue = 'ipauditColunmval';
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy', module: module };
  const addButton = true;
  const addTitle = language('project.newbuild');
  const delButton = true;
  const rowSelection = true;

  /* 策略组件传参区 */
  const projectType = 'policy';
  const assocShowurl = '/cfg.php?controller=confPolicy&action=showDevice';
  const syncundoShowurl = '/cfg.php?controller=confDevice&action=showSynclist';
  const syncundoSaveurl = '/cfg.php?controller=confPolicy&action=sync';
  const recordFind = rowRecord;
  const isDefaultCheck = true;

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

  const modMethod = (type) => {
    setModalVal(type);
  }

  const tableTopSearch = () => {
    return [
      <Search allowClear placeholder={language('dmcoconfig.targetadt.ipaudit.searchtext')}
        onSearch={(queryVal) => {
          setQueryVal(queryVal.toLowerCase());
          setIncID(incID + 1);
        }} />
    ]
  }

  useEffect(() => {
    getSelectData();
  }, [])

  const getSelectData = () => {
    post('/cfg.php?controller=confPolicy&action=showData', { module: module }).then((res) => {
      setRiskData(res?.data?.risk);
      setProtocolData(res?.data?.protocol)
      let riskFilter = res?.data?.risk?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let protocolFilter = res?.data?.protocol?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let fromFilter = res?.data?.from?.map(item => ({
        text: item.label,
        value: item.value
      }));
      columnlist.map((item, index) => {
        if (item.dataIndex == 'risk') {
          item.filters = riskFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == 'protocol') {
          item.filters = protocolFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == "from") {
          item.filters = fromFilter;
          item.filterMultiple = false;
        } 
      })
      setColumns([...columnlist]);
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

  const addClick = () => {
    openModal('Y', 'add')
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

  /* 删除接口 */
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

  const modifyFn = (each, op) => {
    let values = { ...each.info };
    values.state = each.state == 'Y' || each.state == true ? true : false;
    values.rule_id = each.rule_id;
    values.desc = each?.desc;
    setTimeout(function () {
      formRef.current.setFieldsValue(values)
    }, 100)
    openModal('Y', op)
  }

  const handleSave = (values) => {
    console.log(values)
    let operateUrl = op == 'add' ? '/cfg.php?controller=confPolicy&action=add' : '/cfg.php?controller=confPolicy&action=set';
    let data = {};
    data.module = module;
    data.rule_id = values.rule_id;
    let state = 'N'
    if (values.state == 'Y' || values.state == true) {
      state = 'Y';
    }
    data.state = state;
    delete values.state;
    data.desc = values.desc;
    delete values.desc;
    data.info = JSON.stringify({...values});
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

  return(<>
    <ProtableModule 
      columns={columns}
      clientHeight={clientHeight}
      apishowurl={apiShowurl}
      searchVal={searchVal}
      rowkey={rowkey}
      searchText={tableTopSearch()}
      incID={incID}
      components={components}
      tableKey={tableKey}
      columnvalue={columnvalue}
      addButton={addButton}
      addTitle={addTitle}
      addClick={addClick}
      delButton={delButton}
      delClick={delClick}
      rowSelection={rowSelection}
    />
    <ModalForm formRef={formRef} {...modalFormLayout} submitTimeout={2000}
      autoFocusFirstInput title={language('dmcoconfig.targetadt.picture.modaltitle')}
      visible={modalStatus} onVisibleChange={setModalStatus} width='520px'
      initialValues={{
        protocol: 6
      }}
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          closeModal()
        }
      }} onFinish={async (values) => {
          handleSave(values)
    }}>
      <ProFormText name='rule_id' hidden />
      <ProFormSwitch name='state' label={language('dmcoconfig.attachck.plicystatus')} checkedChildren={language('project.open')} unCheckedChildren={language('project.close')} />
      <ProFormSelect name='risk' label={language('alarmdt.risk')} options={riskData}  rules={[{
        required: true,
        message: language('project.messageselect')
      }]} />
      <ProFormText label={language('dmcoconfig.targetadt.sip')} name='sip' rules={[
        {
          pattern: regIpList.ipv4.regex,
          message: regIpList.ipv4.alertText,
        },
        {
          required: true,
          message: language('project.mandatory')
        }
      ]} />
      <ProFormText label={language('dmcoconfig.targetadt.sport')} name='sport' rules={[
        {
          pattern: regIpList.singleport.regex,
          message: regIpList.singleport.alertText,
        },
        {
          required: true,
          message: language('project.mandatory')
        }
      ]} />
      <ProFormText label={language('dmcoconfig.targetadt.dip')} name='dip' rules={[
        {
          pattern: regIpList.ipv4.regex,
          message: regIpList.ipv4.alertText,
        },
        {
          required: true,
          message: language('project.mandatory')
        }
      ]} />
      <ProFormText label={language('dmcoconfig.targetadt.dport')} name='dport' rules={[
        {
          pattern: regIpList.singleport.regex,
          message: regIpList.singleport.alertText,
        },
        {
          required: true,
          message: language('project.mandatory')
        }
      ]} />
      <div className='protocolDiv'>
        <ProFormRadio.Group label={language('dmcoconfig.targetadt.protocol')} name='protocol' radioType='button' options={protocolData} fieldProps={{ buttonStyle: "solid" }} />
      </div>
      <ProFormText name='desc' label={language('dmcoconfig.desc')} />
    </ModalForm>
    <PolicyTable
      module={module}
      projectType={projectType}
      ref={sRef}
      modalVal={modalVal}
      assocshowurl={assocShowurl}
      syncundoshowurl={syncundoShowurl}
      recordFind={recordFind}
      syncundosaveurl={syncundoSaveurl}
      setIncID={setIncID}
      incID={incID}
      isDefaultCheck={isDefaultCheck}
    />
  </>)
}

export default Ipaudit

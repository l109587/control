import React, { useRef, useState, useEffect } from 'react'
import { ModalForm, ProCard, ProForm, ProFormText, ProFormSwitch, ProFormSelect, ProFormCheckbox, ProFormTextArea } from '@ant-design/pro-components';
import { Input, Modal, Space, Switch, Tag, Tooltip, message, Popconfirm } from 'antd';
import { LinkTwo, LoadingOne, WorriedFace } from '@icon-park/react';
import { EditFilled, ExclamationCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { TableLayout, PolicyTable } from '@/components';
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
      title: language('dmcoconfig.attachck.malware_name'),
      dataIndex: 'malware_name',
      key: 'malware_name',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        return record?.info?.malware_name
      }
    },
    {
      title: language('dmcoconfig.attachck.malware_type'),
      dataIndex: 'malware_type',
      key: 'malware_type',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        return record?.info?.malware_type
      }
    },
    {
      title: language('dmcoconfig.attachck.md5'),
      dataIndex: 'md5',
      key: 'md5',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        return record?.info?.md5
      }
    },
    {
      title: language('dmcoconfig.attachck.signature'),
      dataIndex: 'signature',
      key: 'signature',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        return record?.info?.signature
      }
    },
    {
      title: language('dmcoconfig.desc'),
      dataIndex: 'desc',
      key: 'desc',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        return record?.desc
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

  const module = 'malware';
  const formRef = useRef();
  const columnvalue = 'malapgColumnvalue';
  const tableKey = 'Malapgtion';
  const [op, setOp] = useState('')
  const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
  const isOptionHide = false;
  const isDefaultCheck = true;
  const apishowurl = '/cfg.php?controller=confPolicy&action=show'; // 页面表格回显接口
  const assocshowurl = '/cfg.php?controller=confPolicy&action=showDevice'; // language('dmcoconfig.refcnt')表格回显接口
  const syncundoshowurl = '/cfg.php?controller=confDevice&action=showSynclist';// 分发撤销回显接口
  const syncundosaveurl = '/cfg.php?controller=confPolicy&action=sync'; // 分发撤销配置接口
  const [queryVal, setQueryVal] = useState();
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy', module: 'malware' };
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
  const projectType = 'policy';
  const [riskData, setRiskData] = useState([]);

  // 表格列
  const [columns, setColumns] = useState(columnlist);

  useEffect(() => {
    getSelectData();
  }, [])

  const getSelectData = () => {
    post('/cfg.php?controller=confPolicy&action=showData', { module: module }).then((res) => {
      setRiskData(res?.data?.risk);
      let riskFilter = res?.data?.risk?.map(item => ({
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
        } else if (item.dataIndex == "from") {
          item.filters = fromFilter;
          item.filterMultiple = false;
        } else {

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
      <Search className='malapSearch' placeholder={language('dmcoconfig.attachack.malapgtion.searchtext')}
        width='260px'
        onSearch={(queryVal) => {
          setQueryVal(queryVal)
          setIncID(incID + 1)
        }} allowClear />
    )
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

  const modMethod = (type) => {
    setModalVal(type);
  }

  const modifyFn = (each, op) => {
    let values = { ...each.info };
    values.rule_id = each.rule_id;
    values.state = each.state == 'Y' || each.state == true ? true : false;
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
    data.module = 'malware';
    data.rule_id = obj.rule_id;
    let state = 'N';
    if (obj.state == 'Y' || obj.state == true) {
      state = 'Y';
    }
    data.state = state;
    delete obj.state;
    data.desc = obj.desc;
    delete obj.desc
    if (!obj.signature) {
      obj.signature = '';
    }
    if (!obj.md5) {
      obj.md5 = '';
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

  return (<>
    <ProtableModule components={true} concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={clientHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowkey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} addTitle={addTitle} />
    <PolicyTable ref={sRef} modalVal={modalVal} recordFind={recordFind} assocshowurl={assocshowurl} syncundoshowurl={syncundoshowurl} setIncID={setIncID} incID={incID} projectType={projectType} isOptionHide={isOptionHide} syncundosaveurl={syncundosaveurl} isDefaultCheck={isDefaultCheck} module={module} />
    <ModalForm formRef={formRef} {...modalFormLayout} submitTimeout={2000}
      autoFocusFirstInput title={language('dmcoconfig.attachack.malapgtion.modaltitle')}
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
      <ProFormSwitch name='state' label={language('dmcoconfig.attachck.plicystatus')}  checkedChildren={language('project.open')} unCheckedChildren={language('project.close')} />
      <ProFormSelect name='risk' label={language('alarmdt.risk')} options={riskData} rules={[{
        required: true,
        message: language('project.messageselect')
      }]} />
      <ProFormText label={language('dmcoconfig.attachck.malware_name')} name='malware_name'  rules={[{
        required: true,
        message: language('project.mandatory')
      }]} />
      <ProFormText label={language('dmcoconfig.attachck.malware_type')} name='malware_type' rules={[{
        required: true,
        message: language('project.mandatory')
      }]} />
      <ProFormText name='md5' label={language('dmcoconfig.attachck.md5')} />
      <ProFormTextArea name='signature' label={language('dmcoconfig.attachck.signature')} />
      <ProFormText name='desc' label={language('dmcoconfig.desc')} />
    </ModalForm>
  </>)
}

export default Malapgtion

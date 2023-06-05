import React, { useRef, useState, useEffect } from 'react'
import { ModalForm, ProCard, ProForm, ProFormText, ProFormSwitch, ProFormSelect, ProFormCheckbox, ProFormTextArea } from '@ant-design/pro-components';
import { Input, Modal, Space, Switch, Tag, Tooltip, message, Popconfirm } from 'antd';
import { LinkTwo, LoadingOne, WorriedFace } from '@icon-park/react';
import { EditFilled, ExclamationCircleOutlined, CheckCircleFilled } from '@ant-design/icons';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { TableLayout, PolicyTable } from '@/components';
import { post } from '@/services/https';
import { Resizable } from 'react-resizable';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;

let H = document.body.clientHeight - 336
var clientHeight = H

const Troation = () => {

  /* 页面表格表头 */
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
          <Tag style={{ marginRight: 0, padding: '0 10px' }} color={color} key={record.risk}>{title}</Tag>
        )
      }
    },
    {
      title: language('dmcoconfig.attachck.trojan_id'),
      dataIndex: 'trojan_id',
      key: 'trojan_id',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        return record?.info?.trojan_id
      }
    },
    {
      title: language('dmcoconfig.attachck.trojan_name'),
      dataIndex: 'trojan_name',
      key: 'trojan_name',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        return record?.info?.trojan_name
      }
    },
    {
      title: language('dmcoconfig.attachck.trojan_type'),
      dataIndex: 'trojan_type',
      key: 'trojan_type',
      align: 'center',
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        let color = 'success';
        let title = language('dmcoconfig.attachck.special_trojan');
        if (record?.info?.trojan_type == 1) {
          color = 'red';
          title = language('dmcoconfig.attachck.special_trojan');
        } else if (record?.info?.trojan_type == 2) {
          color = 'magenta';
          title = language('dmcoconfig.attachck.ordinary_trojan');
        } else if (record?.info?.trojan_type == 3) {
          color = 'purple';
          title = language('dmcoconfig.attachck.remote_trojan');
        } else if (record?.info?.trojan_type == 4) {
          color = 'volcano';
          title = language('dmcoconfig.attachck.other_trojan')
        }
        return (
          <Tag style={{ marginRight: 0, padding: '0 10px' }} color={color} key={record.risk}>{title}</Tag>
        )
      }
    },
    {
      title: language('dmcoconfig.attachck.apply_os'),
      dataIndex: 'os',
      key: 'os',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        return record?.info?.os
      }
    },
    {
      title: language('dmcoconfig.attachck.rule'),
      dataIndex: 'rule',
      key: 'rule',
      align: 'left',
      ellipsis: true,
      width: 160,
      render: (text, record, index) => {
        return record?.info?.rule
      }
    },
    {
      title: language('dmcoconfig.attachck.store_pcap'),
      dataIndex: 'store_pcap',
      key: 'store_pcap',
      align: 'left',
      ellipsis: true,
      width: 80,
      render: (text, record, index) => {
        if (record?.info?.store_pcap == 2) {
          return language('dmcoconfig.no')
        } else if (record?.info?.store_pcap == 1) {
          return language('dmcoconfig.yes')
        }
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
        return record?.info?.desc
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

  const formRef = useRef();
  const columnvalue = 'trojackColumnvalue';
  const tableKey = 'Troation';
  const [op, setOp] = useState('')
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const apishowurl = '/cfg.php?controller=confPolicy&action=show';
  const assocshowurl = '/cfg.php?controller=confPolicy&action=showDevice';
  const syncundoshowurl = '/cfg.php?controller=confDevice&action=showSynclist'; // 分发撤销回显接口
  const syncundosaveurl = '/cfg.php?controller=confPolicy&action=sync';
  const [queryVal, setQueryVal] = useState();
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy', module: 'trojan' };
  const addButton = true;
  const addTitle = language('project.newbuild');
  let rowkey = (record => record.rule_id);
  const delButton = true;
  const rowSelection = true;
  const [rowRecord, setRowRecord] = useState([]); // 记录当前信息
  const [incID, setIncID] = useState(0);
  const [modalVal, setModalVal] = useState(); // 当前点击弹框类型 distrbute | revoke | assocTable
  const recordFind = rowRecord; // 当前行id
  const isOptionHide = false;
  const isDefaultCheck = true;
  const [riskData, setRiskData] = useState([]);
  const [trojtypeData, setTrojtypeData] = useState([]);
  // 表格列
  const [columns, setColumns] = useState(columnlist);
  const module = 'trojan';
  const projectType = 'policy';


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

  useEffect(() => {
    getSelectData();
  }, [])

  const getSelectData = () => {
    post('/cfg.php?controller=confPolicy&action=showData', { module: 'trojan' }).then((res) => {
      setRiskData(res?.data?.risk);
      setTrojtypeData(res?.data?.trojan_type);
      let riskFilter = res?.data?.risk?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let trojtypeFilter = res?.data?.trojan_type?.map(item => ({
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
        } else if (item.dataIndex == "trojan_type") {
          item.filters = trojtypeFilter;
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

  const tableTopSearch = () => {
    return (
      <Search allowClear placeholder={language('dmcoconfig.attachack.troation.searchtext')}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID(incID + 1);
        }} />
    )
  }

  const modMethod = (type) => {
    setModalVal(type);
  }

  const modifyFn = (each, op) => {
    let values = { ...each.info };
    values.state = each.state == 'Y' || each.state == true ? true : false;
    if (values.store_pcap == 2) {
      values.store_pcap = false
    }
    values.rule_id = each.rule_id;
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
    data.module = 'trojan';
    data.rule_id = obj.rule_id;
    let state = 'N';
    if (obj.state == 'Y' || obj.state == true) {
      state = 'Y';
    }
    data.state = state;
    delete obj.state;
    if (!obj.store_pcap) {
      obj.store_pcap = 2;
    } else {
      obj.store_pcap = 1;
    }
    if (!obj.desc) {
      obj.desc = '';
    }
    data.desc = obj.desc;
    if (!obj.os) {
      obj.os = '';
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

  return (<>
    <ProtableModule columns={columns} components={true} apishowurl={apishowurl} incID={incID} clientHeight={clientHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowkey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} addTitle={addTitle} />
    <PolicyTable ref={sRef} modalVal={modalVal} recordFind={recordFind} assocshowurl={assocshowurl} syncundoshowurl={syncundoshowurl} setIncID={setIncID} incID={incID} isOptionHide={isOptionHide} syncundosaveurl={syncundosaveurl} isDefaultCheck={isDefaultCheck} module={module} projectType={projectType} />
    <ModalForm formRef={formRef} {...modalFormLayout} submitTimeout={2000}
      autoFocusFirstInput title={language('dmcoconfig.attachck.trotain.modaltitle')}
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
      <ProFormSwitch name='state' label={language('dmcoconfig.attachck.plicystatus')} checkedChildren={language('project.open')} unCheckedChildren={language('project.close')} />
      <ProFormSelect name='risk' label={language('alarmdt.risk')} options={riskData} rules={[{
        required: true,
        message: language('project.messageselect')
      }]} />
      <ProFormText label={language('dmcoconfig.attachck.trojan_name')} name='trojan_name' rules={[{
        required: true,
        message: language('project.mandatory')
      }]} />
      <ProFormText label={language('dmcoconfig.attachck.trojan_id')} name='trojan_id' rules={[{
        required: true,
        message: language('project.mandatory')
      }]}  />
      <ProFormSelect label={language('dmcoconfig.attachck.trojan_type')} name='trojan_type' options={trojtypeData} rules={[{
        required: true,
        message: language('project.messageselect')
      }]} />
      <ProFormText name='os' label={language('dmcoconfig.attachck.apply_os')} />
      <ProFormCheckbox name='store_pcap' label={language('dmcoconfig.attachck.store_pcap')} >{language('dmcoconfig.attachck.store_pcap.text')}</ProFormCheckbox>
      <ProFormTextArea name='rule' label={language('dmcoconfig.attachck.rule')}  rules={[{
        required: true,
        message: language('project.mandatory')
      }]}  />
      <ProFormText name='desc' label={language('dmcoconfig.desc')} />
    </ModalForm>
  </>)
}

export default Troation

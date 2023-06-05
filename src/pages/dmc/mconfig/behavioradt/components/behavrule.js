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

const Behavrule = () => {

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
      width: 120,
      ellipsis: true,
    },
    {
      title: language('dmcoconfig.behavrule.module'),
      dataIndex: 'module',
      key: 'module',
      align: 'left',
      width: 160,
      ellipsis: true,
      render: (text, record, index) => {
        if (record.module == 'web_filter') {
          return language('dmcoconfig.behavrule.module.web_filter')
        } else {
          return language('dmcoconfig.behavrule.module.dns')
        }
      }
    },
    {
      title: language('dmcoconfig.behavrule.url'),
      dataIndex: 'url',
      key: 'url',
      align: 'left',
      width: 160,
      ellipsis: true,
      render: (text, record, index) => {
        return record?.info?.url
      }
    },
    {
      title: language('dmcoconfig.transmchk.rule_type'),
      dataIndex: 'rule_type',
      key: 'rule_type',
      align: 'center',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => {
        let color
        let title
        if (record?.info?.rule_type == 0) {
          color = 'volcano'
          title = language('dmcoconfig.targetadt.rule_type.noexpress')
        } else {
          color = 'red'
          title = language('dmcoconfig.transmchk.rule_type.regular')
        }
        return (
          <Tag style={{ marginRight: 0, padding: '0 10px' }} color={color} key={record.info.rule_type}>{title}</Tag>
        )
      }
    },
    {
      title: language('dmcoconfig.targetadt.match_type'),
      dataIndex: 'match_type',
      key: 'match_type',
      align: 'center',
      ellipsis: true,
      width: 120,
      render: (text, record, index) => {
        let title
        if (record?.info?.rule_type == 0) {
          title = language('dmcoconfig.targetadt.match_type.child')
        } else if (record?.info?.rule_type == 1) {
          title = language('dmcoconfig.targetadt.match_type.right')
        } else if (record?.info?.rule_type == 2) {
          title = language('dmcoconfig.targetadt.match_type.left')
        } else if (record?.info?.rule_type == 3) {
          title = language('dmcoconfig.targetadt.match_type.all')
        }
        return(<Tag style={{ marginRight: 0, padding: '0 10px' }} color='volcano'>{title}</Tag>)
      }
    },
    {
      title: language('dmcoconfig.desc'),
      dataIndex: 'desc',
      key: 'desc',
      align: 'left',
      ellipsis: true,
      width: 160,
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
      width: 100,
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

  const formRef = useRef();
  const [queryVal, setQueryVal] = useState();
  const [incID, setIncID] = useState(0);
  const [op, setOp] = useState('')
  const [modalStatus, setModalStatus] = useState(false); //model 添加弹框状态
  const [rowRecord, setRowRecord] = useState([]); // 记录当前信息
  const [ruletypeDate, setRuletypeDate] = useState([]);
  const [columns, setColumns] = useState(columnlist);
  const [modalVal, setModalVal] = useState(); // 当前点击弹框类型 distrbute | revoke | assocTable
  const [ruletypeData, setRuletypeData] = useState([]);
  const [matchtypeData, setMatchtypeData] = useState([]);
  const [moduleTypeData, setModuleTypeData] = useState([]);

  const module = 'web_filter,dns_filter';

  /* 页面表格传参区 */
  const components = true;
  const columnvalue = 'behavruleColunmval';
  const tableKey = 'behavrule';
  const apiShowurl = '/cfg.php?controller=confPolicy&action=show';
  let rowkey = (record => record.rule_id);
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy', module: module };
  const addButton = true;
  const addTitle = language('project.newbuild');
  const delButton = true;
  const rowSelection = true;

  const projectType = 'policy';
  const assocShowurl = '/cfg.php?controller=confPolicy&action=showDevice';
  const syncundoShowurl = '/cfg.php?controller=confDevice&action=showSynclist';
  const syncundoSaveurl = '/cfg.php?controller=confPolicy&action=sync';
  const recordFind = rowRecord;
  const isDefaultCheck = true;

  const tableTopSearch = () => {
    return [
      <Search allowClear placeholder={language('dmcoconfig.behavioradt.behavrule.searchtext')}
        onSearch={(queryVal) => {
          setQueryVal(queryVal.toLowerCase());
          setIncID(incID + 1);
      }} />
    ]
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
  
  const modMethod = (type) => {
    setModalVal(type);
  }

  useEffect(() => {
    getSelectData();
  }, [])

  const getSelectData = () => {
    post('/cfg.php?controller=confPolicy&action=showData', { module: module }).then((res) => {
      setModuleTypeData(res?.data?.module);
      setMatchtypeData(res?.data?.match_type);
      setRuletypeData(res?.data?.rule_type);
      let fromFilter = res?.data?.from?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let ruleTypeFilter = res?.data?.rule_type?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let matchTypeFilter = res?.data?.match_type?.map(item => ({
        text: item.label,
        value: item.value
      }));
      let moduleFilter = res?.data?.module?.map(item => ({
        text: item.label,
        value: item.value
      }));
      columnlist.map((item, index) => {
        if (item.dataIndex == "from") {
          item.filters = fromFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == "rule_type") {
          item.filters = ruleTypeFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == "match_type") {
          item.filters = matchTypeFilter;
          item.filterMultiple = false;
        } else if (item.dataIndex == "module") {
          item.filters = moduleFilter;
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

  const modifyFn = (each, op) => {
    let values = { ...each.info };
    values.state = each.state == 'Y' || each.state == true ? true : false;
    values.rule_id = each.rule_id;
    values.desc = each.desc;
    values.module = each.module;
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

  const closeModal = () => {
    formRef.current.resetFields();
    openModal('N');
  }

  const handleSave = (values) => {
    let operateUrl = op == 'add' ? '/cfg.php?controller=confPolicy&action=add' : '/cfg.php?controller=confPolicy&action=set';
    let data = {};
    data.module = values.module;
    data.rule_id = values.rule_id;
    let state = 'N'
    if (values.state == 'Y' || values.state == true) {
      state = 'Y';
    }
    data.state = state;
    delete values.state;
    data.desc = values.desc;
    delete values.desc;
    let info = {};
    if (values.module == 'web_filter') {
      info.url = values.url;
    } else {
      info.dns = values.url;
    }
    info.rule_type = values.rule_type;
    info.match_type = values.match_type;
    data.info = JSON.stringify(info);
    delete values.module;
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

  return (<>
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
    <ModalForm formRef={formRef} {...modalFormLayout} submitTimeout={2000} initialValues={{
      "module" : 'web_filter'
    }} autoFocusFirstInput title={language('dmcoconfig.behavrule.modaltitle')}
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
      <ProFormSelect name='module' label={language('dmcoconfig.behavrule.module')} options={moduleTypeData} rules={[{
        required: true,
        message: language('project.messageselect')
      }]}  />
      <ProFormText label={language('dmcoconfig.behavrule.url')} name='url' rules={[{
        required: true,
        message: language('project.mandatory')
      }]}  />
      <ProFormSelect label={language('dmcoconfig.transmchk.rule_type')} name='rule_type' options={ruletypeData} rules={[{
        required: true,
        message: language('project.messageselect')
      }]}  />
      <ProFormSelect label={language('dmcoconfig.targetadt.match_type')} name='match_type' options={matchtypeData} rules={[{
        required: true,
        message: language('project.messageselect')
      }]}  />
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

export default Behavrule

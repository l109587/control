import React, { useRef, useState, useEffect } from 'react';
import { Modal, Input, message, Tooltip, Space, Popconfirm } from 'antd';
import ProForm, { ModalForm, ProFormText, ProFormRadio } from '@ant-design/pro-form';
import { EditFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { LinkTwo } from '@icon-park/react';
import { post } from '@/services/https';
import { modalFormLayout } from "@/utils/helper";
import { NameText } from '@/utils/fromTypeLabel';
import { language } from '@/utils/language';
import '@/utils/index.less';
import './security.less';
import { regList } from '@/utils/regExp';
import { TableLayout, AmTag, PolicyTable } from '@/components';
const { ProtableModule } = TableLayout;
const { confirm } = Modal;
const { Search } = Input;
let H = document.body.clientHeight - 336
var clientHeight = H
export default (props) => {
  const regTypeList = [
    { text: language('mconfig.nacpolicy.client'), label: language('mconfig.nacpolicy.client'), value: '1' },
    { text: language('mconfig.nacpolicy.web'), label: language('mconfig.nacpolicy.web'), value: '2' },
  ];

  const verifyTypeList = [
    { text: language('mconfig.nacpolicy.donotapprove'), label: language('mconfig.nacpolicy.donotapprove'), value: '1' },
    { text: language('mconfig.nacpolicy.artificial'), label: language('mconfig.nacpolicy.artificial'), value: '3' },
    { text: language('mconfig.nacpolicy.automatic'), label: language('mconfig.nacpolicy.automatic'), value: '2' },
  ];

  const dealTypeList = [
    { text: language('mconfig.nacpolicy.block'), label: language('mconfig.nacpolicy.block'), value: '1' },
    { text: language('mconfig.nacpolicy.giveanalarm'), label: language('mconfig.nacpolicy.giveanalarm'), value: '2' },
  ];

  const columns = [
    {
      title: language('mconfig.nacpolicy.id'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
    },
    {
      title: language('mconfig.nacpolicy.name'),
      dataIndex: 'name',
      align: 'left',
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('mconfig.nacpolicy.registrationmethod'),
      dataIndex: 'regType',
      align: 'center',
      width: 100,
      ellipsis: true,
      filterMultiple: false,
      filters: regTypeList,
      render: (text, record, index) => {
        if (record.regType == '1') {
          return <AmTag color='cyan' style={{ minWidth: '53px' }} name={language('mconfig.nacpolicy.client')} />;
        } else {
          return <AmTag color='volcano' style={{ minWidth: '53px' }} name={language('mconfig.nacpolicy.web')} />;
        }
      },
    },
    {
      title: language('mconfig.nacpolicy.auditmethod'),
      dataIndex: 'verifyType',
      align: 'left',
      ellipsis: true,
      width: 100,
      filterMultiple: false,
      filters: verifyTypeList,
      render: (text, record, index) => {
        if (record.verifyType == '3') {
          return <>{language('mconfig.nacpolicy.artificialexamine')}</>;
        } else if (record.verifyType == '2') {
          return <>{language('mconfig.nacpolicy.automaticexamine')}</>;
        } else {
          return <>{language('mconfig.nacpolicy.donotapprove')}</>;
        }
      },
    },
    {
      title: language('mconfig.nacpolicy.handlingmethod'),
      dataIndex: 'dealType',
      align: 'center',
      ellipsis: true,
      width: 100,
      filterMultiple: false,
      filters: dealTypeList,
      render: (text, record, index) => {
        if (record.dealType == 2) {
          return <AmTag color='#FAAD15' name={language('mconfig.nacpolicy.giveanalarm')} />;
        } else {
          return <AmTag color='#FF0000' name={language('mconfig.nacpolicy.block')} />;
        }
      },
    },
    {
      title: language('mconfig.nacpolicy.downloadaddress'),
      dataIndex: 'agentUrl',
      align: 'left',
      ellipsis: true,
      width: 180,
    },
    {
      title: language('project.mconfig.cfgnum'),
      dataIndex: 'refcnt',
      align: 'left',
      ellipsis: true,
      width: 90,
      render: (text, record, _, action) => {
        return <Space align='left' className='refcntspace'><div>{record.refcnt}</div>
          {record.refcnt >= 1 ? <div
            style={{ marginLeft: '8px' }}
            onClick={() => {
              disModal('assoc', record);
            }}
          ><LinkTwo theme="outline" size="20" fill="#FF7429" strokeWidth={3} /></div> :
            <div style={{ marginLeft: '8px' }}><LinkTwo theme="outline" size="20" fill="#8E8D8D" strokeWidth={3} /></div>
          }
        </Space>
      }
    },
    {
      title: language('project.createTime'),
      dataIndex: 'createTime',
      align: 'left',
      width: 130,
      ellipsis: true,
    },
    {
      title: language('project.updateTime'),
      dataIndex: 'updateTime',
      align: 'left',
      width: 130,
      ellipsis: true,
    },
    {
      disable: true,
      title: language('project.mconfig.operate'),
      align: 'center',
      valueType: 'option',
      fixed: 'right',
      width: 50,
      ellipsis: true,
      render: (text, record, _, action) => [
        <>
          <a key="editable"
            onClick={() => {
              mod(record, 'mod');
            }}>
            <Tooltip title={language('project.deit')} >
              <EditFilled style={{ color: '#0083FF', fontSize: '15px' }} />
            </Tooltip>
          </a>
        </>
      ],
    },
  ];

  const formRef = useRef();
  const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
  const [op, setop] = useState('add');//选中id数组
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [rowRecord, setRowRecord] = useState([]);//记录当前信息

  useEffect(() => {
    setIncID(incID + 1);
  }, [props.incTID])

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
  const [modalVal, setModalVal] = useState();//当前点击弹框类型 distrbute | revoke | assocTable
  const recordFindVal = rowRecord;//当前行id
  const syncundoshowurl = '/cfg.php?controller=device&action=showCfgLinkDev';//同步撤销回显接口
  const syncundosaveurl = '/cfg.php?controller=confregVerify&action=syncpolicy';//同步撤销接口
  const assocshowurl = '/cfg.php?controller=device&action=showCfgLinkDev';//设备列表接口路径
  const cfg_type_type = 'cfgregVerify';//设备列表类型
  const tableKeyVal = 'nregreviewl';//列表唯一key
  const isOptionHide = true;
  const isHandleShow = true;
  const assocType = 1;

  const modMethod = (type) => {
    setModalVal(type);
  }

  /**分发  撤销功能 end  */

  /** table组件 start */
  const rowKey = (record => record.id);//列表唯一值
  const tableHeight = clientHeight;//列表高度
  const tableKey = 'nregreview';//table 定义的key
  const rowSelection = true;//是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const columnvalue = 'nregreviewcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = '/cfg.php?controller=confregVerify&action=showpolicy';//接口路径
  const [queryVal, setQueryVal] = useState();//首个搜索框的值
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy' };//顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    id: { show: false },
    valid_type: { show: false },
    createTime: { show: false },
    updateTime: { show: false },
  }
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language('mconfig.nacpolicy.search')}
        style={{ width: 200 }}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID(incID + 1);
        }}
      />
    )
  }

  //删除弹框
  const delClick = (selectedRowKeys, dataList) => {
    let sum = selectedRowKeys.length;
    confirm({
      className: 'delclickbox',
      icon: <ExclamationCircleOutlined />,
      title: language('project.delconfirm'),
      content: language('project.cancelcon', { sum: sum }),
      onOk() {
        delList(selectedRowKeys, dataList);
      }
    });
  };

  //添加按钮点击触发
  const addClick = () => {
    let initialValue = {};
    initialValue.regType = '1';
    initialValue.verifyType = '1';
    initialValue.dealType = '1';
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValue)
    }, 100);
    getModal(1, 'add');
  }

  /** table组件 end */

  //分发注销气泡框
  const operation = (text, record, op, languagetext) => (
    <Popconfirm onConfirm={() => {
      syncLanList(record, op);
    }}
      title={languagetext}
      okButtonProps={{
        loading: confirmLoading,
      }} okText={language('project.yes')} cancelText={language('project.no')}>
      <a>{text}</a>
    </Popconfirm>
  );

  //判断是否弹出添加model
  const getModal = (status, op) => {
    if (status == 1) {
      setop(op)
      setModalStatus(true);
    } else {
      formRef.current.resetFields();
      setModalStatus(false);
    }
  }

  //关闭弹框
  const closeModal = () => {
    formRef.current.resetFields();
    getModal(2);
  }

  //分发，撤销
  const syncLanList = (record, op) => {
    let data = {};
    data.id = record.id;
    data.op = op;
    post('/cfg.php?controller=confregVerify&action=syncpolicy', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setIncID(incID + 1);
    }).catch(() => {
      console.log('mistake')
    })
  }

  //添加修改接口
  const save = (info) => {
    let data = {};
    data.op = op;
    data.id = info.id;
    data.name = info.name;
    data.regType = info.regType;
    data.verifyType = info.verifyType;
    data.dealType = info.dealType;
    data.agentUrl = info.agentUrl;
    post('/cfg.php?controller=confregVerify&action=setpolicy', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      closeModal();
      setIncID(incID + 1);
    }).catch(() => {
      console.log('mistake')
    })

  }

  //删除数据
  const delList = (selectedRowKeys) => {
    let ids = selectedRowKeys.join(',');
    post('/cfg.php?controller=confregVerify&action=delpolicy', { ids: ids }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setTimeout(() => {
        setIncID(incID + 1);
      }, 2000);
    }).catch(() => {
      console.log('mistake');
    })
  }

  //编辑
  const mod = (obj, op) => {
    let initialValues = obj;
    getModal(1, op);
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues)
    }, 100)
  }
  return (
    <div>
      <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} />
      <ModalForm
        {...modalFormLayout}
        className='nregreviewmodal'
        key='nregreviewmodal'
        onFinish={async (values) => {
          save(values);
        }}
        formRef={formRef}
        title={language('mconfig.nacpolicy.registerauditpolicy')}
        visible={modalStatus}
        autoFocusFirstInput
        modalProps={{
          maskClosable: false,
          onCancel: () => {
            closeModal();
          }
        }}
        onVisibleChange={setModalStatus}
        submitTimeout={2000}>
        <ProFormText name='id' hidden />
        <NameText label={language('mconfig.nacpolicy.policyname')} name='name' required={true} /> 
        <div className='registerbox'>
          <ProFormRadio.Group
            radioType='button'
            name="regType"
            fieldProps={{
              buttonStyle: 'solid'
            }}
            label={language('mconfig.nacpolicy.registrationmethod')}
            initialValue={1}
            options={regTypeList}
          />
        </div>
        <div className='examine'>
          <ProFormRadio.Group
            radioType='button'
            name="verifyType"
            fieldProps={{
              buttonStyle: 'solid'
            }}
            label={language('mconfig.nacpolicy.auditmethod')}
            initialValue={0}
            options={verifyTypeList}
          />
        </div>
        <ProFormRadio.Group
          name="dealType"
          label={language('mconfig.nacpolicy.handlingmethod')}
          options={dealTypeList}
        />
        <ProFormText label={language('mconfig.nacpolicy.downloadaddress')} name='agentUrl' rules={[{ pattern: regList.url.regex, message: regList.url.alertText }]} />
      </ModalForm >

      <PolicyTable ref={sRef} tableKeyVal={tableKeyVal} modalVal={modalVal} recordFind={recordFindVal} assocshowurl={assocshowurl} syncundoshowurl={syncundoshowurl} cfg_type_type={cfg_type_type} setIncID={setIncID} incID={incID} isOptionHide={isOptionHide} isHandleShow={isHandleShow} assocType={assocType} syncundosaveurl={syncundosaveurl} />
    </div>
  );
};

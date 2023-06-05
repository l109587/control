import React, { useRef, useState, useEffect } from 'react';
import { Modal, Input, message, Tooltip, Space, Popconfirm, Alert, Button } from 'antd';
import ProForm, { ModalForm, ProFormText } from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-components';
import { EditFilled, ExclamationCircleOutlined, PlusOutlined, InfoCircleFilled } from '@ant-design/icons';
import { LinkTwo } from '@icon-park/react';
import { post } from '@/services/https';
import { language } from '@/utils/language';
import { regList, regIpList, regPortList } from '@/utils/regExp';
import '@/utils/index.less';
import './authconfig.less';
import { TableLayout, PolicyTable } from '@/components';
const { ProtableModule } = TableLayout;
const { confirm } = Modal;
const { Search } = Input;
let H = document.body.clientHeight - 336
var clientHeight = H
export default (props) => {

  const columnsList = [
    {
      title: language('mconfig.cfgpolicy.id'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
    },
    {
      title: language('mconfig.cfgpolicy.name'),
      dataIndex: 'name',
      align: 'left',
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('mconfig.cfgpolicy.authcontent'),
      dataIndex: 'contentStr',
      width: 320,
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('mconfig.cfgpolicy.equipmentnumber'),
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
      // title: '备注',
      title: language('project.remark'),
      dataIndex: 'notes',
      align: 'left',
      width: 130,
      ellipsis: true,
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

  const [columns, setColumns] = useState(columnsList);
  const formRef = useRef();
  const formRefEdit = useRef();
  const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
  const [op, setop] = useState('add');//操作
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [rowRecord, setRowRecord] = useState([]);//记录当前信息

  const incIDChange = () => {
		setIncID((incID)=> incID + 1);
	}

  useEffect(() => {
    incIDChange();
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
  const syncundosaveurl = '/cfg.php?controller=confSecDomain&action=syncSecDomain';//同步撤销接口
  const assocshowurl = '/cfg.php?controller=device&action=showCfgLinkDev';//设备列表接口路径
  const cfg_type_type = 'cfgSecDomain';//设备列表类型
  const tableKeyVal = 'aauthconfigl';//唯一key
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
  const tableKey = 'aauthconfig';//table 定义的key
  const rowSelection = true;//是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const columnvalue = 'aauthconfigcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = '/cfg.php?controller=confSecDomain&action=showSecDomain';//接口路径
  const [queryVal, setQueryVal] = useState();//首个搜索框的值
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy' };//顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    id: { show: false },
    createTime: { show: false },
    updateTime: { show: false },
  }
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language('mconfig.agtpolicy.security.search')}
        style={{ width: 200 }}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          incIDChange();
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
        delList(selectedRowKeys, dataList)
      }
    });
  };

  //添加按钮点击触发
  const addClick = () => {
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
      setModalStatus(false);
    }
  }

  //关闭弹框
  const closeModal = () => {
    setEditableRowKeys([]);
    setDataList([]);
    getModal(2);
  }

  //分发，撤销
  const syncLanList = (record, op) => {
    let data = {};
    data.id = record.id;
    data.op = op;
    post('/cfg.php?controller=confSecDomain&action=syncSecDomain', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      incIDChange();
    }).catch(() => {
      console.log('mistake')
    }) 
  }

  //添加修改接口
  const save = (info) => {
    if(dataList.length < 1){
      message.error(language('project.mconfig.authcontentnotempty'));
      return false;
    }
    let values = formRef.current.getFieldsValue(true);
    let data = {};
    data.status = values.status == 'Y' || values.status ? 'Y' : 'N';
    data.op = op;
    data.id = values.id;
    data.name = values.name;
    data.content = JSON.stringify(dataList);
    data.notes = values.notes;

    post('/cfg.php?controller=confSecDomain&action=setSecDomain', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      closeModal();
      incIDChange();
    }).catch(() => {
      console.log('mistake')
    })

  }

  //删除数据
  const delList = (selectedRowKeys) => {
    let ids = selectedRowKeys.join(',');
    post('/cfg.php?controller=confSecDomain&action=delSecDomain', { ids: ids }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setTimeout(() => {
        incIDChange();
      }, 2000);

    }).catch(() => {
      console.log('mistake')
    })

  }

  //编辑
  const mod = (values, op) => {
    let data = {};
    data.id = values.id;
    data.status = values.status;
    data.name = values.name;
    setDataList(values.content ? eval("(" + values.content + ")") : []);
    data.notes = values.notes;

    let initialValues = data;
    getModal(1, op);
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues)
    }, 100)
  }

  //添加弹出框内容
  const addColumns = [
    {
      title: 'mconfig.cfgpolicy.id',
      dataIndex: 'id',
      width: '100',
      ellipsis: true,
      hideInTable: true,
      sortOrder: 'descend',
    },
    {
      title: language('mconfig.cfgpolicy.ipaddress'),
      dataIndex: 'addr',
      width: 130,
      ellipsis: true,
      formItemProps: () => {
        return {
          rules: [{
            required: true,
            pattern: regIpList.singleipv4Mask.regex,
            message: regIpList.singleipv4Mask.alertText,
          }
          ],
        };
      },
    },
    {
      title: language('mconfig.cfgpolicy.port'),
      dataIndex: 'port',
      ellipsis: true,
      width: 140,
      formItemProps: {
        rules: [{
          pattern: regPortList.ports.regex,
          message: regPortList.ports.alertText,
        }
        ],
      },
    },
    {
      title: language('mconfig.cfgpolicy.catalogue'),
      dataIndex: 'dir',
      ellipsis: true,
      width: 140,
      formItemProps: () => {
        return {
          rules: [{
            pattern: regList.backslashalpha.regex,
            message: regList.backslashalpha.alertText,
          }
          ],
        };
      },
    },
    {
      title: language('project.operate'),
      valueType: 'option',
      width: 130,
      align: 'center',
      fixed: 'right',
      render: (text, record, _, action) => [
        <><a key="editable" onClick={() => {
          setRecordFind(record);
          action.startEditable?.call(action, record.id);
        }}>
          {language('project.deit')}
        </a>
          <a onClick={() => {
            setDataList(dataList.filter((item) => item.id !== record.id));
          }}>
            {language('project.del')}
          </a>
        </>,
      ],
    },
  ];

  const [editableKeys, setEditableRowKeys] = useState([]);//编辑框id
  const [dataList, setDataList] = useState([]);
  const [recordFind, setRecordFind] = useState(true);//加载

  return (
    <div>
      <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} />

      <ModalForm
        width="702px"
        {...{
          layout: "horizontal",
        }}
        className='caauthconfigmodal'
        key='caauthconfigmodal'
        onFinish={async (values) => {
          save(values);
        }}
        formRef={formRef}
        title={op == 'add' ? language('mconfig.cfgpolicy.accessrights') : language('mconfig.cfgpolicy.accessrights')}
        visible={modalStatus}
        autoFocusFirstInput
        modalProps={{
          maskClosable: false,
          destroyOnClose: true,
          onCancel: () => {
            closeModal();
          }
        }}
        onVisibleChange={setModalStatus}
        submitTimeout={2000}>
        <ProFormText name='id' hidden />
        <Alert style={{ marginLeft: '68px', marginRight: '68px' }} message={<div>
          <InfoCircleFilled style={{ color: '#1990FF' }} /><span style={{ marginLeft: '7px' }}>{language('mconfig.cfgpolicy.ipaddressrequiredsingleipipmaskiprange')}</span>
          <br />
          <span style={{ marginLeft: '20px' }}>{language('mconfig.cfgpolicy.portscanbeoptionalandmutipleportscanbeseparatedbycomma')}</span>
          <br />
          <span style={{ marginLeft: '20px' }}>{language('mconfig.cfgpolicy.directorycanbeoptionalandmuststartwithdirectoriesaresupported')}</span>
        </div>
        } type="info" />
        <EditableProTable
          className='edittablelist'
          // name='content'
          //页面数据信息
          value={dataList}
          onChange={setDataList}
          scroll={{ y: 150 }}
          //单选框选中变化
          rowSelection={false}
          headerTitle={
            <div className='authsearchbox'>
              <ProFormText name='name' label='权限名称' />
              <span style={{ marginLeft: '30px' }}><ProFormText name='notes' label='备注' /></span>
            </div>
          }
          actionRef={formRefEdit}
          rowKey='id'
          bordered={false}
          //边框
          cardBordered={false}
          toolBarRender={() => [
            <Button type="primary" style={{ borderRadius: 5 }} onClick={() => {
              formRefEdit?.current?.addEditRecord?.({
                id: (Math.random() * 1000000).toFixed(0),
              }, { position: 'top' })
            }} icon={<PlusOutlined />}>
              {language('project.add')}
            </Button>
          ]}
          //新增一条
          recordCreatorProps={false}
          columns={addColumns}

          editable={{
            type: 'single',
            editableKeys,
            actionRender: (row, config, defaultDom) => {
              return [
                defaultDom.save,
                defaultDom.cancel,
              ]
            },
            onChange: setEditableRowKeys,
          }} />

      </ModalForm >

      <PolicyTable ref={sRef} tableKeyVal={tableKeyVal} modalVal={modalVal} recordFind={recordFindVal} assocshowurl={assocshowurl} syncundoshowurl={syncundoshowurl} cfg_type_type={cfg_type_type} setIncID={setIncID} incID={incID} isHandleShow={isHandleShow} isOptionHide={isOptionHide} assocType={assocType} syncundosaveurl={syncundosaveurl} />
    </div>
  );
};

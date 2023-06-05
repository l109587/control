import React, { useRef, useState, useEffect } from 'react';
import { Modal, Input, message, Tooltip, Space, Popconfirm, Select, Button, Divider } from 'antd';
import ProForm, { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-components';
import { EditFilled, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { NameText, NotesText } from '@/utils/fromTypeLabel';
import { LinkTwo } from '@icon-park/react';
import { post } from '@/services/https';
import { language } from '@/utils/language';
import { defaultUserSync } from "@/utils/helper";
import store, { set } from 'store';
import '@/utils/index.less';
import './roleauth.less';
import { TableLayout, AmTag, PolicyTable } from '@/components';
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
      title: language('mconfig.cfgpolicy.jurisdiction'),
      dataIndex: 'secDomain',
      width: 120,
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('mconfig.cfgpolicy.member'),
      dataIndex: 'memberStr',
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
  const [secDomainList, setSecDomainList] = useState([]);

  const [totalPage, setTotalPage] = useState(0);//总条数
  const [nowPage, setNowPage] = useState(1);//当前页码
  const limitVal = store.get('pageSize') ? store.get('pageSize') : 10;//默认每页条数

  const showSecDomInfo = () => {
    let data = {};
    post('/cfg.php?controller=confAuthGroup&action=showSecDomInfo', data).then((res) => {
      setSecDomainList(res.data);
    }).catch(() => {
      console.log('mistake')
    })
  }
	const incIDChange = () => {
		setIncID((incID)=> incID + 1);
	}
  useEffect(() => {
    showSecDomInfo();
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
  const syncundosaveurl = '/cfg.php?controller=confAuthGroup&action=syncAuthGroup';//同步撤销接口
  const assocshowurl = '/cfg.php?controller=device&action=showCfgLinkDev';//设备列表接口路径
  const cfg_type_type = 'cfgAuthGroup';//设备列表类型
  const tableKeyVal = 'rasecurityl';//唯一key
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
  const tableKey = 'croleauth';//table 定义的key
  const rowSelection = true;//是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const columnvalue = 'croleauthcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = '/cfg.php?controller=confAuthGroup&action=showAuthGroup';//接口路径
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
      formRef.current.resetFields();
      setModalStatus(false);
    }
  }

  //关闭弹框
  const closeModal = () => {
    setDataList([]);
    setUserList([]);
    setEditDelList([]);
    setEditableRowKeys([])
    getModal(2);
  }

  //分发，撤销
  const syncLanList = (record, op) => {
    let data = {};
    data.id = record.id;
    data.op = op;
    post('/cfg.php?controller=confAuthGroup&action=syncAuthGroup', data).then((res) => {
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
    let values = formRef.current.getFieldsValue(true);
    let data = {};
    data.status = values.status == 'Y' || values.status ? 'Y' : 'N';
    data.op = op;
    data.id = values.id;
    data.name = values.name;
    data.secDomainID = values.secDomainID;
    data.member = JSON.stringify(dataList.concat(editDelList));
    data.notes = values.notes;

    post('/cfg.php?controller=confAuthGroup&action=setAuthGroup', data).then((res) => {
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
    post('/cfg.php?controller=confAuthGroup&action=delAuthGroup', { ids: ids }).then((res) => {
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
    data.secDomainID = values.secDomainID;
    data.member = values.member ? values.member : [];
    setDataList(values.member ? values.member : []);
    data.notes = values.notes;

    let initialValues = data;
    getModal(1, op);
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues)
    }, 100)
  }

  const [userList, setUserList] = useState([]);
  const [userType, setUserType] = useState('');
  const [userValue, setUserValue] = useState();
  const handleSearch = (newValue, type) => {
    if (newValue && userType) {
      let data = {};
      data.name = newValue;
      let url = '/cfg.php?controller=confAuthGroup&action=showZoneInfo';
      if (userType == 'user') {
        url = '/cfg.php?controller=confAuthGroup&action=showUserInfo';
      }
      post(url, data).then((res) => {
        if (res.success) {
          setUserList(res.data);
        }
      }).catch(() => {
        console.log('mistake')
      })
    } else {
      setUserList([]);
    }
  };
  const handleChange = (newValue) => {
    setUserValue(newValue);
  };

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
      title: language('mconfig.cfgpolicy.type'),
      dataIndex: 'type',
      className: 'typebox',
      width: 100,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        user: { text: '用户' },
        group: { text: '部门' }
      },
      renderFormItem: (_, { isEditable }) => {
        return (
          <ProFormSelect
            valueEnum={{
              user: { text: '用户' },
              group: { text: '部门' }
            }}
            width='80px'
            rules={[{ required: true }]}
            onChange={(key) => {
              setUserType(key);
              handleSearch();
            }}
          />
        )
      },
      formItemProps: () => {
        return {
          rules: [{
            required: true,
          }
          ],
        };
      },
    },
    {
      title: language('mconfig.cfgpolicy.member'),
      dataIndex: 'name',
      ellipsis: true,
      width: 150,
      renderFormItem: (_, { isEditable }) => {
        return (
          <Select
            showSearch
            value={userValue}
            style={{ width: 140 }}
            defaultActiveFirstOption={false}
            showArrow={false}
            filterOption={false}
            onSearch={handleSearch}
            onChange={handleChange}
            notFoundContent={null}
            options={userList}
            rules={[{ required: true }]}
          />
        )
      },
      formItemProps: () => {
        return {
          rules: [{
            required: true,
          }
          ],
        };
      },
    },
    {
      title: language('project.operate'),
      valueType: 'option',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (text, record, _, action) => {
        return [
          <><a key="editable" onClick={() => {
            setUserType(record.type);
            if (!record.op) {
              record.op = 'mod';
            }
            action.startEditable?.call(action, record.uid);
          }}>
            {language('project.deit')}
          </a>
            <a onClick={() => {
              if (record.op != 'add') {
                record.op = 'del';
                editDelList.push(record)
                setEditDelList(editDelList);
              }
              setDataList(dataList.filter((item) => item.uid !== record.uid));
            }}>
              {language('project.del')}
            </a>
          </>,
        ]
      }
    },
  ];

  const [editableKeys, setEditableRowKeys] = useState([]);
  const [editDelList, setEditDelList] = useState([]);
  const [columnsHide, setColumnsHide] = useState(store.get('aauthconfigcolumnvalue') ? store.get('aauthconfigcolumnvalue') : {});//设置默认列
  const [dataList, setDataList] = useState([]);

  const editSearch = (value) => {
    let id = formRef.current.getFieldsValue(['id']);
    let data = {};
    data.id = id.id;
    data.name = value;
    post('/cfg.php?controller=confAuthGroup&action=showMemberInfo', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setDataList(res.member);
      setEditDelList([]);
    }).catch(() => {
      console.log('mistake')
    })
  }
  return (
    <div>
      <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} />

      <ModalForm
        width="522px"
        {...defaultUserSync}
        className='croleauthmodal'
        key='croleauthmodal'
        onFinish={async (values) => {
          save(values);
        }}
        formRef={formRef}
        title={op == 'add' ? language('mconfig.cfgpolicy.roleconfig') : language('mconfig.cfgpolicy.roleconfig')}
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
        <NameText name='name' label={language('mconfig.cfgpolicy.rolename')} required={true} />
        <ProFormSelect
          rules={[{ required: true }]}
          options={secDomainList}
          name="secDomainID"
          label={language('mconfig.cfgpolicy.accessrights')}
        />
        <NotesText name="notes" label={language('mconfig.cfgpolicy.notes')} required={false} type={'text'} /> 
        <div className='dividerbox'>
          <Divider orientation='left'>{language('mconfig.cfgpolicy.rolemember')}</Divider>
        </div>
        <div className='roleautheditbox' >
          <EditableProTable
            className='edittablelist'
            // name='member'
            //页面数据信息
            value={dataList}
            onChange={setDataList}
            scroll={{ y: 150 }}
            //单选框选中变化
            rowSelection={false}
            columnsState={{
              value: columnsHide,
              onChange: (value) => {
                setColumnsHide(value);
                store.set('baseconfcolumnvalue', value)
              },
            }}
            rowClassName="rowkey"
            toolbar={op == 'add' ? false : {
              search: {
                onSearch: (value) => {
                  editSearch(value);
                },
              },
            }}
            // toolbar={false}
            headerTitle={false}
            actionRef={formRefEdit}
            rowKey='uid'
            bordered={false}
            //右边密度搜索 功能
            options={true}
            //边框
            cardBordered={false}
            toolBarRender={() => [
              <Button type="primary" style={{ borderRadius: 5 }} onClick={() => {
                setUserList([]);
                setUserType();
                formRefEdit?.current?.addEditRecord?.({
                  uid: (Math.random() * 1000000).toFixed(0),
                  op: 'add',
                }, { position: 'top' })
              }} icon={<PlusOutlined />}>
                {language('project.add')}
              </Button>
            ]}
            //新增一条
            recordCreatorProps={false}
            columns={addColumns}
            dateFormatter="string"
            //分页功能
            pagination={{
              showSizeChanger: true,
              pageSize: limitVal,
              current: nowPage,
              total: totalPage,
              showTotal: total => language('project.page', { total: total }),
              onChange: (page, pageSize) => {
                clearTimeout(window.timer);
                window.timer = setTimeout(function () {
                  setNowPage(page);
                  store.set('pageSize', pageSize)
                }, 100)
              },
            }}
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
        </div>
      </ModalForm >
 
      <PolicyTable ref={sRef} tableKeyVal={tableKeyVal} modalVal={modalVal} recordFind={recordFindVal} assocshowurl={assocshowurl} syncundoshowurl={syncundoshowurl} cfg_type_type={cfg_type_type} setIncID={setIncID} incID={incID} isHandleShow={isHandleShow} isOptionHide={isOptionHide} assocType={assocType} syncundosaveurl={syncundosaveurl} />
    </div>
  );
};

import React, { useRef, useState, useEffect } from 'react';
import { Modal, Input, message, Switch, Tooltip, Space, Popconfirm, TreeSelect } from 'antd';
import ProForm, { ModalForm, ProFormText, ProFormSelect, ProFormSwitch, ProFormRadio } from '@ant-design/pro-form';
import { EditFilled, ExclamationCircleOutlined, MenuOutlined } from '@ant-design/icons';
import { SortableHandle } from 'react-sortable-hoc';
import { LinkTwo } from '@icon-park/react';
import { post } from '@/services/https';
import { defaultUserSync } from "@/utils/helper";
import { NameText } from '@/utils/fromTypeLabel';
import { language } from '@/utils/language';
import '@/utils/index.less';
import './accesscontrol.less';
import { TableLayout, AmTag, PolicyTable } from '@/components';
const { ProtableModule } = TableLayout;
const { confirm } = Modal;
const { Search } = Input;
const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
let H = document.body.clientHeight - 336
var clientHeight = H
export default (props) => {
  const amTag = (color, name) => {
    if (name) {
      return <AmTag color={color} style={{ minWidth: '75px' }} name={name} />;
    }
  }

  const accessModeList = [
    { text: language('mconfig.nacpolicy.terminalobject'), label: language('mconfig.nacpolicy.terminalobject'), value: 'dev' },
    { text: language('mconfig.nacpolicy.roleobject'), label: language('mconfig.nacpolicy.roleobject'), value: 'role' },
  ];

  const actionList = [
    { text: language('mconfig.nacpolicy.allow'), label: language('mconfig.nacpolicy.allow'), value: 'permit' },
    { text: language('mconfig.nacpolicy.refuse'), label: language('mconfig.nacpolicy.refuse'), value: 'drop' },
  ];

  const columns = [
    {
      // title: '配置ID',
      title: language('mconfig.nacpolicy.id'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
    },
    {
      title: language('project.sort'),
      dataIndex: 'sort',
      fixed: 'left',
      width: 60,
      ellipsis: true,
      className: 'drag-visible',
      render: (text, record, index) => {
        return <div><DragHandle /><span style={{ marginLeft: '6px' }}>{record.number}</span></div>;
      },
    },
    {
      title: language('mconfig.nacpolicy.status'),
      dataIndex: 'status',
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      width: 80,
      filters: true,
      filterMultiple: false,
      valueEnum: {
        Y: { text: language('project.open') },
        N: { text: language('project.close') },
      },
      render: (text, record, index) => {
        let disabled = false;
        if (record.from == 'remote') {
          disabled = true;
        }
        let checked = true;
        if (record.status == 'N') {
          checked = false;
        }
        return (<
          Switch checkedChildren={language('project.open')}
          unCheckedChildren={language('project.close')}
          disabled={disabled}
          checked={checked}
          onChange={
            (checked) => {
              statusSave(record, checked);
            }
          }
        />
        )
      },
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
      title: language('mconfig.nacpolicy.executiontype'),
      dataIndex: 'type',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        let color = 'volcano';
        if (record.type == 'dev') {
          color = 'cyan';
        }
        let name = '';
        accessModeList.map((item) => {
          if (item.value == record.type) {
            name = item.label;
          }
        })
        return amTag(color, name);
      },
    },
    {
      title: language('mconfig.nacpolicy.targetofexecution'),
      dataIndex: 'devGroupName',
      align: 'left',
      width: 90,
      ellipsis: true,
    },
    {
      title: language('mconfig.nacpolicy.accessarea'),
      dataIndex: 'areaName',
      align: 'left',
      width: 90,
      ellipsis: true,
    },
    {
      title: language('mconfig.nacpolicy.accessaction'),
      dataIndex: 'visitAction',
      align: 'center',
      ellipsis: true,
      width: 110,
      filterMultiple: false,
      filters: actionList,
      render: (text, record, index) => {
        let color = '#FF0000';
        if (record.visitAction == 'permit') {
          color = '#12C189';
        }
        let name = '';
        actionList.map((item) => {
          if (item.value == record.visitAction) {
            name = item.label;
          }
        })
        return amTag(color, name);
      },
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
      width: 160,
      ellipsis: true,
      render: (text, record, _, action) => [
        <>
          <Tooltip title={language('project.moveup')} >
            <span onClick={record.first ? false : () => {
              priorityadmpolicy(record, 'up')
            }}><i className="fa fa-arrow-circle-up" style={{ color: record.first ? '#88898A' : '#12C189', fontSize: '15px' }} aria-hidden="true"></i>
            </span>
          </Tooltip>
          <Tooltip title={language('project.movedown')} >
            <span onClick={record.last ? false : () => {
              priorityadmpolicy(record, 'down')
            }}><i className="fa fa-arrow-circle-down" style={{ color: record.last ? '#88898A' : '#12C189', fontSize: '15px' }} aria-hidden="true"></i>
            </span>
          </Tooltip>
          <a key="editable"
            onClick={() => {
              mod(record, 'mod');
            }}>
            <Tooltip title={language('project.deit')} >
              <EditFilled style={{ color: '#0083FF', fontSize: '15px' }} />
            </Tooltip>
          </a>
          {operation(<Tooltip title={language('project.distribute')} ><span><i className="ri-mail-send-fill" style={{ color: '#FA561F', fontSize: '15px' }}></i></span></Tooltip>, record, 'distribute', language('project.mconfig.determinedistrbute'))}
          {record.refcnt >= 1 ?
            operation(<Tooltip title={language('project.revoke')} ><span><i className="fa fa-recycle" style={{ color: '#FF0000', fontSize: '15px' }} aria-hidden="true"></i></span></Tooltip>, record, 'revoke', language('project.mconfig.determinerevoke'))
            : <Tooltip title={language('project.revoke')} ><span><i className="fa fa-recycle" style={{ color: '#8E8D8D', fontSize: '15px' }} aria-hidden="true"></i></span></Tooltip>
          }
        </>
      ],
    },
  ];

  const formRef = useRef();
  const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
  const [op, setop] = useState('add');//操作
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [rowRecord, setRowRecord] = useState([]);//记录当前信息
  const [zoneListCopy, setZoneListCopy] = useState([]);
  const [accessListCopy, setAccessListCopy] = useState([]);
  const [visitAreaList, setVisitAreaList] = useState([]);

  const [accessModeType, setAccessModeType] = useState('dev');
  const [areaName, setAreaName] = useState([]);
  const [areaNameID, setAreaNameID] = useState();

  useEffect(() => {
    showAccessPolicyDate();
    getTree();
    setIncID(incID + 1);
  }, [props.incTID])

  const showAccessPolicyDate = (id = '') => {
    let data = {};
    data.id = id
    post('/cfg.php?controller=confAccessPolicy&action=showAccessPolicyDate', data).then((res) => {
      setAccessListCopy(res.agentGroup);
      setVisitAreaList(res.visitArea);
      setAreaName(res.areaName);
      if (res.areaName.length > 0) {
        formRef.current.setFieldsValue({ areaID: res.areaName[0].value })
        setAreaNameID(res.areaName[0].value);
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  //区域数据
  const zoneType = 'all';
  const [treeValue, setTreeValue] = useState();
  const [treeData, setTreeData] = useState([]);
  const [zoneVal, setZoneVal] = useState();//添加区域id

  //区域管理start
  //区域管理 获取默认列表
  const getTree = (id = 1) => {
    let data = {};
    data.id = id;
    data.type = zoneType;
    post('/cfg.php?controller=confZoneManage&action=showZoneTree', data).then((res) => {
      const treeInfoData = [
        {
          id: res.id,
          pId: res.gpid,
          value: res.id,
          title: res.name,
        },
      ]
      setTreeData(treeInfoData);
      setZoneListCopy(treeInfoData)
    }).catch(() => {
      console.log('mistake')
    })
  }

  // 查找父节点的值
  const wirelessVal = (value, parentId = false) => {
    let cValue = [];
    if (!parentId) {
      cValue.push(value)
    }
    treeData.forEach((each, index) => {
      if (each.id == value) {
        if (each.pId != 0) {
          treeData.forEach((item, key) => {
            if (each.pId == item.id) {
              if (item.pId != 0) {
                let wirelessArr = wirelessVal(item.id, 999);
                cValue.push(item.id);
                cValue.push.apply(cValue, wirelessArr);//[1,2,3,4,5]
              } else {
                cValue.push(item.id);
              }
            }
          })
        } else {
          if (parentId) {
            cValue.push(each.id);
          }
        }
      }
    })
    return cValue;
  }

  //下拉列表选中
  const onChangeSelect = (value, label, extra) => {
    let selKye = wirelessVal(value);
    selKye = selKye.reverse();//数组反转
    let selVal = [];//选中内容
    selKye.forEach(i => {
      treeData.forEach((item, key) => {
        if (i == item.value) {
          selVal.push(item.title);
        }
      })
    })
    let selKyeNum = selKye[selKye.length - 1];
    formRef.current.setFieldsValue({ zoneID: selKyeNum })
    setTreeValue(selVal.join('/'));
    setZoneVal(selKyeNum);
    if (accessModeType == 'role') {
      showAccessPolicyDate(value);
    }
  };

  //区域管理下拉处理
  const onLoadData = ({ id, children }) =>
    new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      let info = [];
      let data = {};
      data.id = id;
      data.type = zoneType;
      post('/cfg.php?controller=confZoneManage&action=showZoneTree', data).then((res) => {
        res.children.map((item) => {
          let isLeaf = true;
          if (item.leaf == 'N') {
            isLeaf = false;
          }
          info.push({ id: item.id, title: item.name, isLeaf: isLeaf, pId: item.gpid, value: item.id })
        })
        setTreeData(
          treeData.concat(info),
        );
        setZoneListCopy(
          treeData.concat(info),
        );
        resolve(undefined);
      });
    });
  //区域管理end

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
  const recordFind = rowRecord;//当前行id
  const isDefaultCheck = true;
  const syncundoshowurl = '/cfg.php?controller=device&action=showCfgLinkDev';//同步撤销回显接口
  const syncundosaveurl = '/cfg.php?controller=confAccessPolicy&action=syncAccessPolicy';//同步撤销接口
  const assocshowurl = '/cfg.php?controller=device&action=showCfgLinkDev';//设备列表接口路径
  const cfg_type_type = 'cfgAccess';//设备列表类型
  const tableKeyVal = 'ncaccessd';//列表唯一key
  const isOptionHide = true;
  const assocType = 1;

  const modMethod = (type) => {
    setModalVal(type);
  }

  /**分发  撤销功能 end  */

  /** table组件 start */
  const rowKey = (record => record.id);//列表唯一值
  const checkRowKey = 'id'; //开启拖拽排序 内容拖拽对应列表唯一值 rowKey 对应排序处理接口 dragSort
  const [screenList, setScreenList] = useState({});
  const tableHeight = clientHeight;//列表高度
  const tableKey = 'naaccesscontrol';//table 定义的key
  const rowSelection = true;//是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const columnvalue = 'naaccesscontrolcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = '/cfg.php?controller=confAccessPolicy&action=showAccessPolicy';//接口路径
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
        delList(selectedRowKeys, dataList)
      }
    });
  };

  //添加按钮点击触发
  const addClick = () => {
    setAccessModeType('dev');
    setTreeData(zoneListCopy);
    setTreeData(zoneListCopy);
    let initialValue = [];
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValue)
    }, 100);
    getModal(1, 'add');
  }

  //拖拽功能
  const dragSort = (oldIndex, newIndex, dataList) => {
    let data = {};
    data.id = dataList[oldIndex].id;
    data.number = dataList[oldIndex].number;
    data.endnumber = dataList[newIndex].number;
    post('/cfg.php?controller=confAccessPolicy&action=sortAccessPolicy', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setIncID(incID + 1);
    }).catch(() => {
      console.log('mistake');
    })
  }

  /** table组件 end */

  //顺序变动接口
  const priorityadmpolicy = (record, direction) => {
    let data = {};
    data = { ...searchVal };
    data.id = record.id;
    data.number = record.number;
    data.direction = direction;
    data.filters = screenList;
    post('/cfg.php?controller=confAccessPolicy&action=sortAccessPolicy', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setIncID(incID + 1);
    }).catch(() => {
      console.log('mistake');
    })
  }

  //分发注销气泡框
  const operation = (text, record, op, languagetext) => (
    <Popconfirm onConfirm={() => {
      disModal(op, record);
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
    setAccessModeType('dev');
    setTreeData(zoneListCopy);
    setTreeValue();
    setZoneVal();
    formRef.current.resetFields();
    getModal(2);
  }

  //启用禁用
  const statusSave = (record, checked) => {
    let status = 'N';
    if (checked) {
      status = 'Y';
    }
    let id = record.id;
    post('/cfg.php?controller=confAccessPolicy&action=enableAccessPolicy', { id: id, status: status }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      setIncID(incID + 1);
    }).catch(() => {
      console.log('mistake')
    })
  }

  //添加修改接口
  const save = (info) => {
    let values = formRef.current.getFieldsValue(true);
    let data = {};
    data.op = op;
    data.id = values.id;
    data.status = values.status == 'Y' || values.status == true ? 'Y' : 'N';
    data.name = values.name;
    data.type = values.type;
    data.devGroupID = zoneVal;
    data.areaID = values.areaID;
    data.visitAction = values.visitAction;
    post('/cfg.php?controller=confAccessPolicy&action=setAccessPolicy', data).then((res) => {
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
    post('/cfg.php?controller=confAccessPolicy&action=delAccessPolicy', { ids: ids }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setTimeout(() => {
        setIncID(incID + 1);
      }, 2000);

    }).catch(() => {
      console.log('mistake')
    })

  }

  //编辑
  const mod = (values, op) => {
    let data = {};
    data.id = values.id;
    data.name = values.name;
    setAccessModeType(values.type);
    if (values.type == 'dev') {
      setTreeData(zoneListCopy);
    } else {
      showAccessPolicyDate(values.devGroupID);
      setTreeData(accessListCopy);
    }
    setTreeValue(values.devGroupGpname);
    setZoneVal(values.devGroupID);
    data.type = values.type;
    data.zoneID = values.devGroupID;
    data.status = values.status == 'Y' || values.status == true ? true : false;
    data.areaID = values.areaID;
    data.visitAction = values.visitAction;
    let initialValues = data;
    getModal(1, op);
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues)
    }, 100)
  }
  return (
    <div>
      <ProtableModule checkRowKey={checkRowKey} dragSort={dragSort} setScreenList={setScreenList} concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} />

      <ModalForm
        {...defaultUserSync}
        width='560px'
        className='naaccesscontrolmodal'
        key='naaccesscontrolmodal'
        onFinish={async (values) => {
          save(values);
        }}
        formRef={formRef}
        title={language('mconfig.nacpolicy.accesscontrolpolicy')}
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
        <ProFormSwitch checkedChildren={language('project.open')} unCheckedChildren={language('project.close')}
          name='status' label={language('mconfig.nacpolicy.policystatus')} />
        <NameText label={language('mconfig.nacpolicy.policyname')} name='name' required={true} /> 
        <div className='accessmode'>
          <ProFormRadio.Group
            radioType='button'
            name="type"
            fieldProps={{
              buttonStyle: 'solid'
            }}
            initialValue={'dev'}
            onChange={(key) => {
              setAccessModeType(key.target.value);
              setTreeValue();
              setZoneVal();
              formRef.current.setFieldsValue({ areaID: '' })
              if (key.target.value == 'dev') {
                setTreeData(zoneListCopy);
              } else {
                setTreeData(accessListCopy);
              }
            }}
            label={language('mconfig.nacpolicy.executiontype')}
            options={accessModeList}
          />
        </div>
        <ProFormText name='zoneID'
          rules={[{ required: true, message: language('project.fillin') }]}
          label={language('mconfig.nacpolicy.targetofexecution')}  >
          <TreeSelect
            treeDataSimpleMode
            value={treeValue}
            dropdownStyle={{
              maxHeight: 400,
              overflow: 'auto',
            }}
            placeholder={language('project.select')}
            onChange={onChangeSelect}
            loadData={onLoadData}
            treeData={treeData}
          />
        </ProFormText>
        {accessModeType == 'dev' ?
          <><ProFormSelect
            options={visitAreaList}
            name="areaID"
            label={language('mconfig.nacpolicy.accessarea')}
          />
            <ProFormRadio.Group
              name="visitAction"
              initialValue='permit'
              label={language('mconfig.nacpolicy.exexutionaction')}
              options={actionList}
            /></>
          :
          <>
            <ProFormSelect
              options={areaName}
              initialValue={areaNameID}
              name="areaID"
              disabled={true}
              label={language('mconfig.nacpolicy.accessarea')}
            />
            <ProFormRadio.Group
              name="visitAction"
              label={language('mconfig.nacpolicy.exexutionaction')}
              initialValue='permit'
              options={[
                { text: language('mconfig.nacpolicy.allow'), label: language('mconfig.nacpolicy.allow'), value: 'permit' },
              ]}
            /></>
        }
      </ModalForm >

      <PolicyTable ref={sRef} tableKeyVal={tableKeyVal} modalVal={modalVal} recordFind={recordFind} assocshowurl={assocshowurl} syncundoshowurl={syncundoshowurl} cfg_type_type={cfg_type_type} setIncID={setIncID} incID={incID} isOptionHide={isOptionHide} assocType={assocType} syncundosaveurl={syncundosaveurl} isDefaultCheck={isDefaultCheck} />
    </div>
  );
};

import React, { useRef, useState, useEffect } from 'react';
import { Modal, Input, message, Switch, Tooltip, Space, Popconfirm, TreeSelect } from 'antd';
import ProForm, { ModalForm, ProFormText, ProFormSelect, ProFormSwitch, ProFormCheckbox } from '@ant-design/pro-form';
import { EditFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { LinkTwo } from '@icon-park/react';
import { post } from '@/services/https';
import { modalFormLayout } from "@/utils/helper";
import { language } from '@/utils/language';
import '@/utils/index.less';
import './security.less';
import { TableLayout, AmTag, CircleIcon } from '@/components';
const { ProtableModule } = TableLayout;
const { confirm } = Modal;
const { Search } = Input;
let H = document.body.clientHeight - 336
var clientHeight = H
export default (props) => {
  const amTag = (color, name) => {
    if (name) {
      return <AmTag color={color} style={{ minWidth: '75px' }} name={name} />;
    }
  }
  const columnsList = [
    {
      title: language('mconfig.agtpolicy.id'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
    },
    {
      title: language('mconfig.agtpolicy.status'),
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
      title: language('mconfig.agtpolicy.name'),
      dataIndex: 'name',
      align: 'left',
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('mconfig.agtpolicy.security.targetexecution'),
      dataIndex: 'devgrpName',
      align: 'left',
      width: 90,
      ellipsis: true,
    },
    {
      title: language('mconfig.agtpolicy.security.systemtype'),
      dataIndex: 'systype',
      align: 'center',
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        let color = 'volcano';
        if (record.systypeID == 'other') {
          color = 'cyan';
        }
        return amTag(color, record.systype);
      },
    },
    {
      title: language('mconfig.agtpolicy.security.securityspecification'),
      dataIndex: 'ruleName',
      align: 'left',
      width: 90,
      ellipsis: true,
    },
    {
      title: language('mconfig.agtpolicy.security.securitycycle'),
      dataIndex: 'cycle',
      align: 'left',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        let name = '';
        if (record.cycle == 'only') {
          name = language('mconfig.agtpolicy.one')
        } else if (record.cycle == 'hour') {
          name = language('mconfig.agtpolicy.hour')
        } else if (record.cycle == 'day') {
          name = language('mconfig.agtpolicy.day')
        } else if (record.cycle == 'week') {
          name = language('mconfig.agtpolicy.week')
        } else if (record.cycle == 'month') {
          name = language('mconfig.agtpolicy.month')
        }
        if (name) {
          return <CircleIcon name={name} />;
        }
      },
    },
    {
      title: language('mconfig.agtpolicy.security.popupshow'),
      dataIndex: '',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        if (record.showWinAuto == 'Y' || record.showWinFail == 'Y' || record.showWinSuccess == 'Y') {
          return <AmTag color='#12C189' name={language('mconfig.agtpolicy.security.configured')} />;
        } else {
          return <AmTag color='#D9D9D9' name={language('mconfig.agtpolicy.security.notenabled')} />;
        }
      },
    },
    {
      title: language('mconfig.agtpolicy.security.traymenu'),
      dataIndex: '',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        if (record.showTrayCheckRes == 'Y' || record.showTrayReCheck == 'Y' || record.showTrayRepair == 'Y') {
          return <AmTag color='#12C189' name={language('mconfig.agtpolicy.security.configured')} />;
        } else {
          return <AmTag color='#D9D9D9' name={language('mconfig.agtpolicy.security.notenabled')} />;
        }
      },
    },
    {
      // title: '配置下发的设备数',
      title: language('mconfig.agtpolicy.equipmentnumber'),
      dataIndex: 'refcnt',
      align: 'left',
      ellipsis: true,
      width: 90,
      render: (text, record, _, action) => {
        return <Space align='left' className='refcntspace'><div>{record.refcnt}</div>
          {record.refcnt >= 1 ? <div
            style={{ marginLeft: '8px' }}
            onClick={() => {
              setRowRecord(record);
              getSeeModal(1);
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
      width: 130,
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
          {operation(<Tooltip title={language('project.distribute')} ><span><i className="ri-mail-send-fill" style={{ color: '#FA561F', fontSize: '15px' }}></i></span></Tooltip>, record, 'distribute', language('project.mconfig.determinedistrbute'))}
          {operation(<Tooltip title={language('project.distribute')} ><span><i className="ri-mail-send-fill" style={{ color: '#FA561F', fontSize: '15px' }}></i></span></Tooltip>, record, 'distribute', language('project.mconfig.determinedistrbute'))}
          {record.refcnt >= 1 ?
            operation(<Tooltip title={language('project.revoke')} ><span><i className="fa fa-recycle" style={{ color: '#FF0000', fontSize: '15px' }} aria-hidden="true"></i></span></Tooltip>, record, 'revoke', language('project.mconfig.determinerevoke'))
            : <Tooltip title={language('project.revoke')} ><span><i className="fa fa-recycle" style={{ color: '#8E8D8D', fontSize: '15px' }} aria-hidden="true"></i></span></Tooltip>
          }
        </>
      ],
    },
  ];

  const topListColumns = [
    {
      title: language('project.mconfig.cfnid'),
      dataIndex: 'id',
      align: 'center',
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
      dataIndex: 'state',
      align: 'left',
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.mconfig.time'),
      dataIndex: 'update_time',
      align: 'left',
      ellipsis: true,
      width: 130,
    },
  ];

  //区域数据
  const zoneType = 'all';
  const [treeValue, setTreeValue] = useState();
  const [treeData, setTreeData] = useState([]);
  const [zoneVal, setZoneVal] = useState();//添加区域id

  //区域管理start
  //区域管理 获取默认列表
  const getTree = (id = 1) => {
    // let page = pagestart != ''?pagestart:startVal;
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
      setTreeData(treeInfoData)
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
    setZoneVal(selKyeNum)
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
        resolve(undefined);
      });
    });
  //区域管理end

  const [columns, setColumns] = useState(columnsList);
  const formRef = useRef();
  const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
  const [op, setop] = useState('add');//操作
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [seeModalStatus, setSeeModalStatus] = useState(false);//添加查看框状态
  const [rowRecord, setRowRecord] = useState([]);//记录当前信息
  const [sysTypeList, setSysTypeList] = useState([]);//系统类型
  const [ruleList, setRuleList] = useState([]);

  //获取系统类型
  const showSystypeList = () => {
    post('/cfg.php?controller=confCheckPolicy&action=showSystypeList').then((res) => {
      if (res.success) {
        if (res.sysType?.length > 0) {
          setSysTypeList(res.sysType);
          let info = [];
          res.sysType.map((item) => {
            info.push({ text: item.label, value: item.value });
          })
          let columnsList = columns;
          columnsList.map((item) => {
            if (item.dataIndex == 'systype') {
              item.filters = info;
              item.filterMultiple = false;
            }
          })
          setColumns([...columnsList]);
        }
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  //获取安检规范
  const showRuleNameList = () => {
    post('/cfg.php?controller=confCheckPolicy&action=showRuleNameList').then((res) => {
      if (res.success) {
        if (res.data?.length > 0) {
          setRuleList(res.data);
        }
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  useEffect(() => {
    getTree();
    showRuleNameList();
    showSystypeList();
    setIncID(incID + 1);
  }, [props.incTID])

  /** table组件 start */
  const rowKeyDev = (record => record.id);//列表唯一值
  const tableHeightDev = clientHeight - 259 > 150 ? clientHeight - 259 : 150;//列表高度
  const tableKeyDev = 'asecuritydev';//table 定义的key
  const rowSelectionDev = false;//是否开启多选框
  const addButtonDev = false; //增加按钮  与 addClick 方法 组合使用
  const delButtonDev = false; //删除按钮 与 delClick 方法 组合使用
  const [incIDDev, setIncIDDev] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const columnvalueDev = 'asecuritydevcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const apishowurlDev = '/cfg.php?controller=device&action=showCfgLinkDev';//接口路径
  const [queryValDev, setQueryValDev] = useState();//首个搜索框的值
  let searchValDev = { cfg_inter_id: rowRecord.id, cfg_type_type: 'cfgCheck', queryVal: queryValDev };//顶部搜索框值 传入接口

  //初始默认列
  const concealColumnsDev = {
    id: { show: false },
  }

  /* 顶部左侧搜索框*/
  const tableTopSearchDev = () => {
    return (
      <Search
        placeholder={language('mconfig.agtpolicy.security.eqmsearch')}
        style={{ width: 200 }}
        onSearch={(queryVal) => {
          setQueryValDev(queryVal);
          setIncIDDev(incIDDev + 1);
        }}
      />
    )
  }

  /** table组件 end */

  /** table组件 start */
  const rowKey = (record => record.id);//列表唯一值
  const tableHeight = clientHeight;//列表高度
  const tableKey = 'asecurity';//table 定义的key
  const rowSelection = true;//是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const columnvalue = 'asecuritycolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = '/cfg.php?controller=confCheckPolicy&action=showCheckPolicy';//接口路径
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
    let initialValue = [];
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
    setTreeValue();
    setZoneVal();
    formRef.current.resetFields();
    getModal(2);
  }

  //判断是否弹出添加model
  const getSeeModal = (status) => {
    if (status == 1) {
      setSeeModalStatus(true);
    } else {
      setSeeModalStatus(false);
    }
  }

  //分发，撤销
  const syncLanList = (record, op) => {
    let data = {};
    data.id = record.id;
    data.op = op;
    post('/cfg.php?controller=confCheckPolicy&action=syncCheckPolicy', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setIncID(incID + 1);
    }).catch(() => {
      console.log('mistake')
    })
  }

  //启用禁用
  const statusSave = (record, checked) => {
    let status = 'N';
    if (checked) {
      status = 'Y';
    }
    let id = record.id;
    post('/cfg.php?controller=confCheckPolicy&action=enableCheckPolicy', { id: id, status: status }).then((res) => {
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
    data.status = values.status == 'Y' || values.status ? 'Y' : 'N';
    data.op = op;
    data.id = values.id;
    data.name = values.name;
    data.devgrpID = zoneVal;
    data.systypeID = values.systypeID;
    if (values.systypeID != '0' && values.systypeID) {
      sysTypeList.map((item) => {
        if (item.value == values.systypeID) {
          data.systype = item.label;
        }
      })
    }
    data.ruleID = values.ruleID;
    data.cycle = values.cycle;
    data.showTrayCheckRes = values.traymenu?.indexOf('showTrayCheckRes') >= 0 ? 'Y' : 'N';
    data.showTrayReCheck = values.traymenu?.indexOf('showTrayReCheck') >= 0 ? 'Y' : 'N';
    data.showTrayRepair = values.traymenu?.indexOf('showTrayRepair') >= 0 ? 'Y' : 'N';
    data.showWinAuto = values.elasticshow?.indexOf('showWinAuto') >= 0 ? 'Y' : 'N';
    data.showWinFail = values.elasticshow?.indexOf('showWinFail') >= 0 ? 'Y' : 'N';
    data.showWinSuccess = values.elasticshow?.indexOf('showWinSuccess') >= 0 ? 'Y' : 'N';
    post('/cfg.php?controller=confCheckPolicy&action=setCheckPolicy', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      closeModal()
      setIncID(incID + 1);
    }).catch(() => {
      console.log('mistake')
    })

  }

  //删除数据
  const delList = (selectedRowKeys) => {
    let ids = selectedRowKeys.join(',');
    post('/cfg.php?controller=confCheckPolicy&action=delCheckPolicy', { ids: ids }).then((res) => {
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
    data.status = values.status;
    data.name = values.name;
    setTreeValue(values.fullDevgrpName);
    setZoneVal(values.devgrpID);
    data.zoneID = values.devgrpID;
    data.systypeID = values.systypeID;
    console.log(values.systypeID)
    data.ruleID = values.ruleID;
    data.cycle = values.cycle;
    let traymenuArr = [];
    if (values.showTrayCheckRes == 'Y') {
      traymenuArr.push('showTrayCheckRes');
    }
    if (values.showTrayReCheck == 'Y') {
      traymenuArr.push('showTrayReCheck');
    }
    if (values.showTrayRepair == 'Y') {
      traymenuArr.push('showTrayRepair');
    }
    data.traymenu = traymenuArr;

    let elasticshowArr = [];
    if (values.showWinAuto == 'Y') {
      elasticshowArr.push('showWinAuto');
    }
    if (values.showWinFail == 'Y') {
      elasticshowArr.push('showWinFail');
    }
    if (values.showWinSuccess == 'Y') {
      elasticshowArr.push('showWinSuccess');
    }
    data.elasticshow = elasticshowArr;
    let initialValues = data;
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
        className='asecuritymodal'
        key='asecuritymodal'
        onFinish={async (values) => {
          save(values);
        }}
        formRef={formRef}
        title={op == 'add' ? language('project.add') : language('project.save')}
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
          name='status' label={language('mconfig.agtpolicy.security.policyenable')} />
        <ProFormText label={language('mconfig.agtpolicy.security.policyname')} name='name' rules={[{ required: true, message: language('project.fillin') }]} />
        <ProFormText name='zoneID'
          rules={[{ required: true, message: language('project.fillin') }]}
          label={language('mconfig.agtpolicy.targetofexecution')}  >
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
        <ProFormSelect options={sysTypeList}
          rules={[{ required: true, message: language('project.fillin') }]}
          name="systypeID"
          label={language('mconfig.agtpolicy.security.systemtype')}
        />
        <ProFormSelect options={ruleList}
          rules={[{ required: true, message: language('project.fillin') }]}
          name="ruleID"
          label={language('mconfig.agtpolicy.security.securityspecification')}
        />
        <ProFormSelect
          options={[
            { label: language('mconfig.agtpolicy.security.oneonly'), value: 'only' },
            { label: language('mconfig.agtpolicy.security.onehour'), value: 'hour' },
            { label: language('mconfig.agtpolicy.security.oneday'), value: 'day' },
            { label: language('mconfig.agtpolicy.security.oneweek'), value: 'week' },
            { label: language('mconfig.agtpolicy.security.onemonth'), value: 'month' },
          ]}
          rules={[{ required: true, message: language('project.fillin') }]}
          name="cycle"
          initialValue='only'
          label={language('mconfig.agtpolicy.security.securitycycle')}
        />
        <div className='checkgroupbox'>
          <ProFormCheckbox.Group name="elasticshow"
            label={language('mconfig.agtpolicy.security.popupshow')}
            options={[
              { label: language('mconfig.agtpolicy.security.compliancepopup'), value: 'showWinSuccess' },
              { label: language('mconfig.agtpolicy.security.illegalframe'), value: 'showWinFail' },
              { label: language('mconfig.agtpolicy.security.openbrowser'), value: 'showWinAuto' },
            ]}
          />
          <ProFormCheckbox.Group name="traymenu"
            label={language('mconfig.agtpolicy.security.traymenu')}
            options={[
              { label: language('mconfig.agtpolicy.security.recheck'), value: 'showTrayReCheck' },
              { label: language('mconfig.agtpolicy.security.securitycheckresults'), value: 'showTrayCheckRes' },
              { label: language('mconfig.agtpolicy.security.oneclickrepair'), value: 'showTrayRepair' },
            ]}
          />
        </div>

      </ModalForm >
      <ModalForm
        width='1000px'
        className='aseesecuritymodal'
        formRef={formRef}
        title={language('project.see')}
        visible={seeModalStatus} autoFocusFirstInput
        modalProps={{
          maskClosable: false,
          onCancel: () => {
            getSeeModal(2)
          },
        }}
        onVisibleChange={setSeeModalStatus}
        submitter={false}
        submitTimeout={2000}
      >
        <ProtableModule concealColumns={concealColumnsDev} columns={topListColumns} apishowurl={apishowurlDev} incID={incIDDev} clientHeight={tableHeightDev} columnvalue={columnvalueDev} tableKey={tableKeyDev} searchVal={searchValDev} rowkey={rowKeyDev} delButton={delButtonDev} addButton={addButtonDev} rowSelection={rowSelectionDev} searchText={tableTopSearchDev()} />
      </ModalForm>
    </div>
  );
};

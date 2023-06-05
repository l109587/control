import React, { useRef, useState, useEffect } from 'react';
import { Modal, Input, message, Tabs, Switch, Tooltip, Col, TreeSelect, Space, Popconfirm } from 'antd';
import ProForm, { ModalForm, ProFormText, ProFormDigit, ProFormSelect, ProFormTextArea, ProFormSwitch, ProFormCheckbox, ProFormGroup } from '@ant-design/pro-form';
import { EditFilled, ExclamationCircleOutlined, MessageFilled } from '@ant-design/icons';
import { Me, EqualRatio, LinkTwo, ReplayMusic, Wifi, RotateOne } from '@icon-park/react';
import { post } from '@/services/https';
import { defaultUserSync } from "@/utils/helper";
import { NameText, ContentText } from '@/utils/fromTypeLabel';
import { regList } from '@/utils/regExp';
import { language } from '@/utils/language';
import '@/utils/index.less';
import './authentication.less';
import { TableLayout, AmTag, PolicyTable } from '@/components';
const { ProtableModule } = TableLayout;
const { confirm } = Modal;
const { Search } = Input;
const { TabPane } = Tabs;
let H = document.body.clientHeight - 336
var clientHeight = H
export default (props) => {
  const columns = [
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
      title: language('mconfig.agtpolicy.targetofexecution'),
      dataIndex: 'devgrpName',
      align: 'left',
      width: 90,
      ellipsis: true,
    },
    {
      title: language('mconfig.agtpolicy.typecertification'),
      dataIndex: 'kind',
      align: 'center',
      ellipsis: true,
      width: 110,
      filters: true,
      filterMultiple: false,
      valueEnum: {
        portal: { text: language('mconfig.agtpolicy.portalauthentication') },
        dot1x: { text: language('mconfig.agtpolicy.xauthentication') },
      },
      render: (text, record, index) => {
        if (record.kind == 'portal') {
          return <AmTag color='cyan' style={{ minWidth: '75px' }} name={language('mconfig.agtpolicy.portalauthentication')} />;
        } else {
          return <AmTag color='red' style={{ minWidth: '75px' }} name={language('mconfig.agtpolicy.xauthentication')} />;
        }
      },
    },
    {
      title: language('mconfig.agtpolicy.basicconfig'),
      dataIndex: '',
      align: 'left',
      ellipsis: true,
      width: 180,
      render: (text, record, index) => {
        let colorMessageOutlined = '#8E8D8D';
        if (record.loginBoxUser == 'Y' || record.loginBoxRemember == 'Y' || record.loginBoxAutologin == 'Y' || record.loginBoxForget == 'Y' || record.loginBoxInput == 'Y') {
          colorMessageOutlined = '#12C189';
        }
        let colorMe = '#8E8D8D';
        if (record.showTrayLogin == 'Y' || record.showTrayLogout == 'Y' || record.showTrayAuthRes == 'Y' || record.showTrayModify == 'Y') {
          colorMe = '#12C189';
        }
        let colorReplayMusic = '#8E8D8D';
        if (record.rebootAuth == 'Y' || record.netMReAuth == 'Y') {
          colorReplayMusic = '#12C189';
        }
        let colorEqualRatio = '#8E8D8D';
        if (record.unifyAuthen == 'Y') {
          colorEqualRatio = '#12C189';
        }
        return <div>
          <div style={{ position: 'relative' }}>

            <span style={{ position: 'absolute', top: '-10px' }}>
              <Tooltip title={language('mconfig.agtpolicy.traymenu')} >
                <Me theme="outline" size="20" fill={colorMe} strokeWidth={3} style={{}} />
              </Tooltip>
              <Tooltip title={language('mconfig.agtpolicy.logindisplay')} >
                <MessageFilled size="20" style={{ marginLeft: '8px', fontSize: '19px', position: 'relative', top: '-3px', color: colorMessageOutlined }} />
              </Tooltip>
              <Tooltip title={language('mconfig.agtpolicy.recertification')} >
                <ReplayMusic theme="outline" size="20" fill={colorReplayMusic} strokeWidth={3} style={{ marginLeft: '8px' }} />
              </Tooltip>
              <Tooltip title={language('mconfig.agtpolicy.unifiedauthentication')} >
                <EqualRatio theme="outline" size="20" fill={colorEqualRatio} strokeWidth={3} style={{ marginLeft: '8px' }} />
              </Tooltip>
            </span>
          </div>
        </div>;
      },
    },
    {
      title: language('mconfig.agtpolicy.xconfig'),
      dataIndex: '',
      align: 'left',
      ellipsis: true,
      width: 180,
      render: (text, record, index) => {
        let authName = '';
        let authTitle = '';
        authTypeOptions.map((item) => {
          if (item.value == record.authType) {
            authName = item.title;
            authTitle = item.label;
          }
        })
        let authProtocolName = '';
        let authProtocolTitle = '';
        authProtocolOptions.map((item) => {
          if (item.value == record.authProtocol) {
            authProtocolName = item.title;
            authProtocolTitle = item.label;
          }
        })
        let colorWifi = '#8E8D8D';
        if (record.wireless == 'Y') {
          colorWifi = '#12C189';
        }
        let colorRotateOne = '#8E8D8D';
        if (record.checkInnerDot1x == 'Y') {
          colorRotateOne = '#12C189';
        }
        if (record.kind == 'dot1x') {
          return <div style={{ userSelect: 'none' }}>
            <div style={{ position: 'relative' }}>
              <Tooltip title={authTitle} >
                <div className='circularbox'  >
                  {authName}
                </div>
              </Tooltip>
              <Tooltip title={authProtocolTitle} >
                <div className='circularbox' style={{ marginLeft: '8px' }} >
                  {authProtocolName}
                </div>
              </Tooltip>
              <span style={{ position: 'absolute' }}>
                <Tooltip title={language('mconfig.agtpolicy.accessmode')} >
                  <Wifi theme="outline" size="20" fill={colorWifi} strokeWidth={3} style={{ marginLeft: '8px' }} />
                </Tooltip>
                <Tooltip title={language('mconfig.agtpolicy.environmentaldetection')} >
                  <RotateOne theme="outline" size="20" fill={colorRotateOne} strokeWidth={3} style={{ marginLeft: '8px' }} />
                </Tooltip>
              </span>
            </div>
          </div>;
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
            style={{ marginLeft: '8px', position: 'absolute' }}
            onClick={() => {
              disModal('assoc', record);
            }}
          ><LinkTwo theme="outline" size="20" fill="#FF7429" strokeWidth={3} /></div>
            : <div style={{ marginLeft: '8px', position: 'absolute' }}><LinkTwo theme="outline" size="20" fill="#8E8D8D" strokeWidth={3} /></div>
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
          {record.refcnt >= 1 ?
            operation(<Tooltip title={language('project.revoke')} ><span><i className="fa fa-recycle" style={{ color: '#FF0000', fontSize: '15px' }} aria-hidden="true"></i></span></Tooltip>, record, 'revoke', language('project.mconfig.determinerevoke'))
            : <Tooltip title={language('project.revoke')} ><span><i className="fa fa-recycle" style={{ color: '#8E8D8D', fontSize: '15px' }} aria-hidden="true"></i></span></Tooltip>
          }
        </>
      ],
    },
  ];

  //认证方式
  const authTypeOptions = [
    { label: language('mconfig.agtpolicy.terminalidentificationcertification'), value: 'sid', title: language('mconfig.agtpolicy.mark') },
    { label: language('mconfig.agtpolicy.domainloginauthentication'), value: 'domain', title: language('mconfig.agtpolicy.account') },
    { label: language('mconfig.agtpolicy.systemaccountauthentication'), value: 'sysuser', title: language('mconfig.agtpolicy.field') },
    { label: language('mconfig.agtpolicy.accountpasswordauthentication'), value: 'userpass', title: language('mconfig.agtpolicy.system') },
    { label: language('mconfig.agtpolicy.certificateauthentication'), value: 'cert', title: language('mconfig.agtpolicy.card') },
  ];

  //认证协议
  const authProtocolOptions = [
    { label: 'PEAP', value: 'PEAP', title: 'P' },
    { label: 'TTLS', value: 'TTLS', title: 'T' },
  ];

  const formRef = useRef();
  const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
  const [op, setop] = useState('add');//操作
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [rowRecord, setRowRecord] = useState([]);//记录当前信息
  const [certificateShow, setCertificateShow] = useState(false);
  const [dot1xShow, setDot1xShow] = useState(true);
  const [innerAddrRule, setInnerAddrRule] = useState(false);
  const [wlanssidShow, setWlanssidShow] = useState(false);
  const [activeKey, setActiveKey] = useState('aauth1');

  useEffect(() => {
    getTree();
    setIncID(incID + 1);

  }, [props.incTID])

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
  const syncundosaveurl = '/cfg.php?controller=confDot1xPolicy&action=syncDot1xPolicy';//同步撤销接口
  const assocshowurl = '/cfg.php?controller=device&action=showCfgLinkDev';//设备列表接口路径
  const cfg_type_type = 'cfgDot1x';//设备列表类型
  const tableKeyVal = 'mcauthentication';//列表唯一key
  const isOptionHide = true;
  const assocType = 1;

  const modMethod = (type) => {
    setModalVal(type);
  }

  /**分发  撤销功能 end  */

  /** table组件 start */
  const rowKey = (record => record.id);//列表唯一值
  const tableHeight = clientHeight;//列表高度
  const tableKey = 'aauthenticationdev';//table 定义的key
  const rowSelection = true;//是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const columnvalue = 'aauthenticationcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = '/cfg.php?controller=confDot1xPolicy&action=showDot1xPolicy';//接口路径
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
        placeholder={language('mconfig.agtpolicy.search')}
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
    setActiveKey('portal');
    let showTray = ['showTrayLogin', 'showTrayLogout', 'showTrayAuthRes'];
    let initialValue = { showTray: showTray };
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValue)
    }, 100);
    getModal(1, 'add');
  }

  /** table组件 end */

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
    setTreeValue('');
    setDot1xShow(true);
    setCertificateShow(false);
    setInnerAddrRule(false);
    getModal(2);
  }

  //全部启用禁用
  const statusSaveAll = (status) => {
    post('/cfg.php?controller=confDot1xPolicy&action=enableDot1xPolicyList', { status: status }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
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
    post('/cfg.php?controller=confDot1xPolicy&action=enableDot1xPolicy', { id: id, status: status }).then((res) => {
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
    data.status = values.status == 'Y' || values.status ? 'Y' : 'N';
    data.name = values.name;
    data.devgrpID = zoneVal;
    data.kind = values.kind;
    data.notes = values.notes;
    let baseCFG = {};//基本配置JSON
    baseCFG.loginBoxUser = values.loginArr?.indexOf('loginBoxUser') >= 0 ? 'Y' : 'N';
    baseCFG.loginBoxRemember = values.loginArr?.indexOf('loginBoxRemember') >= 0 ? 'Y' : 'N';
    baseCFG.loginBoxAutologin = values.loginArr?.indexOf('loginBoxAutologin') >= 0 ? 'Y' : 'N';
    baseCFG.loginBoxForget = values.loginBoxForget == 'Y' || values.loginBoxForget ? 'Y' : 'N';
    baseCFG.forgetURL = values.forgetURL ? values.forgetURL : '';
    baseCFG.loginBoxInput = values.loginBoxInput == 'Y' || values.loginBoxInput ? 'Y' : 'N';
    baseCFG.loginBoxTitle = values.loginBoxTitle ? values.loginBoxTitle : '';
    baseCFG.showTrayLogin = values.showTray?.indexOf('showTrayLogin') >= 0 ? 'Y' : 'N';
    baseCFG.showTrayLogout = values.showTray?.indexOf('showTrayLogout') >= 0 ? 'Y' : 'N';
    baseCFG.showTrayAuthRes = values.showTray?.indexOf('showTrayAuthRes') >= 0 ? 'Y' : 'N';
    baseCFG.showTrayModify = values.showTrayModify == 'Y' || values.showTrayModify ? 'Y' : 'N';
    baseCFG.showTrayModifyUrl = values.showTrayModifyUrl ? values.showTrayModifyUrl : '';
    baseCFG.showTrayDesktop = values.showTrayDesktop == 'Y' || values.showTrayDesktop ? 'Y' : 'N';
    baseCFG.showTrayDesktName = values.showTrayDesktName ? values.showTrayDesktName : '';
    baseCFG.rebootAuth = values.newauth?.indexOf('rebootAuth') >= 0 ? 'Y' : 'N';
    baseCFG.netMReAuth = values.newauth?.indexOf('netMReAuth') >= 0 ? 'Y' : 'N';
    baseCFG.idle = values.idle == 'Y' || values.idle ? 'Y' : 'N';
    baseCFG.idleTime = values.idleTime ? values.idleTime : '';
    baseCFG.accExpire = values.accExpire == 'Y' || values.accExpire ? 'Y' : 'N';
    baseCFG.expireTime = values.expireTime ? values.expireTime : '';
    baseCFG.expireClose = values.expireClose == 'Y' || values.expireClose ? 'Y' : 'N';
    baseCFG.tipExpire = values.tipExpire ? values.tipExpire : '';
    baseCFG.unifyAuthen = values.unifyAuthen == 'Y' || values.unifyAuthen ? 'Y' : 'N';
    data.baseCFG = JSON.stringify(baseCFG);
    let dot1xCFG = {};
    dot1xCFG.wireless = values.wireless == 'Y' || values.wireless ? 'Y' : 'N';
    dot1xCFG.wlanssid = values.wlanssid ? values.wlanssid : '';
    dot1xCFG.authType = values.authType ? values.authType : '';
    dot1xCFG.authProtocol = values.authProtocol ? values.authProtocol : '';
    dot1xCFG.prevAuth = values.prevAuth ? values.prevAuth : '';
    dot1xCFG.userencry = values.userencry ? values.userencry : '';
    dot1xCFG.checkInnerDot1x = values.checkInnerDot1x == 'Y' || values.checkInnerDot1x ? 'Y' : 'N';
    dot1xCFG.dot1xCheckMode = values.dot1xCheckMode ? values.dot1xCheckMode : '';
    dot1xCFG.innerAddr = values.innerAddr ? values.innerAddr : '';
    dot1xCFG.prevAuth = values.otherConfig?.indexOf('prevAuth') >= 0 ? 'Y' : 'N';
    dot1xCFG.userencry = values.otherConfig?.indexOf('userencry') >= 0 ? 'Y' : 'N';
    data.dot1xCFG = JSON.stringify(dot1xCFG);
    if (values.authType == 'cert') {
      let setCertCFG = {};//证书配置JSON
      setCertCFG.keyCert = values.keyCert ? values.keyCert : '';
      setCertCFG.secrtKeyType = values.secrtKeyType ? values.secrtKeyType : '';
      setCertCFG.certName = values.certName ? values.certName : '';
      setCertCFG.bothWayCert = values.bothWayCert == 'Y' || values.bothWayCert ? 'Y' : 'N';
      data.setCertCFG = JSON.stringify(setCertCFG);
    }
    post('/cfg.php?controller=confDot1xPolicy&action=setDot1xPolicy', data).then((res) => {
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
    post('/cfg.php?controller=confDot1xPolicy&action=delDot1xPolicy', { ids: ids }).then((res) => {
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
    data.status = values.status == 'Y' || values.status == true ? true : false;
    data.name = values.name;
    setTreeValue(values.fullDevgrpName);
    setZoneVal(values.devgrpID);

    data.zoneID = values.devgrpID;
    data.kind = values.kind;
    setActiveKey(values.kind);
    if (values.kind == 'dot1x') {
      setDot1xShow(false);
    } else {
      setDot1xShow(true);
    }
    data.notes = values.notes;
    let loginArr = [];
    if (values.loginBoxUser == 'Y') {
      loginArr.push('loginBoxUser');
    }
    if (values.loginBoxRemember == 'Y') {
      loginArr.push('loginBoxRemember');
    }
    if (values.loginBoxAutologin == 'Y') {
      loginArr.push('loginBoxAutologin');
    }
    data.loginArr = loginArr;
    data.loginBoxForget = values.loginBoxForget == 'Y' || values.loginBoxForget == true ? true : false;
    data.forgetURL = values.forgetURL;
    data.loginBoxInput = values.loginBoxInput == 'Y' || values.loginBoxInput == true ? true : false;
    data.loginBoxTitle = values.loginBoxTitle;
    let showTray = [];
    if (values.showTrayLogin == 'Y') {
      showTray.push('showTrayLogin');
    }
    if (values.showTrayLogout == 'Y') {
      showTray.push('showTrayLogout');
    }
    if (values.showTrayAuthRes == 'Y') {
      showTray.push('showTrayAuthRes');
    }
    data.showTray = showTray;
    data.showTrayModify = values.showTrayModify == 'Y' || values.showTrayModify == true ? true : false;
    data.showTrayModifyUrl = values.showTrayModifyUrl;
    data.showTrayDesktop = values.showTrayDesktop == 'Y' || values.showTrayDesktop == true ? true : false;
    data.showTrayDesktName = values.showTrayDesktName;
    let newauth = [];
    if (values.rebootAuth == 'Y') {
      newauth.push('rebootAuth');
    }
    if (values.netMReAuth == 'Y') {
      newauth.push('netMReAuth');
    }
    data.newauth = newauth;
    data.idle = values.idle == 'Y' || values.idle == true ? true : false;
    data.idleTime = values.idleTime;
    data.accExpire = values.accExpire == 'Y' || values.accExpire == true ? true : false;
    data.expireTime = values.expireTime;
    data.expireClose = values.expireClose == 'Y' || values.expireClose == true ? true : false;
    data.tipExpire = values.tipExpire;
    data.unifyAuthen = values.unifyAuthen == 'Y' || values.unifyAuthen == true ? true : false;
    data.wireless = values.wireless == 'Y' || values.wireless == true ? true : false;
    data.wlanssid = values.wlanssid;
    if (values.wireless == 'Y' || values.wireless == true) {
      setWlanssidShow(true);
    } else {
      setWlanssidShow(false);
    }
    data.authType = values.authType;
    if (values.authType == 'cert') {
      setCertificateShow(true);
    } else {
      setCertificateShow(false);
    }
    data.authProtocol = values.authProtocol;
    data.prevAuth = values.prevAuth;
    data.userencry = values.userencry;
    data.checkInnerDot1x = values.checkInnerDot1x == 'Y' || values.checkInnerDot1x == true ? true : false;
    data.dot1xCheckMode = values.dot1xCheckMode;
    if (values.dot1xCheckMode == 'ipaddr') {
      setInnerAddrRule(true);
    } else {
      setInnerAddrRule(false);
    }
    data.innerAddr = values.innerAddr;
    let otherConfig = [];
    if (values.prevAuth == 'Y') {
      otherConfig.push('prevAuth');
    }
    if (values.userencry == 'Y') {
      otherConfig.push('userencry');
    }
    data.otherConfig = otherConfig;
    data.keyCert = values.keyCert;
    data.secrtKeyType = values.secrtKeyType;
    data.certName = values.certName;
    data.bothWayCert = values.bothWayCert == 'Y' || values.bothWayCert == true ? true : false;
    getModal(1, op);
    setTimeout(function () {
      formRef.current.setFieldsValue(data)
    }, 100)
  }
  return (
    <div>
      <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} />
      <ModalForm
        {...defaultUserSync}
        width='650px'
        className='aesauthmodal'
        key='aesauthmodal'
        onFinish={async (values) => {
          save(values);
        }}

        formRef={formRef}
        title={op == 'add' ? language('project.add') : language('project.save')}
        visible={modalStatus}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          maskClosable: false,
          onCancel: () => {
            closeModal();
          }
        }}
        onVisibleChange={setModalStatus}
        submitTimeout={2000}>
        <ProFormText name='id' hidden />
        <ProFormSwitch checkedChildren={language('project.open')} unCheckedChildren={language('project.close')}
          name='status' label={language('mconfig.agtpolicy.policystatus')} />
        <NameText label={language('mconfig.agtpolicy.policyname')} name='name' required={true} />
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
        <ProFormSelect
          onChange={(key) => {
            setActiveKey(key);
          }}
          rules={[{ required: true, message: language('project.fillin') }]}
          options={[
            { label: language('mconfig.agtpolicy.portalauthentication'), value: 'portal' },
            { label: language('mconfig.agtpolicy.xauthentication'), value: 'dot1x' },
          ]}
          name="kind"
          label={language('mconfig.agtpolicy.accessauthentication')}
        />
        <div className="usersynctabs" >
          <Tabs type="card" activeKey={activeKey} destroyInactiveTabPane={true} onChange={(key) => {
            setActiveKey(key);
          }} >
            <TabPane tab={language('mconfig.agtpolicy.basicconfiguration')} key="portal" style={{ border: '1px solid #f4f4f4', borderTop: '0px solid' }}>
              <div className='usercontentbox'>
                <ProFormCheckbox.Group name="loginArr"
                  label={language('mconfig.agtpolicy.logindisplay')}
                  options={[
                    { label: language('mconfig.agtpolicy.rememberaccountnumber'), value: 'loginBoxUser' },
                    { label: language('mconfig.agtpolicy.rememberpassword'), value: 'loginBoxRemember' },
                    { label: language('mconfig.agtpolicy.automaticlogon'), value: 'loginBoxAutologin' },
                  ]}
                />
                <Col offset={7}>
                  <Space>
                    <div className='pwdbox' style={{}}>
                      <ProFormCheckbox name='loginBoxForget' />
                      <div style={{ paddingLeft: '8px', lineHeight: '30px', paddingRight: '5px', whiteSpace: 'nowrap' }}>{language('mconfig.agtpolicy.forgotpassword')}</div>
                      <ProFormText placeholder={language('mconfig.agtpolicy.defaultgatewayurladdress')} width='245px' name='forgetURL' rules={[{ pattern: regList.url.regex, message: regList.url.alertText }]} />
                    </div>
                  </Space>
                </Col>
                <Col offset={7}>
                  <Space>
                    <div className='pwdbox' style={{}}>
                      <ProFormCheckbox name='loginBoxInput' />
                      <div style={{ paddingLeft: '8px', lineHeight: '30px', paddingRight: '5px', whiteSpace: 'nowrap' }}>{language('mconfig.agtpolicy.logintitlecustomization')}</div>
                      <ProFormText placeholder={language('mconfig.agtpolicy.defaultgatewayurladdress')} width='206px' name='loginBoxTitle' rules={[{ pattern: regList.url.regex, message: regList.url.alertText }]} />
                    </div>
                  </Space>
                </Col>
                <ProFormCheckbox.Group name="showTray"
                  label={language('mconfig.agtpolicy.traymenu')}
                  options={[
                    { label: language('mconfig.agtpolicy.authenticationlogin'), value: 'showTrayLogin' },
                    { label: language('mconfig.agtpolicy.certificationcancellation'), value: 'showTrayLogout' },
                    { label: language('mconfig.agtpolicy.certificationresults'), value: 'showTrayAuthRes' },
                  ]}
                />
                <Col offset={7}>
                  <Space>
                    <div className='pwdbox' style={{}}>
                      <ProFormCheckbox name='showTrayModify' />
                      <div style={{ paddingLeft: '8px', lineHeight: '30px', paddingRight: '5px', whiteSpace: 'nowrap' }}>{language('mconfig.agtpolicy.changepassword')}</div>
                      <ProFormText placeholder={language('mconfig.agtpolicy.defaultgatewayurladdress')} width='245px' name='showTrayModifyUrl' rules={[{ pattern: regList.url.regex, message: regList.url.alertText }]} />
                    </div>
                  </Space>
                </Col>
                <Col offset={4}>
                  <Space>
                    <div className='flexbox'>
                      <div className='labelbox' style={{whiteSpace: 'nowrap'}}>{language('mconfig.agtpolicy.shortcut')}</div>
                      <ProFormCheckbox name='showTrayDesktop' />
                      <div style={{ lineHeight: '22px', paddingRight: '5px', whiteSpace: 'nowrap' }}>{language('mconfig.agtpolicy.generateauthenticationshortcutdesktop')}</div>
                      <ContentText label={false} placeholder={language('mconfig.agtpolicy.identityauthentication')} width='157px' name='showTrayDesktName' />
                    </div>
                  </Space>
                </Col>
                <ProFormCheckbox.Group name="newauth"
                  label={language('mconfig.agtpolicy.recertification')}
                  options={[
                    { label: language('mconfig.agtpolicy.authenticateafterterminalrestart'), value: 'rebootAuth' },
                    { label: language('mconfig.agtpolicy.authenticateafternetworkrecovery'), value: 'netMReAuth' },
                  ]}
                />
                <Col offset={4}>
                  <Space>
                    <div className='flexbox'>
                      <div className='labelbox'>{language('mconfig.agtpolicy.idlelogout')}</div>
                      <ProFormCheckbox name='idle' />
                      <div style={{ lineHeight: '22px', paddingRight: '5px' }}>{language('mconfig.agtpolicy.free')}</div>
                      <ProFormDigit placeholder={''} width='70px' name='idleTime' min={1} />
                      <div style={{ lineHeight: '22px' }}>{language('mconfig.agtpolicy.autologoutminutes')}</div>
                    </div>
                  </Space>
                </Col>
                <Col offset={4}>
                  <Space>
                    <div className='flexbox'>
                      <div className='labelbox'>{language('mconfig.agtpolicy.expirationreminder')}</div>
                      <ProFormCheckbox name='accExpire' />
                      <div style={{ lineHeight: '22px', paddingRight: '5px' }}>{language('mconfig.agtpolicy.expire')}</div>
                      <ProFormDigit placeholder={''} width='70px' name='expireTime' min={1} />
                      <div style={{ lineHeight: '22px', paddingRight: '5px' }}>{language('mconfig.agtpolicy.reminderstarteddaysago')}</div>
                      <ProFormCheckbox name='expireClose' />
                      <div style={{ lineHeight: '22px', paddingRight: '5px' }}>{language('mconfig.agtpolicy.manuallyclosereminderbox')}</div>
                    </div>
                  </Space>
                </Col>
                <div className='textareabox'>
                  <NameText name="tipExpire" label={language('mconfig.agtpolicy.remindercontent')} />
                </div>
                <Col offset={4}>
                  <Space>
                    <div className='flexbox'>
                      <div className='labelbox'>{language('mconfig.agtpolicy.unifiedauthentication')}</div>
                      <ProFormCheckbox name='unifyAuthen' />
                      <div style={{ lineHeight: '22px', paddingRight: '5px' }}>{language('mconfig.agtpolicy.enableterminalunifieduthenticationlogin')}</div>
                    </div>
                  </Space>
                </Col>
              </div>
            </TabPane>
            <TabPane disabled={dot1xShow} tab={language('mconfig.agtpolicy.xconfiguration')} key="dot1x" style={{ border: '1px solid #f4f4f4', borderTop: '0px solid' }}>
              <div className='usercontentbox'>
                <Col offset={4}>
                  <Space>
                    <div className='flexbox'>
                      <div className='labelbox'>{language('mconfig.agtpolicy.accessmode')}</div>
                      <ProFormCheckbox name='wireless'
                        onChange={(key) => {
                          setWlanssidShow(key.target.checked)
                        }}
                      />
                      <div style={{ lineHeight: '22px', paddingRight: '5px' }}>{language('mconfig.agtpolicy.enablewirelessaccesspleasefillcertifiablessid')}</div>
                    </div>
                  </Space>
                </Col>
                <Col offset={7}>
                  <ProFormText placeholder={''} width='326px' name='wlanssid' rules={wlanssidShow ? [{ required: true, pattern: regList.cnEnAndNumEnsomePuncMore.regex, message: regList.cnEnAndNumEnsomePuncMore.alertText }] : [{ pattern: regList.cnEnAndNumEnsomePuncMore.regex, message: regList.cnEnAndNumEnsomePuncMore.alertText }]} />
                </Col>
                <ProFormSelect
                  onChange={(key) => {
                    if (key == 'cert') {
                      setCertificateShow(true);
                    } else {
                      setCertificateShow(false);
                    }
                  }}
                  options={authTypeOptions}
                  initialValue='sid'
                  width='326px'
                  name="authType"
                  rules={[{ required: true, message: language('project.fillin') }]}
                  label={language('mconfig.agtpolicy.authenticationmode')}
                />
                <Col offset={7}>
                  {certificateShow ?
                    <div className='certificatetext'>
                      <ProFormGroup style={{ width: '326px', height: '65px' }}>
                        <ProFormSelect
                          options={[
                            { label: language('mconfig.agtpolicy.computerlocalcert'), value: '1' },
                            { label: language('mconfig.agtpolicy.clientowncerificate'), value: '2' },
                            { label: language('mconfig.agtpolicy.koal'), value: '3' },
                            { label: language('mconfig.agtpolicy.bjca'), value: '4' },
                          ]}
                          width='156px'
                          name="keyCert"
                          label={language('mconfig.agtpolicy.certificatetype')}
                        />
                        <div style={{ paddingLeft: '10px' }}>
                          <ProFormSelect
                            options={[
                              { label: 'SM2', value: '2' },
                              { label: 'RSA', value: '1' },
                            ]}
                            width='156px'
                            name="secrtKeyType"
                            label={language('mconfig.agtpolicy.keytype')}
                          />
                        </div>
                      </ProFormGroup>
                      <ProFormText placeholder={language('mconfig.agtpolicy.certificateissuer')} width='326px' name='certName' label={language('mconfig.agtpolicy.certificateissuer')} />
                      <div className='pwdbox'>
                        <ProFormCheckbox name='bothWayCert' />
                        <div style={{ lineHeight: '30px', paddingLeft: '5px' }}>{language('mconfig.agtpolicy.enabletwo-wayauthenticationtoverifytheservercertificate')}</div>
                      </div>
                    </div>
                    : ''}
                </Col>
                <ProFormSelect
                  options={authProtocolOptions}
                  width='326px'
                  name="authProtocol"
                  initialValue='PEAP'
                  rules={[{ required: true, message: language('project.fillin') }]}
                  label={language('mconfig.agtpolicy.authenticationprotocol')}
                />
                <Col offset={4}>
                  <Space>
                    <div className='flexbox'>
                      <div className='labelbox'>{language('mconfig.agtpolicy.environmentaldetection')}</div>
                      <ProFormCheckbox name='checkInnerDot1x' />
                      <div style={{ lineHeight: '22px' }}>{language('mconfig.agtpolicy.enableintranetdetection')}</div>
                      <ProFormSelect style={{ marginLeft: '5px', width: '222px' }}
                        onChange={(key) => {
                          if (key == 'ipaddr') {
                            setInnerAddrRule(true);
                          } else {
                            setInnerAddrRule(false);
                          }
                        }}
                        name='dot1xCheckMode'
                        options={[
                          { label: language('mconfig.agtpolicy.usedefaultgatw'), value: 'default-gw' },
                          { label: language('mconfig.agtpolicy.useipaddr'), value: 'ipaddr' },
                        ]}
                      />
                    </div>
                  </Space>
                </Col>
                <ProFormText label={language('mconfig.agtpolicy.probeaddress')} width='326px' name='innerAddr' rules={innerAddrRule ? [{ required: true, pattern: regList.url.regex, message: regList.url.alertText }] : [{ pattern: regList.url.regex, message: regList.url.alertText }]} />
                <ProFormCheckbox.Group name="otherConfig"
                  label={language('mconfig.agtpolicy.otherconfigurations')}
                  options={[
                    { label: language('mconfig.agtpolicy.allowauthenticationbeforesystemlogin'), value: 'prevAuth' },
                    { label: language('mconfig.agtpolicy.encrypttheusername'), value: 'userencry' },
                  ]}
                />
              </div>
            </TabPane>
          </Tabs>
        </div >
      </ModalForm >
      <PolicyTable ref={sRef} tableKeyVal={tableKeyVal} modalVal={modalVal} recordFind={recordFind} assocshowurl={assocshowurl} syncundoshowurl={syncundoshowurl} cfg_type_type={cfg_type_type} setIncID={setIncID} incID={incID} isOptionHide={isOptionHide} assocType={assocType} syncundosaveurl={syncundosaveurl} isDefaultCheck={isDefaultCheck} />
    </div>
  );
};

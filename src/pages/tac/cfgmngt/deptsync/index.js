import React, { useRef, useState, useEffect } from 'react';
import { ExclamationCircleOutlined, TagOutlined, LoadingOutlined } from '@ant-design/icons';
import { BranchOne } from '@icon-park/react';
import { Modal, Input, Tag, Tabs, Switch, Tooltip, Col, Button, Space, Spin } from 'antd';
import { ModalForm, ProForm, ProFormText, ProFormSelect, ProFormSwitch, ProFormCheckbox, ProFormRadio, ProFormDigit } from '@ant-design/pro-components';
import { post, get } from '@/services/https';
import { msg } from '@/utils/fun';
import { language } from '@/utils/language';
import { NameText, NotesText } from '@/utils/fromTypeLabel';
import { regIpList, regMacList, regCustomList, regList } from '@/utils/regExp';
import { userSync, defaultUserSync } from "@/utils/helper";
import Uploadd from '@/utils/Upload';
import '@/utils/box.less';
import './usersync.less';
import { TableLayout } from '@/components';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { TabPane } = Tabs;
let H = document.body.clientHeight - 443;
var clientHeight = H;

export default () => {
  const columns = [
    {
      title: language('project.cfgmngt.deptsync.id'),
      dataIndex: 'id',
      width: 80,
      align: 'center',
    },
    {
      title: language('project.cfgmngt.deptsync.state'),
      width: 80,
      dataIndex: 'status',
      ellipsis: true,
      align: 'center',
      render: (text, record, index) => {
        let disabled = false;
        let checked = true;
        if (record.status == 'N') {
          checked = false;
        }
        return (<
          Switch checkedChildren={language('project.enable')}
          unCheckedChildren={language('project.disable')}
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
      title: language('project.cfgmngt.deptsync.name'),
      width: 100,
      ellipsis: true,
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: language('project.cfgmngt.deptsync.type'),
      width: 100,
      ellipsis: true,
      dataIndex: 'kindName',
      align: 'center',
      render: (test, record, index) => {
        let color = '#2E9AFF';
        let text = record.kindName;
        return (
          <div className='liststatus'>
            <Tag style={{ marginRight: '0px' }} color={color} key={record.orderState}>
              {text}
            </Tag>
          </div>
        )
      }
    },
    {
      title: language('project.cfgmngt.deptsync.address'),
      width: 100,
      ellipsis: true,
      dataIndex: 'addr',
      align: 'left',
    },
    {
      title: language('project.cfgmngt.deptsync.port'),
      width: 70,
      ellipsis: true,
      dataIndex: 'port',
      align: 'left',
    },
    {
      title: language('project.cfgmngt.deptsync.ssl'),
      width: 80,
      ellipsis: true,
      dataIndex: 'ssl',
      align: 'center',
      render: (text, record, index) => {
        let color = 'success';
        let name = language('project.openstart');
        if (record.ssl == 'N') {
          color = 'default';
          name = language('project.shutclose');
        }
        return (
          <Tag style={{ marginRight: '0px' }} color={color} key={record.onstate}>
            {name}
          </Tag>
        )
      }
    },
    {
      title: language('project.cfgmngt.deptsync.syncaccount'),
      width: 100,
      ellipsis: true,
      dataIndex: 'syncAcc',
      align: 'left',
    },
    {
      title: language('project.cfgmngt.deptsync.basedn'),
      width: 80,
      ellipsis: true,
      dataIndex: 'baseDN',
      align: 'left',
    },
    {
      title: language('project.cfgmngt.deptsync.autosync'),
      width: 80,
      ellipsis: true,
      dataIndex: 'autoSync',
      align: 'center',
      render: (text, record, index) => {
        let color = 'success';
        let name = language('project.openstart');
        if (record.autoSync == 'N') {
          color = 'default';
          name = language('project.shutclose');
        }
        return (
          <Tag style={{ marginRight: '0px' }} color={color} key={record.onstate}>
            {name}
          </Tag>
        )
      }
    },
    {
      title: language('project.cfgmngt.deptsync.syncfilterproperties'),
      width: 140,
      ellipsis: true,
      dataIndex: 'swport',
      align: 'center',
      render: (text, record, index) => {
        return (
          <div className='usyncfilterbox'>
            {record.usFilter ? <Tooltip title={record.usFilter} placement='top'><span><i className="ri-user-search-line" style={{ color: '#12C189', fontSize: '22px', marginLeft: '5px' }} /></span></Tooltip> : <i className="ri-router-fill" style={{ fontSize: '22px', marginLeft: '5px' }} />}
            {record.ouFilter ? <Tooltip title={record.ouFilter} placement='top'><BranchOne style={{ color: '#12C189', fontSize: '22px', marginLeft: '5px' }} /></Tooltip> : <BranchOne style={{ fontSize: '22px', marginLeft: '5px' }} />}
            {record.sgFilter ? <Tooltip title={record.sgFilter} placement='top'><span><i className="ri-shield-user-line" style={{ color: '#12C189', fontSize: '22px', marginLeft: '5px' }} /></span></Tooltip> : <i className="ri-router-fill" style={{ fontSize: '22px', marginLeft: '5px' }} />}
            {record.customFilter ? <Tooltip title={record.customFilter} placement='top'> <TagOutlined style={{ color: '#12C189', fontSize: '22px', marginLeft: '5px', lineHeight: '35px', position: 'relative', top: '-2px' }} /></Tooltip> : <TagOutlined style={{ fontSize: '22px', marginLeft: '5px', lineHeight: '35px', position: 'relative', top: '-2px' }} />}
          </div>
        )
      },
    },
    {
      title: language('project.cfgmngt.deptsync.lastsynctime'),
      width: 120,
      ellipsis: true,
      dataIndex: 'syncLastTime',
      align: 'left',
    },
    {
      title: language('project.cfgmngt.deptsync.remark'),
      width: 120,
      ellipsis: true,
      dataIndex: 'note',
      align: 'left',
    },
    {
      disable: true,
      title: language('project.operate'),
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
            {language('project.deit')}
          </a>
          <a key="sync"
            onClick={() => {
              syncMod(record);
            }}>
            {language('project.cfgmngt.deptsync.sync')}
          </a>
        </>
      ],
    },
  ]

  const validatorFn = (value, callback) => {
    if (value) {
      let reg = regList.onlyChAndHanMult.regex;
      let values = value.split(';');
      if (values[values.length - 1] == '') {
        values.pop();
      }
      if (values && values.length > 5) {
        callback(language('project.listlimit5'))
      }
      let isCheck = []
      values.map((item, index) => {
        if (item) {
          isCheck.push(reg.test(item))
        }
      })
      if (isCheck.indexOf(false) != -1) {
        callback(regList.onlyChAndHanMult.alertText)
      } else {
        callback()
      }
    } else {
      callback()
    }
  }

  const formRef = useRef();
  const syncFormRef = useRef();
  const [pageLoading, setPageLoading] = useState(false);//页面加载状态
  const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
  const [syncModalStatus, setSyncModalStatus] = useState(false);//model 添加弹框状态
  const [syncAttrDefault, setSyncAttrDefault] = useState([]);
  const [syncFilterDefault, setSyncFilterDefault] = useState([]);
  const [op, setop] = useState('add');//选中状态
  const { confirm } = Modal;
  const [certUpload, setCertUpload] = useState(true);//是否可以上传证书
  const [serviceType, setServiceType] = useState([]);//服务类型
  const [userAttribute, setUserAttribute] = useState([]);//用户属性
  const [userAttrVal, setUserAttrVal] = useState([]);//用户属性默认值
  const loginMode = [
    {
      value: 'single',
      label: language('project.cfgmngt.deptsync.allusersaresinglesignon')
    },
    {
      value: 'multi',
      label: language('project.cfgmngt.deptsync.alluserusedismultisignon')
    },
    {
      value: 'sgroup',
      label: language('project.cfgmngt.deptsync.specifythesecuritygroupasmultisignon')
    },
  ]
  const timeput = [];
  for (let i = 0; i <= 23; i++) {
    let obj = {}
    obj.value = i;
    obj.label = i > 9 ? i + ':00' : '0' + i + ':00';
    timeput.push(obj)
  }

  const [certID, setCertID] = useState();//返回上传id
  const fileList = [];  //接口参数
  const uploadConfig = {
    accept: 'csv', //接受上传的文件类型：zip、pdf、excel、image
    max: 100000000000000, //限制上传文件大小
    url: '/cfg.php?controller=userSync&action=uploadCert',
  }

  /** table组件 start */
  const rowKey = (record => record.id);//列表唯一值
  const tableHeight = clientHeight;//列表高度
  const tableKey = 'usersync';//table 定义的key
  const rowSelection = true;//是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const columnvalue = 'usersynccolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = '/cfg.php?controller=userSync&action=showUserSync';//接口路径
  const [queryVal, setQueryVal] = useState();//首个搜索框的值
  let searchVal = { value: queryVal, type: 'fuzzy' };//顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    id: { show: false },
  }
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language('project.cfgmngt.deptsync.search')}
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
      className: 'addrplanbox',
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
    let data = {};
    data.textAttr = syncAttrDefault.textAttr;
    data.noteAttr = syncAttrDefault.noteAttr;
    data.mailAttr = syncAttrDefault.mailAttr;
    data.teleAttr = syncAttrDefault.teleAttr;
    data.pwdsetAttr = syncAttrDefault.pwdsetAttr;
    data.usFilter = syncFilterDefault.usFilter;
    data.ouFilter = syncFilterDefault.ouFilter;
    data.sgFilter = syncFilterDefault.sgFilter;
    data.sgField = syncFilterDefault.sgField;
    data.userAttr = userAttrVal;
    console.log(data)
    setTimeout(() => {
      formRef.current.setFieldsValue(data)
    }, 100);
    getModal(1, 'add');
  }


  /** table组件 end */

  //删除功能
  const delList = (selectedRowKeys) => {
    let data = {};
    data.ids = selectedRowKeys.join(',');
    post('/cfg.php?controller=userSync&action=delUserSync', data).then((res) => {
      if (!res.success) {
        msg(res);
        return false;
      }
      setIncID(incID + 1);
      msg(res);
    }).catch(() => {
      console.log('mistake')
    })
  }

  //弹出编辑model
  const getModal = (status, op) => {
    setop(op);
    if (status == 1) {
      setModalStatus(true);
    } else {
      setModalStatus(false);
    }
  }

  //关闭弹框
  const closeModal = () => {
    formRef.current.resetFields();
    getModal(2);
  }

  //编辑弹框
  const mod = (record) => {
    let data = {};
    data.id = record.id;
    data.status = record.status == 'Y' || record.status == true ? true : false;
    data.name = record.name;
    data.note = record.note;
    data.addr = record.addr;
    data.kind = record.kind;
    data.port = record.port;
    data.ssl = record.ssl == 'Y' ? ['ssl'] : [];
    data.cert = record.cert == 'Y' ? ['cert'] : [];
    data.certName = record.certName;
    data.certIssuer = record.certIssuer;
    data.syncAcc = record.syncAcc;
    data.syncPwd = record.syncPwd;
    data.baseDN = record.baseDN;
    data.autoSync = record.autoSync == 'Y' ? true : false;
    data.syncTime = record.syncTime;
    data.userAttr = record.userAttr;
    data.textAttr = record.textAttr;
    data.noteAttr = record.noteAttr;
    data.mailAttr = record.mailAttr;
    data.teleAttr = record.teleAttr;
    data.pwdsetAttr = record.pwdsetAttr;
    data.usFilter = record.usFilter;
    data.ouFilter = record.ouFilter;
    data.sgFilter = record.sgFilter;
    data.sgField = record.sgField;
    data.customFilter = record.customFilter;
    data.usState = record.usState;
    data.cover = record.cover;
    data.loginMode = record.loginMode;
    data.loginReplace = record.loginReplace == 'Y' ? ['loginReplace'] : [];
    data.loginNum = record.loginNum;
    data.loginModeName = record.loginModeName;
    data.syncLocal = record.syncLocal == 'Y' ? ['syncLocal'] : [];
    data.initPWD = record.initPWD;
    setTimeout(() => {
      formRef.current.setFieldsValue(data)
    }, 100);
    getModal(1, 'mod')
  }

  //修改
  const save = (value) => {
    let values = formRef.current.getFieldsValue(true);
    let data = {};
    data.op = op;
    data.id = values.id;
    data.certID = certID;
    data.status = values.status == 'Y' || values.status ? 'Y' : 'N';
    data.name = values.name;
    data.kind = values.kind;
    data.note = values.note;
    let baseCFG = {};//基本配置JSON
    baseCFG.addr = values.addr;
    baseCFG.port = values.port;
    baseCFG.ssl = values.ssl?.length > 0 ? 'Y' : 'N';
    baseCFG.cert = values.cert?.length > 0 ? 'Y' : 'N';
    baseCFG.certName = values.certName;
    baseCFG.certIssuer = values.certIssuer;
    baseCFG.syncAcc = values.syncAcc;
    baseCFG.syncPwd = values.syncPwd;
    baseCFG.baseDN = values.baseDN;
    data.baseCFG = JSON.stringify(baseCFG);
    let syncCFG = {};//同步配置JSON
    syncCFG.autoSync = values?.autoSync ? 'Y' : 'N';
    syncCFG.syncTime = values.syncTime;
    syncCFG.userAttr = values.userAttr;
    syncCFG.textAttr = values.textAttr;
    syncCFG.noteAttr = values.noteAttr;
    syncCFG.mailAttr = values.mailAttr;
    syncCFG.teleAttr = values.teleAttr;
    syncCFG.pwdsetAttr = values.pwdsetAttr;
    data.syncCFG = JSON.stringify(syncCFG);
    let filterCFG = {};//同步过滤JSON
    filterCFG.usFilter = values.usFilter;
    filterCFG.ouFilter = values.ouFilter;
    filterCFG.sgFilter = values.sgFilter;
    filterCFG.sgField = values.sgField;
    filterCFG.customFilter = values.customFilter;
    data.filterCFG = JSON.stringify(filterCFG);
    let optionCFG = {};//用户选项JSON
    optionCFG.usState = values.usState ? values.usState : '';
    optionCFG.cover = values.cover ? values.cover : '';
    optionCFG.loginMode = values.loginMode ? values.loginMode : '';
    optionCFG.loginReplace = values.loginReplace?.length > 0 ? 'Y' : 'N';
    optionCFG.loginNum = values.loginNum ? values.loginNum : '';
    optionCFG.loginModeName = values.loginModeName ? values.loginModeName : '';
    optionCFG.syncLocal = values.syncLocal?.length > 0 ? 'Y' : 'N';
    optionCFG.initPWD = values.initPWD ? values.initPWD : '';
    data.optionCFG = JSON.stringify(optionCFG);

    post('/cfg.php?controller=userSync&action=setUserSync', data).then((res) => {
      if (!res.success) {
        msg(res);
        return false;
      }
      msg(res);//提示框
      closeModal();//关闭modal弹框
      setIncID(incID + 1);
    }).catch(() => {
      console.log('mistake')
    })
  }

  //同步功能
  const sync = (record, opcode = 'sync') => {
    let data = {};
    data.id = record.id;
    data.name = record.name;
    data.opcode = opcode;
    data.refresh = record.refresh?.length > 0 ? 'Y' : 'N';
    post('/cfg.php?controller=userSync&action=syncUserInfo', data).then((res) => {
      if (!res.success) {
        if (opcode == 'result') {
          setTimeout(() => {
            sync(record, 'result');
          }, 1000);
        }
      } else {
        if (opcode == 'result') {
          msg(res);
          setPageLoading(false);
          setIncID(incID + 1);
        } else {
          closeSyncModal();
          setPageLoading(true);
          setTimeout(() => {
            sync(record, 'result');
          }, 1000);
        }
      }

    }).catch(() => {
      console.log('mistake')
    })
  }

  //同步弹框
  const syncMod = (record) => {
    let data = {};
    data.id = record.id;
    data.name = record.name;
    setTimeout(() => {
      syncFormRef.current.setFieldsValue(data)
    }, 100);
    getSyncModal(1);
  }
  //弹出编辑model
  const getSyncModal = (status) => {
    if (status == 1) {
      setSyncModalStatus(true);
    } else {
      setSyncModalStatus(false);
    }
  }

  //关闭弹框
  const closeSyncModal = () => {
    syncFormRef.current.resetFields();
    getSyncModal(2);
  }

  //启用禁用
  const statusSave = (record, checked) => {
    let status = 'N';
    if (checked) {
      status = 'Y';
    }
    let id = record.id;
    post('/cfg.php?controller=userSync&action=enableUserSync', { id: id, status: status }).then((res) => {
      if (!res.success) {
        msg(res);
        return false;
      }
      msg(res);
      setIncID(incID + 1);
    }).catch(() => {
      console.log('mistake')
    })
  }

  useEffect(() => {
    getSyncServerType();
    getSyncUserAttr();
    getSyncAttrDefault();
    getSyncFilterDefault();
  }, [])
  //服务类型
  const getSyncServerType = () => {
    post('/cfg.php?controller=userSync&action=getSyncServerType').then((res) => {
      let info = [];
      res.data.map((item) => {
        let confres = [];
        confres.label = item.text;
        confres.value = item.value;
        info.push(confres);
      })
      setServiceType(info);
    }).catch(() => {
      console.log('mistake')
    })
  }

  //用户属性列表
  const getSyncUserAttr = () => {
    post('/cfg.php?controller=userSync&action=getSyncUserAttr').then((res) => {
      let info = [];
      res.data.map((item) => {
        let confres = [];
        confres.label = item.text;
        confres.value = item.value;
        info.push(confres);
      })
      if (res.data) {
        setUserAttrVal(res.data[0].value)
      }
      setUserAttribute(info);
    }).catch(() => {
      console.log('mistake')
    })
  }

  //同步属性默认值（显示属性，描述属性，邮箱属性，电话属性，密码修改属性）
  const getSyncAttrDefault = () => {
    post('/cfg.php?controller=userSync&action=getSyncAttrDefault').then((res) => {
      if (res.success) {
        setSyncAttrDefault(res.data);
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  //同步过滤默认值（用户过滤，组织过滤，安全组过滤，安全组成员）
  const getSyncFilterDefault = () => {
    post('/cfg.php?controller=userSync&action=getSyncFilterDefault').then((res) => {
      if (res.success) {
        setSyncFilterDefault(res.data);
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  /* 导入成功文件返回 */
  const onFileSuccess = (res) => {
    if (res.success) {
      formRef.current.setFieldsValue({ certIssuer: res.data.certIssuer, certName: res.data.certName })
      setCertID(res.data.certID);
    } else {
      Modal.warning({
        wrapClassName: 'addrplanmodalupload',
        title: language('project.title'),
        content: res.msg,
        okText: language('project.determine'),
      })
    }
  }
  const loadIcon = <LoadingOutlined spin />
  return (
    <div>
      <Spin
        tip={language('project.cfgmngt.deptsync.sync')}
        spinning={pageLoading}
        indicator={loadIcon}
      >
        <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} />
        <ModalForm
          {...defaultUserSync}
          width='650px'
          className='usersyncmodal'
          key='usersyncmodal'
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
            name='status' label={language('project.cfgmngt.deptsync.state')} />
          <NameText name='name' label={language('project.cfgmngt.deptsync.servicename')} required={false} />
          <ProFormSelect options={serviceType}
            name="kind"
            label={language('project.cfgmngt.deptsync.servicetype')}
            rules={[{ required: true, message: language("project.fillin") }]}
          />
          <NotesText name="note" label={language('project.cfgmngt.deptsync.remark')} required={false} type={'text'} tooltip={language('project.cfgmngt.deptsync.cannotcontainspecialcharacters')} />
          <div className="usersynctabs" >
            <Tabs type="card">
              <TabPane tab={language('project.cfgmngt.deptsync.basicconfig')} key="1" style={{ border: '1px solid #f4f4f4', borderTop: '0px solid' }}>
                <div className='usercontentbox'>
                  <ProFormText label={language('project.cfgmngt.deptsync.serviceaddress')} width='326px' name='addr' rules={[
                    {
                      required: true,
                      pattern: regMacList.ip.regex,
                      message: regMacList.ip.alertText,
                    },
                  ]} />
                  <ProFormText label={language('project.cfgmngt.deptsync.serviceport')} width='326px' name='port' rules={[
                    {
                      required: true,
                      pattern: regIpList.singleport.regex,
                      message: regIpList.singleport.alertText,
                    },
                  ]} />
                  <Col offset={7}>
                    <Space>
                      <ProFormCheckbox.Group name="ssl"
                        onChange={(key) => {

                        }}
                        options={[{ label: language('project.cfgmngt.deptsync.sslortls'), value: 'ssl' }]}
                      />
                      <ProFormCheckbox.Group style={{ width: '180px' }} name="cert"
                        onChange={(key) => {
                          if (key.indexOf('cert') == 0) {
                            formRef.current.setFieldsValue({ ssl: ['ssl'] })
                            setCertUpload(false);
                          } else {
                            setCertUpload(true);
                          }
                        }}
                        options={[{ label: language('project.cfgmngt.deptsync.usecertificate'), value: 'cert' }]}
                      />
                    </Space>
                  </Col>
                  <Col offset={7}>
                    <div className='certificatebox'>
                      <Space>
                        <ProFormText hidden name='certName' disabled />
                        <ProFormText width='236px' name='certIssuer' disabled />
                        <ProFormText disabled={certUpload} >
                          <Uploadd
                            config={uploadConfig}
                            fileList={fileList}
                            onSuccess={onFileSuccess}
                            onPreview={(file) => { }}
                          >
                            <Button
                              className='uploadButton'
                              size="small"
                            >
                              {language('project.cfgmngt.deptsync.upload')}
                            </Button>
                          </Uploadd>
                        </ProFormText>
                      </Space>
                    </div>
                  </Col>
                  <ProFormText label={language('project.cfgmngt.deptsync.adminaccount')} width='326px' name='syncAcc' rules={[
                    {
                      required: true,
                      message: language('project.inputcontent'),
                    },
                  ]} />
                  <ProFormText.Password label={language('project.cfgmngt.deptsync.adminpassword')} width='326px' name='syncPwd' rules={[
                    {
                      required: true,
                      message: language('project.inputcontent'),
                    },
                  ]} />
                  <ProFormText label={language('project.cfgmngt.deptsync.basedn')} tooltip={language('project.cfgmngt.deptsync.formatdc')} width='326px' name='baseDN' rules={[{ required: true, pattern: regCustomList.baseDN.regex, message: regCustomList.baseDN.alertText }]} />
                </div>
              </TabPane>
              <TabPane tab={language('project.cfgmngt.deptsync.syncconfig')} key="2" style={{ border: '1px solid #f4f4f4', borderTop: '0px solid' }}>
                <div className='usercontentbox'>
                  <Col offset={4}>
                    <Space>
                      <div className='flexbox'>
                        <div className='labelbox'>{language('project.cfgmngt.deptsync.autosync')}</div>
                        <ProFormCheckbox name='autoSync' />

                        <div style={{ lineHeight: '22px' }}>{language('project.cfgmngt.deptsync.starttimingsynchronizationeveryday')}</div>
                        <ProFormSelect style={{ marginLeft: '5px' }} name='syncTime' options={timeput} />
                        <div style={{ lineHeight: '22px' }}>{language('project.cfgmngt.deptsync.sync')}</div>
                      </div>
                    </Space>
                  </Col>
                  <ProFormSelect options={userAttribute}
                    width='326px'
                    name="userAttr"
                    label={language('project.cfgmngt.deptsync.userproperties')}
                    rules={[{ required: true, message: language("project.fillin") }]}
                  />
                  <ProFormText label={language('project.cfgmngt.deptsync.displayproperties')} width='326px' name='textAttr' rules={[
                    {
                      pattern: regList.cnEnAndNumOtherLittleSymbol.regex,
                      message: regList.cnEnAndNumOtherLittleSymbol.alertText,
                    },
                  ]} />
                  <ProFormText label={language('project.cfgmngt.deptsync.descriptionproperties')} width='326px' name='noteAttr' rules={[
                    {
                      pattern: regList.cnEnAndNumOtherLittleSymbol.regex,
                      message: regList.cnEnAndNumOtherLittleSymbol.alertText,
                    },
                  ]} />
                  <ProFormText label={language('project.cfgmngt.deptsync.emailproperties')} width='326px' name='mailAttr' rules={[
                    {
                      pattern: regList.cnEnAndNumOtherLittleSymbol.regex,
                      message: regList.cnEnAndNumOtherLittleSymbol.alertText,
                    },
                  ]} />
                  <ProFormText label={language('project.cfgmngt.deptsync.phoneproperties')} width='326px' name='teleAttr' rules={[
                    {
                      pattern: regList.cnEnAndNumOtherLittleSymbol.regex,
                      message: regList.cnEnAndNumOtherLittleSymbol.alertText,
                    },
                  ]} />
                  <ProFormText label={language('project.cfgmngt.deptsync.passwordmodificationproperties')} width='326px' name='pwdsetAttr' rules={[
                    {
                      pattern: regList.cnEnAndNumOtherLittleSymbol.regex,
                      message: regList.cnEnAndNumOtherLittleSymbol.alertText,
                    },
                  ]} />
                </div>
              </TabPane>
              <TabPane tab={language('project.cfgmngt.deptsync.syncfiltering')} key="3" style={{ border: '1px solid #f4f4f4', borderTop: '0px solid' }}>
                <div className='usercontentbox'>
                  <ProFormText label={language('project.cfgmngt.deptsync.userfiltering')} width='326px' name='usFilter' rules={[
                    {
                      pattern: regList.filterEngAndNum.regex,
                      message: regList.filterEngAndNum.alertText,
                    },
                  ]} />
                  <ProFormText label={language('project.cfgmngt.deptsync.tissuefiltering')} width='326px' name='ouFilter' rules={[
                    {
                      pattern: regList.filterEngAndNum.regex,
                      message: regList.filterEngAndNum.alertText,
                    },
                  ]} />
                  <ProFormText label={language('project.cfgmngt.deptsync.securitygroupfiltering')} width='326px' name='sgFilter' rules={[
                    {
                      pattern: regList.filterEngAndNum.regex,
                      message: regList.filterEngAndNum.alertText,
                    },
                  ]} />
                  <ProFormText label={language('project.cfgmngt.deptsync.securitygroupmembers')} width='326px' name='sgField' rules={[
                    {
                      pattern: regList.filterEngAndNum.regex,
                      message: regList.filterEngAndNum.alertText,
                    },
                  ]} />
                  <ProFormText label={language('project.cfgmngt.deptsync.customfiltering')} width='326px' name='customFilter' rules={[
                    {
                      pattern: regList.filterEngAndNum.regex,
                      message: regList.filterEngAndNum.alertText,
                    },
                  ]} />
                </div>
              </TabPane>
              <TabPane tab={language('project.cfgmngt.deptsync.useroptions')} key="4" style={{ border: '1px solid #f4f4f4', borderTop: '0px solid' }}>
                <div className='usercontentbox'>
                  <ProFormRadio.Group name="usState" id='usState'
                    label={language('project.cfgmngt.deptsync.accstatus')}
                    options={[
                      { label: language('project.cfgmngt.deptsync.original'), value: 'primitive' },
                      { label: language('project.cfgmngt.deptsync.enable'), value: 'enable' },
                      { label: language('project.cfgmngt.deptsync.disable'), value: 'disable' },
                    ]}
                  />
                  <ProFormRadio.Group name="cover" id='cover'
                    label={language('project.cfgmngt.deptsync.historicalattribute')}
                    options={[{ label: language('project.cfgmngt.deptsync.cover'), value: 'Y' }, { label: language('project.cfgmngt.deptsync.ertain'), value: 'N' }]}
                  />

                  <Col offset={4}>
                    <Space>
                      <div className='flexbox'>
                        <div className='labelbox'>{language('project.cfgmngt.deptsync.loginmode')}</div>
                        <ProFormSelect options={loginMode}
                          width="187px"
                          name="loginMode"
                        />
                        {language('project.cfgmngt.deptsync.loginnumber')}
                        <div style={{ marginLeft: '5px' }}>
                          <ProFormDigit
                            width='89px'
                            name='loginNum'
                            style={{ marginTop: '5px' }}
                            min={2}
                            max={999}
                            fieldProps={{
                              precision: 0
                            }}
                          />
                        </div>
                      </div>
                    </Space>
                  </Col>
                  <Col offset={7}>
                    <ProFormText width='326px' name='loginModeName' rules={[
                      {
                        validator: (rule, value, callback) => {
                          validatorFn(value, callback)
                        }
                      }
                    ]} />
                  </Col>
                  <Col offset={7}>
                    <ProFormCheckbox.Group name="loginReplace" id='loginReplace'
                      options={[{ label: language('project.cfgmngt.deptsync.replaceloginterminal'), value: 'loginReplace' }]}
                    />
                  </Col>
                  <ProFormCheckbox.Group name="syncLocal" id='syncLocal'
                    label={language('project.cfgmngt.deptsync.usertype')}
                    options={[{ label: language('project.cfgmngt.deptsync.synctolocaluser'), value: 'syncLocal' }]}
                  />
                  <ProFormText label={language('project.cfgmngt.deptsync.initpassword')} width='326px' name='initPWD' />
                </div>
              </TabPane>
            </Tabs>
          </div>
        </ModalForm >
        <ModalForm
          {...userSync}
          width='600px'
          className='usyncmodal'
          key='usyncmodal'
          onFinish={async (values) => {
            sync(values);
          }}
          formRef={syncFormRef}
          title={language('project.cfgmngt.deptsync.sync')}
          visible={syncModalStatus}
          autoFocusFirstInput
          modalProps={{
            maskClosable: false,
            onCancel: () => {
              closeSyncModal();
            }
          }}
          onVisibleChange={setSyncModalStatus}
          submitTimeout={2000}>
          <div className='syncdescribe'>
            <p style={{ textIndent: '20px' }}>{language('project.cfgmngt.deptsync.explain')}</p>
            <ul>
              <li>{language('project.cfgmngt.deptsync.uncheckednewsyncsynconlyafteroperation')}</li>
              <li>{language('project.cfgmngt.deptsync.ensureserveraccesssystemtimeagreement')}</li>
            </ul>
          </div>
          <ProFormText name='id' hidden />
          <ProFormText name='name' hidden />
          <ProFormCheckbox.Group name="refresh"
            label={language('project.cfgmngt.deptsync.newsync')}
            options={[{ label: language('project.cfgmngt.deptsync.syncallorguserscoveruser'), value: 'refresh' }]}
          />
        </ModalForm>
      </Spin>
    </div >
  );
};
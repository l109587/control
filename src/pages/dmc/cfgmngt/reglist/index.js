import React, { useRef, useState, useEffect } from 'react';
import { history } from 'umi'
import { Button, Input, message, Modal, TreeSelect, Switch, Tooltip, Space, Tag, Popconfirm, Divider, Col } from 'antd';
import { post } from '@/services/https';
import { ExclamationCircleOutlined, EditFilled, ExportOutlined, DeleteFilled, SaveFilled, CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import ProForm, { DrawerForm, ModalForm, ProFormText, ProFormTextArea, ProFormGroup, ProFormItem } from '@ant-design/pro-form';
import { EditableProTable, ProCard, ProDescriptions, ProTable } from '@ant-design/pro-components';
import { AiFillEye } from "react-icons/ai";
import { Seal } from '@icon-park/react';
import { language } from '@/utils/language';
import '@/utils/index.less';
import './index.less';
import WebUploadr from '@/components/Module/webUploadr';
import { TableLayout, AmTag, CardModal } from '@/components';
const { ProtableModule } = TableLayout;

const { Search } = Input;
let H = document.body.clientHeight - 285
var clientHeight = H
export default (props) => {

  const columns = [
    {
      title: language('project.devid'),
      dataIndex: 'devid',
      align: 'center',
      ellipsis: true,
      width: 200,
    },
    {
      title: language('dmc.cfgmngt.reglist.disposalresults'),
      dataIndex: 'state',
      width: 90,
      align: 'center',
      ellipsis: true,
      filterMultiple: false,
      render: (test, record, index) => {
        let color = '';
        let text = language('project.passed');
        if (record.state == 2) {
          color = 'purple';
          text = language('project.rejected');
        } else if (record.state == 0) {
          color = 'error';
          text = language('project.stayexamine');
        } else {
          color = 'success';
          text = language('project.passed');
        }
        return (
          <AmTag name={text} color={color} key={record.orderState} />
        )
      }
    },
    {
      title: language('cfgmngt.devlist.devcode'),
      dataIndex: 'device_id',
      align: 'center',
      width: 140,
      ellipsis: true,
    },
    {
      title: language('cfgmngt.devlist.devtype'),
      dataIndex: 'type',
      align: 'center',
      width: 150,
      ellipsis: true,
    },
    {
      title: language('cfgmngt.devlist.certificatenumber'),
      dataIndex: 'certsn',
      align: 'center',
      width: 150,
      ellipsis: true,
    },
    {
      title: language('cfgmngt.devlist.devvsn'),
      dataIndex: 'soft_version',
      align: 'center',
      width: 210,
      ellipsis: true,
    },
    {
      title: language('cfgmngt.devlist.devmod'),
      dataIndex: 'model',
      align: 'center',
      width: 150,
      ellipsis: true,
    },
    {
      title: language('cfgmngt.devlist.restime'),
      dataIndex: 'create_time',
      align: 'center',
      width: 140,
      ellipsis: true,
    },
    {
      title: language('dmc.cfgmngt.reglist.disposaltime'),
      dataIndex: 'update_time',
      align: 'center',
      width: 140,
      ellipsis: true,
    },
    {
      title: language('dmc.cfgmngt.reglist.remark'),
      dataIndex: 'memo',
      align: 'center',
      width: 210,
      ellipsis: true,
    },
    {
      disable: true,
      title: language('project.operate'),
      align: 'center',
      fixed: 'right',
      width: 150,
      valueType: 'option',
      render: (text, record, _, action) => [
        record.state == 0 ? <>
          <a key="cancel"
            target="_blank"
            onClick={() => {
              detail(1, record, 'examine');
            }}>
            <Tooltip title={language('project.examine')} placement='top'>
              <Seal style={{ fontSize: '16px', color: '#FF7429' }} />
            </Tooltip>
          </a>
          <a key="see"
            onClick={() => {
              detail(1, record, 'see');
            }}>
            <Tooltip title={language('project.see')} >
              <AiFillEye style={{ width: '16px', fontSize: '16px' }} size={16} />
            </Tooltip>
          </a></> :
          <a key="see"
            onClick={() => {
              detail(1, record, 'see');
            }}>
            <Tooltip title={language('project.see')} >
              <AiFillEye style={{ width: '16px', fontSize: '16px' }} size={16} />
            </Tooltip>
          </a>
      ],
    },
  ];

  const formRef = useRef();
  const [drawStatus, setDrawStatus] = useState(false);//draw 弹框状态
  const [drawThanStatus, setDrawThanStatus] = useState(false);//draw 对比弹框状态
  const [treeValue, setTreeValue] = useState('');
  const [zoneId, setZoneId] = useState();//侧边栏选中地址id
  const [zoneIdVal, setZoneIdVal] = useState();//添加区域id
  const [zoneNameVal, setZoneNameVal] = useState();//添加区域名称
  const [treekey, setTreekey] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const zoneType = 'zone';
  const [initialValue, setInitialValue] = useState([]);
  const [initialValueThan, setInitialValueThan] = useState([]);
  const defalutTableHeight = 30;//默认高度
  const [cpuHeight, setCpuHeight] = useState(30);
  const [interfaceHeight, setInterfaceHeight] = useState(30);
  const [contactHeight, setContactHeight] = useState(30);
  const [drawType, setDrawType] = useState([]);
  const { confirm } = Modal;

  const incAdd = () => {
    let inc;
    clearTimeout(inc);
    inc = setTimeout(() => {
      setIncID(incID + 1);
    }, 100);
  }

  /** table组件 start */
  const rowKey = (record => record.device_id);//列表唯一值
  const tableHeight = clientHeight - 10;//列表高度
  const tableKey = 'dmcregc';//table 定义的key
  const rowSelection = true;//是否开启多选框
  const addButton = false; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const columnvalue = 'dmcregccolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = '/cfg.php?controller=confDevice&action=regShowList';//接口路径
  const [queryVal, setQueryVal] = useState();//首个搜索框的值
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy' };//顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    devid: { show: false },
    version: { show: false },
    description: { show: false },
    reg_time: { show: false },
    updateTime: { show: false },
    createTime: { show: false },
  }
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        allowClear
        placeholder={language('cfgmngt.devlist.tablesearch')}
        style={{ width: 200 }}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          incAdd()
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

  /** table组件 end */

  useEffect(() => {
    getTree()
  }, [])

  //区域管理处理
  const getTree = () => {
    //区域管理处理
    let data = { id: 1, type: 'tree', depth: '1' };
    post('/cfg.php?controller=confZoneManage&action=showZoneTree', data).then((res) => {
      setZoneId(res.id);
      const treeInfoData = [
        res.node,
      ];
      setTreeData(treeInfoData)
    }).catch(() => {
      console.log('mistake')
    })
  }

  //下拉处理
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
    let selValNum = selVal[selVal.length - 1];
    setTreeValue(selVal.join('/'));
    setTreekey(selKye);
    setZoneIdVal(selKyeNum)
    setZoneNameVal(selValNum)
  };

  //判断是否弹出审核drawmodel
  const getDrawModal = (status, record) => {
    if (status == 1) {
      setDrawStatus(true);
      setTreeValue(record.gpZonePath);
      let key = ' ';
      let val = ' ';
      if (record.gpZoneIDPath) {
        key = record.gpZoneIDPath.split('.');
        val = record.gpZonePath.split('/');
      }
      let selKyeNum = key[key.length - 1];
      let selValNum = val[val.length - 1];
      setZoneIdVal(selKyeNum);
      setZoneNameVal(selValNum);
      setTreekey(key);

      let initialValues = record;
      setInitialValue(initialValues);
      setTimeout(function () {
        formRef.current.setFieldsValue(initialValues)
      }, 100)
    } else {
      setZoneIdVal();
      setTreekey([]);
      setTreeValue();
      setZoneNameVal(' ');
      formRef.current.resetFields();
      setDrawStatus(false);
    }
  }

  const arrSort = (arr)=>{
    return arr.sort((key, val)=>{
      return val - key;
    })
  }

  //判断是否弹出对比审核drawmodel
  const getDrawThanModal = (status, record, thanRecord) => {
    if (status == 1) {
      let cpuLenght = arrSort([
        record.cpu_info.length,
        record.disk_info.length,
        thanRecord.cpu_info.length,
        thanRecord.disk_info.length,
      ]);
      let interfaceLenght = arrSort([
        record.interface.length,
        thanRecord.interface.length,
      ]);
      let contactLenght = arrSort([
        record.contact.length,
        thanRecord.contact.length,
      ]);
      setCpuHeight(defalutTableHeight + cpuLenght[0] * 38);
      setInterfaceHeight(defalutTableHeight + interfaceLenght[0] * 38);
      setContactHeight(defalutTableHeight + contactLenght[0] * 38);
      setInitialValue(record);
      setInitialValueThan(thanRecord);
      setDrawThanStatus(true);
    } else {
      setZoneIdVal();
      setTreekey([]);
      setTreeValue();
      setZoneNameVal(' ');
      setDrawThanStatus(false);
    }
  }

  //查看详情 
  const detail = (status, record, type) => {
    let data = {};
    data.device_id = record.device_id;
    post('/cfg.php?controller=confDevice&action=detail', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      if (record.compare == 'verify' && type == 'examine') {
        getDrawThanModal(status, record, res.data);
      } else if (record.compare == 'show' && type == 'see') {
        getDrawThanModal(status, record, res.data);
      } else {
        getDrawModal(status, record);
      }

      setDrawType(type);
    }).catch(() => {
      console.log('mistake')
    })
  }

  //审核处理
  const examine = (verifyPass, type = '') => {
    let obj = formRef.current.getFieldsValue(['name', 'reason'])
    let data = {};
    data.verifyState = verifyPass;
    data.device_id = initialValue.device_id;
    data.name = obj.name;
    data.reason = obj.reason;
    data.zoneID = zoneIdVal;
    data.zoneName = zoneNameVal;
    post('/cfg.php?controller=confDevice&action=verify', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      if(type == 'single'){
        getDrawModal(2);
      }else{
        getDrawThanModal(2);
      }
      incAdd();
    }).catch(() => {
      console.log('mistake')
    })
  }

  //删除数据
  const delList = (selectedRowKeys) => {
    let ids = JSON.stringify(selectedRowKeys);
    post('/cfg.php?controller=confDevice&action=regDel', { ids: ids }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      incAdd()
    }).catch(() => {
      console.log('mistake')
    })
  }

  //审核接口信息
  const dapiColumns = [
    {
      title: language('cfgmngt.devlist.apiip'),
      dataIndex: 'ip',
      width: 120,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.subnetmask'),
      dataIndex: 'netmask',
      width: 90,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.defaultgateway'),
      dataIndex: 'gateway',
      width: 110,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.macaddress'),
      dataIndex: 'mac',
      width: 110,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.managementport'),
      dataIndex: 'manage',
      width: 80,
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
        if (record.manage) {
          return (<CheckCircleFilled style={{ color: '#12C189', size: 16 }} />)
        } else {
          return (<CloseCircleFilled style={{ color: '#F74852', size: 16 }} />)
        }
      }
    },

  ];

  //审核CPU信息
  const dcpuColumns = [
    {
      title: language('cfgmngt.devlist.cpuid'),
      dataIndex: 'physical_id',
      width: 70,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.numbercores'),
      dataIndex: 'core',
      width: 60,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.basicfrequency'),
      dataIndex: 'clock',
      width: 40,
      align: 'left',
      ellipsis: true,
    }
  ];

  //审核磁盘信息
  const ddiskColumns = [
    {
      title: language('cfgmngt.devlist.harddisksize'),
      dataIndex: 'size',
      width: 70,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.harddiskserialnum'),
      dataIndex: 'serial',
      width: 90,
      align: 'left',
      ellipsis: true,
    }
  ];

  //审核联系人员
  const dcontactsColumns = [
    {
      title: language('cfgmngt.devlist.contacts'),
      dataIndex: 'name',
      width: 80,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.position'),
      dataIndex: 'position',
      width: 80,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.email'),
      dataIndex: 'email',
      width: 140,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.phone'),
      dataIndex: 'phone',
      width: 120,
      align: 'left',
      ellipsis: true,
    }
  ];

  //审核接口信息
  const seeDapiColumns = [
    {
      title: language('cfgmngt.devlist.apiip'),
      dataIndex: 'ip',
      width: 140,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.subnetmask'),
      dataIndex: 'netmask',
      width: 130,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.defaultgateway'),
      dataIndex: 'gateway',
      width: 130,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.macaddress'),
      dataIndex: 'mac',
      width: 160,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.managementport'),
      dataIndex: 'manage',
      width: 90,
      align: 'center',
      ellipsis: true,
      render: (text, record) => {
        if (record.manage) {
          return (<CheckCircleFilled style={{ color: '#12C189', size: 16 }} />)
        } else {
          return (<CloseCircleFilled style={{ color: '#F74852', size: 16 }} />)
        }
      }
    },

  ];

  //审核CPU信息
  const seeDcpuColumns = [
    {
      title: language('cfgmngt.devlist.cpuid'),
      dataIndex: 'physical_id',
      width: 90,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.numbercores'),
      dataIndex: 'core',
      width: 80,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.basicfrequency'),
      dataIndex: 'clock',
      width: 60,
      align: 'left',
      ellipsis: true,
    }
  ];

  //审核磁盘信息
  const seeDdiskColumns = [
    {
      title: language('cfgmngt.devlist.harddisksize'),
      dataIndex: 'size',
      width: 110,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.harddiskserialnum'),
      dataIndex: 'serial',
      width: 120,
      align: 'left',
      ellipsis: true,
    }
  ];

  //审核联系人员
  const seeDcontactsColumns = [
    {
      title: language('cfgmngt.devlist.contacts'),
      dataIndex: 'name',
      width: 100,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.position'),
      dataIndex: 'position',
      width: 100,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.email'),
      dataIndex: 'email',
      width: 160,
      align: 'left',
      ellipsis: true,
    }, {
      title: language('cfgmngt.devlist.phone'),
      dataIndex: 'phone',
      width: 140,
      align: 'left',
      ellipsis: true,
    }
  ];

  return (
    <>
      <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} rowSelection={rowSelection} />

      {/* //审核弹出框 */}
      <DrawerForm
        labelCol={{ xs: { span: 9 } }}
        wrapperCol={{ xs: { span: 12 } }}
        width="855px"
        layout="horizontal"
        className='dmcregdrawer'
        title={drawType == 'see' ? language('cfgmngt.devlist.seeoperation') : language('cfgmngt.devlist.auditoperation')}
        formRef={formRef}
        submitter={false}
        visible={drawStatus}
        onVisibleChange={setDrawStatus}
        drawerProps={{
          placement: 'left',
          destroyOnClose: true,
          maskClosable: false,
          onClose: () => {
            getDrawModal(2);
          },
        }}
        autoFocusFirstInput
        submitTimeout={2000}
        onFinish={async (values) => {

        }}>
        <div style={{ marginTop: '-12px' }}>
          <Divider orientation='left'>{language('cfgmngt.devlist.resinfo')}</Divider>
        </div>
        <div className='aapplicationinformation'>
          <ProDescriptions column={2}>
            <ProDescriptions.Item label={language('cfgmngt.devlist.devnumber')}>{initialValue.device_id ? initialValue.device_id : ''} </ProDescriptions.Item>
            <ProDescriptions.Item label={language('cfgmngt.devlist.certificatenumber')}>{initialValue.certsn ? initialValue.certsn : ' '}</ProDescriptions.Item>
          </ProDescriptions>
          <ProDescriptions column={2}>
            <ProDescriptions.Item label={language('cfgmngt.devlist.devtype')}>{initialValue.type ? initialValue.type : ''}</ProDescriptions.Item>
            <ProDescriptions.Item label={language('cfgmngt.devlist.systemdevvsn')}>{initialValue.soft_version ? initialValue.soft_version : ' '}</ProDescriptions.Item>
          </ProDescriptions>
        </div>
        <Divider orientation='left'>{language('cfgmngt.devlist.apiinfo')}</Divider>
        <div className='apiinfobox dtablebox'>
          <EditableProTable
            size="small"
            name='interface'
            value={initialValue.interface ? initialValue.interface : []}
            toolBarRender={false}
            columns={seeDapiColumns}
            className='dmcdeveditable'
            recordCreatorProps={false} editable={false} />
        </div>
        <Divider orientation='left'>{language('cfgmngt.devlist.hardwareinfo')}</Divider>
        <div className='aapplicationinformation hardInfo'>
          <ProDescriptions column={2}>
            <ProDescriptions.Item name='applicant' label={language('cfgmngt.devlist.memorysize')}></ProDescriptions.Item>
          </ProDescriptions>
          <ProDescriptions>
            <ProDescriptions.Item name='zone' label={language('cfgmngt.devlist.cpuinfo')}>
              <div style={{ width: '410px' }}>
                <EditableProTable
                  size="small"
                  name='cpu_info'
                  value={initialValue.cpu_info ? initialValue.cpu_info : []}
                  toolBarRender={false}
                  columns={seeDcpuColumns}
                  className='dmcdeveditable'
                  recordCreatorProps={false}
                  editable={false} />
              </div>
            </ProDescriptions.Item>
          </ProDescriptions>
          <ProDescriptions>
            <ProDescriptions.Item name="org" label={language('cfgmngt.devlist.diskinfo')}>
              <div style={{ width: '410px' }}>
                <EditableProTable
                  size="small"
                  name='disk_info'
                  value={initialValue.disk_info ? initialValue.disk_info : []}
                  toolBarRender={false}
                  columns={seeDdiskColumns}
                  className='dmcdeveditable'
                  recordCreatorProps={false}
                  editable={false} />
              </div>
            </ProDescriptions.Item>
          </ProDescriptions>
        </div>
        <Divider orientation='left'>{language('cfgmngt.devlist.deployinfo')}</Divider>
        <div className='aapplicationinformation'>
          <ProDescriptions column={2}>
            <ProDescriptions.Item label={language('cfgmngt.devlist.customerunit')}>{initialValue.organs ? initialValue.organs : ''} </ProDescriptions.Item>
            <ProDescriptions.Item label={language('cfgmngt.devlist.administrativecode')}>{initialValue.address ? initialValue.address : ' '}</ProDescriptions.Item>
          </ProDescriptions>
          <ProDescriptions column={2}>
            <ProDescriptions.Item label={language('cfgmngt.devlist.deploymentarea')}>{initialValue.address_code ? initialValue.address_code : ''}</ProDescriptions.Item>
          </ProDescriptions>
          <ProDescriptions column={1}>
            <ProDescriptions.Item name='zone' label={language('cfgmngt.devlist.contactsperson')}>
              <div style={{ width: '560px' }}>
                <EditableProTable
                  rowKey="id"
                  size="small"

                  value={initialValue.contact ? initialValue.contact : []}
                  toolBarRender={false}
                  columns={seeDcontactsColumns}
                  className='dmcdeveditable'
                  recordCreatorProps={false}
                  editable={false} />
              </div>
            </ProDescriptions.Item>
          </ProDescriptions>
        </div>
        {drawType == 'see' ?
          <>
            <Divider orientation='left'>{language('cfgmngt.devlist.examineresult')}</Divider>
            <ProFormItem label={language('cfgmngt.devlist.devnumber')} style={{ marginLeft: '-278px' }}>
              <AmTag name={
                initialValue.state == 2 ? language('project.rejected') : initialValue.state == 0 ? language('project.stayexamine') : language('project.passed')}
                color={initialValue.state == 2 ? 'purple' : initialValue.state == 0 ? 'error' : 'success'} />
              <span style={{ marginLeft: '6px' }}>{initialValue.reason}</span>
            </ProFormItem></>
          : <>
            <Divider orientation='left'>{language('cfgmngt.devlist.auditoperation')}</Divider>
            <div className='groupfrombox'>
              <ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <ProFormText
                  width="170px"
                  name='name'
                  fieldProps={{
                    allowClear: false,
                  }}
                  label={language('cfgmngt.devlist.equipmentname')}
                />
                <div style={{ marginLeft: '40px' }}>
                  <ProFormText name="zone_id" label={language('cfgmngt.devlist.fromzone')} >
                    <TreeSelect style={{ width: 170 }}
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
                </div>
              </ProForm.Group>
            </div>
            <div className='groupfrominfobox'>
              <ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                <ProFormText width='497px' name='reason' label={language('cfgmngt.devlist.rejectreason')} />
                <div style={{ marginTop: '-10px', marginLeft: '119px' }}>
                  <Button type="primary" onClick={() => {
                    examine('verifyPass', 'single');
                  }}>
                    {language('project.adopt')}
                  </Button>
                  <Button style={{ left: '5px' }} danger type="primary" onClick={() => {
                    examine('verifyReject', 'single');
                  }}>
                    {language('project.reject')}
                  </Button>
                </div>
              </ProForm.Group>
            </div></>
        }
      </DrawerForm>
      {/* //审核弹出框 */}
      <DrawerForm
        labelCol={{ xs: { span: 4 } }}
        wrapperCol={{ xs: { span: 16 } }}
        width="1220px"
        layout="horizontal"
        className='dmcregthandrawer'
        title={drawType == 'see' ? language('cfgmngt.devlist.seeoperation') : language('cfgmngt.devlist.auditoperation')}
        formRef={formRef}
        submitter={false}
        visible={drawThanStatus}
        onVisibleChange={setDrawThanStatus}
        drawerProps={{
          placement: 'left',
          destroyOnClose: true,
          maskClosable: false,
          onClose: () => {
            getDrawThanModal(2);
          },
        }}
        autoFocusFirstInput
        submitTimeout={2000}
        onFinish={async (values) => {

        }}>
        <div>
          <ProCard className='fromcontent' ghost gutter={8}>
            <ProCard className='zcontbox' style={{ height: '100%' }} bordered direction='column' >
              <ProCard className='titlebox' title={drawType == 'see' ? language('cfgmngt.devlist.entryinfo') : language('cfgmngt.devlist.historyregisterinfo')} ghost></ProCard>
              <ProCard ghost title={language('cfgmngt.devlist.devnumber')}>
                <ProFormItem label={language('cfgmngt.devlist.devnumber')}>{initialValueThan.device_id ? initialValueThan.device_id : ''} </ProFormItem>
                <ProFormItem label={language('cfgmngt.devlist.devtype')}>{initialValueThan.type ? initialValueThan.type : ''}</ProFormItem>
                <ProFormItem label={language('cfgmngt.devlist.certificatenumber')}>{initialValueThan.certsn ? initialValueThan.certsn : ' '}</ProFormItem>
                <ProFormItem label={language('cfgmngt.devlist.systemdevvsn')}>{initialValueThan.soft_version ? initialValueThan.soft_version : ' '}</ProFormItem>
              </ProCard>
              <ProCard ghost title={language('cfgmngt.devlist.apiinfo')}>
                <div style={{ height: interfaceHeight+ 'px' }}>
                  <EditableProTable
                    style={{ marginLeft: '21px' }}
                    size="small"
                    value={initialValueThan.interface ? initialValueThan.interface : []}
                    toolBarRender={false}
                    columns={dapiColumns}
                    className='dmcdeveditable'
                    recordCreatorProps={false} editable={false} />
                </div>
              </ProCard>
              <ProCard ghost title={language('cfgmngt.devlist.hardwareinfo')}>
                <ProFormItem label={language('cfgmngt.devlist.memorysize')}>{initialValueThan.device_id ? initialValueThan.device_id : ''} </ProFormItem>
                <div>
                    <ProFormItem className='leftmarginbox' label={language('cfgmngt.devlist.cpuinfo')}>
                      <div style={{ width: '410px', height: cpuHeight+ 'px', marginBottom: 12 }}>
                        <EditableProTable
                          size="small"
                          value={initialValueThan.cpu_info ? initialValueThan.cpu_info : []}
                          toolBarRender={false}
                          columns={dcpuColumns}
                          className='dmcdeveditable'
                          recordCreatorProps={false}
                          editable={false} />
                      </div>
                    </ProFormItem>
                    <ProFormItem label={language('cfgmngt.devlist.diskinfo')}>
                      <div style={{ width: '410px' }}>
                        <EditableProTable
                          size="small"
                          value={initialValueThan.disk_info ? initialValueThan.disk_info : []}
                          toolBarRender={false}
                          columns={ddiskColumns}
                          className='dmcdeveditable'
                          recordCreatorProps={false}
                          editable={false} />
                      </div>
                    </ProFormItem>
                </div>
              </ProCard>
              {drawType == 'see' ? <></> :
                <ProCard ghost title={language('cfgmngt.devlist.deployinfo')}>
                  <ProFormItem label={language('cfgmngt.devlist.customerunit')}>{initialValueThan.organs ? initialValueThan.organs : ''} </ProFormItem>
                  <ProDescriptions className='zoneinfobox' column={2}>
                    <ProDescriptions.Item label={language('cfgmngt.devlist.deploymentarea')}>{initialValueThan.address ? initialValueThan.address : ''} </ProDescriptions.Item>
                    <ProDescriptions.Item className='administrativecode' label={language('cfgmngt.devlist.administrativecode')}>{initialValueThan.address_code ? initialValueThan.address_code : ' '}</ProDescriptions.Item>
                  </ProDescriptions>
                  <ProFormItem name='zone' label={language('cfgmngt.devlist.contactsperson')}>
                    <div style={{ width: '300px' }}>
                      <EditableProTable
                        rowKey="id"
                        size="small"
                        value={initialValueThan.contact ? initialValueThan.contact : []}
                        toolBarRender={false}
                        columns={dcontactsColumns}
                        className='dmcdeveditable'
                        recordCreatorProps={false}
                        editable={false} />
                    </div>
                  </ProFormItem>
                </ProCard>}
            </ProCard>
            <ProCard className='zcontbox' style={{ height: '100%' }} bordered direction='column' >
              <ProCard className='titlebox' title={drawType == 'see' ? language('cfgmngt.devlist.registerinfo') : language('cfgmngt.devlist.nowregisterinfo')} ghost></ProCard>
              <ProCard ghost title={language('cfgmngt.devlist.devnumber')}>
                <ProFormItem label={language('cfgmngt.devlist.devnumber')}>{initialValue.device_id ? initialValue.device_id : ''} </ProFormItem>
                <ProFormItem label={language('cfgmngt.devlist.devtype')}>{initialValue.type ? initialValue.type : ''}</ProFormItem>
                <ProFormItem label={language('cfgmngt.devlist.certificatenumber')}>{initialValue.certsn ? initialValue.certsn : ' '}</ProFormItem>
                <ProFormItem label={language('cfgmngt.devlist.systemdevvsn')}>{initialValue.soft_version ? initialValue.soft_version : ' '}</ProFormItem>
              </ProCard>
              <ProCard ghost title={language('cfgmngt.devlist.apiinfo')}>
                <div style={{ height: interfaceHeight+ 'px' }}>
                  <EditableProTable
                    style={{ marginLeft: '21px' }}
                    size="small"
                    value={initialValue.interface ? initialValue.interface : []}
                    toolBarRender={false}
                    columns={dapiColumns}
                    className='dmcdeveditable'
                    recordCreatorProps={false} editable={false} />
                </div>
              </ProCard>
              <ProCard ghost title={language('cfgmngt.devlist.hardwareinfo')}>
                <ProFormItem label={language('cfgmngt.devlist.memorysize')}>{initialValue.device_id ? initialValue.device_id : ''} </ProFormItem>
                <div>
                    <ProFormItem className='leftmarginbox' label={language('cfgmngt.devlist.cpuinfo')}>
                      <div style={{ width: '410px', height: cpuHeight+ 'px', marginBottom: 12  }}>
                        <EditableProTable
                          rowKey="id"
                          size="small"
                          value={initialValue.cpu_info ? initialValue.cpu_info : []}
                          toolBarRender={false}
                          columns={dcpuColumns}
                          className='dmcdeveditable'
                          recordCreatorProps={false}
                          editable={false} />
                      </div>
                    </ProFormItem>
                    <ProFormItem label={language('cfgmngt.devlist.diskinfo')}>
                      <div style={{ width: '410px' }}>
                        <EditableProTable
                          rowKey="id"
                          size="small"
                          value={initialValue.disk_info ? initialValue.disk_info : []}
                          toolBarRender={false}
                          columns={ddiskColumns}
                          className='dmcdeveditable'
                          recordCreatorProps={false}
                          editable={false} />
                      </div>
                    </ProFormItem>
                </div>
              </ProCard>
              <ProCard ghost title={language('cfgmngt.devlist.deployinfo')}>
                <ProFormItem label={language('cfgmngt.devlist.customerunit')}>{initialValue.organs ? initialValue.organs : ''} </ProFormItem>
                <ProDescriptions className='zoneinfobox' column={2}>
                  <ProDescriptions.Item label={language('cfgmngt.devlist.deploymentarea')}>{initialValue.address ? initialValue.address : ''} </ProDescriptions.Item>
                  <ProDescriptions.Item className='administrativecode' label={language('cfgmngt.devlist.administrativecode')}>{initialValue.address_code ? initialValue.address_code : ' '}</ProDescriptions.Item>
                </ProDescriptions>
                <ProFormItem name='zone' label={language('cfgmngt.devlist.contactsperson')}>
                  <div style={{ width: '300px', height: contactHeight + 'px' }}>
                    <EditableProTable
                      rowKey="id"
                      size="small"
                      value={initialValue.contact ? initialValue.contact : []}
                      toolBarRender={false}
                      columns={dcontactsColumns}
                      className='dmcdeveditable'
                      recordCreatorProps={false}
                      editable={false} />
                  </div>
                </ProFormItem>
              </ProCard>
            </ProCard>
          </ProCard>
          <Divider className='buttombox' ></Divider>
          {drawType == 'see' ?
            <ProCard className='examineresult' title={language('cfgmngt.devlist.examineresult')} ghost>
              <ProFormItem label={language('cfgmngt.devlist.devnumber')} style={{ marginLeft: '-107px' }}>
                <AmTag name={
                  initialValue.state == 2 ? language('project.rejected') : initialValue.state == 0 ? language('project.stayexamine') : language('project.passed')}
                  color={initialValue.state == 2 ? 'purple' : initialValue.state == 0 ? 'error' : 'success'} />
                <span style={{ marginLeft: '6px' }}>{initialValue.reason}</span>
                <Button style={{ float: 'right', right: '-213px', marginTop: '-5px' }} type='primary' onClick={() => {
                  getDrawThanModal(2);
                }}>{language('project.shutclose')}</Button>
              </ProFormItem>
            </ProCard >
            :
            <ProCard className='buttomfromcontent' title={language('cfgmngt.devlist.auditoperation')} ghost>
              <div className='recoverform'>
                <div className='groupfrombox'>
                  <ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                    <div className='leftmarginbox'>
                      <ProFormText
                        width="170px"
                        name='name'
                        fieldProps={{
                          allowClear: false,
                        }}
                        label={language('cfgmngt.devlist.equipmentname')}
                      />
                    </div>
                    <div style={{ marginLeft: '-63px' }}>
                      <ProFormText name="zone_id" label={language('cfgmngt.devlist.fromzone')} >
                        <TreeSelect style={{ width: 170 }}
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
                    </div>
                  </ProForm.Group>
                </div>
                <div className='groupfrominfobox'>
                  <ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
                    <ProFormText width='497px' name='reason' label={language('cfgmngt.devlist.rejectreason')} />
                    <div style={{ marginTop: '-10px', marginLeft: '119px' }}>
                      <Button type="primary" onClick={() => {
                        examine('verifyPass');
                      }}>
                        {language('project.adopt')}
                      </Button>
                      <Button style={{ left: '5px' }} danger type="primary" onClick={() => {
                        examine('verifyReject');
                      }}>
                        {language('project.reject')}
                      </Button>
                    </div>
                  </ProForm.Group>
                </div>
              </div>
            </ProCard>
          }
        </div>
      </DrawerForm>

    </>
  )

}
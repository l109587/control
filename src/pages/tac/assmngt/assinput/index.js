import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, message, Modal, TreeSelect, Divider, Space, Tag, Alert, Spin } from 'antd';
import { post, fileDown, postAsync } from '@/services/https';
import { ExclamationCircleOutlined, LoadingOutlined, CloseOutlined } from '@ant-design/icons';
import ProForm, { ProFormTextArea, ProFormText, ProFormSelect, DrawerForm } from '@ant-design/pro-form';
import './assinput.less'
import { ProTable } from '@ant-design/pro-components'
import { vermodal, modalFormLayout } from "@/utils/helper";
import { language } from '@/utils/language';
import { NotesText, ContentText } from '@/utils/fromTypeLabel';
import { regSeletcList, regMacList, regList } from '@/utils/regExp';
import '@/utils/index.less';
import DownnLoadFile from '@/utils/downnloadfile.js';
import { TableLayout, LeftTree, CardModal, DynFieldReg } from '@/components';
const { ProtableModule, WebUploadr } = TableLayout;
const { Search } = Input
let H = document.body.clientHeight - 285
var clientHeight = H
var toptextcontent = '200px'

export default (props) => {
  const columnsList = [
    {
      title: language('project.assmngt.id'),
      dataIndex: 'id',
      ellipsis: true,
      align: 'center',
      width: 80,
    },
    {
      title: language('project.assmngt.assinput.from'),
      dataIndex: 'origin',
      align: 'center',
      ellipsis: true,
      className: 'origin',
      width: 80,
      filterMultiple: false,
      filters: [
        { text: language('project.assmngt.assinput.apply'), value: 'apply' },
        { text: language('project.assmngt.assinput.input'), value: 'record' },
      ],
      render: (text, record, index) => {
        let color = '';
        if (record.origin == 'apply') {
          color = 'success';
          text = language('project.assmngt.assinput.apply')
        } else {
          color = 'processing';
          text = language('project.assmngt.assinput.input')
        }
        return (
          <Space>
            <Tag style={{ marginRight: '0px' }} color={color} key={record.status}>
              {text}
            </Tag>
          </Space>
        )
      }
    },
    {
      title: language('project.assmngt.assinput.zone'),
      dataIndex: 'zone',
      importStatus: true,
      ellipsis: true,
      width: 120,
    },
    {
      title: language('project.assmngt.assinput.org'),
      dataIndex: 'org',
      importStatus: true,
      ellipsis: true,
      width: 120,
    },
    {
      title: language('project.assmngt.assinput.assettype'),
      dataIndex: 'assetType',
      importStatus: true,
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.assmngt.assinput.ipaddr'),
      dataIndex: 'ipaddr',
      importStatus: true,
      ellipsis: true,
      width: 110,
    },
    {
      title: language('project.assmngt.assinput.macaddr'),
      dataIndex: 'macaddr',
      importStatus: true,
      ellipsis: true,
      width: 140,
    },
    {
      title: language('project.assmngt.assinput.user'),
      dataIndex: 'user',
      importStatus: true,
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.assmngt.assinput.phone'),
      dataIndex: 'phone',
      importStatus: true,
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.assmngt.assinput.businesspurpose'),
      dataIndex: 'buisUsg',
      importStatus: true,
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.assmngt.assinput.assetmodel'),
      dataIndex: 'assetModel',
      importStatus: true,
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.assmngt.assinput.location'),
      dataIndex: 'location',
      importStatus: true,
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.assmngt.assinput.remark'),
      dataIndex: 'notes',
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.assmngt.assinput.createtime'),
      dataIndex: 'createTime',
      ellipsis: true,
      width: 120,
    },
    {
      title: language('project.assmngt.assinput.updatetime'),
      dataIndex: 'updateTime',
      ellipsis: true,
      width: 120,
    },
    {
      width: 80,
      title: language('project.mconfig.operate'),
      align: 'center',
      valueType: 'option',
      fixed: 'right',
      ellipsis: true,
      render: (text, record, _, action) => [
        <a key="editable"
          style={
            record.origin !== 'record'
              ? {
                color: 'rgba(0,0,0,.25)',
                cursor: 'not-allowed',
                disabled: true,
              }
              : {}
          }
          onClick={() => {
            if (record.origin === 'record') {
              mod(record, 'mod');
            }
          }}>
          {language('project.deit')}
        </a>,

      ],
    },
  ];

  const columnsMsg = [
    {
      title: language('project.assmngt.assinput.msg'),
      dataIndex: 'msg',
      ellipsis: true,
      width: 200,
    },
    {
      title: language('project.assmngt.assinput.zone'),
      dataIndex: 'zone',
      importStatus: true,
      ellipsis: true,
      width: 120,
    },
    {
      title: language('project.assmngt.assinput.org'),
      dataIndex: 'org',
      importStatus: true,
      ellipsis: true,
      width: 120,
    },
    {
      title: language('project.assmngt.assinput.assettype'),
      dataIndex: 'assetType',
      importStatus: true,
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.assmngt.assinput.ipaddr'),
      dataIndex: 'ipaddr',
      importStatus: true,
      ellipsis: true,
      width: 110,
    },
    {
      title: language('project.assmngt.assinput.macaddr'),
      dataIndex: 'macaddr',
      importStatus: true,
      ellipsis: true,
      width: 140,
    },
    {
      title: language('project.assmngt.assinput.user'),
      dataIndex: 'user',
      importStatus: true,
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.assmngt.assinput.phone'),
      dataIndex: 'phone',
      importStatus: true,
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.assmngt.assinput.businesspurpose'),
      dataIndex: 'buisUsg',
      importStatus: true,
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.assmngt.assinput.assetmodel'),
      dataIndex: 'assetModel',
      importStatus: true,
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.assmngt.assinput.location'),
      dataIndex: 'location',
      importStatus: true,
      ellipsis: true,
      width: 100,
    },
  ];

  const formRef = useRef();
  const [imoritModalStatus, setImoritModalStatus] = useState(false);//导入 上传文件弹出框
  const [importFieldsList, setImportFieldsList] = useState([]);//导入 选择字段
  let importArrFields = [];
  const [importFieldsArr, setImportFieldsArr] = useState([]);//导入 选择字段数组
  const [importBui, setImportBui] = useState(' ');//导入业务用途
  const [impErrorShow, setImpErrorShow] = useState(false);//是否显示错误提示
  const [impErrorMsg, setImpErrorMsg] = useState(true);//错误提示信息

  const [spinning, setSpinning] = useState(false);
  const [columns, setColumns] = useState(columnsList);//table 头部数据
  const [columnsOld, setColumnsOld] = useState(columnsList);//旧table 头数据,包含公有动态字段
  const [columnsNew, setColumnsNew] = useState(columnsList);//新table 头数据,包含公有动态字段, 导入使用
  const [macDasabled, setMacDasabled] = useState(false);//mac地址是否可编辑
  const [purposeList, setPurposeList] = useState([]);//业务用途 
  const [assettypeList, setAssettypeList] = useState([]);//资产类型
  const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
  const [dynamicFieldList, setDynamicFieldList] = useState([]);//动态字段列表
  let dynamicFieldArr = [];//动态字段列表
  const [privateField, setPrivateField] = useState([]);//私有动态字段列表
  const [orgID, setOrgID] = useState(0);
  const [buisUsgVal, setBuisUsgVal] = useState('');//业务用途选中信息

  const [upTableSta, setUpTableSta] = useState(false);
  const [upTableData, setUpTableData] = useState([]);

  const [treeID, setTreeID] = useState(0);
  const { confirm } = Modal;
  const [fileCode, setFileCode] = useState('utf-8');//文件编码
  //接口参数
  const paramentUpload = {
    'filecode': fileCode,
  }
  const fileList = [];
  const uploadConfig = {
    accept: 'csv', //接受上传的文件类型：zip、pdf、excel、image
    max: 100000000000000, //限制上传文件大小
    url: '/cfg.php?controller=confAssetManage&action=importAsset',
  }

  /** 左侧树形组件 start */
  const treeUrl = '/cfg.php?controller=confZoneManage&action=showZoneTree';
  const leftTreeData = { id: 1, type: 'tree', depth: '1' };
  const [treeInc, setTreeInc] = useState(0);
  //getTree 请求树形内容
  //onSelectLeft
  /** 左侧树形组件 end */

  /** table组件 start */
  const rowKey = (record => record.id);//列表唯一值
  const tableHeight = clientHeight - 10;//列表高度
  const tableKey = 'assinput';//table 定义的key
  const rowSelection = true;//是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = true; //删除按钮 与 delClick 方法 组合使用
  const uploadButton = true; //导入按钮 与 uploadClick 方法 组合使用
  const downloadButton = true; //导出按钮 与 downloadClick 方法 组合使用
  const [incID, setIncID] = useState(1);//递增的id 删除/添加的时候增加触发刷新
  const columnvalue = 'assinputcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = '/cfg.php?controller=confAssetManage&action=showAsset';//接口路径
  const [queryVal, setQueryVal] = useState();//首个搜索框的值
  const [filtersList, setFiltersList] = useState({});
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy', orgID: orgID, buisUsg: buisUsgVal };//顶部搜索框值 传入接口

  const filterChange = (filters) => {
    setFiltersList(filters)
  }

  //初始默认列
  const concealColumns = {
    id: { show: false },
    zoneID: { show: false },
    createTime: { show: false },
    updateTime: { show: false },
  }
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language('project.assmngt.assinput.search')}
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

  //添加按钮点击触发
  const addClick = () => {
    getDynamicField('from', 'public');
    getModal(1, 'add');
  }

  //导入按钮
  const uploadClick = () => {
    getImportModal(1);
  }

  const [fileDownLoading, setFileDownLoading] = useState(false);
  const loadIcon = <LoadingOutlined spin />
  //导出按钮
  const downloadClick = (list = {}) => {
    let api = '/cfg.php?controller=confAssetManage&action=exportAsset';
    let data = list;
    data.orgID = orgID;
    data.buisUsg = buisUsgVal;
    data.queryVal = queryVal;
    data.filters = JSON.stringify(filtersList);
    DownnLoadFile(api, data, setFileDownLoading)
  }

  /** table组件 end */


  //区域数据
  const zoneType = 'zone';
  const [treeValue, setTreeValue] = useState();
  const [treeData, setTreeData] = useState([]);
  const [zoneVal, setZoneVal] = useState();//添加区域id、

  //组织机构
  const orgType = 'org';
  const [orgValue, setOrgValue] = useState();
  const [orgkey, setOrgkey] = useState([]);//选中多个key
  const [orgData, setOrgData] = useState([]);
  const [orgVal, setOrgVal] = useState();//添加组织结构id、

  //区域管理start
  //区域管理 获取默认列表
  const getTree = (id = 1) => {
    let data = {};
    data.id = id ? id : 1;
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
    formRef.current.setFieldsValue({ zoneID: selKyeNum });
    setTreeValue(selVal.join('/'));
    setOrgValue();
    setZoneVal(selKyeNum);
    //获取组织机构列表
    getOrg(selKyeNum);
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

  //组织机构 start
  //组织机构 获取默认列表
  const getOrg = (id = '') => {
    let data = {};
    data.id = id ? id : zoneVal ? zoneVal : 1;
    data.type = orgType;
    post('/cfg.php?controller=confZoneManage&action=showZoneTree', data).then((res) => {
      if (res.children.length > 0) {
        const treeInfoData = [
        ]
        res.children.map((item) => {
          let isLeaf = true;
          if (item.leaf == 'N') {
            isLeaf = false;
          }
          treeInfoData.push({
            id: item.id,
            pId: item.gpid,
            value: item.id,
            title: item.name,
            isLeaf: isLeaf,
          })
        })
        setOrgData(treeInfoData)
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  // 组织机构 查找父节点的值
  const orgwirelessVal = (value, parentId = false) => {
    let cValue = [];
    if (!parentId) {
      cValue.push(value)
    }
    orgData.forEach((each, index) => {
      if (each.id == value) {
        if (each.pId != 0) {
          orgData.forEach((item, key) => {
            if (each.pId == item.id) {
              if (item.pId != 0) {
                let wirelessArr = orgwirelessVal(item.id, 999);
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

  // 组织机构 下拉列表选中
  const onOrgSelect = (value, label, extra) => {
    let selKye = orgwirelessVal(value);
    selKye = selKye.reverse();//数组反转
    let selVal = [];//选中内容
    selKye.forEach(i => {
      orgData.forEach((item, key) => {
        if (i == item.value) {
          selVal.push(item.title);
        }
      })
    })
    let selKyeNum = selKye[selKye.length - 1];
    formRef.current.setFieldsValue({ orgID: selKyeNum });
    setOrgValue(selVal.join('/'));
    setOrgkey(selKye);
    setOrgVal(selKyeNum)
  };

  //组织机构 下拉处理
  const onOrgData = ({ id, children }) =>
    new Promise((resolve) => {
      if (children) {
        resolve();
        return;
      }
      let info = [];
      let data = {};
      data.id = id;
      data.type = orgType;
      post('/cfg.php?controller=confZoneManage&action=showZoneTree', data).then((res) => {
        res.children.map((item) => {
          let isLeaf = true;
          if (item.leaf == 'N') {
            isLeaf = false;
          }
          info.push({ id: item.id, title: item.name, isLeaf: isLeaf, pId: item.gpid, value: item.id })
        })
        setOrgData(
          orgData.concat(info),
        );
        resolve(undefined);
      });
    });
  //组织机构 end

  useEffect(() => {
    getDynamicField();
    getAssettype();
  }, [])


  //获取动态字段列表 attribute  private 私有  public 公有
  const getDynamicField = (type = 'table', attribute = 'public', buisusg = '') => {
    let data = {};
    data.filterType = 'dynamic';
    data.modtype = 'asset';
    data.attribute = attribute;
    data.buisusg = buisusg;
    post('/cfg.php?controller=confResField&action=showResFieldList', data).then((res) => {
      if (res.data) {
        if (attribute == 'public') {
          setDynamicFieldList(res.data);
          dynamicFieldArr = res.data;
          if (type == 'table') {
            tableList(type, res.data, columnsList, attribute);
          } else if (type == 'formtable') {
            tableList(type, res.data, columnsOld, attribute);
          } else {
            setPrivateField(res.data);
          }
        } else {
          if (type == 'table') {
            tableList(type, res.data, columnsOld, attribute);
          } else if (type == 'formtable') {
            tableList(type, res.data, columnsOld, attribute);
          } else {
            let arr = dynamicFieldList.length >= 1 ? dynamicFieldList : dynamicFieldArr;
            setPrivateField(arr.concat(res.data));
          }
        }
      }
    }).catch(() => {
      console.log('mistake')
    })
  }

  //处理表头数据
  const tableList = (type, data, list, attribute) => {
    let columnsArr = [...list];
    data.map((item) => {
      let info = {};
      info.title = item.name;
      info.dataIndex = item.key;
      info.ellipsis = true;
      info.importStatus = true;
      info.width = 100;
      columnsArr.splice(-3, 0, info);
    })
    if (attribute == 'public' && type == 'table') {
      setColumns([...columnsArr]);
      setColumnsOld([...columnsArr]);
      setColumnsNew([...columnsArr]);
      getBusinessPurpose(1, columnsArr)
    } else if (type == 'table') {
      setColumns([...columnsArr]);
      incAdd()
    } else {
      setColumnsNew([...columnsArr]);
    }
  }

  //区域管理处理
  const getTreeLeft = (res) => {
    let nowId = res.node.id;
    setOrgID(nowId);
    setTreeID(res.id);
    getTree(res.id);
    incAdd()
  }

  const incAdd = () => {
    let inc;
    clearTimeout(inc);
    inc = setTimeout(() => {
      setIncID(incID + 1);
    }, 100);
  }

  // 地址规划侧边点击id处理
  const onSelectLeft = (selectedKeys, info) => {
    if (info.node.type == 'buisUsg') {
      setOrgID('');//更新选中地址id
      getTree(treeID);
      setBuisUsgVal(selectedKeys[0]);
      getDynamicField('table', 'private', selectedKeys[0]);
    } else {
      setOrgID(selectedKeys[0]);//更新选中地址id
      getTree(selectedKeys[0]);
      getDynamicField('table', 'public');
      setBuisUsgVal('')
      incAdd();
    }

  };

  //判断是否弹出添加model
  const getModal = (status, op) => {
    if (status == 1) {
      setModalStatus(true);
    } else {
      formRef.current.resetFields();
      setModalStatus(false);
    }
  }

  const closeModal = () => {
    setMacDasabled(false);
    setTreeValue('');
    setZoneVal();
    setOrgValue('');
    setOrgVal();
    setOrgData([]);
    setPrivateField([]);
    getModal(2);
  }

  //添加修改接口
  const save = (info) => {
    let data = {};
    data.zoneID = zoneVal;
    data.orgID = orgVal;
    data.id = info.id;
    data.assetType = info.assetType;
    data.ipaddr = info.ipaddr;
    data.macaddr = info.macaddr;
    data.user = info.user;
    data.phone = info.phone;
    data.assetModel = info.assetModel;
    data.buisUsg = info.buisUsg;
    data.location = info.location;
    data.notes = info.notes;
    data.op = info.op ? 'mod' : 'add';
    privateField.map((item) => {
      data[item.key] = info[item.key]
    })
    post('/cfg.php?controller=confAssetManage&action=setAsset', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      closeModal();
      incAdd()
    }).catch(() => {
      console.log('mistake')
    })

  }

  //业务用途 获取资源字段 id
  const getBusinessPurpose = (id = 1, list = '') => {
    post('/cfg.php?controller=confResField&action=showResField', { id: id }).then((res) => {
      let content = [];
      res.data.map((item) => {
        let confres = [];
        confres.label = item;
        confres.value = item;
        content.push(confres)
      })
      setPurposeList(content);
      let info = [];
      res.data.map((item) => {
        info.push({ text: item, value: item });
      })
      let columnsList = list ? list : columns;
      columnsList.map((item) => {
        if (item.dataIndex == 'buisUsg') {
          item.filters = info;
          item.filterMultiple = false;
        }
      })
      setColumns([...columnsList]);
    }).catch(() => {
      console.log('mistake')
    })
  }

  //资产类型 id
  const getAssettype = (id = 4) => {
    post('/cfg.php?controller=confResField&action=showResField', { id: id }).then((res) => {
      let info = [];
      res.data.map((item) => {
        let confres = [];
        confres.label = item;
        confres.value = item;
        info.push(confres)
      })
      setAssettypeList(info)
    }).catch(() => {
      console.log('mistake')
    })
  }

  //删除数据
  const delList = (selectedRowKeys) => {
    let data = {};
    data.ids = selectedRowKeys.join(',');
    post('/cfg.php?controller=confAssetManage&action=delAsset', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      incAdd()
    }).catch(() => {
      console.log('mistake')
    })

  }

  //编辑
  const mod = (obj, op) => {
    let initialValues = obj;
    initialValues.op = 'mod';
    getDynamicField('from', 'private', initialValues.buisUsg);
    setTreeValue(obj.fullZone);
    setZoneVal(obj.zoneID);
    setOrgValue(obj.fullOrg);
    setOrgVal(obj.orgID);
    getModal(1, op);
    setMacDasabled(true);
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues)
    }, 100)
  }

  /* 导入 */
  const getImportModal = (status) => {
    if (status == 1) {
      setImoritModalStatus(true);
    } else {
      setImoritModalStatus(false);
    }
  }

  /* 导入弹框关闭 */
  const getCloseImport = () => {
    getImportModal(2);
    setImportBui(' ');
    setColumnsNew([...columnsOld]);
    setImportFieldsList([]);
    importArrFields = [];
    setImportFieldsArr([]);
    formRef.current.resetFields();
  }

  /* 导入成功文件返回 */
  const onFileSuccess = (res) => {
    if (res.success) {
      let info = [{ value: '', label: '请选择' }];
      res.data.map((val, index) => {
        res.data[index] = val.trim();
        let confres = [];
        confres.label = val;
        confres.value = index + '&&' + val.trim();
        info.push(confres)
      })
      setImportFieldsList(res.data);
      importArrFields = res.data;
      setImportFieldsArr(info);
    } else {
      setImpErrorMsg(res.msg);
      setImpErrorShow(true);
    }
  }

  /* 提交导入内容标题 */
  const importTitle = async (info) => {
    setSpinning(true);
    let data = {};
    data.headerLine = JSON.stringify(Object.values(info));
    data.field = JSON.stringify(Object.keys(info));
    post('/cfg.php?controller=confAssetManage&action=importAsset', data).then((res) => {
      setSpinning(false);
      if (!res.success) {
        setImpErrorMsg(res.msg)
        setImpErrorShow(true);
        return false;
      }
      getCloseImport();
      if (res.data && res.data.length >= 1) {
        setUpTableData(res.data)
        showUpTable('open');
      } else {
        message.success(res.msg);
        incAdd()
      }
    }).catch(() => {
      setSpinning(false);
      console.log('mistake')
    })

  }

  const showUpTable = (status) => {
    if (status == 'open') {
      setUpTableSta(true)
    } else {
      setUpTableData([])
      setUpTableSta(false)
    }
  }

  return (
    <>
      <Spin
        tip={language('project.sysdebug.wireshark.loading')}
        spinning={fileDownLoading}
        indicator={loadIcon}
      >
        <CardModal
          title={language('project.assmngt.assinput.organization')}
          cardHeight={clientHeight + 182}
          leftContent={
            <LeftTree getTree={getTreeLeft} onSelectLeft={onSelectLeft} treeInc={treeInc} treeUrl={treeUrl} leftTreeData={leftTreeData} buisUsgState={true} />
          }
          rightContent={
            <ProtableModule concealColumns={concealColumns} columns={columns} filterChange={filterChange} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} uploadButton={uploadButton} uploadClick={uploadClick} downloadButton={downloadButton} downloadClick={downloadClick} />
          } />
      </Spin>

      <DrawerForm  {...vermodal}
        layout="vertical"

        formRef={formRef}
        title={language('project.assmngt.assinput.inputoperate')}
        visible={modalStatus} autoFocusFirstInput
        drawerProps={{
          className: 'addinputfrom',
          destroyOnClose: true,
          maskClosable: false,
          placement: 'right',
          onClose: () => {
            closeModal(2)
          },
        }}
        submitTimeout={2000} onFinish={async (values) => {
          save(values);
        }}>
        <div className='addrplanborderbox'>
          <ProForm.Group>
            <ProFormText hidden={true} name="op" />
            <ProFormText hidden={true} name="id" />
            <ProFormText name="zoneID" rules={[{ required: true, message: regSeletcList.select.alertText }]} label={language('project.assmngt.assinput.zone')} >
              <TreeSelect
                style={{ width: 200 }}
                treeDataSimpleMode
                value={treeValue}
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: 'auto',
                }}
                placeholder={language("project.select")}
                onChange={onChangeSelect}
                loadData={onLoadData}
                treeData={treeData}
              />
            </ProFormText>

            <ProFormText name="orgID" rules={[{ required: true, message: regSeletcList.select.alertText }]} label={language('project.assmngt.assinput.org')} >
              <TreeSelect
                style={{ width: 200 }}
                treeDataSimpleMode
                value={orgValue}
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: 'auto',
                }}
                placeholder={language("project.select")}
                onChange={onOrgSelect}
                loadData={onOrgData}
                treeData={orgData}
              />
            </ProFormText>
          </ProForm.Group>
          <ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <ProFormText width="200px" name="id" hidden={true} />
            <ProFormText width="200px" name="ipaddr" label={language('project.assmngt.assinput.ipaddr')} rules={[{ required: true, pattern: regMacList.ip.regex, message: regMacList.ip.alertText }]} />
            <ProFormText width="200px" name="macaddr" disabled={macDasabled} label={language('project.assmngt.assinput.macaddr')} rules={[{ required: true, pattern: regMacList.mac.regex, message: regMacList.mac.alertText }]} />
          </ProForm.Group>
          <ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <ProFormText width="200px" name="user" label={language('project.assmngt.assinput.user')} rules={[{ required: true, pattern: regList.textareaEng.regex, message: regList.textareaEng.alertText }]} />
            <ProFormText width="200px" name="phone" label={language('project.assmngt.assinput.phone')} rules={[{ required: true, pattern: regList.phone.regex, message: regList.phone.alertText }]} />
          </ProForm.Group>
          <ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <ProFormSelect options={assettypeList}
              width="200px"
              name="assetType"
              label={language('project.assmngt.assinput.assettype')}
              rules={[{ required: true, message: language("project.fillin") }]}
            />
            <ContentText width="200px" name="assetModel" label={language('project.assmngt.assinput.assetmodel')} required={true} />
          </ProForm.Group>
          <ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <ContentText width="200px" name="location" label={language('project.assmngt.assinput.location')} required={true} />
            <ProFormSelect options={purposeList}
              width="200px"
              name="buisUsg"
              onChange={(e) => {
                let type = 'public'
                if (e) {
                  type = 'private';
                }
                getDynamicField('form', type, e);
              }}
              label={language('project.assmngt.assinput.businesspurpose')}
              rules={[{ required: true, message: language("project.fillin") }]}
            />
          </ProForm.Group>
          {
            privateField.length - 1 == -1 ? '' :
              privateField.map((item, index) => {
                //判断输入形式是下拉框还是列表框
                let info = [];
                if (item.form == 'list') {
                  let contents = item.content.split(',');
                  if (contents.length > 0) {
                    contents.map((val) => {
                      let confres = [];
                      confres.label = val;
                      confres.value = val;
                      info.push(confres)
                    })
                  }
                }
                if (index % 2 == 0) {
                  if (privateField.length - 1 < index + 1) {
                    return (
                      <div className='dynamicbox'>
                        <div style={{ paddingLeft: 10 }}>
                          {item.form == 'box' ?
                            <ProFormText
                              width={toptextcontent}
                              label={item.name}
                              name={item.key}
                              rules={DynFieldReg(item.type, item.required)}
                              valueType="text"
                            /> :
                            <ProFormSelect
                              width={toptextcontent}
                              options={info}
                              name={item.key}
                              label={item.name}
                              rules={DynFieldReg(item.type, item.required)}
                            />
                          }
                        </div>
                      </div>
                    )
                  } else {
                    let privateFieldLen = privateField.length - 1;
                    let infoList = [];
                    if (privateFieldLen >= index + 1) {
                      if (privateField[index + 1].form == 'list') {
                        let contents = privateField[index + 1].content.split(',');
                        if (contents.length > 0) {
                          contents.map((val) => {
                            let confres = [];
                            confres.label = val;
                            confres.value = val;
                            infoList.push(confres)
                          })
                        }
                      }
                    }
                    return (
                      <ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        {item.form == 'box' ?
                          <ProFormText
                            width={toptextcontent}
                            label={item.name}
                            name={item.key}
                            rules={DynFieldReg(item.type, item.required)}
                            valueType="text"
                          /> :
                          <ProFormSelect
                            width={toptextcontent}
                            options={info}
                            name={item.key}
                            label={item.name}
                            rules={DynFieldReg(item.type, item.required)}
                          />
                        }
                        {
                          privateFieldLen < 1 ? ' ' :
                            privateField[index + 1].form == 'box' ?
                              <ProFormText
                                width={toptextcontent}
                                label={privateField[index + 1].name}
                                name={privateField[index + 1].key}
                                rules={DynFieldReg(privateField[index + 1].type, privateField[index + 1].required)}
                                valueType="text"
                              /> :
                              <ProFormSelect
                                width={toptextcontent}
                                options={infoList}
                                name={privateField[index + 1].key}
                                label={privateField[index + 1].name}
                                rules={DynFieldReg(privateField[index + 1].type, privateField[index + 1].required)}
                              />
                        }
                      </ProForm.Group>

                    )
                  }

                }
              })
          }
        </div>
        <div style={{ paddingLeft: 10 }}>
          <NotesText width="443px" className='textarea' name="notes" label={language('project.assmngt.assinput.remark')} required={false} /> 
        </div>
      </DrawerForm>

      {/**导出功能 */}
      <DrawerForm {...modalFormLayout}
        formRef={formRef}
        title={language('project.import')}
        visible={imoritModalStatus} autoFocusFirstInput
        drawerProps={{
          className: 'afilemodal',
          destroyOnClose: true,
          maskClosable: false,
          placement: 'right',
          onClose: () => {
            getCloseImport(2)
          },
        }}
        submitter={{
          render: (props, doms) => {
            return [
              doms[0],
              <Button type='primary' key='subment'
                onClick={() => {
                  formRef.current.submit();
                }}
                loading={spinning}
              >
                {language('project.import')}
              </Button>
            ]
          }
        }}
        submitTimeout={2000}
        onFinish={async (values) => {
          importTitle(values);
        }}
      >
        <div className='dynamicbox' style={{ marginLeft: '10px' }}>
          <Alert className='filealert' message={language('project.assmngt.assinput.uploadfilebuisusgprivatefield')} type="info" showIcon />
          <div style={{ marginLeft: '4px' }}>
            <ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
              <ProFormSelect options={purposeList}
                width="200px"
                onChange={(e) => {
                  let type = 'public'
                  if (e) {
                    type = 'private';
                  }
                  setImportBui(e);
                  getDynamicField('formtable', type, e);
                }}
                label={language('project.assmngt.assinput.businesspurpose')}
                name='spurpose'
                rules={[
                  {
                    required: true,
                    message: language('project.cfgmngt.ctrlcmd.required'),
                  },
                ]}
              />
            </ProForm.Group>
          </div>
          <ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <ProFormText tooltip={language('project.cfgmngt.syszone.fileformatcsv')} label={language('project.cfgmngt.syszone.import')} >
              <div className='importupDiv'>
                <WebUploadr
                  isAuto={true}
                  upurl={uploadConfig.url}
                  upbutext={language('project.cfgmngt.syszone.importfile')}
                  maxSize={uploadConfig.max}
                  accept={uploadConfig.accept}
                  onSuccess={onFileSuccess}
                  parameter={paramentUpload}
                  isUpsuccess={true}
                  isShowUploadList={true}
                  maxCount={1}
                />
              </div>
            </ProFormText>
          </ProForm.Group>
          {impErrorShow ? <Alert className='filealert'
            message={impErrorMsg}
            type="error"
            onClose={() => {
              setImpErrorShow(false);
            }}
            showIcon closable /> : ''}

        </div>
        <Divider orientation='left'>{language('project.datamapping')}</Divider>
        <div className='addrplanborderbox'>
          <ProForm.Group style={{ width: "100%" }}>
            <div style={{ width: '200px', marginBottom: '12px' }}>
              {language('project.importfilefields')}
            </div>
            <div style={{ width: '200px', marginBottom: '12px' }}>
              {language('project.mappingfields')}
            </div>
          </ProForm.Group>
          {
            columnsNew.map((item) => {
              if (item.importStatus) {
                if (item.title == language('project.assmngt.assinput.businesspurpose')) {
                  if (importFieldsList.length >= 1 && importFieldsArr.length >= 1) {
                    return (
                      <ProForm.Group style={{ width: "100%" }}>
                        <ProFormText
                          width="200px"
                          value={importBui}
                          disabled
                        />
                        <ProFormSelect
                          hidden={true}
                          width="200px"
                          options={importFieldsArr}
                          name={item.dataIndex}
                          initialValue={importFieldsList.indexOf(item.title) == -1 ? '' : importFieldsList.indexOf(item.title) + '&&' + item.title}
                          fieldProps={{
                            allowClear: false,
                          }}
                        />
                        <ProFormText
                          width="200px"
                          value={item.title}
                          disabled
                        />
                      </ProForm.Group>
                    )
                  }
                } else {
                  if (importFieldsList.length >= 1 && importFieldsArr.length >= 1) {
                    return (
                      <ProForm.Group style={{ width: "100%" }}>
                        <ProFormSelect
                          width="200px"
                          options={importFieldsArr}
                          name={item.dataIndex}
                          initialValue={importFieldsList.indexOf(item.title) == -1 ? '' : importFieldsList.indexOf(item.title) + '&&' + item.title}
                          fieldProps={{
                            allowClear: false,
                          }}
                        />
                        <ProFormText
                          width="200px"
                          value={item.title}
                          disabled
                        />
                      </ProForm.Group>
                    )
                  } else {
                    return (
                      <ProForm.Group style={{ width: "100%" }}>
                        <ProFormSelect
                          width="200px"
                          fieldProps={{
                            allowClear: false,
                          }}
                        />
                        <ProFormText
                          width="200px"
                          value={item.title}
                          disabled
                        />
                      </ProForm.Group>
                    )
                  }
                }
              }
            })}
        </div>
      </DrawerForm>
      {/* 导入表格 */}
      <DrawerForm
        title={language('project.assmngt.assinput.errorinfo')}
        width={'1000px'}
        visible={upTableSta}
        onVisibleChange={setUpTableSta}
        drawerProps={{
          className: "uploadForm",
          placement: 'right',
          destroyOnClose: true,
          closable: false,
          maskClosable: false,
          extra: (
            <CloseOutlined
              className="closeIcon"
              onClick={() => {
                showUpTable('close')
              }}
            />
          ),
        }}
        submitter={false}
        onFinish={async (values) => { }}
      >
        <ProTable
          bordered={true}
          columns={columnsMsg}
          scroll={{ y: clientHeight }}
          dataSource={upTableData}
          search={false}
          options={true}
          rowSelection={false}
          rowKey="id"
          pagination={false}
        />
      </DrawerForm>
    </>
  );
};

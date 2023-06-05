import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, message, Modal, Spin, Tree, Form, Divider, Tooltip, Table, Alert, Tag } from 'antd';
import { fileDown, post } from '@/services/https';
import { ProTable } from '@ant-design/pro-components';
import { UnorderedListOutlined, FileOutlined, IdcardFilled, ClusterOutlined, InfoCircleFilled, DeleteFilled, EditFilled, UploadOutlined, DownloadOutlined, FlagFilled } from '@ant-design/icons';
import ProForm, { ProFormDatePicker, ProFormSelect, ProFormText, DrawerForm, ProFormRadio, ProFormDateTimePicker, ModalForm } from '@ant-design/pro-form';
import { modalFormLayout, drawFormLayout } from "@/utils/helper";
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { Base64 } from 'js-base64';
import { regMacList, regList } from '@/utils/regExp';
import Uploadd from '@/utils/Upload';
import moment from 'moment';
import '@/utils/index.less';
import './index.less';
import store from 'store';
import { language } from '@/utils/language';
import { DynFieldReg } from '@/components';
const { Search } = Input
let H = document.body.clientHeight - 102
var clientHeight = H
var cardHeightTop = clientHeight - 415 < 256 ? 256 : clientHeight - 415;
var toptextcontent = '170px'
export default () => {
    const topcolumns = [
        {
            title: language('project.resmngt.addrallc.ipaddr'),
            dataIndex: 'ipaddr',
            align: 'left',
            fixed: 'left',
            ellipsis: true,
        },
        {
            title: language('project.resmngt.addrallc.subnet'),
            dataIndex: 'subnet',
            align: 'left',
            ellipsis: true,
        },
        {
            title: language('project.resmngt.addrallc.subnetmask'),
            dataIndex: 'maskSize',
            align: 'left',
            ellipsis: true,
        },
        {
            title: language('project.resmngt.addrallc.defaultgateway'),
            dataIndex: 'gatewayIP',
            align: 'left',
            ellipsis: true,
        },
        {
            title: language('project.resmngt.addrallc.vlan'),
            dataIndex: 'vlan',
            align: 'left',
            width: 80,
            ellipsis: true,
        },
    ]

    const columns = [
        {
            title: language('project.sysconf.subnet.id'),
            dataIndex: 'id',
            align: 'left',
            importStatus: 1,
            width: 120,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.addrallc.distributionstatistics'),
            dataIndex: 'tolIPNum',
            importStatus: 0,
            align: 'left',
            ellipsis: true,
            width: 120,
            render: (text, record) => {
                return (<div>
                    <IdcardFilled style={{ color: '#12C189' }} />
                    <span style={{ marginLeft: '3px', marginRight: '7px', width: '20px', textAlign: 'right', display: 'inline-block' }}>{record.allocIPNum == 0 ? 0 : record.allocIPNum}</span>
                    <ClusterOutlined />
                    <span style={{ marginLeft: '3px', width: '20px', textAlign: 'right', display: 'inline-block' }}>{record.tolIPNum}</span>
                </div>);
            }
        },
        {
            title: language('project.sysconf.subnet.subaddress'),
            dataIndex: 'subNetaddr',
            importStatus: 0,
            align: 'left',
            width: 120,
            ellipsis: true,
        },
        {
            title: language('project.sysconf.subnet.subnetmask'),
            dataIndex: 'maskSize',
            align: 'left',
            importStatus: 0,
            width: 80,
            ellipsis: true,
        },
        {
            title: language('project.sysconf.subnet.gateway'),
            dataIndex: 'gatewayIP',
            align: 'left',
            importStatus: 0,
            width: 120,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.addrallc.vlan'),
            dataIndex: 'vlan',
            align: 'left',
            importStatus: 0,
            width: 80,
            ellipsis: true,
        },

        {
            title: language('project.sysconf.subnet.location'),
            dataIndex: 'location',
            align: 'left',
            importStatus: 0,
            width: 120,
            ellipsis: true,
        },
        {
            title: language('project.sysconf.subnet.purpose'),
            dataIndex: 'buisUsg',
            align: 'left',
            importStatus: 0,
            width: 120,
            ellipsis: true,
        },
        {
            title: language('project.sysconf.subnet.cycleTime'),
            dataIndex: 'cycleTime',
            tip: language('project.sysconf.subnet.day'),
            align: 'left',
            importStatus: 0,
            width: 120,
            ellipsis: true,
        },

        {
            width: 90,
            title: language('project.operate'),
            align: 'center',
            fixed: 'right',
            importStatus: 1,
            render: (text, record, _, action) => [
                <a key="editable"
                    onClick={() => {
                        closeFootListBox();
                        getBottonList(record.id, record);
                    }}>
                    {language('project.resmngt.addrallc.addresslists')}
                </a>,

            ],
        },
    ];
    const fieldsLists = [
        {
            title: language('project.resmngt.addrallc.ipaddr'),
            dataIndex: 'ipaddr',
            importStatus: 0,
        },
        {
            title: language('project.resmngt.addrallc.sbuipaddr'),
            dataIndex: 'subnet',
            importStatus: 0,
        },
        {
            title: language('project.resmngt.addrallc.macaddr'),
            dataIndex: 'macaddr',
            importStatus: 0,
        },
        {
            title: language('project.resmngt.addrallc.user'),
            dataIndex: 'user',
            importStatus: 0,
        },
        {
            title: language('project.resmngt.addrallc.phone'),
            dataIndex: 'phone',
            importStatus: 0,
        },
        {
            title: language('project.resmngt.addrallc.servicelife'),
            dataIndex: 'expireTime',
            importStatus: 0,
        },
        {
            title: language('project.resmngt.addrallc.location'),
            dataIndex: 'location',
            importStatus: 0,
        },
        {
            title: language('project.resmngt.addrallc.businesspurpose'),
            dataIndex: 'buisUsg',
            importStatus: 0,
        },

    ]
    const [fieldsList, setFieldsList] = useState(fieldsLists);
    const [sOperationStatus, setSOperationStatus] = useState(1);//多选操作状态
    const pageStart = false;//分页状态是否启用
    const [purposeList, setPurposeList] = useState([]);//业务用途
    const [nowExporeTime, setNowExporeTime] = useState();//选择时间
    const [dataList, setList] = useState([]);//列表数据
    const [initialValue, setInitialValue] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);//选中id数组
    const [selectedRowNames, setSelectedRowNames] = useState([]);//选中名称数组
    const [drawLeftStatus, setDrawLeftStatus] = useState(false);//draw   添加左侧弹框状态
    const [drawRightStatus, setDrawRightStatus] = useState(false);//draw   添加右侧弹框状态
    const [topDrawStatus, setTopDrawStatus] = useState(false);//顶部弹出框状态
    const [leftOperation, setLeftOperation] = useState();//两侧操作按钮的显示
    const [topdata, setTopData] = useState([]);//顶部弹出选中数据
    const [iPSubNetFind, setIPSubNetFind] = useState([]);//侧边顶部弹出数据内容
    const [selectModeVal, setSelectModeVal] = useState(0);//选择单选多选模式
    const [selectTimeVal, setSelectTimeVal] = useState('forever');//判断使用期限
    const [delStatus, setipDelStatus] = useState(true);//选中id数组
    const [timeShow, setTimeShow] = useState(false);//有效时间隐藏显示
    const [queryVal, setQueryVal] = useState('');//搜索值
    const [totalPage, setTotalPage] = useState(0);//总条数
    const [nowPage, setNowPage] = useState(1);//当前页码
    const [treelist, setTreelist] = useState([]);
    const [treelistKey, setTreelistKey] = useState([1]);//设置默认展开节点
    const [loading, setLoading] = useState(true);//加载
    const startVal = 1;
    const limitVal = store.get('pageSize') ? store.get('pageSize') : 10;//默认每页条数
    const queryType = 'fuzzy';//默认模糊查找
    const [orgId, setorgId] = useState();
    const [iPAddrList, setIPAddrList] = useState([]);
    const { confirm } = Modal;
    const [footLoading, setFootLoading] = useState(false);
    const [dynamicFieldList, setDynamicFieldList] = useState([]);//动态字段列表
    const [submitType, setSubmitType] = useState();

    const [ifImport, setIfImport] = useState(true);//显示上传 or 显示匹配字段
    const [imoritModalStatus, setImoritModalStatus] = useState(false);//导入 上传文件弹出框
    const [importFieldsList, setImportFieldsList] = useState(false);//导入 选择字段
    const [fileCode, setFileCode] = useState('utf-8');//文件编码
    //接口参数
    const paramentUpload = {
        'filecode': fileCode,
    }
    const fileList = [];
    const uploadConfig = {
        accept: 'csv', //接受上传的文件类型：zip、pdf、excel、image
        max: 100000000000000, //限制上传文件大小
        url: '/cfg.php?controller=confIPAddrManage&action=importIPAddr',
    }

    //列表数据
    const actionRef = useRef();
    const formRef = useRef();
    const [treeValue, setTreeValue] = useState();
    const [treeData, setTreeData] = useState([]);
    const [selectedKey, setSelectedKey] = useState([])
    const [columnsHide, setColumnsHide] = useState({
        id: { show: false },
        orgId: { show: false },
        createTime: { show: false },
        updateTime: { show: false }
    });//设置默认列

    useEffect(() => {
        if (treeValue) {
            setTimeout(function () {
                formRef.current.setFieldsValue({ gpname: treeValue })
            }, 100)
        } else {
            setLoading(true);
            //业务用途列表
            getBusinessPurpose();
            getDynamicField();
        }
    }, [treeValue])

    //获取动态字段列表
    const getDynamicField = () => {
        let data = {};
        data.filterType = 'dynamic';
        data.modtype = 'resource';
        post('/cfg.php?controller=confResField&action=showResFieldList', data).then((res) => {
            if (res.data.length > 0) {
                setDynamicFieldList(res.data);
                let info = fieldsList;
                res.data.map((item) => {
                    info.push({ title: item.name, dataIndex: item.key, importStatus: 0 })
                })
                setFieldsList(info);
            }

            getTreeKey();
        }).catch(() => {
            console.log('mistake')
        })
    }


    //区域管理侧边展开
    const onExpand = (expandedkeysValue) => {
        setTreelistKey(expandedkeysValue);
    }

    //业务用途 获取资源字段 id
    const getBusinessPurpose = (id = 1) => {
        post('/cfg.php?controller=confResField&action=showResField', { id: id }).then((res) => {
            let info = [];
            res.data.map((item) => {
                let confres = [];
                confres.label = item;
                confres.value = item;
                info.push(confres)
            })
            setPurposeList(info)
        }).catch(() => {
            console.log('mistake')
        })
    }

    const getTreeKey = () => {
        post('/cfg.php?controller=confIPAddrManage&action=showFirstIPSubNetAddr').then((res) => {
            let key = res.data.gpath ? res.data.gpath.split('.') : ['1'];
            setTreelistKey(key)
            getTree('', res.data.org_id);
        }).catch(() => {
            console.log('mistake')
        })
    }
    const iconTreeList = (list) => {
        if (list.name) {
            list.icon = <UnorderedListOutlined />;
        }
        list.children.map((item) => {
            if (item.leaf == 'N') {
                item.icon = <UnorderedListOutlined />;
                item = iconTreeList(item);
            } else {
                item.icon = <FileOutlined />;
            }
        });
        return list;
    }
    //区域管理处理
    const getTree = (id = 1, orgId = 0) => {
        let data = {};
        data.id = id;
        data.type = 'tree';
        data.depth = 1;
        post('/cfg.php?controller=confZoneManage&action=showZoneTree', data).then((res) => {
            const treeInfoData = [
                res.node,
            ];
            setTreeData(treeInfoData)
            let list = [];
            list.push(iconTreeList(res));
            setTreelist(list);
            let org_id = orgId ? orgId : res.node.id;
            setorgId(org_id);
            let keys = [];
            keys.push(org_id)
            setSelectedKey(keys);
            getList(startVal, limitVal, '', org_id);
        }).catch(() => {
            console.log('mistake')
        })
    }
    // 区域管理侧边点击id处理
    const onSelectLeft = (selectedKeys, info) => {
        setSelectedKey(selectedKeys)
        setorgId(selectedKeys[0]);//更新选中地址id
        getList(startVal, limitVal, '', selectedKeys[0]);
    };


    //start  数据起始值   limit 每页条数 
    const getList = (pagestart = '', pagelimit = '', value = '', org_id = 0, subnetID = 0) => {
        setLoading(true);
        let page = pagestart != '' ? pagestart : startVal;
        let data = {};
        data.queryVal = value != '' ? value : queryVal;
        // 分页暂时禁用
        if (pageStart) {
            data.limit = pagelimit != '' ? pagelimit : limitVal;
            data.start = (page - 1) * data.limit;
        }
        data.orgID = org_id == 0 ? orgId : org_id;
        data.queryType = queryType;
        post('/cfg.php?controller=confIPAddrManage&action=showIPSubNetAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            setLoading(false);
            setTotalPage(res.total)
            setList(res.data);
            closeFootListBox();
            if (res.data.length < 1) {
                getBottonList();
            } else {
                if (subnetID == 0) {
                    getBottonList(res.data[0].id, res.data[0]);

                } else {
                    res.data.map((item) => {
                        if (item.id == subnetID) {
                            getBottonList(subnetID, item);
                        }
                    })
                }
            }
        }).catch(() => {
            console.log('mistake')
        })
    }

    //搜索
    const handsearch = (values) => {
        setQueryVal(values);
        getList(startVal, limitVal, values);
    }

    //选中触发
    const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
        let names = [];
        if (selectedRows.length > 0) {
            selectedRows.map((item) => {
                names.push(item.name);
            })
        }
        setSelectedRowNames(names);
        setSelectedRowKeys(selectedRowKeys)
        let deletestatus = true;
        if (selectedRowKeys != false) {
            deletestatus = false;
        }
        setipDelStatus(deletestatus);//添加删除框状态
    }

    //底部掩码数据列表
    const getBottonList = (subnetID, record = []) => {
        if (!subnetID) {
            setIPSubNetFind(record);
            setIPAddrList([]);
            return false;
        }
        let data = {};
        data.subnetID = subnetID;
        post('/cfg.php?controller=confIPAddrManage&action=showIPAddrList', data).then((res) => {
            setFootLoading(false);
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            res.data.map((item, index) => {
                item.xzstatus = 1;
                if (item.mngState == 'reserve') {
                    item.sOperationStatus = 2;
                } else {
                    item.sOperationStatus = 1;
                }
            })
            setIPSubNetFind(record);
            setIPAddrList(res.data);
        }).catch(() => {
            console.log('mistake')
        })
    }

    //button 按钮处理
    const generateMenus = (data) => {
        if (iPAddrList.length < 1) {
            return <></>;
        }
        return iPAddrList.map((item, index) => {
            let optionClassName = ''
            if (item.sOperationStatus == 2) {
                optionClassName = ' selectoptionname'
            }
            let classname = 'buttonassigned';
            if (item.mngState == 'unassigned') {
                classname = 'buttonunassigned'
            } else if (item.mngState == 'reserve') {
                classname = 'buttonreserve'
            }else if(item.mngState == 'preassign'){
				classname = 'buttonpreassign'
			}
            if (parseInt((index) % 32) == 0 && index != 0) {
                return (
                    <>
                        <br />
                        <Button key={item.id} data-value={1}
                            onClick={() => {
                                if (item.valid == 'Y' && item.mngState != 'reserve' && item.mngState != 'preassign') {
                                    getDrawModal(1, item, index);
                                }
                            }}
                            className={item.xzstatus == 1 ? 'buttonbox ' + (classname) + (optionClassName) : 'buttonbox checkbuttonassigned' + (optionClassName)}
                        >
                            {item.valid == 'Y' ? item.id : ' '}
                        </Button>
                    </>
                )
            } else {
                return (
                    <Button key={item.id}
                        onClick={() => {
                            if (item.valid == 'Y' && item.mngState != 'reserve' && item.mngState != 'preassign') {
                                getDrawModal(1, item, index);
                            }
                        }}
                        className={item.xzstatus == 1 ? 'buttonbox ' + (classname) + (optionClassName) : 'buttonbox checkbuttonassigned' + (optionClassName)}
                    >
                        {item.valid == 'Y' ? item.id : ' '}
                    </Button>
                )
            }
        })
    }

    //判断是否弹出添加drawmodel
    const getDrawModal = (status, record, index) => {
        let addStatus = 1;
        if (record) {
            topdata?.map((item) => {
                if (item.mngState != record?.mngState) {
                    addStatus = 2;
                }
            })
        }
        if (addStatus == 1) {
            if (status == 1) {
                iPAddrList.map((val) => {
                    if (record?.mngState != val.mngState) {
                        val.sOperationStatus = 2;
                    }
                    if (record.id == val.id) {
                        val.xzstatus = 2;
                    }
                })
                let iPAddrInfo = iPAddrList;
                setIPAddrList([...iPAddrInfo]);
            }
            if (selectModeVal == 1) {
                setSOperationStatus(record?.mngState);
                checkSelect(status, record, index);
            } else {
                radioSelect(status, record, index);
            }
        }
    }

    //多选弹出
    const checkSelect = (status, record, index) => {
        if (status == 1) {
            let nStatus = 1;
            //如果页面已弹出择只添加数据
            let dataInfo = topdata;
            dataInfo.map((item) => {
                if (item.id == record.id) {
                    nStatus = 2;
                }
            })
            if (nStatus === 1) {
                record.gatewayIP = iPSubNetFind.gatewayIP;
                record.vlan = iPSubNetFind.vlan;
                record.maskSize = iPSubNetFind.maskSize;
                dataInfo.push(record);
                setTopData([...dataInfo]);
            } else {
                if (dataInfo.length <= 1) {
                    setTopData(dataInfo.filter((item) => item.id != record.id));
                    initButtonList();
                    setTopDrawStatus(false);
                } else {
                    setTopData(dataInfo.filter((item) => item.id != record.id));
                }
                iPAddrList.map((val) => {
                    if (record.id == val.id) {
                        val.xzstatus = 1;
                        val.sOperationStatus = 1;
                    }
                })
                let iPAddrInfo = iPAddrList;
                setIPAddrList([...iPAddrInfo]);
            }
            if (!topDrawStatus) {
                setTopDrawStatus(true);
            }
        } else {
            checkClose();
        }
    }

    //多选关闭
    const checkClose = () => {
        setTopData([])
        initButtonList();
        formRef.current.resetFields();
        setTopDrawStatus(false);
    }

    //单选弹出
    const radioSelect = (status, record, index) => {
        if (status == 1) {
            if (parseInt((index) % 32) < 16) {
                setDrawRightStatus(true)
            } else {
                setDrawLeftStatus(true)
            }
            let nowTime = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            record.expireTime = record.validType == 'forever' ? nowTime : record.expireTime;
            //设置有效时间的显示隐藏
            if (record.validType == 'expire') {
                setTimeShow(true)
            } else {
                setTimeShow(false)
            }
            //判断是否分配显示对应按钮
            if (record.mngState == 'assigned') {
                setLeftOperation(1)
            } else if (record.mngState == 'unassigned') {
                setLeftOperation(2)
            } else {
                setLeftOperation(3)
            }
            let initialValues = record;
            setNowExporeTime(record.expireTime)
            setInitialValue(initialValues);
            setTimeout(function () {
                formRef.current.setFieldsValue(initialValues)
            }, 100)
        } else {
            radioClose();
        }
    }

    //底部数据加载框
    const closeFootListBox = () => {
        setFootLoading(true);
    }

    //单选关闭
    const radioClose = () => {
        initButtonList();
        formRef.current.resetFields();
        setDrawRightStatus(false);
        setDrawLeftStatus(false);
    }

    //按钮列表颜色初始化
    const initButtonList = () => {
        iPAddrList.map((val) => {
            val.xzstatus = 1;
            val.sOperationStatus = 1;
        })
        setIPAddrList(iPAddrList)
    }

    //批量回收
    const batchIpRecovery = () => {
        let ipaddrs = [];
        if (topdata.length > 0) {
            topdata.map((item) => {
                ipaddrs.push(item.ipaddr);
            })
        }

        let data = {};
        data.ipaddrs = ipaddrs.join(',');
        post('/cfg.php?controller=confIPAddrManage&action=cycleIPAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(res.msg);
            getList('', '', '', '', iPSubNetFind.id);
            // getBottonList(iPSubNetFind.id, iPSubNetFind);
            closeFootListBox();
            checkClose();
        })
    }

    //批量分配
    const batchDistribution = () => {
        let fieldData = ['validType', 'expireTime', 'user', 'location', 'phone', 'buisUsg'];
        dynamicFieldList.map((item) => {
            fieldData.push(item.key)
        })
        let obj = formRef.current.getFieldsValue(fieldData);
        let buisUsg = '';
        purposeList.map((item) => {
            if (item.value == obj.buisUsg) {
                buisUsg = item.label;
            }
        })
        let ipaddrs = [];
        if (topdata.length > 0) {
            topdata.map((item) => {
                ipaddrs.push(item.ipaddr);
            })
        }

        let data = {};
        data.ipaddrs = ipaddrs.join(',');
        data.validType = obj.validType;
        if (obj.validType == 'forever') {
            data.expireTime = 0;
        } else {
            data.expireTime = nowExporeTime;
        }
        data.user = obj.user;
        data.phone = obj.phone;
        data.buisUsg = obj.buisUsg;
        data.buisUsg = buisUsg;
        data.location = obj.location;
        data.subnetID = iPSubNetFind.id;
        dynamicFieldList.map((item) => {
            data[item.key] = obj[item.key]
        })
        post('/cfg.php?controller=confIPAddrManage&action=batchAssignIPAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(res.msg);
            getList('', '', '', '', iPSubNetFind.id);
            // getBottonList(iPSubNetFind.id, iPSubNetFind);
            closeFootListBox();
            checkClose();
        })
    }

    //批量变更
    const batchChange = () => {
        let fieldData = ['validType', 'expireTime', 'user', 'location', 'phone', 'buisUsg'];
        dynamicFieldList.map((item) => {
            fieldData.push(item.key)
        })
        let obj = formRef.current.getFieldsValue(fieldData);
        let buisUsg = '';
        purposeList.map((item) => {
            if (item.value == obj.buisUsg) {
                buisUsg = item.label;
            }
        })
        let ipaddrs = [];
        if (topdata.length > 0) {
            topdata.map((item) => {
                ipaddrs.push(item.ipaddr);
            })
        }

        let data = {};
        data.ipaddrs = ipaddrs.join(',');
        // data.validType = selectTimeVal;
        data.validType = obj.validType;
        if (obj.validType == 'forever') {
            data.expireTime = 0;
        } else {
            data.expireTime = nowExporeTime;
        }
        data.user = obj.user;
        data.phone = obj.phone;
        data.buisUsg = obj.buisUsg;
        data.buisUsg = buisUsg;
        data.location = obj.location;
        data.subnetID = iPSubNetFind.id;
        dynamicFieldList.map((item) => {
            data[item.key] = obj[item.key]
        })
        post('/cfg.php?controller=confIPAddrManage&action=batchChangeIPAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(res.msg);
            getList('', '', '', '', iPSubNetFind.id);
            // getBottonList(iPSubNetFind.id, iPSubNetFind);
            closeFootListBox();
            checkClose();
        })
    }

    //分配
    const distribution = () => {
        let fieldData = ['macaddr', 'validType', 'expireTime', 'user', 'location', 'phone', 'buisUsg'];
        dynamicFieldList.map((item) => {
            fieldData.push(item.key)
        })
        let obj = formRef.current.getFieldsValue(fieldData);
        let buisUsg = '';
        purposeList.map((item) => {
            if (item.value == obj.buisUsg) {
                buisUsg = item.label;
            }
        })
        let data = {};
        data.ipaddr = initialValue.ipaddr;
        data.macaddr = obj.macaddr;
        data.validType = obj.validType;
        if (obj.validType == 'forever') {
            data.expireTime = 0;
        } else {
            data.expireTime = nowExporeTime;
        }
        data.user = obj.user;
        data.phone = obj.phone;
        data.buisUsg = obj.buisUsg;
        data.buisUsg = buisUsg;
        data.location = obj.location;
        data.subnetID = iPSubNetFind.id;
        dynamicFieldList.map((item) => {
            data[item.key] = obj[item.key]
        })
        post('/cfg.php?controller=confIPAddrManage&action=assignIPAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(res.msg);
            radioClose();
            closeFootListBox();
            getList('', '', '', '', iPSubNetFind.id);
        })
    }

    //变更
    const ipChange = () => {
        let fieldData = ['macaddr', 'validType', 'expireTime', 'user', 'location', 'phone', 'buisUsg'];
        dynamicFieldList.map((item) => {
            fieldData.push(item.key)
        })
        let obj = formRef.current.getFieldsValue(fieldData);
        let buisUsg = '';
        purposeList.map((item) => {
            if (item.value == obj.buisUsg) {
                buisUsg = item.label;
            }
        })
        let data = {};
        data.ipaddr = initialValue.ipaddr;
        data.macaddr = obj.macaddr;
        data.validType = obj.validType;
        if (obj.validType == 'forever') {
            data.expireTime = 0;
        } else {
            data.expireTime = nowExporeTime;
        }
        data.user = obj.user;
        data.phone = obj.phone;
        data.buisUsg = obj.buisUsg;
        data.buisUsg = buisUsg;
        data.location = obj.location;
        data.subnetID = iPSubNetFind.id;
        dynamicFieldList.map((item) => {
            data[item.key] = obj[item.key]
        })
        post('/cfg.php?controller=confIPAddrManage&action=changeIPAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(res.msg);
            getList('', '', '', '', iPSubNetFind.id);
            closeFootListBox();
            radioClose();
        })
    }

    //回收
    const ipRecovery = (type) => {
        let data = {};
        if (type == 1) {
            data.ipaddrs = initialValue.ipaddr;
        }
        post('/cfg.php?controller=confIPAddrManage&action=cycleIPAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(res.msg);
            getList('', '', '', '', iPSubNetFind.id);
            closeFootListBox();
            radioClose();
        })
    }

    //动态字段
    const modDynamicField = (type) => {
        return dynamicFieldList.map((item) => {
            //判断输入形式是下拉框还是列表框
            if (item.form == 'box') {
                return (
                    <ProFormText
                        name={item.key}
                        label={item.name}
                        rules={type != 1 ? DynFieldReg(item.type, item.required) : ''}
                    />
                )
            } else {
                let info = [];
                let contents = item.content.split(',');
                if (contents.length > 0) {
                    contents.map((val) => {
                        let confres = [];
                        confres.label = val;
                        confres.value = val;
                        info.push(confres)
                    })
                }
                return (
                    <ProFormSelect
                        options={info}
                        name={item.key}
                        label={item.name}
                        rules={type != 1 ? DynFieldReg(item.type, item.required) : ''}
                    />
                )
            }
        })
    }

    //动态字段
    const topDynamicField = () => {
        let countDynamicField = dynamicFieldList.length - 1;
        if (countDynamicField == -1) {
            return false;
        }
        return dynamicFieldList.map((item, index) => {
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
                let infoList = [];
                if (countDynamicField >= index + 1) {
                    if (dynamicFieldList[index + 1].form == 'list') {
                        let contents = dynamicFieldList[index + 1].content.split(',');
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
                    <ProForm.Group style={{ width: "100%" }}>
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
                        {countDynamicField < index + 1 ? ' ' :
                            dynamicFieldList[index + 1].form == 'box' ?
                                <ProFormText
                                    width={toptextcontent}
                                    label={dynamicFieldList[index + 1].name}
                                    name={dynamicFieldList[index + 1].key}
                                    rrules={DynFieldReg(dynamicFieldList[index + 1].type, dynamicFieldList[index + 1].required)}
                                    valueType="text"
                                /> :
                                <ProFormSelect
                                    width={toptextcontent}
                                    options={infoList}
                                    name={dynamicFieldList[index + 1].key}
                                    label={dynamicFieldList[index + 1].name}
                                    rules={DynFieldReg(dynamicFieldList[index + 1].type, dynamicFieldList[index + 1].required)}
                                />
                        }
                    </ProForm.Group>
                )
            }
        })
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
        formRef.current.resetFields();
        getImportModal(2);
        setIfImport(true);
    }

    /* 导入成功文件返回 */
    const onFileSuccess = (res) => {
        if (res.success) {
            setImportFieldsList(res.data);
            setIfImport(false);
        } else {
            Modal.warning({
                wrapClassName: 'addrallcmodalupload',
                title: language('project.title'),
                content: res.msg,
                okText: language('project.determine'),
            })
        }
    }

    /* 导入字段列表 */
    const getImportFields = () => {
        if (importFieldsList.length < 1)
            return;
        //判断输入形式是下拉框还是列表框
        let info = [{ value: '', label: '请选择' }];
        importFieldsList.map((val, index) => {
            importFieldsList[index] = val.trim();
            let confres = [];
            confres.label = val;
            confres.value = index + '&&' + val.trim();
            info.push(confres)
        })

        return fieldsList.map((item) => {
            if (!item.importStatus) {
                return (
                    <ProForm.Group style={{ width: "100%" }}>
                        <ProFormSelect
                            width="200px"
                            options={info}
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
        })
    }

    /* 提交导入内容标题 */
    const importTitle = (info) => {
        let data = {};
        data.headerLine = JSON.stringify(Object.values(info));
        data.field = JSON.stringify(Object.keys(info));
        post('/cfg.php?controller=confIPAddrManage&action=importIPAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(res.msg);
            getCloseImport();
            getList();
        }).catch(() => {
            console.log('mistake')
        })
    }

    /* 导出功能 */
    const exportFunction = () => {
        fileDown('/cfg.php?controller=confIPAddrManage&action=exportIPAddr').then((res, b, c) => {
            let fileName = Base64.fromBase64(res.headers['content-disposition'].substr(res.headers['content-disposition'].indexOf('filename=') + 9));
            downloadFile(res.data, fileName);
        }).catch(() => {
            console.log('mistake')
        })
    }

    /* 下载功能 */
    const downloadFile = (file, fileName) => {
        const blob = new Blob([file]);
        const linkNode = document.createElement('a');
        linkNode.download = fileName; //a标签的download属性规定下载文件的名称
        linkNode.style.display = 'none';
        linkNode.href = window.URL.createObjectURL(blob); //生成一个Blob URL
        document.body.appendChild(linkNode);
        linkNode.click();  //模拟在按钮上的一次鼠标单击
        window.URL.revokeObjectURL(linkNode.href); // 释放URL 对象
        document.body.removeChild(linkNode);
    }

    return (
        <>
            <ProCard direction='column' ghost gutter={[13, 13]}>
                <ProCard ghost gutter={[13, 13]}>
                    <ProCard
                        className='adctreecard'
                        style={{ height: cardHeightTop }}
                        colSpan="238px" title={language('project.sysconf.syszone.treelist')}>
                        <Tree
                            showIcon
                            onExpand={onExpand}
                            defaultExpandAll
                            selectedKeys={selectedKey}
                            expandedKeys={treelistKey}
                            onSelect={onSelectLeft}
                            treeData={treelist}
                            fieldNames={{
                                title: 'name',
                                key: 'id'
                            }}
                        />
                    </ProCard>
                    <ProCard colSpan='calc(100% - 238px)' ghost style={{ height: cardHeightTop, backgroundColor: 'white' }}>
                        <ProTable
                            className='tablelist'
                            scroll={{ y: cardHeightTop - 120 }}
                            columnEmptyText={false}
                            //边框
                            // cardBordered={true}
                            bordered={true}
                            rowkey='id'
                            loading={loading}
                            //单选框选中变化
                            rowSelection={{
                                columnWidth: 32,
                                selectedRowKeys,
                                onChange: onSelectedRowKeysChange,
                                getCheckboxProps: (record) => ({
                                    //   disabled: record.user_id == 1 || record.user_id == 2 || record.user_id == 4, // Column configuration not to be checked
                                }),
                            }}
                            //设置选中提示消失
                            tableAlertRender={false}
                            columns={columns}
                            actionRef={actionRef}
                            //页面数据信息
                            dataSource={dataList}

                            editable={{
                                type: 'multiple',
                            }}
                            columnsState={{
                                value: columnsHide,
                                persistenceType: 'sessionStorage',
                                onChange: (value,key,v) => {
                                    setColumnsHide(value);
                                },
                            }}
                            rowKey="id"
                            //头部搜索框关闭
                            search={false}
                            form={{
                                // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                                syncToUrl: (values, type) => {
                                    if (type === 'get') {
                                        return Object.assign(Object.assign({}, values), { created_at: [values.startTime, values.endTime] });
                                    }
                                    return values;
                                },
                            }}
                            pagination={false}
                            options={{
                                reload: function () {
                                    setLoading(true);
                                    getList();
                                }
                            }}
                            dateFormatter="string"
                            headerTitle={
                                <Search
                                    placeholder={language('project.resmngt.addrallc.search')}
                                    style={{ width: 200 }}
                                    onSearch={(queryVal) => {
                                        setNowPage(1);
                                        handsearch(queryVal)
                                    }}
                                />
                            }
                            toolBarRender={() => [
                                <div className='hoverbox' key="import" icon={<UploadOutlined />} onClick={(e) => {
                                    getImportModal(1);
                                }} type="primary" >
                                    <Tooltip title={language('project.import')} placement='top'>
                                        <UploadOutlined style={{ fontSize: '15px', margin: '0 12px' }} />
                                    </Tooltip>
                                </div>,
                                <div className='hoverbox' key="export" icon={<DownloadOutlined />} onClick={(e) => {
                                    exportFunction();
                                }} type="primary" >
                                    <Tooltip title={language('project.export')} placement='top'>
                                        <DownloadOutlined style={{ fontSize: '15px' }} />
                                    </Tooltip>
                                </div>,
                            ]} />

                    </ProCard>

                </ProCard>
                <ProCard className='bottomboxone' style={{ height: '400px' }} gutter={[13, 13]}>
                    <ProCard ghost direction='column'>
                        <ProCard ghost style={{ height: '37px' }} >
                            <ProCard ghost colSpan='250px'>
                                <div className='artimeselect'>
                                    <ProFormRadio.Group
                                        name="selectmode"
                                        label={language('project.resmngt.addrallc.selectmode')}
                                        radioType="button"
                                        value={selectModeVal}
                                        onChange={(key) => {
                                            setSelectModeVal(key.target.value)
                                        }}
                                        options={[
                                            {
                                                label: language('project.resmngt.addrallc.radio'),
                                                value: 0,
                                            },
                                            {
                                                label: language('project.resmngt.addrallc.check'),
                                                value: 1,
                                            }
                                        ]}
                                    />
                                </div>

                            </ProCard>
                            <Tag icon={<FlagFilled />} className='addresstitletag' color='#f50'><span>{language('project.resmngt.addrallc.currentaddresspool')}</span>{iPSubNetFind.subNetaddr}</Tag>
                            <ProCard ghost>
                                <div className='addressalertinfobox'>
                                    <Alert className='addressalertinfo' message={language('project.resmngt.addrallc.addressalert')} type="info" showIcon />
                                </div>
                            </ProCard>
                        </ProCard >
                        <ProCard ghost style={{ height: '352px' }} gutter={[13, 13]}>
                            <ProCard ghost colSpan='calc(85% )'  >
                                <div className='footbotton' >
                                    <Spin spinning={footLoading}>
                                        <div className='footbottonone'>
                                            {generateMenus()}
                                        </div>
                                    </Spin>
                                </div>
                            </ProCard>
                            <ProCard ghost direction='column'
                                gutter={[13, 13]}
                            >
                                <ProCard
                                    ghost
                                    className='cardleftone'
                                    direction='column'
                                >
                                    <StatisticCard
                                        ghost
                                        className='statisticcard statisticcardone'
                                        statistic={{
                                            title: <span style={{ color: '#FBFBFB' }}>{language('project.resmngt.addrallc.assigned')}</span>,
                                            value: (iPSubNetFind.allocIPNum ? iPSubNetFind.allocIPNum : 0) + '个',
                                        }}
                                        chart={
                                            <IdcardFilled alt="icon" style={{ fontSize: '24px' }} />
                                        }
                                        chartPlacement='left'
                                    />
                                    <Divider ghost dashed={true}></Divider>
                                </ProCard>
                                <ProCard
                                    ghost
                                    direction='column'
                                    className='cardlefttwo'
                                >
                                    <StatisticCard
                                        className='statisticcard statisticcardtwo'
                                        ghost
                                        statistic={{
                                            title: language('project.resmngt.addrallc.unassigned'),
                                            value: (iPSubNetFind.unallocIPNum ? iPSubNetFind.unallocIPNum : 0) + '个',
                                        }}
                                        chart={
                                            <ClusterOutlined alt="icon" style={{ fontSize: '24px' }} />
                                        }
                                        chartPlacement='left'
                                    />
                                    <Divider ghost dashed={true} style={{ width: '80%' }}></Divider>
                                </ProCard>
                                <ProCard
                                    ghost
                                    direction='column'
                                    className='cardleftthree'
                                >
                                    <StatisticCard
                                        ghost
                                        className='statisticcard statisticcardthree'
                                        statistic={{
                                            title: language('project.resmngt.addrallc.reserved'),
                                            value: (iPSubNetFind.reservedIPNum ? iPSubNetFind.reservedIPNum : 0) + '个',
                                        }}
                                        chart={
                                            <InfoCircleFilled alt="icon" style={{ fontSize: '24px', color: 'rgba(200, 198, 198, 100)' }} />
                                        }
                                        chartPlacement='left'
                                    />
                                    <Divider ghost dashed={true}></Divider>
                                </ProCard>
                            </ProCard>
                        </ProCard>
                    </ProCard>

                </ProCard>
            </ProCard>

            {/*左侧弹出 */}
            <DrawerForm   {...drawFormLayout}
                className='radiodrawmodal'

                title={language('project.resmngt.addrallc.addressassign')}
                formRef={formRef}
                submitter={false}
                visible={drawLeftStatus}
                onVisibleChange={setDrawLeftStatus}
                drawerProps={{
                    className:'addrallcdrawmbox',
                    destroyOnClose: true,
                    maskClosable: false,
                    placement: 'left',
                    onClose: () => {
                        getDrawModal(2)
                    },
                }}
                autoFocusFirstInput
                submitTimeout={2000}
                onFinishFailed={(values, error, kye) => {
                    //提交正则验证失败方法
                }}
                onFinish={async (values) => {
                    if (submitType == 'ipChange') {
                        ipChange();
                    } else if (submitType == 'ipRecovery') {
                        ipRecovery(1);
                    } else if (submitType == 'distribution') {
                        distribution(1);
                    } else {

                    }
                    // 不返回不会关闭弹框
                    // return true;
                }}>
                <Divider orientation='left'>{language('project.resmngt.addrallc.addressinfo')}</Divider>
                <div class='showContent'>
                    <ProFormText label={language('project.resmngt.addrallc.ipaddr')} name="ipaddr" valueType="text">
                        {initialValue.ipaddr ? initialValue.ipaddr : ' '}
                    </ProFormText>
                    <ProFormText label={language('project.resmngt.addrallc.subnet')} name="subNetaddr" valueType="text">
                        {iPSubNetFind.subNetaddr ? iPSubNetFind.subNetaddr : ' '}
                    </ProFormText>
                    <ProFormText label={language('project.resmngt.addrallc.subnetmask')} name="subNetaddr" valueType="text">
                        {iPSubNetFind.subNetmask ? iPSubNetFind.subNetmask : ' '}
                    </ProFormText>
                    <ProFormText label={language('project.resmngt.addrallc.defaultgateway')} name="gatewayIP" valueType="text">
                        {iPSubNetFind.gatewayIP ? iPSubNetFind.gatewayIP : ' '}
                    </ProFormText>
                    <ProFormText label={language('project.resmngt.addrallc.vlan')} name="vlan" valueType="text">
                        {iPSubNetFind.vlan ? iPSubNetFind.vlan : ' '}
                    </ProFormText>
                    <ProFormText label={language('project.resmngt.addrallc.organization')} name="org" valueType="text">
                        {iPSubNetFind.org ? iPSubNetFind.org : ' '}
                    </ProFormText>
                </div>
                <Divider orientation='left'>{language('project.resmngt.addrallc.assigninfo')}</Divider>
                <ProFormText label={language('project.resmngt.addrallc.macaddr')}
                    rules={[
                        {
                            pattern: regMacList.mac.regex,
                            message: regMacList.mac.alertText,
                        },
                    ]}
                    name="macaddr" valueType="text">
                </ProFormText>
                <ProFormText label={language('project.resmngt.addrallc.user')} name="user" valueType="text">
                </ProFormText>
                <ProFormText label={language('project.resmngt.addrallc.phone')}
                    rules={[
                        {
                            pattern: regList.phoneorlandline.regex,
                            message: regList.phoneorlandline.alertText,
                        },
                    ]}
                    name="phone" valueType="text">
                </ProFormText>
                <div className='artimeselect'>
                    <ProFormRadio.Group
                        name="validType"
                        label={language('project.resmngt.addrallc.servicelife')}
                        radioType="button"
                        value={selectTimeVal}
                        onChange={(checked) => {
                            setSelectTimeVal(checked.target.value)
                            if (checked.target.value == 'expire') {
                                setTimeShow(true)
                            } else {
                                setTimeShow(false)
                            }
                        }}
                        options={[
                            {
                                label: language('project.resmngt.addrallc.forever'),
                                value: 'forever',
                            },
                            {
                                label: language('project.resmngt.addrallc.expire'),
                                value: 'expire',
                            }
                        ]}
                    />
                </div>
                {timeShow == true ? (<ProFormDateTimePicker className='toptimecontent' style={{ width: '100%' }} name="expireTime" showTime
                    onChange={(key, val) => {
                        setNowExporeTime(val)
                    }}
                    label={language('project.resmngt.addrallc.expireselect')} />) : ('')}
                <ProFormText label={language('project.resmngt.addrallc.location')} name="location" valueType="text">
                </ProFormText>
                <ProFormSelect options={purposeList}
                    rules={[{ required: true, message: language('project.pleasefill') }]}
                    name="buisUsg"
                    label={language('project.resmngt.addrallc.businesspurpose')}
                />
                {modDynamicField(leftOperation)}
                <Divider orientation='left'>{language('project.resmngt.addrallc.assignoperation')}</Divider>
                {leftOperation == 1 ?
                    (<> <Button icon={<EditFilled />} style={{ left: '48%' }} type="primary" onClick={() => {
                        setSubmitType('ipChange');
                        formRef.current.submit();
                    }}>
                        {language('project.resmngt.addrallc.change')}
                    </Button>
                        <Button icon={<DeleteFilled />} style={{ left: '52%' }} danger type="primary" onClick={() => {
                            setSubmitType('ipRecovery');
                            formRef.current.submit();
                        }}>
                            {language('project.resmngt.addrallc.recovery')}
                        </Button></>
                    ) : (<Button icon={<IdcardFilled />} style={{ left: '64%' }} type="primary" onClick={() => {
                        setSubmitType('distribution');
                        formRef.current.submit();
                    }}>
                        {language('project.resmngt.addrallc.distribution')}
                    </Button>)
                }


            </DrawerForm>
            {/* 两侧弹出    */}
            <DrawerForm   {...drawFormLayout}
                className='radiodrawmodal'
                title={language('project.resmngt.addrallc.addressassign')}
                formRef={formRef}
                submitter={false}
                visible={drawRightStatus}
                onVisibleChange={setDrawRightStatus}
                drawerProps={{
                    className:'addrallcdrawmbox',
                    destroyOnClose: true,
                    maskClosable: false,
                    placement: 'right',
                    onClose: () => {
                        getDrawModal(2)
                    },
                }}
                autoFocusFirstInput
                submitTimeout={2000}
                onFinish={async (values) => {
                    if (submitType == 'ipChange') {
                        ipChange();
                    } else if (submitType == 'ipRecovery') {
                        ipRecovery(1);
                    } else if (submitType == 'distribution') {
                        distribution(1);
                    } else {

                    }
                }}>

                <Divider orientation='left'>{language('project.resmngt.addrallc.addressinfo')}</Divider>
                <div class='showContent'>
                    <ProFormText label={language('project.resmngt.addrallc.ipaddr')} name="ipaddr" valueType="text">
                        {initialValue.ipaddr ? initialValue.ipaddr : ' '}
                    </ProFormText>
                    <ProFormText label={language('project.resmngt.addrallc.subnet')} name="subNetaddr" valueType="text">
                        {iPSubNetFind.subNetaddr ? iPSubNetFind.subNetaddr : ' '}
                    </ProFormText>
                    <ProFormText label={language('project.resmngt.addrallc.subnetmask')} name="subNetaddr" valueType="text">
                        {iPSubNetFind.subNetmask ? iPSubNetFind.subNetmask : ' '}
                    </ProFormText>
                    <ProFormText label={language('project.resmngt.addrallc.defaultgateway')} name="gatewayIP" valueType="text">
                        {iPSubNetFind.gatewayIP ? iPSubNetFind.gatewayIP : ' '}
                    </ProFormText>
                    <ProFormText label={language('project.resmngt.addrallc.vlan')} name="vlan" valueType="text">
                        {iPSubNetFind.vlan ? iPSubNetFind.vlan : ' '}
                    </ProFormText>
                    <ProFormText label={language('project.resmngt.addrallc.organization')} name="org" valueType="text">
                        {iPSubNetFind.org ? iPSubNetFind.org : ' '}
                    </ProFormText>
                </div>
                <Divider orientation='left'>{language('project.resmngt.addrallc.assigninfo')}</Divider>
                <ProFormText label={language('project.resmngt.addrallc.macaddr')}
                    rules={[
                        {
                            pattern: regMacList.mac.regex,
                            message: regMacList.mac.alertText,
                        },
                    ]}
                    name="macaddr" valueType="text">
                </ProFormText>
                <ProFormText label={language('project.resmngt.addrallc.user')} name="user" valueType="text">
                </ProFormText>
                <ProFormText label={language('project.resmngt.addrallc.phone')}
                    rules={[
                        {
                            pattern: regList.phoneorlandline.regex,
                            message: regList.phoneorlandline.alertText,
                        },
                    ]}
                    name="phone" valueType="text">
                </ProFormText>
                <div className='artimeselect'>
                    <ProFormRadio.Group
                        name="validType"
                        label={language('project.resmngt.addrallc.servicelife')}
                        radioType="button"
                        value={selectTimeVal}
                        onChange={(checked) => {
                            setSelectTimeVal(checked.target.value)
                            if (checked.target.value == 'expire') {
                                setTimeShow(true)
                            } else {
                                setTimeShow(false)
                            }
                        }}
                        options={[
                            {
                                label: language('project.resmngt.addrallc.forever'),
                                value: 'forever',
                            },
                            {
                                label: language('project.resmngt.addrallc.expire'),
                                value: 'expire',
                            }
                        ]}
                    />
                </div>
                {timeShow == true ? (<ProFormDateTimePicker className='toptimecontent' style={{ width: '100%' }} name="expireTime" showTime
                    onChange={(key, val) => {
                        setNowExporeTime(val)
                    }}
                    label={language('project.resmngt.addrallc.expireselect')} />) : ('')}
                <ProFormText label={language('project.resmngt.addrallc.location')} name="location" valueType="text">
                </ProFormText>
                <ProFormSelect options={purposeList}
                    rules={[{ required: true, message: language('project.pleasefill') }]}
                    name="buisUsg"
                    label={language('project.resmngt.addrallc.businesspurpose')}
                />
                {modDynamicField(leftOperation)}
                <Divider orientation='left'>{language('project.resmngt.addrallc.assignoperation')}</Divider>
                {leftOperation == 1 ?
                    (<> <Button icon={<EditFilled />} style={{ left: '48%' }} type="primary" onClick={() => {
                        setSubmitType('ipChange');
                        formRef.current.submit();
                    }}>
                        {language('project.resmngt.addrallc.change')}
                    </Button>
                        <Button icon={<DeleteFilled />} style={{ left: '52%' }} danger type="primary" onClick={() => {
                            setSubmitType('ipRecovery');
                            formRef.current.submit();
                        }}>
                            {language('project.resmngt.addrallc.recovery')}
                        </Button></>
                    ) : (<Button icon={<IdcardFilled />} style={{ left: '64%' }} type="primary" onClick={() => {
                        setSubmitType('distribution');
                        formRef.current.submit();
                    }}>
                        {language('project.resmngt.addrallc.distribution')}
                    </Button>)
                }


            </DrawerForm>
            {/* 顶部弹出数据 */}
            <DrawerForm className='modaltop'
                title={language('project.resmngt.addrallc.addressassign')}
                formRef={formRef}
                submitter={false}
                visible={topDrawStatus}
                onVisibleChange={setTopDrawStatus}
                drawerProps={{
                    className:cardHeightTop > 256 ? 'addrallcdrawmbox addtoprallcdrawmbox addtoprallcdrawmheight' : 'addrallcdrawmbox addtoprallcdrawmbox addtoprallcdrawmminheight',
                    destroyOnClose: true,
                    maskClosable: false,
                    placement: 'top',
                    onClose: () => {
                        getDrawModal(2)
                    },
                }}
                autoFocusFirstInput
                submitTimeout={2000}
                onFinishFailed={(values, error, kye) => {
                    //提交正则验证失败方法
                }}
                onFinish={async (values) => {
                    if (submitType == 'batchDistribution') {
                        batchDistribution();
                    } else if (submitType == 'batchChange') {
                        batchChange();
                    } else if (submitType == 'batchIpRecovery') {
                        batchIpRecovery();
                    } else {
                    }
                }}>
                <ProCard ghost gutter={[13, 13]}>
                    <ProCard >
                        <div className='leftcatdfrom'>
                            <Table
                                scroll={{ y: 226 }}
                                // rowKey={record => record.ipaddr}
                                rowKey={record => record.id}
                                pagination={false}
                                columns={topcolumns}
                                dataSource={topdata}
                            />
                        </div>
                    </ProCard>
                    <ProCard colSpan='460px'>
                        <div className='rightcatdfrom'>
                            <ProForm.Group style={{ width: "100%", }}>
                                <ProFormText width={toptextcontent} label={language('project.resmngt.addrallc.user')} name="user" valueType="text" />
                                <ProFormText width={toptextcontent} label={language('project.resmngt.addrallc.phone')} name="phone" valueType="text" 
                                rules={[{ pattern: regList.phoneorlandline.regex, message: regList.phoneorlandline.alertText, }]}
                                />
                            </ProForm.Group>
                            <div className='artimeselect'>
                                <ProForm.Group style={{ width: "100%" }}>
                                    <ProFormRadio.Group
                                        key='toptime'
                                        name="validType"
                                        label={language('project.resmngt.addrallc.servicelife')}
                                        radioType="button"
                                        initialValue={'forever'}
                                        options={[
                                            {
                                                key: 1,
                                                label: language('project.resmngt.addrallc.forever'),
                                                value: 'forever',
                                            },
                                            {
                                                key: 2,
                                                label: language('project.resmngt.addrallc.expire'),
                                                value: 'expire',
                                            }
                                        ]}
                                    />

                                    <ProFormDatePicker width={toptextcontent}
                                        name="expireTime"
                                        fieldProps={{
                                            format: (value) => value.format('YYYY-MM-DD')
                                        }}
                                        onChange={(key, val) => {
                                            setNowExporeTime(val)
                                        }}
                                        label={language('project.resmngt.addrallc.expireselect')} />
                                </ProForm.Group>
                            </div>
                            <ProForm.Group style={{ width: "100%" }}>
                                <ProFormText width={toptextcontent} label={language('project.resmngt.addrallc.location')} name="location" valueType="text" />
                                <ProFormSelect width={toptextcontent} options={purposeList}
                                    rules={[{ required: true}]}
                                    name="buisUsg"
                                    label={language('project.resmngt.addrallc.businesspurpose')}
                                />
                            </ProForm.Group>
                            {topDynamicField()}
                        </div>
                    </ProCard>
                    <ProCard ghost colSpan='280px' >
                        <div style={{ marginTop: 250 }}>
                            <Button icon={<IdcardFilled />} disabled={sOperationStatus === 'assigned' ? true : false} key='operation1' type="primary" onClick={() => {
                                setSubmitType('batchDistribution');
                                formRef.current.submit();
                            }}>
                                {language('project.resmngt.addrallc.distribution')}
                            </Button>
                            <Button style={{ marginLeft: 10 }} disabled={sOperationStatus === 'unassigned' ? true : false} key='operation2' icon={<EditFilled />} type="primary" onClick={() => {
                                setSubmitType('batchChange')
                                formRef.current.submit();
                            }}>
                                {language('project.resmngt.addrallc.change')}
                            </Button>
                            <Button style={{ marginLeft: 10 }} disabled={sOperationStatus === 'unassigned' ? true : false} key='operation3' icon={<DeleteFilled />} danger type="primary" onClick={() => {
                                batchIpRecovery();
                            }}>
                                {language('project.resmngt.addrallc.recovery')}
                            </Button>
                        </div>
                    </ProCard>
                </ProCard>
            </DrawerForm>
            <ModalForm {...modalFormLayout}
                className='fileaddrallcmodal'
                formRef={formRef}
                title={language('project.import')}
                visible={imoritModalStatus} autoFocusFirstInput
                modalProps={{
                    maskClosable: false,
                    onCancel: () => {
                        getCloseImport();
                    },
                }}
                submitter={ifImport ? false : true}
                submitTimeout={2000}
                onFinish={async (values) => {
                    importTitle(values);
                }}
            >
                {ifImport ?
                    <>
                        <ProFormText tooltip={language('project.resmngt.addrallc.fileformatcsv')} label={language('project.resmngt.addrallc.import')} >
                            <Uploadd
                                width="200px"
                                config={uploadConfig}
                                paramentUpload={paramentUpload}
                                fileList={fileList}
                                onSuccess={onFileSuccess}
                                onPreview={(file) => { }}
                            >
                                <Button
                                    size="small"
                                >
                                    {language('project.resmngt.addrallc.importfile')}
                                </Button>
                            </Uploadd>
                        </ProFormText>
                        <ProFormRadio.Group initialValue={fileCode}
                            onChange={(e) => {
                                setFileCode(e.target.value);
                            }}
                            label={language('project.filecode')}
                            name='read'
                            options={[
                                { label: language('project.utf8'), value: 'utf-8' },
                                { label: language('project.gbk'), value: 'gbk' }
                            ]}
                        />
                    </>
                    :
                    <ProForm.Group style={{ width: "100%" }}>
                        <div style={{ width: '200px', marginBottom: '12px' }}>
                            {language('project.importfilefields')}
                        </div>
                        <div style={{ width: '200px', marginBottom: '12px' }}>
                            {language('project.mappingfields')}
                        </div>
                    </ProForm.Group>

                }
                {ifImport ? '' : getImportFields()}
            </ModalForm>
        </>
    );
};











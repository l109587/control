import React, { useRef, useState, useEffect } from 'react';
import { CheckOutlined, CloseCircleOutlined, IdcardFilled, UnorderedListOutlined, ClusterOutlined, EditFilled, SaveFilled } from '@ant-design/icons';
import { ProTable, ProForm, ProFormDateTimePicker, ProFormSelect, ModalForm, ProFormText, ProFormTextArea, ProDescriptions, ProCard, ProFormRadio, EditableProTable } from '@ant-design/pro-components';
import { Button, Menu, Input, message, Space, Tag, Popconfirm, Divider, Steps, Alert, Tooltip } from 'antd';
import { post } from '@/services/https';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { AiFillEye, AiOutlineClockCircle, AiFillInfoCircle } from "react-icons/ai";
import { BsFillCheckCircleFill, BsQuestionCircleFill, BsXCircleFill } from "react-icons/bs";
import { Seal } from '@icon-park/react';
import { BiUserCircle } from "react-icons/bi";
import { GoTrashcan } from "react-icons/go";
import '@/utils/index.less';
import './index.less';
import { TableLayout } from '@/components';
const { ProtableModule } = TableLayout;
let H = document.body.clientHeight - 481
var clientHeight = H
const { Search } = Input
const { Step } = Steps;
export default (props) => {
    //删除气泡框
    const [confirmLoading, setConfirmLoading] = useState(false);
    const renderRemove = (text, record) => (
        <Popconfirm onConfirm={() => {
            //删除方法
            delListFictitious(record);
        }} key="popconfirmdel"
            title={language('project.delconfirm')}
            okButtonProps={{
                loading: confirmLoading,
            }} okText={language('project.yes')} cancelText={language('project.no')}>
            <a>{text}</a>
        </Popconfirm>
    );

    const delListFictitious = (record) => {
        let info = approvalList;
        setApprovalList(info.filter((item) => item.ipaddr != record.ipaddr));
    }

    //查看列表
    const columnsInfoSee = [
        {
            title: language('project.resmngt.resapply.ipaddr'),
            dataIndex: 'ipaddr',
            width: 95,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.subnet'),
            dataIndex: 'subnet',
            width: 105,
            ellipsis: true,
            render: (text, record, index) => {
                return record.subnet + '/' + record.maskSize;
            }
        },
        {
            title: language('project.resmngt.resapply.servicelife'),
            dataIndex: 'validType',
            width: 120,
            ellipsis: true,
            render: (text, record, index) => {
                if (record.validType == 'expire') {
                    return record.expireTime;
                } else {
                    return language('project.resmngt.approval.forever');
                }
            }
        }
    ];

    //审批列表
    const columnsInfo = [
        {
            title: language('project.resmngt.resapply.ipaddr'),
            dataIndex: 'ipaddr',
            width: 110,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.subnet'),
            dataIndex: 'subnet',
            width: 110,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.servicelife'),
            dataIndex: 'expireTime',
            width: 110,
            valueType: 'option',
            ellipsis: true,
            render: (text, record, _) => {
                if (record.validType == 'forever') {
                    return language('project.resmngt.approval.forever');
                } else {
                    return record.expireTime;
                }
            }
        },
        {
            title: language('project.mconfig.operate'),
            valueType: 'option',
            width: 45,
            align: 'center',
            render: (text, record, _, action) => [
                console.log(action),
                <>
                    <a key="editable" onClick={() => {
                        distributionMod(record);
                    }}>
                        <EditFilled />
                    </a>
                    {renderRemove(<GoTrashcan style={{ color: 'red' }} />, record)}
                </>
            ]
        },

    ];
    const columnList = [
        {
            title: '',
            dataIndex: 'id',
            width: 80,
            ellipsis: true,
            hideInTable: true,
        },
        {
            title: language('project.resmngt.approval.workorderstatus'),
            dataIndex: 'orderState',
            width: 100,
            align: 'center',
            ellipsis: true,
            filterMultiple: false,
            filters: [
                { text: language('project.resmngt.approved'), value: 'approved' },
                { text: language('project.resmngt.unsubmitted'), value: 'unsubmitted' },
                { text: language('project.resmngt.unapproved'), value: 'unapproved' },
                { text: language('project.resmngt.rejected'), value: 'rejected' },
                { text: language('project.resmngt.inapproval'), value: 'inapproval' },
            ],
            render: (test, record, index) => {
                let color = '';
                let text = language('project.resmngt.approved');
                if (record.orderState == 'unsubmitted') {
                    color = 'processing';
                    text = language('project.resmngt.unsubmitted');
                } else if (record.orderState == 'unapproved') {
                    color = 'error';
                    text = language('project.resmngt.unapproved');
                } else if (record.orderState == 'rejected') {
                    color = 'purple';
                    text = language('project.resmngt.rejected');
                } else if (record.orderState == 'inapproval') {
                    color = '';
                    text = language('project.resmngt.inapproval');
                } else {
                    color = 'success';
                    text = language('project.resmngt.approved');
                }
                return (
                    <Space>
                        <Tag style={{ marginRight: '0px' }} color={color} key={record.orderState}>
                            {text}
                        </Tag>
                    </Space>
                )
            }
        },
        {
            title: language('project.resmngt.approval.workorderno'),
            dataIndex: 'orderID',
            width: 120,
            ellipsis: true,
            valueType: 'select',
        },
        {
            title: language('project.resmngt.resapply.zone'),
            dataIndex: 'zone',
            width: 120,
            ellipsis: true,

        },
        {
            //所属机构暂无内容 key 不对 dataindex
            title: language('project.resmngt.approval.organization'),
            dataIndex: 'org',
            width: 120,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.approval.applicant'),
            dataIndex: 'user',
            width: 80,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.approval.phone'),
            dataIndex: 'phone',
            width: 110,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.approval.purpose'),
            dataIndex: 'buisUsg',
            width: 100,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.approval.applynum'),
            dataIndex: 'applyNum',
            width: 80,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.approval.macaddress'),
            dataIndex: 'mac',
            width: 120,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.approval.vlan'),
            dataIndex: 'vlan',
            width: 80,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.approval.applypeople'),
            dataIndex: 'applicant',
            width: 80,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.approval.approvalperson'),
            dataIndex: 'approvalPerson',
            width: 80,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.alocipaddr'),
            dataIndex: 'applyIPAddr',
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.notes'),
            dataIndex: 'notes',
            width: 120,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.mconfig.operate'),
            valueType: 'option',
            width: 80,
            fixed: 'right',
            align: 'center',
            render: (text, record, _, action) => [
                record.orderState == 'approved' || record.orderState == 'rejected' ?
                    <>
                        <a key="editable"
                            onClick={() => {
                                seeModalFrame(record);
                            }}>
                            <Tooltip title={language('project.see')} >
                                <AiFillEye className='seeicon' size={18} style={{ fontSize: '18px' }} />
                            </Tooltip>
                        </a>
                    </>
                    :
                    <>
                        <a key="editable"
                            onClick={() => {
                                approvalModalFrame(record);
                            }}>
                            <Tooltip title={language('project.approval')} >
                                <Seal style={{ fontSize: '16px', color: '#FF7429' }} />
                            </Tooltip>
                        </a>
                    </>
            ],
        },
    ];
    const formRef = useRef();
    const ipFormRef = useRef();
    const formRef1 = useRef();
    const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
    const [approvalModalStatus, setApprovalModalStatus] = useState(false);//审批弹出框
    const [seeModalStatus, setSeeModalStatus] = useState(false);//model 查看弹框状态
    const [approvalProcessList, setApprovalProcessList] = useState([]);//审批流程列表数据
    const [approvalList, setApprovalList] = useState([]);//审批预分配列表
    const [dataInfo, setDataInfo] = useState([]);//查看 申请 ip 列表
    const [iPModalStatus, setIPModalStatus] = useState(false);//IP地址选择弹出框
    const [timeShow, setTimeShow] = useState(false);//有效时间隐藏显示
    const [selectTimeVal, setSelectTimeVal] = useState();//判断使用期限
    const [editableKeys, setEditableRowKeys] = useState();//每行编辑的id
    const [ipSelectList, setIpSelectList] = useState([]);//分配ip 选中内容
    const [treelist, setTreelist] = useState([]);//审批子网回显
    const [initialValue, setInitialValue] = useState([]);//默认查看头部列表数据
    const [ipValidType, setIpValidType] = useState('forever');//ip选择单选多选模式
    const [ipValidTime, setIpValidTime] = useState();//时间处理
    const [iPAddrList, setIPAddrList] = useState([]);//掩码IP地址按钮数据
    const [subNetList, setSubNetList] = useState([]);//添加下拉修改子网地址
    const [columns, setColumns] = useState(columnList);//table 头部数据

    /** table组件 start */
    const rowKey = (record => record.id);//列表唯一值
    const tableHeight = clientHeight;//列表高度
    const tableKey = 'rallocationapproval';//table 定义的key
    const rowSelection = true;//是否开启多选框
    const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
    const columnvalue = 'rallocationapprovalcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
    const apishowurl = '/cfg.php?controller=confIPOrderManage&action=showIPAllocApply';//接口路径
    const [queryVal, setQueryVal] = useState();//首个搜索框的值
    let searchVal = { queryVal: queryVal, queryType: 'fuzzy', showType: 'approval' };//顶部搜索框值 传入接口

    //初始默认列
    const concealColumns = {
        id: { show: false },
        notes: { show: false },
    }
    /* 顶部左侧搜索框*/
    const tableTopSearch = () => {
        return (
            <Search
                placeholder={language('project.resmngt.approval.dissearch')}
                style={{ width: 200 }}
                onSearch={(queryVal) => {
                    setQueryVal(queryVal);
                    setIncID(incID + 1);
                }}
            />
        )
    }

    /** table组件 end */


    // IP地址申请工单子网回显列表
    const getMenu = (type = false) => {
        let data = {};
        data.orgID = initialValue.orgID;//管理员所属区域id    
        post('/cfg.php?controller=confIPAddrManage&action=showAllocSubnet', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            if (type) {
                let info = [];
                res.data.map((item) => {
                    let confres = [];
                    confres.label = item.subNetaddr;
                    confres.value = item.subNetaddr;
                    info.push(confres)
                })
                setSubNetList(info)
            } else {
                let e = [];
                res.data.map((item) => {
                    let icon = <UnorderedListOutlined />;
                    e.push({ key: item.id, label: item.subNetaddr + '/' + (item.maskSize), icon: icon, subNetaddr: item.subNetaddr })
                })
                setTreelist(e);
                getBottonList(res.data[0].id)
            }
        }).catch(() => {
            console.log('mistake')
        })
    }
    // IP地址申请工单子网侧边点击id处理
    const onSelectLeft = (selectedKeys, info) => {
        getBottonList(selectedKeys);
    };

    useEffect(() => {
        getDynamicField();
    }, [])

    //获取动态字段列表
    const getDynamicField = () => {
        let data = {};
        data.filterType = 'dynamic';
        data.modtype = 'resource';
        post('/cfg.php?controller=confResField&action=showResFieldList', data).then((res) => {
            if (res.data.length > 0) {
                let columnsList = columns;
                res.data.map((item) => {
                    let info = {};
                    info.title = item.name;
                    info.dataIndex = item.key;
                    info.ellipsis = true;
                    info.width = 100;
                    columnsList.splice(-1, 0, info);
                })
                setColumns([...columnsList]);
            }
            setIncID(incID + 1);
        }).catch(() => {
            console.log('mistake')
        })
    }

    //更新修改功能
    const save = (record) => {
        let data = {};
        data.groupId = record.groupId;
        data.id = record.op != 'add' ? record.id : '';
        data.name = record.name;
        data.op = record.op == 'add' ? record.op : 'mod';
        post('/cfg.php?controller=assetMapping&action=setAssetTypeInfo', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            allSeeModal();
            setIncID(incID + 1);
        }).catch(() => {
            console.log('mistake')
        })
    }

    //审批弹出框页面数据赋值
    const approvalModalFrame = (record) => {
        let data = {};
        data.applyNum = record.applyNum;
        data.orgID = record.orgID;
        data.vlan = record.vlan;
        post('/cfg.php?controller=confIPOrderManage&action=preAllocIPAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            setInitialValue(record);
            setApprovalList(res.data);
            getApporvalModal(1);
        }).catch(() => {
            console.log('mistake')
        })
    }


    //审批判断是否弹出添加model
    const getApporvalModal = (status) => {
        if (status == 1) {
            setApprovalModalStatus(true);
        } else {
            operationOffEmpty();
            formRef.current.resetFields();
            setApprovalModalStatus(false);
        }
    }
    //通用关闭审批弹框
    const allApporvalModal = () => {
        getApporvalModal(2);
    }


    //查看弹出框页面数据赋值
    const seeModalFrame = (record) => {
        let data = {};
        data.id = record.id;
        post('/cfg.php?controller=confIPOrderManage&action=showIPAllocFlow', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            setInitialValue(res.data.applyInfo);
            setDataInfo(res.data.allocInfo);
            setApprovalProcessList(res.data.flowInfo);
            getSeeModal(1);
        }).catch(() => {
            console.log('mistake')
        })
    }

    //拼接审核装填列表标题名称
    const titleNameStep = (state) => {
        switch (state) {
            case ('submit'):
                return language('project.resmngt.subbmit');
            case ('approval'):
                return language('project.resmngt.approval');
            default:
                return language('project.resmngt.unapproval');
        }
    }

    //拼接列表图标
    const iconStep = (result) => {
        switch (result) {
            case ('approved'):
                return <BsFillCheckCircleFill />;
            default:
                return <BsXCircleFill color='red' />;
        }
    }

    //查看审核状态list
    const approvalProcess = () => {
        let approvalNum = approvalProcessList.length;
        return approvalProcessList.map((item, index) => {
            let titleType = titleNameStep(item.action);
            let icon = iconStep(item.result);
            return (
                <>
                    <Step title={titleType}
                        status='process'
                        description={item.action == 'unapproved' ? <div className='stepcardempty'></div> :
                            <ProCard className='stepcard' bordered={true} direction='column' ghost >
                                <div className='cardbox'>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div className='iconbox' >{<BiUserCircle className='icon' />}</div>
                                        {item.admin}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div className='iconbox' ><AiOutlineClockCircle /></div>
                                        {item.time}
                                    </div>
                                </div>
                                <div style={{ paddingLeft: 50 }}>
                                    <div  >{item.desc}</div>
                                </div>
                            </ProCard>
                        }
                    >
                    </Step>
                    {approvalNum == 1 ?
                        <>
                            <Step title={language('project.resmngt.unapproval')}
                                status='process'
                                description={<div className='stepcardempty'></div>}
                            >
                            </Step>
                            <Step
                                icon={<BsQuestionCircleFill />}
                                status='process'
                                description={<div className='stepcardempty'></div>}
                            >
                            </Step>
                        </> : <></>}
                    {item.action === 'approval' ?
                        <Step title={item.result === 'approved' ? language('project.adopt') : language('project.reject')}
                            icon={icon}
                            status='process'
                            description={
                                <ProCard className='stepcard' bordered={true} direction='column' ghost >
                                    <div className='cardbox'>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <div className='iconbox' >{<AiFillInfoCircle className='icon' />}</div>
                                            {item.result === 'approved' ? language('project.resmngt.approvalinstructions') : language('project.resmngt.reasonfrorejection')}
                                        </div>
                                    </div>
                                    <div style={{ paddingLeft: 50 }}>
                                        <div  >{item.notes}</div>
                                    </div>
                                </ProCard>
                            }
                        >
                        </Step> : <></>}
                </>
            )
        })
    }

    //查看判断是否弹出添加model
    const getSeeModal = (status) => {
        if (status == 1) {
            setSeeModalStatus(true);
        } else {
            operationOffEmpty();
            // formRef.current.resetFields();
            setSeeModalStatus(false);
        }
    }

    //通用查看框关闭
    const allSeeModal = () => {
        getSeeModal(2);
    }

    //判断是否弹出添加model
    const getModal = (status) => {
        if (status == 1) {
            setModalStatus(true);
        } else {
            formRef1.current.resetFields();
            setModalStatus(false);
        }
    }

    //审批ip判断是否弹出添加model
    const getMaskModal = (status) => {
        if (status == 1) {
            setIPModalStatus(true);
        } else {
            ipFormRef.current.resetFields();
            setIPModalStatus(false);
        }
    }

    //通用ip审批弹框关闭
    const allMaskModal = () => {
        getMaskModal(2);
        //清除选中IP地址
        setIpSelectList([]);
    }

    //操作关闭后清空数据
    const operationOffEmpty = () => {
        //清空弹框上部列表信息
        setInitialValue([]);
    }

    //审批通过
    const approvalAdopt = () => {
        let obj = formRef.current.getFieldsValue(['reason']);
        let data = {};
        data.orderID = initialValue.orderID;
        data.notes = obj.reason;
        data.ipaddr = JSON.stringify(approvalList);
        post('/cfg.php?controller=confIPOrderManage&action=agreeIPAllocApply', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            allApporvalModal();
            setIncID(incID + 1);
        }).catch(() => {
            console.log('mistake')
        })
    }

    //审批驳回
    const approvalReject = () => {
        const obj = formRef.current.getFieldsValue(['reason']);
        if (!obj) {
            message.error(language('project.notes'));
            return false;
        }
        let data = {};
        data.orderID = initialValue.orderID;
        data.notes = obj.reason;
        post('/cfg.php?controller=confIPOrderManage&action=rejectIPAllocApply', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            allApporvalModal();
            setIncID(incID + 1);
        }).catch(() => {
            console.log('mistake')
        })
    }

    //底部掩码数据列表
    const getBottonList = (subnetID = 0, record = '') => {
        let data = {};
        data.subnetID = subnetID;
        post('/cfg.php?controller=confIPAddrManage&action=showIPAddrList', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            res.data.map((item, index) => {
                item.xzstatus = 1;
            })
            setIPAddrList(res.data);
        }).catch(() => {
            console.log('mistake')
        })
    }

    //地址分配选中数据回显
    const ipaddrShow = () => {
        if (ipSelectList.length > 1) {
            let time = 0;
            let type = 'forever';
            if (ipValidType == 'expire') {
                type = 'expire';
                time = ipValidTime;
            }
            ipSelectList.map((item) => {
                item.expireTime = time;
                item.validType = type;
            })
        }
        setApprovalList(ipSelectList);
        allMaskModal();
    }

    //地址分配选中数据处理
    const ipSelectedStatus = (record, index) => {
        let xzstatus = 1;
        if (record.xzstatus === 2) {
            setIpSelectList(ipSelectList.filter((item) => item.id !== record.id));
        } else {
            xzstatus = 2;
            let ipInfo = ipSelectList;
            let ipFind = {};
            ipFind.id = record.id;
            ipFind.ipaddr = record.ipaddr;
            ipFind.subnet = record.subnet;
            ipFind.maskSize = record.maskSize;
            ipFind.validType = ipValidType;
            ipFind.expireTime = ipValidType == 'forever' ? 0 : ipValidTime;
            ipInfo.push(ipFind)
            setIpSelectList(ipInfo);
        }
        iPAddrList.map((val) => {
            if (record.id == val.id) {
                val.xzstatus = xzstatus;
            }
        })
        let iPAddrInfo = iPAddrList;
        setIPAddrList([...iPAddrInfo]);
    }

    //button 按钮处理
    const generateMenus = (data) => {
        return iPAddrList.map((item, index) => {
            let classname = 'buttonassigned';
            if (item.mngState == 'unassigned') {
                classname = 'buttonunassigned'
            } else if (item.mngState == 'reserve') {
                classname = 'buttonreserve'
            }
            if (parseInt((index) % 32) == 0 && index != 0) {
                return (
                    <>
                        <br />
                        <Button data-value={1}
                            className={item.xzstatus == 1 ? 'buttonbox ' + (classname) : 'buttonbox checkbuttonassigned'}
                            onClick={() => {
                                if (item.mngState == 'unassigned') {
                                    ipSelectedStatus(item, index);
                                }
                            }}
                        >
                            {item.id}
                        </Button>
                    </>
                )
            } else {
                return (
                    <Button
                        className={item.xzstatus == 1 ? 'buttonbox ' + (classname) : 'buttonbox checkbuttonassigned'}
                        onClick={() => {
                            if (item.mngState == 'unassigned') {
                                ipSelectedStatus(item, index);
                            }
                        }}
                    >
                        {item.id}
                    </Button>
                )
            }
        })
    }

    //分配数据编辑回显
    const distributionMod = (record) => {
        getMenu(true);
        setSelectTimeVal(record.validType);
        if (record.validType == 'forever') {
            setTimeShow(false);
        } else {
            setTimeShow(true);
        }
        if (record.expireTime == 0) {
            record.expireTime = undefined ;
        }
        setTimeout(function () {
            formRef1.current.setFieldsValue(record);
        }, 100)
        getModal(1);
    }
    //分配数据编辑赋值 修改
    const distributionSubmit = (values) => {
        console.log(values)
        let aList = approvalList;
        aList.map((item) => {
            if (item.id == values.id) {
                item.ipaddr = values.ipaddr;
                item.subNetaddr = values.subNetaddr;
                item.validType = values.validType;
                if (values.validType == 'forever') {
                    item.expireTime = 0;
                } else {
                    item.expireTime = values.expireTime;
                }
            }
        })
        setApprovalList(aList);
        getModal(2);
    }
    return (<>
        <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} rowSelection={rowSelection} />
        {/* //查看弹出框 */}
        <ModalForm
            labelCol={{ xs: { span: 9 } }}
            wrapperCol={{ xs: { span: 12 } }}
            width="570px"
            layout="horizontal"
            className='aseemodalfrom'
            // formRef={formRef}
            title={language('project.resmngt.resapply.approveview')}
            visible={seeModalStatus} autoFocusFirstInput
            submitter={false}
            modalProps={{
                maskClosable: false,
                onCancel: () => {
                    allSeeModal();
                },
            }}
            onVisibleChange={setSeeModalStatus}
            submitTimeout={2000} onFinish={async (values) => {
                save(values);
            }}>
            <Divider orientation='left'>{language('project.resmngt.applicationinformation')}</Divider>
            <div className='aapplicationinformation'>
                <ProDescriptions column={2}>
                    <ProDescriptions.Item name='applicant' label={language('project.resmngt.resapply.user')}>{initialValue.user ? initialValue.user : ''} </ProDescriptions.Item>
                    <ProDescriptions.Item name="phone" label={language('project.resmngt.resapply.contactnumber')}>{initialValue.phone ? initialValue.phone : ' '}</ProDescriptions.Item>
                </ProDescriptions>
                <ProDescriptions column={2}>
                    <ProDescriptions.Item name='zone' label={language('project.resmngt.resapply.zone')}>{initialValue.zone ? initialValue.zone : ''}</ProDescriptions.Item>
                    <ProDescriptions.Item name="org" label={language('project.resmngt.resapply.organization')}>{initialValue.org ? initialValue.org : ' '}</ProDescriptions.Item>
                </ProDescriptions>
                <ProDescriptions column={2}>
                    <ProDescriptions.Item name='purpose' label={language('project.resmngt.resapply.businesspurpose')}>{initialValue.buisUsg ? initialValue.buisUsg : ''}</ProDescriptions.Item>
                    <ProDescriptions.Item name="applyNum" label={language('project.resmngt.resapply.number')}>{initialValue.applyNum ? initialValue.applyNum : ' '}</ProDescriptions.Item>
                </ProDescriptions>
                <ProDescriptions column={2}>
                    <ProDescriptions.Item name='macaddress' label={language('project.resmngt.resapply.macaddress')}>{initialValue.mac ? initialValue.mac : ''}</ProDescriptions.Item>
                    <ProDescriptions.Item name="vlan" label={language('project.resmngt.resapply.vlan')}>{initialValue.vlan ? initialValue.vlan : ' '}</ProDescriptions.Item>
                </ProDescriptions>
            </div>

            <Divider orientation='left'>{language('project.resmngt.assignmentinformation')}</Divider>
            <div className='assignmentinformation frommodalmargin'>
                <ProTable
                    className='assignmentinformationtable'
                    scroll={{ y: 108 }}
                    //边框
                    cardBordered={true}
                    bordered={true}
                    rowkey='id'
                    //单选框选中变化
                    rowSelection={false}
                    //设置选中提示消失
                    tableAlertRender={false}
                    columns={columnsInfoSee}
                    //页面数据信息
                    dataSource={dataInfo}
                    editable={{
                        type: 'multiple',
                    }}
                    rowKey="id"
                    //头部搜索框关闭
                    search={false}
                    pagination={false}
                    dateFormatter="string"
                    headerTitle={false}
                    toolBarRender={false}
                />
            </div>
            <Divider orientation='left'>{language('project.resmngt.approvalprocess')}</Divider>
            <div className='approvalprocesss frommodalmargin'>
                <Steps direction='vertical' size='small' >
                    {approvalProcess()}
                </Steps>

            </div>
        </ModalForm>
        {/* 添加编辑弹出框 */}
        <ModalForm {...modalFormLayout}
            className='ipaddmodal'
            formRef={formRef1}
            title={language('project.resmngt.assignmentinformation')}
            visible={modalStatus} autoFocusFirstInput
            modalProps={{
                maskClosable: false,
                onCancel: () => {
                    getModal(2);
                },
            }}

            onVisibleChange={setModalStatus}

            submitTimeout={2000} onFinish={async (values) => {
                distributionSubmit(values);
            }}>

            <ProFormText hidden={true} type="hidden" name="id" />
            <ProFormText name="ipaddr" label={language('project.resmngt.resapply.ipaddr')} />
            <ProFormSelect options={subNetList}
                name="subnet"
                label={language('project.resmngt.addrallc.businesspurpose')}
            />
            <ProFormRadio.Group
                name="validType"
                label={language('project.resmngt.approval.validtype')}
                radioType="button"
                initialValue='forever'
                onChange={(checked) => {
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
            {timeShow == true ? (<ProFormDateTimePicker
                style={{ width: '100%' }}
                fieldProps={{
                    format: (value) => value.format('YYYY-MM-DD HH:mm:ss')
                }}
                name="expireTime"
                showTime
                label={language('project.resmngt.approval.validtime')}
            />) : ('')}
        </ModalForm>
        {/* 审批弹出框 */}
        <ModalForm
            formRef={formRef}
            width="570px"
            layout="horizontal"
            className='aapprovalmodalfrom'
            title={language('project.resmngt.resapply.approveoperation')}
            visible={approvalModalStatus} autoFocusFirstInput
            modalProps={{
                maskClosable: false,
                onCancel: () => {
                    allApporvalModal();
                },
            }}
            submitter={{
                render: (props, doms) => {
                    return [
                        <Button key="1" icon={<CheckOutlined />} type='primary'
                            onClick={() => {
                                approvalAdopt()
                            }}
                        >
                            <span className='buttonmargint'>{language('project.adopt')}</span>
                        </Button>,
                        <Button kye="2" icon={<CloseCircleOutlined />} type='primary' danger
                            onClick={() => {
                                approvalReject()
                            }}
                        >
                            <span className='buttonmargint'>{language('project.reject')}</span>
                        </Button>
                    ]
                }
            }}
            onVisibleChange={setApprovalModalStatus}
            submitTimeout={2000} onFinish={async (values) => {
                save(values);
            }}>
            <Divider orientation='left'>{language('project.resmngt.applicationinformation')}</Divider>
            <div className='aapplicationinformations'>
                <ProDescriptions column={2}>
                    <ProDescriptions.Item name='user' label={language('project.resmngt.resapply.user')}>{initialValue.user ? initialValue.user : ''}</ProDescriptions.Item>
                    <ProDescriptions.Item name="phone" label={language('project.resmngt.resapply.contactnumber')}>{initialValue.phone ? initialValue.phone : ''}</ProDescriptions.Item>
                </ProDescriptions>
                <ProDescriptions column={2}>
                    <ProDescriptions.Item name='zone' label={language('project.resmngt.resapply.zone')}>{initialValue.zone ? initialValue.zone : ''}</ProDescriptions.Item>
                    <ProDescriptions.Item name="org" label={language('project.resmngt.resapply.organization')}>{initialValue.org ? initialValue.org : ' '}</ProDescriptions.Item>
                </ProDescriptions>
                <ProDescriptions column={2}>
                    <ProDescriptions.Item name='buisUsg' label={language('project.resmngt.resapply.businesspurpose')}>{initialValue.buisUsg ? initialValue.buisUsg : ''}</ProDescriptions.Item>
                    <ProDescriptions.Item name="applyNum" label={language('project.resmngt.resapply.number')}>{initialValue.applyNum ? initialValue.applyNum : ' '}</ProDescriptions.Item>
                </ProDescriptions>
                <ProDescriptions column={2}>
                    <ProDescriptions.Item name='mac' label={language('project.resmngt.resapply.macaddress')}>{initialValue.mac ? initialValue.mac : ''}</ProDescriptions.Item>
                    <ProDescriptions.Item name="vlan" label={language('project.resmngt.resapply.vlan')}>{initialValue.vlan ? initialValue.vlan : ' '}</ProDescriptions.Item>
                </ProDescriptions>
            </div>

            <Divider orientation='left'>{language('project.resmngt.assignmentinformation')}</Divider>
            <div className='assignmentinformation alfrommodalmargin'>
                <ProFormText name='applyIPAddr' >
                    <EditableProTable
                        className='assignmentinformationtable'
                        scroll={{ y: 108 }}
                        value={approvalList}
                        //边框
                        cardBordered={true}
                        bordered={true}
                        //单选框选中变化
                        rowSelection={false}
                        //设置选中提示消失
                        tableAlertRender={false}
                        columns={columnsInfo}
                        //页面数据信息
                        rowKey="id"
                        // rowKey={record => record.ipaddr}
                        //头部搜索框关闭
                        search={false}
                        pagination={false}
                        dateFormatter="string"
                        headerTitle={false}
                        toolBarRender={false}
                        recordCreatorProps={false}
                        editable={{
                            type: 'multiple',
                            editableKeys,
                            onChange: setEditableRowKeys,
                            actionRender: (row, config, defaultDom) => {
                                return [
                                    defaultDom.save,
                                    defaultDom.delete,
                                ];
                            },
                            saveText: <SaveFilled />,
                            deleteText: <GoTrashcan style={{ color: 'red' }} />,
                        }}
                    />
                </ProFormText>
                <Button icon={<IdcardFilled />} style={{ top: '3px', left: '81%' }} type="primary" onClick={() => {
                    getMenu();
                    getMaskModal(1)
                }}>
                    <span>{language('project.resmngt.addrallc.distribution')}</span>
                </Button>
            </div>
            <Divider orientation='left'>{language('project.resmngt.approval.approvaloperation')}</Divider>
            <div className='approvalprocess alfrommodalmargin'>
                <ProFormText hidden={true} name="orderID" initialValue={initialValue.orderID} label="orderID" />
                <ProFormTextArea width='100%' name="reason" rules={[{ required: true, message: language('project.pleasefill') }]} label={language('project.resmngt.resapply.approvedescription')} />
            </div>
        </ModalForm>
        {/* IP地址选择弹出框 */}
        <ModalForm
            layout="horizontal"
            className='aaipmodalfrom'
            width="1100px"
            formRef={ipFormRef}
            title={language('project.resmngt.addrallc.addressassign')}
            visible={iPModalStatus} autoFocusFirstInput
            modalProps={{
                maskClosable: false,
                onCancel: () => {
                    allMaskModal();
                },
            }}
            onVisibleChange={setIPModalStatus}
            submitTimeout={2000} onFinish={async (values) => {
                ipaddrShow();
            }}>

            <ProCard className='abottomboxone' style={{ height: '272px' }} ghost gutter={[13, 13]}>
                <ProCard ghost >
                    {/* 左侧列表 */}
                    <ProCard ghost bordered colSpan="170px" style={{ height: '100%' }}>
                        <div className='lefttitlebox'><ClusterOutlined style={{ fontSize: "18px", color: '#08c', height: '35px' }} />{language('project.resmngt.approval.subnetlist')}</div>
                        <Menu className='snetmenu'
                            defaultSelectedKeys="1"
                            style={{
                                height: 'calc(100% - 59px)'
                            }}
                            onClick={(e) => {
                                let info = '';
                                treelist.map((item) => {
                                    if (item.key == e.key) {
                                        info = item.label
                                    }

                                })
                                onSelectLeft(e.key, info)
                            }}
                            items={treelist}
                        />
                    </ProCard>
                    {/* 右侧盒子 */}
                    <ProCard ghost direction='column' style={{ height: '272px', padding: '10px' }} bordered gutter={[3, 3]}>
                        {/* 上层盒子 */}
                        <ProCard ghost style={{ height: '37px' }} >
                            <ProCard ghost colSpan='252px'>
                                <div className='timeselect'>
                                    <ProFormRadio.Group
                                        key='time'
                                        name="validType"
                                        label={language('project.resmngt.addrallc.selectmode')}
                                        radioType="button"
                                        value={ipValidType}
                                        onChange={(key) => {
                                            setIpValidType(key.target.value)
                                        }}
                                        options={[
                                            {
                                                key: 1,
                                                label: language('project.resmngt.approval.forever'),
                                                value: 'forever',
                                            },
                                            {
                                                key: 2,
                                                label: language('project.resmngt.approval.expire'),
                                                value: 'expire',
                                            }
                                        ]}
                                    />
                                </div>
                            </ProCard>
                            <ProCard ghost colSpan='160px'>
                                <ProFormDateTimePicker name="expireTime"
                                    onChange={(key, val) => {
                                        //更新选中时间
                                        setIpValidTime(val);
                                    }}
                                    fieldProps={{
                                        format: (value) => value.format('YYYY-MM-DD HH:mm:ss')
                                    }}
                                    value={ipValidTime}
                                    showTime
                                // initialValue={validTime}
                                />
                            </ProCard>
                            <ProCard ghost>
                                <Alert className='aaddressalertinfo' message={language('project.resmngt.approval.addsalerttext')} type="info" showIcon />
                            </ProCard>
                        </ProCard >
                        {/* 下层按钮盒子 */}
                        <ProCard ghost  >
                            <ProCard ghost  >
                                <div className='approvalfootbotton' >
                                    <div className='sapprovalfootbottonone' onMouseDown={(e) => {
                                        document.onmousemove = (e) => {
                                            // console.log(e)
                                        }
                                    }}>
                                        {generateMenus()}
                                    </div>
                                </div>
                            </ProCard>
                        </ProCard>
                    </ProCard>
                </ProCard>
            </ProCard>
        </ModalForm>
    </>);
};
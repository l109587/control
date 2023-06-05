import React, { useRef, useState, useEffect } from 'react';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { ProTable, ModalForm, ProFormSelect, ProFormTextArea, ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Button, TreeSelect, Input, message, Space, Tag, Popconfirm, Divider, Form, Steps, Alert, Tooltip } from 'antd';
import { post } from '@/services/https';
import { language } from '@/utils/language';
import { AiFillEye, AiOutlineClockCircle, AiFillInfoCircle } from "react-icons/ai";
import { GoTrashcan } from "react-icons/go";
import { BiArchiveOut, BiUserCircle } from "react-icons/bi";
import { BsFillCheckCircleFill, BsQuestionCircleFill, BsXCircleFill } from "react-icons/bs";
import '@/utils/index.less';
import './index.less';
import Eraser from '@/assets/nfd/resmngt-eraser.svg';
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
            delList(record)
        }} key="popconfirmdel"
            title={language('project.delconfirm')}
            okButtonProps={{
                loading: confirmLoading,
            }} okText={language('project.yes')} cancelText={language('project.no')}>
            <a>{text}</a>
        </Popconfirm>
    );
    const renderSubmit = (text, record) => (
        <Popconfirm onConfirm={() => {
            //提交方法
            save('submit', record);
        }} key="popconfirmsave"
            title={language('project.submitconfirm')}
            okButtonProps={{
                loading: confirmLoading,
            }} okText={language('project.yes')} cancelText={language('project.no')}>
            <a>{text}</a>
        </Popconfirm>
    );

    //添加编辑列表
    const addColumn = [
        {
            title: language('project.resmngt.resapply.ipaddrress'),
            dataIndex: 'ipaddr',
            width: 100,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.subnet'),
            dataIndex: 'subnet',
            width: 110,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.zone'),
            dataIndex: 'zone',
            width: 110,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.organization'),
            dataIndex: 'org',
            width: 90,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.user'),
            dataIndex: 'user',
            width: 60,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.businesspurpose'),
            dataIndex: 'buisUsg',
            width: 80,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.macaddress'),
            dataIndex: 'macaddr',
            width: 110,
            ellipsis: true,
        }
    ];

    const columns = [
        {
            title: '',
            dataIndex: 'id',
            width: 80,
            ellipsis: true,
            hideInTable: true,
        },
        {
            title: language('project.resmngt.resapply.orderstate'),
            dataIndex: 'orderState',
            width: 90,
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
            title: language('project.resmngt.resapply.orderid'),
            dataIndex: 'orderID',
            width: 120,
            ellipsis: true,
            valueType: 'select',
        },
        {
            title: language('project.resmngt.resapply.cancellationipaddr'),
            dataIndex: 'ipaddr',
            width: 120,
            ellipsis: true,

        },
        {
            title: language('project.resmngt.resapply.zone'),
            dataIndex: 'zone',
            width: 120,
            ellipsis: true,

        },
        {
            title: language('project.resmngt.resapply.organization'),
            dataIndex: 'org',
            width: 120,
            ellipsis: true,

        },
        {
            title: language('project.resmngt.resapply.applicant'),
            dataIndex: 'user',
            width: 80,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.phone'),
            dataIndex: 'phone',
            width: 110,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.purpose'),
            dataIndex: 'buisUsg',
            width: 100,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.macaddress'),
            dataIndex: 'mac',
            width: 120,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.applypeople'),
            dataIndex: 'applicant',
            width: 80,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.approvalperson'),
            dataIndex: 'approvalPerson',
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
            width: 120,
            fixed: 'right',
            align: 'center',
            render: (text, record, _, action) => [
                record.orderState != 'unsubmitted' ?
                    <a key="edi"
                        onClick={() => {
                            seeModalFrame(record);
                        }}>
                        <Tooltip title={language('project.see')} >
                            <AiFillEye className='seeicon' size={18} style={{ fontSize: '18px' }} />
                        </Tooltip>
                    </a>
                    :
                    <>
                        {renderRemove(<Tooltip title={language('project.del')} ><GoTrashcan style={{ fontSize: '18px', color: 'red' }} /></Tooltip>, record)}
                        {renderSubmit(<Tooltip title={language('project.submit')} ><BiArchiveOut className='seeicon' size={18} style={{ fontSize: '18px', color: '#12C189' }} /></Tooltip>, record)}
                    </>
            ],
        },
    ];
    const [form] = Form.useForm();
    const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
    const [seeModalStatus, setSeeModalStatus] = useState(false);//model 查看弹框状态
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);//选中id数组
    const [initialValue, setInitialValue] = useState([]);//默认查看头部列表数据
    const [dataSource, setDataSource] = useState([]);
    const [dataInfo, setDataInfo] = useState([]);//查看 申请 ip 列表
    const [notesContent, setNotesContent] = useState();//备注信息
    const [approvalProcessList, setApprovalProcessList] = useState([]);//审批流程列表数据

    //区域数据
    const zoneType = 'zone';
    const [treeValue, setTreeValue] = useState();
    const [treekey, setTreekey] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const [zoneVal, setZoneVal] = useState();//添加区域id、
    const [zoneNameVal, setZoneNameVal] = useState();//添加区域名称

    //组织机构
    const orgType = 'org';
    const [orgValue, setOrgValue] = useState();
    const [orgkey, setOrgkey] = useState([]);//选中多个key
    const [orgData, setOrgData] = useState([]);
    const [orgVal, setOrgVal] = useState();//添加组织结构id、
    const [orgNameVal, setOrgNameVal] = useState();//添加组织结构名称

    const [subNetList, setSubNetList] = useState([]);//子网列表

    /** table组件 start */
    const rowKey = (record => record.id);//列表唯一值
    const tableHeight = clientHeight;//列表高度
    const tableKey = 'racancellationapply';//table 定义的key
    const rowSelection = true;//是否开启多选框
    const addButton = true; //增加按钮  与 addClick 方法 组合使用
    const addTitle = language('project.assmngt.resapply.apply');
    const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
    const columnvalue = 'racancellationapplycolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
    const apishowurl = '/cfg.php?controller=confIPOrderManage&action=showIPRecycleApply';//接口路径
    const [queryVal, setQueryVal] = useState();//首个搜索框的值
    let searchVal = { queryVal: queryVal, queryType: 'fuzzy', showType: 'apply' };//顶部搜索框值 传入接口

    //初始默认列
    const concealColumns = {
        id: { show: false },
        notes: { show: false },
    }
    /* 顶部左侧搜索框*/
    const tableTopSearch = () => {
        return (
            <Search
                placeholder={language('project.resmngt.resapply.changesearch')}
                style={{ width: 200 }}
                onSearch={(queryVal) => {
                    setQueryVal(queryVal);
                    setIncID(incID + 1);
                }}
            />
        )
    }

    //添加按钮点击触发
    const addClick = () => {
        getModal(1, 'add');
    }

    /** table组件 end */

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
        let selValNum = selVal[selVal.length - 1];
        setTreeValue(selVal.join('/'));
        setTreekey(selKye);
        setZoneVal(selKyeNum)
        setZoneNameVal(selValNum)
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
        // let page = pagestart != ''?pagestart:startVal;
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
        let selValNum = selVal[selVal.length - 1];
        setOrgValue(selVal.join('/'));
        setOrgkey(selKye);
        setOrgVal(selKyeNum)
        setOrgNameVal(selValNum)
        subList(selKyeNum)
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

    //start  数据起始值   limit 每页条数 
    const subList = (orgID) => {
        let data = {};
        data.orgID = orgID;
        post('/cfg.php?controller=confIPAddrManage&action=showIPSubNetAddr', data).then((res) => {
            if (!res.success) {
                return false;
            }
            if (res.data.length > 0) {
                let info = [];
                res.data.map((item) => {
                    let confres = [];
                    confres.label = item.subNetaddr;
                    confres.value = item.id;
                    info.push(confres)
                })
                setSubNetList(info);
            }

        }).catch(() => {
            console.log('mistake')
        })
    }

    useEffect(() => {
        getTree();
    }, [])

    //删除功能
    const delList = (record) => {
        let data = {};
        data.ids = record.id;
        post('/cfg.php?controller=confIPOrderManage&action=delIPRecycleApply', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            setDataSource(dataSource.filter((item) => item.id !== record.id));
            setIncID(incID + 1);
        }).catch(() => {
            console.log('mistake')
        })
    }

    //选中触发
    const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
        // setRecord(record)//选中行重新赋值
        setSelectedRowKeys(selectedRowKeys)
        let deletestatus = true;
        if (selectedRowKeys != false) {
            deletestatus = false;
        }
        // setipDelStatus(deletestatus);//添加删除框状态
    }

    //判断是否弹出添加model
    const getModal = (status, op) => {
        if (status == 1) {
            setModalStatus(true);
        } else {
            setOrgValue('');
            setTreeValue('');
            setModalStatus(false);
        }
    }

    //查看弹出框页面数据赋值
    const seeModalFrame = (record) => {
        let data = {};
        data.id = record.id;
        post('/cfg.php?controller=confIPOrderManage&action=showIPRecycleFlow', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            res.data.recycleInfo.ipaddr = res.data.ipaddr;
            setInitialValue(res.data.recycleInfo);
            setApprovalProcessList(res.data.flowInfo);
            getSeeModal(1);
        }).catch(() => {
            console.log('mistake')
        })
    }
    //查看判断是否弹出添加model
    const getSeeModal = (status) => {
        if (status == 1) {
            setSeeModalStatus(true);
        } else {
            setSeeModalStatus(false);
        }
    }

    //更新修改功能
    const save = (action, record = '') => {
        let notes = record ? record.notes : notesContent;
        let ipaddr = '';
        let data = {};
        if (record) {
            ipaddr = record.ipaddr;
            data.id = record.id;
        } else {

            if (selectedRowKeys.length < 1) {
                let content = language('project.resmngt.resapply.serchgcancellationipaddr');
                message.error(content);
                return false;
            }
            ipaddr = selectedRowKeys.join(',');
        }
        data.op = action;
        data.ipaddrs = ipaddr;
        data.notes = notes;
        post('/cfg.php?controller=confIPOrderManage&action=setIPRecycleApply', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            getModal(2);
            setIncID(incID + 1);
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

    //重置
    const resetFields = () => {
        form.resetFields();
        searchFrom();
    }

    //添加搜索ip
    const searchFrom = () => {
        const data = form.getFieldsValue(true);
        let dataNum = 0;
        for (const key in data) {
            if (data[key]) {
                dataNum = dataNum + 1;
            }
        }
        if (dataNum < 1) {
            message.error(language('project.resmngt.resapply.fillinserchinfo'));
            return false;
        }
        post('/cfg.php?controller=confIPAddrManage&action=queryIPAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            setDataInfo(res.data);
        }).catch(() => {
            console.log('mistake')
        })
    }

    return (<>
        <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} addButton={addButton} addClick={addClick} addTitle={addTitle} rowSelection={rowSelection} />
        {/* 添加编辑弹出框 */}
        <ModalForm className='bgsaveform' width="802px"
            {...{
                layout: "horizontal",
            }}
            title={language('project.resmngt.resapply.allocationrequest')}
            visible={modalStatus} autoFocusFirstInput
            modalProps={{
                maskClosable: false,
                onCancel: () => {
                    getModal(2)
                },
            }}
            submitter={{
                render: (props, doms, info) => {
                    return [
                        doms[0],
                        <Button key="buttonsave" type='primary'
                            onClick={() => {
                                save('save')
                            }}
                        >
                            <span className='buttonmargint'>{language('project.save')}</span>
                        </Button>,
                        <Button key="buttonsubmit" type='primary'
                            onClick={() => {
                                save('submit')
                            }}
                        >
                            <span className='buttonmargint'>{language('project.submit')}</span>
                        </Button>
                    ]
                }
            }}
            onVisibleChange={setModalStatus}

            submitTimeout={2000}
        >
            <Alert className='caddressalertinfo'
                message={language('project.resmngt.resapply.serchipaddrcontent')}
                type="info" showIcon
            />
            <Form
                form={form}
                {...{
                    labelCol: {
                        xs: { span: 10 },
                    },
                    wrapperCol: {
                        xs: { span: 15 },
                    },
                    layout: "inline",
                }}
                className='caddressproform'
            >
                <Form.Item name='zoneID' label={language('project.resmngt.resapply.zone')}>
                    <TreeSelect
                        style={{ width: "150px" }}
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
                        rules={[{ required: true, message: language('project.select') }]}
                    />
                </Form.Item>
                <Form.Item name='orgID' label={language('project.resmngt.resapply.organization')}>
                    <TreeSelect
                        style={{ width: "150px" }}
                        treeDataSimpleMode
                        value={orgValue}
                        dropdownStyle={{
                            maxHeight: 400,
                            overflow: 'auto',
                        }}
                        placeholder={language('project.select')}
                        onChange={onOrgSelect}
                        loadData={onOrgData}
                        treeData={orgData}
                        rules={[{ required: true, message: language('project.select') }]}
                    />
                </Form.Item>
                <Form.Item name='subnetID' label={language('project.resmngt.resapply.subnet')}>
                    <ProFormSelect
                        style={{ width: "150px" }}
                        options={subNetList}
                    />
                </Form.Item>
                <Form.Item name='ipaddr' label={language('project.resmngt.resapply.cancellationipaddr')}>
                    <Input style={{ width: "150px" }} />
                </Form.Item>
                <Form.Item name='user' label={language('project.resmngt.resapply.user')}>
                    <Input style={{ width: "150px" }} />
                </Form.Item>
                <Form.Item style={{ marginLeft: "80px" }}>
                    <Button type='button' key='subment1'
                        onClick={() => {
                            resetFields();
                        }}
                        style={{ backgroundColor: '#1890FF', borderRadius: 5, color: '#FFFFFF' }}
                        icon={<ReloadOutlined />}>
                        {language('project.reset')}
                    </Button>
                    <Button type='button' key='subment2'
                        onClick={() => {
                            searchFrom();
                        }}
                        style={{ backgroundColor: '#1890FF', borderRadius: 5, color: '#FFFFFF' }}
                        icon={<SearchOutlined />}>
                        {language('project.query')}
                    </Button>
                </Form.Item>
            </Form>
            <div className='caddformationbox'>
                <ProTable
                    className='cassignmentinformationtable'
                    scroll={{ y: 208 }}
                    //边框
                    cardBordered={true}
                    bordered={true}
                    rowkey='id'

                    //单选框选中变化
                    rowSelection={{
                        selectedRowKeys,
                        onChange: onSelectedRowKeysChange,
                        getCheckboxProps: (record) => ({
                            disabled: record.from === 'remote',
                            // name: record.name,
                        }),
                    }}
                    //设置选中提示消失
                    tableAlertRender={false}
                    columns={addColumn}
                    //页面数据信息
                    dataSource={dataInfo}
                    editable={{
                        type: 'multiple',
                    }}
                    rowKey={record => record.ipaddr}
                    //头部搜索框关闭
                    search={false}
                    pagination={false}
                    dateFormatter="string"
                    headerTitle={false}
                    toolBarRender={false}
                />
                <div className='caddformtextarea'>
                    <ProFormTextArea label='申请备注' onChange={(val) => {
                        setNotesContent(val.target.value)
                    }} />
                </div>

            </div>

        </ModalForm>
        {/* //查看弹出框 */}
        <ModalForm
            labelCol={{ xs: { span: 9 } }}
            wrapperCol={{ xs: { span: 12 } }}
            width="570px"
            layout="horizontal"
            className='bgseemodalfrom'
            title={language('project.resmngt.resapply.cancellationapply')}
            visible={seeModalStatus} autoFocusFirstInput
            submitter={false}
            modalProps={{
                maskClosable: false,
                onCancel: () => {
                    getSeeModal(2)
                },
            }}
            onVisibleChange={setSeeModalStatus}
            submitTimeout={2000} >

            <Alert className='caddressalertinfo' message={language('project.resmngt.cancellationipaddrcontent', { ipaddr: initialValue.ipaddr })} type="info" showIcon icon={<img src={Eraser} />} />
            <Divider orientation='left'>{language('project.resmngt.cancellationinfo')}</Divider>
            <div className='capplicationinformation'>
                <ProDescriptions column={2}>
                    <ProDescriptions.Item name='user' label={language('project.resmngt.resapply.user')}>{initialValue.user ? initialValue.user : ''} </ProDescriptions.Item>
                    <ProDescriptions.Item name="phone" label={language('project.resmngt.resapply.contactnumber')}>{initialValue.phone ? initialValue.phone : ' '}</ProDescriptions.Item>
                </ProDescriptions>
                <ProDescriptions column={2}>
                    <ProDescriptions.Item name='zone' label={language('project.resmngt.resapply.zone')}>{initialValue.zone ? initialValue.zone : ''}</ProDescriptions.Item>
                    <ProDescriptions.Item name="org" label={language('project.resmngt.resapply.organization')}>{initialValue.org ? initialValue.org : ' '}</ProDescriptions.Item>
                </ProDescriptions>
                <ProDescriptions column={2}>
                    <ProDescriptions.Item name='buisUsg' label={language('project.resmngt.resapply.businesspurpose')}>{initialValue.buisUsg ? initialValue.buisUsg : ''}</ProDescriptions.Item>
                    <ProDescriptions.Item name='mac' label={language('project.resmngt.resapply.macaddress')}>{initialValue.mac ? initialValue.mac : ''}</ProDescriptions.Item>
                </ProDescriptions>
            </div>
            <Divider orientation='left'>{language('project.resmngt.approvalprocess')}</Divider>
            <div className='approvalprocess cfrommodalmargin'>
                <Steps direction='vertical' size='small' >
                    {approvalProcess()}
                </Steps>

            </div>
        </ModalForm>
    </>);
};
import React, { useRef, useState, useEffect } from 'react';
import { EditFilled } from '@ant-design/icons';
import { ProTable, ModalForm, ProFormText, ProFormTextArea, ProFormSelect, ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Button, Input, message, Space, Tag, TreeSelect, Popconfirm, Divider, Steps, Tooltip } from 'antd';
import { post, get } from '@/services/https';
import { NotesText, NameText } from '@/utils/fromTypeLabel';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { AiFillEye, AiOutlineClockCircle, AiFillInfoCircle } from "react-icons/ai";
import { GoTrashcan } from "react-icons/go";
import { BiArchiveOut, BiUserCircle } from "react-icons/bi";
import { BsFillCheckCircleFill, BsQuestionCircleFill, BsXCircleFill } from "react-icons/bs";
import { regMacList, regList, regSeletcList } from '@/utils/regExp';
import '@/utils/index.less';
import './index.less';
import { TableLayout, DynFieldReg } from '@/components';
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

    const columnsInfo = [
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
    const columnsList = [
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
            width: 80,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.applynum'),
            dataIndex: 'applyNum',
            width: 80,
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
            title: language('project.resmngt.resapply.vlan'),
            dataIndex: 'vlan',
            width: 80,
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
            width: 120,
            fixed: 'right',
            align: 'center',
            render: (text, record, _, action) => [
                record.orderState != 'unsubmitted' ?
                    <a key="editable"
                        onClick={() => {
                            seeModalFrame(record);
                        }}>
                        <Tooltip title={language('project.see')} >
                            <AiFillEye className='seeicon' size={18} style={{ fontSize: '18px' }} />
                        </Tooltip>
                    </a>
                    :
                    <>
                        <a key="mod" onClick={() => {
                            mod(record);
                        }}>
                            <Tooltip title={language('project.edit')} >
                                <EditFilled style={{ fontSize: '18px' }} />
                            </Tooltip>
                        </a>
                        {renderRemove(<Tooltip title={language('project.del')} ><GoTrashcan style={{ fontSize: '18px', color: 'red' }} /></Tooltip>, record)}
                        {renderSubmit(<Tooltip title={language('project.submit')} ><BiArchiveOut className='seeicon' size={18} style={{ fontSize: '18px', color: '#12C189' }} /></Tooltip>, record)}
                    </>
            ],
        },
    ];
    const formRef = useRef();
    const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
    const [seeModalStatus, setSeeModalStatus] = useState(false);//model 查看弹框状态
    const [initialValue, setInitialValue] = useState([]);//默认查看头部列表数据
    const [purposeList, setPurposeList] = useState([]);//业务用途
    const [dataSource, setDataSource] = useState([]);
    const [dataInfo, setDataInfo] = useState([]);//查看 申请 ip 列表
    const [approvalProcessList, setApprovalProcessList] = useState([]);//审批流程列表数据

    const [dynamicFieldList, setDynamicFieldList] = useState([]);//动态字段列表
    let dynamicFieldListLet = [];
    const [submitType, setSubmitType] = useState();//提交类型，编辑还是添加
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

    const [columns, setColumns] = useState(columnsList);//table 头部数据

    /** table组件 start */
    const rowKey = (record => record.id);//列表唯一值
    const tableHeight = clientHeight;//列表高度
    const tableKey = 'raallocationrequest';//table 定义的key
    const rowSelection = true;//是否开启多选框
    const addButton = true; //增加按钮  与 addClick 方法 组合使用
    const addTitle = language('project.resmngt.resapply.apply');
    const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
    const columnvalue = 'raallocationrequestcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
    const apishowurl = '/cfg.php?controller=confIPOrderManage&action=showIPAllocApply';//接口路径
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
                placeholder={language('project.resmngt.resapply.dissearch')}
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
        formRef.current.setFieldsValue({ zoneID: selKyeNum })
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
        formRef.current.setFieldsValue({ orgID: selKyeNum })
        setOrgValue(selVal.join('/'));
        setOrgkey(selKye);
        setOrgVal(selKyeNum)
        setOrgNameVal(selValNum)
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
        getTree();
        getBusinessPurpose();
        getDynamicField();
    }, [])

    //获取动态字段列表
    const getDynamicField = () => {
        let data = {};
        data.filterType = 'dynamic';
        data.modtype = 'resource';
        post('/cfg.php?controller=confResField&action=showResFieldList', data).then((res) => {
            if (res.data.length > 0) {
                setDynamicFieldList(res.data);
                dynamicFieldListLet = res.data;
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

    //删除功能
    const delList = (record) => {
        let data = {};
        data.ids = record.id;
        post('/cfg.php?controller=confIPOrderManage&action=delIPAllocApply', data).then((res) => {
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

    //编辑
    const mod = (record) => {
        //区域显示值
        setTreeValue(record.fullZone);
        setZoneVal(record.zoneID);

        //机构显示值
        setOrgValue(record.fullOrg);
        setOrgVal(record.orgID);
        setTimeout(function () {
            formRef.current.setFieldsValue(record)
        }, 100)
        getModal(1, 'mod');
    }

    //更新修改功能
    const save = (action, record = '') => {
        let fieldData = ['id', 'user', 'phone', 'buisUsg', 'applyNum', 'mac', 'vlan', 'notes'];
        let list = dynamicFieldList.length < 1 ? dynamicFieldListLet : dynamicFieldList;
        list.map((item) => {
            fieldData.push(item.key)
        })
        let obj = record ? record : formRef.current.getFieldsValue(fieldData);
        let data = {};
        data.op = action;
        data.id = obj.id;
        data.zoneID = record ? record.zoneID : zoneVal;
        data.orgID = record ? record.orgID : orgVal;
        data.user = obj.user;
        data.phone = obj.phone;
        data.buisUsg = obj.buisUsg;
        data.applyNum = obj.applyNum;
        data.mac = obj.mac;
        data.vlan = obj.vlan;
        data.notes = obj.notes;
        list.map((item) => {
            data[item.key] = obj[item.key]
        })
        post('/cfg.php?controller=confIPOrderManage&action=setIPAllocApply', data).then((res) => {
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

    //判断是否弹出添加model
    const getModal = (status, op) => {
        if (status == 1) {
            setModalStatus(true);
        } else {
            formRef.current.resetFields();
            setModalStatus(false);
        }
    }

    //查看判断是否弹出添加model
    const getSeeModal = (status) => {
        if (status == 1) {
            setSeeModalStatus(true);
        } else {
            formRef.current.resetFields();
            setSeeModalStatus(false);
        }
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
                                        {/* <div style={{ display:'flex',alignItems:'center' }}>
                                    <div className='iconbox' ><AiOutlineClockCircle /></div>
                                    {item.time}
                                </div> */}
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

    //动态字段
    const modDynamicField = () => {
        return dynamicFieldList.map((item) => {
            //判断输入形式是下拉框还是列表框
            if (item.form == 'box') {
                return (
                    <ProFormText
                        name={item.key}
                        label={item.name}
                        rules={DynFieldReg(item.type, item.required)}
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
                        rules={DynFieldReg(item.type, item.required)}
                    />
                )
            }
        })
    }

    return (<>
        <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} addButton={addButton} addClick={addClick} addTitle={addTitle} rowSelection={rowSelection} />

        {/* 添加编辑弹出框 */}
        <ModalForm {...modalFormLayout}
            formRef={formRef}
            className='addacmodalfrom'
            htmlType='submit'
            title={language('project.resmngt.resapply.allocationrequest')}
            visible={modalStatus} autoFocusFirstInput
            modalProps={{
                maskClosable: false,
                onCancel: () => {
                    getModal(2);
                },
            }}
            submitter={{
                render: (props, doms, info) => {
                    return [
                        doms[0],
                        <Button key="buttonsave" type='primary' htmlType='submit'
                            onClick={() => {
                                setSubmitType('save');
                                formRef.current.submit();
                            }}
                        >
                            <span className='buttonmargint'>{language('project.save')}</span>
                        </Button>,
                        <Button key="buttonsubmit" type='primary'
                            onClick={() => {
                                setSubmitType('submit');
                                formRef.current.submit();
                            }}
                        >
                            <span className='buttonmargint'>{language('project.submit')}</span>
                        </Button>
                    ]
                }
            }}
            onVisibleChange={setModalStatus}
            onFinishFailed={(values, error, kye) => {
                //提交正则验证失败方法
            }}
            submitTimeout={2000} onFinish={async (values) => {
                save(submitType);
            }}>
            <ProFormText hidden={true} type="hidden" name="id" label="IP" />
            <ProFormText name='zoneID' rules={[{ required: true, message: regSeletcList.select.alertText }]} label={language('project.resmngt.resapply.zone')} >
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
                    rules={[{ required: true, message: language('project.select') }]}
                />
            </ProFormText>
            <ProFormText name='orgID' rules={[{ required: true, message: regSeletcList.select.alertText }]} label={language('project.resmngt.resapply.organization')} >
                <TreeSelect
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
            </ProFormText>
            <NameText name="user"
                required={true}
                label={language('project.resmngt.resapply.user')} 
            />
            <ProFormText name="phone" label={language('project.resmngt.resapply.contactnumber')} rules={[
                { 
                    pattern: regList.phoneorlandline.regex, 
                    message: regList.phoneorlandline.alertText, 
                    }
            ]}/>
            <ProFormSelect options={purposeList}
                name="buisUsg"
                label={language('project.resmngt.resapply.businesspurpose')}
            />

            <ProFormText name="applyNum" rules={[
                {
                    required: true,
                    pattern: regList.numPattern.regex,
                    message: regList.numPattern.alertText,
                },
            ]} label={language('project.resmngt.resapply.number')} />
            <ProFormText name="vlan"
                rules={[
                    {
                        pattern: regMacList.vlan.regex,
                        message: regMacList.vlan.alertText,
                    },
                ]}
                label={language('project.resmngt.resapply.vlan')} />
            <ProFormText name="mac"
                rules={[
                    {
                        pattern: regMacList.mac.regex,
                        message: regMacList.mac.alertText,
                    },
                ]}
                label={language('project.resmngt.resapply.macaddress')} />
            {modDynamicField()}
            <NotesText name="notes" label={language('project.resmngt.resapply.remarks')} required={false} /> 
        </ModalForm>
        {/* //查看弹出框 */}
        <ModalForm
            labelCol={{ xs: { span: 9 } }}
            wrapperCol={{ xs: { span: 12 } }}
            width="570px"
            layout="horizontal"
            className='seemodalfrom'
            formRef={formRef}
            title={language('project.resmngt.resapply.approveview')}
            visible={seeModalStatus} autoFocusFirstInput
            submitter={false}
            modalProps={{
                maskClosable: false,
                onCancel: () => {
                    getSeeModal(2);
                },
            }}
            onVisibleChange={setSeeModalStatus}
            submitTimeout={2000} >
            <Divider orientation='left'>{language('project.resmngt.applicationinformation')}</Divider>
            <div className='sapplicationinformation'>
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
                    className='rassignmentinformationtable'
                    scroll={{ y: 108 }}
                    //边框
                    cardBordered={true}
                    bordered={true}
                    rowkey='id'
                    //单选框选中变化
                    rowSelection={false}
                    //设置选中提示消失
                    tableAlertRender={false}
                    columns={columnsInfo}
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
            <div className='rapprovalprocess frommodalmargin'>
                <Steps direction='vertical' size='small' >
                    {approvalProcess()}
                </Steps>

            </div>
        </ModalForm>
    </>);
};
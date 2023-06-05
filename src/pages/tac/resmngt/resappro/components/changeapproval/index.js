import React, { useRef, useState, useEffect } from 'react';
import { CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ProTable, ModalForm, ProFormText, ProFormTextArea, ProDescriptions, ProCard } from '@ant-design/pro-components';
import { Button, Input, message, Space, Tag, Divider, Steps, Alert, Tooltip } from 'antd';
import { post } from '@/services/https';
import { language } from '@/utils/language';
import { AiFillEye, AiOutlineClockCircle, AiFillInfoCircle } from "react-icons/ai";
import { BsFillCheckCircleFill, BsQuestionCircleFill, BsXCircleFill } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import { Seal } from '@icon-park/react';
import '@/utils/index.less';
import './index.less';
import Substitute from '@/assets/nfd/resmngt-substitute.svg';
import { TableLayout } from '@/components';
const { ProtableModule } = TableLayout;
let H = document.body.clientHeight - 481
var clientHeight = H
const { Search } = Input
const { Step } = Steps;
export default (props) => {

    //查看列表
    const columnsInfoSee = [
        {
            title: language('project.resmngt.resapply.changefield'),
            dataIndex: 'changefield',
            width: 80,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.changeinfo'),
            dataIndex: 'changeinfo',
            ellipsis: true,
        },
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
            title: language('project.resmngt.resapply.changeipaddr'),
            dataIndex: 'ipaddr',
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
            title: language('project.resmngt.resapply.zone'),
            dataIndex: 'zone',
            width: 120,
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
            title: language('project.resmngt.approval.macaddress'),
            dataIndex: 'mac',
            width: 120,
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
                                seeModalFrame(record, 'see');
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
    const refTable = useRef();
    const [approvalModalStatus, setApprovalModalStatus] = useState(false);//审批弹出框
    const [seeModalStatus, setSeeModalStatus] = useState(false);//model 查看弹框状态
    const [approvalProcessList, setApprovalProcessList] = useState([]);//审批流程列表数据
    const [dataInfo, setDataInfo] = useState([]);//查看 申请 ip 列表
    const [changeInfo, setChangeInfo] = useState([]);//审批变更信息
    const [initialValue, setInitialValue] = useState([]);//默认查看头部列表数据
    const [dynamicFieldList, setDynamicFieldList] = useState([]);//动态字段列表
    const [columns, setColumns] = useState(columnsList);//table 头部数据

    /** table组件 start */
    const rowKey = (record => record.id);//列表唯一值
    const tableHeight = clientHeight;//列表高度
    const tableKey = 'rchangeapproval';//table 定义的key
    const rowSelection = true;//是否开启多选框
    const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
    const columnvalue = 'rchangeapprovalcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
    const apishowurl = '/cfg.php?controller=confIPOrderManage&action=showIPChangeApply';//接口路径
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
                placeholder={language('project.resmngt.approval.changesearch')}
                style={{ width: 200 }}
                onSearch={(queryVal) => {
                    setQueryVal(queryVal);
                    setIncID(incID + 1);
                }}
            />
        )
    }

    /** table组件 end */

    useEffect(() => {
        getDynamicField();
    }, [])

    //获取动态字段列表
    const getDynamicField = () => {
        let data = {};
        data.filterType = 'dynamic';
        data.modtype = 'resource';
        post('/cfg.php?controller=confResField&action=showResFieldList', data).then((res) => {
            refTable.current = res.data;
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
                setDynamicFieldList(res.data);
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
        seeModalFrame(record, 'approval');
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
    const seeModalFrame = (record, type) => {
        let data = {};
        data.id = record.id;
        post('/cfg.php?controller=confIPOrderManage&action=showIPChangeFlow', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            res.data.baseInfo.ipaddr = res.data.ipaddr;
            res.data.baseInfo.id = record.orderID;
            setInitialValue(res.data.baseInfo);
            let dataInfo = [
                { 'changefield': language('project.resmngt.resapply.user'), 'changeinfo': res.data.changeInfo.user },
                { 'changefield': language('project.resmngt.resapply.contactnumber'), 'changeinfo': res.data.changeInfo.phone },
                { 'changefield': language('project.resmngt.resapply.businesspurpose'), 'changeinfo': res.data.changeInfo.buisUsg },
                { 'changefield': language('project.resmngt.resapply.macaddress'), 'changeinfo': res.data.changeInfo.mac },
            ]

            refTable.current.map((item) => {
                dataInfo.push({ 'changefield': item.name, 'changeinfo': res.data.changeInfo[item.key] });
            })
            setDataInfo(dataInfo);
            setApprovalProcessList(res.data.flowInfo);
            if (type == 'see') {
                getSeeModal(1);
            } else {
                res.data.changeInfo.ipaddr = res.data.ipaddr;
                setChangeInfo(res.data.changeInfo);
                getApporvalModal(1)
            }

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

    //操作关闭后清空数据
    const operationOffEmpty = () => {
        //清空弹框上部列表信息
        setInitialValue([]);
    }

    //审批通过
    const approvalAdopt = () => {
        let obj = formRef.current.getFieldsValue(['reason', 'id']);
        let data = {};
        data.notes = obj.reason;
        data.orderID = obj.id;
        for (const key in changeInfo) {
            data[key] = changeInfo[key];
        }
        post('/cfg.php?controller=confIPOrderManage&action=agreeIPChangeApply', data).then((res) => {
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
        const obj = formRef.current.getFieldsValue(['reason', 'id']);
        let data = {};
        data.orderID = obj.id;
        data.notes = obj.reason;
        post('/cfg.php?controller=confIPOrderManage&action=rejectIPChangeApply', data).then((res) => {
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

    return (<>
        <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} rowSelection={rowSelection} />

        {/* 审批弹出框 */}
        <ModalForm
            formRef={formRef}
            width="570px"
            key='chapprovalmodalfrom'
            className='chapprovalmodalfrom'
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
                        <Button key="2" icon={<CloseCircleOutlined />} type='primary' danger
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
            submitTimeout={2000} >
            <Alert className='caddressalertinfo' message={language('project.resmngt.changeipaddrcontent', { ipaddr: initialValue.ipaddr })} type="info" showIcon icon={<img src={Substitute} />} />
            <Divider orientation='left'>{language('project.resmngt.oldinfo')}</Divider>
            <div className='aapplicationinformations'>
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
                    <ProDescriptions.Item name='macaddress' label={language('project.resmngt.resapply.macaddress')}>{initialValue.mac ? initialValue.mac : ''}</ProDescriptions.Item>
                </ProDescriptions>
            </div>

            <Divider orientation='left'>{language('project.resmngt.changeinfo')}</Divider>
            <div className='assignmentinformation alfrommodalmargin'>
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
                    //头部搜索框关闭
                    search={false}
                    pagination={false}
                    dateFormatter="string"
                    headerTitle={false}
                    toolBarRender={false}
                />
            </div>
            <Divider orientation='left'>{language('project.resmngt.approval.approvaloperation')}</Divider>
            <div className='approvalprocess alfrommodalmargin'>
                <ProFormText hidden={true} name="id" initialValue={initialValue.id} label="id" />
                <ProFormTextArea width='100%' name="reason" rules={[{ required: true, message: language('project.pleasefill') }]} label={language('project.resmngt.resapply.approvedescription')} />
            </div>
        </ModalForm>
        {/* //查看弹出框 */}
        <ModalForm
            labelCol={{ xs: { span: 9 } }}
            wrapperCol={{ xs: { span: 12 } }}
            width="570px"
            layout="horizontal"
            className='chseemodalfrom'
            key='chseemodalfrom'
            formRef={formRef}
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

            <Alert className='caddressalertinfo' message={language('project.resmngt.changeipaddrcontent', { ipaddr: initialValue.ipaddr })} type="info" showIcon icon={<img src={Substitute} />} />
            <Divider orientation='left'>{language('project.resmngt.oldinfo')}</Divider>
            <div className='capplicationinformation'>
                <ProDescriptions column={2}>
                    <ProDescriptions.Item name='applicant' label={language('project.resmngt.resapply.user')}>{initialValue.user ? initialValue.user : ''} </ProDescriptions.Item>
                    <ProDescriptions.Item name="phone" label={language('project.resmngt.resapply.contactnumber')}>{initialValue.phone ? initialValue.phone : ' '}</ProDescriptions.Item>
                </ProDescriptions>
                <ProDescriptions column={2}>
                    <ProDescriptions.Item name='purpose' label={language('project.resmngt.resapply.businesspurpose')}>{initialValue.buisUsg ? initialValue.buisUsg : ''}</ProDescriptions.Item>
                    <ProDescriptions.Item name='macaddress' label={language('project.resmngt.resapply.macaddress')}>{initialValue.mac ? initialValue.mac : ''}</ProDescriptions.Item>
                </ProDescriptions>
            </div>

            <Divider orientation='left'>{language('project.resmngt.changeinfo')}</Divider>
            <div className='cassignmentinformation cfrommodalmargin'>
                <ProTable
                    className='cassignmentinformationtable'
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
                    //头部搜索框关闭
                    search={false}
                    pagination={false}
                    dateFormatter="string"
                    headerTitle={false}
                    toolBarRender={false}
                />
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
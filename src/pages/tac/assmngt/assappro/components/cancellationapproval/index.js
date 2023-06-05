import React, { useRef, useState, useEffect } from 'react';
import { CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ProTable, ModalForm, ProFormText, ProFormTextArea, ProDescriptions, ProCard, DrawerForm } from '@ant-design/pro-components';
import { Button, Input, message, Space, Tag, Divider, Steps, Alert, Tooltip } from 'antd';
import { post, get } from '@/services/https';
import { language } from '@/utils/language';
import { AiFillEye, AiOutlineClockCircle, AiFillInfoCircle } from "react-icons/ai";
import { BsFillCheckCircleFill, BsQuestionCircleFill, BsXCircleFill, BsChevronContract } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import { Seal, ViewGridList } from '@icon-park/react';
import '@/utils/index.less';
import './index.less';
import Eraser from '@/assets/nfd/resmngt-eraser.svg';
import SignatureShow from '@/utils/showSignature';
import { TableLayout } from '@/components';
const { ProtableModule } = TableLayout;
let H = document.body.clientHeight - 481
var clientHeight = H
const { Search } = Input
const { Step } = Steps;
export default (props) => {
    const columnsInfo = [
        {
            title: language('project.assmngt.resapply.ipaddrress'),
            dataIndex: 'ipaddr',
            width: 120,
            ellipsis: true,
        },
        {
            title: language('project.assmngt.macaddr'),
            dataIndex: 'macaddr',
            width: 130,
            ellipsis: true,
        },
        {
            title: language('project.resmngt.resapply.zone'),
            dataIndex: 'zone',
            width: 100,
            ellipsis: true,

        },
        {
            title: language('project.resmngt.approval.organization'),
            dataIndex: 'org',
            width: 100,
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
			title: language('project.assmngt.assettype'),
			dataIndex: 'assetType',
			width: 110,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.location'),
			dataIndex: 'location',
			width: 100,
			readonly: true,
			ellipsis: true,
		},
    ];
    const columns = [
        {
            title: language('project.assmngt.id'),
            dataIndex: 'id',
            width: 80,
            ellipsis: true,
            hideInTable: true,
        },
        {
            title: language('project.assmngt.resapply.orderstate'),
            dataIndex: 'orderState',
            width: 90,
            align: 'center',
            ellipsis: true,
            filterMultiple: false,
            filters: [
                { text: language('project.assmngt.approved'), value: 'approved' },
                { text: language('project.assmngt.unsubmitted'), value: 'unsubmitted' },
                { text: language('project.assmngt.rejected'), value: 'rejected' },
                { text: language('project.assmngt.inapproval'), value: 'inapproval' },
            ],
            render: (test, record, index) => {
                let color = '';
                let text = '';
                if (record.orderState == 'unsubmitted') {
                    color = 'processing';
                    text = language('project.assmngt.unsubmitted');
                } else if (record.orderState == 'rejected') {
                    color = 'purple';
                    text = language('project.assmngt.rejected');
                } else if (record.orderState == 'inapproval') {
                    color = 'error';
                    text = language('project.assmngt.inapproval');
                } else if (record.orderState == 'approved') {
                    color = 'success';
                    text = language('project.assmngt.approved');
                } else {

                }
                if (text) {
                    return (
                        <Space>
                            <Tag style={{ marginRight: '0px' }} color={color} key={record.orderState}>
                                {text}
                            </Tag>
                        </Space>
                    )
                }
            }
        },
        {
            title: language('project.assmngt.processingstate'),
            dataIndex: 'handleState',
            width: 100,
            align: 'center',
            ellipsis: true,
            filterMultiple: false,
            filters: [
                { text: language('project.assmngt.processed'), value: 'handled' },
                { text: language('project.assmngt.unprocessed'), value: 'unhandled' },
            ],
            render: (test, record, index) => {
                let color = '';
                let text = '';
                if (record.handleState == 'handled') {
                    color = 'success';
                    text = language('project.assmngt.processed')
                } else if (record.handleState == 'unhandled') {
                    color = 'default';
                    text = language('project.assmngt.unprocessed')
                }
                if (text) {
                    return (
                        <Tag style={{ marginRight: '0px' }} color={color}>
                            {text}
                        </Tag>
                    )
                }
            }
        },
        {
            title: language('project.resmngt.approval.workorderno'),
            dataIndex: 'orderID',
            width: 150,
            ellipsis: true,
            valueType: 'select',
            render: (test, record, index) => {
                if (record.batch == 'Y') {
                    return (
                        <Tooltip title={record.orderID}>
                            <div className="orderidbox">{record.orderID}</div>
                        </Tooltip>
                    )
                } else {
                    return <Tooltip title={record.orderID}>{record.orderID}</Tooltip>
                }
            },
        },
        {
            title: language('project.assmngt.macaddr'),
            dataIndex: 'macaddr',
            width: 135,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.assmngt.resapply.cancellationipaddr'),
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
            title: language('project.assmngt.assettype'),
            dataIndex: 'assetType',
            width: 110,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.assmngt.assetmodel'),
            dataIndex: 'assetModel',
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
            title: language('project.assmngt.location'),
            dataIndex: 'location',
            width: 120,
            readonly: true,
            ellipsis: true,
        },
        {
            title: language('project.assmngt.wherevlan'),
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
            dataIndex: 'approver',
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
                record.inner == 'Y' ? '' :
                    record.opbutton == 'show' ?
                        <>
                            <a key="editable"
                                onClick={() => {
                                    setRecordFind(record);
                                    seeModalFrame(record, 'see');
                                }}>
                                <Tooltip title={language('project.see')} >
                                    <AiFillEye className='seeicon' size={18} style={{ fontSize: '18px' }} />
                                </Tooltip>
                            </a>
                        </> : '',
                record.opbutton == 'approve' ?
                    <>
                        <a key="examine"
                            onClick={() => {
                                setRecordFind(record);
                                approvalModalFrame(record);
                            }}>
                            <Tooltip title={language('project.approval')} >
                                <Seal style={{ fontSize: '16px', color: '#FF7429' }} />
                            </Tooltip>
                        </a>
                    </> : '',

            ],
        },
    ];
    const formRef = useRef();
    const typeName = 'asset_withdrawal';
    const [recordFind, setRecordFind] = useState({});
    const [approvalModalStatus, setApprovalModalStatus] = useState(false);//审批弹出框
    const [approvalsModalStatus, setApprovalsModalStatus] = useState(false);//批量审批弹出框
    const [seeModalStatus, setSeeModalStatus] = useState(false);//model 查看弹框状态
    const [approvalProcessList, setApprovalProcessList] = useState([]);//审批流程列表数据
    const [initialValue, setInitialValue] = useState([]);//默认查看头部列表数据
    const [allApprovalList, setAllApprovalList] = useState([]);//批量注销列表
    const [signStatus, setSignStatus] = useState(false);//签章流程是否开启
    const [batchData, setBatchData] = useState([]);
    const [saFileList, setSaFileList] = useState([]);

    /** table组件 start */
    const rowKey = (record => record.id);//列表唯一值
    const tableHeight = clientHeight;//列表高度
    const tableKey = 'cancellationapproval';//table 定义的key
    const rowSelection = true;//是否开启多选框
    const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
    const columnvalue = 'cancellationapprovalcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
    const apishowurl = '/cfg.php?controller=confAssetManage&action=showSignOUTApply';//接口路径
    const [queryVal, setQueryVal] = useState();//首个搜索框的值
    let searchVal = { queryVal: queryVal, queryType: 'fuzzy', showType: 'approval' };//顶部搜索框值 传入接口
    let expandData = {};
    const onExpandUrl = '/cfg.php?controller=confAssetManage&action=showSignOUTSingleApply';
    const developShowKey = 'orderID';//展开图标放置列位置
    const expandAble = {
        rowkey: 'id',
        indentSize: 30,
        expandIconAsCell: false,
        expandIconColumnIndex: 4,
        expandIcon: ({ expanded, onExpand, record }) => {
            return record.batch == 'Y' ? expanded ? <Tooltip title={language('illevent.stow')}><BsChevronContract className='netipicon' style={{ fontSize: '18px', color: '#FF7429', marginBottom: '-4px' }} onClick={e => {
                onExpand(record, e)
            }} /></Tooltip> : (<Tooltip title={language('illevent.expand')}><ViewGridList className='netipicon' theme='outline' size='18' fill='#FF7429' onClick={e => {
                expandData.id = record.id
                expandData.orderID = record.orderID
                expandData.showFirst = 'N'
                onExpand(record, e)
            }} /></Tooltip>) : '';
        }
    }
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
        showSignature();
    }, [])

    //table 表头签章流程拼接
    const showSignature = () => {
        let data = {};
        data.name = typeName;
        post('/cfg.php?controller=confSignature&action=showSignature', data).then((res) => {
            if (res.success) {
                if (res.data.length > 0) {
                    if (res.data[0].status == 'Y') {
                        setSignStatus(true);
                    }
                } else {

                }
            }
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
            allApporvalModal();
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

    //批量审批判断是否弹出添加model
    const getApporvalsModal = (status) => {
        if (status == 1) {
            setApprovalsModalStatus(true);
        } else {
            operationOffEmpty();
            formRef.current.resetFields();
            setApprovalsModalStatus(false);
        }
    }
    //通用关闭批量审批弹框
    const allApporvalsModal = () => {
        getApporvalsModal(2);
    }


    /**
 * 获取批量数据内容
 * type  处理模板 template  批量数据获取  batchlist   批量列表编辑功能 batchtablelist
 */
    const showPSignINApply = (record, type = '', batchData = []) => {
        let data = {};
        data.id = record.id;
        data.orderID = record.orderID;
        data.batch = record.batch;
        post('/cfg.php?controller=confAssetManage&action=showSignOUTSingleApply', data).then((res) => {
            if (type == 'template') {
                let dArr = [];
                dArr.push(batchData[0]);
                let childrenBat = [...batchData[1].children];
                res.data?.map((item) => {
                    let findList = { title: '' }
                    findList.children = saModListTitle(childrenBat, item);
                    dArr.push(findList);
                })
                setBatchData(dArr);
            } else if (type == 'batchlist') {
                setAllApprovalList(res.data ? res.data : []);
                getApporvalsModal(1);
            }
        }).catch(() => {
            console.log('mistake')
        })
    }

    //文件签章内容处理title
    const saModListTitle = (list, record = '') => {
        let data = []
        if (list.length > 0) {
            list.map((item) => {
                let obj = { title: record[item.key] };
                if (record.changedFields?.indexOf(item.key) != -1 && record.changedFields) {
                    obj.tdColor = '#FCCA00'
                }
                data.push(obj)
            })
        }
        return data;
    }

    //查看弹出框页面数据赋值
    const seeModalFrame = (record, type) => {
        let data = {};
        data.id = record.id;
        data.batch = record.batch;
        post('/cfg.php?controller=confAssetManage&action=showSignOUTFlow', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            if (record.batch == 'Y') {
                setSaFileList(res.data ? res.data.recycleInfo : []);
            } else {
                res.data.recycleInfo.ipaddr = res.data.ipaddr;
                res.data.recycleInfo.id = record.orderID;
                res.data.recycleInfo.macaddr = res.data.macaddr;
                setInitialValue(res.data.recycleInfo);
            }
            setApprovalProcessList(res.data.flowInfo);
            if (type == 'see') {
                getSeeModal(1);
            } else {
                getApporvalModal(1);
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
                    {item.action === 'approval' && index + 1 >= approvalNum && (item.result == 'approved' || item.result == 'rejected') ?
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
            formRef.current.resetFields();
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
    const approvalAdopt = (type) => {
        let data = {};
        let obj = formRef.current.getFieldsValue(['reason']);
        if (recordFind.batch == 'Y') {
            data.batch = 'Y';
            data.list = JSON.stringify(saFileList);
        }
        data.orderID = recordFind.orderID;
        data.notes = obj.reason;
        data.ipaddr = recordFind.ipaddr;
        data.macaddr = recordFind.macaddr;
        post('/cfg.php?controller=confAssetManage&action=agreeSignOUTApply', data).then((res) => {
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
        let data = {};
        let obj = formRef.current.getFieldsValue(['reason']);
        if (recordFind.batch == 'Y') {
            data.batch = 'Y';
            data.list = JSON.stringify(saFileList);
        }
        data.orderID = recordFind.orderID;
        data.ipaddr = recordFind.ipaddr;
        data.macaddr = recordFind.macaddr;
        data.notes = obj.reason;
        post('/cfg.php?controller=confAssetManage&action=rejectSignOUTApply', data).then((res) => {
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

    //查看pdf
    const seeUploadFile = (name) => {
        uploadSignature(recordFind, 'seeFile', name)
    }

    //文件流查看
    const uploadSignature = (record) => {
        let data = {};
        data.id = record.id;
        data.name = typeName;
        post('/cfg.php?controller=confSignature&action=previewSignature', data, { responseType: 'blob' }).then((res) => {
            if (res.data?.size > 5) {
                let url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
                window.open(url);
            }

        })
    }

    return (<>
        <ProtableModule onExpandUrl={onExpandUrl} expandAble={expandAble} developShowKey={developShowKey} expandData={expandData} concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} rowSelection={rowSelection} />

        {/* 批量审批弹出框 */}
        <DrawerForm
            formRef={formRef}
            width="570px"
            className='canapprovalmodalfrom'
            title={language('project.resmngt.resapply.approveoperation')}
            visible={approvalsModalStatus} autoFocusFirstInput
            drawerProps={{
                className: 'closebuttonright canapprovalmodalbox',
                destroyOnClose: true,
                maskClosable: false,
                placement: 'right',
                onCancel: () => {
                    allApporvalsModal();
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
            onVisibleChange={setApprovalsModalStatus}
            submitTimeout={2000} >
            <div className='assignmentinformation frommodalmargin'>
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
                    columns={columnsInfo}
                    //页面数据信息
                    dataSource={allApprovalList}
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
            <div className='approvalprocess alfrommodalmargin'>
                <ProFormTextArea width='100%' name="reason" label={language('project.resmngt.resapply.approvedescription')} />
            </div>
        </DrawerForm>

        {/* 审批弹出框 */}
        <DrawerForm
            formRef={formRef}
            width="570px"
            className='canapprovalmodalfrom'
            title={language('project.resmngt.resapply.approveoperation')}
            visible={approvalModalStatus} autoFocusFirstInput
            drawerProps={{
                className: 'closebuttonright canapprovalmodalbox',
                destroyOnClose: true,
                maskClosable: false,
                placement: 'right',
                onClose: () => {
                    allApporvalModal()
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
            submitTimeout={2000} onFinish={async (values) => {
                save(values)
            }}>
            {recordFind.batch == 'Y' ?
                <>
                    <Divider orientation='left'>{language('project.resmngt.cancellationlist')}</Divider>
                    <div className='batchlistbox' >
						<div>
							<ProTable
								size="small"
								columns={columnsInfo}
								scroll={{ y: 250 }}
								tableAlertRender={false}
								search={false}
								options={false}
								dataSource={saFileList}
								pagination={false}
								rowKey="id"
							></ProTable>
						</div>
					</div>
                    <div className='aapplicationinformations' style={{marginTop: '12px'}}>
                        {recordFind.showSignature == 'Y' ? <ProDescriptions column={2}>
                            <ProDescriptions.Item name='signature' label={language('project.assmngt.resapply.signaturefile')}>
                                {SignatureShow(recordFind.signature, seeUploadFile)}
                            </ProDescriptions.Item>
                        </ProDescriptions> : ''}
                    </div>
                </> :
                <>
                    <Alert className='caddressalertinfo' message={language('project.resmngt.cancellationipaddrcontent', { ipaddr: initialValue.macaddr + '(' + initialValue.ipaddr + ')' })} type="info" showIcon icon={<img src={Eraser} />} />
                    <Divider orientation='left'>{language('project.resmngt.cancellationinfo')}</Divider>
                    <div className='aapplicationinformations'>
                        <ProDescriptions column={2}>
                            <ProDescriptions.Item name='user' label={language('project.resmngt.resapply.user')}>{initialValue.user ? initialValue.user : ''} </ProDescriptions.Item>
                            <ProDescriptions.Item name="phone" label={language('project.resmngt.resapply.contactnumber')}>{initialValue.phone ? initialValue.phone : ' '}</ProDescriptions.Item>
                        </ProDescriptions>
                        <ProDescriptions column={2}>
                            <ProDescriptions.Item name='zone' label={language('project.resmngt.resapply.zone')}>{initialValue.zone ? initialValue.zone : ''}</ProDescriptions.Item>
                            <ProDescriptions.Item name="org" label={language('project.resmngt.resapply.organization')}>{initialValue.org ? initialValue.org : ' '}</ProDescriptions.Item>
                        </ProDescriptions>
                        <ProDescriptions column={2}>
                            <ProDescriptions.Item name='assetType' label={language('project.assmngt.assettype')}>{initialValue.assetType ? initialValue.assetType : ''}</ProDescriptions.Item>
                            <ProDescriptions.Item name='buisUsg' label={language('project.assmngt.resapply.businesspurpose')}>{initialValue.buisUsg ? initialValue.buisUsg : ''}</ProDescriptions.Item>
                        </ProDescriptions>
                        <ProDescriptions column={2}>
                            <ProDescriptions.Item name='location' label={language('project.assmngt.location')}>{initialValue.location ? initialValue.location : ''}</ProDescriptions.Item>
                            <ProDescriptions.Item name='vlan' label={language('project.assmngt.wherevlan')}>{initialValue.vlan ? initialValue.vlan : ''}</ProDescriptions.Item>
                        </ProDescriptions>
                        {recordFind.showSignature == 'Y' ? <ProDescriptions column={2}>
                            <ProDescriptions.Item name='signature' label={language('project.assmngt.resapply.signaturefile')}>
                                {SignatureShow(recordFind.signature, seeUploadFile)}
                            </ProDescriptions.Item>
                        </ProDescriptions> : ''}
                    </div>
                </>}
            <Divider orientation='left'>{language('project.assmngt.infoclear')}</Divider>
            <div className='aapplicationinformations'>
                <ProDescriptions column={2}>
                    <ProDescriptions.Item name='clear' label={language('project.assmngt.sensitiveinfomation')}>{recordFind.clear ? <span style={recordFind.clear.slice(0, 1) == 'N' ? { color: '#FF0000' } : {}}> {recordFind.clear.slice(1)} </span> : ''} </ProDescriptions.Item>
                    <ProDescriptions.Item name="uninstall" label={language('project.assmngt.applicationsoftware')}>{recordFind.uninstall ? <span style={recordFind.uninstall.slice(0, 1) == 'N' ? { color: '#FF0000' } : {}}> {recordFind.uninstall.slice(1)} </span> : ''} </ProDescriptions.Item>
                </ProDescriptions>
                <ProDescriptions column={2}>
                    <ProDescriptions.Item name='delete' label={language('project.assmngt.networkconfig')}>{recordFind.delete ? <span style={recordFind.delete.slice(0, 1) == 'N' ? { color: '#FF0000' } : {}}> {recordFind.delete.slice(1)} </span> : ''}</ProDescriptions.Item>
                    <ProDescriptions.Item name="remove" label={language('project.assmngt.peripheralhardware')}>{recordFind.remove ? <span style={recordFind.remove.slice(0, 1) == 'N' ? { color: '#FF0000' } : {}}> {recordFind.remove.slice(1)} </span> : ''}</ProDescriptions.Item>
                </ProDescriptions>
            </div>
            <Divider orientation='left'>{language('project.resmngt.approval.approvaloperation')}</Divider>
            <div className='approvalprocess alfrommodalmargin'>
                <ProFormText hidden={true} name="id" initialValue={initialValue.id} label="ID" />
                <ProFormTextArea width='100%' name="reason" rules={[{ required: true, message: language('project.pleasefill') }]} label={language('project.resmngt.resapply.approvedescription')} />
            </div>
        </DrawerForm>
        {/* //查看弹出框 */}
        <DrawerForm
            labelCol={{ xs: { span: 9 } }}
            wrapperCol={{ xs: { span: 12 } }}
            width="570px"
            layout="horizontal"
            className='csseemodalfrom'
            formRef={formRef}
            title={language('project.resmngt.resapply.approveview')}
            visible={seeModalStatus} autoFocusFirstInput
            submitter={false}
            drawerProps={{
                className: 'closebuttonright canapprovalmodalbox',
                destroyOnClose: true,
                maskClosable: false,
                placement: 'right',
                onClose: () => {
                    allSeeModal(2)
                },
            }}
            onVisibleChange={setSeeModalStatus}
            submitTimeout={2000} onFinish={async (values) => {
                save(values);
            }}>
            {recordFind.batch == 'Y' ?
                <>
                    <Divider orientation='left'>{language('project.resmngt.cancellationlist')}</Divider>
                    <div className='batchlistbox' >
                        <div>
                            <ProTable
                                size="small"
                                columns={columnsInfo}
                                scroll={{ y: 250 }}
                                tableAlertRender={false}
                                search={false}
                                options={false}
                                dataSource={saFileList}
                                pagination={false}
                                rowKey="id"
                            ></ProTable>
                        </div>
                        {recordFind.showSignature == 'Y' ?
                            <div style={{ marginLeft: '35px', marginTop: '12px' }}>
                                <ProDescriptions column={2}>
                                    <ProDescriptions.Item name='signature' label={language('project.assmngt.resapply.signaturefile')}>
                                        {SignatureShow(recordFind.signature, seeUploadFile)}
                                    </ProDescriptions.Item>
                                </ProDescriptions></div> : ''}
                    </div></>
                :
                <>
                    <Alert className='caddressalertinfo' message={language('project.resmngt.cancellationipaddrcontent', { ipaddr: initialValue.macaddr + '(' + initialValue.ipaddr + ')' })} type="info" showIcon icon={<img src={Eraser} />} />
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
                            <ProDescriptions.Item name='assetType' label={language('project.assmngt.assettype')}>{initialValue.assetType ? initialValue.assetType : ''}</ProDescriptions.Item>
                            <ProDescriptions.Item name='buisUsg' label={language('project.assmngt.resapply.businesspurpose')}>{initialValue.buisUsg ? initialValue.buisUsg : ''}</ProDescriptions.Item>
                        </ProDescriptions>
                        <ProDescriptions column={2}>
                            <ProDescriptions.Item name='location' label={language('project.assmngt.location')}>{initialValue.location ? initialValue.location : ''}</ProDescriptions.Item>
                            <ProDescriptions.Item name='vlan' label={language('project.assmngt.wherevlan')}>{initialValue.vlan ? initialValue.vlan : ''}</ProDescriptions.Item>
                        </ProDescriptions>
                        {recordFind.showSignature == 'Y' ? <ProDescriptions column={2}>
                            <ProDescriptions.Item name='signature' label={language('project.assmngt.resapply.signaturefile')}>
                                {SignatureShow(recordFind.signature, seeUploadFile)}
                            </ProDescriptions.Item>
                        </ProDescriptions> : ''}
                    </div>

                    <Divider orientation='left'>{language('project.assmngt.infoclear')}</Divider>
                    <div className='capplicationinformation'>
                        <ProDescriptions column={2}>
                            <ProDescriptions.Item name='clear' label={language('project.assmngt.sensitiveinfomation')}>{recordFind.clear ? <span style={recordFind.clear.slice(0, 1) == 'N' ? { color: '#FF0000' } : {}}> {recordFind.clear.slice(1)} </span> : ''} </ProDescriptions.Item>
                            <ProDescriptions.Item name="uninstall" label={language('project.assmngt.applicationsoftware')}>{recordFind.uninstall ? <span style={recordFind.uninstall.slice(0, 1) == 'N' ? { color: '#FF0000' } : {}}> {recordFind.uninstall.slice(1)} </span> : ''} </ProDescriptions.Item>
                        </ProDescriptions>
                        <ProDescriptions column={2}>
                            <ProDescriptions.Item name='delete' label={language('project.assmngt.networkconfig')}>{recordFind.delete ? <span style={recordFind.delete.slice(0, 1) == 'N' ? { color: '#FF0000' } : {}}> {recordFind.delete.slice(1)} </span> : ''}</ProDescriptions.Item>
                            <ProDescriptions.Item name="remove" label={language('project.assmngt.peripheralhardware')}>{recordFind.remove ? <span style={recordFind.remove.slice(0, 1) == 'N' ? { color: '#FF0000' } : {}}> {recordFind.remove.slice(1)} </span> : ''}</ProDescriptions.Item>
                        </ProDescriptions>
                    </div>
                </>}
            <Divider orientation='left'>{language('project.resmngt.approvalprocess')}</Divider>
            <div className='approvalprocess cfrommodalmargin'>
                <Steps direction='vertical' size='small' >
                    {approvalProcess()}
                </Steps>

            </div>
        </DrawerForm>

    </>);
};
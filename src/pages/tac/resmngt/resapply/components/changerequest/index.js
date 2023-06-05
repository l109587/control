import React, { useRef, useState, useEffect } from 'react';
import { EditFilled } from '@ant-design/icons';
import { ProTable, ModalForm, ProFormText, ProFormTextArea, ProFormSelect, ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Button, Input, message, Space, Tag, Popconfirm, Divider, Steps, Alert, Tooltip } from 'antd';
import { post } from '@/services/https';
import { language } from '@/utils/language';
import { regMacList, regList } from '@/utils/regExp';
import { NotesText, ContentText } from '@/utils/fromTypeLabel';
import { AiFillEye, AiOutlineClockCircle, AiFillInfoCircle } from "react-icons/ai";
import { GoTrashcan } from "react-icons/go";
import { BiArchiveOut, BiUserCircle } from "react-icons/bi";
import { BsFillCheckCircleFill, BsQuestionCircleFill, BsXCircleFill } from "react-icons/bs";
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
            title: language('project.resmngt.resapply.changeipaddr'),
            dataIndex: 'ipaddr',
            width: 100,
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
    const refTable = useRef();
    const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
    const [seeModalStatus, setSeeModalStatus] = useState(false);//model 查看弹框状态
    const [op, setop] = useState('add');//选中id数组
    const [initialValue, setInitialValue] = useState({});//默认查看头部列表数据
    const [purposeList, setPurposeList] = useState([]);//业务用途
    const [dataSource, setDataSource] = useState([]);
    const [dataInfo, setDataInfo] = useState([]);//查看 申请 ip 列表
    const [approvalProcessList, setApprovalProcessList] = useState([]);//审批流程列表数据
    const [submitType, setSubmitType] = useState();//提交类型，编辑还是添加
    const [dynamicFieldList, setDynamicFieldList] = useState([]);//动态字段列表
	let dynamicFieldListLet = [];
    const [columns, setColumns] = useState(columnsList);//table 头部数据

    /** table组件 start */
    const rowKey = (record => record.id);//列表唯一值
    const tableHeight = clientHeight;//列表高度
    const tableKey = 'rachangerequest';//table 定义的key
    const rowSelection = true;//是否开启多选框
    const addButton = true; //增加按钮  与 addClick 方法 组合使用
    const addTitle = language('project.assmngt.resapply.apply');
    const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
    const columnvalue = 'rachangerequestcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
    const apishowurl = '/cfg.php?controller=confIPOrderManage&action=showIPChangeApply';//接口路径
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
        post('/cfg.php?controller=confIPOrderManage&action=delIPChangeApply', data).then((res) => {
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
        let obj = {};
        obj.id = record.id;
        setInitialValue(record);
        setTimeout(function () {
            formRef.current.setFieldsValue(obj)
        }, 100)
        getModal(1, 'mod');
    }

    //更新修改功能
    const save = (action, record = '') => {
        let fieldData = ['id', 'user', 'phone', 'buisUsg', 'mac', 'notes'];
        let list = dynamicFieldList.length < 1 ? dynamicFieldListLet : dynamicFieldList;
        list.map((item) => {
            fieldData.push(item.key)
        })
        let obj = record ? record : formRef.current.getFieldsValue(fieldData);
        let data = {};
        data.op = action;
        data.id = obj.id;
        data.user = obj.user;
        data.phone = obj.phone;
        data.buisUsg = obj.buisUsg;
        data.mac = obj.mac;
        list.map((item) => {
			data[item.key] = obj[item.key] ? obj[item.key] : initialValue[item.key];
		})
        let dataNum = 0;
        let num = 0;
        for (const key in data) {
            num = num + 1
            if (!data[key]) {
                dataNum = dataNum + 1;
            }
        }
        if (record == '') {
            let fieldNum = list.length;
            if (data.id) {
                if (dataNum > (3 + fieldNum)) {
                    message.error('请填写修改信息！');
                    return false;
                }
                data.notes = obj.notes;
                data.ipaddr = record ? record.ipaddr : initialValue.ipaddr;
            } else {
                if (dataNum > (4 + fieldNum) || JSON.stringify(initialValue) == '{}') {
                    message.error('请填写修改信息！');
                    return false;
                }
                data.notes = obj.notes;
                data.ipaddr = record ? record.ipaddr : initialValue.ipaddr;
                data.zone = initialValue.zone;
                data.org = initialValue.org;
            }
        } else {
            data.notes = obj.notes;
            data.ipaddr = record ? record.ipaddr : initialValue.ipaddr;
        }
        post('/cfg.php?controller=confIPOrderManage&action=setIPChangeApply', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(res.msg);
            getModal(2);
            setIncID(incID + 1);
        }).catch(() => {
            console.log('mistake')
        })
    }

    //判断是否弹出添加model
    const getModal = (status, op) => {
        setop(op)
        if (status == 1) {
            getBusinessPurpose();
            setModalStatus(true);
        } else {
            setInitialValue({});
            formRef.current.resetFields();
            setModalStatus(false);
        }
    }

    //添加搜索ip
    const ipSearch = (ipaddr) => {
        let data = {};
        data.ipaddr = ipaddr;
        if (!ipaddr) {
            message.error(language('project.resmngt.resapply.fillinserchinfo'));
            return false;
        }
        post('/cfg.php?controller=confIPAddrManage&action=queryIPAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            if (res.data.length > 0) {
                setInitialValue(res.data[0]);
            } else {
                setInitialValue([]);
            }
        }).catch(() => {
            console.log('mistake')
        })
    }

    //查看弹出框页面数据赋值
    const seeModalFrame = (record) => {
        let data = {};
        data.id = record.id;
        post('/cfg.php?controller=confIPOrderManage&action=showIPChangeFlow', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            res.data.baseInfo.ipaddr = res.data.ipaddr;
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
            formRef.current.resetFields();
            setSeeModalStatus(false);
        }
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

    //动态字段
    const modDynamicField = () => {
        return dynamicFieldList.map((item) => {
            //判断输入形式是下拉框还是列表框
            if (item.form == 'box') {
                return (
                    <ProDescriptions.Item className='savemodellist' name='applicant' label={item.name}>{initialValue[item.key] ? initialValue[item.key] : <div></div>}
                        <ProFormText name={item.key} />
                    </ProDescriptions.Item>
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
                    <ProDescriptions.Item className='savemodellist' name='applicant' label={item.name}>{initialValue[item.key] ? initialValue[item.key] : <div></div>} <ProFormSelect
                        style={{ width: 187 }}
                        options={info}
                        name={item.key}
                    />
                    </ProDescriptions.Item>
                )
            }
        })
    }

    return (<>
        <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} addButton={addButton} addClick={addClick} addTitle={addTitle} rowSelection={rowSelection} />

        {/* 添加编辑弹出框 */}
        <ModalForm className='requestform' width="680px"
            formRef={formRef}
            title={op == 'add' ? language('project.resmngt.resapply.changeapply') : language('project.resmngt.resapply.changemodify')}
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

            submitTimeout={2000} onFinish={async (values) => {
                save(submitType)
            }}>
            {op == 'add' ? <Alert className='caddressalertinfo'
                message={language('project.resmngt.resapply.ipaddrtitlecontent')}
                type="info" showIcon
            /> : <Alert className='caddressalertinfo'
                message={language('project.resmngt.changeipaddrcontent', { ipaddr: initialValue.ipaddr })}
                description={language('project.resmngt.resapply.ipaddrdescription')}
                type="info" showIcon icon={<img src={Substitute} />}
            />}

            <div className='caddformationbox'>
                <ProDescriptions column={1}>
                    <ProFormText hidden name='id' />
                    {op == 'add' ? <ProDescriptions.Item className='savemodellist savemodeltextarea' name='applicant' label={language('project.resmngt.resapply.changeipaddr')}>
                        <Search style={{ width: "100% !important" }}
                            placeholder={language('project.resmngt.resapply.search')}
                            onSearch={(queryVal) => {
                                ipSearch(queryVal)
                            }}
                        /></ProDescriptions.Item> : <></>}
                    <ProDescriptions.Item className='savemodellist' name='applicant' label={language('project.resmngt.resapply.user')}>{initialValue.user ? initialValue.user : <div></div>} <ContentText name='user' label={false}  /></ProDescriptions.Item>
                    <ProDescriptions.Item className='savemodellist' name='applicant' label={language('project.resmngt.resapply.contactnumber')}>{initialValue.phone ? initialValue.phone : <div></div>} <ProFormText name='phone' rules={[{ pattern: regList.phoneorlandline.regex, message: regList.phoneorlandline.alertText, }]} /></ProDescriptions.Item>
                    <ProDescriptions.Item className='savemodellist' name='applicant' label={language('project.resmngt.resapply.businesspurpose')}>{initialValue.buisUsg ? initialValue.buisUsg : <div></div>}
                        <ProFormSelect style={{ width: 187 }} options={purposeList}
                            name="buisUsg"
                        />
                    </ProDescriptions.Item>
                    <ProDescriptions.Item className='savemodellist' name='applicant' label={language('project.resmngt.resapply.macaddress')}>{initialValue.macaddr ? initialValue.macaddr : <div></div>} <ProFormText name='mac' rules={[{ pattern: regMacList.mac.regex, message: regMacList.mac.alertText, }]} /></ProDescriptions.Item>
                    {modDynamicField()}
                    <ProDescriptions.Item className='savemodellist savemodeltextarea' name='applicant' label={language('project.resmngt.resapply.remarks')}>
                        <NotesText name='notes' label={false} style={{ width: '100%' }}  required={false} />
                    </ProDescriptions.Item>
                </ProDescriptions>
            </div>

        </ModalForm>

        {/* //查看弹出框 */}
        <ModalForm
            labelCol={{ xs: { span: 9 } }}
            wrapperCol={{ xs: { span: 12 } }}
            width="570px"
            layout="horizontal"
            className='cseemodalfrom'
            formRef={formRef}
            title={language('project.resmngt.resapply.approveview')}
            visible={seeModalStatus} autoFocusFirstInput
            submitter={false}
            modalProps={{
                maskClosable: false,
                onCancel: () => {
                    getSeeModal(2)
                },
            }}
            onVisibleChange={setSeeModalStatus}
            submitTimeout={2000} onFinish={async (values) => {
                save(values)
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
            <div className='approvalprocess cfrommodalmargin'>
                <Steps direction='vertical' size='small' >
                    {approvalProcess()}
                </Steps>
            </div>
        </ModalForm>
    </>);
};
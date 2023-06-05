import React, { useRef, useState, useEffect } from 'react';
import { Tooltip, Input, message, Form, Switch, Popconfirm, Modal, Tag, Space } from 'antd';
import { EditFilled, DeleteFilled, SaveFilled, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { LinkTwo } from '@icon-park/react';
import { get, post } from '@/services/https';
import { EditableProTable } from '@ant-design/pro-components';
import ProForm, { ModalForm, ProFormText, ProFormDateTimePicker, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { modalFormLayout } from "@/utils/helper";
import { regMacList } from '@/utils/regExp';
import { NameText, NotesText } from '@/utils/fromTypeLabel';
import { language } from '@/utils/language';
import '@/utils/index.less';
import './index.less';
import { TableList, CutDropDown } from './components';
import { TableLayout } from '@/components';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { confirm } = Modal;
let H = document.body.clientHeight - 296
var clientHeight = H
export default () => {

    //删除气泡框
    const [confirmLoading, setConfirmLoading] = useState(false);
    const operation = (text, record, op, languagetext) => (
        <Popconfirm onConfirm={() => {
            syncLanList(record, op);
        }} key="popconfirmdel"
            title={languagetext}
            okButtonProps={{
                loading: confirmLoading,
            }} okText={language('project.yes')} cancelText={language('project.no')}>
            <a>{text}</a>
        </Popconfirm>
    );

    const columns = [
        {
            // title: '配置ID',
            title: language('project.mconfig.cfnid'),
            dataIndex: 'id',
            align: 'center',
        },
        {
            // title: '生效状态',
            title: language('project.mconfig.ectstu'),
            dataIndex: 'status',
            align: 'center',
            fixed: 'left',
            ellipsis: true,
            width: 110,
            filters: true,
            filterMultiple: false,
            valueEnum: {
                Y: { text: language('project.enable') },
                N: { text: language('project.disable') },
            },
            render: (text, record, index) => {
                let disabled = false;
                if (record.from == 'remote') {
                    disabled = true;
                }
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
            // title: '名称',
            title: language('project.devname'),
            dataIndex: 'name',
            align: 'left',
            fixed: 'left',
            ellipsis: true,
            width: 130,
        },
        {
            // title: '动作',
            title: language('project.logmngt.devactions'),
            dataIndex: 'block',
            align: 'left',
            width: 150,
            render: (text, record, index) => {
                if (record.block == 'Y') {
                    return language('project.mconfig.aptaddr.blockaudit');
                } else {
                    return language('project.mconfig.aptaddr.audit');
                }
            }
        },
        {
            ellipsis: true,
            title: language('project.mconfig.aptaddr.content'),
            dataIndex: 'addrlist',
            align: 'left',
            width: 150,
            render: (text, record, index) => {
                if (record.addrlist) {
                    let menu = [];
                    record.addrlist?.map((item) => {
                        menu.push({ key: item, label: item, icon: <InfoCircleOutlined /> });
                    })
                    return <>
                        <CutDropDown menu={menu} addrlist={record.addrlist} />
                    </>;
                }
            },
        },
        {
            //有效期类型
            title: language('project.mconfig.validtype'),
            dataIndex: 'valid_type',
            align: 'left',
            width: 90,
            ellipsis: true,
            render: (text, record, index) => {
                if (record.valid_type == 'forever') {
                    return language('project.mconfig.forever');
                } else {
                    return language('project.mconfig.expire');
                }
            },
        },
        {
            // title: '有效时间',
            title: language('project.mconfig.vdtime'),
            dataIndex: 'expire_time',
            align: 'left',
            ellipsis: true,
            width: 180,
            render: (text, record, index) => {
                if (record.expire_time == 0) {
                    return language('project.mconfig.forever');
                } else {
                    return record.expire_time;
                }
            },
        },
        {
            // title: '配置来源',
            title: language('project.mconfig.cfgsce'),
            dataIndex: 'from',
            align: 'center',
            ellipsis: true,
            width: 150,
            filters: true,
            filterMultiple: false,
            valueEnum: {
                local: { text: language('project.mconfig.local') },
                remote: { text: language('project.mconfig.remote') },
            },
            render: (text, record, index) => {
                if (record.from == 'local') {
                    return <Tag style={{ marginRight: '0px' }} color='cyan' key={1}>{language('project.mconfig.local')}</Tag>;
                } else {
                    return <Tag style={{ marginRight: '0px' }} color='volcano' key={1}>{language('project.mconfig.remote')}</Tag>;
                }
            },
        },
        {
            // title: '配置下发的设备数',
            title: language('project.mconfig.cfgnum'),
            dataIndex: 'refcnt',
            align: 'left',
            width: 100,
            render: (text, record, _, action) => {
                return <Space align='left' className='refcntspace'><div>{record.refcnt}</div>
                    {record.refcnt >= 1 ? <div
                        style={{ marginLeft: '8px' }}
                        onClick={() => {
                            setRowRecord(record);
                            getSeeModal(1);
                        }}
                    ><LinkTwo theme="outline" size="20" fill="#FF7429" strokeWidth={3} /></div> :
                        <div style={{ marginLeft: '8px' }}><LinkTwo theme="outline" size="20" fill="#8E8D8D" strokeWidth={3} /></div>
                    }
                </Space>
            }
        },
        {
            // title: '备注',
            title: language('project.remark'),
            dataIndex: 'notes',
            width: 130,
            align: 'center',
            ellipsis: true,
        },
        {
            title: language('project.createTime'),
            dataIndex: 'createTime',
            width: 130,
            align: 'center',
            ellipsis: true,
        },
        {
            title: language('project.updateTime'),
            dataIndex: 'updateTime',
            width: 130,
            ellipsis: true,
            align: 'center',
        },
        {
            disable: true,
            title: language('project.mconfig.operate'),
            align: 'center',
            valueType: 'option',
            fixed: 'right',
            width: 130,
            ellipsis: true,
            render: (text, record, _, action) => [
                <>
                    <a key="editable"
                        style={
                            record.from === 'remote'
                                ? {
                                    color: 'rgba(0,0,0,.25)',
                                    cursor: 'not-allowed',
                                    disabled: true,
                                }
                                : {}
                        }
                        onClick={() => {
                            if (record.from === 'local') {
                                mod(record, 'mod');
                            }
                        }}>
                        <Tooltip title={language('project.deit')} >
                            <EditFilled style={{ color: '#0083FF', fontSize: '15px' }} />
                        </Tooltip>
                    </a>
                    {operation(<Tooltip title={language('project.distribute')} ><span><i class="ri-mail-send-fill" style={{ color: '#FA561F', fontSize: '15px' }}></i></span></Tooltip>, record, 'distribute', language('project.mconfig.determinedistrbute'))}
                    {record.refcnt >= 1 ?
						operation(<Tooltip title={language('project.revoke')} ><span><i className="fa fa-recycle" style={{ color: '#FF0000', fontSize: '15px' }} aria-hidden="true"></i></span></Tooltip>, record, 'revoke', language('project.mconfig.determinerevoke'))
						: <Tooltip title={language('project.revoke')} ><span><i className="fa fa-recycle" style={{ color: '#8E8D8D', fontSize: '15px' }} aria-hidden="true"></i></span></Tooltip>
					}
                </>

            ],
        },
    ];


    const aptaddrColumns = [
        {
            title: language('project.mconfig.cfnid'),
            dataIndex: 'id',
            align: 'center',
            hideInTable: true,
        },
        {
            title: language('project.devid'),
            dataIndex: 'devid',
            align: 'center',
            ellipsis: true,
            width: 130,
        },
        {
            title: language('project.devname'),
            dataIndex: 'name',
            align: 'center',
            ellipsis: true,
            width: 130,
        },
        {
            title: language('project.devip'),
            dataIndex: 'ip',
            align: 'center',
            ellipsis: true,
            width: 130,
        },
        {
            title: language('project.mconfig.state'),
            dataIndex: 'result',
            align: 'center',
            ellipsis: true,
            width: 130,
        },
        {
            title: language('project.mconfig.time'),
            dataIndex: 'update_time',
            align: 'center',
            ellipsis: true,
            width: 130,
        },
    ];

    const formRef = useRef();
    const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
    const [op, setop] = useState('add');//选中id数组
    const [editableKeys, setEditableRowKeys] = useState();//每行编辑的id
    const [timeShow, setTimeShow] = useState(false);//有效时间隐藏显示
    const [switchCheck, setSwitchCheck] = useState();
    const [seeModalStatus, setSeeModalStatus] = useState(false);//添加查看框状态
    const [rowRecord, setRowRecord] = useState([]);//记录当前信息
    const concealColumn = {
        id: { show: false },
    };//设置默认列

    //列表数据
    const fromcolumns = [
        {
            title: language('project.mconfig.blklist.bac'),
            dataIndex: 'address',
            align: 'center',
            formItemProps: () => {
                return {
                    rules: [{
                        required: true,
                        pattern: regMacList.ipv4maskdomain.regex,
                        message: regMacList.ipv4maskdomain.alertText
                    }],
                };
            },
        },
        {
            title: language('project.mconfig.operate'),
            valueType: 'option',
            width: '25%',
            align: 'center',
            render: (text, record, _, action) => [
                <a key="editable" onClick={() => {
                    var _a;
                    (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id);
                }}>
                    <EditFilled />
                </a>,
                <a key="delete"
                    onClick={() => {
                        const tableDataSource = formRef.current.getFieldsValue(['addrlistinfo']);
                        console.log(tableDataSource)
                        formRef.current.setFieldsValue(
                            { addrlistinfo: tableDataSource['addrlistinfo'].filter((item) => item.id != record.id), }
                        )
                    }}>
                    <DeleteFilled style={{ color: 'red' }} />
                </a>,
            ]
        },
    ];

    const apiAptaddrShowUrl = '/cfg.php?controller=device&action=showCfgLinkDev'

    /** table组件 start */
    const rowKey = (record => record.id);//列表唯一值
    const tableHeight = clientHeight;//列表高度
    const tableKey = 'aptaddr';//table 定义的key
    const rowSelection = true;//是否开启多选框
    const addButton = true; //增加按钮  与 addClick 方法 组合使用
    const delButton = true; //删除按钮 与 delClick 方法 组合使用
    const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
    const columnvalue = 'aptaddrcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
    const apishowurl = '/cfg.php?controller=confBlacklist&action=showWanBlackList';//接口路径
    const [queryVal, setQueryVal] = useState();//首个搜索框的值
    let searchVal = { queryVal: queryVal, queryType: 'fuzzy' };//顶部搜索框值 传入接口

    //初始默认列
    const concealColumns = {
        id: { show: false },
        valid_type: { show: false },
        createTime: { show: false },
        updateTime: { show: false },
    }
    /* 顶部左侧搜索框*/
    const tableTopSearch = () => {
        return (
            <Search
                placeholder={language('project.mconfig.aptaddr.tablesearch')}
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
        setTimeShow(false);
        let initialValue = [];
        setTimeout(function () {
            formRef.current.setFieldsValue(initialValue)
        }, 100);
        getModal(1, 'add');
    }

    /** table组件 end */


    //判断是否弹出添加model
    const getModal = (status, op) => {
        setop(op)

        if (status == 1) {
            setModalStatus(true);
        } else {
            formRef.current.resetFields();
            setModalStatus(false);
        }
    }

    //判断是否弹出添加model
    const getSeeModal = (status) => {
        if (status == 1) {
            setSeeModalStatus(true);
        } else {
            setSeeModalStatus(false);
        }
    }

    //分发，撤销
    const syncLanList = (record, op) => {
        let data = {};
        data.id = record.id;
        data.op = op;
        post('/cfg.php?controller=confBlacklist&action=syncWanBlackList', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            setIncID(incID + 1);
        }).catch(() => {
            console.log('mistake')
        })
    }

    //全部启用禁用
    const statusSaveAll = (status) => {
        post('/cfg.php?controller=confBlacklist&action=enableWanBlackList', { status: status }).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(res.msg);
        }).catch(() => {
            console.log('mistake')
        })
    }

    //启用禁用
    const statusSave = (record, checked) => {
        let status = 'N';
        if (checked) {
            status = 'Y';
        }
        let id = record.id;
        post('/cfg.php?controller=confBlacklist&action=enableWanblackIP', { id: id, status: status }).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(res.msg);
            setIncID(incID + 1);
        }).catch(() => {
            console.log('mistake')
        })
    }

    //添加修改接口
    const save = (info) => {
        let addrlist = [];
        let count = 0;
        if (info.addrlistinfo) {
            count = info.addrlistinfo.length;
        }
        if (count > 0) {
            info.addrlistinfo.map((item) => {
                addrlist.push(item.address)
            })
            addrlist = addrlist.join(';');
        } else {
            addrlist = '';
        }
        let status = 'N';
        if (info.status == 'Y' || info.status == true) {
            status = 'Y';
        }
        if (info.valid_type == 'forever') {
            info.expire_time = 0;
        }
        let data = {};
        data.op = op;
        data.id = info.id;
        data.status = status;
        data.name = info.name;
        data.valid_type = info.valid_type;
        data.expire_time = info.expire_time;
        data.notes = info.notes;
        data.block = info.block;
        data.addrlist = addrlist;
        post('/cfg.php?controller=confBlacklist&action=setWanBlockIP', data).then((res) => {
            formRef.current.resetFields();
            setModalStatus(false);
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            setIncID(incID + 1);
        }).catch(() => {
            console.log('mistake')
        })

    }

    //删除数据
    const delList = (selectedRowKeys) => {
        // let id = record.id;//单个删除id
        let ids = selectedRowKeys.join(',');
        post('/cfg.php?controller=confBlacklist&action=delWanBlockIP', { ids: ids }).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            setTimeout(() => {
                setIncID(incID + 1);
            }, 2000);

        }).catch(() => {
            console.log('mistake')
        })

    }

    //编辑
    const mod = (obj, op) => {
        let addrlist = obj.addrlist;
        let nowTime = new Date();
        obj.expire_time = obj.valid_type == 'forever' ? nowTime : obj.expire_time;
        let rowKey = [];
        let defaultDataInfo = [];
        addrlist.map((item, index) => {
            defaultDataInfo.push({ id: (index + 1), address: item });
            rowKey.push(index + 1);
        })

        //设置有效时间的显示隐藏
        if (obj.valid_type == 'expire') {
            setTimeShow(true)
        } else {
            setTimeShow(false)
        }
        if (obj.status == 'Y' || obj.status == true) {
            setSwitchCheck('checked');
        } else {
            setSwitchCheck('');
        }
        obj.addrlistinfo = defaultDataInfo;
        let initialValues = obj;
        getModal(1, op);
        setTimeout(function () {
            formRef.current.setFieldsValue(initialValues)
        }, 100)
    }
    return (
        <div>
            <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} />

            <ModalForm {...modalFormLayout}
                formRef={formRef}
                title={op == 'add' ? language('project.add') : language('project.alter')}
                visible={modalStatus} autoFocusFirstInput
                modalProps={{
                    maskClosable: false,
                    onCancel: () => {
                        getModal(2)
                    },
                }}
                onVisibleChange={setModalStatus}
                className='aptaddrmodal'
                submitTimeout={2000}
                onFinish={async (values, a) => {
                    save(values);
                }}>
                <ProFormText hidden={true} type="hidden" name="id" label="IP" />
                <ProFormText hidden={true} name="op" label={language('project.sysconf.syszone.opcode')} initialValue={op} />
                <Form.Item name="status" label={language('project.mconfig.ectstu')} valuePropName={switchCheck}>
                    <Switch checkedChildren={language('project.enable')} unCheckedChildren={language('project.disable')} />
                </Form.Item>
                <NameText name='name' label={language('project.devname')} required={true} /> 
                <ProFormSelect initialValue='N' options={[
                    {
                        value: 'N',
                        label: language('project.mconfig.aptaddr.audit'),
                    },
                    {
                        value: 'Y',
                        label: language('project.mconfig.aptaddr.blockaudit'),
                    },
                ]}
                    name="block" label={language('project.logmngt.devactions')} rules={[{ required: true }]} />
                <ProFormSelect initialValue='forever' options={[
                    {
                        value: 'forever',
                        label: language('project.mconfig.forever'),
                    },
                    {
                        value: 'expire',
                        label: language('project.mconfig.expire'),
                    }
                ]}
                    onChange={
                        (checked) => {
                            if (checked == 'expire') {
                                setTimeShow(true)
                            } else {
                                setTimeShow(false)
                            }
                        }
                    } name="valid_type" label={language('project.mconfig.validtype')} rules={[{ required: true }]} />
                {timeShow == true ? (<ProFormDateTimePicker name="expire_time" showTime label={language('project.sysconf.apiauth.validtime')} />) : ('')}
                <NotesText name="notes" label={language('project.remark')} required={false} /> 
                <ProForm.Item label={language('project.mconfig.whtlist.wac')} name="addrlistinfo" trigger="onValuesChange" rules={[{ required: true }]}>
                    <EditableProTable
                        scroll={{ y: 170 }}
                        rowKey="id"
                        className='tablelistbottom'
                        toolBarRender={false}
                        columns={fromcolumns}
                        recordCreatorProps={{
                            record: () => ({
                                id: Date.now(),

                            }),
                        }} editable={{
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
                            deleteText: <DeleteFilled style={{ color: 'red' }} />,
                        }} />
                </ProForm.Item>
            </ModalForm>

            <ModalForm
                width='1000px'
                className='seeaptaddrmodal'
                formRef={formRef}
                title={language('project.see')}
                visible={seeModalStatus} autoFocusFirstInput
                modalProps={{
                    maskClosable: false,
                    onCancel: () => {
                        getSeeModal(2)
                    },
                }}
                onVisibleChange={setSeeModalStatus}
                submitter={false}
                submitTimeout={2000}
            >
                <TableList apishowurl={apiAptaddrShowUrl} key='aptaddr' className='aptaddrtable' id={rowRecord.id} concealColumns={concealColumn} columns={aptaddrColumns} />
            </ModalForm>
        </div>
    );
};

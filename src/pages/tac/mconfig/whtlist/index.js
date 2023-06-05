import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, message, Modal, Form, Switch, Popconfirm } from 'antd';
import { EditFilled, DeleteFilled, SaveFilled, PlusOutlined, CloseCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { get, post } from '@/services/https';
import { ProTable, EditableProTable } from '@ant-design/pro-components';
import ProForm, { ModalForm, ProFormText, ProFormDateTimePicker, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { modalFormLayout } from "@/utils/helper";
import { language } from '@/utils/language';
import { TableList } from './components';
import { regMacList } from '@/utils/regExp';
import '@/utils/index.less';
import './index.less';
import store from 'store';
import { TableLayout } from '@/components';
const { ProtableModule } = TableLayout;
const { confirm } = Modal;
const { Search } = Input;
let H = document.body.clientHeight - 296
var clientHeight = H
export default () => {

    const columns = [
        {
            // title: '配置ID',
            title: language( 'project.mconfig.cfnid'),
            dataIndex: 'id',
            align: 'center',
            ellipsis: true,
        },
        {
            // title: '名称',
            title: language( 'project.devname'),
            dataIndex: 'name',
            align: 'center',
            fixed: 'left',
            ellipsis: true,
            width: 130,
        },
        {
            // title: '生效状态',
            title: language( 'project.mconfig.ectstu'),
            dataIndex: 'status',
            align: 'center',
            ellipsis: true,
            width: 110,
            filters: true,
            filterMultiple: false,
            valueEnum: {
                Y: { text: language( 'project.enable') },
                N: { text: language( 'project.disable') },
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
                    Switch checkedChildren={language( 'project.enable')}
                    unCheckedChildren={language( 'project.disable')}
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
            //有效期类型
            title: language( 'project.mconfig.validtype'),
            dataIndex: 'valid_type',
            align: 'center',
            width: 90,
            ellipsis: true,
            render: (text, record, index) => {
                if (record.valid_type == 'forever') {
                    return language( 'project.mconfig.forever' );
                } else {
                    return language( 'project.mconfig.expire' );
                }
            },
        },
        {
            // title: '有效时间',
            title: language( 'project.mconfig.vdtime'),
            dataIndex: 'expire_time',
            align: 'center',
            ellipsis: true,
            width: 180,
            render: (text, record, index) => {
                if (record.expire_time == 0) {
                    return language( 'project.mconfig.forever' );
                } else {
                    return record.expire_time;
                }
            },
        },

        {
            // title: '白名单地址内容',
            title: language( 'project.mconfig.whtlist.wac' ),
            dataIndex: 'addrlist',
            align: 'center',
            width: 150,
            ellipsis: true,
            render: (text, record, index) => {
                return record.addrlist.join(';');
            },
        },
        {
            // title: '配置来源',
            title: language( 'project.mconfig.cfgsce' ),
            dataIndex: 'from',
            align: 'center',
            ellipsis: true,
            width: 150,
            filters: true,
            filterMultiple: false,
            valueEnum: {
                local: { text: language( 'project.mconfig.local' ) },
                remote: { text: language( 'project.mconfig.remote' ) },
            },
            render: (text, record, index) => {
                if (record.from == 'local') {
                    return language( 'project.mconfig.local' );
                } else {
                    // local
                    return language( 'project.mconfig.remote' );
                }
            },
        },
        {
            // title: '配置下发的设备数',
            title: language( 'project.mconfig.cfgnum' ),
            dataIndex: 'refcnt',
            align: 'center',
            ellipsis: true,
            width: 150,
            render: (text, record, _, action) => {
                return <div
                    onClick={() => {
                        setRowRecord(record);
                        getSeeModal(1);
                    }}
                >{record.refcnt}</div>
            }
        },
        {
            // title: '备注',
            title: language( 'project.remark' ),
            dataIndex: 'notes',
            align: 'center',
            width: 130,
            ellipsis: true,
        },
        {
            title: language( 'project.createTime' ),
            dataIndex: 'createTime',
            width: 130,
            align: 'center',
            ellipsis: true,
        },
        {
            title: language( 'project.updateTime' ),
            dataIndex: 'updateTime',
            width: 130,
            align: 'center',
            ellipsis: true,
        },
        {
            disable: true,
            title: language( 'project.mconfig.operate' ),
            align: 'center',
            valueType: 'option',
            fixed: 'right',
            width: 150,
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
                            {language('project.deit')}
                    </a>
                    {operation(language('project.distribute'), record, 'distribute', language( 'project.mconfig.determinedistrbute' ))}
                    {operation(language('project.revoke'), record, 'revoke', language( 'project.mconfig.determinerevoke' ))}
                </>
            ],
        },
    ];

    const WhtlistColumns = [
        {
            title: language( 'project.mconfig.cfnid' ),
            dataIndex: 'id',
            align: 'center',
            hideInTable: true,
        },
        {
            title: language( 'project.devid' ),
            dataIndex: 'devid',
            align: 'center',
            ellipsis: true,
            width: 130,
        },
        {
            title: language( 'project.devname' ),
            dataIndex: 'name',
            align: 'center',
            ellipsis: true,
            width: 130,
        },
        {
            title: language( 'project.devip' ),
            dataIndex: 'ip',
            align: 'center',
            ellipsis: true,
            width: 130,
        },
        {
            title: language( 'project.mconfig.state' ),
            dataIndex: 'state',
            align: 'center',
            ellipsis: true,
            width: 130,
        },
        {
            title: language( 'project.mconfig.time' ),
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
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [seeModalStatus, setSeeModalStatus] = useState(false);//添加查看框状态
    const [rowRecord, setRowRecord] = useState([]);//记录当前信息
    const concealColumn = {
        id: { show: false },
    };//设置默认列

    const apiWhtlistShowUrl = '/cfg.php?controller=device&action=showCfgLinkDev'
    const renderRemove = (text, record) => (
        <Popconfirm onConfirm={() => {
            setConfirmLoading(false);
            const tableDataSource = formRef.current.getFieldsValue(['addrlistinfo']);
            formRef.current.setFieldsValue(
                { addrlistinfo: tableDataSource['addrlistinfo'].filter((item) => item.id != record.id), }
            )
        }} key="popconfirm"
            title={language( 'project.delconfirm' )}
            okButtonProps={{
                loading: confirmLoading,
            }} okText={language( 'project.yes' )} cancelText={language( 'project.no' )}>
            <a>{text}</a>
        </Popconfirm>
    );

    //注销分发气泡框
    const operation = (text, record, op, languagetext) => (
        <Popconfirm onConfirm={() => {
            syncLanList(record, op);
        }} key="popconfirmdel"
            title={languagetext}
            okButtonProps={{
                loading: confirmLoading,
            }} okText={language( 'project.yes' )} cancelText={language( 'project.no' )}>
            <a>{text}</a>
        </Popconfirm>
    );

    const fromcolumns = [
        {
            title: language('project.mconfig.blklist.bac'),
            dataIndex: 'address',
            align: 'center',
            formItemProps: () => {
                return {
                    rules:[{ required: true, pattern: regMacList.ipv4mask.regex, message: regMacList.ipv4mask.alertText }],
                };
            },
        },
        {
            title: language( 'project.mconfig.operate' ),
            valueType: 'option',
            width: '25%',
            align: 'center',
            render: (text, record, _, action) => [
                <>
                    <a key="editable" onClick={() => {
                        var _a;
                        (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id);
                    }}>
                        <EditFilled />
                    </a>
                    {renderRemove(<DeleteFilled style={{ color: 'red' }} />, record)}
                </>
            ]
        },
    ];

    	/** table组件 start */
	const rowKey = (record => record.id);//列表唯一值
	const tableHeight = clientHeight;//列表高度
	const tableKey = 'white';//table 定义的key
	const rowSelection = true;//是否开启多选框
	const addButton = true; //增加按钮  与 addClick 方法 组合使用
	const delButton = true; //删除按钮 与 delClick 方法 组合使用
	const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
	const columnvalue = 'whitecolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
	const apishowurl = '/cfg.php?controller=confWhitelist&action=showLanWhiteList';//接口路径
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
				placeholder={language('project.mconfig.whtlist.tablesearch')}
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
        if (status == 1) {
            setop(op)
            setModalStatus(true);
        } else {
            formRef.current.resetFields();
            setModalStatus(false);
        }
    }

    //判断是否弹出添加model
    const getSeeModal = (status) => {
        console.log(status)
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
        post('/cfg.php?controller=confWhitelist&action=syncLanWhiteList', data).then((res) => {
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
        post('/cfg.php?controller=confWhitelist&action=enableLanWhiteList', { status: status }).then((res) => {
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
        post('/cfg.php?controller=confWhitelist&action=enableLanWhiteIP', { id: id, status: status }).then((res) => {
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
        data.addrlist = addrlist;
        post('/cfg.php?controller=confWhitelist&action=setLanWhiteIP', data).then((res) => {

            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            getModal(2)
            setIncID(incID + 1);
        }).catch(() => {
            console.log('mistake')
        })

    }


    //删除数据
    const delList = (selectedRowKeys) => {
        let ids = selectedRowKeys.join(',');
        post('/cfg.php?controller=confWhitelist&action=delLanWhiteIP', { ids: ids }).then((res) => {
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
        let nowTime = new Date();
        obj.expire_time = obj.valid_type == 'forever' ? nowTime : obj.expire_time;
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
                className='whtlistmodal'
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

                submitTimeout={2000} onFinish={async (values) => {
                    save(values);
                }}>
                <ProFormText hidden={true} type="hidden" name="id" label="IP" />
                <ProFormText hidden={true} name="op" label={language( 'project.sysconf.syszone.opcode' )} initialValue={op} />
                <Form.Item name="status" label={language( 'project.mconfig.ectstu' )} valuePropName={switchCheck}>
                    <Switch checkedChildren={language( 'project.enable' )} unCheckedChildren={language( 'project.disable' )} />
                </Form.Item>
                <ProFormText name="name" label={language( 'project.devname' )} rules={[{ required: true, message: language('project.fillin') }]} />
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
                    } name="valid_type" label={language( 'project.mconfig.validtype' )} rules={[{ required: true }]} />
                {timeShow == true ? (<ProFormDateTimePicker name="expire_time" showTime label={language( 'project.sysconf.apiauth.validtime' )} />) : ('')}
                <ProFormTextArea name="notes" label={language( 'project.remark' )} />
                <ProForm.Item label={language( 'project.mconfig.whtlist.wac' )} name="addrlistinfo" trigger="onValuesChange" rules={[{ required: true }]}>
                    <EditableProTable
                        scroll={{ y: 170 }}
                        rowKey="id"
                        toolBarRender={false}
                        columns={fromcolumns}
                        className='tablelistbottom'
                        recordCreatorProps={{
                            position: 'button',
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
                className='seewhtlistmodal'
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

                <TableList apishowurl={apiWhtlistShowUrl} className='whtlisttable' key='aptaddr' id={rowRecord.id} concealColumns={concealColumn} columns={WhtlistColumns} />

            </ModalForm>

        </div>
    );
};

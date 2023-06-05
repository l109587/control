import React, { useRef, useState, useEffect } from 'react';
import { history } from 'umi'
import { Button, Input, message, Modal, TreeSelect, Menu, Tooltip, Space, Tag, Tabs, Divider, Table } from 'antd';
import { post } from '@/services/https';
import { ExclamationCircleOutlined, EditFilled, ExportOutlined } from '@ant-design/icons';
import { DrawerForm, ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { AiFillEye } from "react-icons/ai";
import { Seal, ExpandDownOne, FoldUpOne } from '@icon-park/react';
import { modalFormLayout, drawFormLayout } from "@/utils/helper";
import { language } from '@/utils/language';
import { regMacList, regSeletcList } from '@/utils/regExp';
import { NameText } from '@/utils/fromTypeLabel';
import '@/utils/index.less';
import './index.less';
import { TableLayout, LeftTree, CardModal } from '@/components';
const { ProtableModule } = TableLayout;

const { Search } = Input;
const { TabPane } = Tabs;
let H = document.body.clientHeight - 285
var clientHeight = H
export default (props) => {
    let filtersType = { onstate: null, verifystate: null };
    const onstateType = props.location?.state?.type;
    if (onstateType) {
        if (onstateType == 'verifyWait') {
            filtersType.onstate = ['online'];
            filtersType.verifystate = [onstateType]
        } else {
            filtersType.onstate = [onstateType]
        }
    }

    const showAutoLoginInfo = (record) => {
        let id = record.id;
        post('/cfg.php?controller=device&action=showAutoLoginInfo', { id: id }).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            if (res.data.url) {
                window.open(res.data.url, "_blank")
            }
        }).catch(() => {
            console.log('mistake')
        })
    }
    const columnsList = [
        {
            title: language('project.devid'),
            dataIndex: 'devid',
            align: 'center',
            ellipsis: true,
            width: 200,
        },
        {
            title: language('project.mconfig.devices.mode'),
            fixed: 'left',
            dataIndex: 'isDouble',
            align: 'left',
            width: 100,
            ellipsis: true,
            render: (text, record, index) => {
                let color = 'success';
                let name = '';
                if (!record.isDouble) {
                    return '';
                } else {
                    if (record.isDouble == 'N') {
                        color = '#12C189';
                        name = language('project.mconfig.devices.standalone');
                    }
                    if (record.isDouble == 'Y') {
                        color = '#FF7249';
                        name = language('project.mconfig.devices.dual');
                    }
                    return (
                        <Space>
                            <Tag style={{ marginRight: '0px' }} color={color} >
                                {name}
                            </Tag>
                        </Space>
                    )
                }

            }
        },
        {
            title: language('project.devname'),
            dataIndex: 'name',
            className: 'devname',
            fixed: 'left',
            align: 'center',
            width: 150,
            ellipsis: true,
            render: (text, record, index) => {
                if (record.onstate == 'online') {
                    return <a onClick={() => {
                        showAutoLoginInfo(record);
                    }}>{record.name}</a>
                } else {
                    return record.name;
                }
            }
        },
        Table.EXPAND_COLUMN,
        {
            title: language('project.devip'),
            dataIndex: 'ipaddr',
            className: 'ipaddr',
            align: 'center',
            width: 140,
            ellipsis: true,
            render: (text, record, index) => {
                if (record.onstate == 'online') {
                    return <a onClick={() => {
                        showAutoLoginInfo(record);
                    }}>{record.ipaddr}</a>
                } else {
                    return record.ipaddr;
                }
            }
        },
        {
            title: language('project.mconfig.olstu'),
            dataIndex: 'onstate',
            align: 'center',
            width: 100,
            ellipsis: true,
            filters: [
                { text: language('project.logmngt.devctl.online'), value: 'online' },
                { text: language('project.logmngt.devctl.offline'), value: 'offline' },
            ],
            filterMultiple: false,
            render: (text, record, index) => {
                let color = 'success';
                let name = language('project.logmngt.devctl.online');
                if (record.onstate == 'offline') {
                    color = 'default';
                    name = language('project.logmngt.devctl.offline');
                }
                return (
                    <Space>
                        <Tag style={{ marginRight: '0px' }} color={color} key={record.onstate}>
                            {name}
                        </Tag>
                    </Space>
                )
            }
        },
        {
            title: language('project.mconfig.resstatus'),
            dataIndex: 'regstate',
            align: 'center',
            width: 100,
            ellipsis: true,
            filters: [
                { text: language('project.logmngt.devctl.registered'), value: 'registered' },
                { text: language('project.logmngt.devctl.notloggedoff'), value: 'unregistered' },
                { text: language('project.logmngt.devctl.loggedoff'), value: 'logout' },
            ],
            filterMultiple: false,
            render: (text, record, index) => {
                let color = 'success';
                let name = language('project.logmngt.devctl.loggedoff');
                if (record.regstate == 'unregistered') {
                    color = 'default';
                    name = language('project.logmngt.devctl.notloggedoff');
                } else if (record.regstate == 'registered') {
                    color = 'success';
                    name = language('project.logmngt.devctl.registered');
                } else {
                    //已注销
                    color = 'warning';
                }
                return (
                    <Space>
                        <Tag style={{ marginRight: '0px' }} color={color} key={record.regstate}>
                            {name}
                        </Tag>
                    </Space>
                )
            }
        },
        {
            title: language('project.mconfig.adstu'),
            dataIndex: 'verifystate',
            align: 'center',
            width: 100,
            valueType: 'select',
            ellipsis: true,
            filters: [
                { text: language('project.stayexamine'), value: 'verifyWait' },
                { text: language('project.passed'), value: 'verifyPass' },
                { text: language('project.fail'), value: 'verifyReject' },
            ],
            filterMultiple: false,
            valueEnum: {
                'verifyWait': { text: language('project.stayexamine'), status: 'Warning' },
                'verifyPass': { text: language('project.passed'), status: 'Success' },
                'verifyReject': { text: language('project.fail'), status: 'Error' },
            },
        },
        {
            title: language('project.mconfig.equipmentdevtype'),
            dataIndex: 'type',
            align: 'center',
            width: 150,
            ellipsis: true,
        },

        {
            title: language('project.mconfig.devmod'),
            dataIndex: 'model',
            align: 'center',
            width: 150,
            ellipsis: true,
        },
        {
            title: language('project.mconfig.devvsn'),
            dataIndex: 'version',
            align: 'center',
            width: 210,
            ellipsis: true,
        },

        {
            title: language('project.mconfig.devdspn'),
            dataIndex: 'description',
            align: 'center',
            width: 210,
            ellipsis: true,
        },
        {
            title: language('project.mconfig.restime'),
            dataIndex: 'reg_time',
            align: 'center',
            width: 150,
            ellipsis: true,
        },
        {
            title: language('project.mconfig.cratime'),
            dataIndex: 'createTime',
            align: 'center',
            width: 150,
            ellipsis: true,
        },
        {
            title: language('project.mconfig.uptime'),
            dataIndex: 'updateTime',
            align: 'center',
            width: 150,
            ellipsis: true,
        },
        {
            title: language('project.mconfig.devices.cpuusa'),
            dataIndex: 'cpu_usage',
            align: 'center',
            width: 100,
            ellipsis: true,
        },
        {
            title: language('project.mconfig.devices.moyusa'),
            dataIndex: 'memory_usage',
            align: 'center',
            width: 100,
            ellipsis: true,
        },
        {
            title: language('project.mconfig.devices.diskusa'),
            dataIndex: 'disk_usage',
            align: 'center',
            width: 100,
            ellipsis: true,
        },
        {
            title: language('project.mconfig.devices.rtl'),
            dataIndex: 'run_time',
            align: 'center',
            width: 150,
            ellipsis: true,
            tip: language('project.mconfig.devices.day'),
        },
        {
            title: language('project.mconfig.macaddress'),
            dataIndex: 'devmac',
            align: 'center',
            width: 150,
            ellipsis: true,
        },
        {
            title: language('project.mconfig.devices.zonename'),
            dataIndex: 'zone_name',
            align: 'center',
            width: 80,
            ellipsis: true,
        },
        {
            title: language('project.mconfig.devices.zoneid'),
            dataIndex: 'zone_id',
            align: 'center',
            width: 80,
            ellipsis: true,
            hideInTable: true,
        },
        {
            title: language('project.mconfig.devices.gpzoneidpath'),
            dataIndex: 'gpZoneIDPath',
            align: 'center',
            width: 150,
            ellipsis: true,
            hideInTable: true,
        },
        {
            title: language('project.mconfig.devices.gpzonepath'),
            dataIndex: 'gpZonePath',
            align: 'center',
            width: 150,
            ellipsis: true,
            hideInTable: true,
        },
        {
            disable: true,
            title: language('project.mconfig.operate'),
            align: 'center',
            fixed: 'right',
            width: 150,
            valueType: 'option',
            render: (text, record, _, action) => [
                <a key="cancel"
                    target="_blank"
                    style={
                        record.verifystate === 'verifyPass' || record.regstate === 'logout'
                            ? {
                                color: 'rgba(0,0,0,.25)',
                                cursor: 'not-allowed',
                                disabled: true,
                            }
                            : {}
                    }
                    onClick={() => {
                        if (record.verifystate != 'verifyPass') {
                            if(record.regstate != 'logout'){
                                getDrawModal(1, record)
                            }
                        }
                    }}>
                    <Tooltip title={language('project.examine')} placement='top'>
                        {record.verifystate == 'verifyPass' || record.regstate === 'logout' ?
                            <Seal style={{ fontSize: '16px', color: 'rgba(0,0,0,.25)' }} /> :
                            <Seal style={{ fontSize: '16px', color: '#FF7429' }} />
                        }
                    </Tooltip>
                </a>,
                <a key="cancelsa"
                    target="_blank"
                    style={
                        record.regstate == 'registered'
                            ? {}
                            :{
                                color: 'rgba(0,0,0,.25)',
                                cursor: 'not-allowed',
                                disabled: true,
                            }
                    }
                    onClick={() => {
                        if(record.regstate == 'registered'){
                            showCancellationConfirm(record)
                        }
                    }}>
                    <Tooltip title={language('project.mconfig.devices.cancellation')} >
                        <ExportOutlined style={{ width: '16px', fontSize: '16px' }} size={16} />
                    </Tooltip>
                </a>,

                <a key="editable"
                    onClick={() => {
                        mod(record);
                    }}>
                    <Tooltip title={language('project.deit')} >
                        <EditFilled style={{ width: '16px', fontSize: '16px' }} size={16} />
                    </Tooltip>
                </a>,

                <a key="see"
                    onClick={() => {
                        history.push("/cfgmngt/cascdevc/" + record.id);
                        // setDevicesID(record.id)
                        // getSeeModal(1);
                    }}>
                    <Tooltip title={language('project.see')} >
                        <AiFillEye style={{ width: '16px', fontSize: '16px' }} size={16} />
                    </Tooltip>
                </a>,
            ],
        },
    ];

    useEffect(() => {
        filterChange(filtersType);
    }, [])

    const formRef = useRef();
    const [columns, setColumns] = useState(columnsList);
    const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
    const [drawStatus, setDrawStatus] = useState(false);//draw   添加弹框状态
    const [op, setop] = useState('add');//选中id数组
    const [treeValue, setTreeValue] = useState();
    const [zoneId, setZoneId] = useState();//侧边栏选中地址id
    const [zoneIdVal, setZoneIdVal] = useState();//添加区域id
    const [zoneNameVal, setZoneNameVal] = useState();//添加区域名称
    const [treekey, setTreekey] = useState([]);
    const [treeData, setTreeData] = useState([]);
    const zoneType = 'zone';
    const [initialValue, setInitialValue] = useState([]);
    const { confirm } = Modal;
    const filterChange = (info) => {
        columnsList.map((item) => {
            if (item.dataIndex == 'verifystate') {
                item.filteredValue = info.verifystate ? info.verifystate : null;
            }
            if (item.dataIndex == 'onstate') {
                item.filteredValue = info.onstate ? info.onstate : null;
            }
            if (item.dataIndex == 'regstate') {
                item.filteredValue = info.regstate ? info.regstate : null;
            }
        })
        setColumns(columnsList);
    }

    /** 左侧树形组件 start */
    const treeUrl = '/cfg.php?controller=confZoneManage&action=showZoneTree';
    const leftTreeData = { id: 1, type: 'tree', depth: '1' };
    const [treeInc, setTreeInc] = useState(0);
    //getTree 请求树形内容
    //onSelectLeft
    /** 左侧树形组件 end */

    const incAdd = () => {
        let inc;
        clearTimeout(inc);
        inc = setTimeout(() => {
            setIncID((incID)=> incID + 1);
        }, 100);
    }

    /** table组件 start */
    const rowKey = (record => record.id);//列表唯一值
    const tableHeight = clientHeight - 10;//列表高度
    const tableKey = 'cascedevc';//table 定义的key
    const rowSelection = true;//是否开启多选框
    const addButton = true; //增加按钮  与 addClick 方法 组合使用
    const delButton = true; //删除按钮 与 delClick 方法 组合使用
    const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
    const columnvalue = 'cascedevccolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
    const apishowurl = '/cfg.php?controller=device&action=showDeviceList';//接口路径
    const [queryVal, setQueryVal] = useState();//首个搜索框的值
    let searchVal = { queryVal: queryVal, queryType: 'fuzzy', zoneID: zoneId };//顶部搜索框值 传入接口
    const rowOpenClassName = (record) => {
        return record.isDouble ? record.isDouble == 'Y' ? (record.childrenStatus ? 'prowdevname' : '') : '' : ('crowdevname');
    };
    const expandAble = {
        indentSize: 30,
        expandIcon: ({ expanded, onExpand, record }) => {
            return record.children && record.isDouble == 'Y' ? expanded ? <FoldUpOne style={{ position: 'absolute', top: '15px', right: '10px' }} theme="two-tone" size="18" fill={['#37C3FC', '#3b4d64']} onClick={e => {
                if (record.childrenStatus) {
                    record.childrenStatus = 0;
                } else {
                    record.childrenStatus = 1;
                }
                onExpand(record, e)
            }} /> : (<ExpandDownOne style={{ position: 'absolute', top: '15px', right: '10px' }} theme="two-tone" size="18" fill={['#37C3FC', '#3b4d64']} onClick={e => {
                if (record.childrenStatus) {
                    record.childrenStatus = 0;
                } else {
                    record.childrenStatus = 1;
                }
                onExpand(record, e)
            }} />) : '';
        }
    }
    //初始默认列
    const concealColumns = {
        devid: { show: false },
        version: { show: false },
        description: { show: false },
        reg_time: { show: false },
        updateTime: { show: false },
        createTime: { show: false },
    }
    /* 顶部左侧搜索框*/
    const tableTopSearch = () => {
        return (
            <Search
                allowClear
                placeholder={language('project.mconfig.devices.tablesearch')}
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
        getModal(1, 'add');
    }

    /** table组件 end */

    //下拉处理
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
        setZoneIdVal(selKyeNum)
        setZoneNameVal(selValNum)
    };
    useEffect(() => {
        if (zoneNameVal) {
            setTimeout(function () {
                formRef.current.setFieldsValue({ zoneName: zoneNameVal })
            }, 100)
        }
    }, [zoneNameVal])

    //区域管理处理
    const getTree = (res) => {
        setZoneId(res.id);
        const treeInfoData = [
            res.node,
        ];
        let keys = [];
        keys.push()
        setTreeData(treeInfoData)
        incAdd()
    }

    // 区域管理侧边点击id处理
    const onSelectLeft = (selectedKeys, info) => {
        setZoneId(selectedKeys[0]);//更新选中地址id
        incAdd()
    };

    //判断是否弹出添加drawmodel
    const getDrawModal = (status, record) => {
        if (status == 1) {
            setDrawStatus(true);
            setTreeValue(record.gpZonePath);
            let key = ' ';
            let val = ' ';
            if (record.gpZoneIDPath) {
                key = record.gpZoneIDPath.split('.');
                val = record.gpZonePath.split('/');
            }
            let selKyeNum = key[key.length - 1];
            let selValNum = val[val.length - 1];
            setZoneIdVal(selKyeNum);
            setZoneNameVal(selValNum);
            setTreekey(key);

            let initialValues = record;
            setInitialValue(initialValues);
            setTimeout(function () {
                formRef.current.setFieldsValue(initialValues)
            }, 100)
        } else {
            setZoneIdVal();
            setTreekey([]);
            setTreeValue();
            setZoneNameVal(' ');
            formRef.current.resetFields();
            setDrawStatus(false);
        }
    }
    //判断是否弹出添加model
    const getModal = (status, op) => {

        if (status == 1) {
            setop(op)
            setModalStatus(true);
        } else {
            setZoneIdVal();
            setTreekey([]);
            setTreeValue();
            setZoneNameVal(' ');
            formRef.current.resetFields();
            setModalStatus(false);
        }
    }

    //添加接口
    const save = (values) => {
        values.op = op;
        values.zoneID = zoneIdVal;
        let url = 'addDevice';
        if (op == 'mod') {
            url = 'setDevice';
        }
        post('/cfg.php?controller=device&action=' + url, values).then((res) => {

            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            getModal(2)
            incAdd()
            message.success(res.msg);
        }).catch(() => {
            console.log('mistake')
        })
    }

    //审核处理
    const examine = (verifyPass) => {
        let obj = formRef.current.getFieldsValue(['model', 'reason', 'name'])
        let data = {};
        data.verifyState = verifyPass;
        data.id = initialValue.id;
        data.name = obj.name;
        data.ipaddr = initialValue.ipaddr;
        data.reason = obj.reason;
        data.zoneID = zoneIdVal;
        data.zoneName = zoneNameVal;
        post('/cfg.php?controller=device&action=verifyDevice', data).then((res) => {
            getDrawModal(2)
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            incAdd()
        }).catch(() => {
            console.log('mistake')
        })
    }

    //注销处理
    const cancellation = (record) => {
        let ids = record.id;
        post('/cfg.php?controller=device&action=logoutDevice', { ids: ids }).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            incAdd()
        }).catch(() => {
            console.log('mistake')
        })
    }

    //删除数据
    const delList = (selectedRowKeys) => {
        let ids = selectedRowKeys.join(',');
        post('/cfg.php?controller=device&action=delDevice', { ids: ids }).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            incAdd()
        }).catch(() => {
            console.log('mistake')
        })
    }

    //编辑接口
    const mod = (obj) => {
        setTreeValue(obj.gpZonePath);
        let key = obj.gpZoneIDPath.split('.');
        let val = obj.gpZonePath.split('/');
        obj.expire_time = obj.valid_type == 'forever' ? 0 : obj.expire_time;
        let selKyeNum = key[key.length - 1];
        let selValNum = val[val.length - 1];
        setZoneIdVal(selKyeNum);
        setZoneNameVal(selValNum);
        setTreekey(key);
        let initialValues = obj;
        getModal(1, 'mod');
        setTimeout(function () {
            formRef.current.setFieldsValue(initialValues)
        }, 100)
    }

    const showCancellationConfirm = (record) => {
        confirm({
            className: 'devconfirmmodal',
            icon: <ExclamationCircleOutlined />,
            title: language('project.mconfig.devices.devcel'),
            content: language('project.mconfig.devices.cancelcon'),
            okText: language('project.mconfig.devices.ok'),
            cancelText: language('project.mconfig.devices.cancel'),
            onOk() {
                cancellation(record);
            }
        });
    };
    return (
        <>
            <CardModal
                title={language('project.sysconf.syszone.treelist')}
                cardHeight={clientHeight + 182}
                leftContent={<LeftTree getTree={getTree} onSelectLeft={onSelectLeft} treeInc={treeInc} treeUrl={treeUrl} leftTreeData={leftTreeData} />}
                rightContent={<div className='taccascdevct'><ProtableModule filtersType={filtersType} filterChange={filterChange} concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} rowOpenClassName={rowOpenClassName} expandAble={expandAble} /></div>}
            />
            <ModalForm {...modalFormLayout}
                formRef={formRef}
                className='devicesborder'
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
                    save(values)
                }}>
                <ProFormText hidden={true} type="hidden" name="id" label="IP" />
                <ProFormText name="ipaddr" disabled={op == 'mod' ? true : false} label={language('project.devip')}
                    rules={[
                        {
                            required: true,
                            pattern: regMacList.ip.regex,
                            message: regMacList.ip.alertText,
                        },
                    ]}
                />
                <NameText name='name' label={language('project.devname')} required={true} /> 
                <ProFormText rules={[
                    {
                        required: true,
                        message: regSeletcList.select.alertText,
                    },
                ]} name="zoneName"
                    label={language('project.sysconf.syszone.area')}>
                    <TreeSelect
                        name='gpnamePath'
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
                    />
                </ProFormText>
            </ModalForm>
            <DrawerForm {...drawFormLayout}
                title={language('project.examine')}
                formRef={formRef}
                submitter={false}
                visible={drawStatus}
                onVisibleChange={setDrawStatus}
                drawerProps={{
                    destroyOnClose: true,
                    maskClosable: false,
                    onClose: () => {
                        getDrawModal(2);
                    },
                }}
                autoFocusFirstInput
                submitTimeout={2000}
                onFinish={async (values) => {

                }}>
                <Divider orientation='left'>{language('project.mconfig.devices.registerinformation')}</Divider>
                <div class='showContent'>
                    <ProFormText label={language('project.devip')} name="ipaddr" valueType="text">
                        {initialValue.ipaddr ? initialValue.ipaddr : ' '}
                    </ProFormText>
                    <ProFormText label={language('project.mconfig.equipmentdevtype')} name="type" valueType="text">
                        {initialValue.type ? initialValue.type : ' '}
                    </ProFormText>
                    <ProFormText label={language('project.mconfig.devmod')} name="model" valueType="text">
                        {initialValue.model ? initialValue.model : ' '}
                    </ProFormText>
                </div>
                <Divider orientation='left'>{language('project.mconfig.devices.auditoperation')}</Divider>
                <ProFormText name="name" label={language('project.devname')} rules={[{ required: true, message: language('project.fillin') }]} />
                <ProFormText rules={[
                    {
                        required: true,
                        message: regSeletcList.select.alertText,
                    }
                ]} name="zoneName"
                    label={language('project.mconfig.devices.fromzone')}>
                    <TreeSelect
                        name='gpnamePath'
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
                    />
                </ProFormText>
                <ProFormTextArea name="reason" label={language('project.mconfig.devices.rejectreason')} />
                <Button style={{ left: '48%' }} type="primary" onClick={() => {
                    examine('verifyPass');
                }}>
                    {language('project.mconfig.devices.wac')}
                </Button>
                <Button style={{ left: '52%' }} danger type="primary" onClick={() => {
                    examine('verifyReject');
                }}>
                    {language('project.mconfig.devices.examinereject')}
                </Button>

            </DrawerForm>

        </>
    )

}
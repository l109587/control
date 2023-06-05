import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, message, Modal, TreeSelect, Row, Col, Tag, Slider, InputNumber, Space, Checkbox, Menu } from 'antd';
import { fileDown, post } from '@/services/https';
import { ClusterOutlined, ExclamationCircleOutlined, UnorderedListOutlined } from '@ant-design/icons';
import ProForm, { ModalForm, ProFormText, ProFormRadio, ProFormSelect } from '@ant-design/pro-form';
import { vermodal, modalFormLayout } from "@/utils/helper";
import { formatMessage, FormattedMessage } from 'umi';
import { NotesText, ContentText } from '@/utils/fromTypeLabel';
import { language } from '@/utils/language';
import { regSeletcList } from '@/utils/regExp';
import { Base64 } from 'js-base64';
import Uploadd from '@/utils/Upload';
import { regMacList } from '@/utils/regExp';
import '@/utils/index.less';
import './index.less';
import { TableLayout, CardModal } from '@/components';
const { ProtableModule } = TableLayout;
const { Search } = Input
let H = document.body.clientHeight - 285
var clientHeight = H


export default () => {

    const columns = [
        {
            title: formatMessage({ id: 'project.sysconf.subnet.id' }),
            dataIndex: 'id',
            align: 'center',
            ellipsis: true,
            importStatus: 1,
            width: 160,
            // 
        },
        {
            title: formatMessage({ id: 'project.mconfig.ectstu' }),
            dataIndex: 'status',
            align: 'center',
            ellipsis: true,
            importStatus: 0,
            width: 80,
            filterMultiple: false,
            filters: [
                { text: language('project.sysconf.addrplan.use'), value: 'Y' },
                { text: language('project.sysconf.addrplan.free'), value: 'N' },
            ],
            render: (text, record, index) => {
                let color = 'success';
                if (record.status == 'Y') {
                    color = 'success';
                    text = language('project.sysconf.addrplan.use');
                } else {
                    color = 'warning';
                    text = language('project.sysconf.addrplan.free');
                }
                return (
                    <Space>
                        <Tag style={{ marginRight: '0px' }} color={color} key={record.status}>
                            {text}
                        </Tag>
                    </Space>
                )
            }
        },
        {
            title: formatMessage({ id: 'project.sysconf.addrplan.zoneid' }),
            dataIndex: 'zoneID',
            importStatus: 1,
            ellipsis: true,
            width: 160,
            // 
        },
        {
            title: formatMessage({ id: 'project.sysconf.addrplan.area' }),
            dataIndex: 'zone',
            importStatus: 0,
            ellipsis: true,
            width: 120,
        },
        {
            title: formatMessage({ id: 'project.sysconf.subnet.affiliation' }),
            dataIndex: 'org',
            importStatus: 0,
            ellipsis: true,
            width: 120,
        },
        {
            title: formatMessage({ id: 'project.sysconf.subnet.subordinate' }),
            dataIndex: 'IPNet',
            importStatus: 0,
            ellipsis: true,
            width: 120,
            render: (text, record, _, action) => {
                return  record.IPNet;
            }
        },
        {
            title: formatMessage({ id: 'project.sysconf.subnet.subaddress' }),
            dataIndex: 'subNetaddr',
            importStatus: 0,
            ellipsis: true,
            width: 120,
        },
        {
            title: formatMessage({ id: 'project.sysconf.subnet.subnetmask' }),
            dataIndex: 'maskSize',
            importStatus: 0,
            ellipsis: true,
            width: 80,
        },
        {
            title: formatMessage({ id: 'project.sysconf.subnet.gateway' }),
            dataIndex: 'gatewayIP',
            importStatus: 0,
            ellipsis: true,
            width: 120,
        },
        {
            title: 'VLAN',
            dataIndex: 'vlan',
            importStatus: 0,
            ellipsis: true,
            width: 80,
        },
        {
            title: formatMessage({ id: 'project.sysconf.subnet.purpose' }),
            dataIndex: 'buisUsg',
            importStatus: 0,
            ellipsis: true,
            width: 120,
        },
        {
            title: formatMessage({ id: 'project.sysconf.subnet.location' }),
            dataIndex: 'location',
            importStatus: 0,
            ellipsis: true,
            width: 160,
        },
        {
            title: formatMessage({ id: 'project.sysconf.subnet.cycle' }),
            dataIndex: 'cycle',
            importStatus: 1,
            ellipsis: true,
            width: 120,
            hideInTable: true,
        },
        {
            title: formatMessage({ id: 'project.sysconf.subnet.cycleTime' }),
            dataIndex: 'cycleTime',
            importStatus: 0,
            ellipsis: true,
            tip: formatMessage({ id: 'project.sysconf.subnet.day' }),
            width: 160,
        },
        {
            title: formatMessage({ id: 'project.remark' }),
            dataIndex: 'notes',
            ellipsis: true,
            importStatus: 0,
        },
        {
            title: formatMessage({ id: 'project.sysconf.addrplan.creattime' }),
            dataIndex: 'createTime',
            importStatus: 1,
            ellipsis: true,
            width: 160,
        },
        {
            title: formatMessage({ id: 'project.sysconf.addrplan.updatetime' }),
            dataIndex: 'updateTime',
            importStatus: 1,
            ellipsis: true,
            width: 160,
        },
        {
            width: 80,
            title: formatMessage({ id: 'project.mconfig.operate' }),
            align: 'center',
            fixed: 'right',
            ellipsis: true,
            importStatus: 1,
            render: (text, record, _, action) => [
                <a key="editable"
                    onClick={() => {
                        mod(record, 'mod');
                    }}>
                    <FormattedMessage id="project.deit" />
                </a>,

            ],
        },
    ];


    const formRef = useRef();
    const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
    const [dataList, setList] = useState([]);//model 添加弹框状态
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);//选中id数组
    const [delStatus, setipDelStatus] = useState(true);//选中id数组
    const [op, setop] = useState('add');//选中id数组
    const [purposeList, setPurposeList] = useState([]);//业务用途
    const [treelist, setTreelist] = useState([]);//侧边显示
    const [iPNetID, setIPNetID] = useState();//所属规划网段ID
    const [iPNetIDList, setIPNetIDList] = useState();//所属规划网段ID
    const [iPNet, setIPNet] = useState();//IPNet所属规划网段
    const [iPNetList, setIPNetList] = useState();//IPNet所属规划网段
    const [minMarks, setMinMarks] = useState(1);//最小掩码位数
    const [minMarksList, setMinMarksList] = useState(24);//最小掩码位数
    const { confirm } = Modal;
    //列表数据
    const [treeValue, setTreeValue] = useState();
    const [treekey, setTreekey] = useState([]);
    const [treeData, setTreeData] = useState([]);

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
        url: '/cfg.php?controller=confIPAddrManage&action=importIPSubNetAddr',
    }

    const [netaddrVal, setNetaddrVal] = useState();
    const [startIp, setStartIp] = useState([0, 0, 0, 0]);
    const [endIp, setEndIp] = useState([0, 0, 0, 0]);
    const [netmaskVal, setNetmaskVal] = useState(1);
    const lday = 30;
    const cStatus = false;
    const [limitDay, setLimitDay] = useState(lday);
    const [cycleStatus, setCycleStatus] = useState(cStatus)
    const orgType = 'org';

    const marks = {

        16: {
            style: {
                color: '#f50',
            },
        },
    };

    /** table组件 start */
    const rowKey = (record => record.id);//列表唯一值
    const tableHeight = clientHeight - 20;//列表高度
    const tableKey = 'addrplan';//table 定义的key
    const rowSelection = true;//是否开启多选框
    const addButton = true; //增加按钮  与 addClick 方法 组合使用
    const delButton = true; //删除按钮 与 delClick 方法 组合使用
    const uploadButton = true; //导入按钮 与 uploadClick 方法 组合使用
    const downloadButton = true; //导出按钮 与 downloadClick 方法 组合使用
    const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
    const columnvalue = 'snetconfcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
    const apishowurl = '/cfg.php?controller=confIPAddrManage&action=showIPSubNetAddr';//接口路径
    const [queryVal, setQueryVal] = useState();//首个搜索框的值
    const typeLeft = true;
    let searchVal = { queryVal: queryVal, queryType: 'fuzzy', IPNetID: iPNetID };//顶部搜索框值 传入接口
    const incAdd = () => {
		let inc;
		clearTimeout(inc);
		inc = setTimeout(() => {
			setIncID(incID + 1);
		}, 300);
	}
    //初始默认列
    const concealColumns = {
        id: { show: false },
        zoneID: { show: false },
        createTime: { show: false },
        updateTime: { show: false }
    }
    /* 顶部左侧搜索框*/
    const tableTopSearch = () => {
        return (
            <Search
                placeholder={language('project.sysconf.subnet.search')}
                style={{ width: 200 }}
                onSearch={(queryVal) => {
                    setQueryVal(queryVal);
                    incAdd();
                }}
            />
        )
    }

    //添加按钮点击触发
    const addClick = () => {
        setCycleStatus(cStatus);
        setLimitDay(lday);
        setNetaddrVal();
        setNetmaskVal(parseInt(minMarksList));
        setMinMarks(minMarksList);
        setIPNet(iPNetList);
        setIPNetID(iPNetIDList);
        onChangeSlider(minMarksList, '');
        getModal(1, 'add');
        let initialValues = { IPNet: iPNetList, IPNetID: iPNetIDList, IPNetContent: iPNetList }
        setTimeout(function () {
            formRef.current.setFieldsValue(initialValues)
        }, 100)
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

    //导入按钮
    const uploadClick = () => {
        getImportModal(1);
    }

    //导出按钮
    const downloadClick = () => {
        exportFunction();
    }

    /** table组件 end */

    /*
     * 获取主机数
     *
     * @param netMask
     * @returns {Number}
     */
    const getHostNumber = (netMask) => {
        let hostNumber = 0;
        const netMaskArray = [];
        for (let i = 0; i < 4; i += 1) {
            netMaskArray[i] = netMask.split('.')[i];
            if (Number(netMaskArray[i]) < 255) {
                hostNumber = 256 ** (3 - i) * (256 - Number(netMaskArray[i]));
                break;
            }
        }

        return hostNumber;
    }
    //将ip转换成数字比较大小
    const ipToNumber = (ip) => {
        var numbers = ip.split('.');
        return (
            parseInt(numbers[0], 10) * 256 * 256 * 256 +
            parseInt(numbers[1], 10) * 256 * 256 +
            parseInt(numbers[2], 10) * 256 +
            parseInt(numbers[3], 10)
        );
    }

    //转换掩码的格式
    const getNetMask = (inetMask) => {
        let netMask = '';
        if (inetMask > 32) {
            return netMask;
        }
        // 子网掩码为1占了几个字节
        const num1 = parseInt(`${inetMask / 8}`, 2);
        // 子网掩码的补位位数
        let num2 = inetMask % 8;
        const array = [];
        for (let i = 0; i < num1; i += 1) {
            array[i] = 255;
        }
        for (let i = num1; i < 4; i += 1) {
            array[i] = 0;
        }
        for (let i = 0; i < num2; num2 -= 1) {
            array[num1] += 2 ** (8 - num2);
        }
        netMask = `${array[0]}.${array[1]}.${array[2]}.${array[3]}`;

        return netMask;
    }

    //IP开始地址
    const getLowAddr = (ip, netMask) => {
        let lowAddr = '';
        const ipArray = [];
        const netMaskArray = [];
        // I参数不正确
        if (ip.split('.').length !== 4 || netMask === '') {
            return '';
        }
        for (let i = 0; i < 4; i += 1) {
            ipArray[i] = Number(ip.split('.')[i]);
            netMaskArray[i] = netMask.split('.')[i];
            if (
                Number(ipArray[i]) > 255 ||
                Number(ipArray[i]) < 0 ||
                (Number(netMaskArray[i]) > 255 && Number(netMaskArray[i]) < 0)
            ) {
                return '';
            }
            ipArray[i] = Number(ipArray[i]) & Number(netMaskArray[i]);
        }
        // 构造最小地址
        for (let i = 0; i < 4; i += 1) {
            if (i === 3) {
                ipArray[i] = Number(ipArray[i]);
            }
            if (lowAddr === '') {
                lowAddr += ipArray[i];
            } else {
                lowAddr += `.${ipArray[i]}`;
            }
        }
        return lowAddr;
    }

    //通过位数计算掩码
    const calculationMask = (bitCount) => {
        var mask = [];
        for (var i = 0; i < 4; i++) {
            var n = Math.min(bitCount, 8);
            mask.push(256 - Math.pow(2, 8 - n));
            bitCount -= n;
        }
        return mask.join('.');
    }

    //ip结束地址
    const getHighAddr = (ip, netMask) => {
        netMask = calculationMask(netMask);
        let lowAddr = getLowAddr(ip, netMask);
        let hostNumber = getHostNumber(netMask);
        if ('' === lowAddr || hostNumber === 0) {
            return '';
        }

        let lowAddrArray = [];
        for (let i = 0; i < 4; i += 1) {
            lowAddrArray[i] = Number(lowAddr.split('.')[i]);
            if (i === 3) {
                lowAddrArray[i] = Number(lowAddrArray[i]) - 1;
            }
        }
        lowAddrArray[3] = lowAddrArray[3] + Number(hostNumber);
        if (lowAddrArray[3] > 255) {
            let k = parseInt(String(lowAddrArray[3] / 256), 10);
            lowAddrArray[3] = lowAddrArray[3] % 256;
            lowAddrArray[2] = Number(lowAddrArray[2]) + Number(k);
            if (lowAddrArray[2] > 255) {
                k = parseInt(String(lowAddrArray[2] / 256), 10);
                lowAddrArray[2] = lowAddrArray[2] % 256;
                lowAddrArray[1] = Number(lowAddrArray[1]) + Number(k);
                if (lowAddrArray[1] > 255) {
                    k = parseInt(String(lowAddrArray[1] / 256), 10);
                    lowAddrArray[1] = lowAddrArray[1] % 256;
                    lowAddrArray[0] = Number(lowAddrArray[0]) + Number(k);
                }
            }
        }

        let highAddr = '';
        for (let i = 0; i < 4; i += 1) {
            if ('' === highAddr) {
                highAddr = String(lowAddrArray[i]);
            } else {
                highAddr += '.' + lowAddrArray[i];
            }
        }
        let data = [];
        data.lowAddr = lowAddr;//最小
        data.highAddr = highAddr;//最大
        return data;
    }

    const onChangeSlider = (newValue, netaddr) => {
        if (newValue) {
            setNetmaskVal(Number(newValue));
        }
        // console.log(netaddrVal)
        let netaddrVal = netaddr == '' ? netaddrVal : netaddr;
        // 验证IP的正则
        var regexIP = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;
        if (regexIP.test(netaddrVal)) {
            clearTimeout(window.timer);
            window.timer = setTimeout(function () {
                let ip = getHighAddr(netaddrVal, newValue)
                setStartIp(ip.lowAddr.split('.'));
                setEndIp(ip.highAddr.split('.'))
            }, 500)

        } else {
            if (startIp[0] != 0 && endIp[0] != 0) {
                setStartIp([0, 0, 0, 0]);
                setEndIp([0, 0, 0, 0])
            }
        }

    };


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
            data.type = orgType;
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

    //计算网络范围
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
        let keyNum = selKye[selKye.length - 1];
        formRef.current.setFieldsValue({ orgID: keyNum })
        setTreeValue(selVal.join('/'));
        setTreekey(selKye);
    };


    useEffect(() => {
        getTree();
        getBusinessPurpose();
    }, [])

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

    //区域管理处理
    const getTree = (id = 1) => {
        let data = {};
        data.zoneID = id;//管理员所属区域id    
        data.leaf = 'Y';
        post('/cfg.php?controller=confIPAddrManage&action=showPlanIPNetAddrList', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            let id = '';
            if (res.data.length > 0) {
                let e = [];
                res.data.map((item) => {
                    let icon = <UnorderedListOutlined />;
                    e.push({ key: item.id, label: item.netaddr + '/' + (item.maskSize), icon: icon, netaddr: item.netaddr, zoneID: item.zoneID, maskSize: item.maskSize })
                })
                setMinMarks(parseInt(res.data[0].maskSize));
                setIPNetIDList(res.data[0].id);//更新选中网段id
                setIPNet(res.data[0].netaddr + '/' + res.data[0].maskSize);//更新选中网段
                setIPNetList(res.data[0].netaddr + '/' + res.data[0].maskSize);//更新选中网段
                setTreelist(e);
                id = res.data[0].id;
                getZoneTree(res.data[0].zoneID);
            }
            setIPNetID(id);//更新选中网段id
            incAdd();
        }).catch(() => {
            console.log('mistake')
        })
    }

    //区域管理处理
    const getZoneTree = (id = 1) => {
        let data = {};
        data.id = id;
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
                setTreeData(treeInfoData)
            }

        }).catch(() => {
            console.log('mistake')
        })
    }
    // 区域管理侧边点击id处理
    const onSelectLeft = (selectedKeys, info) => {
        let find = treelist.filter((item) => item.key == selectedKeys);
        setIPNetID(selectedKeys);//更新选中网段id
        setIPNetIDList(selectedKeys);//更新选中网段id
        setIPNet(find[0].netaddr + '/' + find[0].maskSize);//更新选中网段
        setIPNetList(find[0].netaddr + '/' + find[0].maskSize);//更新选中网段
        incAdd();
        getZoneTree(find[0].zoneID);
    };

    //判断是否弹出添加model
    const getModal = (status, op) => {
        if (status == 1) {
            setop(op)
            setModalStatus(true);
        } else {
            setNetaddrVal();
            setNetmaskVal(minMarksList);
            setTreeValue();//区域地址名称
            setTreekey([]);//区域地址key
            formRef.current.resetFields();
            setModalStatus(false);
        }
    }
    //添加修改接口
    const save = (info) => {
        //判断选中地址id
        if (treekey.length < 1) {
            message.error(formatMessage({ id: 'project.sysconf.addrplan.orgcontent' }));
            return false;
        }
        let tVal = treeValue.split('/');
        //判断选中地址名称
        if (tVal.length < 1) {
            message.error(formatMessage({ id: 'project.sysconf.addrplan.orgcontent' }));
            return false;
        }
        let data = {};
        data.op = op;
        data.id = info.id;
        data.notes = info.notes;//备注
        data.orgID = treekey[treekey.length - 1];//上级部门ID
        data.org = tVal[tVal.length - 1];//上级部门名称
        data.gpOrgIDPath = treekey.join('.');//上级部门id 路径
        data.gpOrgPath = tVal.join('/');//上级部门 路径
        data.IPNetID = info.IPNetID;//所属规划网段ID
        data.IPNet = info.IPNetContent;//所属规划网段
        data.subNetaddr = netaddrVal;//子网地址
        data.maskSize = netmaskVal;//掩码大小netmaskVal
        data.gatewayIP = info.gatewayIP;//默认网关IP
        data.vlan = info.vlan;//VLAN ID
        data.location = info.location;//所在位置
        data.buisUsg = info.buisUsg;
        data.cycle = cycleStatus == true ? 'Y' : 'N';//地址回收[Y/N]
        data.cycleTime = limitDay ? limitDay : 0;//回收时间
        post('/cfg.php?controller=confIPAddrManage&action=setIPSubNetAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            getModal(2);
            incAdd();
        }).catch(() => {
            console.log('mistake')
        })

    }

    //删除数据
    const delList = (selectedRowKeys) => {
        // let id = record.id;//单个删除id
        let data = {};
        data.ids = selectedRowKeys.join(',');
        post('/cfg.php?controller=confIPAddrManage&action=delIPSubNetAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            selectedRowKeys.forEach(i => {
                dataList.forEach((each, index) => {
                    if (each.id == i) {
                        dataList.splice(index, 1);
                    }
                })

            });
            var list = dataList;
            setSelectedRowKeys([]);//清空选中数据
            setipDelStatus(true);//添加删除框状态
            setList([...list]);
            incAdd();
        }).catch(() => {
            console.log('mistake')
        })

    }

    const showDeleteConfirm = () => {
        let sum = selectedRowKeys.length;
        confirm({
            className: 'snetconfbox',
            icon: <ExclamationCircleOutlined />,
            title: formatMessage({ id: 'project.delconfirm' }),
            content: formatMessage({ id: 'project.sysconf.syszone.cancelcon' }, { sum: sum }),
            okText: formatMessage({ id: 'project.mconfig.devices.ok' }),
            cancelText: formatMessage({ id: 'project.mconfig.devices.cancel' }),
            onOk() {
                delList();
            }
        });
    };

    //编辑
    const mod = (obj, op) => {
        setCycleStatus(obj.cycle == 'Y' ? true : false);
        setLimitDay(parseInt(obj.cycleTime));
        setTreeValue(obj.gpOrgPath);
        setNetaddrVal(obj.subNetaddr);
        setNetmaskVal(parseInt(obj.maskSize));
        setIPNet(obj.IPNet);
        setIPNetID(obj.IPNetID);
        setMinMarks(parseInt(obj.maskSize));
        let key = obj.gpOrgIDPath.split('.');
        onChangeSlider(parseInt(obj.maskSize), obj.subNetaddr);
        setTreekey(key);
        let initialValues = obj;
        initialValues.IPNetContent = obj.IPNet;
        getModal(1, op);
        setTimeout(function () {
            formRef.current.setFieldsValue(initialValues)
        }, 100)
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
                wrapClassName: 'snetconfmodalupload',
                title: formatMessage({ id: 'project.title' }),
                content: res.msg,
                okText: formatMessage({ id: 'project.determine' }),
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

        return columns.map((item) => {
            if (item.dataIndex == 'cycleTime') {
                item.title = formatMessage({ id: 'project.sysconf.subnet.cycleTimeday' });
            }
            if (!item.importStatus) {
                return (
                    <ProForm.Group style={{ width: "100%" }}>
                        <ProFormSelect
                            width="200px"
                            options={info}
                            name={item.dataIndex}
                            initialValue={importFieldsList.indexOf(item.title) === -1 ? '' : importFieldsList.indexOf(item.title) + '&&' + item.title}
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
        post('/cfg.php?controller=confIPAddrManage&action=importIPSubNetAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(res.msg);
            getCloseImport();
            incAdd();
        }).catch(() => {
            console.log('mistake')
        })
    }

    /* 导出功能 */
    const exportFunction = () => {
        fileDown('/cfg.php?controller=confIPAddrManage&action=exportIPSubNetAddr').then((res, b, c) => {
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
            <CardModal
                type='menu'
                cardHeight={clientHeight + 182}
                leftContent={
                    <>
                        <div style={{ fontSize: "15px" }}><ClusterOutlined style={{ fontSize: "18px", color: '#08c', height: '35px' }} />规划列表</div>
                        <Menu className='snetmenu'
                            onClick={(e) => {
                                let info = '';
                                treelist.map((item) => {
                                    if (item.key == e.key) {
                                        info = item.label
                                    }
                                })
                                onSelectLeft(e.key, info)
                            }}
                            defaultSelectedKeys="1"
                            style={{
                                width: "100%",
                                height: 'calc(100% - 59px)'
                            }}
                            items={treelist}
                        />
                    </>
                }
                rightContent={
                    <ProtableModule typeLeft={typeLeft} concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} uploadButton={uploadButton} uploadClick={uploadClick} downloadButton={downloadButton} downloadClick={downloadClick} />
                } />
            <ModalForm className='submoform'
                {...vermodal}
                layout="vertical"
                formRef={formRef}
                title={op == 'add' ? <FormattedMessage id="project.sysconf.subnet.addsubnet" /> : <FormattedMessage id="project.sysconf.subnet.modsubnet" />}
                visible={modalStatus} autoFocusFirstInput
                modalProps={{
                    maskClosable: false,
                    onCancel: () => {
                        getModal(2)
                    },
                }} submitTimeout={2000} onFinish={async (values) => {
                    save(values);
                    // return true;
                }}>
                <ProFormText hidden={true} type="hidden" name="id" label="IP" />
                <ProFormText name="IPNetID" hidden={true} initialValue={iPNetID} label={formatMessage({ id: 'project.sysconf.subnet.subordinateid' })} disabled />
                <ProForm.Group>
                    <ProFormText hidden={true} name="op" label={formatMessage({ id: 'project.sysconf.syszone.opcode' })} initialValue={op} />
                    <ProFormText name="orgID" rules={[{ required: true, message: regSeletcList.select.alertText }]} label={formatMessage({ id: 'project.sysconf.subnet.affiliation' })} >
                        <TreeSelect style={{ width: 200 }}
                            treeDataSimpleMode
                            value={treeValue}
                            dropdownStyle={{
                                maxHeight: 400,
                                overflow: 'auto',
                            }}
                            placeholder={formatMessage({ id: 'project.select' })}
                            onChange={onChangeSelect}
                            loadData={onLoadData}
                            treeData={treeData}
                            rules={[{ required: true, message: regSeletcList.select.alertText }]}
                        />
                    </ProFormText>

                    <ProFormText
                        name="IPNetContent" width="200px" label={formatMessage({ id: 'project.sysconf.subnet.subordinate' })} disabled />
                </ProForm.Group>

                <ProForm.Group style={{ width: "100%" }} >
                    <ProFormText name="subNetaddr" width="200px" label={formatMessage({ id: 'project.sysconf.subnet.subaddress' })} data-value={netmaskVal}
                        rules={[
                            {
                                required: true,
                                pattern: regMacList.ip.regex,
                                message: regMacList.ip.alertText,
                            },
                        ]}
                        onChange={(e) => {
                            setNetaddrVal(e.target.value)
                            onChangeSlider(netmaskVal, e.target.value);
                        }} />

                    <ProFormText width="200px" name="subNetmask" label={formatMessage({ id: 'project.sysconf.subnet.subnetmask' })} >
                        <Row style={{ width: 200 }} >
                            <Col span={8}>
                                <Slider
                                    marks={marks} included={false}
                                    // min={minMarks}
                                    min={24}
                                    max={30}
                                    style={{
                                        width: "145px",
                                        marginRight: "20px"
                                    }}
                                    data-value={netaddrVal}
                                    onChange={(newValue) => {
                                        onChangeSlider(newValue, netaddrVal);
                                    }}
                                    value={typeof netmaskVal === 'number' ? netmaskVal : 0}
                                />
                            </Col>
                            <Col span={2}>
                                <InputNumber
                                    controls={false}
                                    // min={minMarks}
                                    min={24}
                                    max={30}
                                    style={{
                                        marginLeft: "95px",
                                        width: 40, textAlign: 'center'
                                    }}
                                    value={netmaskVal}
                                    data-value={netaddrVal}
                                    onChange={(newValue) => {
                                        onChangeSlider(newValue, netaddrVal);
                                    }}
                                />
                            </Col>
                        </Row>
                    </ProFormText >
                </ProForm.Group>

                <ProForm.Group >
                    <ProFormText width="200px" name="startIPAddr" label={formatMessage({ id: 'project.sysconf.addrplan.startaddress' })} >
                        <Space
                            size={[4, 3]}
                        >
                            <Input style={{ width: "42px", height: 32, padding: 1, textAlign: 'center', }} value={startIp[0]} disabled />.<Input style={{ width: "42px", height: 32, padding: 1, textAlign: 'center', }} value={startIp[1]} disabled />. <Input style={{ width: "42px", height: 32, padding: 1, textAlign: 'center', }} value={startIp[2]} disabled />.<Input style={{ width: "42px", height: 32, padding: 1, textAlign: 'center', }} value={startIp[3]} disabled />
                        </Space>
                    </ ProFormText>
                    <ProFormText name="endIPAddr" label={formatMessage({ id: 'project.sysconf.addrplan.endaddress' })} >
                        <Space
                            size={[4, 3]}
                        >
                            <Input style={{ width: "42px", height: 32, padding: 1, textAlign: 'center', }} value={endIp[0]} disabled />.<Input style={{ width: "42px", height: 32, padding: 1, textAlign: 'center', }} value={endIp[1]} disabled />.<Input style={{ width: "42px", height: 32, padding: 1, textAlign: 'center', }} value={endIp[2]} disabled />.<Input style={{ width: "42px", height: 32, padding: 1, textAlign: 'center', }} value={endIp[3]} disabled />
                        </Space>
                    </ProFormText>
                </ProForm.Group>

                <ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                    <ProFormText width="200px" name="gatewayIP" label={formatMessage({ id: 'project.sysconf.subnet.gateway' })}
                        rules={[
                            {
                                required: true,
                                pattern: regMacList.ip.regex,
                                message: regMacList.ip.alertText,
                            },
                        ]} />
                    <ProFormText width="200px" name="vlan" label="VLAN"
                        rules={[
                            {
                                required: true,
                                pattern: regMacList.vlan.regex,
                                message: regMacList.vlan.alertText,
                            },
                        ]} />
                </ProForm.Group>

                <ProForm.Group>
                    <ContentText name="location" width="200px" label={formatMessage({ id: 'project.sysconf.subnet.location' })} required={true}  />
                    <ProFormSelect width="200px" options={purposeList}
                        name="buisUsg"
                        label={formatMessage({ id: 'project.sysconf.subnet.purpose' })}
                    />

                </ProForm.Group>
                <div style={{ marginLeft: 12 }}>
                    <ProFormText className='formtext' name='cycels' label={formatMessage({ id: 'project.sysconf.subnet.recovery' })} >
                        <Checkbox
                            defaultChecked={false} name='cycle'
                            checked={cycleStatus}
                            // style={{ marginRight:10,marginTop:-50 }}
                            onChange={(e) => {
                                setCycleStatus(e.target.checked)
                            }}
                        />
                        <div></div>
                        <div className='word' > {formatMessage({ id: 'project.sysconf.subnet.word' })}
                            <InputNumber controls={false} style={{ width: 40, textAlign: 'center', marginLeft: 5 }} name='cycleTime' min={1} max={365} value={limitDay} onChange={(newValue) => {
                                setLimitDay(newValue);
                            }} />
                            {formatMessage({ id: 'project.sysconf.subnet.span' })}
                        </div>
                    </ProFormText>
                    <NotesText  width="440px" name="notes" label={formatMessage({ id: 'project.remark' })} required={false} /> 
                </div>

            </ModalForm>
            <ModalForm {...modalFormLayout}
                className='filesentconfmodal'
                formRef={formRef}
                title={<FormattedMessage id="project.import" />}
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
                        <ProFormText tooltip={formatMessage({ id: 'project.sysconf.syszone.fileformatcsv' })} label={formatMessage({ id: 'project.sysconf.syszone.import' })} >
                            <Uploadd
                                width="200px"
                                config={uploadConfig}
                                fileList={fileList}
                                paramentUpload={paramentUpload}
                                onSuccess={onFileSuccess}
                                onPreview={(file) => { }}
                            >
                                <Button
                                    size="small"
                                >
                                    <FormattedMessage id="project.sysconf.syszone.importfile" />
                                </Button>
                            </Uploadd>
                        </ProFormText>
                        <ProFormRadio.Group initialValue={fileCode}
                            onChange={(e) => {
                                setFileCode(e.target.value);
                            }}
                            label={formatMessage({ id: 'project.filecode' })}
                            name='read'
                            options={[
                                { label: formatMessage({ id: 'project.utf8' }), value: 'utf-8' },
                                { label: formatMessage({ id: 'project.gbk' }), value: 'gbk' }
                            ]}
                        />
                    </>
                    :
                    <ProForm.Group style={{ width: "100%" }}>
                        <div style={{ width: '200px', marginBottom: '12px' }}>
                            <FormattedMessage id="project.importfilefields" />
                        </div>
                        <div style={{ width: '200px', marginBottom: '12px' }}>
                            <FormattedMessage id="project.mappingfields" />
                        </div>
                    </ProForm.Group>

                }
                {ifImport ? '' : getImportFields()}
            </ModalForm>
        </>
    );
};












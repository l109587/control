import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, message, Modal, TreeSelect, Row, Col, Tree, Slider, InputNumber, Space, Tag, Tooltip } from 'antd';
import { fileDown, post } from '@/services/https';
import { ExclamationCircleOutlined, UnorderedListOutlined, FileOutlined } from '@ant-design/icons';
import ProForm, { ModalForm, ProFormTextArea, ProFormText, ProFormRadio, ProFormSelect } from '@ant-design/pro-form';
import './index.less'
import { modalFormLayout } from "@/utils/helper";
import { language } from '@/utils/language';
import { NotesText } from '@/utils/fromTypeLabel';import { Base64 } from 'js-base64'
import Uploadd from '@/utils/Upload';
import '@/utils/index.less';
import { regMacList } from '@/utils/regExp';
import { TableLayout, CardModal } from '@/components';
const { ProtableModule } = TableLayout;
const { Search } = Input
let H = document.body.clientHeight - 285
var clientHeight = H

export default () => {
    const columns = [
        {
            title: language('project.sysconf.addrplan.id'),
            dataIndex: 'id',
            importStatus: 1,
            align: 'center',
            width: 160,
        },
        {
            title: language('project.mconfig.ectstu'),
            dataIndex: 'status',
            importStatus: 0,
            align: 'center',
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
            title: language('project.sysconf.addrplan.zoneid'),
            dataIndex: 'zoneID',
            importStatus: 1,
            width: 160,
        },
        {
            title: language('project.sysconf.addrplan.area'),
            dataIndex: 'zone',
            importStatus: 0,
            width: 120,
        },
        {
            title: language('project.sysconf.addrplan.netaddress'),
            dataIndex: 'netaddr',
            importStatus: 0,
            width: 120,
        },
        {
            title: language('project.sysconf.addrplan.netmask'),
            dataIndex: 'maskSize',
            importStatus: 0,
            width: 80,
        },
        {
            title: language('project.sysconf.addrplan.startaddress'),
            dataIndex: 'startIPAddr',
            importStatus: 1,
            width: 120,
        },
        {
            title: language('project.sysconf.addrplan.endaddress'),
            dataIndex: 'endIPAddr',
            importStatus: 1,
            width: 120,
        },
        {
            title: language('project.remark'),
            dataIndex: 'notes',
            importStatus: 0,
        },
        {
            title: language('project.sysconf.addrplan.creattime'),
            dataIndex: 'createTime',
            importStatus: 1,
            width: 160,
        },
        {
            title: language('project.sysconf.addrplan.updatetime'),
            dataIndex: 'updateTime',
            importStatus: 1,
            width: 160,
        },
        {
            width: 80,
            title: language('project.mconfig.operate'),
            align: 'center',
            importStatus: 1,
            fixed: 'right',
            render: (text, record, _, action) => [
                <a key="editable"
                    onClick={() => {
                        mod(record, 'mod');
                    }}>
                    {language('project.deit')}
                </a>,

            ],
        },
    ];

    const formRef = useRef();
    const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
    const [op, setop] = useState('add');//选中id数组
    const [treelist, setTreelist] = useState([]);
    const [treelistKey, setTreelistKey] = useState([1]);
    const [selectedKey, setSelectedKey] = useState([])
    const [zoneId, setZoneId] = useState();
    const [ifImport, setIfImport] = useState(true);//显示上传 or 显示匹配字段
    const [imoritModalStatus, setImoritModalStatus] = useState(false);//导入 上传文件弹出框
    const [importFieldsList, setImportFieldsList] = useState(false);//导入 选择字段
    const fileList = [];
    const [fileCode, setFileCode] = useState('utf-8');//文件编码
    //接口参数
    const paramentUpload = {
        'filecode': fileCode,
    }
    const uploadConfig = {
        accept: 'csv', //接受上传的文件类型：zip、pdf、excel、image
        max: 100000000000000, //限制上传文件大小
        url: '/cfg.php?controller=confIPAddrManage&action=importIPNetAddr',
    }

    const { confirm } = Modal;
    const zoneType = 'zone';

    const [netaddrVal, setNetaddrVal] = useState();
    const [sliderValue, setSliderValue] = useState(16);
    const [startIp, setStartIp] = useState([0, 0, 0, 0]);
    const [endIp, setEndIp] = useState([0, 0, 0, 0]);
    const marks = {
        16: {
            style: {
                color: '#f50',
            },

        },
    };

    //列表数据
    const [treeValue, setTreeValue] = useState();
    const [treekey, setTreekey] = useState([]);
    const [treeData, setTreeData] = useState([]);

    /** table组件 start */
    const rowKey = (record => record.id);//列表唯一值
    const tableHeight = clientHeight - 10;//列表高度
    const tableKey = 'addrplan';//table 定义的key
    const rowSelection = true;//是否开启多选框
    const addButton = true; //增加按钮  与 addClick 方法 组合使用
    const delButton = true; //删除按钮 与 delClick 方法 组合使用
    const uploadButton = true; //导入按钮 与 uploadClick 方法 组合使用
    const downloadButton = true; //导出按钮 与 downloadClick 方法 组合使用
    const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
    const columnvalue = 'addrplancolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
    const apishowurl = '/cfg.php?controller=confIPAddrManage&action=showPlanIPNetAddrList';//接口路径
    const [queryVal, setQueryVal] = useState();//首个搜索框的值
    let searchVal = { queryVal: queryVal, queryType: 'fuzzy', leaf: 'N', zoneID: zoneId };//顶部搜索框值 传入接口

    //初始默认列
    const concealColumns = {
        id: { show: false },
        zoneID: { show: false },
        createTime: { show: false },
        updateTime: { show: false },
    }
    /* 顶部左侧搜索框*/
    const tableTopSearch = () => {
        return (
            <Search
                placeholder={language('project.sysconf.addrplan.search')}
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
        let initialValue = [];
        setTimeout(function () {
            formRef.current.setFieldsValue(initialValue)
        }, 100);
        getModal(1, 'add');
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

    //下拉动态选择
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
        setTreeValue(selVal.join('/'));
        setTreekey(selKye);
    };

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
                ipArray[i] = Number(ipArray[i]) + 1;
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
        lowAddrArray[3] = lowAddrArray[3] + Number(hostNumber - 1);
        //alert(lowAddrArray[3]);
        if (lowAddrArray[3] > 255) {
            let k = parseInt(String(lowAddrArray[3] / 256), 10);
            //alert(k);
            lowAddrArray[3] = lowAddrArray[3] % 256;
            //alert(lowAddrArray[3]);
            lowAddrArray[2] = Number(lowAddrArray[2]) + Number(k);
            //alert(lowAddrArray[2]);
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
            if (i === 3) {
                lowAddrArray[i] -= 1;
            }
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

    //计算网络范围
    const onChangeSlider = (newValue, netaddr) => {
        if (newValue) {
            setSliderValue(Number(newValue));
        }
        let netaddrVal = netaddr == '' ? netaddrVal : netaddr;
        // 验证IP的正则
        var regexIP = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;
        if (regexIP.test(netaddrVal)) {
            clearTimeout(window.timer);
            window.timer = setTimeout(function () {
                let ip = getHighAddr(netaddrVal, newValue)
                setStartIp(ip.lowAddr.split('.'));
                setEndIp(ip.highAddr.split('.'))
            }, 300)
        } else {
            if (startIp[0] != 0 && endIp[0] != 0) {
                setStartIp([0, 0, 0, 0]);
                setEndIp([0, 0, 0, 0])
            }
        }
    };

    useEffect(() => {
        getTreeKey();
    }, [])

    const getTreeKey = () => {
        post('/cfg.php?controller=confIPAddrManage&action=showFirstPlanIPNetAddr').then((res) => {
            let key = res.data.gpath ? res.data.gpath.split('.') : ['1'];
            setTreelistKey(key)
            getTree('', res.data.zone_id);
        }).catch(() => {
            console.log('mistake')
        })

    }

    const iconTreeList = (list) => {
        if (list.name) {
            list.icon = <UnorderedListOutlined />;
        }
        list.children.map((item) => {
            if (item.leaf == 'N') {
                item.icon = <UnorderedListOutlined />;
                item = iconTreeList(item);
            } else {
                item.icon = <FileOutlined />;
            }
        });
        return list;
    }

    //区域管理处理
    const getTree = (id = 1, orgId = '') => {
        let data = {};
        data.id = id;
        data.type = 'tree';
        data.depth = 1;
        post('/cfg.php?controller=confZoneManage&action=showZoneTree', data).then((res) => {
            let list = [];
            list.push(iconTreeList(res));
            setTreelist(list);
            let org_id = orgId ? orgId : res.id;
            setZoneId(org_id);
            let keys = [];
            keys.push(org_id)
            setSelectedKey(keys);
            formTree(org_id);
            setIncID(incID + 1);
        }).catch(() => {
            console.log('mistake')
        })
    }

    //所属区域处理
    const formTree = (id = 1) => {
        // let page = pagestart != ''?pagestart:startVal;
        let data = {};
        data.id = id;
        data.type = zoneType;
        post('/cfg.php?controller=confZoneManage&action=showZoneTree', data).then((res) => {
            let isLeaf = true;
            if (res.leaf == 'N') {
                isLeaf = false;
            }
            const treeInfoData = [
                {
                    id: res.id,
                    pId: res.gpid,
                    value: res.id,
                    title: res.name,
                    isLeaf: isLeaf,
                },
            ]
            setTreeData(treeInfoData);
        }).catch(() => {
            console.log('mistake')
        })
    }

    //区域管理侧边展开
    const onExpand = (expandedkeysValue) => {
        setTreelistKey(expandedkeysValue);
    }

    // 地址规划侧边点击id处理
    const onSelectLeft = (selectedKeys, info) => {
        setZoneId(selectedKeys[0]);//更新选中地址id
        setSelectedKey(selectedKeys);
        formTree(selectedKeys[0]);
        setIncID(incID + 1);
    };

    //判断是否弹出添加model
    const getModal = (status, op) => {
        setop(op)
        if (status == 1) {
            setModalStatus(true);
        } else {
            setModalStatus(false);
            setNetaddrVal();
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
            message.error(language('project.sysconf.addrplan.choiceregion'));
            return false;
        }
        let tVal = treeValue.split('/');
        //判断选中地址名称
        if (tVal.length < 1) {
            message.error(language('project.sysconf.addrplan.choiceregion'));
            return false;
        }
        let data = {};
        data.op = op;
        data.id = info.id;
        data.maskSize = sliderValue;
        data.netaddr = netaddrVal;//区域编号
        data.notes = info.notes;
        data.zoneID = treekey[treekey.length - 1];//上级部门ID
        data.zone = tVal[tVal.length - 1];//上级部门名称
        data.gpZoneIDPath = treekey.join('.');//上级部门id 路径
        post('/cfg.php?controller=confIPAddrManage&action=setPlanIPNetAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            getModal(2)
            setTreeValue('');
            setTreekey([]);
            setIncID(incID + 1);
        }).catch(() => {
            console.log('mistake')
        })

    }

    //删除数据
    const delList = (selectedRowKeys) => {
        // let id = record.id;//单个删除id
        let data = {};
        data.ids = selectedRowKeys.join(',');
        post('/cfg.php?controller=confIPAddrManage&action=delIPNetAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            setIncID(incID + 1);
        }).catch(() => {
            console.log('mistake')
        })

    }

    //编辑
    const mod = (obj, op) => {
        setTreeValue(obj.gpZonePath);//区域地址名称
        let key = obj.gpZoneIDPath.split('.');
        setTreekey(key);//区域地址key
        setNetaddrVal(obj.netaddr);//netaddrVal
        // setSliderValue(obj.maskSize)
        onChangeSlider(obj.maskSize, obj.netaddr);
        let initialValues = obj;
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
                wrapClassName: 'addrplanmodalupload',
                title: language('project.title'),
                content: res.msg,
                okText: language('project.determine'),
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
            if (!item.importStatus) {
                return (
                    <ProForm.Group style={{ width: "100%" }}>
                        <ProFormSelect
                            width="200px"
                            options={info}
                            name={item.dataIndex}
                            initialValue={importFieldsList.indexOf(item.title) == -1 ? '' : importFieldsList.indexOf(item.title) + '&&' + item.title}
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
        post('/cfg.php?controller=confIPAddrManage&action=importIPNetAddr', data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(res.msg);
            getCloseImport();
            setIncID(incID + 1);
        }).catch(() => {
            console.log('mistake')
        })
    }

    /* 导出功能 */
    const exportFunction = () => {
        fileDown('/cfg.php?controller=confIPAddrManage&action=exportIPNetAddr').then((res, b, c) => {
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
                title={language('project.sysconf.syszone.treelist')}
                cardHeight={clientHeight + 182}
                leftContent={
                    <Tree
                        style={{ height: clientHeight + 100, overflow: 'auto' }}
                        className='addrplanLeftTree'
                        onExpand={onExpand}
                        expandedKeys={treelistKey}
                        showIcon
                        defaultExpandAll
                        selectedKeys={selectedKey}
                        onSelect={onSelectLeft}
                        treeData={treelist}
                        fieldNames={{
                            title: 'name',
                            key: 'id'
                        }}
                    />
                }
                rightContent={
                    <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} uploadButton={uploadButton} uploadClick={uploadClick} downloadButton={downloadButton} downloadClick={downloadClick} />
                } />
            <ModalForm {...modalFormLayout}
                className='addrplanborder'
                formRef={formRef}
                title={op == 'add' ? language('project.sysconf.addrplan.newplan') : language('project.sysconf.addrplan.modplan')}
                visible={modalStatus} autoFocusFirstInput
                modalProps={{
                    maskClosable: false,
                    onCancel: () => {
                        getModal(2)
                    },
                }} submitTimeout={2000} onFinish={async (values) => {
                    save(values);
                }}>
                <ProFormText hidden={true} type="hidden" name="id" label="IP" />
                <ProFormText hidden={true} name="op" label={language('project.sysconf.syszone.opcode')} initialValue={op} />
                <ProFormText name="gpname" label={language('project.sysconf.addrplan.area')}>
                    <TreeSelect
                        treeDataSimpleMode
                        disabled={op == 'add' ? false : true}
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


                <ProFormText
                    rules={[
                        {
                            required: true,
                            pattern: regMacList.ip.regex,
                            message: regMacList.ip.alertText,
                        },
                    ]}
                    name="netaddr" label={language('project.sysconf.addrplan.netaddress')} data-value={sliderValue} onChange={(e) => {
                        setNetaddrVal(e.target.value)
                        onChangeSlider(sliderValue, e.target.value);
                    }} />

                <ProFormText name="maskSize1" label={language('project.sysconf.addrplan.netmask')}>
                    <Row>
                        <Col span={12}>
                            <Slider
                                marks={marks} included={false}
                                min={1}
                                max={24}
                                style={{
                                    width: "170px"
                                }}
                                data-value={netaddrVal}
                                onChange={(newValue) => {
                                    onChangeSlider(newValue, netaddrVal);
                                }}
                                value={typeof sliderValue === 'number' ? sliderValue : 0}
                            />
                        </Col>
                        <Col span={4}>
                            <InputNumber
                                controls={false}
                                min={1}
                                max={20}
                                defaultValue={16}
                                style={{
                                    textAlign: 'center',
                                    marginLeft: "73px",
                                    width: "40px"
                                }}
                                data-value={netaddrVal}
                                value={sliderValue}
                                onChange={(newValue) => {
                                    onChangeSlider(newValue, netaddrVal);
                                }}
                            />
                        </Col>
                    </Row>
                </ProFormText >
                <ProFormText name="startIPAddr" label={language('project.sysconf.addrplan.startaddress')}>
                    <Space size={[7, 6]} >
                        <Input style={{ width: "44px", height: 32, lineHeight: 32, padding: 1, textAlign: 'center', }} value={startIp[0]} disabled />.<Input style={{ width: "44px", height: 32, lineHeight: 32, padding: 1, textAlign: 'center', }} value={startIp[1]} disabled />.<Input style={{ width: "44px", height: 32, lineHeight: 32, padding: 1, textAlign: 'center', }} value={startIp[2]} disabled />.<Input style={{ width: "44px", height: 32, lineHeight: 32, padding: 1, textAlign: 'center', }} value={startIp[3]} disabled />
                    </Space>
                </ ProFormText>
                <ProFormText name="endIPAddr" label={language('project.sysconf.addrplan.endaddress')}>
                    <Space size={[7, 6]}>
                        <Input style={{ width: "44px", height: 32, lineHeight: 32, padding: 1, textAlign: 'center', }} value={endIp[0]} disabled />.<Input style={{ width: "44px", height: 32, lineHeight: 32, padding: 1, textAlign: 'center', }} value={endIp[1]} disabled />.<Input style={{ width: "44px", height: 32, lineHeight: 32, padding: 1, textAlign: 'center', }} value={endIp[2]} disabled />.<Input style={{ width: "44px", height: 32, lineHeight: 32, padding: 1, textAlign: 'center', }} value={endIp[3]} disabled />
                    </Space>
                </ProFormText>
                <NotesText  width="xl" name="notes" label={language('project.remark')} required={false} />
            </ModalForm>
            <ModalForm {...modalFormLayout}
                className='fileaddrplanmodal'
                formRef={formRef}
                title={language('project.import')}
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
                        <ProFormText tooltip={language('project.sysconf.addrplan.fileformatcsv')} label={language('project.sysconf.addrplan.import')} >
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
                                    {language('project.sysconf.addrplan.importfile')}
                                </Button>
                            </Uploadd>
                        </ProFormText>
                        <ProFormRadio.Group initialValue={fileCode}
                            onChange={(e) => {
                                setFileCode(e.target.value);
                            }}
                            label={language('project.filecode')}
                            name='read'
                            options={[
                                { label: language('project.utf8'), value: 'utf-8' },
                                { label: language('project.gbk'), value: 'gbk' }
                            ]}
                        />
                    </>
                    :
                    <ProForm.Group style={{ width: "100%" }}>
                        <div style={{ width: '200px', marginBottom: '12px' }}>
                            {language('project.importfilefields')}
                        </div>
                        <div style={{ width: '200px', marginBottom: '12px' }}>
                            {language('project.mappingfields')}
                        </div>
                    </ProForm.Group>

                }
                {ifImport ? '' : getImportFields()}
            </ModalForm>
        </>
    );
};

import React, { useRef, useState, useEffect } from 'react';
import { history } from 'umi'
import { Button, Input, message, Modal, TreeSelect, Switch, Tooltip, Space, Tag, Popconfirm, Divider, Col } from 'antd';
import { post } from '@/services/https';
import { ExclamationCircleOutlined, EditFilled, ExportOutlined, DeleteFilled, SaveFilled, CloseCircleFilled, CheckCircleFilled, ConsoleSqlOutlined } from '@ant-design/icons';
import ProForm, { DrawerForm, ModalForm, ProFormText, ProFormTextArea, ProFormSelect } from '@ant-design/pro-form';
import { EditableProTable, ProDescriptions } from '@ant-design/pro-components';
import { AiFillEye } from "react-icons/ai";
import { Seal } from '@icon-park/react';
import { language } from '@/utils/language';
import '@/utils/index.less';
import './index.less';
import WebUploadr from '@/components/Module/webUploadr';
import { TableLayout, LeftTree, CardModal } from '@/components';
const { ProtableModule } = TableLayout;

const { Search } = Input;
let H = document.body.clientHeight - 285
var clientHeight = H
export default (props) => {

	const showAutoLoginInfo = (record) => {
		let id = record.id;
		post('/cfg.php?controller=confDevice&action=showAutoLoginInfo', { id: id }).then((res) => {
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
	const columns = [
		{
			title: language('project.devid'),
			dataIndex: 'devid',
			align: 'center',
			ellipsis: true,
			width: 200,
		},
		{
			title: language('mconfig.agtpolicy.status'),
			dataIndex: 'enable',
			align: 'center',
			fixed: 'left',
			ellipsis: true,
			width: 80,
			filters: true,
			filterMultiple: false,
			valueEnum: {
				Y: { text: language('project.open') },
				N: { text: language('project.close') },
			},
			render: (text, record, index) => {
				let disabled = false;
				let checked = true;
				if (record.enable == 'N') {
					checked = false;
				}
				return (<
					Switch checkedChildren={language('project.open')}
					unCheckedChildren={language('project.close')}
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
			title: language('cfgmngt.devlist.devname'),
			dataIndex: 'name',
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
		{
			title: language('cfgmngt.devlist.devcode'),
			dataIndex: 'device_id',
			align: 'center',
			width: 140,
			ellipsis: true,
		},
		{
			title: language('cfgmngt.devlist.devtype'),
			dataIndex: 'type',
			align: 'center',
			width: 150,
			ellipsis: true,
		},
		{
			title: language('cfgmngt.devlist.certificatenumber'),
			dataIndex: 'certsn',
			align: 'center',
			width: 150,
			ellipsis: true,
		},
		{
			title: language('cfgmngt.devlist.olstu'),
			dataIndex: 'onstate',
			align: 'center',
			width: 100,
			ellipsis: true,
			filters: [
				{ text: language('cfgmngt.devlist.online'), value: 1 },
				{ text: language('cfgmngt.devlist.offline'), value: 0 },
			],
			filterMultiple: false,
			render: (text, record, index) => {
				let color = 'success';
				let name = language('cfgmngt.devlist.online');
				if (record.onstate != 1) {
					color = 'default';
					name = language('cfgmngt.devlist.offline');
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
			title: language('cfgmngt.devlist.resstatus'),
			dataIndex: 'regstate',
			align: 'center',
			width: 100,
			ellipsis: true,
			filters: [
				{ text: language('cfgmngt.devlist.registered'), value: 2 },
				{ text: language('cfgmngt.devlist.notloggedoff'), value: 0 },
				{ text: language('cfgmngt.devlist.stayexamine'), value: 1 },
			],
			filterMultiple: false,
			render: (text, record, index) => {
				let color = 'success';
				let name = language('cfgmngt.devlist.stayexamine');
				if (record.regstate == 0) {
					color = 'default';
					name = language('cfgmngt.devlist.notloggedoff');
				} else if (record.regstate == 2) {
					color = 'success';
					name = language('cfgmngt.devlist.registered');
				} else {
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
			title: language('cfgmngt.devlist.certifcationstatus'),
			dataIndex: 'authstate',
			align: 'center',
			width: 100,
			valueType: 'select',
			ellipsis: true,
			filters: [
				{ text: language('project.passed'), value: 1 },
				{ text: language('project.fail'), value: 0 },
			],
			filterMultiple: false,
			valueEnum: {
				1: { text: language('project.passed'), status: 'Success' },
				0: { text: language('project.fail'), status: 'Error' },
			},
		},
		{
			title: language('cfgmngt.devlist.devmod'),
			dataIndex: 'model',
			align: 'center',
			width: 150,
			ellipsis: true,
		},
		{
			title: language('cfgmngt.devlist.devvsn'),
			dataIndex: 'soft_version',
			align: 'center',
			width: 210,
			ellipsis: true,
		},
		{
			title: language('cfgmngt.devlist.fromzone'),
			dataIndex: 'zone',
			align: 'center',
			width: 80,
			ellipsis: true,
		},
		{
			title: language('cfgmngt.devlist.devdspn'),
			dataIndex: 'memo',
			align: 'center',
			width: 210,
			ellipsis: true,
		},
		{
			disable: true,
			title: language('project.operate'),
			align: 'center',
			fixed: 'right',
			width: 120,
			valueType: 'option',
			render: (text, record, _, action) => [
				<a key="cancelsa"
					target="_blank"
					onClick={() => {
						showCancellationConfirm(record)
					}}>
					<Tooltip title={language('cfgmngt.devlist.cancellation')} >
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
						history.push("/cfgmngt/devlist/" + record.device_id);
					}}>
					<Tooltip title={language('project.see')} >
						<AiFillEye style={{ width: '16px', fontSize: '16px' }} size={16} />
					</Tooltip>
				</a>,
			],
		},
	];

	//设备类型
	const devTypeList = [
		{
			label: language('dmc.cfgmngt.devlist.detector'),
			value: language('dmc.cfgmngt.devlist.detector'),
		},
	];

	const formRef = useRef();
	const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
	const [op, setop] = useState('add');//选中id数组
	const [treeValue, setTreeValue] = useState('');
	const [zoneId, setZoneId] = useState();//侧边栏选中地址id
	const [zoneIdVal, setZoneIdVal] = useState();//添加区域id
	const [zoneNameVal, setZoneNameVal] = useState();//添加区域名称
	const [treekey, setTreekey] = useState([]);
	const [treeData, setTreeData] = useState([]);
	const zoneType = 'zone';
	const [initialValue, setInitialValue] = useState([]);
	const { confirm } = Modal;

	//上传
	const isAuto = true;
	const upbutext = language('project.upload');
	const maxSize = 300;
	const accept = '.tgz, .tar, .zip';
	const upurl = '/cfg.php?controller=confDevice&action=certsn';
	const isShowUploadList = false;
	const maxCount = 1;
	const isUpsuccess = true;
	/* 导入成功文件返回 */
	const onSuccess = (res) => {
		if (res.success) {
			formRef.current.setFieldsValue({ certsn: res.certsn })
		} else {
			Modal.warning({
				className: 'dmcdevwarningmd',
				title: language('project.title'),
				content: res.msg,
				okText: language('project.determine'),
			})
		}
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
			setIncID(incID + 1);
		}, 100);
	}

	/** table组件 start */
	const rowKey = (record => record.device_id);//列表唯一值
	const tableHeight = clientHeight - 10;//列表高度
	const tableKey = 'dmcdevc';//table 定义的key
	const rowSelection = true;//是否开启多选框
	const addButton = true; //增加按钮  与 addClick 方法 组合使用
	const delButton = true; //删除按钮 与 delClick 方法 组合使用
	const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
	const columnvalue = 'dmcdevccolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
	const apishowurl = '/cfg.php?controller=confDevice&action=showList';//接口路径
	const [queryVal, setQueryVal] = useState();//首个搜索框的值
	let searchVal = { queryVal: queryVal, queryType: 'fuzzy', zoneID: zoneId };//顶部搜索框值 传入接口

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
				placeholder={language('cfgmngt.devlist.tablesearch')}
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
		let data = {};
		data.zone_id = zoneIdVal;
		data.zone = zoneNameVal;
		data.memo = values.memo;
		data.name = values.name;
		data.device_id = values.device_id;
		data.certsn = values.certsn;
		data.type = values.type;
		data.mem_total = values.mem_total;
		data.cpu_info = '';
		if (values?.cpu_info?.length) {
			values?.cpu_info.map((item) => {
				delete item.id;
				delete item.index;
			})
			data.cpu_info = JSON.stringify(values.cpu_info);
		}
		data.disk_info = '';
		if (values?.disk_info?.length) {
			values?.disk_info.map((item) => {
				delete item.id;
				delete item.index;
			})
			data.disk_info = JSON.stringify(values.disk_info);
		}
		data.interface = '';
		if (values?.interface?.length) {
			values?.interface.map((item) => {
				delete item.id;
				delete item.index;
			})
			data.interface = JSON.stringify(values.interface);
		}
		let url = 'add';
		if (op == 'mod') {
			data.device_old_id = values.device_old_id;
			url = 'set';
		}
		post('/cfg.php?controller=confDevice&action=' + url, data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			getModal(2);
			incAdd();
			message.success(res.msg);
		}).catch(() => {
			console.log('mistake')
		})
	}

	//注销处理
	const cancellation = (record) => {
		let data = {};
		data.device_id = record.device_id;
		data.name = record.name;
		data.zone = record.zone;
		post('/cfg.php?controller=confDevice&action=unregister', data).then((res) => {
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
		let ids = JSON.stringify(selectedRowKeys);
		post('/cfg.php?controller=confDevice&action=del', { ids: ids }).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			incAdd()
		}).catch(() => {
			console.log('mistake')
		})
	}

	//启用禁用
	const statusSave = (record, checked) => {
		let enable = 'N';
		if (checked) {
			enable = 'Y';
		}
		let device_id = record.device_id;
		post('/cfg.php?controller=confDevice&action=set', { device_id: device_id, enable: enable }).then((res) => {
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

	//生成n位数字字母混合字符串
	const generateMixed = (n) => {
		var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
			'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
			'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
			'a', 'b', 'c', 'd', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',
			'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
		var res = ""
		for (var i = 0; i < n; i++) {
			var id = Math.floor(Math.random() * 36);
			res += chars[id];
		}
		return res;
	}

	//编辑接口
	const mod = (obj) => {
		setTreeValue(obj.gpZonePath);
		let key = obj.gpZoneIDPath.split('.');
		let val = obj.gpZonePath.split('/');
		let selKyeNum = key[key.length - 1];
		let selValNum = val[val.length - 1];
		setZoneIdVal(selKyeNum);
		setZoneNameVal(selValNum);
		setTreekey(key);
		obj.device_old_id = obj.device_id;
		obj.cpu_info.map((item, index) => {
			item.id = generateMixed(7);
		})
		obj.disk_info.map((item, index) => {
			item.id = generateMixed(7);
		})
		obj.interface.map((item, index) => {
			item.id = generateMixed(7);
		})

		let initialValues = obj;
		setInitialValue(initialValues);
		getModal(1, 'mod');
		setTimeout(function () {
			formRef.current.setFieldsValue(initialValues)
		}, 100)
	}

	//注销功能
	const showCancellationConfirm = (record) => {
		confirm({
			className: 'dmcdevconfirmmodal',
			icon: <ExclamationCircleOutlined />,
			title: language('cfgmngt.devlist.devcel'),
			content: language('cfgmngt.devlist.cancelcon'),
			okText: language('cfgmngt.devlist.ok'),
			cancelText: language('cfgmngt.devlist.cancel'),
			onOk() {
				cancellation(record);
			}
		});
	};

	//可编辑表格 删除功能
	const renderRemove = (text, record, field) => (
		<Popconfirm onConfirm={() => {
			const tableDataSource = formRef.current.getFieldsValue([field]);
			if(field  == 'cpu_info'){
				formRef.current.setFieldsValue(
					{ cpu_info: tableDataSource[field].filter((item) => item.id != record.id), }
				)
			}else if(field  == 'disk_info'){
				formRef.current.setFieldsValue(
					{ disk_info: tableDataSource[field].filter((item) => item.id != record.id), }
				)
			}else{
				formRef.current.setFieldsValue(
					{ interface: tableDataSource[field].filter((item) => item.id != record.id), }
				)
			}
		}} key="popconfirm"
			title={language('project.delconfirm')}
			okButtonProps={{
			}} okText={language('project.yes')} cancelText={language('project.no')}>
			<a>{text}</a>
		</Popconfirm>
	);

	//cpu
	const [cpuEditableRowKeys, setCpuEditableRowKeys] = useState();//每行编辑的id
	//添加cpu
	const cpuColumns = [
		{
			title: language('cfgmngt.devlist.cpuid'),
			dataIndex: 'physical_id',
			width: 90,
			align: 'left',
			ellipsis: true,
		}, {
			title: language('cfgmngt.devlist.numbercores'),
			dataIndex: 'core',
			width: 80,
			align: 'left',
			ellipsis: true,
		}, {
			title: language('cfgmngt.devlist.basicfrequency'),
			dataIndex: 'clock',
			width: 60,
			align: 'left',
			ellipsis: true,
		},
		{
			title: language('project.mconfig.operate'),
			valueType: 'option',
			ellipsis: true,
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
					{renderRemove(<DeleteFilled style={{ color: 'red' }} />, record, 'cpu_info')}
				</>
			]
		},
	];

	const [diskEditableRowKeys, setDiskEditableRowKeys] = useState();//每行编辑的id
	//添加磁盘信息
	const diskColumns = [
		{
			title: language('cfgmngt.devlist.harddisksize'),
			dataIndex: 'size',
			width: 90,
			align: 'left',
			ellipsis: true,
		}, {
			title: language('cfgmngt.devlist.harddiskserialnum'),
			dataIndex: 'serial',
			width: 110,
			align: 'left',
			ellipsis: true,
		},
		{
			title: language('project.mconfig.operate'),
			valueType: 'option',
			width: '25%',
			ellipsis: true,
			align: 'center',
			render: (text, record, _, action) => [
				<>
					<a key="editable" onClick={() => {
						var _a;
						(_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id);
					}}>
						<EditFilled />
					</a>
					{renderRemove(<DeleteFilled style={{ color: 'red' }} />, record, 'disk_info')}
				</>
			]
		},
	];

	const [apiEditableRowKeys, setApiEditableRowKeys] = useState();//每行编辑的id
	//接口信息
	const apiColumns = [
		{
			title: language('cfgmngt.devlist.apiip'),
			dataIndex: 'ip',
			width: 110,
			align: 'left',
			ellipsis: true,
		}, {
			title: language('cfgmngt.devlist.subnetmask'),
			dataIndex: 'netmask',
			width: 90,
			align: 'left',
			ellipsis: true,
		}, {
			title: language('cfgmngt.devlist.defaultgateway'),
			dataIndex: 'gateway',
			width: 110,
			align: 'left',
			ellipsis: true,
		}, {
			title: language('cfgmngt.devlist.macaddress'),
			dataIndex: 'mac',
			width: 120,
			align: 'left',
			ellipsis: true,
		}, {
			title: language('cfgmngt.devlist.managementport'),
			dataIndex: 'manage',
			width: 80,
			ellipsis: true,
			align: 'center',
			valueEnum:{
				true:{text:'是'},
				false:{text:'否'}
			},
			render: (text, record) => {
				if (record.manage) {
					return (<CheckCircleFilled style={{ color: '#12C189', size: 16 }} />)
				} else {
					return (<CloseCircleFilled style={{ color: '#F74852', size: 16 }} />)
				}
			}
		},
		{
			title: language('project.mconfig.operate'),
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
					{renderRemove(<DeleteFilled style={{ color: 'red' }} />, record, 'interface')}
				</>
			]
		},
	];

	return (
		<>
			<CardModal
				title={language('project.sysconf.syszone.treelist')}
				cardHeight={clientHeight + 182}
				leftContent={<LeftTree getTree={getTree} onSelectLeft={onSelectLeft} treeInc={treeInc} treeUrl={treeUrl} leftTreeData={leftTreeData} />}
				rightContent={<ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} onlyOneReq={true} />}
			/>
			{/* //添加编辑弹出框 */}
			<ModalForm
				{...{
					layout: "center",
					width: "757px",
					labelCol: {
						xs: { span: 8 },
					}
				}}
				className='dmcdevicesborder'
				title={op == 'add' ? language('project.add') : language('project.alter')}
				visible={modalStatus} autoFocusFirstInput
				modalProps={{
					maskClosable: false,
					onCancel: () => {
						getModal(2)
					},
				}}
				onVisibleChange={setModalStatus}
				layout="vertical"
				formRef={formRef}
				submitTimeout={2000} onFinish={async (values) => {
					save(values);
					// return true;
				}}>
				<ProFormText hidden={true} type="hidden" name="id" label="IP" />
				<ProFormText name="device_old_id" hidden={true}  disabled />

				<ProForm.Group>
					<ProFormText name="name" width="310px" label={language('cfgmngt.devlist.equipmentname')} />
					<ProFormText name="zone_id" label={language('cfgmngt.devlist.fromzone')} >
						<TreeSelect style={{ width: 310 }}
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
				</ProForm.Group>

				<ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
					<ProFormText width="310px" name="device_id" label={language('cfgmngt.devlist.devnumber')} disabled={op  == 'add' ? false : initialValue.regstate == '0' ? false : true} />
					<ProFormSelect
						width="310px"
						options={devTypeList}
						name='type'
						fieldProps={{
							allowClear: false,
						}}
						label={language('cfgmngt.devlist.devtype')}
					/>
				</ProForm.Group>

				<ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
					<ProFormText width='539px' name='certsn' label={language('cfgmngt.devlist.certificatenumber')} />
					<ProFormText label={' '}>
						<WebUploadr isUpsuccess={isUpsuccess} isAuto={isAuto} upbutext={upbutext} maxSize={maxSize} accept={accept} upurl={upurl} onSuccess={onSuccess} isShowUploadList={isShowUploadList} maxCount={maxCount} />
					</ProFormText>
				</ProForm.Group>

				<ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
					<ProFormText width="310px" name="memo" label={language('cfgmngt.devlist.devdspn')} />
					<ProFormText width="310px" name="mem_total" label={language('cfgmngt.devlist.memorysize')} />
				</ProForm.Group>

				<ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
					<ProFormText width="310px" label={language('cfgmngt.devlist.cpuinfo')} >
						<div style={{ width: '310px' }}>
							<EditableProTable
								key='cpu_info'
								scroll={{ y: 170 }}
								size="small"
								name="cpu_info"
								rowKey="id"
								toolBarRender={false}
								columns={cpuColumns}
								className='dmcdeveditable'
								recordCreatorProps={{
									creatorButtonText: language('cfgmngt.devlist.add'),
									position: 'button',
									record: () => ({
										id: generateMixed(7),
									}),
								}} editable={{
									type: 'single',
									cpuEditableRowKeys,
									onChange: setCpuEditableRowKeys,
									actionRender: (row, config, defaultDom) => {
										return [
											defaultDom.save,
											defaultDom.delete,
										];
									},
									saveText: <SaveFilled />,
									deleteText: <DeleteFilled style={{ color: 'red' }} />,
								}} />
						</div>
					</ProFormText>
					<ProFormText width="310px" label={language('cfgmngt.devlist.diskinfo')}  >
						<div style={{ width: '310px' }}>
							<EditableProTable
								key='disk_info'
								scroll={{ y: 170 }}
								size="small"
								name="disk_info"
								rowKey="id"
								toolBarRender={false}
								columns={diskColumns}
								className='dmcdeveditable'
								recordCreatorProps={{
									creatorButtonText: language('cfgmngt.devlist.add'),
									position: 'button',
									record: () => ({
										id: generateMixed(7),
									}),
								}} editable={{
									type: 'single',
									diskEditableRowKeys,
									onChange: setDiskEditableRowKeys,
									actionRender: (row, config, defaultDom) => {
										return [
											defaultDom.save,
											defaultDom.delete,
										];
									},
									saveText: <SaveFilled />,
									deleteText: <DeleteFilled style={{ color: 'red' }} />,
								}} />

						</div>
					</ProFormText>
				</ProForm.Group>

				<div style={{ marginLeft: 29 }}>
					<ProForm.Item width="650px" label={language('cfgmngt.devlist.apiinfo')} >
						<div style={{ width: '650px' }}>
							<EditableProTable
								key='interface'
								scroll={{ y: 170 }}
								size="small"
								name="interface"
								rowKey="id"
								toolBarRender={false}
								columns={apiColumns}
								className='dmcdeveditable'
								recordCreatorProps={{
									creatorButtonText: language('cfgmngt.devlist.add'),
									position: 'button',
									record: () => ({
										id: generateMixed(7),
									}),
								}} editable={{
									type: 'single',
									apiEditableRowKeys,
									onChange: setApiEditableRowKeys,
									actionRender: (row, config, defaultDom) => {
										return [
											defaultDom.save,
											defaultDom.delete,
										];
									},
									saveText: <SaveFilled />,
									deleteText: <DeleteFilled style={{ color: 'red' }} />,
								}} />
						</div>
					</ProForm.Item>
				</div>

			</ModalForm>
		</>
	)

}
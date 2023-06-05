import React, { useRef, useState, useEffect } from 'react';
import { CheckOutlined, CloseCircleOutlined, UnorderedListOutlined, ClusterOutlined, CloseOutlined, SaveFilled } from '@ant-design/icons';
import { ProTable, ProFormDateTimePicker, ProFormSelect, ModalForm, ProFormText, ProFormTextArea, ProDescriptions, ProCard, ProFormRadio, ProFormItem, DrawerForm } from '@ant-design/pro-components';
import { Button, Menu, Input, message, Space, Tag, Tooltip, Divider, Steps, Alert } from 'antd';
import { post, get } from '@/services/https';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { Seal, ViewGridList } from '@icon-park/react';
import { AiFillEye, AiOutlineClockCircle, AiFillInfoCircle } from "react-icons/ai";
import { BsFillCheckCircleFill, BsQuestionCircleFill, BsXCircleFill, BsChevronContract } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import SignatureShow from '@/utils/showSignature';
import '@/utils/index.less';
import './index.less';
import { TableLayout } from '@/components';
const { ProtableModule } = TableLayout;
let H = document.body.clientHeight - 481
var clientHeight = H
const { Search } = Input
const { Step } = Steps;
let expandData = {}
export default (props) => {

	const uploadColumnsSee = [
		{
			title: language('project.assmngt.resapply.zone'), // 所属区域
			dataIndex: 'zone',
			width: 100,
			ellipsis: true,
			importStatus: true,
		},
		{
			title: language('project.assmngt.resapply.organization'), //所属机构
			dataIndex: 'org',
			width: 120,
			ellipsis: true,
			importStatus: true,
		},
		{
			title: language('project.assmngt.resapply.applicant'), // 使用人
			dataIndex: 'user',
			width: 80,
			ellipsis: true,
			importStatus: true,
		},
		{
			title: language('project.resmngt.approval.phone'), // 电话
			dataIndex: 'phone',
			width: 110,
			ellipsis: true,
			importStatus: true,
		},
		{
			title: language('project.assmngt.macaddr'), // MAC地址
			dataIndex: 'macaddr',
			width: 135,
			importStatus: true,
			ellipsis: true,
		},
		{
			keys: 'vlan',
			key: 'vlan',
			title: language('project.assmngt.vlan'),
			dataIndex: 'vlan',
			width: 120,
			importStatus: true,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.resapply.ipaddrress'),
			dataIndex: 'ipstr',
			width: 140,
			readonly: true,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.resapply.purpose'), // 业务用途
			dataIndex: 'buisUsg',
			width: 100,
			ellipsis: true,
			importStatus: true,
		},
		{
			title: language('project.assmngt.assettype'), // 资产类型
			dataIndex: 'assetType',
			width: 110,
			ellipsis: true,
			importStatus: true,
		},
		{
			title: language('project.assmngt.assetmodel'),
			dataIndex: 'assetModel',
			width: 110,
			readonly: true,
			ellipsis: true,
			importStatus: true,
		},
		{
			title: language('project.assmngt.location'),
			dataIndex: 'location',
			width: 120,
			readonly: true,
			ellipsis: true,
			importStatus: true,
		},
	]

	const uploadColumns = [
		{
			title: language('project.assmngt.resapply.zone'), // 所属区域
			dataIndex: 'zone',
			width: 100,
			ellipsis: true,
			importStatus: true,
		},
		{
			title: language('project.assmngt.resapply.organization'), //所属机构
			dataIndex: 'org',
			width: 120,
			ellipsis: true,
			importStatus: true,
		},
		{
			title: language('project.assmngt.resapply.applicant'), // 使用人
			dataIndex: 'user',
			width: 80,
			ellipsis: true,
			importStatus: true,
		},
		{
			title: language('project.resmngt.approval.phone'), // 电话
			dataIndex: 'phone',
			width: 110,
			ellipsis: true,
			importStatus: true,
		},
		{
			title: language('project.assmngt.macaddr'), // MAC地址
			dataIndex: 'macaddr',
			width: 135,
			importStatus: true,
			ellipsis: true,
		},
		{
			keys: 'vlan',
			key: 'vlan',
			title: language('project.assmngt.vlan'),
			dataIndex: 'vlan',
			width: 120,
			importStatus: true,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.resapply.ipaddrress'),
			dataIndex: 'ipstr',
			width: 140,
			readonly: true,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.resapply.purpose'), // 业务用途
			dataIndex: 'buisUsg',
			width: 100,
			ellipsis: true,
			importStatus: true,
		},
		{
			title: language('project.assmngt.assettype'), // 资产类型
			dataIndex: 'assetType',
			width: 110,
			ellipsis: true,
			importStatus: true,
		},
		{
			title: language('project.assmngt.assetmodel'),
			dataIndex: 'assetModel',
			width: 110,
			readonly: true,
			ellipsis: true,
			importStatus: true,
		},
		{
			title: language('project.assmngt.location'),
			dataIndex: 'location',
			width: 120,
			readonly: true,
			ellipsis: true,
			importStatus: true,
		},
	]

	const columnList = [
		{
			title: language('project.assmngt.id'),
			dataIndex: 'id',
			width: 80,
			ellipsis: true,
			hideInTable: true,
		},
		{
			title: language('project.assmngt.approval.workorderstatus'),
			dataIndex: 'orderState',
			width: 100,
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
			title: language('project.assmngt.approval.workorderno'),
			dataIndex: 'orderID',
			width: 140,
			ellipsis: true,
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
			}
		},
		{
			title: language('project.assmngt.resapply.zone'),
			dataIndex: 'zone',
			width: 120,
			ellipsis: true,
		},
		{
			//所属机构暂无内容 key 不对 dataindex
			title: language('project.assmngt.approval.organization'),
			dataIndex: 'org',
			width: 120,
			readonly: true,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.approval.applicant'),
			dataIndex: 'user',
			width: 80,
			readonly: true,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.approval.phone'),
			dataIndex: 'phone',
			width: 110,
			readonly: true,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.macaddr'),
			dataIndex: 'macaddr',
			width: 135,
			readonly: true,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.ipaddr'),
			dataIndex: 'ipstr',
			width: 120,
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
			title: language('project.assmngt.approval.purpose'),
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
			title: language('project.assmngt.approval.applypeople'),
			dataIndex: 'applicant',
			width: 80,
			readonly: true,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.approval.approvalperson'),
			dataIndex: 'approver',
			width: 80,
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
					record.opbutton == 'show' || record.opbutton == 'revoke' ?
						<>
							<a key="editable"
								onClick={() => {
									setRecordFind(record);
									seeModalFrame(record);
								}}>

								<Tooltip title={language('project.see')} >
									<AiFillEye className='seeicon' size={18} style={{ fontSize: '18px' }} />
								</Tooltip>
							</a>
						</>
						: '',
				record.opbutton == 'approve' ? <>
					<a key="examine"
						onClick={() => {
							setRecordFind(record);
							setInitialValue(record);
							if (record.batch == 'Y') {
								showPSignINApply(record, 'batchlist');
							} else {
								getDynamicField('form', 'private', record.buisUsg);
								approvalModalFrame(record);
							}
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
	const formRef1 = useRef();
	const typeName = 'asset_access';
	const [recordFind, setRecordFind] = useState({});
	const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
	const [approvalModalStatus, setApprovalModalStatus] = useState(false);//审批弹出框
	const [seeModalStatus, setSeeModalStatus] = useState(false);//model 查看弹框状态
	const [approvalProcessList, setApprovalProcessList] = useState([]);//审批流程列表数据
	const [approvalList, setApprovalList] = useState([]);//审批预分配列表
	const [dataInfo, setDataInfo] = useState([]);//查看 申请 ip 列表
	const [iPModalStatus, setIPModalStatus] = useState(false);//IP地址选择弹出框
	const [timeShow, setTimeShow] = useState(false);//有效时间隐藏显示
	const [ipSelectList, setIpSelectList] = useState([]);//分配ip 选中内容
	const [treelist, setTreelist] = useState([]);//审批子网回显
	const [initialValue, setInitialValue] = useState([]);//默认查看头部列表数据
	const [ipValidType, setIpValidType] = useState('forever');//ip选择单选多选模式
	const [ipValidTime, setIpValidTime] = useState();//时间处理
	const [iPAddrList, setIPAddrList] = useState([]);//掩码IP地址按钮数据
	const [subNetList, setSubNetList] = useState([]);//添加下拉修改子网地址
	const assetflowsp = 'ASSETFLOW_SP';
	const [columns, setColumns] = useState(columnList);//table 头部数据
	const [saFileList, setSaFileList] = useState([]);
	const [batchTableList, setBatchTableList] = useState([]);
	const examineRef = useRef()
	const [examineStatus, setExamineStatus] = useState(false);

	const [dynamicFieldList, setDynamicFieldList] = useState([]);//动态字段列表
	let dynamicFieldListLet = [];
	const [privateField, setPrivateField] = useState([]);//私有动态字段列表
	let privateFieldList = [];//私有动态字段列表

	//审批操作
	const showExamineForm = (status) => {
		if (status == 'open') {
			setExamineStatus(true)
		} else {
			setBatchTableList([]);
			examineRef.current.resetFields();
			setExamineStatus(false)
		}
	}

	const examinSearchDiv = () => {
		return (
			<Space>
				<Search
					allowClear
					placeholder={language('project.search')}
					style={{ width: 160 }}
					onSearch={(queryVal) => {
					}}
				/>
			</Space>
		)
	}

	/** table组件 start */
	const rowKey = (record => record.id);//列表唯一值
	const tableHeight = clientHeight;//列表高度
	const tableKey = 'allocationapproval';//table 定义的key
	const rowSelection = true;//是否开启多选框
	const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
	const columnvalue = 'allocationapprovalcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
	const apishowurl = '/cfg.php?controller=confAssetManage&action=showSignINApply';//接口路径
	const [queryVal, setQueryVal] = useState();//首个搜索框的值
	let searchVal = { queryVal: queryVal, queryType: 'fuzzy', showType: 'approval', flow: typeName, assetflow: assetflowsp };//顶部搜索框值 传入接口

	const onExpandUrl = '/cfg.php?controller=confAssetManage&action=showSignINSingleApply';
	const expandAble = {
		indentSize: 30,
		expandIconAsCell: false,
		expandIconColumnIndex: 4,
		expandIcon: ({ expanded, onExpand, record }) => {
			return record.batch == 'Y' ? expanded ? <Tooltip title={language('illevent.stow')}><BsChevronContract className='netipicon' style={{ fontSize: '18px', color: '#FF7429', marginBottom: '-4px' }} onClick={e => {
				onExpand(record, e);
			}} /></Tooltip> : (<Tooltip title={language('illevent.expand')}><ViewGridList className='netipicon' theme='outline' size='18' fill='#FF7429' onClick={e => {
				expandData.id = record.id
				expandData.orderID = record.orderID
				expandData.showFirst = 'N'
				onExpand(record, e);
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
				placeholder={language('project.assmngt.approval.dissearch')}
				style={{ width: 200 }}
				onSearch={(queryVal) => {
					setQueryVal(queryVal);
					setIncID(incID + 1);
				}}
			/>
		)
	}

	/** table组件 end */

	// IP地址申请工单子网回显列表
	const getMenu = (type = false) => {
		let data = {};
		data.zoneID = initialValue.zoneID;//管理员所属区域id    
		data.orgID = initialValue.orgID;//管理员所属区域id    
		data.vlan = initialValue.vlan;//vlan
		post('/cfg.php?controller=confIPAddrManage&action=showAllocSubnet', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			if (type) {
				let info = [];
				res.data.map((item) => {
					let confres = [];
					confres.label = item.subNetaddr;
					confres.value = item.subNetaddr;
					info.push(confres)
				})
				setSubNetList(info)
			} else {
				let e = [];
				res.data.map((item) => {
					let icon = <UnorderedListOutlined />;
					e.push({ key: item.id, label: item.subNetaddr + '/' + (item.maskSize), icon: icon, subNetaddr: item.subNetaddr })
				})
				setTreelist(e);
				getBottonList(res.data[0].id)
			}
		}).catch(() => {
			console.log('mistake')
		})
	}
	// IP地址申请工单子网侧边点击id处理
	const onSelectLeft = (selectedKeys, info) => {
		getBottonList(selectedKeys);
	};

	useEffect(() => {
		getDynamicField();
	}, [])

	/**
 * 获取动态字段列表 attribute  private 私有  public 公有
 * type   table 表头  form form 表单字段   formtable 导入内容字段
 * */
	const getDynamicField = (type = 'table', attribute = 'public', buisusg = '') => {
		let data = {};
		data.filterType = 'dynamic';
		data.modtype = 'asset';
		data.attribute = attribute;
		data.buisusg = buisusg;
		post('/cfg.php?controller=confResField&action=showResFieldList', data).then((res) => {
			if (type == 'table') {
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
						columnsList.splice(-4, 0, info);
					})
					setColumns([...columnsList]);
					setIncID(incID + 1);
				}
			} else {
				let arr = dynamicFieldList.length >= 1 ? dynamicFieldList : dynamicFieldListLet;
				setPrivateField(arr.concat(res.data));
				privateFieldList = arr.concat(res.data);
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
			allSeeModal();
			setIncID(incID + 1);
		}).catch(() => {
			console.log('mistake')
		})
	}

	//审批弹出框页面数据赋值
	const approvalModalFrame = (record) => {
		getApporvalModal(1);
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
		setPrivateField([]);
		privateFieldList = [];
		getApporvalModal(2);
	}


	//查看弹出框页面数据赋值
	const seeModalFrame = (record) => {
		let data = {};
		data.id = record.id;
		post('/cfg.php?controller=confAssetManage&action=showSignINFlow', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			setInitialValue(res.data.applyInfo);
			setDataInfo(res.data.allocInfo);
			setApprovalProcessList(res.data.flowInfo);
			if (record.batch == 'Y') {
				post('/cfg.php?controller=confAssetManage&action=showSignINSingleApply', data).then((res) => {
					setSaFileList(res.data ? res.data : []);
					getSeeModal(1);
				}).catch(() => {
					console.log('mistake')
				})
			} else {
				getDynamicField('form', 'private', record.buisUsg);
				getSeeModal(1);
			}
			getSeeModal(1);
		}).catch(() => {
			console.log('mistake')
		})
	}

	//拼接审核装填列表标题名称
	const titleNameStep = (state) => {
		switch (state) {
			case ('submit'):
				return language('project.assmngt.subbmit');
			case ('approval'):
				return language('project.assmngt.approval');
			default:
				return language('project.assmngt.unapproval');
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
							<Step title={language('project.assmngt.unapproval')}
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
											{item.result === 'approved' ? language('project.assmngt.approvalinstructions') : language('project.assmngt.reasonfrorejection')}
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
		setPrivateField([]);
		privateFieldList = [];
		getSeeModal(2);
	}

	//判断是否弹出添加model
	const getModal = (status) => {
		if (status == 1) {
			setModalStatus(true);
		} else {
			formRef1.current.resetFields();
			setModalStatus(false);
		}
	}

	//审批ip判断是否弹出添加model
	const getMaskModal = (status) => {
		if (status == 1) {
			setIPModalStatus(true);
		} else {
			setIPModalStatus(false);
		}
	}

	//通用ip审批弹框关闭
	const allMaskModal = () => {
		getMaskModal(2);
		//清除选中IP地址
		setIpSelectList([]);
	}

	//操作关闭后清空数据
	const operationOffEmpty = () => {
		//清空弹框上部列表信息
		setInitialValue([]);
	}

	//审批通过
	const approvalAdopt = (value = '', type = '') => {
		let data = {};
		let obj = '';
		if (type == 'batch') {
			obj = examineRef.current.getFieldsValue(['reason']);
			data.batch = 'Y';
			data.list = JSON.stringify(batchTableList);
		} else {
			obj = formRef.current.getFieldsValue(['reason', 'vlan']);
		}
		data.id = initialValue.id;
		data.orderID = initialValue.orderID;
		data.notes = obj.reason;
		data.assetflow = assetflowsp;
		post('/cfg.php?controller=confAssetManage&action=agreeSignINApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			if (type == 'batch') {
				showExamineForm('close');
			} else {
				allApporvalModal();
			}
			setIncID(incID + 1);
		}).catch(() => {
			console.log('mistake')
		})
	}

	//审批驳回
	const approvalReject = (type) => {
		let data = {};
		let obj = '';
		if (type == 'batch') {
			data.batch = 'Y';
			obj = examineRef.current.getFieldsValue(['reason']);
		} else {
			obj = formRef.current.getFieldsValue(['reason']);
		}
		if (!obj) {
			message.error(language('project.notes'));
			return false;
		}
		data.orderID = initialValue.orderID;
		data.notes = obj.reason;
		data.assetflow = assetflowsp;
		post('/cfg.php?controller=confAssetManage&action=rejectSignINApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			if (type == 'batch') {
				showExamineForm('close');
			} else {
				allApporvalModal();
			}
			setIncID(incID + 1);
		}).catch(() => {
			console.log('mistake')
		})
	}

	//底部掩码数据列表
	const getBottonList = (subnetID = 0, record = '') => {
		let data = {};
		data.subnetID = subnetID;
		post('/cfg.php?controller=confIPAddrManage&action=showIPAddrList', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			res.data.map((item, index) => {
				item.xzstatus = 1;
			})
			setIPAddrList(res.data);
		}).catch(() => {
			console.log('mistake')
		})
	}

	//地址分配选中数据回显
	const ipaddrShow = () => {
		if (ipSelectList.length < 1) {
			message.error(language('project.assmngt.approval.selectchangeinfo'));
			return false;
		}
		if (ipSelectList.length > 1) {
			let time = 0;
			let type = 'forever';
			if (ipValidType == 'expire') {
				type = 'expire';
				time = ipValidTime;
			}
			ipSelectList.map((item) => {
				item.expireTime = time;
				item.validType = type;
			})
		}
		setApprovalList(ipSelectList);
		allMaskModal();
	}

	//地址分配选中数据处理
	const ipSelectedStatus = (record, index) => {
		let xzstatus = 2;
		let ipInfo = [];
		let ipFind = {};
		ipFind.id = record.id;
		ipFind.ipaddr = record.ipaddr;
		ipFind.subnet = record.subnet;
		ipFind.maskSize = record.maskSize;
		ipFind.validType = ipValidType;
		ipFind.expireTime = ipValidType == 'forever' ? 0 : ipValidTime;
		ipInfo.push(ipFind)
		setIpSelectList(ipInfo);
		iPAddrList.map((val) => {
			if (record.id == val.id) {
				val.xzstatus = xzstatus;
			} else {
				val.xzstatus = 1;
			}
		})
		let iPAddrInfo = iPAddrList;
		setIPAddrList([...iPAddrInfo]);
	}

	//button 按钮处理
	const generateMenus = (data) => {
		return iPAddrList.map((item, index) => {
			let classname = 'buttonassigned';
			if (item.mngState == 'unassigned') {
				classname = 'buttonunassigned'
			} else if (item.mngState == 'reserve') {
				classname = 'buttonreserve'
			}
			if (parseInt((index) % 32) == 0 && index != 0) {
				return (
					<>
						<br />
						<Button data-value={1}
							className={item.xzstatus == 1 ? 'buttonbox ' + (classname) : 'buttonbox checkbuttonassigned'}
							onClick={() => {
								if (item.mngState == 'unassigned') {
									ipSelectedStatus(item, index);
								}
							}}
						>
							{item.id}
						</Button>
					</>
				)
			} else {
				return (
					<Button
						className={item.xzstatus == 1 ? 'buttonbox ' + (classname) : 'buttonbox checkbuttonassigned'}
						onClick={() => {
							if (item.mngState == 'unassigned') {
								ipSelectedStatus(item, index);
							}
						}}
					>
						{item.id}
					</Button>
				)
			}
		})
	}

	//分配数据编辑赋值 修改
	const distributionSubmit = (values) => {
		let aList = approvalList;
		aList.map((item) => {
			if (item.id == values.id) {
				item.ipaddr = values.ipaddr;
				item.subNetaddr = values.subNetaddr;
				item.validType = values.validType;
				if (values.validType == 'forever') {
					item.expireTime = 0;
				} else {
					item.expireTime = values.expireTime;
				}
			}
		})
		setApprovalList(aList);
		getModal(2);
	}

	//文件流查看
	const uploadSignature = (record, type = '' ,fileName = '') => {
		let data = {};
		data.id = record.id;
		data.name = typeName;
		data.fileName = fileName;
		post('/cfg.php?controller=confSignature&action=previewSignature', data, { responseType: 'blob' }).then((res) => {
			if (res.data?.size > 5) {
				let url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
				window.open(url);
			}

		})
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
		post('/cfg.php?controller=confAssetManage&action=showSignINSingleApply', data).then((res) => {
			setBatchTableList(res.data ? res.data : []);
			showExamineForm('open');
		}).catch(() => {
			console.log('mistake')
		})
	}

	//查看pdf
	const seeUploadFile = (name) => {
		uploadSignature(recordFind, 'seeFile', name)
	}

	return (<>
		<ProtableModule expandData={expandData} onExpandUrl={onExpandUrl} expandAble={expandAble} concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} rowSelection={rowSelection} />
		{/* //查看弹出框 */}
		<DrawerForm
			labelCol={{ xs: { span: 9 } }}
			wrapperCol={{ xs: { span: 12 } }}
			width="570px"
			layout="horizontal"
			className='aseemodalfrom'
			// formRef={formRef}
			title={language('project.assmngt.resapply.approveview')}
			visible={seeModalStatus} autoFocusFirstInput
			submitter={false}
			drawerProps={{
				className: 'closebuttonright',
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
			<Divider orientation='left'>{language('project.assmngt.applicationinformation')}</Divider>
			{recordFind.batch == 'Y' ?
				<div className='batchlistbox' >
					<div>
						<ProTable
							size="small"
							columns={uploadColumnsSee}
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
						<div style={{ marginLeft: '35px' }}>
							<ProDescriptions column={2}>
								<ProDescriptions.Item name='signature' label={language('project.assmngt.resapply.signaturefile')}>
									{SignatureShow(initialValue.signature, seeUploadFile)}
								</ProDescriptions.Item>
							</ProDescriptions></div> : ''}
				</div>
				:
				<div className='aapplicationinformation'>
					<ProDescriptions column={2}>
						<ProDescriptions.Item name='applicant' label={language('project.assmngt.resapply.user')}>{initialValue.user ? initialValue.user : ''} </ProDescriptions.Item>
						<ProDescriptions.Item name="phone" label={language('project.assmngt.resapply.contactnumber')}>{initialValue.phone ? initialValue.phone : ' '}</ProDescriptions.Item>
					</ProDescriptions>
					<ProDescriptions column={2}>
						<ProDescriptions.Item name='zone' label={language('project.assmngt.resapply.zone')}>{initialValue.zone ? initialValue.zone : ''}</ProDescriptions.Item>
						<ProDescriptions.Item name="org" label={language('project.assmngt.resapply.organization')}>{initialValue.org ? initialValue.org : ' '}</ProDescriptions.Item>
					</ProDescriptions>
					<ProDescriptions column={2}>
						<ProDescriptions.Item name='assetType' label={language('project.assmngt.assettype')}>{initialValue.assetType ? initialValue.assetType : ''}</ProDescriptions.Item>
						<ProDescriptions.Item name="assetModel" label={language('project.assmngt.assetmodel')}>{initialValue.assetModel ? initialValue.assetModel : ' '}</ProDescriptions.Item>
					</ProDescriptions>
					<ProDescriptions column={2}>
						<ProDescriptions.Item name='macaddr' label={language('project.assmngt.resapply.macaddress')}>{initialValue.macaddr ? initialValue.macaddr : ''}</ProDescriptions.Item>
						<ProDescriptions.Item name='location' label={language('project.assmngt.location')}>{initialValue.location ? initialValue.location : ''}</ProDescriptions.Item>
					</ProDescriptions>
					<ProDescriptions column={2}>
						<ProDescriptions.Item name='ipstr' label={language('project.assmngt.resapply.ipaddrress')}>{initialValue.ipstr ? initialValue.ipstr : ''}</ProDescriptions.Item>
						<ProDescriptions.Item name="vlan" label={language('project.assmngt.resapply.vlan')}>{initialValue.vlan ? initialValue.vlan : ' '}</ProDescriptions.Item>
					</ProDescriptions>
					<ProDescriptions column={2}>
						<ProDescriptions.Item name='purpose' label={language('project.assmngt.resapply.businesspurpose')}>{initialValue.buisUsg ? initialValue.buisUsg : ''}</ProDescriptions.Item>
						{privateField.length - 1 == -1 ?
							'' :
							<ProDescriptions.Item name='purpose' label={privateField[0].name} >{initialValue[privateField[0].key] ? initialValue[privateField[0].key] : ''}</ProDescriptions.Item>
						}
					</ProDescriptions>
					{
						privateField.length - 1 == -1 ? '' :
							privateField.map((item, index) => {
								if (index != 0) {
									if (index % 2 == 1) {
										if (privateField.length - 1 < index + 1) {
											return (
												<ProDescriptions column={2}>
													<ProDescriptions.Item label={item.name}>{initialValue[item.key] ? initialValue[item.key] : ' '}</ProDescriptions.Item>
												</ProDescriptions>
											)
										} else {
											let privateFieldLen = privateField.length - 1;
											return (
												<ProDescriptions column={2}>
													<ProDescriptions.Item label={item.name}>{initialValue.ipstr ? initialValue.ipstr : ''}</ProDescriptions.Item>
													{
														privateFieldLen < 1 ? ' ' :
															<ProDescriptions.Item label={privateField[index + 1].name}>{initialValue[privateField[index + 1].key] ? initialValue[privateField[index + 1].key] : ' '}</ProDescriptions.Item>
													}
												</ProDescriptions>
											)
										}

									}
								}
							})
					}
					{recordFind.showSignature == 'Y' ? <ProDescriptions column={2}>
						<ProDescriptions.Item name='signature' label={language('project.assmngt.resapply.signaturefile')}>
							{SignatureShow(initialValue.signature, seeUploadFile)}
						</ProDescriptions.Item>
					</ProDescriptions> : ''}
				</div>}
			<Divider orientation='left'>{language('project.assmngt.approvalprocess')}</Divider>
			<div className='approvalprocesss frommodalmargin'>
				<Steps direction='vertical' size='small' >
					{approvalProcess()}
				</Steps>

			</div>
		</DrawerForm>
		{/* 添加编辑弹出框 */}
		<DrawerForm {...modalFormLayout}
			className='ipaddmodal'
			formRef={formRef1}
			title={language('project.assmngt.assignmentinformation')}
			visible={modalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'closebuttonright',
				destroyOnClose: true,
				maskClosable: false,
				placement: 'right',
				onClose: () => {
					getModal(2)
				},
			}}
			onVisibleChange={setModalStatus}

			submitTimeout={2000} onFinish={async (values) => {
				distributionSubmit(values);
			}}>

			<ProFormText hidden={true} type="hidden" name="id" />
			<ProFormText name="ipaddr" label={language('project.assmngt.resapply.ipaddr')} />
			<ProFormSelect options={subNetList}
				name="subnet"
				label={language('project.assmngt.addrallc.businesspurpose')}
			/>
			<ProFormRadio.Group
				name="validType"
				label={language('project.assmngt.approval.validtype')}
				radioType="button"
				initialValue='forever'
				onChange={(checked) => {
					if (checked.target.value == 'expire') {
						setTimeShow(true)
					} else {
						setTimeShow(false)
					}
				}}
				options={[
					{
						label: language('project.assmngt.addrallc.forever'),
						value: 'forever',
					},
					{
						label: language('project.assmngt.addrallc.expire'),
						value: 'expire',
					}
				]}
			/>
			{timeShow == true ? (<ProFormDateTimePicker
				style={{ width: '100%' }}
				fieldProps={{
					format: (value) => value.format('YYYY-MM-DD HH:mm:ss')
				}}
				name="expireTime"
				showTime
				label={language('project.assmngt.approval.validtime')}
			/>) : ('')}
		</DrawerForm>

		{/* 审批弹出框 */}
		<DrawerForm
			formRef={formRef}
			width="570px"
			// layout="horizontal"
			title={language('project.assmngt.resapply.approveoperation')}
			visible={approvalModalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'closebuttonright assapprovalmodalfrom',
				destroyOnClose: true,
				maskClosable: false,
				placement: 'right',
				onClose: () => {
					allApporvalModal(2)
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
						<Button kye="2" icon={<CloseCircleOutlined />} type='primary' danger
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
				save(values);
			}}>
			<Divider orientation='left'>{language('project.assmngt.applicationinformation')}</Divider>
			<div className='aapplicationinformations'>
				<ProDescriptions column={2}>
					<ProDescriptions.Item name='applicant' label={language('project.assmngt.resapply.user')}>{initialValue.user ? initialValue.user : ''} </ProDescriptions.Item>
					<ProDescriptions.Item name="phone" label={language('project.assmngt.resapply.contactnumber')}>{initialValue.phone ? initialValue.phone : ' '}</ProDescriptions.Item>
				</ProDescriptions>
				<ProDescriptions column={2}>
					<ProDescriptions.Item name='zone' label={language('project.assmngt.resapply.zone')}>{initialValue.zone ? initialValue.zone : ''}</ProDescriptions.Item>
					<ProDescriptions.Item name="org" label={language('project.assmngt.resapply.organization')}>{initialValue.org ? initialValue.org : ' '}</ProDescriptions.Item>
				</ProDescriptions>
				<ProDescriptions column={2}>
					<ProDescriptions.Item name='assetType' label={language('project.assmngt.assettype')}>{initialValue.assetType ? initialValue.assetType : ''}</ProDescriptions.Item>
					<ProDescriptions.Item name="assetModel" label={language('project.assmngt.assetmodel')}>{initialValue.assetModel ? initialValue.assetModel : ' '}</ProDescriptions.Item>
				</ProDescriptions>
				<ProDescriptions column={2}>
					<ProDescriptions.Item name='macaddr' label={language('project.assmngt.resapply.macaddress')}>{initialValue.macaddr ? initialValue.macaddr : ''}</ProDescriptions.Item>
					<ProDescriptions.Item name='location' label={language('project.assmngt.location')}>{initialValue.location ? initialValue.location : ''}</ProDescriptions.Item>
				</ProDescriptions>
				<ProDescriptions column={2}>
					<ProDescriptions.Item name='ipstr' label={language('project.assmngt.resapply.ipaddrress')}>{initialValue.ipstr ? initialValue.ipstr : ''}</ProDescriptions.Item>
					<ProDescriptions.Item name="vlan" label={language('project.assmngt.resapply.vlan')}>{initialValue.vlan ? initialValue.vlan : ' '}</ProDescriptions.Item>
				</ProDescriptions>
				<ProDescriptions column={2}>
					<ProDescriptions.Item name='purpose' label={language('project.assmngt.resapply.businesspurpose')}>{initialValue.buisUsg ? initialValue.buisUsg : ''}</ProDescriptions.Item>
					{privateField.length - 1 == -1 ?
						'' :
						<ProDescriptions.Item name='purpose' label={privateField[0].name} >{initialValue[privateField[0].key] ? initialValue[privateField[0].key] : ''}</ProDescriptions.Item>
					}
				</ProDescriptions>
				{
					privateField.length - 1 == -1 ? '' :
						privateField.map((item, index) => {
							if (index != 0) {
								if (index % 2 == 1) {
									if (privateField.length - 1 < index + 1) {
										return (
											<ProDescriptions column={2}>
												<ProDescriptions.Item label={item.name}>{initialValue[item.key] ? initialValue[item.key] : ' '}</ProDescriptions.Item>
											</ProDescriptions>
										)
									} else {
										let privateFieldLen = privateField.length - 1;
										return (
											<ProDescriptions column={2}>
												<ProDescriptions.Item label={item.name}>{initialValue[item.key] ? initialValue[item.key] : ' '}</ProDescriptions.Item>
												{
													privateFieldLen < 1 ? ' ' :
														<ProDescriptions.Item label={privateField[index + 1].name}>{initialValue[privateField[index + 1].key] ? initialValue[privateField[index + 1].key] : ' '}</ProDescriptions.Item>
												}
											</ProDescriptions>
										)
									}

								}
							}
						})
				}
				{recordFind.showSignature == 'Y' ? <ProDescriptions column={2}>
					<ProDescriptions.Item name='signature' label={language('project.assmngt.resapply.signaturefile')}>
						{SignatureShow(initialValue.signature, seeUploadFile)}
					</ProDescriptions.Item>
				</ProDescriptions> : ''}
			</div>
			<Divider orientation='left'>{language('project.assmngt.approval.approvaloperation')}</Divider>
			<div className='approvalprocess alfrommodalmargin'>
				<ProFormText hidden={true} name="orderID" initialValue={initialValue.orderID} label="orderID" />
				<ProFormTextArea width='100%' name="reason" rules={[{ required: true, message: language('project.pleasefill') }]} label={language('project.assmngt.resapply.approvedescription')} />
			</div>
		</DrawerForm>

		{/* IP地址选择弹出框 */}
		<ModalForm
			layout="horizontal"
			className='aaipmodalfrom'
			width="1100px"
			// formRef={formRef}
			title={language('project.assmngt.addrallc.addressassign')}
			visible={iPModalStatus} autoFocusFirstInput
			modalProps={{
				maskClosable: false,
				onCancel: () => {
					allMaskModal();
				},
			}}
			onVisibleChange={setIPModalStatus}
			submitTimeout={2000} onFinish={async (values) => {
				ipaddrShow();
			}}>

			<ProCard className='abottomboxone' style={{ height: '272px' }} ghost gutter={[13, 13]}>
				<ProCard ghost >
					{/* 左侧列表 */}
					<ProCard ghost bordered colSpan="170px" style={{ height: '100%' }}>
						<div className='lefttitlebox'><ClusterOutlined style={{ fontSize: "18px", color: '#08c', height: '35px' }} />{language('project.assmngt.approval.subnetlist')}</div>
						<Menu className='snetmenu'
							defaultSelectedKeys="1"
							style={{
								height: 'calc(100% - 59px)'
							}}
							onClick={(e) => {
								let info = '';
								treelist.map((item) => {
									if (item.key == e.key) {
										info = item.label
									}

								})
								onSelectLeft(e.key, info)
							}}
							items={treelist}
						/>
					</ProCard>
					{/* 右侧盒子 */}
					<ProCard ghost direction='column' style={{ height: '272px', padding: '10px' }} bordered gutter={[3, 3]}>
						{/* 上层盒子 */}
						<ProCard ghost style={{ height: '37px' }} >
							<ProCard ghost colSpan='252px'>
								<div className='timeselect'>
									<ProFormRadio.Group
										key='time'
										name="validType"
										label={language('project.assmngt.addrallc.selectmode')}
										radioType="button"
										value={ipValidType}
										onChange={(key) => {
											setIpValidType(key.target.value)
										}}
										options={[
											{
												key: 1,
												label: language('project.assmngt.approval.forever'),
												value: 'forever',
											},
											{
												key: 2,
												label: language('project.assmngt.approval.expire'),
												value: 'expire',
											}
										]}
									/>
								</div>
							</ProCard>
							<ProCard ghost colSpan='160px'>
								<ProFormDateTimePicker name="expireTime"
									onChange={(key, val) => {
										//更新选中时间
										setIpValidTime(val);
									}}
									fieldProps={{
										format: (value) => value.format('YYYY-MM-DD HH:mm:ss')
									}}
									value={ipValidTime}
									showTime
								// initialValue={validTime}
								/>
							</ProCard>
							<ProCard ghost>
								<Alert className='apaddressalertinfo' message={language('project.assmngt.approval.addsalerttext')} type="info" showIcon />
							</ProCard>
						</ProCard >
						{/* 下层按钮盒子 */}
						<ProCard ghost  >
							<ProCard ghost  >
								<div className='approvalfootbotton' >
									<div className='sapprovalfootbottonone' onMouseDown={(e) => {
										document.onmousemove = (e) => {
											// console.log(e)
										}
									}}>
										{generateMenus()}
									</div>
								</div>
							</ProCard>
						</ProCard>
					</ProCard>
				</ProCard>
			</ProCard>
		</ModalForm>

		{/** 批量审批弹出框 */}
		<DrawerForm
			title={<div>{language('project.assmngt.assapply.assoperate')}</div>}
			width="1200px"
			formRef={examineRef}
			visible={examineStatus}
			onVisibleChange={setExamineStatus}
			layout="horizontal"
			labelCol={{ xs: { span: 4 } }}
			wrapperCol={{ xs: { span: 12 } }}
			drawerProps={{
				className: 'closebuttonright uploadspForm',
				placement: 'right',
				destroyOnClose: true,
				closable: false,
				maskClosable: false,
				extra: (
					<CloseOutlined
						className="closeIcon"
						onClick={() => {
							showExamineForm('close')
						}}
					/>
				),
			}}
			submitter={{
				render: (props, doms) => {
					return [
						<Button key="1" icon={<CheckOutlined />} type='primary'
							onClick={() => {
								examineRef.current.submit();
							}}
						>
							<span className='buttonmargint'>{language('project.adopt')}</span>
						</Button>,
						<Button kye="2" icon={<CloseCircleOutlined />} type='primary' danger
							onClick={() => {
								approvalReject('batch');
							}}
						>
							<span className='buttonmargint'>{language('project.reject')}</span>
						</Button>
					]
				}
			}}
			onFinish={async (values) => {
				approvalAdopt(values, 'batch');
			}}
		>
			<ProTable
				columns={uploadColumnsSee}
				scroll={{ y: 500 }}
				dataSource={batchTableList}
				search={false}
				options={true}
				headerTitle={examinSearchDiv()}
				rowSelection={false}
				rowKey="id"
				pagination={false}
			/>
			<ProCard >
				<ProCard bodyStyle={{ padding: 0 }}>
					<ProFormItem label={language('project.assmngt.assapply.signfile')}>
						{SignatureShow(initialValue.signature, seeUploadFile)}
					</ProFormItem>
					<ProFormTextArea name='reason' label={language('project.assmngt.assapply.assspplytip')} width='280px' />
				</ProCard>
				<ProCard bodyStyle={{ padding: 0 }}>
				</ProCard>
			</ProCard>
		</DrawerForm>
	</>);
};
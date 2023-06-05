import React, { useRef, useState, useEffect, createRef } from 'react';
import { ReloadOutlined, SearchOutlined, CheckOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ProTable, DrawerForm, ProFormSelect, ProFormTextArea, ProCard, ProDescriptions, ProFormText, ProFormCheckbox } from '@ant-design/pro-components';
import { Button, TreeSelect, Input, message, Space, Tag, Popconfirm, Divider, Form, Steps, Alert, Tooltip } from 'antd';
import { post } from '@/services/https';
import { language } from '@/utils/language';
import { AiFillEye, AiOutlineClockCircle, AiFillInfoCircle } from "react-icons/ai";
import { GoTrashcan } from "react-icons/go";
import { BiArchiveOut, BiUserCircle } from "react-icons/bi";
import { BsFillCheckCircleFill, BsQuestionCircleFill, BsXCircleFill, BsChevronContract } from "react-icons/bs";
import { HandPaintedPlate, Seal, ViewGridList } from '@icon-park/react';
import SignatureShow from '@/utils/showSignature';
import '@/utils/index.less';
import './index.less';
import Eraser from '@/assets/nfd/resmngt-eraser.svg';
import PdfBatchSeize from '@/assets/tac/pdfbatchseize.png';
import PdfSeize from '@/assets/tac/pdfseize.png'
import { TableLayout, PDFViewer, ExportPDF } from '@/components';
const { ProtableModule, WebUploadr, SignTable, BatchTemplate } = TableLayout;
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
	const renderSubmit = (text, record, type = '') => (
		<Popconfirm onConfirm={() => {
			if (type == 'sqOrder') {
				submitSignINApply(record);
			} else {
				//提交方法
				save('submit', record);
			}
		}} key="popconfirmsave"
			title={language('project.submitconfirm')}
			okButtonProps={{
				loading: confirmLoading,
			}} okText={language('project.yes')} cancelText={language('project.no')}>
			<a>{text}</a>
		</Popconfirm>
	);

	const renderRevoke = (text, record) => (
		<Popconfirm onConfirm={() => {
			//提交方法
			revokeWork(record);
		}} key="popconfirmsave"
			title={language('project.revokeconfirm')}
			okButtonProps={{
				loading: confirmLoading,
			}} okText={language('project.yes')} cancelText={language('project.no')}>
			<a>{text}</a>
		</Popconfirm>
	);

	//审批 table列
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
	//添加编辑列表
	const addColumn = [
		{
			title: language('project.assmngt.macaddr'),
			dataIndex: 'macaddr',
			width: 140,
			readonly: true,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.resapply.ipaddrress'),
			dataIndex: 'ipaddr',
			width: 100,
			ellipsis: true,
		},

		{
			title: language('project.assmngt.resapply.zone'),
			dataIndex: 'zone',
			width: 110,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.resapply.organization'),
			dataIndex: 'org',
			width: 90,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.resapply.user'),
			dataIndex: 'user',
			width: 60,
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

	const columnsList = [
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
			title: language('project.assmngt.resapply.orderid'), // 编号
			dataIndex: 'orderID',
			width: 150,
			ellipsis: true,
			valueType: 'select',
			key: 'orderID',
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
			title: language('project.assmngt.resapply.zone'),
			dataIndex: 'zone',
			width: 120,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.resapply.organization'),
			dataIndex: 'org',
			width: 120,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.resapply.applicant'),
			dataIndex: 'user',
			width: 80,
			readonly: true,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.resapply.phone'),
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
			title: language('project.assmngt.resapply.purpose'),
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
			title: language('project.assmngt.resapply.applypeople'),
			dataIndex: 'applicant',
			width: 80,
			readonly: true,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.resapply.approvalperson'),
			dataIndex: 'approver',
			readonly: true,
			ellipsis: true,
		},
		{
			title: language('project.resmngt.signaturefile'),
			dataIndex: 'signaturefile',
			width: 120,
			ellipsis: true,
			render: (test, record, index) => {
				if (record.showSignature == 'Y') {
					return (
						<>
							<a
								style={
									record.opbutton == 'revoke' || record.opbutton == 'show'
										? {
											color: 'rgba(0,0,0,.25)',
											cursor: 'not-allowed',
											disabled: true,
										}
										: {}
								}
								onClick={() => {
									if (record.opbutton != 'revoke' && record.opbutton != 'show') {
										signatureTemplate(record);
									}
								}}><HandPaintedPlate style={{ fontSize: '18px' }} /></a>
							<a
								style={
									record.opbutton == 'revoke' || record.opbutton == 'show'
										? {
											color: 'rgba(0,0,0,.25)',
											cursor: 'not-allowed',
											disabled: true,
										}
										: {}
								}
								onClick={() => {
									if (record.opbutton != 'revoke' && record.opbutton != 'show') {
										setFileName(record.accessSignature);
										seeModalFrame(record, 'file');
									}
								}}><i className="mdui-icon material-icons" style={{ fontSize: '18px', marginLeft: '8px' }}>&#xe415;</i></a>

						</>
					)
				}
			}
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
				record.inner == 'Y' ? '' :
					record.opbutton == 'edit' ?
						<>
							{renderRemove(<Tooltip title={language('project.del')} ><GoTrashcan style={{ fontSize: '18px', color: 'red' }} /></Tooltip>, record)}
							{renderSubmit(<Tooltip title={language('project.submit')} ><BiArchiveOut className='seeicon' size={18} style={{ fontSize: '18px', color: '#12C189' }} /></Tooltip>, record)}
						</> : '',
				record.opbutton == 'show' ?
					<>
						<a key="editable"
							onClick={() => {
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
								seeModalFrame(record, 'approval');
							}}>
							<Tooltip title={language('project.approval')} >
								<Seal style={{ fontSize: '16px', color: '#FF7429' }} />
							</Tooltip>
						</a>
					</> : '',

				record.opbutton == 'submit' ?
					<>
						{renderSubmit(<Tooltip title={language('project.submit')} ><BiArchiveOut className='seeicon' size={18} style={{ fontSize: '18px', color: '#12C189' }} /></Tooltip>, record, 'sqOrder')}
					</> : '',
				record.opbutton == 'revoke' ?
					<>
						<a key="editable"
							onClick={() => {
								seeModalFrame(record, 'see');
							}}>
							<Tooltip title={language('project.see')} >
								<AiFillEye className='seeicon' size={18} style={{ fontSize: '18px' }} />
							</Tooltip>
						</a>
						{renderRevoke(<Tooltip title={language('project.revoke')} ><i className="mdui-icon material-icons" style={{ color: '#FA561F', fontSize: '18px' }}>&#xe166;</i></Tooltip>, record)}
					</> : '',
			],
		},
	];

	const pdfFormRef = createRef();
	const zFileFormRef = useRef();
	const typeName = 'asset_withdrawal';
	const assetflow = 'ASSETFLOW_SQ';
	const [recordFind, setRecordFind] = useState({});
	const [isBatch, setIsBatch] = useState(false);// 是否是批量
	//签章内容
	const [saModalStatus, setSaModalStatus] = useState(false);//model 签章 
	const [fileModalStatus, setFileModalStatus] = useState(false);//model 签章 
	const [signTitle, setSignTitle] = useState();
	const [signName, setSignName] = useState();
	const [signDataTime, setSignDataTime] = useState();
	const [topData, setTopData] = useState([]);
	let topList = [];
	const [bottomData, setBottomData] = useState([]);
	const [signStatus, setSignStatus] = useState(false);//签章流程是否开启

	//上传功能
	const isAuto = true;
	const upbutext = language('project.upload');
	const maxSize = 300;
	const accept = '.tgz, .tar, .zip, .pdf';
	const upurl = '/cfg.php?controller=confSignature&action=uploadSignature';
	const isShowUploadList = false;
	const maxCount = 1;
	const isUpsuccess = true;
	const [parameter, setParameter] = useState({});
	const [pdfUrl, setPdfUrl] = useState();
	const [fileName, setFileName] = useState(undefined)
	const onSuccess = (res, info) => {
		setFileName(info.name)
		if (res.signature) {
			setPdfUrl("data:application/pdf;base64," + res.signature);
		}
	}
	const [submitType, setSubmitType] = useState();//提交类型，编辑还是添加

	const formRef = useRef();
	const [form] = Form.useForm();
	const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
	const [seeModalStatus, setSeeModalStatus] = useState(false);//model 查看弹框状态
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);//选中id数组
	const [op, setop] = useState('add');//选中id数组
	const [initialValue, setInitialValue] = useState([]);//默认查看头部列表数据
	const [dataSource, setDataSource] = useState([]);
	const [dataInfo, setDataInfo] = useState([]);//查看 申请 ip 列表
	const [notesContent, setNotesContent] = useState();//备注信息
	const [clearInfoContent, setClearInfoContent] = useState([]);
	const [approvalProcessList, setApprovalProcessList] = useState([]);//审批流程列表数据
	const [columns, setColumns] = useState(columnsList);//table 头部数据
	const [batchData, setBatchData] = useState([]);
	const [saFileList, setSaFileList] = useState([]);

	//审批
	const [approvalModalStatus, setApprovalModalStatus] = useState(false);//审批弹出框
	const [approvalsModalStatus, setApprovalsModalStatus] = useState(false);//批量审批弹出框
	const [allApprovalList, setAllApprovalList] = useState([]);//批量注销列表

	//区域数据
	const zoneType = 'zone';
	const [treeValue, setTreeValue] = useState();
	const [treekey, setTreekey] = useState([]);
	const [treeData, setTreeData] = useState([]);
	const [zoneVal, setZoneVal] = useState();//添加区域id、
	const [zoneNameVal, setZoneNameVal] = useState();//添加区域名称

	//组织机构
	const orgType = 'org';
	const [orgValue, setOrgValue] = useState();
	const [orgkey, setOrgkey] = useState([]);//选中多个key
	const [orgData, setOrgData] = useState([]);
	const [orgVal, setOrgVal] = useState();//添加组织结构id、
	const [orgNameVal, setOrgNameVal] = useState();//添加组织结构名称

	const [assettypeList, setAssettypeList] = useState([]);//资产类型

	//签章
	const [fileModalBanchStatus, setFileModalBanchStatus] = useState(false);
	const [fpalertContent, setFpalertContent] = useState();

	//签章 批量
	const closeFileModalBanch = () => {
		setPdfUrl();
		getFileModalBanch(2);
	}

	//判断是否弹出上传签章文件model
	const getFileModalBanch = (status) => {
		if (status == 1) {
			setFileModalBanchStatus(true);
		} else {
			zFileFormRef.current?.resetFields();
			setFileModalBanchStatus(false);
		}
	}

	/** table组件 start */
	const rowKey = (record => record.id);//列表唯一值
	const tableHeight = clientHeight;//列表高度
	const tableKey = 'acancellationapply';//table 定义的key
	const rowSelection = true;//是否开启多选框
	const addButton = true; //增加按钮  与 addClick 方法 组合使用
	const addTitle = language('project.assmngt.resapply.apply');
	const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
	let incIDNum = incID;//递增的id 删除/添加的时候增加触发刷新
	const columnvalue = 'acancellationapplycolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
	const apishowurl = '/cfg.php?controller=confAssetManage&action=showSignOUTApply';//接口路径
	const [queryVal, setQueryVal] = useState();//首个搜索框的值
	let searchVal = { queryVal: queryVal, queryType: 'fuzzy', showType: 'apply', flow: typeName, assetflow: assetflow };//顶部搜索框值 传入接口
	let expandData = {};
	const onExpandUrl = '/cfg.php?controller=confAssetManage&action=showSignOUTSingleApply';
	const developShowKey = 'orderID';//展开图标放置列位置
	const expandAble = {
		rowkey: 'id',
		indentSize: 30,
		expandIconAsCell: false,
		fixed: 'right',
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
				placeholder={language('project.assmngt.resapply.changesearch')}
				style={{ width: 200 }}
				onSearch={(queryVal) => {
					setQueryVal(queryVal);
					incIDChange();
				}}
			/>
		)
	}

	//添加按钮点击触发
	const addClick = () => {
		getModal(1, 'add');
	}

	/** table组件 end */

	//区域管理start
	//区域管理 获取默认列表
	const getTree = (id = 1) => {
		// let page = pagestart != ''?pagestart:startVal;
		let data = {};
		data.id = id;
		data.type = zoneType;
		post('/cfg.php?controller=confZoneManage&action=showZoneTree', data).then((res) => {
			const treeInfoData = [
				{
					id: res.id,
					pId: res.gpid,
					value: res.id,
					title: res.name,
				},
			]
			setTreeData(treeInfoData)
		}).catch(() => {
			console.log('mistake')
		})
	}

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
		let keyNum = selKye[selKye.length - 1];
		setTreeValue(selVal.join('/'));
		setTreekey(selKye);
		setZoneVal(keyNum)
		setZoneNameVal(keyNum)
		//获取组织机构列表
		getOrg(keyNum);
	};

	//区域管理下拉处理
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
	//区域管理end

	//组织机构 start
	//组织机构 获取默认列表
	const getOrg = (id = '') => {
		// let page = pagestart != ''?pagestart:startVal;
		let data = {};
		data.id = id ? id : zoneVal ? zoneVal : 1;
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
				setOrgData(treeInfoData)
			}
		}).catch(() => {
			console.log('mistake')
		})
	}

	// 组织机构 查找父节点的值
	const orgwirelessVal = (value, parentId = false) => {
		let cValue = [];
		if (!parentId) {
			cValue.push(value)
		}
		orgData.forEach((each, index) => {
			if (each.id == value) {
				if (each.pId != 0) {
					orgData.forEach((item, key) => {
						if (each.pId == item.id) {
							if (item.pId != 0) {
								let wirelessArr = orgwirelessVal(item.id, 999);
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

	// 组织机构 下拉列表选中
	const onOrgSelect = (value, label, extra) => {
		let selKye = orgwirelessVal(value);
		selKye = selKye.reverse();//数组反转
		let selVal = [];//选中内容
		selKye.forEach(i => {
			orgData.forEach((item, key) => {
				if (i == item.value) {
					selVal.push(item.title);
				}
			})
		})
		let selKyeNum = selKye[selKye.length - 1];
		let selValNum = selVal[selVal.length - 1];
		setOrgValue(selVal.join('/'));
		setOrgkey(selKye);
		setOrgVal(selKyeNum)
		setOrgNameVal(selValNum)
	};

	//组织机构 下拉处理
	const onOrgData = ({ id, children }) =>
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
				setOrgData(
					orgData.concat(info),
				);
				resolve(undefined);
			});
		});
	//组织机构 end

	//资产类型 id
	const getAssettype = (id = 4) => {
		post('/cfg.php?controller=confResField&action=showResField', { id: id }).then((res) => {
			let info = [];
			res.data.map((item) => {
				let confres = [];
				confres.label = item;
				confres.value = item;
				info.push(confres)
			})
			setAssettypeList(info)
		}).catch(() => {
			console.log('mistake')
		})
	}

	useEffect(() => {
		getAssettype();
		getTree();
	}, [])

	/**
 * 数据提交
 * @param {*} record 
 */
	const submitSignINApply = (record, type = '') => {
		let data = {};
		data.id = record.id;
		data.orderID = record.orderID;
		data.assetflow = assetflow;
		data.flow = typeName;

		post('/cfg.php?controller=confAssetManage&action=setSignOUTApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			incIDChange();
		}).catch(() => {
			console.log('mistake')
		})
	}

	//删除功能
	const delList = (record) => {
		let data = {};
		data.ids = record.id;
		post('/cfg.php?controller=confAssetManage&action=delSignOUTApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			setDataSource(dataSource.filter((item) => item.id !== record.id));
			incIDChange();
		}).catch(() => {
			console.log('mistake')
		})
	}

	//选中触发
	const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
		// setRecord(record)//选中行重新赋值
		setSelectedRowKeys(selectedRowKeys)
	}

	//判断是否弹出添加model
	const getModal = (status, op) => {
		setop(op)
		if (status == 1) {
			setModalStatus(true);
		} else {
			setDataInfo([]);
			setSelectedRowKeys([]);
			setOrgValue('');
			setTreeValue('');
			setClearInfoContent([]);
			setNotesContent();
			setModalStatus(false);
		}
	}

	//查看弹出框页面数据赋值
	const seeModalFrame = (record, type = '') => {
		let data = {};
		data.id = record.id;
		data.flow = typeName;
		data.assetflow = assetflow;
		data.batch = record.batch;
		post('/cfg.php?controller=confAssetManage&action=showSignOUTFlow', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			setRecordFind(record);
			setApprovalProcessList(res.data.flowInfo);
			if (record.batch == 'Y') {
				setSaFileList(res.data ? res.data.recycleInfo : []);
			} else {
				res.data.recycleInfo.ipaddr = res.data.ipaddr;
				res.data.recycleInfo.id = record.orderID;
				res.data.recycleInfo.macaddr = res.data.macaddr;
				setInitialValue(res.data.recycleInfo);
			}
			if (type == 'file') {
				setParameter({ id: record.id, name: typeName, buisusg: record.buisUsg, isBatch: record.batch });
				uploadSignature(record);
				if (record.batch == 'Y') {
					getFileModalBanch(1);
				} else {
					getFileModal(1);
				}
			} else {
				if (type == 'see') {
					getSeeModal(1);
				} else {
					getApporvalModal(1);
				}
			}
		}).catch(() => {
			console.log('mistake')
		})
	}
	//查看判断是否弹出添加model
	const getSeeModal = (status) => {
		if (status == 1) {
			setSeeModalStatus(true);
		} else {
			setSeeModalStatus(false);
		}
	}

	//更新修改功能
	const save = (action, record = '', typeModal = '') => {
		let notes = record ? record.notes : notesContent;
		let clearInfo = record ? record.clearInfo : clearInfoContent;
		let macaddrs = '';
		let data = {};
		if (record) {
			macaddrs = record.macaddr;
			data.id = record.id;
			let clearCon = {};
			clearCon.clear = record.clear.slice(0, 1);
			clearCon.uninstall = record.uninstall.slice(0, 1);
			clearCon.delete = record.delete.slice(0, 1);
			clearCon.remove = record.remove.slice(0, 1);
			data.clearInfo = JSON.stringify(clearCon);
		} else {
			if (selectedRowKeys.length < 1) {
				let content = language('project.assmngt.resapply.serchgcancellationipaddr');
				message.error(content);
				return false;
			}
			macaddrs = selectedRowKeys.join(',');
			let clearCon = {};
			clearCon.clear = clearInfo.indexOf('clear') == -1 ? 'N' : 'Y';
			clearCon.uninstall = clearInfo.indexOf('uninstall') == -1 ? 'N' : 'Y';
			clearCon.delete = clearInfo.indexOf('delete') == -1 ? 'N' : 'Y';
			clearCon.remove = clearInfo.indexOf('remove') == -1 ? 'N' : 'Y';
			data.clearInfo = JSON.stringify(clearCon);
		}
		data.op = action;
		data.macaddrs = macaddrs;
		data.notes = notes;
		data.assetflow = assetflow;
		data.flow = typeName;
		post('/cfg.php?controller=confAssetManage&action=setSignOUTApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			if (typeModal == 'zfile') {
				closeFileModal();
			} else {
				getModal(2);
			}
			incIDChange();
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

	//重置
	const resetFields = () => {
		form.resetFields();
		setDataInfo([]);
		setSelectedRowKeys([]);
		// searchFrom();
	}

	//添加搜索ip
	const searchFrom = () => {
		let data = form.getFieldsValue(true);
		let dataNum = 0;
		for (const key in data) {
			if (data[key]) {
				dataNum = dataNum + 1;
			}
		}
		if (dataNum < 1) {
			message.error(language('project.assmngt.resapply.fillinserchinfo'));
			return false;
		}
		data.assetflow = assetflow;
		data.flow = typeName;
		post('/cfg.php?controller=confAssetManage&action=queryAsset', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			setDataInfo(res.data);
		}).catch(() => {
			console.log('mistake')
		})
	}

	//判断是否弹出文件签章model
	const getSaModal = (status, record = '') => {
		if (status == 1) {
			saModContent(record);
			setSaModalStatus(true);
		} else {
			setSaModalStatus(false);
		}
	}
	const closeSaModal = () => {
		getSaModal(2);
	}

	//文件签章内容赋值
	const saModContent = (record) => {
		setSignName(record?.applicant);
		setSignDataTime(record?.createTime);
		if (topList.length > 0) {
			topList.map((item) => {
				saModList(item.children, record);
			})
		}
		setTopData(topList);
	}

	//文件签章内容处理
	const saModList = (list, record = '') => {
		if (list.length > 0) {
			list.map((item) => {
				if (item.key == 'clear' || item.key == 'uninstall' || item.key == 'delete' || item.key == 'remove') {
					item.value = record[item.key] ? record[item.key].slice(1) : '';
				} else {
					item.value = record[item.key];
				}
			})
		}
		return list;
	}

	//判断是否弹出上传签章文件model
	const getFileModal = (status) => {
		if (status == 1) {
			setFileModalStatus(true);
		} else {
			zFileFormRef.current.resetFields();
			setFileModalStatus(false);
		}
	}
	const closeFileModal = () => {
		setPdfUrl();
		getFileModal(2);
	}

	//查看pdf
	const seeUploadFile = (name) => {
		uploadSignature(recordFind, 'seeFile', name)
	}

	//文件流查看
	const uploadSignature = (record, type = '', fileName = '') => {
		let data = {};
		data.id = record.id;
		data.name = typeName;
		data.fileName = fileName;
		post('/cfg.php?controller=confSignature&action=previewSignature', data, { responseType: 'blob' }).then((res) => {
			if (type == 'seeFile') {
				if (res.data?.size > 0) {
					let url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
					window.open(url);
				}
			} else {
				if (res.data?.size > 5) {
					let url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
					setPdfUrl(url);
				}
			}
		})
	}


	//签章流程字段回显
	const signatureTemplate = (record) => {
		let data = {};
		data.default = 'N';
		data.buisusg = record.buisUsg
		data.name = typeName;
		data.isBatch = record.batch;
		post('/cfg.php?controller=confSignature&action=showTemplate', data).then((res) => {
			if (res.success) {
				setIsBatch(record.batch);
				setSignTitle(res.template?.title);
				setTopData(res.template?.upData);
				topList = res.template?.upData;
				setBottomData(res.template?.bottomData);
				if (record.batch == 'Y') {
					showPSignINApply(record, 'template', res.template?.batchData);
				}
				incIDChange();
				getSaModal(1, record);
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
				data.push(obj)
			})
		}
		return data;
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
				setSaFileList(res.data ? res.data : []);
				getApporvalsModal(1);
			}
		}).catch(() => {
			console.log('mistake')
		})
	}


	//工单撤销功能
	const revokeWork = (record) => {
		let data = {};
		data.id = record.id;
		data.orderID = record.orderID;
		post('/cfg.php?controller=confAssetManage&action=revokeSignOUTApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			message.success(res.msg);
			incIDChange();
		}).catch(() => {
			console.log('mistake')
		})
	}

	const incIDChange = () => {
		let inc;
		clearTimeout(inc);
		inc = setTimeout(() => {
			incAdd();
		}, 100);
	}

	//操作关闭后清空数据
	const operationOffEmpty = () => {
		//清空弹框上部列表信息
		setInitialValue([]);
	}

	/** 审批 start */
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
	//审批通过
	const approvalAdopt = (type = '') => {
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
		data.assetflow = assetflow;
		data.flow = typeName;
		post('/cfg.php?controller=confAssetManage&action=agreeSQSignOUTApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			allApporvalModal();
			incAdd();
		}).catch(() => {
			console.log('mistake')
		})
	}

	//审批驳回
	const approvalReject = (type = '') => {
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
		data.assetflow = assetflow;
		data.flow = typeName;
		post('/cfg.php?controller=confAssetManage&action=rejectSQSignOUTApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			allApporvalModal();
			incAdd();
		}).catch(() => {
			console.log('mistake')
		})
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

	//导入功能
	const handleEnter = (option, record, val, list = '') => {
		let data = {}
		data.op = option;
		data.list = JSON.stringify(list ? list : []);
		data.flow = typeName;
		data.batch = 'Y';
		data.assetflow = assetflow;
		if (record) {
			data.id = record.id;
		}
		post(
			'/cfg.php?controller=confAssetManage&action=setSignOUTApply',
			data
		).then((res) => {
			if (!res.success) {
				message.error(res.msg)
				return false
			} else {
				if (record.batch == 'Y') {
					closeFileModalBanch();
				}
				message.success(res.msg)
				incAdd();
			}
		})
	}

	const incAdd = () => {
		let inc;
		clearTimeout(inc);
		inc = setTimeout(() => {
			setIncID((incID) => incID + 1);
		}, 100);
	}

	/** 审批 end */
	return (<>
		<ProtableModule expandAble={expandAble} developShowKey={developShowKey} expandData={expandData} onExpandUrl={onExpandUrl} concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} addButton={addButton} addClick={addClick} addTitle={addTitle} rowSelection={rowSelection} />
		{/* 添加编辑弹出框 */}
		<DrawerForm width="802px"
			{...{
				layout: "horizontal",
			}}
			title={op == 'add' ? language('project.assmngt.resapply.cancellationapply') : language('project.assmngt.resapply.cancellationapply')}
			visible={modalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'bgsaveform',
				destroyOnClose: true,
				maskClosable: false,
				placement: 'right',
				onClose: () => {
					getModal(2)
				},
			}}
			submitter={{
				render: (props, doms, info) => {
					return [
						doms[0],
						<Button key="buttonsave" type='primary'
							onClick={() => {
								save('save')
							}}
						>
							<span className='buttonmargint'>{language('project.save')}</span>
						</Button>,
						<Button key="buttonsubmit" type='primary'
							onClick={() => {
								save('submit', '', 'submit');
							}}
						>
							<span className='buttonmargint'>{language('project.submit')}</span>
						</Button>
					]
				}
			}}
			onVisibleChange={setModalStatus}

			submitTimeout={2000}
		>
			<Alert className='caddressalertinfo'
				message={language('project.assmngt.resapply.serchipaddrcontent')}
				type="info" showIcon
			/>
			<Form
				form={form}
				{...{
					labelCol: {
						xs: { span: 10 },
					},
					wrapperCol: {
						xs: { span: 15 },
					},
					layout: "inline",
				}}
				className='caddressproform'
			>
				<Form.Item name='zoneID' label={language('project.assmngt.resapply.zone')}>
					<TreeSelect
						style={{ width: "150px" }}
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
						rules={[{ required: true, message: language('project.select') }]}
					/>
				</Form.Item>
				<Form.Item name='orgID' label={language('project.assmngt.resapply.organization')}>
					<TreeSelect
						style={{ width: "150px" }}
						treeDataSimpleMode
						value={orgValue}
						dropdownStyle={{
							maxHeight: 400,
							overflow: 'auto',
						}}
						placeholder={language('project.select')}
						onChange={onOrgSelect}
						loadData={onOrgData}
						treeData={orgData}
						rules={[{ required: true, message: language('project.select') }]}
					/>
				</Form.Item>
				<Form.Item name='assetType' label={language('project.assmngt.assettype')}>
					<ProFormSelect
						style={{ width: "150px" }}
						options={assettypeList}
					/>
				</Form.Item>
				<Form.Item name='macaddr' label={language('project.assmngt.resapply.retreataddr')}>
					<Input style={{ width: "150px" }} />
				</Form.Item>
				<Form.Item name='user' label={language('project.assmngt.resapply.user')}>
					<Input style={{ width: "150px" }} />
				</Form.Item>
				<Form.Item style={{ marginLeft: "80px" }}>
					<Button type='button' key='subment1'
						onClick={() => {
							resetFields();
						}}
						style={{ backgroundColor: '#1890FF', borderRadius: 5, color: '#FFFFFF' }}
						icon={<ReloadOutlined />}>
						{language('project.reset')}
					</Button>
					<Button type='button' key='subment2'
						onClick={() => {
							searchFrom();
						}}
						style={{ backgroundColor: '#1890FF', borderRadius: 5, color: '#FFFFFF' }}
						icon={<SearchOutlined />}>
						{language('project.query')}
					</Button>
				</Form.Item>
			</Form>
			<div className='caddformationbox'>
				<ProTable
					className='cassignmentinformationtable'
					scroll={{ y: 208 }}
					//边框
					cardBordered={true}
					bordered={true}
					rowkey={'id'}

					//单选框选中变化
					rowSelection={{
						selectedRowKeys,
						onChange: onSelectedRowKeysChange,
						getCheckboxProps: (record) => ({
							disabled: record.from === 'remote',
							// name: record.name,
						}),
					}}
					//设置选中提示消失
					tableAlertRender={false}
					columns={addColumn}
					//页面数据信息
					dataSource={dataInfo}
					editable={{
						type: 'multiple',
					}}
					rowKey={record => record.macaddr}
					//头部搜索框关闭
					search={false}
					pagination={false}
					dateFormatter="string"
					headerTitle={false}
					toolBarRender={false}
				/>
				<div className='caddformtextarea'>
					<ProFormCheckbox.Group style={{ width: '180px' }} name="infoClear"
						label={language('project.assmngt.infoclear')}
						onChange={(val) => {
							setClearInfoContent(val);
						}}
						options={[
							{ label: language('project.assmngt.isclearsensitiveinfomation'), value: 'clear' },
							{ label: language('project.assmngt.isclearapplicationsoftware'), value: 'uninstall' },
							{ label: language('project.assmngt.isclearnetworkconfig'), value: 'delete' },
							{ label: language('project.assmngt.isclearperipheralhardware'), value: 'remove' },
						]}
					/>
					<ProFormTextArea label={language('project.assmngt.withdrawalremarks')} onChange={(val) => {
						setNotesContent(val.target.value)
					}} />
				</div>

			</div>

		</DrawerForm>
		{/* //查看弹出框 */}
		<DrawerForm
			labelCol={{ xs: { span: 9 } }}
			wrapperCol={{ xs: { span: 12 } }}
			width="570px"
			layout="horizontal"
			className='bgseemodalfrom'
			title={language('project.assmngt.resapply.cancellationapply')}
			visible={seeModalStatus} autoFocusFirstInput
			submitter={false}
			drawerProps={{
				className: 'closebuttonright bgseemodalname',
				destroyOnClose: true,
				maskClosable: false,
				placement: 'right',
				onClose: () => {
					getSeeModal(2)
				},
			}}
			onVisibleChange={setSeeModalStatus}
			submitTimeout={2000} >
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
							<div style={{ marginLeft: '35px' }}>
								<ProDescriptions column={2}>
									<ProDescriptions.Item name='signature' label={language('project.assmngt.resapply.signaturefile')}>
										{SignatureShow(recordFind.signature, seeUploadFile)}
									</ProDescriptions.Item>
								</ProDescriptions></div> : ''}
					</div></>
				:
				<>
					<Alert className='caddressalertinfo' message={language('project.assmngt.cancellationipaddrcontent', { ipaddr: initialValue.macaddr + '(' + initialValue.ipaddr + ')' })} type="info" showIcon icon={<img src={Eraser} />} />
					<Divider orientation='left'>{language('project.assmngt.cancellationinfo')}</Divider>
					<div className='capplicationinformation'>
						<ProDescriptions column={2}>
							<ProDescriptions.Item name='user' label={language('project.assmngt.resapply.user')}>{initialValue.user ? initialValue.user : ''} </ProDescriptions.Item>
							<ProDescriptions.Item name="phone" label={language('project.assmngt.resapply.contactnumber')}>{initialValue.phone ? initialValue.phone : ' '}</ProDescriptions.Item>
						</ProDescriptions>
						<ProDescriptions column={2}>
							<ProDescriptions.Item name='zone' label={language('project.assmngt.resapply.zone')}>{initialValue.zone ? initialValue.zone : ''}</ProDescriptions.Item>
							<ProDescriptions.Item name="org" label={language('project.assmngt.resapply.organization')}>{initialValue.org ? initialValue.org : ' '}</ProDescriptions.Item>
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
							<ProDescriptions.Item name='clear' label={language('project.assmngt.sensitiveinfomation')}>{initialValue.clear ? <span style={initialValue.clear.slice(0, 1) == 'N' ? { color: '#FF0000' } : {}}> {initialValue.clear.slice(1)} </span> : ''} </ProDescriptions.Item>
							<ProDescriptions.Item name="uninstall" label={language('project.assmngt.applicationsoftware')}>{initialValue.uninstall ? <span style={initialValue.uninstall.slice(0, 1) == 'N' ? { color: '#FF0000' } : {}}> {initialValue.uninstall.slice(1)} </span> : ''} </ProDescriptions.Item>
						</ProDescriptions>
						<ProDescriptions column={2}>
							<ProDescriptions.Item name='delete' label={language('project.assmngt.networkconfig')}>{initialValue.delete ? <span style={initialValue.delete.slice(0, 1) == 'N' ? { color: '#FF0000' } : {}}> {initialValue.delete.slice(1)} </span> : ''}</ProDescriptions.Item>
							<ProDescriptions.Item name="remove" label={language('project.assmngt.peripheralhardware')}>{initialValue.remove ? <span style={initialValue.remove.slice(0, 1) == 'N' ? { color: '#FF0000' } : {}}> {initialValue.remove.slice(1)} </span> : ''}</ProDescriptions.Item>
						</ProDescriptions>
					</div>
				</>}
			<Divider orientation='left'>{language('project.assmngt.approvalprocess')}</Divider>
			<div className='approvalprocess cfrommodalmargin'>
				<Steps direction='vertical' size='small' >
					{approvalProcess()}
				</Steps>

			</div>
		</DrawerForm>

		{/* //查看上传签章文件 */}
		<DrawerForm
			width="570px"
			layout="horizontal"
			className='bgseemodalfrom'
			formRef={zFileFormRef}
			title={language('project.resmngt.uploadsignaturefile')}
			visible={fileModalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'closebuttonright bgseemodalname',
				destroyOnClose: true,
				maskClosable: false,
				placement: 'right',
				onClose: () => {
					closeFileModal(2)
				},
			}}
			submitter={{
				render: (props, doms, info) => {
					return [
						doms[0],
						<Button key="buttonsave" type='primary' htmlType='submit'
							onClick={() => {
								closeFileModal(2);
							}}
						>
							<span className='buttonmargint'>{language('project.save')}</span>
						</Button>,
						recordFind.opbutton == 'approve' ? <></> :
							<Button key="buttonsubmit" type='primary'
								onClick={() => {
									setSubmitType('submit');
									zFileFormRef.current.submit();
								}}
							>
								<span className='buttonmargint'>{language('project.submit')}</span>
							</Button>,
					]
				}
			}}
			onVisibleChange={setFileModalStatus}
			submitTimeout={1000} onFinish={async (values) => {
				save(submitType, recordFind, 'zfile');
			}}  >

			<Alert className='caddressalertinfo' message={language('project.assmngt.cancellationipaddrcontent', { ipaddr: initialValue.macaddr + '(' + initialValue.ipaddr + ')' })} type="info" showIcon icon={<img src={Eraser} />} />

			{recordFind.batch == 'Y' ?
				<><Divider orientation='left'>{language('project.resmngt.cancellationlist')}</Divider>
					<div style={{ width: '500px', marginLeft: '7px' }}>
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
					</div></>
				:
				<><Divider orientation='left'>{language('project.assmngt.cancellationinfo')}</Divider>
					<div className='capplicationinformation'>
						<ProDescriptions column={2}>
							<ProDescriptions.Item name='user' label={language('project.assmngt.resapply.user')}>{initialValue.user ? initialValue.user : ''} </ProDescriptions.Item>
							<ProDescriptions.Item name="phone" label={language('project.assmngt.resapply.contactnumber')}>{initialValue.phone ? initialValue.phone : ' '}</ProDescriptions.Item>
						</ProDescriptions>
						<ProDescriptions column={2}>
							<ProDescriptions.Item name='zone' label={language('project.assmngt.resapply.zone')}>{initialValue.zone ? initialValue.zone : ''}</ProDescriptions.Item>
							<ProDescriptions.Item name="org" label={language('project.assmngt.resapply.organization')}>{initialValue.org ? initialValue.org : ' '}</ProDescriptions.Item>
						</ProDescriptions>
						<ProDescriptions column={2}>
							<ProDescriptions.Item name='assetType' label={language('project.assmngt.assettype')}>{initialValue.assetType ? initialValue.assetType : ''}</ProDescriptions.Item>
							<ProDescriptions.Item name='buisUsg' label={language('project.assmngt.resapply.businesspurpose')}>{initialValue.buisUsg ? initialValue.buisUsg : ''}</ProDescriptions.Item>
						</ProDescriptions>
						<ProDescriptions column={2}>
							<ProDescriptions.Item name='location' label={language('project.assmngt.location')}>{initialValue.location ? initialValue.location : ''}</ProDescriptions.Item>
							<ProDescriptions.Item name='vlan' label={language('project.assmngt.wherevlan')}>{initialValue.vlan ? initialValue.vlan : ''}</ProDescriptions.Item>
						</ProDescriptions>
					</div></>}
			<Divider orientation='left'>{language('project.resmngt.previewfile')}</Divider>
			<div className='assignmentinformation pdfbox'>
				<div className='seepdfbox'  >
					{pdfUrl ? <PDFViewer url={pdfUrl} />
						: <div><img src={PdfSeize} /></div>
					}
				</div>
			</div>
			<div className='alicationinformation'>
				<ProFormText label={language('sysmain.update.qzfile')} name='upload' addonAfter={<div>{fileName ? fileName : ''}</div>}>
					<div className='acaluploadbox'>
						<WebUploadr parameter={parameter} isUpsuccess={isUpsuccess} isAuto={isAuto} upbutext={upbutext} maxSize={maxSize} accept={accept} upurl={upurl} onSuccess={onSuccess} isShowUploadList={isShowUploadList} maxCount={maxCount} />
					</div>
				</ProFormText>
				<div className='alertbox'>
					<Alert className='pdfalertinfo' message={language('project.resmngt.assapply.scanthesigneddocumentspdffilesanduploadthem')} type="info" showIcon />
				</div>
			</div>
		</DrawerForm>

		{/* //生成签章文件 */}
		<DrawerForm
			layout="horizontal"
			formRef={formRef}
			width={'auto'}
			className='bgsarmodalfrom'
			title={language('project.resmngt.generatesignaturefile')}
			visible={saModalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'twqzfilenamebox',
				destroyOnClose: true,
				maskClosable: false,
				placement: 'right',
				onClose: () => {
					closeSaModal(2)
				},
			}}
			submitter={{
				render: (props, doms, info) => {
					return [
						doms[0],
						<Button key="buttonsave" type='primary' htmlType='submit'
							onClick={() => {
								ExportPDF(signTitle, pdfFormRef.current, false, isBatch == 'Y' ? 'l' : 'p');
								closeSaModal(2);
							}}
						>
							<span className='buttonmargint'>{language('project.export')}</span>
						</Button>,
						<Button key="buttonsubmit" type='primary'
							onClick={() => {
								ExportPDF(signTitle, pdfFormRef.current, true, isBatch == 'Y' ? 'l' : 'p');
								closeSaModal(2);
							}}
						>
							<span className='buttonmargint'>{language('project.print')}</span>
						</Button>
					]
				}
			}}
			onVisibleChange={setSaModalStatus}
			submitTimeout={2000} >
			<div ref={pdfFormRef}>
				<div style={{ padding: '24px' }}>
					{isBatch == 'Y' ?
						<BatchTemplate dataSource={topData} bottomData={bottomData} editable={false} title={signTitle} signName={signName} dateTime={signDataTime} batchData={batchData} />
						: <SignTable dataSource={topData} bottomData={bottomData} editable={false} title={signTitle} signName={signName} dateTime={signDataTime} />
					}
				</div>
			</div>
		</DrawerForm>

		{/* 审批弹出框 */}
		<DrawerForm
			formRef={formRef}
			width="570px"
			className='ascanapprovalmodalfrom'
			title={language('project.resmngt.resapply.approveoperation')}
			visible={approvalModalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'closebuttonright ascanapprovalmodalbox',
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
					<div className='aapplicationinformations' style={{ marginTop: '12px' }}>
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

		{/* 批量审批弹出框 */}
		<DrawerForm
			formRef={formRef}
			width="570px"
			className='ascanapprovalmodalfrom'
			title={language('project.resmngt.resapply.approveoperation')}
			visible={approvalsModalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'closebuttonright ascanapprovalmodalbox',
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
								approvalAdopt('batch')
							}}
						>
							<span className='buttonmargint'>{language('project.adopt')}</span>
						</Button>,
						<Button key="2" icon={<CloseCircleOutlined />} type='primary' danger
							onClick={() => {
								approvalReject('batch')
							}}
						>
							<span className='buttonmargint'>{language('project.reject')}</span>
						</Button>
					]
				}
			}}
			onVisibleChange={setApprovalsModalStatus}
			submitTimeout={2000} >

			<div className='approvalprocess alfrommodalmargin'>
				<ProFormTextArea width='100%' name="reason" label={language('project.resmngt.resapply.approvedescription')} />
			</div>
		</DrawerForm>

		{/* //批量查看上传签章文件 */}
		<DrawerForm
			width="809px"
			layout="horizontal"
			className='acanchangemodalBatchfrom'
			formRef={zFileFormRef}
			title={language('project.resmngt.uploadsignaturefile')}
			visible={fileModalBanchStatus} autoFocusFirstInput
			drawerProps={{
				className: 'closebuttonright',
				destroyOnClose: true,
				maskClosable: false,
				placement: 'right',
				onClose: () => {
					closeFileModalBanch(2);
				},
			}}
			submitter={{
				render: (props, doms, info) => {
					return [
						doms[0],
						<Button key="buttonsave" type='primary' htmlType='submit'
							onClick={() => {
								closeFileModalBanch(2);
							}}
						>
							<span className='buttonmargint'>{language('project.save')}</span>
						</Button>,
						recordFind.opbutton == 'approve' ? <></> :
							<Button key="buttonsubmit" type='primary'
								onClick={() => {
									setSubmitType('submit');
									zFileFormRef.current.submit();
								}}
							>
								<span className='buttonmargint'>{language('project.submit')}</span>
							</Button>,
					]
				}
			}}
			onVisibleChange={setFileModalBanchStatus}
			submitTimeout={1000} onFinish={async (values) => {
				if (recordFind.opbutton != 'approve' && recordFind.opbutton != 'submit') {
					handleEnter(submitType, recordFind, 'upTable', saFileList)
				} else {
					submitSignINApply(recordFind, 'submitFirst');
				}
			}} >
			<Divider orientation='left'>{language('project.assmngt.applicationinformation')}</Divider>
			<div style={{ width: '744px', marginLeft: '9px' }}>
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
			<Divider orientation='left'>{language('project.resmngt.previewfile')}</Divider>
			<div className='assignmentinformation pdfbox'>
				<div className='seepdfbox'  >
					{pdfUrl ? <PDFViewer url={pdfUrl} />
						: <div><img src={PdfBatchSeize} /></div>
					}
				</div>
			</div>
			<div className='sappqzlicationin'>
				<ProFormText label={language('sysmain.update.qzfile')} name="upload" addonAfter={<div>{fileName ? fileName : ''}</div>}>
					<div className='acaluploadbox'>
						<WebUploadr parameter={parameter} isUpsuccess={isUpsuccess} isAuto={isAuto} upbutext={upbutext} maxSize={maxSize} accept={accept} upurl={upurl} onSuccess={onSuccess} isShowUploadList={isShowUploadList} maxCount={maxCount} />
					</div>
				</ProFormText>
				<div className='alertbox'>
					<Alert className='caddressalertinfo' message={language('project.resmngt.assapply.scanthesigneddocumentspdffilesanduploadthem')} type="info" showIcon />
				</div>
			</div>
		</DrawerForm>

	</>);
};
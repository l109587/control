import React, { useRef, useState, useEffect } from 'react';
import { CheckOutlined, CloseCircleOutlined, CloseOutlined } from '@ant-design/icons';
import { ProTable, DrawerForm, ProFormText, ProFormTextArea, ProDescriptions, ProCard, ProFormItem } from '@ant-design/pro-components';
import { Button, Input, message, Space, Tag, Divider, Steps, Alert, Tooltip } from 'antd';
import { post, get } from '@/services/https';
import { language } from '@/utils/language';
import { AiFillEye, AiOutlineClockCircle, AiFillInfoCircle } from "react-icons/ai";
import { BsFillCheckCircleFill, BsQuestionCircleFill, BsXCircleFill, BsChevronContract } from "react-icons/bs";
import { BiUserCircle } from "react-icons/bi";
import { Seal, ViewGridList } from '@icon-park/react';
import SignatureShow from '@/utils/showSignature';
import '@/utils/index.less';
import './index.less';
import Substitute from '@/assets/nfd/resmngt-substitute.svg';
import { TableLayout } from '@/components';
const { ProtableModule } = TableLayout;
let H = document.body.clientHeight - 481
var clientHeight = H
const { Search } = Input
const { Step } = Steps;
let columnsFileOldList = [];
export default (props) => {

	//查看列表
	const columnsInfoSee = [
		{
			title: language('project.assmngt.resapply.changefield'),
			dataIndex: 'changefield',
			width: 80,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.resapply.changeinfo'),
			dataIndex: 'changeinfo',
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
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('orderState') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
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
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('handleState') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
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
			width: 150,
			ellipsis: true,
			valueType: 'select',
			key: 'orderID',
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('notes') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
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
			title: language('project.assmngt.resapply.oldmacaddr'),
			dataIndex: 'oriMacaddr',
			width: 135,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('oriMacaddr') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.macaddr'),
			dataIndex: 'macaddr',
			width: 135,
			readonly: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('macaddr') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.ipaddr'),
			dataIndex: 'ipaddr',
			width: 120,
			readonly: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('ipaddr') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			//所属机构暂无内容 key 不对 dataindex
			title: language('project.assmngt.approval.organization'),
			dataIndex: 'org',
			width: 120,
			readonly: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('org') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.resapply.zone'),
			dataIndex: 'zone',
			width: 120,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('zone') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.assettype'),
			dataIndex: 'assetType',
			width: 110,
			readonly: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('assetType') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.approval.applicant'),
			dataIndex: 'user',
			width: 80,
			readonly: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('user') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.approval.phone'),
			dataIndex: 'phone',
			width: 110,
			readonly: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('phone') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.assetmodel'),
			dataIndex: 'assetModel',
			width: 110,
			readonly: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('assetModel') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.approval.purpose'),
			dataIndex: 'buisUsg',
			width: 100,
			readonly: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('buisUsg') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.location'),
			dataIndex: 'location',
			width: 120.,
			readonly: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('location') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.wherevlan'),
			dataIndex: 'vlan',
			width: 80,
			readonly: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('vlan') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.approval.applypeople'),
			dataIndex: 'applicant',
			width: 80,
			readonly: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('applicant') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.approval.approvalperson'),
			dataIndex: 'approver',
			readonly: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('approver') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.resmngt.notes'),
			dataIndex: 'notes',
			width: 120,
			readonly: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('notes') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
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
									getDynamicField('see', 'private', record.buisUsg ? record.buisUsg : '', record);
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
								setInitialValue(record);
								getDynamicField('approve', 'private', record.buisUsg ? record.buisUsg : '', record);
							}}>
							<Tooltip title={language('project.approval')} >
								<Seal style={{ fontSize: '16px', color: '#FF7429' }} />
							</Tooltip>
						</a>
					</> : '',
			],
		},
	];


	//导入表头
	const uploadColumns = [
		{
			title: language('project.assmngt.changeaddr'), // 变更地址
			dataIndex: 'changeAddr',
			width: 120,
			importStatus: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('changeAddr') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.resapply.zone'),
			dataIndex: 'zone',
			width: 120,
			importStatus: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('zone') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.resapply.organization'),
			dataIndex: 'org',
			width: 120,
			importStatus: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('org') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.macaddr'), // MAC地址
			dataIndex: 'macaddr',
			width: 135,
			importStatus: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('macaddr') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.wherevlan'),
			dataIndex: 'vlan',
			width: 80,
			readonly: true,
			ellipsis: true,
			importStatus: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('vlan') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.ipaddr'),
			dataIndex: 'ipaddr',
			width: 120,
			importStatus: true,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('ipaddr') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.resapply.applicant'), // 使用人
			dataIndex: 'user',
			width: 80,
			ellipsis: true,
			importStatus: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('user') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.resmngt.approval.phone'), // 电话
			dataIndex: 'phone',
			width: 110,
			ellipsis: true,
			importStatus: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('phone') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.assetmodel'),
			dataIndex: 'assetModel',
			width: 110,
			ellipsis: true,
			importStatus: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('assetModel') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.assettype'), // 资产类型
			dataIndex: 'assetType',
			width: 110,
			ellipsis: true,
			importStatus: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('assetType') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.resapply.purpose'), // 业务用途
			dataIndex: 'buisUsg',
			width: 100,
			ellipsis: true,
			importStatus: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('buisUsg') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
		{
			title: language('project.assmngt.location'),
			dataIndex: 'location',
			width: 120,
			readonly: true,
			ellipsis: true,
			importStatus: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('location') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
		},
	]
	const formRef = useRef();
	const typeName = 'asset_change';
	const [recordFind, setRecordFind] = useState({});
	const [approvalModalStatus, setApprovalModalStatus] = useState(false);//审批弹出框
	const [seeModalStatus, setSeeModalStatus] = useState(false);//model 查看弹框状态
	const [approvalProcessList, setApprovalProcessList] = useState([]);//审批流程列表数据
	const [dataInfo, setDataInfo] = useState([]);//查看 申请 ip 列表
	const [changeInfo, setChangeInfo] = useState([]);//审批变更信息
	const [initialValue, setInitialValue] = useState([]);//默认查看头部列表数据
	const [dynamicFieldList, setDynamicFieldList] = useState([]);//动态字段列表
	let dynamicFieldListLet = [];
	const [privateField, setPrivateField] = useState([]);//私有动态字段列表
	let privateFieldList = [];//私有动态字段列表
	const [columns, setColumns] = useState(columnsList);//table 头部数据
	const [columnsOld, setColumnsOld] = useState(columnsList);//旧table 头数据,包含公有动态字段
	const [columnsFileOld, setColumnsFileOld] = useState() //新table 头数据,包含公有动态字段, 导入使用 保持原有数据
	const [columnsNew, setColumnsNew] = useState(uploadColumns) //新table 头数据,包含公有动态字段, 导入使用
	const [uploadColumnsBatch, setUploadColumnsBatch] = useState([]) //新table 头数据,包含公有动态字段, 导入使用

	const examineRef = useRef();
	const [batchTableList, setBatchTableList] = useState([]);
	const [fpalertContent, setFpalertContent] = useState();
	const [examineStatus, setExamineStatus] = useState(false);
	const [submitType, setSubmitType] = useState();//提交类型，编辑还是添加,通过驳回

	//审批操作
	const showExamineForm = (status) => {
		if (status == 'open') {
			setExamineStatus(true)
		} else {
			setFpalertContent('');
			setBatchTableList([]);
			examineRef.current?.resetFields();
			setExamineStatus(false)
		}
	}

	const [isBatch, setIsBatch] = useState('N');// 是否是批量
	const [saFileList, setSaFileList] = useState([]);
	const [batchData, setBatchData] = useState([]);

	/** table组件 start */
	const rowKey = (record => record.id);//列表唯一值
	const tableHeight = clientHeight;//列表高度
	const tableKey = 'changeapproval';//table 定义的key
	const rowSelection = true;//是否开启多选框
	const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
	const columnvalue = 'changeapprovalcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
	const apishowurl = '/cfg.php?controller=confAssetManage&action=showSignChangeApply';//接口路径
	const [queryVal, setQueryVal] = useState();//首个搜索框的值
	let searchVal = { queryVal: queryVal, queryType: 'fuzzy', showType: 'approval' };//顶部搜索框值 传入接口
	let expandData = {};
	const onExpandUrl = '/cfg.php?controller=confAssetManage&action=showSignChangeSingleApply';
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
				placeholder={language('project.assmngt.approval.changesearch')}
				style={{ width: 200 }}
				onSearch={(queryVal) => {
					setQueryVal(queryVal);
					incAdd();
				}}
			/>
		)
	}

	/** table组件 end */

	useEffect(() => {
		getDynamicField();
	}, [])

	const incAdd = () => {
		let inc;
		clearTimeout(inc);
		inc = setTimeout(() => {
			setIncID((incID) => incID + 1);
		}, 100);
	}

	/**
 * 获取动态字段列表 attribute  private 私有  public 公有
 * type   table 表头  form form 表单字段   formtable 导入内容字段
 * */
	const getDynamicField = (type = 'table', attribute = 'public', buisusg = '', record = {}) => {
		let data = {};
		data.filterType = 'dynamic';
		data.modtype = 'asset';
		data.attribute = attribute;
		data.buisusg = buisusg;
		post('/cfg.php?controller=confResField&action=showResFieldList', data).then((res) => {
			if (res.data) {
				if (type == 'submit' || type == 'save' || type == 'tableSubmit') {
					let arr = dynamicFieldList.length >= 1 ? dynamicFieldList : dynamicFieldListLet;
					setPrivateField(arr.concat(res.data));
					privateFieldList = arr.concat(res.data);
				} else {
					if (attribute == 'public') {
						setDynamicFieldList(res.data);
						dynamicFieldListLet = res.data;
						if (type == 'table') {
							tableList(type, res.data, columnsList, attribute);
						} else if (type == 'formtable') {
							tableList(type, res.data, columnsFileOld ? columnsFileOld : columnsFileOldList, attribute);
						} else {
							setPrivateField(res.data);
							privateFieldList = res.data;
						}
					} else {
						if (type == 'table') {
							tableList(type, res.data, columnsOld, attribute);
						} else if (type == 'formtable') {
							tableList(type, res.data, columnsFileOld ? columnsFileOld : columnsFileOldList, attribute);
						} else {
							let arr = dynamicFieldList.length >= 1 ? dynamicFieldList : dynamicFieldListLet;
							setPrivateField(arr.concat(res.data));
							privateFieldList = arr.concat(res.data);
							let arrList = [...columnsFileOld ? columnsFileOld : columnsFileOldList];
							res.data?.map((item) => {
								let info = {};
								info.title = item.name;
								info.dataIndex = item.key;
								info.ellipsis = true;
								info.importStatus = true;
								info.width = 100;
								info.onCell = (record, rowIndex, key) => {
									if (record.changedFields && record.changedFields.indexOf(item.key) != -1) {
										return { className: 'tabletdcolor' }
									}
								}
								arrList.splice(-1, 0, info);
							})
							setUploadColumnsBatch([...arrList]);
							if (type == 'approve' && record.batch == 'Y') {
								showPSignINApply(record, 'batchlist');
							} else {
								seeModalFrame(record, type, privateFieldList);
							}
						}
					}
				}
			}
		}).catch(() => {
			console.log('mistake')
		})
	}

	//处理表头数据
	const tableList = (type, data, list, attribute) => {
		let columnsArr = [...list];
		data.map((item) => {
			let info = {};
			info.title = item.name;
			info.dataIndex = item.key;
			info.ellipsis = true;
			info.importStatus = true;
			info.width = 100;
			info.onCell = (record, rowIndex, key) => {
				if (record.changedFields && record.changedFields.indexOf(item.key) != -1) {
					return { className: 'tabletdcolor' }
				}
			}
			columnsArr.splice(-1, 0, info);
		})
		if (attribute == 'public' && type == 'table') {
			let fileColumnArr = [...uploadColumns];
			data.map((item) => {
				let info = {};
				info.title = item.name;
				info.dataIndex = item.key;
				info.ellipsis = true;
				info.importStatus = true;
				info.width = 100;
				info.onCell = (record, rowIndex, key) => {
					if (record.changedFields && record.changedFields.indexOf(item.key) != -1) {
						return { className: 'tabletdcolor' }
					}
				}
				fileColumnArr.splice(-1, 0, info);
			})
			setColumns([...columnsArr]);
			setColumnsOld([...columnsArr]);
			setColumnsFileOld([...fileColumnArr]);
			columnsFileOldList = [...fileColumnArr];
			setColumnsNew([...fileColumnArr]);
		} else if (type == 'table') {
			setColumns([...columnsArr]);
			incAdd();
		} else {
			setColumnsNew([...columnsArr]);
		}
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
	const seeModalFrame = (record, type, changeArr = []) => {
		let data = {};
		data.id = record.id;
		data.batch = record.batch;
		post('/cfg.php?controller=confAssetManage&action=showSignChangeFlow', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			res.data.baseInfo = res.data.baseInfo ? res.data.baseInfo : {};
			res.data.baseInfo.ipaddr = res.data.ipaddr;
			res.data.baseInfo.queryAddr = res.data.queryAddr;
			res.data.baseInfo.id = record.orderID;
			res.data.baseInfo.orderID = record.orderID;
			setInitialValue(res.data.baseInfo);
			if (record.batch == 'Y') {
				setSaFileList(res.data ? res.data.changeInfo : []);
			} else {
				let dataInfo = [
					{ 'changefield': language('project.assmngt.resapply.user'), 'changeinfo': res.data.changeInfo?.user },
					{ 'changefield': language('project.assmngt.resapply.contactnumber'), 'changeinfo': res.data.changeInfo?.phone },
					{ 'changefield': language('project.assmngt.assetmodel'), 'changeinfo': res.data.changeInfo?.assetModel },
					{ 'changefield': language('project.assmngt.assettype'), 'changeinfo': res.data.changeInfo?.assetType },
					{ 'changefield': language('project.assmngt.macaddr'), 'changeinfo': res.data.changeInfo?.macaddr },
					{ 'changefield': language('project.assmngt.wherevlan'), 'changeinfo': res.data.changeInfo?.vlan },
					{ 'changefield': language('project.assmngt.location'), 'changeinfo': res.data.changeInfo?.location },
					{ 'changefield': language('project.assmngt.resapply.businesspurpose'), 'changeinfo': res.data.changeInfo?.buisUsg },
				]
				if (changeArr.length > 0) {
					changeArr.map((item) => {
						dataInfo.push({ 'changefield': item.name, 'changeinfo': res.data.changeInfo[item.key] });
					})
				}
				setDataInfo(dataInfo);
				res.data.changeInfo.ipaddr = res.data.ipaddr;
				res.data.changeInfo.macaddr = res.data.macaddr;
				setChangeInfo(res.data.changeInfo);
			}
			setApprovalProcessList(res.data.flowInfo ? res.data.flowInfo : []);
			if (type == 'see') {
				getSeeModal(1);
			} else {
				if (record.batch == 'Y') {
					showExamineForm('open');
				} else {
					getApporvalModal(1)
				}
			}
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

	//操作关闭后清空数据
	const operationOffEmpty = () => {
		//清空弹框上部列表信息
		setInitialValue([]);
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
		post('/cfg.php?controller=confAssetManage&action=showSignChangeSingleApply', data).then((res) => {
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
				setBatchTableList(res.data ? res.data : []);
				showExamineForm('open');
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

	//审批通过
	const approvalAdopt = (values = '', type = '') => {
		let data = {};
		let obj = '';
		if (type == 'batch') {
			obj = examineRef.current.getFieldsValue(['reason']);
			data.batch = 'Y';
			data.list = JSON.stringify(batchTableList);
		} else {
			obj = formRef.current.getFieldsValue(['reason']);
		}
		data.notes = obj.reason;
		data.orderID = recordFind.orderID;
		for (const key in changeInfo) {
			data[key] = changeInfo[key];
		}
		post('/cfg.php?controller=confAssetManage&action=agreeSignChangeApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			if (type == 'batch') {
				showExamineForm('close');
			} else {
				allApporvalModal();
			}
			incAdd();
		}).catch(() => {
			console.log('mistake')
		})
	}

	//审批驳回
	const approvalReject = (type = '') => {
		let obj = '';
		let data = {};
		if (type == 'batch') {
			data.batch = 'Y';
			obj = examineRef.current.getFieldsValue(['reason', 'id']);
		} else {
			obj = formRef.current.getFieldsValue(['reason', 'id']);
		}
		data.orderID = recordFind.orderID;
		data.notes = obj.reason;
		post('/cfg.php?controller=confAssetManage&action=rejectSignChangeApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			if (type == 'batch') {
				showExamineForm('close');
			} else {
				allApporvalModal();
			}
			incAdd();
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

	//批量审批 alert
	const examinSearchDiv = () => {
		return (
			<Space>
				<Alert
					className="applyUpAlert"
					type="info"
					showIcon
					message={<div>{language('project.assmngt.columntagfield')}<div className='yellowbox'></div>{language('project.assmngt.indicatescontentafterchange')}</div>}
					style={{ width: 418 }}
				/>
			</Space>
		)
	}
	return (<>
		<ProtableModule onExpandUrl={onExpandUrl} expandAble={expandAble} developShowKey={developShowKey} expandData={expandData} concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} rowSelection={rowSelection} />

		{/* 审批弹出框 */}
		<DrawerForm
			formRef={formRef}
			width="570px"
			key='chapprovalmodalfrom'
			className='chapprovalmodalfrom'
			title={language('project.assmngt.resapply.approveoperation')}
			visible={approvalModalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'closeachangebuttonright',
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
			submitTimeout={2000} >
			<Alert className='caddressalertinfo' message={language('project.assmngt.changeipaddrcontent', { ipaddr: initialValue.queryAddr })} type="info" showIcon icon={<img src={Substitute} />} />
			<Divider orientation='left'>{language('project.assmngt.oldinfo')}</Divider>
			<div className='aapplicationinformations'>
				<ProDescriptions column={2}>
					<ProDescriptions.Item name='applicant' label={language('project.assmngt.resapply.user')}>{initialValue.user ? initialValue.user : ''} </ProDescriptions.Item>
					<ProDescriptions.Item name="phone" label={language('project.assmngt.resapply.contactnumber')}>{initialValue.phone ? initialValue.phone : ' '}</ProDescriptions.Item>
				</ProDescriptions>
				<ProDescriptions column={2}>
					<ProDescriptions.Item name='zone' label={language('project.assmngt.resapply.zone')}>{initialValue.zone ? initialValue.zone : ''} </ProDescriptions.Item>
					<ProDescriptions.Item name="org" label={language('project.assmngt.resapply.organization')}>{initialValue.org ? initialValue.org : ' '}</ProDescriptions.Item>
				</ProDescriptions>
				<ProDescriptions column={2}>
					<ProDescriptions.Item name='assetType' label={language('project.assmngt.assettype')}>{initialValue.assetType ? initialValue.assetType : ''}</ProDescriptions.Item>
					<ProDescriptions.Item name='purpose' label={language('project.assmngt.resapply.businesspurpose')}>{initialValue.buisUsg ? initialValue.buisUsg : ''}</ProDescriptions.Item>
				</ProDescriptions>
				<ProDescriptions column={2}>
					<ProDescriptions.Item name='ipaddr' label={language('project.assmngt.ipaddr')}>{initialValue.ipaddr ? initialValue.ipaddr : ''}</ProDescriptions.Item>
					<ProDescriptions.Item name='vlan' label={language('project.assmngt.wherevlan')}>{initialValue.vlan ? initialValue.vlan : ''}</ProDescriptions.Item>
				</ProDescriptions>
				<ProDescriptions column={2}>
					<ProDescriptions.Item name='location' label={language('project.assmngt.location')}>{initialValue.location ? initialValue.location : ''}</ProDescriptions.Item>
					{privateField.length - 1 == -1 ?
						'' :
						<ProDescriptions.Item label={privateField[0].name} >{initialValue[privateField[0].key] ? initialValue[privateField[0].key] : ''}</ProDescriptions.Item>
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
						{SignatureShow(changeInfo.signature, seeUploadFile)}
					</ProDescriptions.Item>
				</ProDescriptions> : ''}
			</div>

			<Divider orientation='left'>{language('project.assmngt.changeinfo')}</Divider>
			<div className='assignmentinformation alfrommodalmargin'>
				<ProTable
					size="small"
					className='assignmentinformationtable'
					scroll={{ y: 108 }}
					//边框
					cardBordered={true}
					bordered={true}
					rowkey='id'
					//单选框选中变化
					rowSelection={false}
					//设置选中提示消失
					tableAlertRender={false}
					columns={columnsInfoSee}
					//页面数据信息
					dataSource={dataInfo}
					editable={{
						type: 'multiple',
					}}
					//头部搜索框关闭
					search={false}
					pagination={false}
					dateFormatter="string"
					headerTitle={false}
					toolBarRender={false}
				/>
			</div>
			<Divider orientation='left'>{language('project.assmngt.approval.approvaloperation')}</Divider>
			<div className='approvalprocess alfrommodalmargin'>
				<ProFormText hidden={true} name="id" initialValue={initialValue.id} label="id" />
				<ProFormTextArea width='100%' name="reason" rules={[{ required: true, message: language('project.pleasefill') }]} label={language('project.assmngt.resapply.approvedescription')} />
			</div>
		</DrawerForm>

		{/** 批量审批弹出框 */}
		<DrawerForm
			className="uploadasaChangeForm"
			title={<div>{language('project.assmngt.assapply.assoperate')}</div>}
			width="1200px"
			formRef={examineRef}
			visible={examineStatus}
			onVisibleChange={setExamineStatus}
			layout="horizontal"
			labelCol={{ xs: { span: 4 } }}
			wrapperCol={{ xs: { span: 12 } }}
			drawerProps={{
				className: 'closebuttonright',
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
								setSubmitType('adopt');
								examineRef.current.submit();
							}}
						>
							<span className='buttonmargint'>{language('project.adopt')}</span>
						</Button>,
						<Button kye="2" icon={<CloseCircleOutlined />} type='primary' danger
							onClick={() => {
								setSubmitType('reject');
								examineRef.current.submit();
							}}
						>
							<span className='buttonmargint'>{language('project.reject')}</span>
						</Button>
					]
				}
			}}
			onFinish={async (values) => {
				if (submitType == 'adopt') {
					approvalAdopt(values, 'batch');
				} else if (submitType == 'reject') {
					approvalReject('batch');
				}
			}}
		>
			<ProTable
				size="small"
				columns={uploadColumnsBatch}
				scroll={{ y: 500 }}
				dataSource={batchTableList}
				search={false}
				options={true}
				headerTitle={examinSearchDiv()}
				rowSelection={false}
				rowKey="id"
				pagination={false}
			/>
			<ProCard ghost >
				<ProCard ghost bodyStyle={{ padding: 0 }}>
					<ProFormItem label={language('project.assmngt.assapply.signfile')}>
						{SignatureShow(initialValue.signature, seeUploadFile)}
					</ProFormItem>
					<ProFormTextArea name='reason' rules={[{ required: true }]} label={language('project.assmngt.assapply.assspplytip')} width='280px' />
				</ProCard>
				<ProCard ghost bodyStyle={{ padding: 0 }}>
				</ProCard>
			</ProCard>
		</DrawerForm>

		{/* //查看弹出框 */}
		<DrawerForm
			labelCol={{ xs: { span: 9 } }}
			wrapperCol={{ xs: { span: 12 } }}
			width="570px"
			layout="horizontal"
			className='chseemodalfrom'
			key='chseemodalfrom'
			formRef={formRef}
			title={language('project.assmngt.resapply.approveview')}
			visible={seeModalStatus} autoFocusFirstInput
			submitter={false}
			drawerProps={{
				className: 'closeachangebuttonright',
				destroyOnClose: true,
				maskClosable: false,
				placement: 'right',
				onClose: () => {
					allSeeModal(2)
				},
			}}
			onVisibleChange={setSeeModalStatus}
			submitTimeout={2000} onFinish={async (values) => {
			}}>
			{recordFind.batch == 'Y' ?
				<>
					<Divider orientation='left'>{language('project.assmngt.changeinfo')}</Divider>
					<div className='batchlistbox' >
						<div>
							<ProTable
								size="small"
								columns={uploadColumnsBatch}
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
										{SignatureShow(changeInfo.signature, seeUploadFile)}
									</ProDescriptions.Item>
								</ProDescriptions></div> : ''}

					</div></>
				:
				<>
					<Alert className='caddressalertinfo' message={language('project.assmngt.changeipaddrcontent', { ipaddr: initialValue.queryAddr })} type="info" showIcon icon={<img src={Substitute} />} />
					<Divider orientation='left'>{language('project.assmngt.oldinfo')}</Divider>
					<div className='capplicationinformation'>
						<ProDescriptions column={2}>
							<ProDescriptions.Item name='applicant' label={language('project.assmngt.resapply.user')}>{initialValue.user ? initialValue.user : ''} </ProDescriptions.Item>
							<ProDescriptions.Item name="phone" label={language('project.assmngt.resapply.contactnumber')}>{initialValue.phone ? initialValue.phone : ' '}</ProDescriptions.Item>
						</ProDescriptions>
						<ProDescriptions column={2}>
							<ProDescriptions.Item name='zone' label={language('project.assmngt.resapply.zone')}>{initialValue.zone ? initialValue.zone : ''} </ProDescriptions.Item>
							<ProDescriptions.Item name="org" label={language('project.assmngt.resapply.organization')}>{initialValue.org ? initialValue.org : ' '}</ProDescriptions.Item>
						</ProDescriptions>
						<ProDescriptions column={2}>
							<ProDescriptions.Item name='assetType' label={language('project.assmngt.assettype')}>{initialValue.assetType ? initialValue.assetType : ''}</ProDescriptions.Item>
							<ProDescriptions.Item name='purpose' label={language('project.assmngt.resapply.businesspurpose')}>{initialValue.buisUsg ? initialValue.buisUsg : ''}</ProDescriptions.Item>
						</ProDescriptions>
						<ProDescriptions column={2}>
							<ProDescriptions.Item name='ipaddr' label={language('project.assmngt.ipaddr')}>{initialValue.ipaddr ? initialValue.ipaddr : ''}</ProDescriptions.Item>
							<ProDescriptions.Item name='vlan' label={language('project.assmngt.wherevlan')}>{initialValue.vlan ? initialValue.vlan : ''}</ProDescriptions.Item>
						</ProDescriptions>
						<ProDescriptions column={2}>
							<ProDescriptions.Item name='location' label={language('project.assmngt.location')}>{initialValue.location ? initialValue.location : ''}</ProDescriptions.Item>
							{privateField.length - 1 == -1 ?
								'' :
								<ProDescriptions.Item label={privateField[0].name} >{initialValue[privateField[0].key] ? initialValue[privateField[0].key] : ''}</ProDescriptions.Item>
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
								{SignatureShow(changeInfo.signature, seeUploadFile)}
							</ProDescriptions.Item>
						</ProDescriptions> : ''}
					</div>
					<Divider orientation='left'>{language('project.assmngt.changeinfo')}</Divider>
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
							columns={columnsInfoSee}
							//页面数据信息
							dataSource={dataInfo}
							editable={{
								type: 'multiple',
							}}
							//头部搜索框关闭
							search={false}
							pagination={false}
							dateFormatter="string"
							headerTitle={false}
							toolBarRender={false}
						/>
					</div>
				</>}
			<Divider orientation='left'>{language('project.assmngt.approvalprocess')}</Divider>
			<div className='approvalprocess cfrommodalmargin'>
				<Steps direction='vertical' size='small' >
					{approvalProcess()}
				</Steps>

			</div>
		</DrawerForm>
	</>);
};
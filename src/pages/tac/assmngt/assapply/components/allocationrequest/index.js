import React, { useRef, useState, useEffect, createRef, useReducer } from 'react';
import { CheckOutlined, CloseCircleOutlined, EditFilled, UnorderedListOutlined, SaveFilled, ClusterOutlined, CloseOutlined, ApiFilled, LoadingOutlined } from '@ant-design/icons';
import { ProTable, ProForm, ModalForm, ProFormText, ProFormTextArea, ProFormSelect, ProCard, ProDescriptions, DrawerForm, EditableProTable, ProFormDateTimePicker, ProFormRadio, ProFormItem } from '@ant-design/pro-components';
import { Button, Input, message, Space, Tag, TreeSelect, Popconfirm, Divider, Steps, Alert, Tooltip, Menu, Modal, Spin } from 'antd';
import { post, fileDown } from '@/services/https';
import { AiFillEye, AiOutlineClockCircle, AiFillInfoCircle } from "react-icons/ai";
import { GoTrashcan } from "react-icons/go";
import DownnLoadFile from '@/utils/downnloadfile.js';
import { Seal, ViewGridList } from '@icon-park/react';
import { BiArchiveOut, BiUserCircle } from "react-icons/bi";
import { regList, regMacList, regSeletcList } from '@/utils/regExp';
import { NameText, NotesText, ContentText } from '@/utils/fromTypeLabel';
import { language } from '@/utils/language';
import { BsFillCheckCircleFill, BsQuestionCircleFill, BsXCircleFill, BsChevronContract } from "react-icons/bs";
import { HandPaintedPlate } from '@icon-park/react';
import { modalFormLayout } from '@/utils/helper';
import SignatureShow from '@/utils/showSignature';
// 导入组件
import '@/utils/index.less';
import './index.less';
import PdfSeize from '@/assets/tac/pdfseize.png'
import PdfBatchSeize from '@/assets/tac/pdfbatchseize.png'
import { TableLayout, PDFViewer, ExportPDF, DynFieldReg } from '@/components';
const { ProtableModule, WebUploadr, SignTable, BatchTemplate } = TableLayout;
let H = document.body.clientHeight - 481
var clientHeight = H
const { Search } = Input
const { Step } = Steps;

var toptextcontent = '200px';
let upTableListData = [];
let batchTableArr = [];
let expandData = {};
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
				if (record.batch == 'Y') {
					showPSignINApply(record, 'submit')
				} else {
					getDynamicField('tableSubmit', 'private', record.buisUsg, record);
				}
			}
			//提交方法
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
			revokeWork(record);
		}} key="revokeWork"
			title={language('project.revokeconfirm')}
			okButtonProps={{
				loading: confirmLoading,
			}} okText={language('project.yes')} cancelText={language('project.no')}>
			<a>{text}</a>
		</Popconfirm>
	);

	//审批列表
	const columnsInfo = [
		{
			title: language('project.assmngt.approval.probutionipaddr'),
			dataIndex: 'ipaddr',
			width: 110,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.resapply.subnet'),
			dataIndex: 'subnet',
			width: 110,
			ellipsis: true,
		},
		{
			title: language('project.assmngt.resapply.servicelife'),
			dataIndex: 'expireTime',
			width: 110,
			valueType: 'option',
			ellipsis: true,
			render: (text, record, _) => {
				if (record.validType == 'forever') {
					return language('project.assmngt.approval.forever');
				} else {
					return record.expireTime;
				}
			}
		},
		{
			title: language('project.mconfig.operate'),
			valueType: 'option',
			width: 45,
			align: 'center',
			render: (text, record, _, action) => [
				<>
					<a key="editable" onClick={() => {
						getMenu();
						getMaskModal(1);
					}}>
						<EditFilled />
					</a>
				</>
			]
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
			title: language('project.assmngt.resapply.orderid'),
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
			width: 100,
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
			title: language('project.resmngt.signaturefile'),
			dataIndex: 'showSignature',
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
			title: language('project.mconfig.operate'),
			valueType: 'option',
			width: 120,
			fixed: 'right',
			align: 'center',
			render: (text, record, _, action) => [
				record.inner == 'Y' ? '' :
					record.opbutton == 'edit' ?
						<>
							<a key="mod" onClick={() => {
								setRecordFind(record);
								setInitialValue(record);
								if (record.batch == 'Y') {
									setModPFromType(true);
									showPSignINApply(record, 'batchtablelist');
								} else {
									mod(record);
								}
							}}>
								<Tooltip title={language('project.edit')} >
									<EditFilled style={{ fontSize: '18px' }} />
								</Tooltip>
							</a>
							{renderRemove(<Tooltip title={language('project.del')} ><GoTrashcan style={{ fontSize: '18px', color: 'red' }} /></Tooltip>, record)}
							{renderSubmit(<Tooltip title={language('project.submit')} ><BiArchiveOut className='seeicon' size={18} style={{ fontSize: '18px', color: '#12C189' }} /></Tooltip>, record)}
						</> : '',
				record.opbutton == 'approve' ?
					<>
						<a key="examine"
							onClick={() => {
								setRecordFind(record);
								setInitialValue(record);
								if (record.batch == 'Y') {
									showPSignINApply(record, 'batchlist');
								} else {
									getDynamicField('form', 'private', record.buisUsg);
									getApporvalModal(1);
								}
							}}>
							<Tooltip title={language('project.approval')} >
								<Seal style={{ fontSize: '16px', color: '#FF7429' }} />
							</Tooltip>
						</a>
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
						{renderRevoke(<Tooltip title={language('project.revoke')} ><i className="mdui-icon material-icons" style={{ color: '#FA561F', fontSize: '18px' }}></i></Tooltip>, record)}
					</> : '',
			],
		},
	];

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
			width: 120,
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
			render: (test, record, index) => {
				if (record.hide == true) {
					return <Input
						onBlur={(e) => {
							if (record.vlan != e.target.value) {
								let row = { ...record }
								row.hide = false;
								row.vlan = e.target.value;
								approvalModalFrame('editvlan', row);
							} else {
								let row = { ...record }
								row.hide = false;
								row.vlan = e.target.value;
								let data = [...upTableListData];
								const index = data.findIndex((item) => record.innerID === item.innerID);
								const item = data[index];
								data.splice(index, 1, {
									...item,
									...row,
								});
								upTableListData = data;
								setUpTableData(data);
							}
						}}
						defaultValue={record.vlan}
						style={{ width: 100 }}
					/>
				} else {
					return <>
						<EditFilled
							onClick={() => {
								let data = [...upTableListData];
								const index = data.findIndex((item) => record.innerID === item.innerID);
								const item = data[index];
								record.hide = true;
								data.splice(index, 1, {
									...item,
									...record,
								});
								data.map((item) => {
									if (item.innerID == record.innerID) {
										item.hide = true;
									}
								})
								upTableListData = data;
								setUpTableData(data);
							}}
							style={{ marginRight: '8px', color: '#1890ff' }} />
						<span>
							{record.vlan}
						</span>
					</>
				}
			}
		},
		{
			title: language('project.assmngt.resapply.ipaddrress'),
			dataIndex: 'ipstr',
			width: 140,
			readonly: true,
			ellipsis: true,
			render: (test, record, index) => {
				return <a onClick={() => {
					setOptionType('mod');
					setImEditRow(record);
					getMenu(false, record);
					getMaskModal(1);
				}}><ApiFilled style={{ marginRight: '8px', color: '#1890ff' }} />{record.ipstr}</a>
			}
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
		{
			title: language('project.mconfig.operate'),
			valueType: 'option',
			width: 80,
			fixed: 'right',
			align: 'center',
			render: (text, record, _, action) => {
				return (
					<Space>
						<Popconfirm
							title={language('project.delconfirm')}
							onConfirm={() => {
								let data = upTableData.length > 0 ? upTableData : upTableListData
								upTableListData = data.filter((item) => item.innerID !== record.innerID)
								setUpTableData(upTableListData)
							}}
						>
							<Tooltip title={language('project.del')}>
								<a>
									<GoTrashcan style={{ fontSize: '18px', color: 'red' }} />
								</a>
							</Tooltip>
						</Popconfirm>
					</Space>
				)
			},
		},
	]

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
			width: 120,
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

	
	const uploadColumnsSp = [
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
			width: 120,
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
			render: (test, record, index) => {
				if(record.vlan){
					if (record.hide == true) {
						return <Input
							onBlur={(e) => {
								if (record.vlan != e.target.value) {
									let row = { ...record }
									row.hide = false;
									row.vlan = e.target.value;
									approvalModalFrame('editvlan', row, 'sp');
								} else {
									let row = { ...record }
									row.hide = false;
									row.vlan = e.target.value;
									let data = [...batchTableList.length >= 1 ? batchTableList : batchTableArr];
									const index = data.findIndex((item) => record.innerID === item.innerID);
									const item = data[index];
									data.splice(index, 1, {
										...item,
										...row,
									});
									batchTableArr = data;
									setBatchTableList(data);
								}
							}}
							defaultValue={record.vlan}
							style={{ width: 100 }}
						/>
					} else {
						return <>
							<EditFilled
								onClick={() => {
									let data = [...batchTableList.length >= 1 ? batchTableList : batchTableArr];
									const index = data.findIndex((item) => record.innerID === item.innerID);
									const item = data[index];
									record.hide = true;
									data.splice(index, 1, {
										...item,
										...record,
									});
									data.map((item) => {
										if (item.innerID == record.innerID) {
											item.hide = true;
										}
									})
									batchTableArr = data;
									setBatchTableList(data);
								}}
								style={{ marginRight: '8px', color: '#1890ff' }} />
							<span>
								{record.vlan}
							</span>
						</>
					}
				}else {
					return '';
				}
			}
		},
		{
			title: language('project.assmngt.resapply.ipaddrress'),
			dataIndex: 'ipstr',
			width: 140,
			readonly: true,
			ellipsis: true,
			render: (test, record, index) => {
				if(record.ipstr){
					return <a onClick={() => {
						setOptionType('sp');
						setImEditRow(record);
						getMenu(false, record);
						getMaskModal(1);
					}}><ApiFilled style={{ marginRight: '8px', color: '#1890ff' }} />{record.ipstr}</a>
				}else {
					return '';
				}

			}
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


	const [saveShowState, setSaveShowState] = useState({ id: '', show: false });

	const pdfFormRef = createRef();
	const zFileFormRef = useRef();
	const uploadRef = useRef();
	const typeName = 'asset_access';
	const [recordFind, setRecordFind] = useState({});
	//签章内容
	const [saModalStatus, setSaModalStatus] = useState(false);//model 签章 
	const [fileModalStatus, setFileModalStatus] = useState(false);//model 签章 
	const [fileModalBanchStatus, setFileModalBanchStatus] = useState(false);//model 签章 
	const [approvalModalStatus, setApprovalModalStatus] = useState(false);//审批弹出框
	const [approvalList, setApprovalList] = useState([]);//审批预分配列表
	const [iPModalStatus, setIPModalStatus] = useState(false);//IP地址选择弹出框
	const [editableKeys, setEditableRowKeys] = useState();//每行编辑的id
	const [ipSelectList, setIpSelectList] = useState([]);//分配ip 选中内容
	const [treelist, setTreelist] = useState([]);//审批子网回显
	const [selectMenuId, setSelectMenuId] = useState();
	const [ipValidType, setIpValidType] = useState('forever');//ip选择单选多选模式
	const [ipValidTime, setIpValidTime] = useState();//时间处理
	const [iPAddrList, setIPAddrList] = useState([]);//掩码IP地址按钮数据
	const [subNetList, setSubNetList] = useState([]);//添加下拉修改子网地址
	const [signTitle, setSignTitle] = useState();
	const [signName, setSignName] = useState();
	const [signDataTime, setSignDataTime] = useState();
	const [batchData, setBatchData] = useState([]);
	const [topData, setTopData] = useState([]);
	let topList = [];
	const [bottomData, setBottomData] = useState([]);
	const [modPFromType, setModPFromType] = useState(false);
	const [fpalertContent, setFpalertContent] = useState();

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
			setPdfUrl('data:application/pdf;base64,' + res.signature)
		}
	}

	//接口参数 上传
	const paramentUpload = {
		'filecode': 'utf-8',
	}
	const fileList = [];
	const uploadConfig = {
		accept: '.csv', //接受上传的文件类型：zip、pdf、excel、image
		max: 100000000000000, //限制上传文件大小
		url: '/cfg.php?controller=confAssetManage&action=importApply',
	}

	const formRef = useRef();
	const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
	const [seeModalStatus, setSeeModalStatus] = useState(false);//model 查看弹框状态
	const [op, setop] = useState('add');//选中id数组
	const [initialValue, setInitialValue] = useState([]);//默认查看头部列表数据
	const [purposeList, setPurposeList] = useState([]);//业务用途
	const [assettypeList, setAssettypeList] = useState([]);//资产类型
	const [dataSource, setDataSource] = useState([]);
	const [approvalProcessList, setApprovalProcessList] = useState([]);//审批流程列表数据
	const [dynamicFieldList, setDynamicFieldList] = useState([]);//动态字段列表
	let dynamicFieldListLet = [];
	const [privateField, setPrivateField] = useState([]);//私有动态字段列表
	let privateFieldList = [];//私有动态字段列表
	const [submitType, setSubmitType] = useState();//提交类型，编辑还是添加
	//区域数据
	const zoneType = 'zone';
	const [treeValue, setTreeValue] = useState();
	const [treeData, setTreeData] = useState([]);
	const [zoneVal, setZoneVal] = useState();//添加区域id、
	const [zoneNameVal, setZoneNameVal] = useState();//添加区域名称

	//组织机构
	const orgType = 'org';
	const [orgValue, setOrgValue] = useState();
	const [orgData, setOrgData] = useState([]);
	const [orgVal, setOrgVal] = useState();//添加组织结构id、
	const [orgNameVal, setOrgNameVal] = useState();//添加组织结构名称

	const [spinning, setSpinning] = useState(false);
	const [imoritModalStatus, setImoritModalStatus] = useState(false);//导入 上传文件弹出框
	const [importFieldsList, setImportFieldsList] = useState([]) //导入 选择字段
	let importArrFields = [] //导入 选择字段
	const [impErrorShow, setImpErrorShow] = useState(false) //是否显示错误提示
	const [impErrorMsg, setImpErrorMsg] = useState(true) //错误提示信息
	const [importBui, setImportBui] = useState(' ') //导入业务用途
	const [importFieldsArr, setImportFieldsArr] = useState([]) //导入 选择字段数组
	const [columns, setColumns] = useState(columnsList);//table 头部数据
	const [columnsOld, setColumnsOld] = useState(columnsList);//旧table 头数据,包含公有动态字段
	const [columnsFileOld, setColumnsFileOld] = useState(uploadColumns) //新table 头数据,包含公有动态字段, 导入使用 保持原有数据
	const [columnsNew, setColumnsNew] = useState(uploadColumns) //新table 头数据,包含公有动态字段, 导入使用
	const [imEditRow, setImEditRow] = useState({});
	const [optionType, setOptionType] = useState();
	const [isBatch, setIsBatch] = useState(false);
	const [saFileList, setSaFileList] = useState([]);
	const examineRef = useRef()
	const [examineStatus, setExamineStatus] = useState(false);

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

	const examinSearchDiv = () => {
		return (
			<Space>
				<Alert
					className="applyUpAlert"
					type="info"
					showIcon
					message={language('project.assmngt.assapply.titletip')}
					style={{ width: 418 }}
				/>
			</Space>
		)
	}


	//上传后table展开
	const actionRef = useRef();
	const upTableRef = useRef();
	const [upTableSta, setUpTableSta] = useState(false);
	const [upTableData, setUpTableData] = useState([]);
	const [batchTableList, setBatchTableList] = useState([]);
	const [upTotal, setUpTotal] = useState('');
	const assetflowsq = 'ASSETFLOW_SQ';

	/** table组件 start */
	const rowKey = (record => record.id);//列表唯一值
	const tableHeight = clientHeight;//列表高度
	const tableKey = 'aallocationrequest';//table 定义的key
	const rowSelection = true;//是否开启多选框
	const addButton = true; //增加按钮  与 addClick 方法 组合使用
	const uploadButton = true; //导入按钮 与 uploadClick 方法 组合使用
	const downloadButton = false; //导出按钮 与 downloadClick 方法 组合使用
	const addTitle = language('project.assmngt.resapply.apply');
	const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
	const columnvalue = 'aallocationrequestcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
	const apishowurl = '/cfg.php?controller=confAssetManage&action=showSignINApply';//接口路径
	const [queryVal, setQueryVal] = useState();//首个搜索框的值
	let searchVal = { queryVal: queryVal, queryType: 'fuzzy', showType: 'apply', flow: typeName, assetflow: assetflowsq };//顶部搜索框值 传入接口
	const onExpandUrl = '/cfg.php?controller=confAssetManage&action=showSignINSingleApply';
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
				placeholder={language('project.assmngt.resapply.dissearch')}
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
		getDynamicField('from', 'public');
		getModal(1, 'add');
	}

	//导入按钮
	const uploadClick = () => {
		getImportModal(1);
	}

	const [fileDownLoading, setFileDownLoading] = useState(false);
	const loadIcon = <LoadingOutlined spin />
	//导出按钮
	const downloadClick = () => {
		let api = '/cfg.php?controller=confAssetManage&action=exportApply';
		let data = {};
		data.module = columnvalue;
		data.value = JSON.stringify(columnsNew);
		DownnLoadFile(api, data, setFileDownLoading)
	}

	/** table组件 end */

	/* 导入 */
	const getImportModal = (status) => {
		if (status == 1) {
			setImoritModalStatus(true);
		} else {
			setImoritModalStatus(false);
		}
	}

	/* 导入弹框关闭 */
	const getCloseImport = (type) => {
		setSpinning(false);
		setImpErrorMsg();
		setImpErrorShow(false);
		getImportModal(2);
		setImportBui(' ');
		if (type == 2) {
			setColumnsNew([...columnsFileOld]);
		}
		setImportFieldsList([]);
		importArrFields = [];
		setImportFieldsArr([]);
	}

	/* 导入成功文件返回 */
	const onFileSuccess = (res) => {
		if (res.success) {
			let info = [{ value: '', label: '请选择' }];
			res.data.map((val, index) => {
				res.data[index] = val.trim();
				let confres = [];
				confres.label = val;
				confres.value = index + '&&' + val.trim();
				info.push(confres)
			})
			setImportFieldsList(res.data);
			importArrFields = res.data;
			setImportFieldsArr(info);
		} else {
			setImpErrorMsg(res.msg);
			setImpErrorShow(true);
		}
	}

	//导入弹框开启
	const showUpTable = (status, record) => {
		if (status == 'open') {
			setUpTableSta(true)
		} else {
			upTableListData = [];
			setUpTableData([]);
			setModPFromType(false);
			setUpTableSta(false)
		}
	}

	//table提示内容
	const upSearchDiv = () => {
		return modPFromType ? (
			<Space>
				<Alert
					className="applyUpAlert"
					type="info"
					showIcon
					message={language('project.assmngt.assapply.titletip')}
					style={{ width: 418 }}
				/>
			</Space>
		) : (
			<Space>
				<Search
					placeholder={language('project.search')}
					style={{ width: 160 }}
					onSearch={(queryVal) => {
					}}
				/>
				<Alert
					className="applyUpAlert"
					type="info"
					showIcon
					message={language('project.assmngt.applyrcd.dataTotal', {
						upTotal: upTotal,
					})}
				/>
			</Space>
		);

	}

	//导入功能
	const handleEnter = (option, record, val, list = '') => {
		let data = {}
		data.op = option;
		data.list = JSON.stringify(list ? list : upTableData);
		data.flow = typeName;
		data.batch = 'Y';
		data.assetflow = assetflowsq;
		if (record) {
			data.id = record.id;
		}
		post(
			'/cfg.php?controller=confAssetManage&action=setSignINApply',
			data
		).then((res) => {
			if (!res.success) {
				message.error(res.msg)
				return false
			} else {
				if (val == 'upTable') {
					showUpTable('close')
				}
				if (record.batch == 'Y') {
					closeFileModalBanch();
				}
				message.success(res.msg)
				incIDChange()
			}
		})
	}

	/* 提交导入内容标题 */
	const importTitle = async (info) => {
		setSpinning(true)
		let data = {}
		data.headerLine = JSON.stringify(Object.values(info))
		data.field = JSON.stringify(Object.keys(info))
		post('/cfg.php?controller=confAssetManage&action=importApply', data)
			.then((res) => {
				if (!res.success) {
					setSpinning(false);
					setImpErrorMsg(res.msg);
					setImpErrorShow(true);
					return false;
				}
				message.success(res.msg)
				setUpTableData(res.data);
				upTableListData = res.data;
				setUpTotal(res.total);
				getCloseImport();
				setTimeout(() => {
					setSpinning(false);
					showUpTable('open');
				}, 100)
			})
			.catch(() => {
				setSpinning(false);
				console.log('mistake')
			})
	}

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

		let selKyeNum = selKye[selKye.length - 1];
		let selValNum = selVal[selVal.length - 1];
		formRef.current.setFieldsValue({ zoneID: selKyeNum })
		setTreeValue(selVal.join('/'));
		setZoneVal(selKyeNum)
		setZoneNameVal(selValNum)
		//获取组织机构列表
		getOrg(selKyeNum);
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
		formRef.current.setFieldsValue({ orgID: selKyeNum })
		setOrgValue(selVal.join('/'));
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


	const incAdd = () => {
		let inc;
		clearTimeout(inc);
		inc = setTimeout(() => {
			setIncID(incID + 1);
		}, 100);
	}

	useEffect(() => {
		getTree();
		getBusinessPurpose();
		getAssettype();
		getDynamicField();
	}, [])

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
					save(type == 'tableSubmit' ? 'submit' : type, record, type != 'tableSubmit' ? 'zfile' : '');
				} else {
					if (attribute == 'public') {
						setDynamicFieldList(res.data);
						dynamicFieldListLet = res.data;
						if (type == 'table') {
							tableList(type, res.data, columnsList, attribute);
						} else if (type == 'formtable') {
							tableList(type, res.data, columnsFileOld, attribute);
						} else {
							setPrivateField(res.data);
							privateFieldList = res.data;
						}
					} else {
						if (type == 'table') {
							tableList(type, res.data, columnsOld, attribute);
						} else if (type == 'formtable') {
							tableList(type, res.data, columnsFileOld, attribute);
						} else {
							let arr = dynamicFieldList.length >= 1 ? dynamicFieldList : dynamicFieldListLet;
							setPrivateField(arr.concat(res.data));
							privateFieldList = arr.concat(res.data);
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
			if (type == 'table' && attribute == 'public') {
				columnsArr.splice(-5, 0, info);
			} else {
				columnsArr.splice(-1, 0, info);
			}
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
				fileColumnArr.splice(-1, 0, info);
			})
			setColumns([...columnsArr]);
			setColumnsOld([...columnsArr]);
			setColumnsFileOld([...fileColumnArr]);
			setColumnsNew([...fileColumnArr]);
		} else if (type == 'table') {
			setColumns([...columnsArr]);
			incAdd();
		} else {
			setColumnsNew([...columnsArr]);
		}
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

	//删除功能
	const delList = (record) => {
		let data = {};
		data.ids = record.id;
		post('/cfg.php?controller=confAssetManage&action=delSignINApply', data).then((res) => {
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

	//编辑
	const mod = (record) => {
		//区域显示值
		setTreeValue(record.fullZone);
		setZoneVal(record.zoneID);
		setTreeValue(record.fullZone);
		setZoneNameVal(record.zone);
		//机构显示值
		setOrgValue(record.fullOrg);
		setOrgVal(record.orgID);
		setOrgNameVal(record.org);
		setOrgValue(record.fullOrg);
		setApprovalList(record.ipaddr);
		getDynamicField('from', 'private', record.buisUsg ? record.buisUsg : '');
		setTimeout(function () {
			formRef.current.setFieldsValue(record)
		}, 100)
		getModal(1, 'mod');
	}

	//更新修改功能
	const save = (action, record = '', typeModal = '') => {
		let fieldData = ['id', 'user', 'phone', 'assetType', 'assetModel', 'macaddr', 'vlan', 'location', 'buisUsg', 'notes'];

		let list = privateField.length >= 1 ? privateField : privateFieldList;
		list.map((item) => {
			fieldData.push(item.key)
		})
		let obj = record ? record : formRef.current.getFieldsValue(fieldData);
		let data = {};
		data.op = action;
		data.id = obj.id;
		data.flow = typeName;
		data.zoneID = record ? record.zoneID : zoneVal;
		data.zone = record ? record.fullZone : treeValue;
		data.orgID = record ? record.orgID : orgVal;
		data.org = record ? record.fullOrg : orgValue;
		data.ipaddr = record ? JSON.stringify(record.ipaddr) : JSON.stringify(approvalList);
		data.user = obj.user;
		data.phone = obj.phone;
		data.buisUsg = obj.buisUsg;
		data.assetType = obj.assetType;
		data.assetModel = obj.assetModel;
		data.macaddr = obj.macaddr;
		data.location = obj.location;
		data.vlan = obj.vlan;
		data.notes = obj.notes;
		data.assetflow = assetflowsq;
		list.map((item) => {
			data[item.key] = obj[item.key]
		})
		post('/cfg.php?controller=confAssetManage&action=setSignINApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			if (typeModal == 'zfile') {
				if (record.batch == 'Y') {
					closeFileModalBanch()
				} else {
					closeFileModal();
				}
			} else if (typeModal == 'submit') {
				closeModal();
			}
			incIDChange();
		}).catch(() => {
			console.log('mistake')
		})
	}

	//批量提交
	const plSave = (op = '', list, record = '', type = '') => {
		let data = {}
		data.op = op
		data.id = record.id;
		data.list = JSON.stringify(list)
		data.flow = typeName
		data.batch = 'Y';
		post(
			'/cfg.php?controller=confAssetManage&action=setSignINApply',
			data
		).then((res) => {
			if (!res.success) {
				message.error(res.msg)
				return false
			} else {
				message.success(res.msg)
				incIDChange()
			}
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
				item.value = record[item.key];
			})
		}
		return list;
	}

	//判断是否弹出上传签章文件model
	const getFileModal = (status) => {
		if (status == 1) {
			setFileModalStatus(true);
		} else {
			zFileFormRef.current?.resetFields();
			setFileModalStatus(false);
		}
	}
	const closeFileModal = () => {
		setPrivateField([]);
		privateFieldList = [];
		setPdfUrl();
		getFileModal(2);
	}

	const closeFileModalBanch = () => {
		setPrivateField([]);
		privateFieldList = [];
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
					if (url) {
						setPdfUrl(url);
					}
				}
			}
		})
	}

	//签章流程字段回显
	const signatureTemplate = (record) => {
		let data = {};
		data.name = typeName;
		data.buisusg = record.buisUsg;
		data.isBatch = record.batch;//Y 批量  N单个
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
			} else {
				message.error(res.msg);
				return false;
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
				data.push({ title: record[item.key]})
			})
		}
		return data;
	}

	/**
	 * 申请录入数据提交
	 * @param {*} record 
	 */
	const submitSignINApply = (record, type = '') => {
		let data = {};
		data.id = record.id;
		data.orderID = record.orderID;
		data.assetflow = assetflowsq;
		post('/cfg.php?controller=confAssetManage&action=submitSignINApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			if (type == 'submit') {
				closeFileModal(2);
			} else if (type == 'submitFirst') {
				closeFileModalBanch(2);
			}
			incAdd();
		}).catch(() => {
			console.log('mistake')
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
			} else if (type == 'batchtablelist') {
				setUpTableData(res.data ? res.data : []);
				upTableListData = res.data;
				showUpTable('open');
			} else {
				plSave(type, res.data ? res.data : [], record, 'submit');
			}
		}).catch(() => {
			console.log('mistake')
		})
	}

	//判断是否弹出添加model
	const getModal = (status, op) => {
		setop(op)
		if (status == 1) {
			setModalStatus(true);
		} else {
			formRef.current?.resetFields();
			setModalStatus(false);
		}
	}
	const closeModal = () => {
		setFpalertContent('');
		setTreeValue('');
		setZoneVal();
		setZoneNameVal('')
		setOrgValue('');
		setOrgVal();
		setOrgNameVal('');
		setPrivateField([]);
		privateFieldList = [];
		setApprovalList([]);
		getModal(2);
	}

	//查看判断是否弹出添加model
	const getSeeModal = (status) => {
		if (status == 1) {
			setSeeModalStatus(true);
		} else {
			setPrivateField([]);
			privateFieldList = [];
			formRef.current?.resetFields();
			setSeeModalStatus(false);
		}
	}

	//查看弹出框页面数据赋值
	const seeModalFrame = (record, type) => {
		let data = {};
		data.id = record.id;
		setRecordFind(record);
		if (record.batch == 'Y' && type == 'file') {
			post('/cfg.php?controller=confAssetManage&action=showSignINSingleApply', data).then((res) => {
				setSaFileList(res.data ? res.data : []);
				setParameter({ id: record.id, name: typeName, buisusg: record.buisUsg, isBatch: 'N' });
				if (type == 'file') {
					setParameter({ id: record.id, name: typeName, buisusg: record.buisUsg, isBatch: 'N' });
					uploadSignature(record);
					getFileModalBanch(1);
				} else {
					getSeeModal(1);
				}
			}).catch(() => {
				console.log('mistake')
			})
		} else {
			post('/cfg.php?controller=confAssetManage&action=showSignINFlow', data).then((res) => {
				if (!res.success) {
					message.error(res.msg);
					return false;
				}
				setInitialValue(res.data.applyInfo);
				setApprovalProcessList(res.data.flowInfo);
				if (type == 'file') {
					setParameter({ id: record.id, name: typeName, buisusg: record.buisUsg, isBatch: 'N' });
					uploadSignature(record);
					getDynamicField('form', 'private', record.buisUsg);
					getFileModal(1);
				} else {
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
				}
			}).catch(() => {
				console.log('mistake')
			})
		}
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
										{/* <div style={{ display:'flex',alignItems:'center' }}>
                                    <div className='iconbox' ><AiOutlineClockCircle /></div>
                                    {item.time}
                                </div> */}
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

	//工单撤销功能
	const revokeWork = (record) => {
		let data = {};
		data.id = record.id;
		data.orderID = record.orderID;
		post('/cfg.php?controller=confAssetManage&action=revokeSignINApply', data).then((res) => {
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
		setIncID((incID) => incID + 1);
	}

	// 自动分配功能 start
	// IP地址申请工单子网回显列表
	const getMenu = (type = false, record = '') => {
		let data = {};
		data.zoneID = record ? record.zoneID : initialValue.zoneID;//管理员所属区域id    
		data.orgID = record ? record.orgID : initialValue.orgID;//管理员所属区域id    
		data.vlan = record ? record.vlan : initialValue.vlan;//vlan
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
				setSelectMenuId(res.data[0].id)
				getBottonList(res.data[0].id, record)
			}
		}).catch(() => {
			console.log('mistake')
		})
	}
	// IP地址申请工单子网侧边点击id处理
	const onSelectLeft = (selectedKeys, info) => {
		getBottonList(selectedKeys);
		setSelectMenuId(selectedKeys);
	};

	//自动分配数据
	const approvalModalFrame = (type = 'applyfor', record = '', option = '') => {
		let data = {};
		if (type == 'editvlan') {
			data.orgID = record.orgID;
			data.vlan = record.vlan;
			data.ipList = JSON.stringify(upTableListData.length > 0 ? upTableListData.map(v => { return v.ipstr }) : []);
		} else {
			let obj = formRef.current.getFieldsValue(['vlan']);
			if (type == 'applyfor') {
				data.orgID = orgVal;
			} else {
				data.orgID = initialValue.orgID;
			}
			data.vlan = obj.vlan;
		}
		post('/cfg.php?controller=confAssetManage&action=preAllocIPAddr', data).then((res) => {
			if (!res.success) {
				if (type == 'applyfor') {
					setFpalertContent(res.msg)
				} else {
					message.error(res.msg);
				}
				return false;
			}
			if (type == 'editvlan') {
				record.ipstr = res.data ? res.data[0].ipaddr : '';
				record.ipaddr = res.data ? res.data[0] : {};
				if(option == 'sp'){
					let data = [...batchTableArr];
					const index = data.findIndex((item) => record.innerID === item.innerID);
					const item = data[index];
					data.splice(index, 1, {
						...item,
						...record,
					});
					batchTableArr = data;
					setBatchTableList(data);
				}else {
					let data = [...upTableListData];
					const index = data.findIndex((item) => record.innerID === item.innerID);
					const item = data[index];
					data.splice(index, 1, {
						...item,
						...record,
					});
					upTableListData = data;
					setUpTableData(data);
				}
			} else {
				setFpalertContent('')
				setApprovalList(res.data);
			}
		}).catch(() => {
			console.log('mistake')
		})
	}

	//审批判断是否弹出添加model
	const getApporvalModal = (status) => {
		if (status == 1) {
			setApprovalModalStatus(true);
		} else {
			operationOffEmpty();
			formRef.current?.resetFields();
			setApprovalModalStatus(false);
		}
	}

	//操作关闭后清空数据
	const operationOffEmpty = () => {
		//清空弹框上部列表信息
		setInitialValue([]);
	}

	//通用关闭审批弹框
	const allApporvalModal = () => {
		setPrivateField([]);
		privateFieldList = [];
		setApprovalList([]);
		getApporvalModal(2);
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
		setTreelist();
		setImEditRow({});
		setSelectMenuId();
		setIPAddrList([]);
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
			let row = record ? record : imEditRow;
			res.data.map((item, index) => {
				if (row && row.ipstr == item.ipaddr) {
					item.xzstatus = 2;
				} else {
					item.xzstatus = 1;
				}
			})
			setIPAddrList(res.data);
		}).catch(() => {
			console.log('mistake')
		})
	}

	//地址分配选中数据回显
	const ipaddrShow = (type = 'add') => {
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
		if (imEditRow.innerID) {
			if(optionType == 'sp'){
				let data = [...batchTableList];
				let row = { ...imEditRow };
				row.ipstr = ipSelectList[0].ipaddr;
				row.ipaddr = ipSelectList[0];
				const index = data.findIndex((item) => imEditRow.innerID === item.innerID);
				const item = data[index];
				data.splice(index, 1, {
					...item,
					...row,
				});
				batchTableArr = data;
				setBatchTableList(data);
			}else {
				let data = [...upTableData];
				let row = { ...imEditRow };
				row.ipstr = ipSelectList[0].ipaddr;
				row.ipaddr = ipSelectList[0];
				const index = data.findIndex((item) => imEditRow.innerID === item.innerID);
				const item = data[index];
				data.splice(index, 1, {
					...item,
					...row,
				});
				upTableListData = data;
				setUpTableData(data);
			}
		} else {
			setApprovalList(ipSelectList);
		}
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
			} else if (item.mngState == 'preassign') {
				classname = 'buttonpreassign'
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

	//自动分配按钮
	const votDistribution = (
		<Button key="vot" style={{ width: '80px' }}
			onClick={() => {
				approvalModalFrame()
			}}
		>
			<span className='buttonmargint'>{language('project.assmngt.resapply.automaticdistribution')}</span>
		</Button>
	)
	// 自动分配功能 end

	//审核自动分配按钮
	const shDistribution = (
		<Button key="vot" style={{ width: '80px' }}
			onClick={() => {
				approvalModalFrame('toexamine')
			}}
		>
			<span className='buttonmargint'>{language('project.assmngt.resapply.automaticdistribution')}</span>
		</Button>
	)

	//审批通过
	const approvalAdopt = (value = '', type = '') => {
		let data = {};
		data.flow = typeName;
		if (type == 'batch') {
			let obj = examineRef.current.getFieldsValue(['reason']);
			data.id = recordFind.id;
			data.orderID = recordFind.orderID;
			data.list = JSON.stringify(batchTableList);
			data.notes = obj.reason;
			data.assetflow = assetflowsq;
			data.batch = 'Y';
		} else {
			let obj = formRef.current.getFieldsValue(['reason', 'vlan']);
			data.id = initialValue.id;
			data.orderID = initialValue.orderID;
			data.vlan = obj.vlan;
			data.notes = obj.reason;
			data.ipaddr = JSON.stringify(approvalList);
			data.assetflow = assetflowsq;
		}
		post('/cfg.php?controller=confAssetManage&action=agreeAssetApply', data).then((res) => {
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
		data.assetflow = assetflowsq;

		post('/cfg.php?controller=confAssetManage&action=rejectAssetApply', data).then((res) => {
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

	//地址分配接口
	const preAllocBatchIPAddr = (type = '') => {
		let data = {};
		data.list = JSON.stringify(type == 'assoperate' ? batchTableList : upTableData);
		if (type == 'assoperate') {
			let vlan = examineRef.current.getFieldsValue(['vlan']);
			data.vlan = vlan.vlan;
			data.orgID = recordFind.orgID;
		}
		post('/cfg.php?controller=confAssetManage&action=preAllocBatchIPAddr', data).then((res) => {
			if (!res.success) {
				if (type == 'assoperate') {
					setFpalertContent(res.msg)
				}
				return false;
			}
			if (type == 'assoperate') {
				setBatchTableList(res.data);
			} else {
				setUpTableData(res.data);
			}
		}).catch(() => {
			console.log('mistake')
		})

	}

	const importToolBar = () => {
		return (
			<Button key="button" onClick={() => {
				preAllocBatchIPAddr()
			}} type="primary">
				<ApiFilled />
				{language('project.assmngt.resapply.automaticdistribution')}
			</Button>
		)
	}

	//查看pdf
	const seeUploadFile = (name) => {
		uploadSignature(recordFind, 'seeFile', name)
	}

	return (<>
		<Spin
			tip={language('project.sysdebug.wireshark.loading')}
			spinning={fileDownLoading}
			indicator={loadIcon}
		>
			<ProtableModule developShowKey={developShowKey} expandData={expandData} onExpandUrl={onExpandUrl} uploadButton={uploadButton} uploadClick={uploadClick} downloadButton={downloadButton} downloadClick={downloadClick} concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} addButton={addButton} addClick={addClick} addTitle={addTitle} rowSelection={rowSelection} expandAble={expandAble} />
		</Spin>
		{/* 添加编辑弹出框 */}
		<DrawerForm
			width='510px'
			formRef={formRef}
			htmlType='submit'
			title={op == 'add' ? language('project.assmngt.resapply.allocationrequest') : language('project.assmngt.resapply.allocationrequest')}
			visible={modalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'closebuttonright apyaddmodalfrom',
				destroyOnClose: true,
				maskClosable: false,
				placement: 'right',
				onClose: () => {
					closeModal(2)
				},
			}}
			submitter={{
				render: (props, doms, info) => {
					return [
						doms[0],
						<Button key="buttonsave" type='primary' htmlType='submit'
							onClick={() => {
								setSubmitType('save');
								formRef.current.submit();
							}}
						>
							<span className='buttonmargint'>{language('project.save')}</span>
						</Button>,
					]
				}
			}}
			onVisibleChange={setModalStatus}
			onFinishFailed={(values, error, kye) => {
				//提交正则验证失败方法
			}}
			submitTimeout={1000} onFinish={async (values) => {
				save(submitType, '', 'submit');
			}}>
			<div className='contentbox'>
				<ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
					<ProFormText hidden={true} type="hidden" name="id" label="IP" />
					<ProFormText name='zoneID'
						rules={[{ required: true, message: regSeletcList.select.alertText }]}
						label={language('project.assmngt.resapply.zone')}  >
						<TreeSelect
							style={{ width: 200 }}
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
					<ProFormText name='orgID'
						rules={[{ required: true, message: regSeletcList.select.alertText }]}
						label={language('project.assmngt.resapply.organization')} >
						<TreeSelect
							style={{ width: 200 }}
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
						/>
					</ProFormText>
				</ProForm.Group>
				<ProForm.Group style={{ width: "100%" }}>
					<NameText width={toptextcontent} name="user" required={true} label={language('project.assmngt.resapply.user')} />
					<ProFormText width={toptextcontent} name="phone" rules={[{ required: true, pattern: regList.phoneorlandline.regex, message: regList.phoneorlandline.alertText }]} label={language('project.assmngt.resapply.contactnumber')} />
				</ProForm.Group>
				<ProForm.Group style={{ width: "100%" }}>
					<ProFormSelect options={assettypeList}
						width="200px"
						name="assetType"
						label={language('project.assmngt.assettype')}
						rules={[{ required: true, message: language("project.fillin") }]}
					/>
					<ContentText width={toptextcontent} required={true} name="assetModel" label={language('project.assmngt.assetmodel')} />
				</ProForm.Group>
				<ProForm.Group style={{ width: "100%" }}>
					<ProFormText width={toptextcontent} name="macaddr" label={language('project.assmngt.resapply.macaddress')} rules={[{ required: true, pattern: regMacList.mac.regex, message: regMacList.mac.alertText }]} />

					<ProFormText width={'110px'} name="vlan" label={language('project.assmngt.resapply.vlan')} rules={[{ required: true, pattern: regMacList.vlan.regex, message: regMacList.vlan.alertText }]} addonAfter={votDistribution} />
				</ProForm.Group>
				<ProForm.Group style={{ width: "100%" }}>
					<ContentText
            label={language('project.assmngt.location')}
            name="location"
            width={toptextcontent}
            required={true}
          />
					<ProFormSelect options={purposeList}
						width={toptextcontent}
						name="buisUsg"
						rules={[{ required: true }]}
						onChange={(e) => {
							let type = 'public'
							if (e) {
								type = 'private';
							}
							getDynamicField('form', type, e);
						}}
						label={language('project.assmngt.resapply.businesspurpose')}
					/>
				</ProForm.Group>
				{
					privateField.length - 1 == -1 ? '' :
						privateField.map((item, index) => {
							//判断输入形式是下拉框还是列表框
							let info = [];
							if (item.form == 'list') {
								let contents = item.content.split(',');
								if (contents.length > 0) {
									contents.map((val) => {
										let confres = [];
										confres.label = val;
										confres.value = val;
										info.push(confres)
									})
								}
							}
							if (index % 2 == 0) {
								if (privateField.length - 1 < index + 1) {
									return (
										<div className='dynamicbox' style={{ marginLeft: '10px' }}>
											<ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
												{item.form == 'box' ?
													<ProFormText
														width={toptextcontent}
														label={item.name}
														name={item.key}
														rules={DynFieldReg(item.type, item.required)}
														valueType="text"
													/> :
													<ProFormSelect
														width={toptextcontent}
														options={info}
														name={item.key}
														label={item.name}
														rules={DynFieldReg(item.type, item.required)}
													/>
												}
											</ProForm.Group>
										</div>
									)
								} else {
									let privateFieldLen = privateField.length - 1;
									let infoList = [];
									if (privateFieldLen >= index + 1) {
										if (privateField[index + 1].form == 'list') {
											let contents = privateField[index + 1].content.split(',');
											if (contents.length > 0) {
												contents.map((val) => {
													let confres = [];
													confres.label = val;
													confres.value = val;
													infoList.push(confres)
												})
											}
										}
									}
									return (
										<ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
											{item.form == 'box' ?
												<ProFormText
													width={toptextcontent}
													label={item.name}
													name={item.key}
													rules={DynFieldReg(item.type, item.required)}
													valueType="text"
												/> :
												<ProFormSelect
													width={toptextcontent}
													options={info}
													name={item.key}
													label={item.name}
													rules={DynFieldReg(item.type, item.required)}
												/>
											}
											{

												privateFieldLen < 1 ? ' ' :
													privateField[index + 1].form == 'box' ?
														<ProFormText
															width={toptextcontent}
															label={privateField[index + 1].name}
															name={privateField[index + 1].key}
															rules={DynFieldReg(privateField[index + 1].type, privateField[index + 1].required)}
															valueType="text"
														/> :
														<ProFormSelect
															width={toptextcontent}
															options={infoList}
															name={privateField[index + 1].key}
															label={privateField[index + 1].name}
															rules={DynFieldReg(privateField[index + 1].type, privateField[index + 1].required)}
														/>
											}
										</ProForm.Group>

									)
								}

							}
						})
				}
			</div>
			<div style={{ paddingLeft: 10 }}>
				<NotesText name="notes" width='443px' label={language('project.assmngt.resapply.remarks')} required={false} /> 
			</div>
			{fpalertContent ? <Alert
				message={language('project.assmngt.assapply.tiptitle')}
				description={fpalertContent}
				style={{ width: 443, marginLeft: 10 }}
				className='aaddressalertinfo'
				type="warning"
				showIcon
				// closable
				onClose={() => {
					setFpalertContent('')
				}}
			/> :
				<Alert className='aaddressalertinfo' message={language('project.assmngt.addrallc.fromzoneandvlanedit')} type="info" showIcon style={{ width: 443, marginLeft: 10 }} />
			}
			<div className='assignmentinformation alfrommodalmargin'>
				<ProFormText name='applyIPAddr' >
					<EditableProTable
						className='assignmentinformationtable'
						scroll={{ y: 108 }}
						value={approvalList}
						//边框
						cardBordered={true}
						bordered={true}
						//单选框选中变化
						rowSelection={false}
						//设置选中提示消失
						tableAlertRender={false}
						columns={columnsInfo}
						//页面数据信息
						rowKey="id"
						// rowKey={record => record.ipaddr}
						//头部搜索框关闭
						search={false}
						pagination={false}
						dateFormatter="string"
						headerTitle={false}
						toolBarRender={false}
						recordCreatorProps={false}
						editable={{
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
							deleteText: <GoTrashcan style={{ color: 'red' }} />,
						}}
					/>
				</ProFormText>
			</div>
		</DrawerForm>

		{/**导入动态字段 选择 */}
		<DrawerForm {...modalFormLayout}
			formRef={formRef}
			title={language('project.import')}
			visible={imoritModalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'closebuttonright allafilemodal',
				destroyOnClose: true,
				maskClosable: false,
				placement: 'right',
				onClose: () => {
					getCloseImport(2)
				},
			}}
			submitter={{
				render: (props, doms) => {
					return [
						doms[0],
						<Button type='primary' key='subment'
							onClick={() => {
								formRef.current.submit();
							}}
							loading={spinning}
						>
							{language('project.import')}
						</Button>
					]
				}
			}}
			submitTimeout={2000}
			onFinish={async (values) => {
				importTitle(values);
			}}
		>
			<div className='dynamicbox' style={{ marginLeft: '10px' }}>
				<Alert className='filealert' message={language('project.assmngt.assinput.uploadfilebuisusgprivatefield')} type="info" showIcon />
				<div style={{ marginLeft: '4px' }}>
					<ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
						<ProFormSelect options={purposeList}
							width="200px"
							name='spurpose'
							onChange={(e) => {
								let type = 'public'
								if (e) {
									type = 'private';
								}
								setImportBui(e);
								getDynamicField('formtable', type, e);
							}}
							rules={[{ required: true }]}
							label={language('project.assmngt.assinput.businesspurpose')}
						/>
					</ProForm.Group>
				</div>
				<ProForm.Group style={{ width: "100%", display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
					<ProFormText tooltip={language('project.cfgmngt.syszone.fileformatcsv')} label={language('project.cfgmngt.syszone.import')} >
						<div className='importupDiv'>
							<WebUploadr
								isAuto={true}
								upurl={uploadConfig.url}
								upbutext={language('project.cfgmngt.syszone.importfile')}
								maxSize={uploadConfig.max}
								accept={uploadConfig.accept}
								onSuccess={onFileSuccess}
								parameter={paramentUpload}
								isUpsuccess={true}
								isShowUploadList={true}
								maxCount={1}
							/>
						</div>
					</ProFormText>
				</ProForm.Group>
				{impErrorShow ? <Alert className='filealert'
					message={impErrorMsg}
					type="error"
					onClose={() => {
						setImpErrorShow(false);
					}}
					showIcon closable /> : ''}

			</div>
			<Divider orientation='left'>{language('project.datamapping')}</Divider>
			<div className='addrplanborderbox'>
				<ProForm.Group style={{ width: "100%" }}>
					<div style={{ width: '200px', marginBottom: '12px' }}>
						{language('project.importfilefields')}
					</div>
					<div style={{ width: '200px', marginBottom: '12px' }}>
						{language('project.mappingfields')}
					</div>
				</ProForm.Group>
				{
					columnsNew.map((item) => {
						if (item.importStatus) {
							if (item.title == language('project.assmngt.assinput.businesspurpose')) {
								if (importFieldsList.length >= 1 && importFieldsArr.length >= 1) {
									return (
										<ProForm.Group style={{ width: "100%" }}>
											<ProFormText
												width="200px"
												value={importBui}
												disabled
											/>
											<ProFormSelect
												hidden={true}
												width="200px"
												options={importFieldsArr}
												name={item.dataIndex}
												initialValue={
													importFieldsList.indexOf(item.title) == -1
														? ''
														: importFieldsList.indexOf(item.title) +
														'&&' +
														item.title
												}
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
								} else {
									return (
										<ProForm.Group style={{ width: "100%" }}>
											<ProFormText
												width="200px"
												value={importBui}
												disabled
											/>
											<ProFormText
												width="200px"
												value={item.title}
												disabled
											/>
										</ProForm.Group>
									)
								}
							} else {
								if (importFieldsList.length >= 1 && importFieldsArr.length >= 1) {
									return (
										<ProForm.Group style={{ width: "100%" }}>
											<ProFormSelect
												width="200px"
												options={importFieldsArr}
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
								} else {
									return (
										<ProForm.Group style={{ width: "100%" }}>
											<ProFormSelect
												width="200px"
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
							}
						}
					})}
			</div>
		</DrawerForm>


		{/** 导入数据弹出框 批量编辑 */}
		<DrawerForm
			title={modPFromType ? language('project.assmngt.approval.applymod') : <div className="uploadTitle">{language('project.assmngt.applynetworkaccess')}</div>}
			width="1000px"
			formRef={upTableRef}
			visible={upTableSta}
			onVisibleChange={setUpTableSta}
			drawerProps={{
				className: 'asallocationuploadform',
				placement: 'right',
				destroyOnClose: true,
				closable: false,
				maskClosable: false,
				extra: (
					<CloseOutlined
						className="closeIcon"
						onClick={() => {
							showUpTable('close')
						}}
					/>
				),
			}}
			submitter={{
				render: (props, doms) => {
					return [
						doms[0],
						<Button
							type="primary"
							key="submit"
							onClick={() => {
								props.submit()
								// setAction()
								handleEnter('save', modPFromType ? recordFind : '', 'upTable')
							}}
						>
							{language('project.save')}
						</Button>,
						<Button
							type="primary"
							key="submit"
							onClick={() => {
								props.submit()
								handleEnter('submit', modPFromType ? recordFind : '', 'upTable')
							}}
						>
							{language('project.submit')}
						</Button>,
					]
				},
			}}
			onFinish={async (values) => {
			}}
		>
			<ProTable
				columns={columnsNew}
				scroll={{ y: clientHeight - 36 }}
				dataSource={upTableData}
				search={false}
				options={true}
				headerTitle={upSearchDiv()}
				rowSelection={false}
				//分配地址按钮
				toolBarRender={
					modPFromType ? false : importToolBar
				}
				rowKey={record => record.innerID}
				rowClassName={(record) => {
					return modPFromType ? '' :
						record.repeat == 1
							? 'highLight'
							: '' && record.invalid == 'Y'
								? 'invalidVal'
								: ''
				}}
				pagination={false}
			/>
		</DrawerForm>

		{/* //查看弹出框 */}
		<DrawerForm
			labelCol={{ xs: { span: 9 } }}
			wrapperCol={{ xs: { span: 12 } }}
			width="570px"
			layout="horizontal"
			className='seemodalfrom'
			formRef={formRef}
			title={language('project.assmngt.resapply.approveview')}
			visible={seeModalStatus} autoFocusFirstInput
			submitter={false}
			drawerProps={{
				className: 'closebuttonright',
				destroyOnClose: true,
				maskClosable: false,
				placement: 'right',
				onClose: () => {
					getSeeModal(2)
				},
			}}
			onVisibleChange={setSeeModalStatus}
			submitTimeout={2000} >
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
				<div className='sapplicationinformation'>
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
					{recordFind.showSignature == 'Y' ?
						<ProDescriptions column={2}>
							<ProDescriptions.Item name='signature' label={language('project.assmngt.resapply.signaturefile')}>
								{SignatureShow(initialValue.signature, seeUploadFile)}
							</ProDescriptions.Item>
						</ProDescriptions> : ''}
				</div>
			}
			<Divider orientation='left'>{language('project.assmngt.approvalprocess')}</Divider>
			<div className={recordFind.batch == 'Y' ? 'rapprovalprocess frommodalbatchmargin' : 'rapprovalprocess frommodalmargin'}>
				<Steps direction='vertical' size='small' >
					{approvalProcess()}
				</Steps>

			</div>
		</DrawerForm>

		{/* //查看上传签章文件 */}
		<DrawerForm
			width="570px"
			layout="horizontal"
			className='seemodalfrom'
			formRef={zFileFormRef}
			title={language('project.resmngt.uploadsignaturefile')}
			visible={fileModalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'closebuttonright',
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
								// setSubmitType('save');
								// zFileFormRef.current.submit();
							}}
						>
							<span className='buttonmargint'>{language('project.save')}</span>
						</Button>,
						<Button key="buttonsubmit" type='primary'
							onClick={() => {
								setSubmitType('submit');
								zFileFormRef.current.submit();
							}}
						>
							<span className='buttonmargint'>{language('project.submit')}</span>
						</Button>
					]
				}
			}}
			onVisibleChange={setFileModalStatus}
			submitTimeout={1000} onFinish={async (values) => {
				if (recordFind.opbutton != 'approve' && recordFind.opbutton != 'submit') {
					getDynamicField(submitType, 'private', recordFind.buisUsg, recordFind);
				} else {
					submitSignINApply(recordFind, 'submit');
				}
			}} >
			<Divider orientation='left'>{language('project.assmngt.applicationinformation')}</Divider>
			{recordFind.batch == 'Y' ?
				<div style={{ width: '500px', marginLeft: '7px' }}>
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
				:
				<div className='sapplicationinformation'>
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
				</div>
			}
			<Divider orientation='left'>{language('project.resmngt.previewfile')}</Divider>
			<div className='assignmentinformation pdfbox'>
				<div className='seepdfbox'  >
					{pdfUrl ? <PDFViewer url={pdfUrl} />
						: <div><img src={PdfSeize} /></div>
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

		{/* //批量查看上传签章文件 */}
		<DrawerForm
			width="809px"
			layout="horizontal"
			className='seemodalBatchfrom'
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
						<Button key="buttonsubmit" type='primary'
							onClick={() => {
								setSubmitType('submit');
								zFileFormRef.current.submit();
							}}
						>
							<span className='buttonmargint'>{language('project.submit')}</span>
						</Button>
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

		{/* //生成签章文件 */}
		<DrawerForm
			layout="horizontal"
			formRef={formRef}
			className='sarmodalfrom'
			width={'auto'}
			title={language('project.resmngt.generatesignaturefile')}
			visible={saModalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'qzfilenamebox',
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

		{/* IP地址选择弹出框 */}
		<ModalForm
			layout="horizontal"
			className='aaipmodalfrom'
			width="1100px"
			// formRef={formRef}
			title={language('project.assmngt.addrallc.addressassign')}
			visible={iPModalStatus} autoFocusFirstInput
			modalProps={{
				zIndex: 1005,
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
							selectedKeys={selectMenuId}
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
								<Alert className='aaddressalertinfo' message={language('project.assmngt.approval.addsalerttext')} type="info" showIcon />
							</ProCard>
						</ProCard >
						{/* 下层按钮盒子 */}
						<ProCard ghost  >
							<ProCard ghost  >
								<div className='approvalfootbotton' >
									<div className='sapprovalfootbottonone' onMouseDown={(e) => {
										document.onmousemove = (e) => {
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

		{/* 审批弹出框 */}
		<DrawerForm
			formRef={formRef}
			layout="horizontal"
			width="570px"
			title={language('project.assmngt.resapply.approveoperation')}
			visible={approvalModalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'closebuttonright shallocationmodalfrom',
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
								setSubmitType('adopt');
								formRef.current.submit();
							}}
						>
							<span className='buttonmargint'>{language('project.adopt')}</span>
						</Button>,
						<Button kye="2" icon={<CloseCircleOutlined />} type='primary' danger
							onClick={() => {
								setSubmitType('reject');
								formRef.current.submit();
							}}
						>
							<span className='buttonmargint'>{language('project.reject')}</span>
						</Button>
					]
				}
			}}
			onVisibleChange={setApprovalModalStatus}
			submitTimeout={2000} onFinish={async (values) => {
				if (submitType == 'adopt') {
					approvalAdopt(values);
				} else if (submitType == 'reject') {
					approvalReject();
				}
			}}>
			<Divider orientation='left'>{language('project.resmngt.submitformation')}</Divider>
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
				{initialValue.showSignature == 'Y' ? <ProDescriptions column={2}>
					<ProDescriptions.Item name='signature' label={language('project.assmngt.resapply.signaturefile')}>
						{SignatureShow(initialValue.signature, seeUploadFile)}
					</ProDescriptions.Item>
				</ProDescriptions> : ''}
			</div>

			<Divider orientation='left'>{language('project.resmngt.assignmentinformation')}</Divider>
			<div style={{ marginLeft: '57px' }}>
				<Alert className='caddressalertinfo' style={{ marginBottom: '12px', marginLeft: '-18px' }} message={language('project.resmngt.assapply.scanthesigneddocumentspdffilesanduploadthem')} type="info" showIcon />
				<ProFormText name="vlan" width={'260px'} label={language('project.assmngt.wherevlan')} addonAfter={shDistribution} />
			</div>
			<div className='assignmentinformation alfrommodalmargin'>
				<ProFormText name='applyIPAddr' >
					<EditableProTable
						className='assignmentinformationtable'
						scroll={{ y: 108 }}
						value={approvalList}
						//边框
						cardBordered={true}
						bordered={true}
						//单选框选中变化
						rowSelection={false}
						//设置选中提示消失
						tableAlertRender={false}
						columns={columnsInfo}
						//页面数据信息
						rowKey="id"
						// rowKey={record => record.ipaddr}
						//头部搜索框关闭
						search={false}
						pagination={false}
						dateFormatter="string"
						headerTitle={false}
						toolBarRender={false}
						recordCreatorProps={false}
						editable={{
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
							deleteText: <GoTrashcan style={{ color: 'red' }} />,
						}}
					/>
				</ProFormText>
			</div>
			<Divider orientation='left'>{language('project.assmngt.approval.approvaloperation')}</Divider>
			<div className='approvalprocess alfrommodalmargin'>
				<ProFormText hidden={true} name="orderID" initialValue={initialValue.orderID} label="orderID" />
				<div className='sptextbox'>
					{language('project.assmngt.resapply.approvedescription')}:
				</div>
				<ProFormTextArea width='100%' name="reason" rules={[{ required: true }]} />
			</div>
		</DrawerForm>

		{/** 批量审批弹出框 */}
		<DrawerForm
			className="uploadForm"
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
				columns={uploadColumnsSp}
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
					<ProFormText name='vlan' label={language('project.assmngt.assapply.vlan')} addonAfter={<Button type='primary'
						onClick={() => {
							preAllocBatchIPAddr('assoperate')
						}}
					>{language('project.resmngt.resapply.alocipaddr')}</Button>}></ProFormText>
					<ProFormTextArea name='reason' rules={[{ required: true }]} label={language('project.assmngt.assapply.assspplytip')} width='280px' />
				</ProCard>
				<ProCard ghost bodyStyle={{ padding: 0 }}>
					{fpalertContent ? <Alert
						message={language('project.assmngt.assapply.tiptitle')}
						description={fpalertContent}
						type="warning"
						showIcon
						closable
						onClose={() => {
							setFpalertContent('')
						}}
						style={{ width: 480, marginLeft: '-77px' }}
					/> : ''}
				</ProCard>
			</ProCard>
		</DrawerForm>

	</>);
};
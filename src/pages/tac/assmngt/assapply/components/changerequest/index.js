import React, { useRef, useState, useEffect, createRef } from 'react';
import { EditFilled, ClusterOutlined, UnorderedListOutlined, CheckOutlined, CloseCircleOutlined, CloseOutlined, ApiFilled } from '@ant-design/icons';
import { ProTable, ModalForm, ProFormText, ProFormTextArea, ProFormSelect, ProCard, ProDescriptions, DrawerForm, ProForm, ProFormItem } from '@ant-design/pro-components';
import { Button, Input, message, Space, Tag, Popconfirm, Divider, Steps, Alert, Tooltip, TreeSelect, Menu } from 'antd';
import { post } from '@/services/https';
import { language } from '@/utils/language';
import { AiFillEye, AiOutlineClockCircle, AiFillInfoCircle } from "react-icons/ai";
import { GoTrashcan } from "react-icons/go";
import { BiArchiveOut, BiUserCircle } from "react-icons/bi";
import { regMacList, regList } from '@/utils/regExp';
import { NotesText, ContentText } from '@/utils/fromTypeLabel';
import { BsFillCheckCircleFill, BsQuestionCircleFill, BsXCircleFill, BsChevronContract } from "react-icons/bs";
import { HandPaintedPlate, Seal, ViewGridList } from '@icon-park/react';
import { modalFormLayout } from '@/utils/helper';
import '@/utils/index.less';
import './index.less';
import Substitute from '@/assets/nfd/resmngt-substitute.svg';
import PdfSeize from '@/assets/tac/pdfseize.png';
import PdfBatchSeize from '@/assets/tac/pdfbatchseize.png';
import { TableLayout, PDFViewer, ExportPDF } from '@/components';
import SignatureShow from '@/utils/showSignature';
const { ProtableModule, WebUploadr, SignTable, BatchTemplate } = TableLayout;
let H = document.body.clientHeight - 481
var clientHeight = H
const { Search } = Input
const { Step } = Steps;
let upTableListData = [];
let columnsFileOldList = [];
let publicColumnArr = [];
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
			//提交方法
			if (type == 'sqOrder') {
				submitSignINApply(record);
			} else {
				if (record.batch == 'Y') {
					showPSignINApply(record, 'submit')
				} else {
					getDynamicField('tableSubmit', 'private', record.buisUsg, record);
				}
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

	//查看列表
	let columnsInfoSee = [
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

	let columnsInfo = [
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
	let columnsList = [
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
			title: language('project.assmngt.resapply.orderid'), // 编号
			dataIndex: 'orderID',
			width: 150,
			ellipsis: true,
			valueType: 'select',
			key: 'orderID',
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('orderID') != -1) {
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
			title: language('project.assmngt.resapply.organization'),
			dataIndex: 'org',
			width: 120,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('org') != -1) {
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
			title: language('project.assmngt.resapply.applicant'),
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
			title: language('project.assmngt.resapply.phone'),
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
			title: language('project.assmngt.resapply.purpose'),
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
			width: 120,
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
			title: language('project.assmngt.resapply.applypeople'),
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
			title: language('project.assmngt.resapply.approvalperson'),
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
			title: language('project.resmngt.signaturefile'),
			dataIndex: 'signaturefile',
			width: 120,
			ellipsis: true,
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('signaturefile') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
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
										getDynamicField('file', 'private', record.buisUsg ? record.buisUsg : '', record, uploadColumnsFileArr);
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
			onCell: (record, rowIndex, key) => {
				if (record.changedFields?.indexOf('notes') != -1) {
					return { className: 'tabletdcolor' }
				}
			},
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
						record.batch == 'Y' ?
							<>
								{renderRemove(<Tooltip title={language('project.del')} ><GoTrashcan style={{ fontSize: '18px', color: 'red' }} /></Tooltip>, record)}
								{renderSubmit(<Tooltip title={language('project.submit')} ><BiArchiveOut className='seeicon' size={18} style={{ fontSize: '18px', color: '#12C189' }} /></Tooltip>, record)}
							</>
							:
							<>
								<a key="mod" onClick={() => {
									mod(record);
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
								getDynamicField('approve', 'private', record.buisUsg ? record.buisUsg : '', record);
							}}>
							<Tooltip title={language('project.approval')} >
								<Seal style={{ fontSize: '16px', color: '#FF7429' }} />
							</Tooltip>
						</a>
					</>
					: '',
				record.opbutton == 'revoke' ?
					<>
						<a key="editable"
							onClick={() => {
								getDynamicField('see', 'private', record.buisUsg ? record.buisUsg : '', record);
							}}>
							<Tooltip title={language('project.see')} >
								<AiFillEye className='seeicon' size={18} style={{ fontSize: '18px' }} />
							</Tooltip>
						</a>
						{renderRevoke(<Tooltip title={language('project.revoke')} ><i className="mdui-icon material-icons" style={{ color: '#FA561F', fontSize: '18px' }}>&#xe166;</i></Tooltip>, record)}
					</> : '',
				record.opbutton == 'show' ?
					<>
						<a key="editable"
							onClick={() => {
								getDynamicField('see', 'private', record.buisUsg ? record.buisUsg : '', record);
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

			],
		},
	];

	//导入表头
	let uploadColumns = [
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

	//导入表头 审批
	const uploadColumnsSp = [
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
			title: language('project.assmngt.ipaddr'), // MAC地址
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

	//签章表头
	let uploadColumnsFileArr = [
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
			title: language('project.assmngt.ipaddr'), // MAC地址
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
	const [uploadColumnsFile, setuploadColumnsFile] = useState(uploadColumnsFileArr);
	const pdfFormRef = createRef();
	const zFileFormRef = useRef();
	const typeName = 'asset_change';
	const assetflow = 'ASSETFLOW_SQ';
	const [recordFind, setRecordFind] = useState({});
	const [searchChangeVal, setSearchChangeVal] = useState();
	const [isBatch, setIsBatch] = useState('N');// 是否是批量
	const [saFileList, setSaFileList] = useState([]);
	const [batchData, setBatchData] = useState([]);
	const [assettypeList, setAssettypeList] = useState([]) //资产类型

	//接口参数 上传
	const paramentUpload = {
		'filecode': 'utf-8',
	}
	const fileList = [];
	const uploadConfig = {
		accept: '.csv', //接受上传的文件类型：zip、pdf、excel、image
		max: 100000000000000, //限制上传文件大小
		url: '/cfg.php?controller=confAssetManage&action=importChangeApply',
	}

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

	const [examineStatus, setExamineStatus] = useState(false);

	//审批操作
	const showExamineForm = (status) => {
		if (status == 'open') {
			setExamineStatus(true);
		} else {
			setFpalertContent('');
			setBatchTableList([]);
			examineRef.current?.resetFields();
			setExamineStatus(false)
		}
	}

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

	const formRef = useRef();
	const examineRef = useRef();
	const [approvalModalStatus, setApprovalModalStatus] = useState(false);//审批弹出框
	const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
	const [seeModalStatus, setSeeModalStatus] = useState(false);//model 查看弹框状态
	const [op, setop] = useState('add');//选中id数组
	const [initialValue, setInitialValue] = useState({});//默认查看头部列表数据
	const [purposeList, setPurposeList] = useState([]);//业务用途
	const [dataSource, setDataSource] = useState([]);
	const [dataInfo, setDataInfo] = useState([]);//查看 申请 ip 列表
	const [approvalProcessList, setApprovalProcessList] = useState([]);//审批流程列表数据
	//区域数据
	const zoneType = 'zone';
	const [treeValue, setTreeValue] = useState();
	const [treekey, setTreekey] = useState([]);
	const [treeData, setTreeData] = useState([]);
	const [zoneVal, setZoneVal] = useState();//添加组织结构id、
	const [zoneNameVal, setZoneNameVal] = useState();//添加组织结构名称
	//组织机构
	const orgType = 'org';
	const [orgValue, setOrgValue] = useState();
	const [orgkey, setOrgkey] = useState([]);//选中多个key
	const [orgData, setOrgData] = useState([]);
	const [orgVal, setOrgVal] = useState();//添加组织结构id、
	const [orgNameVal, setOrgNameVal] = useState();//添加组织结构名称

	const [changeFpIpaddr, setChangeFpIpaddr] = useState();//产更IP地址

	const [submitType, setSubmitType] = useState();//提交类型，编辑还是添加,通过驳回
	const [dynamicFieldList, setDynamicFieldList] = useState([]);//动态字段列表
	let dynamicFieldListLet = [];
	const [privateField, setPrivateField] = useState([]);//私有动态字段列表
	let privateFieldList = [];//私有动态字段列表
	const [columns, setColumns] = useState(columnsList);//table 头部数据
	const [columnsOld, setColumnsOld] = useState(columnsList);//旧table 头数据,包含公有动态字段
	const [columnsFileOld, setColumnsFileOld] = useState() //新table 头数据,包含公有动态字段, 导入使用 保持原有数据
	const [columnsNew, setColumnsNew] = useState(uploadColumns) //新table 头数据,包含公有动态字段, 导入使用
	const [publicColumn, setPublicColumn] = useState();

	const [uploadColumnsBatch, setUploadColumnsBatch] = useState([]) //新table 头数据,包含公有动态字段, 导入使用
	const [changeInfoBg, setChangeInfoBg] = useState({});

	/** table组件 start */
	const rowKey = (record => record.id);//列表唯一值
	const tableHeight = clientHeight;//列表高度
	const tableKey = 'achangerequest';//table 定义的key
	const uploadButton = true;
	const rowSelection = true;//是否开启多选框
	const addButton = true; //增加按钮  与 addClick 方法 组合使用
	const addTitle = language('project.assmngt.resapply.apply');
	const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
	const columnvalue = 'achangerequestcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
	const apishowurl = '/cfg.php?controller=confAssetManage&action=showSignChangeApply';//接口路径
	const [queryVal, setQueryVal] = useState();//首个搜索框的值
	let searchVal = { queryVal: queryVal, queryType: 'fuzzy', showType: 'apply', flow: typeName, assetflow: assetflow };//顶部搜索框值 传入接口
	let expandData = {};
	const onExpandUrl = '/cfg.php?controller=confAssetManage&action=showSignChangeSingleApply';
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
					incAdd();
				}}
			/>
		)
	}

	//添加按钮点击触发
	const addClick = () => {
		getDynamicField('from', 'private');
		getModal(1, 'add');
	}

	//导入功能
	const uploadClick = () => {
		getImportModal(1);
	}

	/** table组件 end */


	//导入弹框
	const [spinning, setSpinning] = useState(false);
	const [imoritModalStatus, setImoritModalStatus] = useState(false);//导入 上传文件弹出框
	const [importFieldsList, setImportFieldsList] = useState([]) //导入 选择字段
	let importArrFields = [] //导入 选择字段
	const [impErrorShow, setImpErrorShow] = useState(false) //是否显示错误提示
	const [impErrorMsg, setImpErrorMsg] = useState(true) //错误提示信息
	const [importBui, setImportBui] = useState(' ') //导入业务用途
	const [importFieldsArr, setImportFieldsArr] = useState([]) //导入 选择字段数组

	//上传后table展开
	const upTableRef = useRef();
	const [upTableSta, setUpTableSta] = useState(false);
	const [upTableData, setUpTableData] = useState([]);
	const [batchTableList, setBatchTableList] = useState([]);
	const [upTotal, setUpTotal] = useState('');
	const assetflowsq = 'ASSETFLOW_SQ';

	const [modPFromType, setModPFromType] = useState(false);
	//签章
	const [fileModalBanchStatus, setFileModalBanchStatus] = useState(false);
	const [fpalertContent, setFpalertContent] = useState();

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
			setColumnsNew([...columnsFileOld ? columnsFileOld : columnsFileOldList]);
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
				{/* <Search
					placeholder={language('project.search')}
					style={{ width: 160 }}
					onSearch={(queryVal) => {
					}}
				/> */}
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
			'/cfg.php?controller=confAssetManage&action=setSignChangeApply',
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
				incAdd()
			}
		})
	}

	/* 提交导入内容标题 */
	const importTitle = async (info) => {
		setSpinning(true)
		let data = {}
		data.headerLine = JSON.stringify(Object.values(info))
		data.field = JSON.stringify(Object.keys(info))
		post('/cfg.php?controller=confAssetManage&action=importChangeApply', data)
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

	//签章 批量
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


	//区域管理start
	//区域管理 获取默认列表
	const getTree = (id = 1) => {
		// let page = pagestart != ''?pagestart:startVal;
		let data = {};
		data.type = zoneType;
		data.id = id;
		post('/cfg.php?controller=confZoneManage&action=showZoneTree', data).then((res) => {
			const treeInfoData = [
				{
					key: res.id,
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
		setTreeValue(selVal.join('/'));
		setTreekey(selKye);
		setZoneVal(selKyeNum)
		setZoneNameVal(selValNum)
		setOrgValue();
		setOrgkey();
		setOrgVal();
		setOrgNameVal();
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
					info.push({ key: item.id, id: item.id, title: item.name, isLeaf: isLeaf, pId: item.gpid, value: item.id })
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
	const getOrg = (id = 1) => {
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
		setOrgValue(selVal.join('/'));
		setOrgkey(selKye);
		let selKyeNum = selKye[selKye.length - 1];
		let selValNum = selVal[selVal.length - 1];
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
			setIncID((incID) => incID + 1);
		}, 100);
	}

	useEffect(() => {
		getDynamicField();
		getBusinessPurpose();
		getAssettype();//资产类型查询
	}, [])

	/**
 * 获取动态字段列表 attribute  private 私有  public 公有
 * type   table 表头  form form 表单字段   formtable 导入内容字段
 * */
	const getDynamicField = (type = 'table', attribute = 'public', buisusg = '', record = {}, tableColumn = []) => {
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
							if (type == 'see' || type == 'file' || type == 'approve') {
								let arr = [...columnsFileOld ? columnsFileOld : columnsFileOldList];
								let publicFieldArr = [];
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
									publicFieldArr.push(info);
									arr.splice(-1, 0, info);
								})
								if(type == 'file'){
									setuploadColumnsFile([...tableColumn, ...publicColumn ? publicColumn : publicColumnArr, ...publicFieldArr]);
								}
								arr.pop();
								setUploadColumnsBatch([...arr]);
								if (type == 'approve' && record.batch == 'Y') {
									showPSignINApply(record, 'batchlist');
								} else {
									seeModalFrame(record, type, privateFieldList);
								}
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
			let publicFieldArr = [];
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
				publicFieldArr.push(info);
				fileColumnArr.splice(-1, 0, info);
			})
			setPublicColumn(publicFieldArr);
			publicColumnArr = publicFieldArr;
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
		post('/cfg.php?controller=confResField&action=showResField', { id: id })
			.then((res) => {
				let info = []
				res.data.map((item) => {
					let confres = []
					confres.label = item
					confres.value = item
					info.push(confres)
				})
				setAssettypeList(info)
			})
			.catch(() => {
				console.log('mistake')
			})
	}

	//删除功能
	const delList = (record) => {
		let data = {};
		data.ids = record.id;

		post('/cfg.php?controller=confAssetManage&action=delSignChangeApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			setDataSource(dataSource.filter((item) => item.id !== record.id));
			incAdd();
		}).catch(() => {
			console.log('mistake')
		})
	}

	//编辑
	const mod = (record) => {
		let obj = {};
		obj.id = record.id;
		setInitialValue(record);
		getDynamicField('from', 'private', record.buisUsg ? record.buisUsg : '');
		setTimeout(function () {
			formRef.current.setFieldsValue(obj)
		}, 100)
		getModal(1, 'mod');
	}

	//更新修改功能
	const save = (action, record = '', typeModal = '') => {
		let fieldData = ['id', 'user', 'phone', 'assetModel', 'assetType', 'location', 'buisUsg', 'notes', 'vlan', 'macaddr'];
		let list = privateField.length >= 1 ? privateField : privateFieldList;
		list.map((item) => {
			fieldData.push(item.key)
		})

		let fieldNum = list.length;
		let obj = record ? record : formRef.current.getFieldsValue(fieldData);
		let data = {};
		data.op = action;
		data.id = obj.id;
		data.user = obj.user;
		data.phone = obj.phone;
		data.location = obj.location;
		data.assetModel = obj.assetModel;
		data.assetType = obj.assetType;
		data.macaddr = obj.macaddr;
		if (changeFpIpaddr) {
			data.vlan = obj.vlan;
			fieldNum = fieldNum + 1;
		}

		list.map((item) => {
			data[item.key] = obj[item.key] ? obj[item.key] : '';
		})
		let dataNum = 0;
		let num = 0;
		for (const key in data) {
			num = num + 1
			if (!data[key]) {
				dataNum = dataNum + 1;
			}
		}
		if (record == '') {
			if (orgNameVal && !changeFpIpaddr) {
				message.error('请填写修改信息！');
				return false;
			}
			if (data.id) {
				if (dataNum > (5 + fieldNum)) {
					message.error('请填写修改信息！');
					return false;
				}
				data.notes = obj.notes;
				data.ipaddr = record ? record.ipaddr : initialValue.ipaddr;
				if (!data.macaddr) {
					data.macaddr = record ? record.macaddr : initialValue.macaddr;
				}
				data.buisUsg = record ? record.buisUsg : initialValue.buisUsg;
				data.queryAddr = record ? record.queryAddr : searchChangeVal;
				data.flow = typeName;
				data.zone = zoneNameVal ? zoneNameVal : '';
				data.org = orgNameVal ? orgNameVal : '';
				data.newIPAddr = changeFpIpaddr ? JSON.stringify(changeFpIpaddr) : '';
			} else {
				if (dataNum > (6 + fieldNum) || JSON.stringify(initialValue) == '{}') {
					message.error('请填写修改信息！');
					return false;
				}
				data.notes = obj.notes;
				data.ipaddr = record ? record.ipaddr : initialValue.ipaddr;
				if (!data.macaddr) {
					data.macaddr = record ? record.macaddr : initialValue.macaddr;
				}
				data.buisUsg = record ? record.buisUsg : initialValue.buisUsg;
				data.queryAddr = record ? record.queryAddr : searchChangeVal;
				data.flow = typeName;
				data.zone = zoneNameVal ? zoneNameVal : initialValue.zone;
				data.org = orgNameVal ? orgNameVal : initialValue.org;
				data.newIPAddr = changeFpIpaddr ? JSON.stringify(changeFpIpaddr) : '';
			}
		} else {
			data.notes = obj.notes;
			data.ipaddr = record ? record.ipaddr : initialValue.ipaddr;
			if (!data.macaddr) {
				data.macaddr = record ? record.macaddr : initialValue.macaddr;
			}
			data.queryAddr = record ? record.queryAddr : searchChangeVal;
			data.flow = typeName;
			data.buisUsg = record ? record.buisUsg : initialValue.buisUsg;
		}
		post('/cfg.php?controller=confAssetManage&action=setSignChangeApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			message.success(res.msg);
			if (typeModal == 'zfile') {
				closeFileModal();
			} else if (typeModal == 'submit') {
				closeModal();
			}
			incAdd();
		}).catch(() => {
			console.log('mistake')
		})
	}

	/**
	 * 申请录入数据提交
	 * @param {*} record 
	 */
	const submitSignINApply = (record, type = '') => {
		let data = {};
		data.id = record.id;
		data.orderID = record.orderID;
		data.assetflow = assetflow;
		data.flow = typeName;
		post('/cfg.php?controller=confAssetManage&action=submitSignChangeApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			incAdd();
		}).catch(() => {
			console.log('mistake')
		})
	}

	//判断是否弹出添加model
	const getModal = (status, op) => {
		setop(op)
		if (status == 1) {
			getTree();
			setModalStatus(true);
		} else {
			setInitialValue({});
			formRef.current.resetFields();
			setModalStatus(false);
		}
	}

	const closeModal = () => {
		treeClose();
		setChangeFpIpaddr();
		setPrivateField([]);
		privateFieldList = [];
		getModal(2);
	}

	const treeClose = () => {
		setTreeValue();
		setTreekey();
		setZoneVal();
		setZoneNameVal();
		setOrgValue();
		setOrgkey();
		setOrgVal();
		setOrgNameVal();
	}

	//添加搜索ip
	const ipSearch = (macaddr) => {
		let data = {};
		data.macaddr = macaddr;
		data.assetflow = assetflow;
		data.queryType = 'precise';
		if (!macaddr) {
			message.error(language('project.assmngt.resapply.fillinserchinfo'));
			return false;
		}
		post('/cfg.php?controller=confAssetManage&action=queryAsset', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			if (res.data.length > 0) {
				getDynamicField('form', 'private', res.data[0].buisUsg ? res.data[0].buisUsg : '');
				setInitialValue(res.data[0]);
			} else {
				setInitialValue([]);
			}
		}).catch(() => {
			console.log('mistake')
		})
	}

	//查看弹出框页面数据赋值
	const seeModalFrame = (record, type = '', changeArr = []) => {
		let data = {};
		data.id = record.id;
		data.assetflow = assetflow;
		data.flow = typeName;
		data.batch = record.batch;
		post('/cfg.php?controller=confAssetManage&action=showSignChangeFlow', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			setRecordFind(record);
			res.data.baseInfo = res.data.baseInfo ? res.data.baseInfo : {};
			res.data.baseInfo.ipaddr = res.data.ipaddr;
			res.data.baseInfo.queryAddr = res.data.queryAddr;
			res.data.baseInfo.id = record.orderID;
			setInitialValue(res.data.baseInfo);

			res.data.changeInfo.ipaddr = res.data.ipaddr;
			res.data.changeInfo.macaddr = res.data.macaddr;
			setChangeInfoBg(res.data.changeInfo ? res.data.changeInfo : {});
			setApprovalProcessList(res.data.flowInfo ? res.data.flowInfo : []);
			if (type == 'file') {
				if (record.batch == 'Y') {
					setSaFileList(res.data ? res.data.changeInfo : []);
				}
				setParameter({ id: record.id, name: typeName, buisusg: record.buisUsg, isBatch: record.batch });
				uploadSignature(record);
				if (record.batch == 'Y') {
					getFileModalBanch(1);
				} else {
					getFileModal(1);
				}
			} else {
				if (record.batch == 'Y') {
					setSaFileList(res.data ? res.data.changeInfo : []);
				} else {
					let dataInfo = [
						{ 'changefield': language('project.assmngt.resapply.user'), 'changeinfo': res.data.changeInfo.user },
						{ 'changefield': language('project.assmngt.resapply.contactnumber'), 'changeinfo': res.data.changeInfo.phone },
						{ 'changefield': language('project.assmngt.assetmodel'), 'changeinfo': res.data.changeInfo.assetModel },
						{ 'changefield': language('project.assmngt.assettype'), 'changeinfo': res.data.changeInfo.assetType },
						{ 'changefield': language('project.assmngt.macaddr'), 'changeinfo': res.data.changeInfo.macaddr },
						{ 'changefield': language('project.assmngt.wherevlan'), 'changeinfo': res.data.changeInfo.vlan },
						{ 'changefield': language('project.assmngt.location'), 'changeinfo': res.data.changeInfo.location },
						{ 'changefield': language('project.assmngt.resapply.businesspurpose'), 'changeinfo': res.data.changeInfo.buisUsg },
					]
					if (changeArr.length > 0) {
						changeArr.map((item) => {
							dataInfo.push({ 'changefield': item.name, 'changeinfo': res.data.changeInfo[item.key] });
						})
					}
					setDataInfo(dataInfo);

				}
				if (type == 'see') {
					getSeeModal(1);
				} else {
					if (record.batch == 'Y') {
						// showExamineForm('open');
					} else {
						getApporvalModal(1)
					}
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
			setPrivateField([]);
			privateFieldList = [];
			setTreeValue('');
			setZoneVal('');
			setOrgValue('');
			setOrgVal('');
			formRef.current.resetFields();
			setSeeModalStatus(false);
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
				if (record.changedFields && record.changedFields?.indexOf(item.key) != -1) {
					item.valColor = '#FCCA00'
				}
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
			zFileFormRef.current.resetFields();
			setFileModalStatus(false);
		}
	}
	const closeFileModal = () => {
		treeClose();
		setPrivateField([]);
		privateFieldList = [];
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
		data.assetflow = assetflow;
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
		data.name = typeName;
		data.buisusg = record.buisUsg;
		data.isBatch = record.batch;//Y 批量  N单个
		data.assetflow = assetflow;
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
				getSaModal(1, record);
				incAdd();
			}
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
			} else if (type == 'batchtablelist') {
				setUpTableData(res.data ? res.data : []);
				upTableListData = res.data;
				showUpTable('open');
			} else {
				handleEnter('submit', record, '', res.data ? res.data : [])
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
				if (record.changedFields?.indexOf(item.key) != -1 && record.changedFields) {
					obj.tdColor = '#FCCA00'
				}
				data.push(obj)
			})
		}
		return data;
	}

	//工单撤销功能
	const revokeWork = (record) => {
		let data = {};
		data.id = record.id;
		data.orderID = record.orderID;
		post('/cfg.php?controller=confAssetManage&action=revokeSignChangeApply', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			message.success(res.msg);
			incAdd();
		}).catch(() => {
			console.log('mistake')
		})
	}

	//自动分配按钮
	const votDistribution = (
		<Button key="vot" style={{ width: '80px', padding: 0 }}
			onClick={() => {
				approvalModalFrame()
			}}
		>
			{language('project.assmngt.resapply.automaticdistribution')}
		</Button>
	)
	// 自动分配功能 end

	//自动分配数据
	const approvalModalFrame = (type = 'applyfor', record = '') => {
		let data = {};
		let obj = formRef.current.getFieldsValue(['vlan']);
		data.orgID = orgVal;
		data.vlan = obj.vlan;
		data.type = typeName;
		post('/cfg.php?controller=confAssetManage&action=preAllocIPAddr', data).then((res) => {
			if (!res.success) {
				setChangeFpIpaddr('');
				message.error(res.msg);
				return false;
			}
			setChangeFpIpaddr(res.data[0] ? res.data[0] : '');
		}).catch(() => {
			console.log('mistake')
		})
	}

	/** 更改选择ip start */
	const [ipValidType, setIpValidType] = useState('forever');//ip选择单选多选模式
	const [iPModalStatus, setIPModalStatus] = useState(false);//IP地址选择弹出框
	const [iPAddrList, setIPAddrList] = useState([]);//掩码IP地址按钮数据
	const [ipSelectList, setIpSelectList] = useState([]);//分配ip 选中内容
	const [treelist, setTreelist] = useState([]);//审批子网回显
	const [selectMenuId, setSelectMenuId] = useState();
	const [ipValidTime, setIpValidTime] = useState();//时间处理
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
		setIPAddrList([]);
		setIpSelectList([]);
		getMaskModal(2);
		//清除选中IP地址
	}

	// 自动分配功能 start
	// IP地址申请工单子网回显列表
	const getMenu = (record = '') => {
		let data = {};
		data.zoneID = record ? record.zoneID : initialValue.zoneID;//管理员所属区域id    
		data.orgID = record ? record.orgID : initialValue.orgID;//管理员所属区域id    
		data.vlan = record ? record.vlan : initialValue.vlan;//vlan
		post('/cfg.php?controller=confIPAddrManage&action=showAllocSubnet', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			let e = [];
			res.data.map((item) => {
				let icon = <UnorderedListOutlined />;
				e.push({ key: item.id, label: item.subNetaddr + '/' + (item.maskSize), icon: icon, subNetaddr: item.subNetaddr })
			})
			setTreelist(e);
			setSelectMenuId(res.data[0].id)
			getBottonList(res.data[0].id, record)
		}).catch(() => {
			console.log('mistake')
		})
	}
	// IP地址申请工单子网侧边点击id处理
	const onSelectLeft = (selectedKeys, info) => {
		getBottonList(selectedKeys);
		setSelectMenuId(selectedKeys);
	};

	//底部掩码数据列表
	const getBottonList = (subnetID = 0, record = '') => {
		let data = {};
		data.subnetID = subnetID;
		post('/cfg.php?controller=confIPAddrManage&action=showIPAddrList', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			let row = record;
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
		setChangeFpIpaddr(ipSelectList[0])
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

	/** 更改选择ip end */

	/** 审批 start */
	//审批判断是否弹出添加model
	const getApporvalModal = (status) => {
		if (status == 1) {
			setApprovalModalStatus(true);
		} else {
			setInitialValue([]);
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
		data.orderID = recordFind.orderID;
		data.notes = obj.reason;
		data.assetflow = assetflow;
		data.flow = typeName;
		for (const key in changeInfoBg) {
			data[key] = changeInfoBg[key];
		}
		post('/cfg.php?controller=confAssetManage&action=agreeSQChangeApply', data).then((res) => {
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
		let data = {};
		let obj = '';
		if (type == 'batch') {
			obj = examineRef.current.getFieldsValue(['reason']);
			data.batch = 'Y';
			data.list = JSON.stringify(batchTableList);
		} else {
			obj = formRef.current.getFieldsValue(['reason']);
		}
		data.orderID = recordFind.orderID;
		data.notes = obj.reason;
		data.assetflow = assetflow;
		data.flow = typeName;
		post('/cfg.php?controller=confAssetManage&action=rejectSQChangeApply', data).then((res) => {
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
	/** 审批 end */


	//地址分配接口
	const preAllocBatchIPAddr = (type = '') => {
		let data = {};
		data.list = JSON.stringify(type == 'assoperate' ? batchTableList : upTableData);
		data.type = 'asset_change';
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
		<ProtableModule uploadButton={uploadButton} uploadClick={uploadClick} onExpandUrl={onExpandUrl} expandAble={expandAble} developShowKey={developShowKey} expandData={expandData} concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} addButton={addButton} addClick={addClick} addTitle={addTitle} rowSelection={rowSelection} />

		{/* 添加编辑弹出框 */}
		<DrawerForm className='arequestform'
			width={'600px'}
			formRef={formRef}
			title={op == 'add' ? language('project.assmngt.resapply.changeapply') : language('project.assmngt.resapply.changemodify')}
			visible={modalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'closechangebuttonright',
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
						<Button key="buttonsave" type='primary'
							onClick={() => {
								setSubmitType('save');
								formRef.current.submit();
							}}
						>
							<span className='buttonmargint'>{language('project.save')}</span>
						</Button>,
						<Button key="buttonsubmit" type='primary'
							onClick={() => {
								setSubmitType('submit');
								formRef.current.submit();
							}}
						>
							<span className='buttonmargint'>{language('project.submit')}</span>
						</Button>
					]
				}
			}}
			onVisibleChange={setModalStatus}

			submitTimeout={2000} onFinish={async (values) => {
				save(submitType, '', 'submit');
			}}>
			{op == 'add' ? <Alert className='caddressalertinfo'
				message={language('project.assmngt.resapply.ipaddrtitlecontent')}
				type="info" showIcon
			/> : <Alert className='caddressalertinfo'
				message={language('project.assmngt.changeipaddrcontent', { ipaddr: initialValue.queryAddr })}
				description={language('project.assmngt.resapply.ipaddrdescription')}
				type="info" showIcon icon={<img src={Substitute} />}
			/>}

			<div className='caddformationbox'>
				<ProDescriptions column={1}>
					<ProFormText hidden name='id' />
					{op == 'add' ? <ProDescriptions.Item className='savemodellist savemodeltextarea' name='applicant' label={language('project.assmngt.resapply.changeipaddr')}>
						<Search style={{ width: "100% !important" }}
							placeholder={language('project.assmngt.resapply.search')}
							onSearch={(queryVal) => {
								setSearchChangeVal(queryVal);
								ipSearch(queryVal)
							}}
						/></ProDescriptions.Item> : <></>}
					<ProDescriptions.Item className='savemodellist' name='applicant' label={language('project.assmngt.resapply.zone')}>{initialValue.zone ? initialValue.zone : <div></div>}
						<TreeSelect
							style={{ width: '187px' }}
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
					</ProDescriptions.Item>
					<ProDescriptions.Item className='savemodellist' name='applicant' label={language('project.assmngt.resapply.organization')}>{initialValue.org ? initialValue.org : <div></div>}
						<TreeSelect
							style={{ width: '187px' }}
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
					</ProDescriptions.Item>
					<ProDescriptions.Item className='savemodellist' name='applicant' label={language('project.assmngt.resapply.macaddress')}>{initialValue.macaddr ? initialValue.macaddr : <div></div>} <ProFormText width={'187px'} name='macaddr' rules={[{ pattern: regMacList.mac.regex, message: regMacList.mac.alertText, }]} /></ProDescriptions.Item>
					<ProDescriptions.Item className='savemodellist' name='applicant' label={language('project.assmngt.resapply.user')}>{initialValue.user ? initialValue.user : <div></div>} <ContentText width={'187px'} name='user' label={false} /></ProDescriptions.Item>
					<ProDescriptions.Item className='savemodellist' name='applicant' label={language('project.assmngt.resapply.contactnumber')}>{initialValue.phone ? initialValue.phone : <div></div>} <ProFormText width={'187px'} name='phone' rules={[{ pattern: regList.phoneorlandline.regex, message: regList.phoneorlandline.alertText, }]} /></ProDescriptions.Item>
					<ProDescriptions.Item className='savemodellist' name='applicant' label={language('project.assmngt.assetmodel')}>{initialValue.assetModel ? initialValue.assetModel : <div></div>} <ContentText width={'187px'} name='assetModel' label={false} /></ProDescriptions.Item>
					<ProDescriptions.Item className='savemodellist' name='applicant' label={language('project.assmngt.assettype')}>{initialValue.assetType ? initialValue.assetType : <div></div>} <ProFormSelect options={assettypeList} width={'187px'} name='assetType' /></ProDescriptions.Item>
					<ProDescriptions.Item className='savemodellist' name='applicant' label={language('project.assmngt.location')}>{initialValue.location ? initialValue.location : <div></div>} <ContentText width={'187px'} name='location' label={false} /></ProDescriptions.Item>
					<ProDescriptions.Item className='savemodellist' name='applicant' label={language('project.assmngt.wherevlan')}>{initialValue.vlan ? initialValue.vlan : <div></div>} <ProFormText width={'100px'} name='vlan'  rules={[{ pattern: regMacList.vlan.regex, message: regMacList.vlan.alertText, }]} addonAfter={votDistribution} /></ProDescriptions.Item>
					<ProDescriptions.Item className='savemodellist' name='applicant' label={language('project.assmngt.assinput.ipaddr')}>{initialValue.ipaddr ? initialValue.ipaddr : <div></div>}
						{changeFpIpaddr ? <div
							onClick={() => {
								getMenu();
								getMaskModal(1);
							}}
							style={{ width: '187px', lineHeight: '32px', height: '32px' }}  >
							<EditFilled
								style={{ marginRight: '8px', color: '#1890ff' }} />
							<span style={{ color: '#2E9AFF' }}>
								{changeFpIpaddr.ipaddr}
							</span></div>
							: <div style={{ width: '187px', lineHeight: '32px', height: '32px' }}  ></div>}
					</ProDescriptions.Item>
					<ProDescriptions.Item className='savemodellist' name='applicant' label={language('project.assmngt.resapply.businesspurpose')}>{initialValue.buisUsg ? initialValue.buisUsg : <div></div>}
						<ProFormSelect style={{ width: '187px' }} options={purposeList}
							disabled={true}
							value={initialValue.buisUsg ? initialValue.buisUsg : ''}
							name="buisUsg"
							onChange={(e) => {
								let type = 'public'
								if (e) {
									type = 'private';
								}
								getDynamicField('form', type, e);
							}}
						/>
					</ProDescriptions.Item>
					{
						privateField.length - 1 == -1 ? '' :
							privateField.map((item) => {
								//判断输入形式是下拉框还是列表框
								if (item.form == 'box') {
									return (
										<ProDescriptions.Item className='savemodellist' name='applicant' label={item.name}>{initialValue[item.key] ? initialValue[item.key] : <div></div>}
											<ProFormText width={'187px'} name={item.key} />
										</ProDescriptions.Item>
									)
								} else {
									let info = [];
									let contents = item.content.split(',');
									if (contents.length > 0) {
										contents.map((val) => {
											let confres = [];
											confres.label = val;
											confres.value = val;
											info.push(confres)
										})
									}
									return (
										<ProDescriptions.Item className='savemodellist' name='applicant' label={item.name}>{initialValue[item.key] ? initialValue[item.key] : <div></div>} <ProFormSelect
											style={{ width: '187px' }}
											options={info}
											name={item.key}
										/>
										</ProDescriptions.Item>
									)
								}
							})
					}
					<ProDescriptions.Item className='savemodellist savemodeltextarea' name='applicant' label={language('project.assmngt.resapply.remarks')}>
						<NotesText name="notes" label={false} style={{ width: '100%' }}  required={false} /> 
					</ProDescriptions.Item>
				</ProDescriptions>
			</div>

		</DrawerForm>

		{/* //查看弹出框 */}
		<DrawerForm
			labelCol={{ xs: { span: 9 } }}
			wrapperCol={{ xs: { span: 12 } }}
			width="570px"
			layout="horizontal"
			className='cseemodalfrom'
			formRef={formRef}
			title={language('project.assmngt.resapply.approveview')}
			visible={seeModalStatus} autoFocusFirstInput
			submitter={false}
			drawerProps={{
				className: 'closechangebuttonright',
				destroyOnClose: true,
				maskClosable: false,
				placement: 'right',
				onClose: () => {
					getSeeModal(2)
				},
			}}
			onVisibleChange={setSeeModalStatus}
			submitTimeout={2000} onFinish={false}>
			{recordFind.batch == 'Y' ? <></> :
				<Alert className='caddressalertinfo' message={language('project.assmngt.changeipaddrcontent', { ipaddr: initialValue.queryAddr })} type="info" showIcon icon={<img src={Substitute} />} />
			}

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
										{SignatureShow(recordFind.signature, seeUploadFile)}
									</ProDescriptions.Item>
								</ProDescriptions></div> : ''}
					</div></>
				:
				<>
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
							<ProDescriptions.Item name='macaddr' label={language('project.assmngt.macaddr')}>{initialValue.macaddr ? initialValue.macaddr : ''}</ProDescriptions.Item>
							<ProDescriptions.Item name='location' label={language('project.assmngt.location')}>{initialValue.location ? initialValue.location : ''}</ProDescriptions.Item>
						</ProDescriptions>
						{
							privateField.length - 1 == -1 ? '' :
								privateField.map((item, index) => {
									if (index % 2 == 0) {
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
								})
						}
						{recordFind.showSignature == 'Y' ? <ProDescriptions column={2}>
							<ProDescriptions.Item name='signature' label={language('project.assmngt.resapply.signaturefile')}>
								{SignatureShow(recordFind.signature, seeUploadFile)}
							</ProDescriptions.Item>
						</ProDescriptions> : ''}
					</div>

					<Divider orientation='left'>{language('project.assmngt.changeinfo')}</Divider>
					<div className='cassignmentinformation cfrommodalmargin'>
						<ProTable
							size="small"
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
							columns={columnsInfo}
							//页面数据信息
							dataSource={dataInfo}
							editable={{
								type: 'multiple',
							}}
							rowKey="id"
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
		{/* 审批弹出框 */}
		<DrawerForm
			formRef={formRef}
			width="570px"
			key='aschapprovalmodalfrom'
			className='aschapprovalmodalfrom'
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
					<ProDescriptions.Item name='macaddr' label={language('project.assmngt.macaddr')}>{initialValue.macaddr ? initialValue.macaddr : ''}</ProDescriptions.Item>
					<ProDescriptions.Item name='location' label={language('project.assmngt.location')}>{initialValue.location ? initialValue.location : ''}</ProDescriptions.Item>
				</ProDescriptions>
				{
					privateField.length - 1 == -1 ? '' :
						privateField.map((item, index) => {
							if (index % 2 == 0) {
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
						})
				}
				{recordFind.showSignature == 'Y' ? <ProDescriptions column={2}>
					<ProDescriptions.Item name='signature' label={language('project.assmngt.resapply.signaturefile')}>
						{SignatureShow(recordFind.signature, seeUploadFile)}
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

		{/* //查看上传签章文件 */}
		<DrawerForm
			width="570px"
			layout="horizontal"
			className='cseemodalfrom'
			formRef={zFileFormRef}
			title={language('project.resmngt.uploadsignaturefile')}
			visible={fileModalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'closechangebuttonright',
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
								setSubmitType('save');
								closeFileModal(2);
								// zFileFormRef.current.submit();
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
						</Button>
					]
				}
			}}
			onVisibleChange={setFileModalStatus}
			submitTimeout={1000} onFinish={async (values) => {
				getDynamicField(submitType, 'private', recordFind.buisUsg, recordFind);
			}}  >

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
					<ProDescriptions.Item name='macaddr' label={language('project.assmngt.macaddr')}>{initialValue.macaddr ? initialValue.macaddr : ''}</ProDescriptions.Item>
					<ProDescriptions.Item name='location' label={language('project.assmngt.location')}>{initialValue.location ? initialValue.location : ''}</ProDescriptions.Item>
				</ProDescriptions>
				{
					privateField.length - 1 == -1 ? '' :
						privateField.map((item, index) => {
							if (index % 2 == 0) {
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
						})
				}
			</div>
			<Divider orientation='left'>{language('project.resmngt.previewfile')}</Divider>
			<div className='assignmentinformation pdfbox'>
				<div className='seepdfbox'  >
					{pdfUrl ? <PDFViewer url={pdfUrl} />
						: <div><img src={PdfSeize} /></div>
					}
				</div>
			</div>
			<div className='appchangelicationin'>
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

		{/* //批量查看上传签章文件 */}
		<DrawerForm
			width="809px"
			layout="horizontal"
			className='apychangemodalBatchfrom'
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
					columns={uploadColumnsFile}
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
			width={'auto'}
			formRef={formRef}
			className='csarmodalfrom'
			title={language('project.resmngt.generatesignaturefile')}
			visible={saModalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'csarmodalfrombox',
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
					{isBatch == 'Y' ? (
						<BatchTemplate
							dataSource={topData}
							bottomData={bottomData}
							editable={false}
							title={signTitle}
							signName={signName}
							dateTime={signDataTime}
							batchData={batchData}
						/>
					) : (
						<SignTable
							dataSource={topData}
							bottomData={bottomData}
							editable={false}
							title={signTitle}
							signName={signName}
							dateTime={signDataTime}
						/>
					)}
				</div>
			</div>
		</DrawerForm>

		{/* IP地址选择弹出框 */}
		<ModalForm
			layout="horizontal"
			className='achangeipmodal'
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

			<ProCard className='abottomboxone' style={{ height: '274px' }} ghost gutter={[13, 13]}>
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
					<ProCard ghost direction='column' style={{ height: '274px', padding: '10px' }} bordered gutter={[3, 3]}>
						{/* 上层盒子 */}
						<ProCard ghost style={{ height: '37px' }} >
							<ProCard ghost colSpan='160px'>
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

		{/**导入动态字段 选择 */}
		<DrawerForm {...modalFormLayout}
			formRef={formRef}
			title={language('project.import')}
			visible={imoritModalStatus} autoFocusFirstInput
			drawerProps={{
				className: 'closebuttonright assachangefilemodal',
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
				<Alert className='filealert' message={language('project.assmngt.assinput.uploadfilebuisusgprivatefieldandchangefield')} type="info" showIcon />
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
							label={language('project.assmngt.resapply.purpose')}
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
							if (item.title == language('project.assmngt.resapply.purpose')) {
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
			title={<div className="assachangeuploadtitle">{language('project.assmngt.approval.applychange')}</div>}
			width="1000px"
			formRef={upTableRef}
			visible={upTableSta}
			onVisibleChange={setUpTableSta}
			drawerProps={{
				className: 'assachangecationuploadform',
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
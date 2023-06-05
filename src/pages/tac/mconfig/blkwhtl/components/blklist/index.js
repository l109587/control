import React, { useRef, useState, useEffect } from 'react';
import { Modal, Input, message, Form, Switch, Popconfirm, Space, Tag, Tooltip } from 'antd';
import { EditFilled, DeleteFilled, SaveFilled, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { LinkTwo } from '@icon-park/react';
import { post } from '@/services/https';
import { EditableProTable } from '@ant-design/pro-components';
import ProForm, { ModalForm, ProFormText, ProFormDateTimePicker, ProFormSelect, ProFormTextArea } from '@ant-design/pro-form';
import { NameText, NotesText } from '@/utils/fromTypeLabel';
import { modalFormLayout } from "@/utils/helper";
import { language } from '@/utils/language';
import '@/utils/index.less';
import './index.less';
import { regMacList } from '@/utils/regExp';
import CutDropDown from '../cutdropdown';
import { TableLayout, PolicyTable } from '@/components';
const { ProtableModule } = TableLayout;
const { confirm } = Modal;
const { Search } = Input
let H = document.body.clientHeight - 336
var clientHeight = H
export default () => {
	const columns = [
		{
			// title: '配置ID',
			title: language('project.mconfig.cfnid'),
			dataIndex: 'id',
			align: 'center',
			ellipsis: true,
		},
		{
			// title: '生效状态',
			title: language('project.mconfig.ectstu'),
			dataIndex: 'status',
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
				if (record.from == 'remote') {
					disabled = true;
				}
				let checked = true;
				if (record.status == 'N') {
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
			// title: '名称',
			title: language('project.devname'),
			dataIndex: 'name',
			align: 'center',
			fixed: 'left',
			ellipsis: true,
			width: 130,
		},
		{
			// title: '黑名单地址内容',
			title: language('project.mconfig.blklist.bac'),
			dataIndex: 'addrlist',
			width: 150,
			align: 'center',
			ellipsis: true,
			render: (text, record, index) => {
				if (record.addrlist) {
					let menu = [];
					record.addrlist?.map((item) => {
						menu.push({ key: item, label: item, icon: <InfoCircleOutlined /> });
					})
					return <>
						<CutDropDown menu={menu} addrlist={record.addrlist} />
					</>;
				}
			},
		},
		{
			//有效期类型
			title: language('project.mconfig.validtype'),
			dataIndex: 'valid_type',
			align: 'center',
			width: 90,
			ellipsis: true,
			render: (text, record, index) => {
				if (record.valid_type == 'forever') {
					return language('project.mconfig.forever');
				} else {
					return language('project.mconfig.expire');
				}
			},
		},
		{
			// title: '有效时间',
			title: language('project.mconfig.vdtime'),
			dataIndex: 'expire_time',
			align: 'center',
			ellipsis: true,
			width: 180,
			render: (text, record, index) => {
				if (!record.expire_time) {
					return language('project.mconfig.forever');
				} else {
					return record.expire_time;
				}
			},
		},
		{
			// title: '配置来源',
			title: language('project.mconfig.cfgsce'),
			dataIndex: 'from',
			align: 'center',
			ellipsis: true,
			width: 100,
			filters: true,
			filterMultiple: false,
			valueEnum: {
				local: { text: language('project.mconfig.local') },
				remote: { text: language('project.mconfig.remote') },
			},
			render: (text, record, index) => {
				if (record.from == 'local') {
					return <Tag style={{ marginRight: '0px' }} color='cyan' key={1}>{language('project.mconfig.local')}</Tag>;
				} else {
					return <Tag style={{ marginRight: '0px' }} color='volcano' key={1}>{language('project.mconfig.remote')}</Tag>;
				}
			},
		},
		{
			// title: '配置下发的设备数',
			title: language('project.mconfig.cfgnum'),
			dataIndex: 'refcnt',
			align: 'left',
			ellipsis: true,
			width: 90,
			render: (text, record, _, action) => {
				return <Space align='left' className='refcntspace'><div>{record.refcnt}</div>
					{record.refcnt >= 1 ? <div
						style={{ marginLeft: '8px' }}
						onClick={() => {
							disModal('assoc', record);
						}}
					><LinkTwo theme="outline" size="20" fill="#FF7429" strokeWidth={3} /></div> :
						<div style={{ marginLeft: '8px' }}><LinkTwo theme="outline" size="20" fill="#8E8D8D" strokeWidth={3} /></div>
					}
				</Space>
			}
		},
		{
			// title: '备注',
			title: language('project.remark'),
			dataIndex: 'notes',
			align: 'center',
			width: 130,
			ellipsis: true,
		},
		{
			title: language('project.createTime'),
			dataIndex: 'createTime',
			align: 'center',
			width: 130,
			ellipsis: true,
		},
		{
			title: language('project.updateTime'),
			dataIndex: 'updateTime',
			align: 'center',
			width: 130,
			ellipsis: true,
		},
		{
			disable: true,
			title: language('project.mconfig.operate'),
			align: 'center',
			valueType: 'option',
			fixed: 'right',
			width: 130,
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
						<Tooltip title={language('project.deit')} >
							<EditFilled style={{ color: '#0083FF', fontSize: '15px' }} />
						</Tooltip>
					</a>
					{operation(<Tooltip title={language('project.distribute')} ><span><i className="ri-mail-send-fill" style={{ color: '#FA561F', fontSize: '15px' }}></i></span></Tooltip>, record, 'distribute', language('project.mconfig.determinedistrbute'))}
					{record.refcnt >= 1 ?
						operation(<Tooltip title={language('project.revoke')} ><span><i className="fa fa-recycle" style={{ color: '#FF0000', fontSize: '15px' }} aria-hidden="true"></i></span></Tooltip>, record, 'revoke', language('project.mconfig.determinerevoke'))
						: <Tooltip title={language('project.revoke')} ><span><i className="fa fa-recycle" style={{ color: '#8E8D8D', fontSize: '15px' }} aria-hidden="true"></i></span></Tooltip>
					}
				</>
			],
		},
	];

	const formRef = useRef();
	const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
	const [op, setop] = useState('add');//选中id数组
	const [editableKeys, setEditableRowKeys] = useState();//每行编辑的id
	const [timeShow, setTimeShow] = useState(false);//有效时间隐藏显示
	const [switchCheck, setSwitchCheck] = useState();
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [rowRecord, setRowRecord] = useState([]);//记录当前信息

	/**分发  撤销功能 start  */
	const sRef = useRef(null);
	//调用子组件接口判断弹框状态
	const disModal = (op = '', record = {}) => {
		setRowRecord(record);
		modMethod(op);
		if (sRef.current) {
			sRef.current.openEdModal('Y');
		}
	}
	const [modalVal, setModalVal] = useState();//当前点击弹框类型 distrbute | revoke | assocTable
	const recordFind = rowRecord;//当前行id
	const syncundoshowurl = '/cfg.php?controller=device&action=showCfgLinkDev';//同步撤销回显接口
	const syncundosaveurl = '/cfg.php?controller=confBlacklist&action=syncLanBlackList';//同步撤销接口
	const assocshowurl = '/cfg.php?controller=device&action=showCfgLinkDev';//设备列表接口路径
	const cfg_type_type = 'cfgLanBlkIP';//设备列表类型
	const tableKeyVal = 'blickdevl';//列表唯一key
	const isOptionHide = true;
	const assocType = 2;

	const modMethod = (type) => {
		setModalVal(type);
	}

	/**分发  撤销功能 end  */

	/** table组件 start */
	const rowKey = (record => record.id);//列表唯一值
	const tableHeight = clientHeight;//列表高度
	const tableKey = 'blick';//table 定义的key
	const rowSelection = true;//是否开启多选框
	const addButton = true; //增加按钮  与 addClick 方法 组合使用
	const delButton = true; //删除按钮 与 delClick 方法 组合使用
	const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
	const columnvalue = 'blickcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
	const apishowurl = '/cfg.php?controller=confBlacklist&action=showLanBlackList';//接口路径
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
				placeholder={language('project.mconfig.blklist.tablesearch')}
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

	const renderRemove = (text, record) => (
		<Popconfirm onConfirm={() => {
			setConfirmLoading(false);
			const tableDataSource = formRef.current.getFieldsValue(['addrlistinfo']);
			formRef.current.setFieldsValue(
				{ addrlistinfo: tableDataSource['addrlistinfo'].filter((item) => item.id != record.id), }
			)
		}} key="popconfirm"
			title={language('project.delconfirm')}
			okButtonProps={{
				loading: confirmLoading,
			}} okText={language('project.yes')} cancelText={language('project.no')}>
			<a>{text}</a>
		</Popconfirm>
	);

	//分发注销气泡框
	const operation = (text, record, op, languagetext) => (
		<Popconfirm onConfirm={() => {
			syncLanList(record, op);
		}} key="popconfirmdel"
			title={languagetext}
			okButtonProps={{
				loading: confirmLoading,
			}} okText={language('project.yes')} cancelText={language('project.no')}>
			<a>{text}</a>
		</Popconfirm>
	);

	//分发，撤销
	const syncLanList = (record, op) => {
		let data = {};
		data.id = record.id;
		data.op = op;
		post('/cfg.php?controller=confBlacklist&action=syncLanBlackList', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			setIncID(incID + 1);
		}).catch(() => {
			console.log('mistake')
		})
	}

	const fromcolumns = [
		{
			title: language('project.mconfig.blklist.bac'),
			dataIndex: 'address',
			align: 'center',
			formItemProps: () => {
				return {
					rules: [{ required: true, pattern: regMacList.ipv4mask.regex, message: regMacList.ipv4mask.alertText }],
				};
			},
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
					{renderRemove(<DeleteFilled style={{ color: 'red' }} />, record)}
				</>
			]
		},
	];


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

	//全部启用禁用
	const statusSaveAll = (status) => {
		post('/cfg.php?controller=confBlacklist&action=enableLanBlackList', { status: status }).then((res) => {
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
		post('/cfg.php?controller=confBlacklist&action=enableLanBlockIP', { id: id, status: status }).then((res) => {
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
		post('/cfg.php?controller=confBlacklist&action=setLanBlockIP', data).then((res) => {
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
		post('/cfg.php?controller=confBlacklist&action=delLanBlockIP', { ids: ids }).then((res) => {
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
		if (obj.valid_type == 'forever') {
			delete obj['expire_time'];
		}
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
				formRef={formRef}
				title={op == 'add' ? language('project.add') : language('project.alter')}
				className='blilistmodal'
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
				<ProFormText hidden={true} name="op" label={language('project.sysconf.syszone.opcode')} initialValue={op} />
				<Form.Item name="status" label={language('project.mconfig.ectstu')} valuePropName={switchCheck}>
					<Switch checkedChildren={language('project.open')} unCheckedChildren={language('project.close')} />
				</Form.Item>
				<NameText name='name' label={language('project.devname')} required={true} /> 
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
					} name="valid_type" label={language('project.mconfig.validtype')} rules={[{ required: true }]} />
				{timeShow == true ? (<ProFormDateTimePicker name="expire_time" showTime label={language('project.sysconf.apiauth.validtime')} />) : ('')}
				<NotesText name="notes" label={language('project.remark')} required={false} /> 
				<ProForm.Item label={language('project.mconfig.whtlist.wac')} name="addrlistinfo" trigger="onValuesChange" rules={[{ required: true }]}>
					<EditableProTable
						scroll={{ y: 170 }}
						rowKey="id"
						className='tablelistbottom'
						toolBarRender={false}
						columns={fromcolumns}
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

			<PolicyTable ref={sRef} tableKeyVal={tableKeyVal} modalVal={modalVal} recordFind={recordFind} assocshowurl={assocshowurl} syncundoshowurl={syncundoshowurl} cfg_type_type={cfg_type_type} setIncID={setIncID} incID={incID} isOptionHide={isOptionHide} assocType={assocType} syncundosaveurl={syncundosaveurl} />
		</div>
	);
};

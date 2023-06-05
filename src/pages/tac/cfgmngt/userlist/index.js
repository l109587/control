import React, { useRef, useState, useEffect } from 'react';
import { post } from '@/services/https';
import { Modal, Input, Tag, Tabs, Col, Space, TreeSelect, message, Tree } from 'antd';
import { ModalForm, ProFormDigit, ProFormText, ProFormSelect, ProFormSwitch, ProFormCheckbox, ProFormRadio } from '@ant-design/pro-components';
import { ProFormDateTimePicker, ProFormTimePicker } from '@ant-design/pro-form';
import { NameText, NotesText } from '@/utils/fromTypeLabel';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { defaultUserSync } from "@/utils/helper";
import { msg } from '@/utils/fun';
import { language } from '@/utils/language';
import { regSeletcList, regList } from '@/utils/regExp';
import '@/utils/index.less';
import './userlist.less';
import { TableLayout, LeftTree, CardModal } from '@/components';
const { ProtableModule } = TableLayout;
const { Search } = Input
const { TabPane } = Tabs;
let H = document.body.clientHeight - 285
var clientHeight = H

export default () => {

	const columnsList = [
		{
			title: language('project.assmngt.id'),
			dataIndex: 'id',
			ellipsis: true,
			align: 'center',
			width: 160,
		},
		{
			title: language('project.cfgmngt.userlist.form'),
			dataIndex: 'origin',
			align: 'center',
			ellipsis: true,
			className: 'origin',
			width: 80,
			render: (text, record, index) => {
				let color = '';
				if (record.origin == 'add') {
					color = 'success';
					text = language('project.cfgmngt.userlist.add')
				} else {
					color = 'processing';
					text = language('project.cfgmngt.userlist.sync')
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
			title: language('project.cfgmngt.userlist.username'),
			dataIndex: 'name',
			ellipsis: true,
			width: 100,
		},
		{
			title: language('project.cfgmngt.userlist.showname'),
			dataIndex: 'text',
			ellipsis: true,
			width: 100,
		},
		{
			title: language('project.cfgmngt.userlist.status'),
			dataIndex: 'status',
			ellipsis: true,
			align: 'center',
			width: 80,
			render: (text, record, index) => {
				let color = '';
				if (record.status == 'Y') {
					color = '#12C189';
					text = language('project.cfgmngt.userlist.enable')
				} else {
					color = '#FF0000';
					text = language('project.cfgmngt.userlist.disable')
				}
				return (
					<Tag style={{ marginRight: '0px' }} color={color} key={record.status}>
						{text}
					</Tag>
				)
			}
		},
		{
			title: language('project.cfgmngt.userlist.type'),
			dataIndex: 'kindName',
			ellipsis: true,
			width: 120,
		},
		{
			title: language('project.cfgmngt.userlist.org'),
			dataIndex: 'org',
			ellipsis: true,
			width: 100,
		},
		{
			title: language('project.cfgmngt.userlist.phone'),
			dataIndex: 'phone',
			ellipsis: true,
			width: 100,
		},
		{
			title: language('project.cfgmngt.userlist.loginmode'),
			dataIndex: 'assetModel',
			ellipsis: true,
			align: 'center',
			width: 100,
			render: (text, record, index) => {
				let icon = '';
				let loginIcon = '';
				let span = '';
				if (record.loginType == 'single') {
					span = '-5px';
					loginIcon = <i className="iconfont icon-yonghuzhongxin" style={{ color: '#12C189', fontSize: '24px' }} />;
				} else {
					span = '-7px';
					loginIcon = <i className="iconfont icon-tuandui" style={{ color: '#12C189', fontSize: '24px' }} />;
				}
				if (record.loginReplace == 'Y') {
					if (record.replaceConfirm == 'Y') {
						icon = <i className="ri-user-settings-fill" style={{ color: '#12C189', fontSize: '20px', marginTop: '3px' }} />;
					} else {
						icon = <i className="ri-user-add-fill" style={{ color: '#12C189', fontSize: '20px', marginTop: '3px' }} />;
					}
				} else {
					icon = <i className="ri-user-unfollow-fill" style={{ color: '#12C189', fontSize: '20px', marginTop: '3px' }} />;
				}
				return (
					<div className='userassetmodelbox'>
						<span style={{ marginTop: '-9px' }}>{loginIcon}</span>
						<span style={{ marginTop: span }}>{icon}</span>
					</div>
				)
			}
		},
		{
			title: language('project.cfgmngt.userlist.logintime'),
			dataIndex: 'begTime',
			ellipsis: true,
			width: 100,
			render: (text, record, index) => {
				if (record.timeAction != '') {
					return record.begTime + '-' + record.endTime
				}
			}
		},
		{
			title: language('project.cfgmngt.userlist.termofvalidity'),
			dataIndex: 'expireDate',
			ellipsis: true,
			width: 130,
			render: (text, record, index) => {
				if (record.expire == 'N') {
					return language('project.cfgmngt.userlist.forever');
				} else {
					return record.expireDate;
				}
			}
		},
		{
			title: language('project.cfgmngt.userlist.remark'),
			dataIndex: 'note',
			ellipsis: true,
			width: 160,
		},
		{
			width: 80,
			title: language('project.mconfig.operate'),
			align: 'center',
			fixed: 'right',
			ellipsis: true,
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
	const [columns, setColumns] = useState(columnsList);//table 头部数据
	const [timeShow, setTimeShow] = useState(false);//有效时间隐藏显示
	const [nowExporeTime, setNowExporeTime] = useState();
	const [loginReplaceType, setLoginReplaceType] = useState('Y');
	const [replaceShow, setReplaceShow] = useState(false);
	const [timeActionType, setTimeActionType] = useState('close');
	const [timeActionShow, setTimeActionShow] = useState(false);
	const [rangeTimeVal, setRangeTimeVal] = useState();
	const [loginTypeVal, setLoginTypeVal] = useState('single');
	const [loginNumsShow, setLoginNumsShow] = useState(false);
	const [selectTimeVal, setSelectTimeVal] = useState('N');//判断使用期限
	const [userTypeList, setUserTypeList] = useState(false);//用户类型列表 

	const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
	const [op, setop] = useState('add');//选中id数组
	const [orgID, setOrgID] = useState();
	const { confirm } = Modal;

	/** 左侧树形组件 start */
	const treeUrl = '/cfg.php?controller=confZoneManage&action=showZoneTree';
	const leftTreeData = { id: 1, type: 'tree', depth: '1' };
	const [treeInc, setTreeInc] = useState(0);
	//getTree 请求树形内容
	//onSelectLeft
	/** 左侧树形组件 end */

	/** table组件 start */
	const rowKey = (record => record.id);//列表唯一值
	const tableHeight = clientHeight - 10;//列表高度
	const tableKey = 'userlist';//table 定义的key
	const rowSelection = true;//是否开启多选框
	const addButton = true; //增加按钮  与 addClick 方法 组合使用
	const delButton = true; //删除按钮 与 delClick 方法 组合使用
	const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
	const columnvalue = 'userlistcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
	const apishowurl = '/cfg.php?controller=userList&action=showUserInfo';//接口路径
	const [queryVal, setQueryVal] = useState();//首个搜索框的值
	let searchVal = { value: queryVal, type: 'fuzzy', orgID: orgID };//顶部搜索框值 传入接口

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
				placeholder={language('project.cfgmngt.userlist.search')}
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
		if (loginReplaceType == 'N') {
			setReplaceShow(true)
		} else {
			setReplaceShow(false)
		}
		if (timeActionType == 'close') {
			setTimeActionShow(true)
		} else {
			setTimeActionShow(false)
		}
		if (selectTimeVal == 'Y') {
			setTimeShow(false)
		} else {
			setTimeShow(true)
		}
		if (loginTypeVal == 'single') {
			setLoginNumsShow(false)
		} else {
			setLoginNumsShow(true)
		}
		let data = {};
		data.op = 'add';
		data.loginNums = 2;
		data.durationTime = 1;
		setTimeout(function () {
			formRef.current.setFieldsValue(data)
		}, 100)
		getModal(1, 'add');
	}

	/** table组件 end */

	//删除功能
	const delList = (selectedRowKeys) => {
		let data = {};
		data.ids = selectedRowKeys.join(',');
		post('/cfg.php?controller=userList&action=delUserInfo', data).then((res) => {
			if (!res.success) {
				msg(res);
				return false;
			}
			incAdd()
			msg(res);
		}).catch(() => {
			console.log('mistake')
		})
	}

	//组织机构
	const orgType = 'org';
	const [orgValue, setOrgValue] = useState();
	const [orgkey, setOrgkey] = useState([]);//选中多个key
	const [orgData, setOrgData] = useState([]);
	const [orgVal, setOrgVal] = useState();//添加组织结构id、
	const [orgNameVal, setOrgNameVal] = useState();//添加组织结构名称

	//组织机构 start
	//组织机构 获取默认列表
	const getOrg = (id = '') => {
		let data = {};
		data.id = id ? id : orgID ? orgID : 1;
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
		formRef.current.setFieldsValue({ orgID: selKyeNum });
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

	useEffect(() => {
		getUserType();
	}, [])

	const getUserType = () => {
		post('/cfg.php?controller=userList&action=getUserType').then((res) => {
			let info = [];
			res.data.map((item) => {
				let confres = [];
				confres.label = item.text;
				confres.value = item.value;
				info.push(confres)
			})
			setUserTypeList(info)
		}).catch(() => {
			console.log('mistake')
		})
	}

	//区域管理处理
	const getTreeLeft = (res) => {
		let nowId = res.node.id;
		setOrgID(nowId);
		getOrg(nowId);
	}

	// 地址规划侧边点击id处理
	const onSelectLeft = (selectedKeys, info) => {
		setOrgID(selectedKeys[0]);//更新选中地址id
		getOrg(selectedKeys[0]);
		incAdd()
	};

	const incAdd = () => {
		let inc;
		clearTimeout(inc);
		inc = setTimeout(() => {
			setIncID(incID + 1);
		}, 100);
	}

	//判断是否弹出添加model
	const getModal = (status, op) => {
		setop(op)
		if (status == 1) {
			setModalStatus(true);
		} else {
			formRef.current.resetFields();
			setModalStatus(false);
		}
	}
	const closeModal = () => {
		setLoginReplaceType('Y')
		setTimeActionType('close');
		setLoginTypeVal('single');
		setOrgValue('');
		setOrgkey();
		setOrgVal();
		getModal(2);
	}

	//添加修改接口
	const save = (infos) => {
		let info = formRef.current.getFieldsValue(true);
		let data = {};
		data.op = info.op;
		data.id = info.id;
		data.status = info.status == 'Y' || info.status == true ? 'Y' : 'N';
		data.name = info.name;
		data.note = info.note;
		data.kind = info.kind;
		data.text = info.text;
		data.orgID = orgVal;
		data.gpOrgPath = orgValue;
		data.gpOrgIDPath = orgkey.join('.');
		let attribute = {};//用户属性JSON
		attribute.password = info.password;
		attribute.expire = selectTimeVal;//使用期限 
		attribute.expireDate = nowExporeTime;
		attribute.IDCard = info.IDCard;
		attribute.phone = info.phone;
		attribute.email = info.email;
		data.attribute = JSON.stringify(attribute);
		let loginCtrl = {};//用户属性JSON
		loginCtrl.loginType = loginTypeVal;
		loginCtrl.loginNums = info.loginNums;
		loginCtrl.loginReplace = loginReplaceType;
		loginCtrl.replaceConfirm = info.replaceConfirm?.length > 0 ? 'Y' : 'N';
		loginCtrl.begTime = rangeTimeVal?.[0] ? rangeTimeVal?.[0] : 0;
		loginCtrl.endTime = rangeTimeVal?.[1] ? rangeTimeVal?.[1] : 23;
		loginCtrl.duration = info.duration == 'Y' || info.duration == true ? 'Y' : 'N';
		loginCtrl.timeAction = timeActionType == 'close' ? '' : timeActionType;
		loginCtrl.loginTime = timeActionType == 'close' ? 'N' : 'Y';
		loginCtrl.durationTime = info.durationTime;
		loginCtrl.durationUnit = info.durationUnit;
		data.loginCtrl = JSON.stringify(loginCtrl);
		post('/cfg.php?controller=userList&action=setUserInfo', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			closeModal();
			incAdd()
		}).catch(() => {
			console.log('mistake')
		})

	}

	//编辑
	const mod = (info, op) => {
		let data = {};
		data.id = info.id;
		data.op = 'mod';
		data.status = info.status == 'Y' || info.status == true ? true : false;
		data.name = info.name;
		data.note = info.note;
		data.kind = info.kind;
		data.text = info.text;
		data.orgID = info.orgID;
		data.gpOrgPath = info.gpOrgPath;
		data.password = info.password;
		data.IDCard = info.IDCard;
		data.phone = info.phone;
		data.email = info.email;
		data.loginNums = info.loginNums;
		setLoginTypeVal(info.loginType);
		setNowExporeTime(info.expireDate ? info.expireDate : '');
		setSelectTimeVal(info.expire);//使用期限 
		setLoginReplaceType(info.loginReplace)
		if (info.loginReplace == 'N') {
			setReplaceShow(true)
		} else {
			setReplaceShow(false)
		}
		if (info.expire == 'Y') {
			setTimeShow(false)
		} else {
			setTimeShow(true)
		}
		if (info.timeAction == '') {
			setTimeActionType('close')
			setTimeActionShow(true)
		} else {
			setTimeActionType(info.timeAction)
			setTimeActionShow(false)
		}
		data.replaceConfirm = info.replaceConfirm == 'Y' ? ['replaceConfirm'] : [];
		let rangeTimeArr = [];
		rangeTimeArr[0] = info.begTime ? info.begTime : ' ';
		rangeTimeArr[1] = info.endTime;
		data.rangeTime = rangeTimeArr;
		data.duration = info.duration == 'Y' || info.duration == true ? true : false;
		data.durationTime = info.durationTime;
		data.durationUnit = info.durationUnit;
		let orgKeys = info.gpOrgIDPath.split('.');
		setOrgkey(orgKeys);
		setOrgValue(info.gpOrgPath);
		setOrgVal(info.orgID);
		getModal(1, op);
		setTimeout(function () {
			formRef.current.setFieldsValue(data)
		}, 100)
	}

	const durationUnits = (
		<ProFormSelect
			width="70px"
			initialValue='min'
			noStyle
			options={[
				{
					label: language('project.cfgmngt.userlist.minute'),
					value: 'min',
				},
				{
					label: language('project.cfgmngt.userlist.hour'),
					value: 'hour',
				}
			]}
			name="durationUnit"
		/>
	)

	const minLoginNum = (
		<div className='minloginnumbox'>
			<div className='labeltext'>{language('project.cfgmngt.userlist.maximumlogins')}</div>
			<ProFormDigit
				noStyle
				label={language('project.cfgmngt.userlist.maximumlogins')}
				width="60px"
				style={{ marginTop: '5px' }}
				disabled={loginNumsShow}
				name='loginNums'
				min={2}
				max={999}
				fieldProps={{
					precision: 0
				}}
			/>
		</div>
	)

	return (
		<>
			<CardModal
			  title={language('project.cfgmngt.userlist.organization')}
				cardHeight={clientHeight + 182}
				leftContent={
					<LeftTree getTree={getTreeLeft} onSelectLeft={onSelectLeft} treeInc={treeInc} treeUrl={treeUrl} leftTreeData={leftTreeData} />
				}
				rightContent={
					<ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} />
				} />
			<ModalForm
				{...defaultUserSync}
				width='630px'
				wrapClassName='wrapModal'
				className='userlistmodal'
				key='userlistmodal'
				onFinish={async (values) => {
					save(values);
				}}
				formRef={formRef}
				title={op == 'add' ? language('project.add') : language('project.save')}
				visible={modalStatus}
				autoFocusFirstInput
				modalProps={{
					maskClosable: false,
					onCancel: () => {
						closeModal();
					}
				}}
				onVisibleChange={setModalStatus}
				submitTimeout={2000}>
				<ProFormText name='id' hidden />
				<ProFormText name='op' hidden />
				<ProFormSwitch checkedChildren={language('project.open')} unCheckedChildren={language('project.close')}
					name='status' label={language('project.cfgmngt.userlist.status')} />
				<NameText name='name' label={language('project.cfgmngt.userlist.username')} required={true} /> 
				<NameText name='text' label={language('project.cfgmngt.userlist.showname')} min={0} /> 
				<ProFormSelect options={userTypeList}
					name="kind"
					label={language('project.cfgmngt.userlist.usertype')}
					rules={[{ required: true, message: language("project.fillin") }]}
				/>
				<ProFormText name='orgID'
					rules={[{ required: true, message: regSeletcList.select.alertText }]}
					label={language('project.cfgmngt.userlist.org')} >
					<TreeSelect
						style={{ width: "100%" }}
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
				<NotesText name="note" label={language('project.cfgmngt.userlist.remark')} required={false} type={'text'} /> 
				<div className="usersynctabs" >
					<Tabs type="card" >
						<TabPane tab={language('project.cfgmngt.userlist.userattribute')} key="1" style={{ border: '1px solid #f4f4f4', borderTop:'0px solid' }}>
							<div className='usercontentbox'>
								<ProFormText.Password label={language('project.cfgmngt.userlist.localpassword')}
									name='password'
									width='316px'
								/>
								<div className='userlistselect'>
									<ProFormRadio.Group
										name="expire"
										value={selectTimeVal}
										width='316px'
										onChange={(checked) => {
											setSelectTimeVal(checked.target.value)
											if (checked.target.value == 'Y') {
												setTimeShow(false)
											} else {
												setTimeShow(true)
											}
										}}
										label={language('project.cfgmngt.userlist.expriationtime')}
										radioType="button"
										options={[
											{
												label: language('project.cfgmngt.userlist.forever'),
												value: 'N',
											},
											{
												label: language('project.cfgmngt.userlist.expire'),
												value: 'Y',
											}
										]}
									/>
									<ProFormDateTimePicker disabled={timeShow}
										width='316px'
										name="expireDate" showTime
										onChange={(key, val) => {
											setNowExporeTime(val)
										}}
										fieldProps={{
											format: (value) => value.format('YYYY-MM-DD HH:mm:ss')
										}}
										label={language('project.cfgmngt.userlist.effectivedate')} />
								</div>
								<ProFormText label={language('project.cfgmngt.userlist.idcard')} width='316px' name='IDCard'
									rules={[
										{
											pattern: regList.idcard.regex,
											message: regList.idcard.alertText,
										},
									]}
								/>
								<ProFormText label={language('project.cfgmngt.userlist.phone')} width='316px' name='phone'
									rules={[
										{
											pattern: regList.phoneorlandline.regex,
											message: regList.phoneorlandline.alertText,
										},
									]}
								/>
								<ProFormText label={language('project.cfgmngt.userlist.email')} width='316px' name='email'
									rules={[
										{
											pattern: regList.email.regex,
											message: regList.email.alertText,
										},
									]}
								/>
							</div>
						</TabPane>
						<TabPane tab={language('project.cfgmngt.userlist.loginrestriction')} key="2" style={{ border: '1px solid #f4f4f4', borderTop:'0px solid' }}>
							<div className='usercontentbox'>
								<Col offset={4}>
									<Space>
										<div className='loginbox'>
											<div className='labelbox'>{language('project.cfgmngt.userlist.loginmode')}</div>
											<div>
												<ProFormRadio.Group name="loginType" id='logintype'
													width="200px"
													value={loginTypeVal}
													options={[
														{ label: language('project.cfgmngt.userlist.singlesignon'), value: 'single' },
														{ label: language('project.cfgmngt.userlist.multisignon'), value: 'multi' },
													]}
													onChange={(checked) => {
														setLoginTypeVal(checked.target.value)
														if (checked.target.value == 'single') {
															setLoginNumsShow(true)
														} else {
															setLoginNumsShow(false)
														}
													}}
													addonAfter={minLoginNum}
												/>
											</div>
										</div>
									</Space>
								</Col>
								<div className='userlistselect'>
									<ProFormRadio.Group
										name="loginReplace"
										value={loginReplaceType}
										onChange={(checked) => {
											setLoginReplaceType(checked.target.value)
											if (checked.target.value == 'N') {
												setReplaceShow(true)
											} else {
												setReplaceShow(false)
											}
										}}
										label={language('project.cfgmngt.userlist.overrunlogin')}
										radioType="button"
										options={[
											{
												label: language('project.cfgmngt.userlist.replacesloggedin'),
												value: 'Y',
											},
											{
												label: language('project.cfgmngt.userlist.rejectnewterminal'),
												value: 'N',
											}
										]}
									/>
									<Col offset={7}>
										<ProFormCheckbox.Group name="replaceConfirm"
											width="300px"
											disabled={replaceShow}
											options={[{ label: language('project.cfgmngt.userlist.replacementterminalconfirmwhethertologoutsubstitute'), value: 'replaceConfirm' }]}
										/>
									</Col>
								</div>
								<div className='userlistselect loginReplacebox'>
									<ProFormRadio.Group
										name="timeAction"
										value={timeActionType}
										onChange={(checked) => {
											setTimeActionType(checked.target.value)
											if (checked.target.value == 'close') {
												setTimeActionShow(true)
											} else {
												setTimeActionShow(false)
											}
										}}
										label={language('project.cfgmngt.userlist.loginwindow')}
										radioType="button"
										options={[
											{
												label: language('project.cfgmngt.userlist.closecontrol'),
												value: 'close',
											},
											{
												label: language('project.cfgmngt.userlist.allowlogin'),
												value: 'permit',
											},
											{
												label: language('project.cfgmngt.userlist.disablelogin'),
												value: 'deny',
											}
										]}
									/>
								</div>
								<div className='rangetimebox'>
									<Col offset={7}>
										<ProFormTimePicker.RangePicker
											style={{ width: '316px' }}
											disabled={timeActionShow}
											onChange={(key, val) => {
												setRangeTimeVal(val)
											}}
											name='rangeTime'
											fieldProps={{
												format: "HH"
											}} />
									</Col>
								</div>
								<Col offset={4}>
									<Space>
										<div className='durationbox'>
											<div className='labelbox'>{language('project.cfgmngt.userlist.loginduration')}</div>
											<ProFormCheckbox name='duration' />
											<div style={{ lineHeight: '22px' }}>{language('project.cfgmngt.userlist.enablesingledayloginduration')}</div>

											<ProFormDigit width="58px"
												addonAfter={durationUnits}
												name='durationTime'
												min={1}
												max={999}
												fieldProps={{
													precision: 0
												}}
											/>
										</div>
									</Space>
								</Col>
							</div>
						</TabPane>
					</Tabs>
				</div>
			</ModalForm >
		</>
	);
};

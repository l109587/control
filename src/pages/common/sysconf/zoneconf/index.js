import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, message, Modal, TreeSelect, Tree, Popconfirm } from 'antd';
import { fileDown, post } from '@/services/https';
import { SaveFilled, ExclamationCircleOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import ProForm, { ProFormTextArea, ModalForm, ProFormText, ProFormSelect, ProFormRadio } from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-components';
import { modalFormLayout } from "@/utils/helper";
import { language } from '@/utils/language';
import { NameText, NotesText } from '@/utils/fromTypeLabel';
import { regSeletcList, regList } from '@/utils/regExp';
import { Base64 } from 'js-base64';
import Uploadd from '@/utils/Upload';
import '@/utils/index.less';
import './index.less';
import { regMacList } from '@/utils/regExp';
import { TableLayout, LeftTree, CardModal } from '@/components';
const { ProtableModule } = TableLayout;
const { Search } = Input
let H = document.body.clientHeight - 285
var clientHeight = H
export default () => {
	const columns = [
		{
			title: language('project.cfgmngt.syszone.areaname'),
			dataIndex: 'name',
			align: 'left',
			ellipsis: true,
			importStatus: 0,
			width: 160,
		},
		{
			title: language('project.cfgmngt.syszone.serial'),
			dataIndex: 'number',
			align: 'left',
			ellipsis: true,
			importStatus: 0,
			width: 180,
		},
		{
			title: language('project.cfgmngt.syszone.superior'),
			dataIndex: 'gpname',
			align: 'left',
			ellipsis: true,
			importStatus: 0,
			width: 180,
			ellipsis: true,
		},
		{
			title: language('project.cfgmngt.syszone.type'),
			dataIndex: 'type',
			align: 'left',
			ellipsis: true,
			importStatus: 0,
			width: 80,
			render: (text, record) => {
				if (record.type == 'zone') {
					return language('project.cfgmngt.syszone.zone');
				}
				return language('project.cfgmngt.syszone.org');
			}
		},
		{
			title: language('project.cfgmngt.syszone.content'),
			dataIndex: 'ipaddr',
			width: 150,
			ellipsis: true,
			align: 'left',
			render: (text, record, index) => {

				return record.ipaddr ? record.ipaddr.join(';') : '';
			},
		},
		{
			title: language('project.remark'),
			dataIndex: 'notes',
			align: 'left',
			ellipsis: true,
			importStatus: 0,
		},
		{
			title: '',
			dataIndex: 'gpidPath',
			align: 'left',
			importStatus: 1,
			ellipsis: true,
			width: 160,
			hideInTable: true,
		},
		{
			title: '',
			dataIndex: 'gpnamePath',
			align: 'left',
			importStatus: 1,
			ellipsis: true,
			width: 160,
			hideInTable: true,
		},
		{
			title: language('project.createTime'),
			dataIndex: 'createTime',
			importStatus: 1,
			ellipsis: true,
			width: 120,
			align: 'left',
			ellipsis: true,
		},
		{
			title: language('project.updateTime'),
			dataIndex: 'updateTime',
			importStatus: 1,
			ellipsis: true,
			width: 120,
			align: 'left',
			ellipsis: true,
		},
		{
			width: 80,
			title: language('project.mconfig.operate'),
			align: 'center',
			fixed: 'right',
			importStatus: 1,
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

	const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态\
	const [imoritModalStatus, setImoritModalStatus] = useState(false);//导入 上传文件弹出框
	const [importFieldsList, setImportFieldsList] = useState(false);//导入 选择字段
	const [ifImport, setIfImport] = useState(true);//显示上传 or 显示匹配字段
	const [op, setop] = useState('add');//选中id数组
	const [oldName, setOldName] = useState();//修改前地址名称
	const [zoneId, setZoneId] = useState();
	const [modZoneId, setModZoneId] = useState();//默认编辑地址id
	const { confirm } = Modal;
	const zoneType = 'all';

	const [fileCode, setFileCode] = useState('utf-8');//文件编码
	//接口参数
	const paramentUpload = {
		'filecode': fileCode,
	}
	const fileList = [];
	const uploadConfig = {
		accept: 'csv', //接受上传的文件类型：zip、pdf、excel、image
		max: 100000000000000, //限制上传文件大小
		url: '/cfg.php?controller=confZoneManage&action=importZone',
	}

	//列表数据
	const formRef = useRef();
	const [treeValue, setTreeValue] = useState();
	const [treekey, setTreekey] = useState([]);
	const [treeData, setTreeData] = useState([]);

	/** 左侧树形组件 start */
	const treeUrl = '/cfg.php?controller=confZoneManage&action=showZoneTree';
	const leftTreeData = { id: 1, type: 'tree', depth: '1' };
	const [treeInc, setTreeInc] = useState(0);
	//getTree 请求树形内容
	//onSelectLeft
	/** 左侧树形组件 end */

	const [orgStatus, setOrgStatus] = useState('zone');
	const [editableKeys, setEditableRowKeys] = useState();//每行编辑的id
	const [confirmLoading, setConfirmLoading] = useState(false);
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
	const fromcolumns = [
		{
			title: language('project.cfgmngt.syszone.content'),
			dataIndex: 'address',
			align: 'center',
			formItemProps: () => {
				return {
					rules: [{ required: true, pattern: regMacList.ipv4mask.regex, message: regMacList.ipv4mask.alertText }],
				};
			},
		},
		{
			title: language('project.operate'),
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

	/** table组件 start */
	const rowKey = (record => record.id);//列表唯一值
	const tableHeight = clientHeight - 10;//列表高度
	const tableKey = 'zoneconf';//table 定义的key
	const rowSelection = true;//是否开启多选框
	const addButton = true; //增加按钮  与 addClick 方法 组合使用
	const delButton = true; //删除按钮 与 delClick 方法 组合使用
	const uploadButton = true; //导入按钮 与 uploadClick 方法 组合使用
	const downloadButton = true; //导出按钮 与 downloadClick 方法 组合使用
	const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
	const columnvalue = 'zoneconfcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
	const apishowurl = '/cfg.php?controller=confZoneManage&action=showZoneList';//接口路径
	const [queryVal, setQueryVal] = useState();//首个搜索框的值
	let searchVal = { queryVal: queryVal, queryType: 'fuzzy', id: zoneId };//顶部搜索框值 传入接口

	//初始默认列
	const concealColumns = {
		id: { show: false },
		gpid: { show: false },
		updateTime: { show: false },
		createTime: { show: false },
	}
	/* 顶部左侧搜索框*/
	const tableTopSearch = () => {
		return (
			<Search
				placeholder={language('project.cfgmngt.syszone.tablesearch')}
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
		setOrgStatus('zone');
		let initialValue = [];
		setTimeout(function () {
			formRef.current.setFieldsValue(initialValue)
		}, 100);
		getModal(1, 'add');
	}

	//导入按钮
	const uploadClick = () => {
		getImportModal(1);
	}

	//导出按钮
	const downloadClick = () => {
		exportFunction();
	}

	/** table组件 end */

	const incAdd = () => {
		let inc;
		clearTimeout(inc);
		inc = setTimeout(() => {
			setIncID(incID + 1);
		}, 100);
	}

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

	//点击下拉渲染数据
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

	useEffect(() => {
		if (treeValue) {
			setTimeout(function () {
				formRef.current.setFieldsValue({ gpname: treeValue })
			}, 100)
		}
	}, [treeValue])

	//区域管理处理
	const getTree = (res) => {
		const treeInfoData = [
			res.node,
		];
		setTreeData(treeInfoData);
		let zID = 1;
		if (res.defaultPath) {
			zID = res.node.id;
		}
		setZoneId(zID);
		incAdd()
	}

	// 区域管理侧边点击id处理
	const onSelectLeft = (selectedKeys, info) => {
		setZoneId(selectedKeys[0]);//更新选中地址id
		incAdd()
	};

	/* 判断是否弹出添加model*/
	const getModal = (status, op) => {
		if (status == 1) {
			setop(op)
			setModalStatus(true);
		} else {
			setModZoneId();
			setTreeValue();
			setModalStatus(false);
		}
	}

	/* 添加修改接口*/
	const save = (info) => {
		let gpid = '';
		let gpidPath = '';
		//判断选中地址id
		if (treekey.length > 0) {
			gpid = treekey[treekey.length - 1];
			gpidPath = treekey.join('.');
		}
		let tVal = []
		let gpnme = '';
		if (treeValue) {
			tVal = treeValue.split('/');
			//判断选中地址名称
			if (tVal.length > 0) {
				gpnme = tVal[tVal.length - 1]
			}
		}
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
		let data = {};
		data.op = op;
		data.id = info.id;
		data.name = info.name;
		data.number = info.number;//区域编号
		data.notes = info.notes;
		data.type = info.type;
		data.oldName = oldName;
		data.gpid = gpid;//上级部门ID
		data.gpnme = gpnme;//上级部门名称
		data.gpidPath = gpidPath;//上级部门id 路径
		data.ipaddr = addrlist;//ip范围
		post('/cfg.php?controller=confZoneManage&action=setZone', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			setTreeValue(' ');
			setTreekey([]);
			getModal(2);
			setTreeInc(treeInc + 1);
		}).catch(() => {
			console.log('mistake')
		})

	}

	/* 删除数据 */
	const delList = (selectedRowKeys, dataList) => {
		let selectedRowNames = [];
		dataList.map((item) => {
			if (selectedRowKeys.indexOf(item.id) != -1) {
				selectedRowNames.push(item.name);
			}
		})
		let data = {};
		data.ids = selectedRowKeys.join(',');
		data.names = selectedRowNames.join(',');
		post('/cfg.php?controller=confZoneManage&action=delZone', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			setTreeInc(treeInc + 1);

		}).catch(() => {
			console.log('mistake')
		})

	}

	/* 编辑 */
	const mod = (obj, op) => {
		if (obj.type == 'org') {
			setOrgStatus('org');
		} else {
			setOrgStatus('zone');
		}
		let addrlist = obj.ipaddr ? obj.ipaddr : [];
		let rowKey = [];
		let defaultDataInfo = [];
		addrlist.map((item, index) => {
			defaultDataInfo.push({ id: (index + 1), address: item });
			rowKey.push(index + 1);
		})
		obj.addrlistinfo = defaultDataInfo;
		setTreeValue(obj.gpnamePath);
		setOldName(obj.name)
		let key = '';
		if (obj.gpidPath) {
			key = obj.gpidPath.split('.');
		}
		setModZoneId(obj.id);
		setTreekey(key)
		let initialValues = obj;
		getModal(1, op);
		setTimeout(function () {
			formRef.current.setFieldsValue(initialValues)
		}, 500)
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
				wrapClassName: 'zonemodalupload',
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
		post('/cfg.php?controller=confZoneManage&action=importZone', data).then((res) => {
			if (!res.success) {
				message.error(res.msg);
				return false;
			}
			message.success(res.msg);
			getCloseImport();
			incAdd()
		}).catch(() => {
			console.log('mistake')
		})
	}

	/* 导出功能 */
	const exportFunction = () => {
		fileDown('/cfg.php?controller=confZoneManage&action=exportZone').then((res, b, c) => {
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
				title={language('project.cfgmngt.syszone.treelist')}
				cardHeight={clientHeight + 182}
				leftContent={
					<LeftTree getTree={getTree} onSelectLeft={onSelectLeft} treeInc={treeInc} treeUrl={treeUrl} leftTreeData={leftTreeData} />
				}
				rightContent={
					<ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} uploadButton={uploadButton} uploadClick={uploadClick} downloadButton={downloadButton} downloadClick={downloadClick} />
				} />
			<ModalForm {...modalFormLayout}
				className='addzonemodal'
				formRef={formRef}
				title={op == 'add' ? language('project.cfgmngt.syszone.addarea') : language('project.cfgmngt.syszone.modarea')}
				visible={modalStatus} autoFocusFirstInput
				modalProps={{
					maskClosable: false,
					destroyOnClose: true,
					onCancel: () => {
						getModal(2)
					},
				}} submitTimeout={2000} onFinish={async (values) => {
					save(values);
				}}>
				<ProFormText hidden={true} type="hidden" name="id" label="IP" />
				<ProFormText hidden={true} name="op" label={language('project.cfgmngt.syszone.opcode')} initialValue={op} />
				<NameText name='name' label={language('project.cfgmngt.syszone.areaname')} required={true} /> 
				<ProFormText name="number" label={language('project.cfgmngt.syszone.serial')}  rules={[{ required: true, pattern: regList.englishOrnum.regex, message: regList.englishOrnum.alertText }]}/>
				{modZoneId == 1 ? ('') :
					<>
						<ProFormText name="gpname"
							initialValue={treeValue}
							label={language('project.cfgmngt.syszone.superior')}
							rules={[{ required: true, message: regSeletcList.select.alertText }]}>
							<TreeSelect
								name='gpnamePath'
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
						<ProFormSelect options={[
							{
								value: 'zone',
								label: language('project.cfgmngt.syszone.zone')
							}, {
								value: 'org',
								label: language('project.cfgmngt.syszone.org')
							}
						]}
							onChange={(key, val) => {
								setOrgStatus(key);
							}}
							name="type"
							rules={[{ required: true, message: regSeletcList.select.alertText }]}
							label={language('project.cfgmngt.syszone.type')}
						/>
					</>
				}
				<NotesText name="notes" label={language('project.remark')} width="xl" required={false} /> 
				{orgStatus == 'org' ?
					<ProForm.Item label={language('project.cfgmngt.syszone.addrlist')} name="addrlistinfo" trigger="onValuesChange" >
						<EditableProTable
							scroll={{ y: 170 }}
							rowKey="id"
							className='zonetablelist'
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
					: ('')}
			</ModalForm>

			<ModalForm {...modalFormLayout}
				className='filezonemodal'
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
						<ProFormText tooltip={language('project.cfgmngt.syszone.fileformatcsv')} label={language('project.cfgmngt.syszone.import')} >
							<Uploadd
								width="200px"
								config={uploadConfig}
								paramentUpload={paramentUpload}
								fileList={fileList}
								onSuccess={onFileSuccess}
								onPreview={(file) => { }}
							>
								<Button
									size="small"
								>
									{language('project.cfgmngt.syszone.importfile')}
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











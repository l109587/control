import React, { useRef, useState, useEffect } from 'react';
import { Space, Tag, Input, TreeSelect, Switch, Tooltip } from 'antd';
import ProCard from '@ant-design/pro-card';
import { ProFormSelect, StatisticCard, ProFormText } from '@ant-design/pro-components';
import { post, get } from '@/services/https';
import { RingProgress } from '@ant-design/plots';
import { TableList } from './..//components';
import { language } from '@/utils/language';
import '@/utils/index.less';
import './index.less';
import { TableLayout } from '@/components';
const { ProtableModule } = TableLayout;
const { Statistic, Divider } = StatisticCard;
const { Search } = Input
let H = document.body.clientHeight - 427
var clientHeight = H
export default (props) => {
	const onstateType = props.location?.state?.type;

	const columnsList = [
		{
			title: '',
			dataIndex: 'id',
			align: 'center',
			ellipsis: true,
			hideInTable: true,
		},
		{
			title: language('project.central.status'),
			dataIndex: 'onState',
			align: 'center',
			ellipsis: true,
			width: 80,
			filters: [
				{ text: language('project.central.online'), value: 'online' },
				{ text: language('project.central.offline'), value: 'offline' },
			],
			filterMultiple: false,
			render: (text, record, index) => {
				let color = 'success';
				let name = language('project.central.online');
				if (record.onState == 'offline') {
					color = 'default';
					name = language('project.central.offline');
				}
				return (
					<Space>
						<Tag style={{marginRight:'0px'}} color={color} key={record.onState}>
							{name}
						</Tag>
					</Space>
				)
			}
		},
		{
			title: language('project.central.ressta.ipaddr'),
			dataIndex: 'ipaddr',
			width: 110,
			ellipsis: true,
		},
		{
			title: language('project.central.ressta.macaddress'),
			dataIndex: 'realMac',
			width: 120,
			ellipsis: true,
			render: (text, record, index) => {
				let color = '';
				if (record.assignMac != record.realMac && record.assignMac != '') {
					color = 'red';
				}
				return (
					<Tooltip title={record.assignMac} placement='top'>
						<span style={{ color: color }}>{record.realMac}</span>
					</Tooltip>
				)
			}
		},
		{
			title: language('project.central.ressta.ifuse'),
			dataIndex: 'useState',
			width: 110,
			align: 'center',
			ellipsis: true,
			filters: [
				{ text: language('project.central.ressta.used'), value: 'used' },
				{ text: language('project.central.ressta.notused'), value: 'unused' },
			],
			filterMultiple: false,
			render: (text, record, index) => {
				let color = 'default';
				let name = language('project.central.ressta.notused');
				if (record.useState == 'used') {
					color = '#FF7429';
					name = language('project.central.ressta.used');
				}
				return (
					<Space>
						<Tag style={{marginRight:'0px'}} color={color} key={record.useState}>
							{name}
						</Tag>
					</Space>
				)
			}
		},
		{
			title: language('project.central.ressta.ifdistribution'),
			dataIndex: 'mngState',
			width: 110,
			align: 'center',
			ellipsis: true,
			filters: [
				{ text: language('project.central.ressta.assigned'), value: 'assigned' },
				{ text: language('project.central.ressta.unassigned'), value: 'unassigned' },
				{ text: language('project.central.ressta.reserved'), value: 'reserve' },
			],
			filterMultiple: false,
			render: (text, record, index) => {
				let color = 'default';
				let name = language('project.central.ressta.unassigned');
				if (record.mngState == 'assigned') {
					color = '#12C189';
					name = language('project.central.ressta.assigned');
				} else if (record.mngState == 'reserve') {
					color = '#FCCA00';
					name = language('project.central.ressta.reserved');
				}
				return (
					<Space>
						<Tag style={{marginRight:'0px'}} color={color} key={record.mngState}>
							{name}
						</Tag>
					</Space>
				)
			}
		},
		{
			title: language('project.central.ressta.organization'),
			dataIndex: 'orgID',
			width: 120,
			ellipsis: true,
			filters: [],
			render: (text, record, index) => {
				return record.org;
			}
		},
		{
			title: language('project.central.ressta.subnet'),
			dataIndex: 'subnetID',
			width: 120,
			ellipsis: true,
			filters: [],
			render: (text, record, index) => {
				return record.subnet;
			}
		},
		{
			title: language('project.central.ressta.location'),
			dataIndex: 'location',
			width: 100,
			ellipsis: true,
		},
		{
			title: language('project.central.ressta.user'),
			dataIndex: 'user',
			width: 80,
			ellipsis: true,
		},
		{
			title: language('project.central.ressta.contactnumber'),
			dataIndex: 'phone',
			width: 110,
			ellipsis: true,
		},
		{
			title: language('project.central.ressta.termofvalidity'),
			dataIndex: 'expireTime',
			width: 140,
			ellipsis: true,
			render: (text, record, index) => {
				if (record.validType == 'expire') {
					return record.expireTime;
				} else {
					return language('project.central.ressta.forever');
				}
			}
		},
		{
			title: language('project.central.ressta.businesspurpose'),
			dataIndex: 'buisUsg',
			width: 120,
			ellipsis: true,
		},
		{
			title: language('project.central.ressta.lastupdatetime'),
			dataIndex: 'lastTime',
			width: 140,
			ellipsis: true,
		},
	];

	/** table组件 start */
	const rowKey = (record => record.id);//列表唯一值
	const tableHeight = clientHeight;//列表高度
	const tableKey = 'ressta';//table 定义的key
	const rowSelection = false;//是否开启多选框
	const addButton = false; //增加按钮  与 addClick 方法 组合使用
	const delButton = false; //删除按钮 与 delClick 方法 组合使用
	const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
	const columnvalue = 'resstacolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
	const apishowurl = '/cfg.php?controller=analyze&action=showResourceInfo';//接口路径
	const [queryVal, setQueryVal] = useState();//首个搜索框的值

	const concealColumns = {
		id: { show: false },
		createTime: { show: false },
		updateTime: { show: false },
	};//设置默认列

	const [deviceList, setDeviceList] = useState([]);//业务用途
	const [subnetList, setSubnetList] = useState([]);//所属子网
	//区域数据
	const zoneType = 'zone';
	const [treeData, setTreeData] = useState([]);
	const [zoneID, setZoneID] = useState();//区域搜索、
	//组织机构
	const orgType = 'org';
	const [orgData, setOrgData] = useState([]);
	const [orgID, setOrgID] = useState();//区域搜索、
	const [orgIDFrom, setOrgIDFrom] = useState(onstateType ? onstateType : '');//区域搜索、

	const [deviceID, setDeviceID] = useState();
	const [subnetID, setSubnetID] = useState();//所属子网
	const [columns, setColumns] = useState(columnsList);//table 表头
	const [statistics, setStatistics] = useState([]);//统计
	let searchVal = { queryVal: queryVal, zoneID: zoneID, orgID: orgIDFrom, deviceID: deviceID, subnetID: subnetID };
	const distributionconfig = {
		height: 70,
		width: 70,
		autoFit: false,
		percent: Math.round((statistics.assigned / statistics.total) * 100) / 100,
		color: ['#12C189', '#E8EDF3'],
	};
	const useconfig = {
		height: 70,
		width: 70,
		autoFit: false,
		percent: Math.round((statistics.used / statistics.total) * 100) / 100,
		color: ['#FF7429', '#E8EDF3'],
	};
	const onlineconfig = {
		height: 70,
		width: 70,
		autoFit: false,
		percent: Math.round((statistics.online / statistics.total) * 100) / 100,
		color: ['#1684FC', '#E8EDF3'],
		tooltip: {
			customContent: (title, data) => {
				return `<div>${0.7}</div>`
			}
		}
	};
	useEffect(() => {
		getTree();
		getStatistics();
		getBusinessPurpose();
	}, [])

	/* 顶部概要数据 */
	const getStatistics = () => {
		post('/cfg.php?controller=analyze&action=showResourceStats').then((res) => {
			setStatistics(res.data);
		}).catch(() => {
			console.log('mistake')
		})
	}

	//区域管理start
	//区域管理 获取默认列表
	const getTree = (id = 1) => {
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
			setTreeData(treeInfoData);
		}).catch(() => {
			console.log('mistake')
		})
	}
	//下拉列表选中
	const onChangeSelect = (newValue) => {
		setZoneID(newValue);
		showDeviceList(newValue);
		setOrgID('');
		setOrgIDFrom('')
		getOrgTree(newValue);
		setIncID(incID + 1);
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

	//组织机构start
	//组织机构 获取默认列表
	const getOrgTree = (id = 1) => {
		let data = {};
		data.id = id;
		data.type = orgType;
		post('/cfg.php?controller=confZoneManage&action=showZoneTree', data).then((res) => {
			const treeInfoData = [
				{
					id: res.id,
					pId: res.gpid,
					value: res.id,
					title: res.name,
				},
			]
			setOrgData(treeInfoData);
		}).catch(() => {
			console.log('mistake')
		})
	}
	//组织机构下拉列表选中
	const onOrgChangeSelect = (newValue) => {
		setOrgID(newValue);
		setOrgIDFrom(newValue)
		showIPSubNetAddr(newValue);
		setIncID(incID + 1);
	};
	//组织机构下拉处理
	const onOrgLoadData = ({ id, children }) =>
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
	//组织机构end

	//级联设备列表
	const showDeviceList = (id = 1) => {
		let data = {};
		data.zoneID = id;
		post('/cfg.php?controller=device&action=showDeviceList', data).then((res) => {
			let info = [];
			res.data.map((item) => {
				let confres = [];
				confres.label = item.ipaddr;
				confres.value = item.id;
				info[item.id] = confres;
			})
			setDeviceList(info);
			setDeviceID();
			setIncID(incID + 1);
		}).catch(() => {
			console.log('mistake')
		})
	}

	//业务用途 获取资源字段 id
	const getBusinessPurpose = (id = 1) => {
		post('/cfg.php?controller=confResField&action=showResField', { id: id }).then((res) => {
			let info = [];
			res.data.map((item) => {
				info.push({ text: item, value: item });
			})
			let columnsList = columns;
			columnsList.map((item) => {
				if (item.dataIndex == 'buisUsg') {
					item.filters = info;
					item.filterMultiple = false;
				}
			})
			setColumns([...columnsList]);
		}).catch(() => {
			console.log('mistake')
		})
	}

	//子网配置筛选
	const showIPSubNetAddr = (orgID) => {
		let data = {};
		data.orgID = orgID;
		post('/cfg.php?controller=confIPAddrManage&action=showIPSubNetAddr', data).then((res) => {
			let info = [];
			res.data.map((item) => {
				let confres = [];
				confres.label = item.subNetaddr;
				confres.value = item.id;
				info[item.id] = confres;
			})
			setSubnetList(info);
			setSubnetID();
			setIncID(incID + 1);
		}).catch(() => {
			console.log('mistake')
		})
	}

	//头部搜索框数据
	const tableTopSearch = () => {
		return (
			<Space className='searchresstabox'>
				<Search
					placeholder={language('project.central.ressta.search')}
					style={{ width: 200 }}
					onSearch={(queryVal) => {
						setQueryVal(queryVal);
						setIncID(incID + 1);
					}}
				/>
				<ProFormText>
					<TreeSelect
						className='resstatree'
						name='ganame'
						treeDataSimpleMode
						value={zoneID}
						dropdownStyle={{
							overflow: 'auto',
						}}
						onChange={onChangeSelect}
						loadData={onLoadData}
						treeData={treeData}
						placeholder={language('project.central.belongingzone')}
					/>
				</ProFormText>
				<ProFormText>
					<TreeSelect
						className='resstatree'
						name='org'
						treeDataSimpleMode
						value={orgID}
						dropdownStyle={{
							overflow: 'auto',
						}}
						onChange={onOrgChangeSelect}
						loadData={onOrgLoadData}
						treeData={orgData}
						placeholder={language('project.central.ressta.organization')}
					/>
				</ProFormText>
				<ProFormSelect options={subnetList}
					name="subnetID"
					onChange={(key) => {
						setSubnetID(key);
						setIncID(incID + 1);
					}}
					fieldProps={{
						value: subnetID,
					}}
					placeholder={language('project.central.ressta.subnet')}
				/>
				<ProFormSelect options={deviceList}
					name="deviceID"
					onChange={(key) => {
						setDeviceID(key);
						setIncID(incID + 1);
					}}
					fieldProps={{
						value: deviceID,
					}}
					placeholder={language('project.central.belonginggateway')}
				/>
			</Space>
		)
	}

	return (
		<>
			<ProCard direction='column' ghost gutter={[13, 13]}>
				<ProCard ghost>
					<StatisticCard.Group>
						<StatisticCard className='illinncard' colSpan="19%" statistic={{
							title: <div className='cardtitle'>{language('project.central.ressta.numaddressresources')}</div>,
							value: statistics.total,
						}} />
						<Divider type='vertical' />
						<StatisticCard colSpan="26%" className='resstabox' layout='center' statistic={{
							title: <div className='resstatitle'>{language('project.central.ressta.distributionstatistics')}</div>,
							value: statistics.assigned,
							description: <Statistic title={language('project.central.ressta.proportion')} value={(statistics.assigned ? Math.round((statistics.assigned / statistics.total) * 10000) / 100 : 0) + '％'} />,
						}} chart={<RingProgress className='ressta' {...distributionconfig} />} chartPlacement="left" />
						<StatisticCard colSpan="26%" className='resstabox' layout='center' statistic={{
							title: <div className='resstatitle'>{language('project.central.ressta.usestatistics')}</div>,
							value: statistics.used,
							description: <Statistic title={language('project.central.ressta.proportion')} value={Math.round((statistics.used / statistics.total) * 10000) / 100 + '％'} />,
						}} chart={<RingProgress className='mailpie' {...useconfig} />} chartPlacement="left" />
						<StatisticCard colSpan="26%" className='resstabox' layout='center' statistic={{
							title: <div className='resstatitle'>{language('project.central.ressta.onlinestatistics')}</div>,
							value: statistics.online,
							description: <Statistic title={language('project.central.ressta.proportion')} value={Math.round((statistics.online / statistics.total) * 10000) / 100 + '％'} />,
						}} chart={<RingProgress className='netinpie' {...onlineconfig} />} chartPlacement="left" />
					</StatisticCard.Group>
				</ProCard>
				<ProCard ghost>
					<ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} addButton={addButton} rowSelection={rowSelection} />
				</ProCard>
			</ProCard>
		</>
	);
};

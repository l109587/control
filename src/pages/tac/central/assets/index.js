import React, { useRef, useState, useEffect } from 'react';
import { AppleFilled } from '@ant-design/icons';
import { Space, Tag, Input, TreeSelect, Switch, Tooltip } from 'antd';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { post, get } from '@/services/https';
import { EthernetOff } from '@icon-park/react';
import '@/utils/index.less';
import './index.less';
import { TableList } from './..//components';
import { language } from '@/utils/language';
import { Resizable } from 'react-resizable';
import { TableLayout } from '@/components';
const { ProtableModule } = TableLayout;
const { Search } = Input
let H = document.body.clientHeight - 293
var clientHeight = H;

// 调整table表头
const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;
  if(!width) {
    return <th {...restProps} />;
  }

  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

export default () => {
	const columnsList = [
		{
			title: language('project.central.assets.id'),
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
			title: language('project.central.assetname'),
			dataIndex: 'name',
			width: 140,
			ellipsis: true,
		},
		{
			title: language('project.central.assetip'),
			dataIndex: 'ipaddr',
			width: 110,
			ellipsis: true,
		},
		{
			title: language('project.central.assetmac'),
			dataIndex: 'macaddr',
			width: 130,
			ellipsis: true,
		},
		{
			title: language('project.central.assettype'),
			dataIndex: 'devtypeID',
			width: 100,
			ellipsis: true,
			render: (text, record, index) => {
				return record.devtype ? devtype(record.devtypeID, record.devtype) : '';
			}
		},
		{
			title: language('project.central.operatingsystem'),
			dataIndex: 'systypeID',
			width: 100,
			ellipsis: true,
			render: (text, record, index) => {
				return record.systype ? systype(record.systypeID, record.systype) : '';
			}
		},
		{
			title: language('project.central.personliable'),
			dataIndex: 'responsible',
			width: 80,
			ellipsis: true,
		},
		{
			title: language('project.central.assets.accessequipment'),
			dataIndex: 'swip',
			width: 110,
			ellipsis: true,
		},
		{
			title: language('project.central.assets.accesslocation'),
			dataIndex: 'swport',
			className: 'swprot',
			width: 100,
			ellipsis: true,
			render: (text, record, index) => {
				return record.swport ? (
					<Tooltip title={record.swport} placement='top'>
						<Tag icon={<EthernetOff style={{lineHeight : '22px'}} />} style={{ color: '#1DC5C4',marginRight:'0px' }} key={record.onState}>
							{record.swport}
						</Tag>
					</Tooltip>
				) : '';
			}
		},
		{
			title: language('project.central.assets.firstdiscoverytime'),
			dataIndex: 'firstTime',
			width: 140,
			ellipsis: true,
		},
		{
			title: language('project.central.assets.lastofflinetime'),
			dataIndex: 'offlineTime',
			width: 140,
			ellipsis: true,
		},
	];

	const devtype = (val, name) => {
		switch (val) {
			case '2': return devContent('iconfont icon-bijibendiannao', name);
			case '3': return devContent('iconfont icon--kehuduan', name);
			case '4': return devContent('iconfont icon-xuniji1', name);
			case '5': return devContent('iconfont icon-shouji', name);
			case '6': return devContent('iconfont icon-dayinji_o', name);
			case '7': return devContent('iconfont icon-nanhaiIPdianhuashenqing', name);
			case '8': return devContent('iconfont icon-shexiangtou', name);
			case '9': return devContent('iconfont icon-pos', name);
			case '10': return devContent('iconfont icon-jiaohuanji', name);
			case '11': return devContent('iconfont icon-luyouqi', name);
			case '12': return devContent('iconfont icon-luyouqi1', name);
			case '13': return devContent('iconfont icon-tp-wr710n', name);
			case '14': return devContent('iconfont icon-wangluoshebei', name);
			case '15': return devContent('iconfont icon-fuwuqi', name);
			case '16': return devContent('iconfont icon-fuwuqi', name);
			case '17': return devContent('iconfont icon-winfuwuqi', name);
			case '18': return devContent('iconfont icon-jiaohuanji', name);
			case '19': return devContent('iconfont icon-server', name);
			case '19': return devContent('iconfont icon-server', name);
			case '20': return devContent('iconfont icon-6yingpanluxiangji', name);
			case '21': return devContent('iconfont icon-shebeijiekou', name);
			case '22': return devContent('iconfont icon-chuanzhenji', name);
			case '23': return devContent('iconfont icon-saomiaoyi', name);
			case '24': return devContent('iconfont icon-kaoqinji-01', name);
			case '25': return devContent('iconfont icon-menjin', name);
			case '26': return devContent('iconfont icon-jigouneijiaofei', name);
			case '27': return devContent('iconfont icon-UPS', name);
			case '28': return devContent('iconfont icon-zaixianjiance', name);
			case '29': return devContent('iconfont icon-daqiafafang', name);
			case '30': return devContent('iconfont icon-wangluoshebei', name);
			case '31': return devContent('iconfont icon-tv-box', name);
			case '32': return devContent('iconfont icon-pingbandiannao-', name);
			case '33': return devContent('iconfont icon-server', name);
			case '34': return devContent('iconfont icon-server', name);
			case '35': return devContent('iconfont icon-server', name);
			case '36': return devContent('iconfont icon-6yingpanluxiangji', name);
			case '37': return devContent('iconfont icon-jigui', name);
			case '38': return devContent('iconfont icon-yunzhongduan-shouye', name);
			case '39': return devContent('iconfont icon-wangluoshebei', name);
			case '40': return devContent('iconfont icon-dashboard_vmware', name);
			case '41': return devContent('iconfont icon-dashboard_vmware', name);
			case '42': return devContent('iconfont icon-wangluoshebei', name);
			case '43': return devContent('iconfont icon-pingbandiannao-', name);
			case '44': return devContent('iconfont icon-server', name);
			case '45': return devContent('iconfont icon-server', name);
			case '46': return devContent('iconfont icon-dianbiao', name);
			case '47': return devContent('iconfont icon-dianbiao', name);
			case '48': return devContent('iconfont icon-pingbandiannao-', name);
			case '49': return devContent('iconfont icon-dianbiao', name);
			case '50': return devContent('iconfont icon-dianbiao', name);
			case '51': return devContent('iconfont icon-bianmaqi', name);
			case '52': return devContent('iconfont icon-wangluoshebei', name);
		}
		return devContent('iconfont icon-zhongduan', name);
	}

	const devContent = (className, name) => {
		return <><i className={className} style={{ fontSize: '15px', marginRight: '5px', 'color': '#0083ff' }}></i>{name}</>;
	}

	//系统类型
	const systype = (val, sysName) => {
		switch (val) {
			case '2': return <><i className='fa fa-windows' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '3': return <><i className='fa fa-windows' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '4': return <><i className='fa fa-windows' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '5': return <><i className='fa fa-linux' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '6': return <><i className='iconfont icon-xitong' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '7': return <><AppleFilled style={{ color: '#FFFFFF', fontSize: '15px', marginRight: '5px' }} />{sysName}</>;
			case '8': return <><AppleFilled style={{ color: '#FFFFFF', fontSize: '15px', marginRight: '5px' }} />{sysName}</>;
			case '9': return <><AppleFilled style={{ color: '#FFFFFF', fontSize: '15px', marginRight: '5px' }} />{sysName}</>;
			case '10': return <><i className='iconfont icon-xitong' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '11': return <><i className='iconfont icon-xitong' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '12': return <><i className='iconfont icon-huawei' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '13': return <><i className='iconfont icon-H3C' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '14': return <><i className='iconfont icon-dashboard_vmware' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '15': return <><i className='fa fa-linux' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '16': return <><i className='iconfont icon-xitong' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '17': return <><i className='iconfont icon-H3C' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '18': return <><i className='iconfont icon-xitong' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '19': return <><i className='iconfont icon-xitong' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '20': return <><i className='iconfont icon-xitong' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '21': return <><i className='iconfont icon-hp' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '22': return <><i className='fa fa-windows' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
			case '23': return <><i className='iconfont icon-huawei' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
		}
		return <><i className='iconfont icon-xitong' style={{ fontSize: '15px', marginRight: '5px' }}></i>{sysName}</>;
	}

	/** table组件 start */
	const rowKey = (record => record.id);//列表唯一值
	const tableHeight = clientHeight;//列表高度
	const tableKey = 'assets';//table 定义的key
	const rowSelection = false;//是否开启多选框
	const addButton = false; //增加按钮  与 addClick 方法 组合使用
	const delButton = false; //删除按钮 与 delClick 方法 组合使用
	const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
	const columnvalue = 'assetscolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
	const apishowurl = '/cfg.php?controller=analyze&action=showAssetsBaseinfo';//接口路径
	const [queryVal, setQueryVal] = useState();//首个搜索框的值

	// 表格列
  const [cols, setCols] = useState(columnsList);
	const [columns, setColumns] = useState();//table 表头

  // 定义头部组件
  const components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  // 处理拖拽
  const handleResize = (index) => (e, { size }) => {
    const nextColumns = [...cols];
    // 拖拽时调整宽度
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width < 75 ? 75 : size.width,
    };

    setCols(nextColumns);
  };

  useEffect(() => {
    setColumns((cols || []).map((col, index) => ({
      ...col,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: handleResize(index),
      }),
    })))
  }, [cols])

	//默认隐藏列
	const concealColumns = {
		id: { show: false },
		createTime: { show: false },
		updateTime: { show: false },
	};//设置默认列

	const [deviceList, setDeviceList] = useState([]);//

	//区域数据
	const zoneType = 'zone';
	const [treeData, setTreeData] = useState([]);
	const [zoneID, setZoneID] = useState();//区域搜索、
	const [deviceID, setDeviceID] = useState();

	let searchVal = { queryVal: queryVal, zoneID: zoneID, deviceID: deviceID };
	useEffect(() => {
		getTree();
		showDevtype();
		showSystype();
	}, [])

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
			setTreeData(treeInfoData)
		}).catch(() => {
			console.log('mistake')
		})
	}
	//下拉列表选中
	const onChangeSelect = (newValue) => {
		setZoneID(newValue);
		showDeviceList(newValue);
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

	//资产类型筛选
	// url : cfg.php?controller=analyze&action=showDevtype
	const showDevtype = () => {
		post('/cfg.php?controller=analyze&action=showDevtype').then((res) => {
			let info = [];
			res.data.map((item) => {
				info.push({ text: item.text, value: item.id });
			})
			let columnsList = cols;
			columnsList.map((item) => {
				if (item.dataIndex == 'devtypeID') {
					item.filters = info;
					item.filterMultiple = false;
				}
			})
			setCols([...columnsList]);
		}).catch(() => {
			console.log('mistake')
		})
	}
	//操作系统筛选
	const showSystype = () => {
		post('/cfg.php?controller=analyze&action=showSystype').then((res) => {
			let info = [];
			res.data.map((item) => {
				info.push({ text: item.text, value: item.id });
			})
			let columnsList = cols;
			columnsList.map((item) => {
				if (item.dataIndex == 'systypeID') {
					item.filters = info;
					item.filterMultiple = false;
				}
			})
			setCols([...columnsList]);
		}).catch(() => {
			console.log('mistake')
		})
	}
	//头部搜索框数据
	const tableTopSearch = () => {
		return (
			<Space className='searchassetsbox'>
				<Search
					placeholder={language('project.central.assets.search')}
					style={{ width: 200 }}
					onSearch={(queryVal) => {
						setQueryVal(queryVal);
						setIncID(incID + 1);
					}}
				/>
				<ProFormText>
					<TreeSelect
						name='ganame'
						treeDataSimpleMode
						value={zoneID}
						dropdownStyle={{
							// maxHeight: 400,
							overflow: 'auto',
						}}
						onChange={onChangeSelect}
						loadData={onLoadData}
						treeData={treeData}
						placeholder={language('project.central.belongingzone')}
					/>
				</ProFormText>
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
		<div>
			<ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton}  addButton={addButton}  rowSelection={rowSelection} components={components}  />
		</div>
	);
};


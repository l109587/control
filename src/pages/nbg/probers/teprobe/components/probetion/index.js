import React, { useRef, useState, useEffect } from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { ProTable, ProCard } from '@ant-design/pro-components';
import ProForm, { ProFormSelect, ProFormDigit, ProFormTextArea, ProFormCheckbox } from '@ant-design/pro-form';
import { violationitem, formleftLayout } from "@/utils/helper";
import { Button, Row, Col, Form, Popconfirm, Spin, Space, Tag, message, Modal, Alert } from 'antd';
import '@/utils/index.less';
import './index.less';
import WebUploadr from '@/components/Module/webUploadr';
import { post, postAsync } from '@/services/https';
import store, { set } from 'store';
import { regIpList } from '@/utils/regExp';
import { language } from '@/utils/language';
import { fetchAuth, valiCompare } from '@/utils/common';
import { TableLayout } from '@/components'
const { ProtableModule } = TableLayout

const Configuration = (props) => {
	const writable = fetchAuth()
	const formRef = useRef();
	const [initialValue, setInitialValue] = useState();
	const [totalPage, setTotalPage] = useState(0);//总条数
	const [nowPage, setNowPage] = useState(1);//当前页码
	const [tabledata, setTabledata] = useState([]);
	const [loading, setLoading] = useState(false);//加载
	const [oldCfgName, setOldCfgName] = useState([]);
	const [selectdata, setSelectdata] = useState([]);
	const [portselist, setPortselist] = useState([]);
	const [submitType, setSubmitType] = useState('');
	const [tipId, setTipid] = useState(0);
	const startVal = 1;
	const limitVal = store.get('pageSize') ? store.get('pageSize') : 10;//默认每页条数
	const [columnsHide, setColumnsHide] = useState(store.get('prolistcolumnvalue') ? store.get('prolistcolumnvalue') : {
		id: { show: false },
	});//设置默认列
	let columnvalue = 'probetion'
	let concealColumnList = {
		id: { show: false },
	}
	const [densitySize, setDensitySize] = useState('middle')

  const [incID, setIncID] = useState(0) //递增的id 删除/添加的时候增加触发刷新
	let apishowurl = '/cfg.php?controller=probeManage&action=showAgentMakeList'
	let concealColumns = {
		id: { show: false },
	}

	const tableTopSearch = () => {
    return (
      <div className='hdprbFlexdiv'>
        <Alert
          className="hdpbAlert"
          type="info"
          showIcon
          message={language('project.temporary.terminal.probealert')}
        />
        {!writable ? <></> :
          <WebUploadr
            isUploading={isUploading} 
            isUpsuccess={isUpsuccess} 
            isAuto={true} 
            upbutext={language('project.upload')} 
            maxSize={maxSize} 
            upurl={upurl} 
            accept={accept} 
            isShowUploadList={isShowUploadList}
            maxCount={maxCount} 
            onSuccess={onSuccess} 
            onUploading={onUploading}
          />
        }
      </div>
    )
  }

	useEffect(() => {
		getselect();
	}, [])

	const columns = [
		{
			title: 'ID',
			dataIndex: 'id',
			width: '5%',
		},
		{
			title: language('project.mconfig.ectstu'),
			dataIndex: 'state',
			width: '8%',
			align: 'center',
			render: (text, record, index) => {
				let color = 'success';
				if(record.state == 'published') {
					color = 'success';
					text = language('project.temporary.terminal.published')
				} else if(record.state == 'notMake') {
					color = 'processing';
					text = language('project.temporary.terminal.notMake')
				}
				else {
					color = 'error';
					text = language('project.temporary.terminal.nopublish')
				}
				return (
					<Space>
						<Tag style={{ marginRight: 0 }} color={color} key={record.type}>
							{text}
						</Tag>
					</Space>
				)
			}
		},
		{
			title: language('project.temporary.terminal.pkgName'),
			dataIndex: 'pkgName',
			width: '15%',
			ellipsis: true,
			// readonly:true 不可编辑
		},
		{
			title: language('project.temporary.terminal.pkgMd5'),
			dataIndex: 'pkgMd5',
			width: '15%',
			ellipsis: true,
		},
		{
			title: language('project.temporary.terminal.uploadTM'),
			dataIndex: 'uploadTM',
			width: '17%',
			ellipsis: true,
		},
		{
			title: language('project.temporary.terminal.version'),
			dataIndex: 'version',
			width: '8%',
			ellipsis: true,
		},
		{
			title: language('project.temporary.terminal.installMd5'),
			dataIndex: 'installMd5',
			width: '16%',
			ellipsis: true,
		},
		{
			title: language('project.temporary.terminal.registerAddr'),
			dataIndex: 'registerAddr',
			width: '16%',
			ellipsis: true,
		},
		{
			title: language('project.operate'),
			valueType: 'option',
			width: '10%',
			align: 'center',
			hideInTable: !writable,
			render: (text, record, _, action) => {
				if(record.state == 'notMake') {
					return (
						<Popconfirm title={language( 'project.temporary.terminal.makecontitle')}
							onConfirm={() => {
								operAte('make', record);
							}}>
							<a>{language('project.temporary.terminal.maketext')}</a>
						</Popconfirm>
					)
				}
				else if(record.state == 'published') {
					return [
						<Popconfirm title={language('project.temporary.terminal.downLoadcontitle')}
							onConfirm={() => {
								getDown(record);
							}}>
							<a className='publishtext' >{language('project.temporary.terminal.lodowntext')}</a>
						</Popconfirm>,
						<Popconfirm title={language('project.temporary.terminal.canclecontitle')}
							onConfirm={() => {
								operAte('cancle', record);
							}}>
							<a className='publishtext' >{language('project.temporary.terminal.cancletext')}</a>
						</Popconfirm>
					]
				}
				else {
					return [
						<Popconfirm title={language('project.temporary.terminal.makecontitle')} onConfirm={() => {
							operAte('make', record);
						}}>
							<a>{language('project.temporary.terminal.maketext')}</a>
						</Popconfirm>,
						<Popconfirm title={language('project.temporary.terminal.publishcontitle')} onConfirm={() => {
							operAte('publish', record);
						}}>
							<a>{language('project.temporary.terminal.publishtext')}</a>
						</Popconfirm>
					]
				}
			}
		},
	];

	/* 表单数据 */
	const getFormdata = (outlineVal,portVal) => {
		post('/cfg.php?controller=probeManage&action=showAgenCfg').then((res) => {
			if(!res.success) {
				message.error(res.msg);
				return false;
			}
			let obj = res;
			if (res.IPV6AssetRpt == 'N') {
				delete res["IPV6AssetRpt"];
			}
			if (!res.outlineCfgName && outlineVal.length > 0) {
				obj.outlineCfgName = outlineVal[0].value;
		  } else if (res.outlineCfgName) {
				obj.outlineCfgName = res.outlineCfgName;
		  } else {
				obj.outlineCfgName = '';
		  }
			if (!res.port && portVal.length > 0) {
				obj.port = portVal[0].value;
			} else if (res.port && portVal.length > 0) {
				obj.port = res.port;
			} else {
				obj.port = res.port;
			}
			formRef.current.setFieldsValue(obj)
		}).catch(() => {
			console.log('mistake')
		})
	}

	/* 下拉数据 */
	const getselect = () => {
		post('/cfg.php?controller=monitorManage&action=getOutlineAllCfg').then((res) => {
			setSelectdata(res.data)
			getportSelect(res.data)
		}).catch(() => {
			console.log('mistake')
		})
	}

	/* 监测端口下拉数据 */
	const getportSelect = (outlineVal) => {
		let data = {};
		data.type = 'tcp';
		post('/cfg.php?controller=monitorManage&action=getPortsListName', data).then((res) => {
			setPortselist(res.data)
			getFormdata(outlineVal,res.data)
		}).catch(() => {
			console.log('mistake')
		})
	}

	/* 设置 */
	const setForm = () => {
		let obj = formRef.current.getFieldsValue(['outlineCfgName', 'monitorItems', 'IPV6AssetRpt', 'period', 'port', 'exception']);
		setOldCfgName(obj.outlineCfgName)/* 修改前的外联配置 */
		let outlineCfgName = '';/* 修改后的外联配置*/
		selectdata.map((item) => {
				if (item.value == obj.outlineCfgName) {
						outlineCfgName = item.value
				}
		})
		let data = {};
		data.oldCfgName = oldCfgName.length === 0 ? outlineCfgName : oldCfgName;
    data.outlineCfgName = outlineCfgName.length === 0 ? oldCfgName: outlineCfgName;
		data.monitorItems = obj.monitorItems;
		data.IPV6AssetRpt = obj.IPV6AssetRpt ? 'Y' : 'N';
		data.period = obj.period;
		data.port = obj.port;
		data.exception = obj.exception;
		post('/cfg.php?controller=probeManage&action=setAgentCfg', data).then((res) => {
			if(!res.success) {
				message.error(res.msg);
				return false;
			}
			message.success(res.msg);
		}).catch(() => {
			console.log('mistake')
		})
	}


	/* 表格操作 */
	const operAte = (action, record) => {
		let data = {}
		data.op = action;
		data.id = record.id;
		data.mid = record.mid;
		data.pkgName = record.pkgName;
		data.pkgMd5 = record.pkgMd5;
		data.version = record.version;
		data.installMd5 = record.installMd5;
		post('/cfg.php?controller=probeManage&action=agentMakeOperate', data).then((res) => {
			if(!res.success) {
				message.error(res.msg);
				return false
			} else if(res.success) {
				setIncID(incID => incID + 1)
				message.success(res.msg)
			}
		}).catch(() => {
			console.log('mistake')
		})
	}

	/* 下载 */
	const getDown = (record) => {
		let data = {}
		data.op = 'downLoad';
		data.id = record.id;
		data.mid = record.mid;
		data.pkgName = record.pkgName;
		data.pkgMd5 = record.pkgMd5;
		data.version = record.version;
		data.installMd5 = record.installMd5;
		post('/cfg.php?controller=probeManage&action=agentMakeOperate',data,{responseType:'blob'}).then((res) => {
		  let link = document.createElement('a');
      let href = window.URL.createObjectURL(new Blob([res.data]));
      link.href = href;
      link.download = 'NBGSetup.exe';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(href);
		}).catch(() => {
			console.log('mistake')
		})
	}

	const maxSize = 200; // 最大文件上传体积
	const accept = '.tgz,'; // 限制文件上传类型
	const upurl = '/cfg.php?controller=probeManage&action=agentPkgUpload'; // 上传接口
	const isShowUploadList = false; // 是否回显文件名与进度条
	const maxCount = 1; // 最大上传文件数量
	const isUploading = true;
	const isUpsuccess = true;
	const onUploading = (info) => {
		setLoading(true)
		setTipid(1)
	}

	const onSuccess = (res) => {
		setLoading(false)
		if (res.success) {
			Modal.success({
				className: 'prbupModal',
				title: language('project.prompt'),
				content: res.msg,
				okText: language('project.determine'),
				onOk: () => {
					setIncID(incID => incID + 1)
				}
			})
		} else {
			Modal.warning({
				className: 'prbupModal',
				title: language('project.prompt'),
				content: res.msg,
				okText: language('project.determine'),
			})
		}
	}

	const hourlaver = (
		<div className='timeAfter'>{language('project.temporary.terminal.afterunit')}</div>
	);

	return (
		<div className='teprobeContent'>
			<Spin size="large" spinning={loading} tip={tipId === 1 ? language('project.isuploading') : ''}>
				<ProCard ghost className='probetionCard'>
					<ProForm {...formleftLayout}
						initialValue={initialValue}
						className='probrform'
						formRef={formRef}
						submitter={{
							render: (props, doms) => {
								return [<Row style={{ marginTop: -5 }}>
									<Col offset={6}>
										<Button type='primary' key='subment' disabled={!writable}
											style={{ lineHeight: 1.5, borderRadius: 5, width: "90px" }}
											onClick={() => {
												setSubmitType('finsh')
												formRef.current.submit();
											}}
											icon={<SaveOutlined />}>
											{language('project.set')}
										</Button>
									</Col>
								</Row>
								]
							}
						}}
						autoFocusFirstInput
						submitTimeout={2000} onFinish={async (values) => {
							if(submitType == 'finsh') {
								setForm(values);
							}
						}}>

						<ProFormSelect width="200px" {...violationitem} name="outlineCfgName" label={language('project.monitor.illegal.outlinecfgname')}
							options={selectdata} rules={[
								{
									required: true,
									message: language('project.messageselect')
								}
							]} />
						<div className='probetionmon'>
							<ProFormCheckbox.Group {...violationitem} id="aaa" name="monitorItems"
								onChange={(key, val) => {
								}}
								label={language('project.temporary.srcprobes.monitorItems')}
								options={[{ label: language('probers.teprobe.ckInOut'), value: 'ckInOut' }, { label: language('probers.teprobe.vioSrv'), value: 'vioSrv' }, { label: language('probers.teprobe.vioDev'), value: 'vioDev' }]}
							/>
						</div>
						<div className='IpV6RptDiv'>
						  <ProFormCheckbox label={language('probers.teprobe.IPv6mon')} name='IPV6AssetRpt'>{language('probers.teprobe.IPv6monlabel')}</ProFormCheckbox>
						</div>
						<div className='periodDIv'>
							<ProFormDigit name="period" width="160px" label={language('project.temporary.terminal.period')} fieldProps={{ precision: 0, controls: false, }} addonAfter={hourlaver} rules={[
								{
									required: true,
									message: language('project.mandatory')
								},
								{
									validator: (rule, value, callback) => {
										valiCompare(value, callback, 1, 24)
									}
								}
							]} />
						</div>

						<ProFormSelect width="200px" {...violationitem} name="port" label={language('project.temporary.terminal.port')} options={portselist} rules={[
							{
								required: true,
								message: language('project.messageselect')
							}
						]} />
						<Col className='porttextCol' offset={6}>
							<span className='textual'>{language('probers.teprobe.udpmsgtext')}</span>
						</Col>
						<div className='exceptext'>
								<ProFormTextArea label={language('project.temporary.terminal.exception')} name="exception" width="350px" rules={[
									{
										pattern: regIpList.multipv4Mask.regex,
										message: regIpList.multipv4Mask.alertText,
									},
									{
										max: 1024,
										message: language('probers.teprobe.exceptionlength')
									}
								]} placeholder=''/>
						</div>
						<Col offset={6} className='exceptextCol'>
							<span className='textual'>{language('probers.teprobe.excepmessage')}</span>
						</Col>
					</ProForm>

					<div className="divider">
						<span className="leftLine"></span>
						<span className="txt">{language('probers.hdprobe.tableTitle')}</span>
						<span className="rightLine"></span>
					</div>
					<div className="hdpbconTable">
						<ProtableModule
							columns={columns}
							apishowurl={apishowurl}
							concealColumns={concealColumns}
							searchText={tableTopSearch()}
							clientHeight={store.get('layout')==='top'? 229 : 205}
							tableKey={'probetion'}
							rowkey={(record => record.id)}
							incID={incID}
							columnvalue={'hdprobeconfig'}
						/>
					</div>
				</ProCard >
			</Spin>
			
		</div >
	)
}

export default Configuration

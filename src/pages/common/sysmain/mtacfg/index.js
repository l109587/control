import React, { useRef, useState, useEffect } from 'react';
import { CloudSyncOutlined, DownloadOutlined, QuestionCircleFilled, SaveOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { ProTable, ProCard } from '@ant-design/pro-components';
import ProForm, { ProFormText, ProFormSwitch, ProFormGroup, ProFormSelect } from '@ant-design/pro-form';
import { formleftLayout, afterLayout, formhorizCard, } from "@/utils/helper";
import { Search, Button, Row, Col, message, Modal, Checkbox, Space, Spin, Upload } from 'antd';
import { language } from '@/utils/language';
import '@/utils/index.less';
import './index.less';
import Uploadd from '@/utils/Upload';
import WebUploadr from '@/components/Module/webUploadr';
import { post, postAsync, postDownd } from '@/services/https';
import { regIpList, regList } from '../../../../utils/regExp';
import { fetchAuth } from '@/utils/common';
import Download from '@/components/Common/download'
import { KeepAlive, history} from 'umi'

const Mtacfg =  () => {
	const writable = fetchAuth()
	const column = [
		{
			title: language('sysmain.filename'),
			dataIndex: 'name',
			align: 'left',
			width: '250px',
		},
		{
			title: language('sysmain.filesize'),
			dataIndex: 'size',
			align: 'left',
			width: '120px',
		},
		{
			title: language('sysmain.filetime'),
			dataIndex: 'date',
			align: 'left',
			width: '170px',
		},
		{
			title: language('project.mconfig.operate'),
			valueType: 'option',
			width: '75px',
			align: 'center',
			render: (text, record, _, action) => [
				<Button type ='link' size='small' disabled={!writable} onClick={(e) => {
					showrecoverConfirm(record)
				}}>{language("project.recover")}
				</Button>

			],
		}
	]
	const formRef = useRef();
	const fasctoryformRef = useRef();
	const [iswitch, setIswitch] = useState(false);
	const [ignoreNework, setIgnoreNework] = useState(true);
	const [disable, setDisable] = useState(false);
	const { confirm } = Modal;
	const [dataSource, setDataSource] = useState([]);
	const [initialvalue, setInitialvalue] = useState({});
	const [loading, setLoading] = useState(false);
	const [exLoading, setExLoading] = useState(false);

	const remote = (
		<div style={{ width: '200px' }}>{language('project.temporary.tenance.FTP')}</div>
	)
	const setrecover = (
		<div style={{ width: '200px' }}>{language('project.temporary.tenance.recovertext')}</div>
	)

	useEffect(() => {
		gettableList();
		getConfdata();
	}, [])

	/* 恢复配置表格数据 */
	const gettableList = () => {
		post('/cfg.php?controller=mtaConf&action=showLocalBackup').then((res) => {
			if(!res.success) {
				message.error(res.msg);
				return false;
			}
			setDataSource(res.data)
		}).catch(() => {
			console.log('mistake')
		})
	}

	// 配置备份数据回显
	const getConfdata = () => {
		post('/cfg.php?controller=mtaConf&action=showBackupConf').then((res) => {
			if(!res.success) {
				message.error(res.msg);
				return false;
			}
			res.remote = res.remote == 'N' ? false : true;
			res.remote == true ? setDisable(false) : setDisable(true);
			formRef.current.setFieldsValue(res)
		}).catch(() => {
			console.log('mistake')
		})
	}

	// 恢复备份
	const recoverfile = (record) => {
		let name = record.name
		post('/cfg.php?controller=mtaConf&action=loadLocalBackup', { name: name }).then((res) => {
			recodete()
			message.success(res.msg)
		}).catch(() => {
			console.log('mistake')
		})
	}

	let recodeteTimer = '';
	// 导入或恢复是否完成
	const recodete = () => {
		clearInterval(recodeteTimer)
		post('/cfg.php?controller=mtaConf&action=checkImportFinished').then((res) => {
			setLoading(true)
			if(res.code === 200) {
				clearInterval(recodeteTimer)
				setLoading(false)
				Modal.success({
					className: 'mtaupModal',
					title: language('project.prompt'),
					content: res.msg,
					okText: language('project.determine'),
				})
			} else if(res.code === 202) {
				recodeteTimer = setInterval(() => {
					recodete()
				}, 1000)
			} else {
				setLoading(false)
				Modal.error({
					className: 'mtaupModal',
					title: language('project.prompt'),
					content: res.msg,
					okText: language('project.determine'),
				})
				return false
			}
		}).catch(() => {
			console.log('mistake')
		})
	}

	/* 配置备份 保存设置 */
	const saveConfig = () => {
		let obj = formRef.current.getFieldsValue(['bktime', 'remote', 'ftpaddr', 'ftpport', 'ftpuser', 'ftppawd']);
		let data = {};
		data.bktime = obj.bktime;
		data.remote = obj.remote ? 'Y' : 'N';
		data.ftpaddr = obj.ftpaddr;
		data.ftpport = obj.ftpport;
		data.ftpuser = obj.ftpuser;
		data.ftppawd = obj.ftppawd;
		post('/cfg.php?controller=mtaConf&action=setBackupConf', data).then((res) => {
			if(!res.success) {
				message.error(res.msg);
				return false;
			}
			message.success(res.msg);
		}).catch(() => {
			console.log('mistake')
		})
	}

	/* 恢复出厂设置 */
	let inspectTimer = ''
	const factory = () => {
		let obj = fasctoryformRef.current.getFieldsValue(['saveNetwork']);
		let data = {};
		data.saveNetwork = obj.saveNetwork ? 'Y' : 'N';
		data.ftppawd = obj.ftppawd;
		post('/cfg.php?controller=mtaConf&action=resetFactory', data).then((res) => {
			if(!res.success) {
				message.error(res.msg);
				return false;
			}
			inspectTimer = setInterval(() => {
				inspectfact()
			}, 1000)
			message.success(language('sysmain.mtaConf.factorymsg'));
		}).catch(() => {
			console.log('mistake')
		})
	}

	// 监测恢复出厂是否完成
	const inspectfact = () => {
		setLoading(true)
		post('/cfg.php?controller=mtaConf&action=checkResetFinished').then((res) => {
			if(res.success) {
				clearInterval(inspectTimer)
				setLoading(false)
			}
		}).catch(() => {
			console.log('mistake')
		})
	}

	/* 表格备份恢复弹框 */
	const showrecoverConfirm = (record) => {
		let file = record.name;
		confirm({
			className: 'recoModal',
			icon: <QuestionCircleFilled />,
			title: language('project.temporary.tenance.recontitle'),
			content: language('project.temporary.tenance.recovercontent', { file: file }),
			okText: language('project.mconfig.devices.ok'),
			cancelText: language('project.mconfig.devices.cancel'),
			onOk() {
				recoverfile(record)
			}
		});
	};
	/* 恢复出厂设置保留弹框 */
	const retainfaConfirm = () => {
		confirm({
			className: 'retainModal',
			icon: <QuestionCircleFilled />,
			title: language('project.temporary.tenance.retaincontitle'),
			content: language('project.temporary.tenance.retaincontent'),
			okText: language('project.mconfig.devices.ok'),
			cancelText: language('project.mconfig.devices.cancel'),
			onOk() {
				factory();
			}
		});
	};

	/* 恢复出厂设置不保留弹框 */
	const faConfirm = () => {
		confirm({
			className: 'nofaModal',
			icon: <QuestionCircleFilled />,
			title: language('project.temporary.tenance.retaincontitle'),
			content: language('project.temporary.tenance.facontext'),
			okText: language('project.mconfig.devices.ok'),
			cancelText: language('project.mconfig.devices.cancel'),
			onOk() {
				factory();
			}
		});
	};

	const timeput = [];
	for(let i = 0; i <= 23; i++) {
		let obj = {}
		obj.value = i;
		obj.label = i > 9 ? i + ':00' : '0' + i + ':00';
		timeput.push(obj)
	}

	const loadIcon = (
		<LoadingOutlined spin />
	)

	const maxSize = 10;
	const accept = '.tgz, .tar'; // 限制文件上传类型
	const upurl = '/cfg.php?controller=mtaConf&action=importBackupConf'; // 上传接口
	const isShowUploadList = false; // 是否回显文件名与进度条
	const maxCount = 1; // 最大上传文件数量
	const isUpsuccess = true;
	//接口参数
	const parameter = {
		'ignoreNetwork': ignoreNework ? 'Y' : 'N',
	}

	const onSuccess = (res) => {
		if (!res.success) {
			message.error(res.msg)
			return false
		} 
		message.success(res.msg)
		recodete()
	}

	const onError = () => {
		message.error(language('project.errorMsg'))
	}

	return (<>
		<Spin tip={loading ? language('project.loadingtip') : language('project.sysdebug.wireshark.loading')} spinning={loading ? loading : exLoading} indicator={loadIcon} size='large' style={{ height: '100%', position: 'absolute', top: '20%', fontSize: '24px' }}>
			<ProCard direction='column' ghost gutter={[13, 13]} className='dentence'>
				<ProCard title={language('project.temporary.tenance.tentoptitle')}>
					<ProForm className='tentopform' {...formhorizCard}
						formRef={formRef} initialvalue={initialvalue}
						layout="horizontal"
						submitter={{
							render: (props, doms) => {
								return [<Row>
									<Col span={12} offset={6} style={{display:'flex'}}>
										<Button type='primary' key='subment'
											style={{ borderRadius: 5, marginRight: 50}}
											onClick={() => {
												// saveConfig();
												props.submit()
											}}
											disabled={!writable}
											icon={<SaveOutlined />}>
											{language('project.savesettings')}
										</Button>
										<Download 
											text={language('project.exportconfig')} 
											api='/cfg.php?controller=mtaConf&action=exportBackupConf'
											setLoading={setExLoading}
											icon={<DownloadOutlined/>}
											buttonType='primary'
										/>
									</Col>
								</Row>
								]
							}
						}} onFinish={async () => {
							saveConfig()
						}}>
						<ProFormText hidden />
						<ProFormSelect label={language('project.temporary.tenance.bktime')} name='bktime' width='260px' options={timeput}  labelCol={{ xs: { span: 8 }, sm: { span: 6 } }}
              wrapperCol={{ flex:'640px' }} />
						<ProFormSwitch checkedChildren={language('project.open')} unCheckedChildren={language('project.close')}
							onChange={(checked) => {
								if(checked == true) {
									setDisable(false)
								} else {
									formRef.current.resetFields(['ftpaddr', 'ftpport', 'ftpuser', 'ftppawd']);
									setDisable(true)
								}
							}}
							name='remote' label={language('project.temporary.tenance.remote')} addonAfter={remote} {...afterLayout} />
						<Col offset={6}>
							<div className='rcvetiLayout'>
							  <ProFormText 
								  disabled={disable} 
								  placeholder={language('project.temporary.tenance.placeftpaddr')}
									width='260px' 
									name='ftpaddr' 
									label={language('project.temporary.tenance.ftpaddr')}
									rules={[
										{
											required: true,
											message: language('project.mandatory')
										},
										{
											pattern: regIpList.ipv4oripv6.regex,
											message: regIpList.ipv4oripv6.alertText,
										},
										{
											max: 254
										}
									]}
									
								/>
								<ProFormText 
								  disabled={disable} 
									placeholder={language('project.temporary.tenance.placeftpport')} 
									width='260px' 
									name='ftpport' 
									label={language('project.temporary.tenance.ftpport')} 
									rules={[
										{
											required: true,
											message: language('project.mandatory')
										},
										{
											pattern: regIpList.singleport.regex,
											message: regIpList.singleport.alertText
										},
										{
											max: 254
										}
									]}
								/>
							</div>
							<div className='rcvetiLayout'>
							  <ProFormText 
								  disabled={disable} 
									placeholder={language('project.temporary.tenance.placeftpuser')} 
									name='ftpuser' 
									width='260px' 
									label={language('project.login.placeuser')}
									rules={[
										{
											required: true,
											message: language('project.mandatory')
										},
										{
										  pattern: regList.strmax.regex,
										  message: regList.strmax.alertText,
									  }
								  ]}
								/>
								<ProFormText.Password 
								  disabled={disable} 
									placeholder={language('project.temporary.tenance.placeftppawd')} 
									name='ftppawd' 
									width='260px' 
									label={language('project.temporary.tenance.password')}
									rules={[
										{
											required: true,
											message: language('project.mandatory')
										},
										{
										  pattern: regList.password.regex,
										  message: regList.password.alertText,
									  }
								  ]}
								/>
							</div>
						</Col>
					</ProForm>
				</ProCard>
				<ProCard title={language('project.temporary.tenance.recoformtitle')} >
					<ProForm submitter={false} className='restoreform' {...formhorizCard}>
						<ProFormText label={language('project.temporary.tenance.importrecover')} >
							<Space>
								<div className='mtacfgupDiv'>
									<WebUploadr isUpsuccess={isUpsuccess} isAuto={true} upbutext={language('project.temporary.tenance.uploadtitle')} maxSize={maxSize}
										upurl={upurl} accept={accept} isShowUploadList={isShowUploadList} maxCount={maxCount} parameter={parameter} onSuccess={onSuccess} onError={onError} isError={true}
									/>
								</div>
								<Checkbox defaultChecked style={{ width: '300px' }} name="recoverycheck"
									onChange={(e) => {
										setIgnoreNework(e.target.checked);
									}}
								>
									{language('project.temporary.tenance.imporecovetext')}
								</Checkbox>
							</Space>
						</ProFormText>
						<ProFormText label={language('project.temporary.tenance.recovertable')}>
							<ProTable size='small'
								className='recovertable'
								rowKey="index"
								scroll={{ y: 130 }}
								bordered={true}
								columns={column}
								dataSource={dataSource}
								search={false}
								options={false}
								pagination={false}
							/>
						</ProFormText>
					</ProForm>
				</ProCard>
				<ProCard title={language('project.temporary.tenance.factoryset')}>
					<ProForm {...formleftLayout} formRef={fasctoryformRef} className='fasctoryform' submitter={{
						render: (props, doms) => {
							return [<Row>
								<Col span={4} offset={6}>
									<Button type='primary' key='subment'
										onClick={() => {
											let retainWork = fasctoryformRef.current.getFieldsValue(['saveNetwork']);
											if(retainWork.saveNetwork == true) {
												retainfaConfirm()
											} else {
												faConfirm();
											}
										}}
										disabled={!writable}
										style={{  width: '200px' }}
										icon={<CloudSyncOutlined />}>
										{language('project.temporary.tenance.empty')}
									</Button>
								</Col>
							</Row>
							]
						}
					}}>
						<ProForm label='xxx' hidden />
						<ProFormSwitch {...afterLayout} initialValue={true} label={language('project.temporary.tenance.saveNetwork')} name='saveNetwork'
							onChange={(checked) => {
								if(checked == true) {
									setIswitch(false)
								} else {
									setIswitch(true)
								}
							}}
							checkedChildren={language('project.yes')} unCheckedChildren={language('project.no')} addonAfter={setrecover} />
					</ProForm>
				</ProCard>
			</ProCard>
		</Spin>
	</>);
};

export default () => {
	return (
	  <KeepAlive
		id={history.location.pathname}  // 根据参数去缓存，如果参数不同就缓存多份，如果参数相同就使用同一个缓存。这样解决了传参改变时，页面不刷新的问题
		when={true}
	  >
		{/* 页面组件 */}
		<Mtacfg/> 
	  </KeepAlive>
	)
  };
  

import React, { useRef, useState, useEffect } from 'react';
import { Button, Col, Input, Alert, message, Form, Popconfirm,Tooltip } from 'antd';
import { DownloadOutlined, SaveOutlined, EditOutlined,EditFilled, DeleteFilled, SaveFilled, FlagFilled,DeleteOutlined } from '@ant-design/icons';
import { ProCard, EditableProTable } from '@ant-design/pro-components';
import ProForm, { ProFormSwitch, ProFormText, ProFormRadio, ProFormSelect, ProFormDigit } from '@ant-design/pro-form';
import { modalFormLayoutCard, formhorizCard, formleftLayout, modalFormLayoutTypeOne, modalFormLayoutTypeTwo, modalFormLayoutTypeThree } from "@/utils/helper";
import { post, get } from '@/services/https';
import EditTable from './editTable.js'
import { fetchAuth } from '@/utils/common';
import '@/utils/index.less';
import './../../index.less';
import './index.less';
import { regIpList } from '@/utils/regExp'
import { language } from '@/utils/language';
const { Search } = Input;


export default (props) => {
	const writable = fetchAuth()
	const renderRemove = (text, record) => (
		<Popconfirm onConfirm={() => {
			setDataSource(dataSource.filter((item) => item.id !== record.id))
		}} key="popconfirm"
			title={language('project.delconfirm')}
			okButtonProps={{
				loading: confirmLoading,
			}} okText={language('project.yes')} cancelText={language('project.no')}>
			<Tooltip placement="top" title={text}>
            <a key="delete" style={{ color: 'red' }}>
              <DeleteOutlined />
            </a>
          </Tooltip>
		</Popconfirm>

	);

  const [ editForm ] = Form.useForm();
	const formRef = useRef();
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [editableKeys, setEditableRowKeys] = useState([]);//每行编辑的id
	const [initialValue, setInitialValue] = useState();
	const [scanRateTypeRadio, setScanRateTypeRadio] = useState(0);
	const [switchChecked, setSwitchChecked] = useState(false);
	const [portselist, setPortselist] = useState([]);
	const [submitType, setSubmitType] = useState('');
	const [currentsnr, setCurrentsnr] = useState([]);
	const [snRagearr, setSnRagearr] = useState('');
	const [dataSource, setDataSource] = useState([]); //编辑表格数据
	const [isSave, setIsSave] = useState(true) // 未保存当前数据不可下发
	const [isEqual, setIsEqual] = useState('')

	const fromcolumns = [
		{
			title: language('project.sysconf.assetmapping.scanRange'),
			dataIndex: 'scanRange',
			align: 'center',
			ellipsis:true,
			formItemProps:(form,{rowIndex, rowKey})=> {
				return{
					rules: [
						{ required: true, message: language('project.sysconf.syscert.required') },
						{
							pattern: regIpList.singleipv4Mask.regex,
							message: regIpList.singleipv4Mask.alertText,
						},
						{ validator: (rule, value) => {
							let list = []
							dataSource.forEach((item) => {
								list.push(item?.scanRange)
							})
							const dataindex = list.findIndex((item)=>item===value)
							setIsEqual(rowKey!==dataSource[dataindex]?.id&&dataindex>=0)
							if (rowKey!=dataSource[dataindex]?.id&&dataindex>=0) {
							  return Promise.reject(new Error(language('monitor.riskperce.ipissame')))
							} else {
							  return Promise.resolve();
							}
					  }},
					],
				}
				
			},
		},
		{
			title: language('project.mconfig.operate'),
			valueType: 'option',
			width: '30%',
			align: 'center',
			render: (text, record, _, action) => [
				<>
					 <Tooltip placement="top" title={language("project.edit")}>
						<a
							key="editable"
							onClick={() => {
							action?.startEditable?.(record.id)
							}}
						>
							<EditOutlined />
						</a>
					 </Tooltip>
					 
					{renderRemove(language("project.del"), record)}
				</>
			]
		},
	];
	useEffect(() => {
		getportSelect()
	}, [])

		/* 端口配置下拉数据 */
		const getportSelect = () => {
			let data = {};
			data.type = 'max';
			post('/cfg.php?controller=monitorManage&action=getPortsListName', data).then((res) => {
				res.data.map((item) => {
					setPortselist(res.data)
				})
				getFind(res.data);
			}).catch(() => {
				console.log('mistake')
			})
		}

	  const getFind = (portValue) => {
		  post('/cfg.php?controller=assetMapping&action=showIdentifyConf').then((res) => {
			  if(!res.success) {
				  message.error(res.msg);
				  return false;
			  }
			  let scanRangeInfo = [];
			  let rowKey = [];
			  if(res.scanRange.length > 0) {
				  setSnRagearr(res.scanRange)
				  res.scanRange.map((item, index) => {
					  scanRangeInfo.push({ id: (index + 1), scanRange: item });
					  rowKey.push(index + 1);
				  })
				//   res.scanRangeInfo = scanRangeInfo;
				setDataSource(scanRangeInfo)
			  }
			  res.switch = res.switch == 'Y' ? true : false;
				let obj = res;
				if (!res.ports && portValue.length > 0) {
					obj.ports = portValue[0].value;
				} else if (res.ports) {
					obj.ports = res.ports;
				} else {
					obj.ports = '';
				}
			  formRef.current.setFieldsValue(obj)
		  }).catch(() => {
			  console.log('mistake')
		  })
	  }

	const save = () => {
		let obj = formRef.current.getFieldsValue(['switch', 'tagPeriod', 'scanRate', 'scanRangeInfo', 'ports'])
		let data = {};
		data.switch = obj.switch ? 'Y' : 'N';
		data.tagPeriod = obj.tagPeriod;
		data.scanRate = obj.scanRate;
		data.ports = obj.ports;
		if(dataSource && dataSource.length > 0) {
			let scanRange = [];
			dataSource.map((item) => {
				scanRange.push(item.scanRange)
			})
			data.scanRange = scanRange.join(';');
		} else {
			data.scanRange = '';
		}
		post('/cfg.php?controller=assetMapping&action=setIdentifyConf', data).then((res) => {
			if(!res.success) {
				message.error(res.msg);
				return false;
			}
			message.success(res.msg);
		}).catch(() => {
			console.log('mistake')
		})
	}

    const isRepeat = (ary) => {
        let hash = {};
        for (var i in ary) {
            if (hash[ary[i]]) {
                return true
            }
            hash[ary[i]] = true;
        }
        return false;
    }
	return (
		<div className='backgroundbox'  >
			<ProForm {...formleftLayout}
				initialValue = {{
					port: portselist[0]?.label
				}}
				className='fromContent'
				formRef={formRef}
				autoFocusFirstInput
				submitTimeout={2000}
				submitter={{
					render: (props, doms) => {
						return [
							<Col span={14} offset={6}>
								<Button type='primary' key='subment'
								  disabled={!writable}
									style={{ paddingLeft: 0, paddingRight: 0, borderRadius: 5, width: "90px", lineHeight: 1.5 }}
									onClick={() => {
										if (editForm.getFieldsError().length > 0) {
											message.error(language('project.enterAndSaveMsg'))
											return false
										}
										if (isEqual) {
											message.error(language('monitor.mapping.repeatmsg'))
										} else if (!isSave) {
											message.error(language('project.pleasesavedata'))
										} else {
											setSubmitType('finish')
											formRef.current.submit();
										}
									}}
								>
									<SaveOutlined />{language('project.set')}
								</Button>
							</Col>
						]
					}
				}} onFinish={(values) => {
					if(submitType == 'finish') {
						save(values);
					}
				}}>

				<ProFormSwitch name="switch" label={language('project.sysconf.assetmapping.finddistinguish')}
					checkedChildren={language('project.enable')}
					unCheckedChildren={language('project.disable')}
				/>
				<ProFormSelect width="226px" name="ports" label={language('project.temporary.terminal.port' )}
					options={portselist} rules={[
						{
							required: true,
							message: language('project.messageselect')
						}
					]} />
				<div className='scanradiobutton'>
					<ProFormRadio.Group
						style={{ marginTop: 16 }}
						name="scanRate"
						label={language( 'project.sysconf.assetmapping.identificationfrequency')}
						// value={scanRateTypeRadio}
						initialValue={0}
						radioType="button"
						options={[
							{
								label: language('project.sysconf.assetmapping.extremelyslow'),
								value: 0,
							},
							{
								label: language('project.sysconf.assetmapping.slow'),
								value: 1,
							},
							{
								label: language('project.sysconf.assetmapping.mediumspeed'),
								value: 2,
							},
							{
								label: language('project.sysconf.assetmapping.fast'),
								value: 3,
							},
						]}
					/>
				</div>
				<Col style={{ marginTop:'-12px' }} offset={6}>
				  <span className='spanMessage' >{language("monitor.mapping.scanRateMsg")}</span>
				</Col>
				<ProForm.Item label={language('project.sysconf.assetmapping.identificationrange')} name="scanRangeInfo" trigger="onValuesChange">
				<EditTable setIsSave={setIsSave} columns={fromcolumns} tableHeight={170} tableWidth={330} addButPosition='top'dataSource={dataSource} deleteButShow={false} setDataSource={setDataSource} editForm={editForm}/>
				</ProForm.Item>
			</ProForm>
		</div>
	);
}
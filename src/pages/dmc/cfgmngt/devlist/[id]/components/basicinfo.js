import React, { useRef, useState, useEffect } from 'react';
import { Divider, Input, Tabs } from 'antd';
import { CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import { ProCard, ProDescriptions, EditableProTable } from '@ant-design/pro-components';
import { post } from '@/services/https';
import { language } from '@/utils/language';
import '@/utils/index.less';
import './basicinfo.less';

let H = document.body.clientHeight - 105
var clientHeight = H
export default (props) => {

  const { detailInfo } = props;

  //接口信息
  const dapiColumns = [
    {
      title: language('cfgmngt.devlist.apiip'),
      dataIndex: 'ip',
      width: 110,
      align: 'left',
    }, {
      title: language('cfgmngt.devlist.subnetmask'),
      dataIndex: 'netmask',
      width: 90,
      align: 'left',
    }, {
      title: language('cfgmngt.devlist.defaultgateway'),
      dataIndex: 'gateway',
      width: 110,
      align: 'left',
    }, {
      title: language('cfgmngt.devlist.macaddress'),
      dataIndex: 'mac',
      width: 120,
      align: 'left',
    }, {
      title: language('cfgmngt.devlist.managementport'),
      dataIndex: 'manage',
      width: 80,
      align: 'center',
      render: (text, record) => {
				if (record.manage) {
					return (<CheckCircleFilled style={{ color: '#12C189', size: 16 }} />)
				} else {
					return (<CloseCircleFilled style={{ color: '#F74852', size: 16 }} />)
				}
			}
    },

  ];

  //CPU信息
  const dcpuColumns = [
    {
      title: language('cfgmngt.devlist.cpuid'),
      dataIndex: 'physical_id',
      width: 90,
      align: 'left',
    }, {
      title: language('cfgmngt.devlist.numbercores'),
      dataIndex: 'core',
      width: 80,
      align: 'left',
    }, {
      title: language('cfgmngt.devlist.basicfrequency'),
      dataIndex: 'clock',
      width: 60,
      align: 'left',
    }
  ];

  //磁盘信息
  const ddiskColumns = [
    {
      title: language('cfgmngt.devlist.harddisksize'),
      dataIndex: 'size',
      width: 90,
      align: 'left',
    }, {
      title: language('cfgmngt.devlist.harddiskserialnum'),
      dataIndex: 'serial',
      width: 110,
      align: 'left',
    }
  ];

  //联系人员
  const dcontactsColumns = [
    {
      title: language('cfgmngt.devlist.contacts'),
      dataIndex: 'name',
      width: 100,
      align: 'left',
    }, {
      title: language('cfgmngt.devlist.position'),
      dataIndex: 'position',
      width: 100,
      align: 'left',
    }, {
      title: language('cfgmngt.devlist.email'),
      dataIndex: 'email',
      width: 160,
      align: 'left',
    }, {
      title: language('cfgmngt.devlist.phone'),
      dataIndex: 'phone',
      width: 150,
      align: 'left',
    }
  ];

  return (
    <>
      <div className='dmcbasicinfo'>
        <div>
        <ProCard ghost direction='column' >
          <ProCard ghost title={language('cfgmngt.devlist.basicinfo')}>
            <ProDescriptions column={2}>
              <ProDescriptions.Item label={language('cfgmngt.devlist.equipmentname')}>{detailInfo.name ? detailInfo.name : ''} </ProDescriptions.Item>
              <ProDescriptions.Item label={language('cfgmngt.devlist.devectstu')}>{detailInfo.state ? detailInfo.state : ' '}</ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item label={language('cfgmngt.devlist.devnumber')}>{detailInfo.device_id ? detailInfo.device_id : ''}</ProDescriptions.Item>
              <ProDescriptions.Item label={language('cfgmngt.devlist.certificatenumber')}>{detailInfo.certsn ? detailInfo.certsn : ' '}</ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item label={language('cfgmngt.devlist.devtype')}>{detailInfo.type ? detailInfo.type : ''}</ProDescriptions.Item>
              <ProDescriptions.Item label={language('cfgmngt.devlist.fromzone')}>{detailInfo.zone ? detailInfo.zone : ' '}</ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item label={language('cfgmngt.devlist.devdspninfo')}>{detailInfo.memo ? detailInfo.memo : ''}</ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
          <Divider className='dmcdevdivider' />
          <ProCard ghost title={language('cfgmngt.devlist.apiinfo')}>
            <div className='seeapiinfobox ' style={{ width: '735px' }}>
              <EditableProTable
                rowKey="id"
                size="small"
                toolBarRender={false}
                columns={dapiColumns}
                value={detailInfo.interface ? detailInfo.interface : []}
                className='dmcdeveditable'
                recordCreatorProps={false} editable={false} />
            </div>
          </ProCard>
          <Divider className='dmcdevdivider' />
          <ProCard ghost title={language('cfgmngt.devlist.hardwareinfo')}>
          <ProDescriptions column={2}>
						<ProDescriptions.Item name='applicant' label={language('cfgmngt.devlist.memorysize')}>{detailInfo.mem_total ? detailInfo.mem_total : ''}</ProDescriptions.Item>
					</ProDescriptions>
					<ProDescriptions>
						<ProDescriptions.Item style={{ display: 'block' }} label={language('cfgmngt.devlist.cpuinfo')}>
							<div style={{ width: '440px' }}>
								<EditableProTable
									rowKey="id"
									size="small"
									toolBarRender={false}
									columns={dcpuColumns}
                  value={detailInfo.cpu_info ? detailInfo.cpu_info : []}
									className='dmcdeveditable'
									recordCreatorProps={false}
									editable={false} />
							</div>
						</ProDescriptions.Item>
					</ProDescriptions>
          <ProDescriptions>
            <ProDescriptions.Item label={language('cfgmngt.devlist.diskinfo')}>
              <div style={{ width: '440px' }}>
                <EditableProTable
                  rowKey="id"
                  size="small"
                  toolBarRender={false}
                  columns={ddiskColumns}
                  value={detailInfo.disk_info ? detailInfo.disk_info : []}
                  className='dmcdeveditable'
                  recordCreatorProps={false}
                  editable={false} />
              </div>
            </ProDescriptions.Item>
          </ProDescriptions>
          </ProCard>
          <Divider className='dmcdevdivider' />
          <ProCard ghost title={language('cfgmngt.devlist.deployinfo')}>
          <ProDescriptions column={2}>
						<ProDescriptions.Item label={language('cfgmngt.devlist.customerunit')}>{detailInfo.organs ? detailInfo.organs : ''} </ProDescriptions.Item>
						<ProDescriptions.Item label={language('cfgmngt.devlist.administrativecode')}>{detailInfo.address_code ? detailInfo.address_code : ' '}</ProDescriptions.Item>
					</ProDescriptions>
					<ProDescriptions column={2}>
						<ProDescriptions.Item label={language('cfgmngt.devlist.deploymentarea')}>{detailInfo.address ? detailInfo.address : ''}</ProDescriptions.Item>
					</ProDescriptions>
					<ProDescriptions column={1}>
						<ProDescriptions.Item label={language('cfgmngt.devlist.contactsperson')}>
							<div style={{ width: '735px' }}>
								<EditableProTable
									rowKey="id"
									size="small"
									toolBarRender={false}
									columns={dcontactsColumns}
                  value={detailInfo.contact ? detailInfo.contact : []}
									className='dmcdeveditable'
									recordCreatorProps={false}
									editable={false} />
							</div>
						</ProDescriptions.Item>
					</ProDescriptions>
          </ProCard>
        </ProCard>
        </div>
      </div>
    </>
  )

}
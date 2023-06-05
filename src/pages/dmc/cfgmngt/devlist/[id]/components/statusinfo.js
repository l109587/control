import React, { useRef, useState, useEffect } from 'react';
import { Divider, Input, Tabs } from 'antd';
import { ProCard, ProDescriptions, EditableProTable } from '@ant-design/pro-components';
import { post } from '@/services/https';
import { language } from '@/utils/language';
import '@/utils/index.less';
import './basicinfo.less';

let H = document.body.clientHeight - 105
var clientHeight = H
export default (props) => {

  const { detailInfo} = props;

  //网卡状态
  const networkStatus = [
    {
      title: language('dmc.cfgmngt.devlist.networknumber'),
      dataIndex: 'interface_seq',
      width: 100,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.networkstatus'),
      dataIndex: 'interface_flag',
      width: 100,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.networkdescription'),
      dataIndex: 'interface_stat',
      width: 120,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.quantityflow'),
      dataIndex: 'interface_flow',
      width: 120,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.errormessagesnum'),
      dataIndex: 'interface_error',
      width: 120,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.packetslostnum'),
      dataIndex: 'interface_drop',
      width: 80,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.acquisitionduration'),
      dataIndex: 'duration_time',
      width: 130,
      align: 'left',
    },
  ];

  //异常状态
  const abnormalStatus = [
    {
      title: language('dmc.cfgmngt.devlist.exceptiontype'),
      dataIndex: 'event_type',
      width: 100,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.generationtime'),
      dataIndex: 'time',
      width: 130,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.alarmlevel'),
      dataIndex: 'risk',
      width: 100,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.exceptiondesc'),
      dataIndex: 'msg',
      width: 440,
      align: 'left',
    },
  ];

  //模块状态
  const modularStatus = [
    {
      title: language('dmc.cfgmngt.devlist.modulename'),
      dataIndex: 'name',
      width: 100,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.modulestatus'),
      dataIndex: 'status',
      width: 80,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.submodulename'),
      dataIndex: 'subname',
      width: 100,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.substate'),
      dataIndex: 'substatus',
      width: 80,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.notreporteddatanum'),
      dataIndex: 'record_delayednum',
      width: 130,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.notreportedfilenum'),
      dataIndex: 'file_delayednum',
      width: 130,
      align: 'left',
    }, {
      title: language('dmc.cfgmngt.devlist.policyversion'),
      dataIndex: 'version',
      width: 150,
      align: 'left',
    },
  ];

  return (
    <>
      <div className='dmcbasicinfo'>
        <ProCard ghost direction='column' >
          <ProCard ghost title={language('dmc.cfgmngt.devlist.statusinfo')}>
            <ProDescriptions column={2}>
              <ProDescriptions.Item label={language('dmc.cfgmngt.devlist.acquisitiontime')}>{detailInfo.system_time ? detailInfo.system_time : ''} </ProDescriptions.Item>
              <ProDescriptions.Item label={language('dmc.cfgmngt.devlist.detectorstacksnum')}>{detailInfo.did ? detailInfo.did : ' '}</ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item label={language('dmc.cfgmngt.devlist.momoryusage')}>{detailInfo.mem_status ? detailInfo.mem_status : ''}</ProDescriptions.Item>
              <ProDescriptions.Item label={language('dmc.cfgmngt.devlist.diskfreespace')}>{detailInfo.disk_status ? detailInfo.disk_status : ' '}</ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item label={language('dmc.cfgmngt.devlist.cpuusage')}>{detailInfo.cpu_status ? detailInfo.cpu_status : ''}</ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
          <Divider className='dmcdevdivider' />
          <ProCard ghost title={language('dmc.cfgmngt.devlist.businessstatus')}>
            <ProDescriptions column={2}>
              <ProDescriptions.Item name='applicant' label={language('dmc.cfgmngt.devlist.acquisitiontime')}>{detailInfo.business_time ? detailInfo.business_time : ''}</ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item name='applicant' label={language('dmc.cfgmngt.devlist.runtime')}>{detailInfo.uptime ? detailInfo.uptime : ''}</ProDescriptions.Item>
              <ProDescriptions.Item name='applicant' label={language('dmc.cfgmngt.devlist.softwareversion')}>{detailInfo.soft_version ? detailInfo.soft_version : ''}</ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={1}>
              <ProDescriptions.Item label={language('dmc.cfgmngt.devlist.networkstatus')}>
                <div style={{ width: '240px' }}>
                  <EditableProTable
                    rowKey="id"
                    size="small"
                    toolBarRender={false}
                    columns={networkStatus}
                    value={detailInfo.interface_status ? detailInfo.interface_status : []}
                    className='dmcdeveditable'
                    recordCreatorProps={false}
                    editable={false} />
                </div>
              </ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={1}>
              <ProDescriptions.Item label={language('dmc.cfgmngt.devlist.abnormalstate')}>
                <div style={{ width: '240px' }}>
                  <EditableProTable
                    rowKey="id"
                    size="small"
                    toolBarRender={false}
                    columns={abnormalStatus}
                    value={detailInfo.suspected ? detailInfo.suspected : []}
                    className='dmcdeveditable'
                    recordCreatorProps={false}
                    editable={false} />
                </div>
              </ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={1}>
              <ProDescriptions.Item label={language('dmc.cfgmngt.devlist.modulestatus')}>
                <div style={{ width: '240px' }}>
                  <EditableProTable
                    rowKey="id"
                    size="small"
                    toolBarRender={false}
                    columns={modularStatus}
                    value={detailInfo.module_status ? detailInfo.module_status : []}
                    className='dmcdeveditable'
                    recordCreatorProps={false}
                    editable={false} />
                </div>
              </ProDescriptions.Item>
            </ProDescriptions>
          </ProCard>
        </ProCard>
      </div>
    </>
  )

}
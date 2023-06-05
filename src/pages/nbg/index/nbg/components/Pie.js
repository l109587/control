import React, { useRef, useState } from 'react';
import { Button, Progress, Skeleton, Table } from 'antd';
import { history } from 'umi'
import { Pie, G2 } from '@ant-design/plots';
import { IeSquareFilled } from '@ant-design/icons';
import { EditableProTable, ProCard } from '@ant-design/pro-components';
import { language } from '@/utils/language';
import { useSelector } from 'umi'
// let H = document.body.clientHeight - 455
// var clientHeight = H



const Trendcharts = (props) => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 383
  const { registerTheme } = G2
  registerTheme('custom-theme', {
    colors10: ['#5087EC', '#68BBC4', '#58A55C', '#F2BD42', '#EE752F'],
    colors20: ['#5087EC', '#68BBC4', '#58A55C', '#F2BD42', '#EE752F'],
  })
  const config = {
    appendPadding: 10,
    data: props.list,
    autoFit: true,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    innerRadius: 0.6,
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    // 图例位置及样式
    legend: {
      // layout: 'horizontal',
      // position: 'right',
      // marker: {
      //   Symbol:'square',
      // }
    },
    label: false,
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: '',
      },
    },
    theme: 'custom-theme',
  }


  const columns = [
    {
      title: language('index.nbg.assetstype'),
      dataIndex: 'type',
      align: 'left',
      ellipsis: true,
      key: 'type',
      width: 90
    },
    {
      title: language('index.nbg.assetscount'),
      dataIndex: 'count',
      align: 'center',
      ellipsis: true,
      key: 'count',
      width: 120,
      render: (text, record, _, action) => {
        let count = Math.round(record.count)
        return (
          <div className='colcountDiv'>
            <Progress percent={count} size="small" />
          </div>
        )
      }
    },
    {
      title: language('index.nbg.assetsnum'),
      dataIndex: 'num',
      align: 'center',
      ellipsis: true,
      key: 'num',
      width: 70,
      render: (text, record, _, action) => {
        return (
          <Button type='link' size='small' className='asstypenum' onClick={() => {
            history.push({ pathname: '/analyse/assets', state: { id: record.id } })
          }}>
            {record.num}
          </Button>
        )
      }
    }
  ]


  return (
    <div
      style={{
        // textAlign: 'center',
        height: clientHeight + 16,
        // lineHeight: clientHeight + 'px',
      }}
    >
      <ProCard direction='column' ghost>
        <ProCard ghost style={{ textalign: 'center' }} >
          {props.list.length == 0 ? (
            <Skeleton.Avatar
              active
              style={{ width: (clientHeight - 20) / 2, height: (clientHeight - 20) / 2, marginLeft: "10px", marginBottom: '20px' }}
            />
          ) : (
            <Pie {...config}
              style={{ height: (clientHeight - 56) / 7 * 4 }}
            />
          )}
        </ProCard>
        <ProCard ghost >
          {!props.tlist ? (
            <div style={{
              height: (clientHeight - 50) / 2,
              width: '95%',
              margin: '0px 10px 0px 10px',
              background: '#cccccc54',
              borderRadius: '6px',
            }}></div>
          ) : (
            <EditableProTable style={{ height: (clientHeight - 50) / 2 }}
              className='pietable'
              rowKey="id"
              size='small'
              scroll={{ y: (clientHeight - 56) / 7 * 3 }}
              value={props ? props.tlist : ''}
              bordered={true}
              columns={columns}
              recordCreatorProps={false}
            />)}
        </ProCard>
      </ProCard>
    </div>
  )
}

export default Trendcharts
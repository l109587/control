import React, { useEffect, useRef, useState } from 'react'
import { Card, Row, Col } from 'antd'
import { Area } from '@ant-design/plots'
import { get, post } from '@/services/https'
import styles from '../index.less'
// let H = document.body.clientHeight - 555
// var clientHeight = H
import { useSelector } from 'umi'

const Logchart = (props) => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 482
  const config = {
    data: props.data,
    xField: 'time',
    yField: 'value',
    seriesField: 'name',
    xAxis: {
      range: [0, 1],
      tickCount: 5,
    },
    yAxis: {
      label: {
        formatter: (v) => {
          if(v < 1000) return v
          if(v < 1000000) return `${(v / 1000).toFixed(0)} K`
          if(v < 1000000000) {
            let vs = v / 1000000 + '';
            return `${vs}M`
          }
          if(v < 1000000000000) {
            let gs = v / 1000000000 + '';
            return `${gs}G`
          }
        },
      },
    },
    tooltip: {
      formatter: (v) => {
        if(v.value < 1000) return { name: v.name, value: v.value }
        if(v.value < 1000000)
          return { name: v.name, value: (v.value / 1000).toFixed(0) + ' K' }
        if(v.value < 1000000000)
          return {
            name: v.name,
            value: `${(v.value / 1000000).toFixed(1)} M`,
          }
        if(v.value < 1000000000000)
          return {
            name: v.name,
            value: `${(v.value / 1000000000).toFixed(1)} G`,
          }
      },
    },
    legend: false,
    smooth: true,
    areaStyle: () => {
      return {
        fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
      }
    },
  }

  
  return (
    <div>
      <Card title={props.areadata.title} style={{ width: '100%' }}>
        { !props.data || props.data.length == 0 ? (
          <div
            style={{
              height: clientHeight,
              width: '98%',
              margin: '0px 10px 0px 10px',
              background: '#cccccc54',
              borderRadius: '6px',
            }}
          ></div>
        ) : (
          <Area {...config} style={{ height: clientHeight }} />
        )}

        <div className={styles.Jx_flex}>
          <div>
            <div style={{ fontSize: '18px' }}>{props.areadata.mflow ? props.areadata.mflow.name : ''}</div>
            <div className={styles.size_20}>{props.areadata.mflow ? props.areadata.mflow.value : ''}</div>
          </div>
          <div>
            <div style={{ fontSize: '18px' }}>{props.areadata.maddr ? props.areadata.maddr.name : ''}</div>
            <div className={styles.size_20}>{props.areadata.maddr ? props.areadata.maddr.value : ''}</div>
          </div>
          <div>
            <div style={{ fontSize: '18px' }}>{props.areadata.mtask ? props.areadata.mtask.name : ''}</div>
            <div className={styles.size_20}>{props.areadata.mtask ? props.areadata.mtask.value : ''}</div>
          </div>
        </div>
      </Card>
    </div>
  )

}
export default Logchart
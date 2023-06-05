import ReactDom from 'react-dom'
import React, { useEffect, useState } from 'react'
import { DualAxes } from '@ant-design/plots'
import { Skeleton } from 'antd'
import Mock, { Random } from 'mockjs'
import { language } from '@/utils/language'
import { LoadingOutlined } from '@ant-design/icons'
import { get, post } from '@/services/https'
import { ProCard } from '@ant-design/pro-components'
import { useSelector } from 'umi'

const MonDualAxes = () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 494
  const [reportData, setReportData] = useState()
  let arr = [1, 2, 3]

  useEffect(() => {
    getMonData()
  }, [])

  const getMonData = () => {
    post('/cfg.php?controller=sysHeader&action=showMReportChart').then(
      (res) => {
        setReportData(res)
      }
    )
  }

  const config = {
    data: [reportData?.lines, reportData?.lines],
    xField: 'time',
    yField: ['valueline', 'valuecol'],
    yAxis: {
      valueline: {
        min: 0,
        label: {
          formatter: (val) => {
            if (val >= 1000) {
              return `${val / 1000}K`
            } else {
              return val
            }
          }
        },
      },
      valuecol: false,
    },
    meta: {
      valueline: {
        alias: reportData?.nameline,
      },
      valuecol: {
        alias: reportData?.namecol,
      },
    },
    geometryOptions: [
      {
        geometry: 'column',
        color: '#5B8FF9',
      },
      {
        geometry: 'line',
        color: 'rgb(104, 187, 196)',
        point: {
          style: {
            fill: 'white',
            stroke: 'rgb(104, 187, 196)',
          },
        },
      },
    ],
  }

  return (
    <>
      <ProCard className='dualAxesCard'
        title={
          <div className="monCardTitle">
            <span>
              {reportData?.title ? (
                reportData?.title
              ) : (
                <LoadingOutlined style={{ color: '#1890ff', width: 60 }} />
              )}
            </span>
            <span className="monSubTitle">{language('index.nba.showTime')}</span>
          </div>
        }
      >
        {reportData?.lines || reportData?.lines?.length > 0 ? (
          <>
            <DualAxes {...config} style={{ height: clientHeight + 12 }} />
            <div className="monBottomDiv">
              <div>
                <div className="size_18">{reportData?.musers?.name}</div>
                <div className="size_20">{reportData?.musers?.value}</div>
              </div>
              <div>
                <div className="size_18">{reportData?.mreport?.name}</div>
                <div className="size_20">{reportData?.mreport?.value}</div>
              </div>
              <div>
                <div className="size_18">{reportData?.malarm?.name}</div>
                <div className="size_20">{reportData?.malarm?.value}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Skeleton.Input
              active
              style={{ height: clientHeight, width: '100%' }}
            ></Skeleton.Input>
            <div className="monBottomEmtpDiv">
              {arr.map((item) => {
                return (
                  <Skeleton.Button active style={{ height: 30, width: 90 }} />
                )
              })}
            </div>
          </>
        )}
      </ProCard>
    </>
  )
}
export default MonDualAxes

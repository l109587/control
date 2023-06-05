import React, { useEffect, useState } from 'react'
import { useHistory } from 'umi'
import { Skeleton, Col, Card } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { ProCard, StatisticCard } from '@ant-design/pro-components'
import ReactDom from 'react-dom'
import '@/utils/index.less'
import { MonDualAxes, Userstatistic, TinyArea } from './components'
import store from 'store';
import CateCard from '@/components/Index/CateCard/CateCard'
import { get, post } from '@/services/https'
import Smile from '@/assets/sys-god.png'
import Cry from '@/assets/sys-bad.png'
import NetworkAssetsImg from '@/assets/nfd/nbg-index-computer.svg'
import IllInnImg from '@/assets/nfd/nbg-index-illinn.svg'
import IllSvrImg from '@/assets/nfd/nbg-index-illsvr.svg'
import SerIesImg from '@/assets/nfd/nbg-index-series.svg'
import { language } from '@/utils/language'
import AuthCard from '../../../../components/Index/AuthCard/AuthCard'
import './alarm.less'

let clientHeight = document.body.clientHeight - 372
export default () => {
  const imgArr = [SerIesImg, IllInnImg, IllSvrImg, NetworkAssetsImg]
  const [infoData, setInfoData] = useState({})
  const [summaryData, setSummaryData] = useState([])

  useEffect(() => {
    getAuthData()
    getsummaryData()
    getUserList()
  }, [])

  /* 授权状态数据 */
  const getAuthData = () => {
    post('/cfg.php?controller=sysHeader&action=showSysInfo')
      .then((res) => {
        setInfoData(res)
      })
      .catch(() => {
        console.log('mistask')
      })
  }

  /* 违规统计数据 */
  const getsummaryData = () => {
    post('/cfg.php?controller=sysHeader&action=showMOutChart')
      .then((res) => {
        setSummaryData(res.data)
      })
      .catch(() => {
        console.log('mistask')
      })
  }

  const getUserList = () => {
    post('/cfg.php?controller=sysHeader&action=showAdminListName').then((res) => {
      if(!res.success) {
        return false;
      }
      store.set('userVal', res.data[0]?.value)
    }).catch(() => {
      console.log('mistake')
    })
  }

  return (
    <>
      <ProCard ghost gutter={[16, 16]} direction="column">
        {/* 1 */}
        <ProCard ghost gutter={[16, 16]}>
          <ProCard colSpan={8} ghost className="authCard">
            <AuthCard infodata={infoData} />
          </ProCard>
          <ProCard ghost colSpan={16}>
            <TinyArea />
          </ProCard>
        </ProCard>
        {/* 2 */}
        <ProCard ghost gutter={[16, 16]}>
          <ProCard ghost colSpan={16}>
            <MonDualAxes />
          </ProCard>
          <ProCard ghost colSpan={8}>
            <Userstatistic />
          </ProCard>
        </ProCard>
        {/* 3 */}
        <ProCard ghost gutter={[16, 16]}>
          {summaryData.length > 0
            ? summaryData.map((item, index) => {
                return (
                  <StatisticCard
                    ghost
                    className="briefcard"
                    colSpan="25%"
                    statistic={{
                      title: item.name,
                      value: item.value,
                      icon: <img src={imgArr[index]} />,
                    }}
                  />
                )
              })
            : [1, 2, 3, 4].map((item) => {
                return (
                  <ProCard colSpan="25%" style={{ height: 82 }}>
                    <Skeleton.Input
                      active
                      style={{ height: 42, width: '100%' }}
                    />
                  </ProCard>
                )
              })}
        </ProCard>
      </ProCard>
    </>
  )
}

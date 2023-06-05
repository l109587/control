import React, { useEffect, useState } from 'react'
import { ProTable, ProCard } from '@ant-design/pro-components'
import { language } from '@/utils/language'
import { get, post } from '@/services/https'
import { LoadingOutlined } from '@ant-design/icons'
import { history } from 'umi'
import store from 'store'
import { useSelector } from 'umi'

const Userstatistic = () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 305
  const column = [
    {
      title: language('sysconf.sysserv.user'),
      dataIndex: 'user',
      align: 'left',
      width: 80,
      ellipsis: true,
      render: (text, record) => {
        return (
          <div
            className="drillTag"
            onClick={() => {
              store.set('userVal', record.user)
              history.push({
                pathname: '/illevent/netseries',
                state: { user: record.user },
              })
            }}
          >
            {text}
          </div>
        )
      },
    },
    {
      title: language('index.alarm.mreport'),
      dataIndex: 'mreport',
      align: 'left',
      width: 80,
      ellipsis: true,
    },
    {
      title: language('index.alarm.malarm'),
      dataIndex: 'malarm',
      align: 'left',
      width: 80,
      ellipsis: true,
    },
    {
      title: language('index.alarm.lasttime'),
      dataIndex: 'lasttime',
      align: 'left',
      width: 120,
      ellipsis: true,
    },
  ]

  const [userData, setUserData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUserData()
  }, [])

  const getUserData = () => {
    setLoading(true)
    post('/cfg.php?controller=sysHeader&action=showMUserChart').then((res) => {
      setLoading(false)
      setUserData(res)
    })
  }

  return (
    <>
      <ProCard
        style={{
          height: clientHeight,
        }}
        title={
          <div className="monCardTitle">
            <span>
              {userData?.title ? (
                userData?.title
              ) : (
                <LoadingOutlined style={{ color: '#1890ff', width: 60 }} />
              )}
            </span>
            <span className="monSubTitle">
              {language('index.nba.showTime')}
            </span>
          </div>
        }
        colSpan={8}
      >
        <ProTable
          size="small"
          className="userstaTable"
          rowKey="index"
          loading={loading}
          scroll={{ y: clientHeight - 123 }}
          bordered={true}
          columns={column}
          dataSource={userData?.data}
          search={false}
          options={false}
          pagination={false}
        />
      </ProCard>
    </>
  )
}

export default Userstatistic

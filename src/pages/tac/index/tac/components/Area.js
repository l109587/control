import React, { useEffect, useRef, useState } from 'react'
import { history } from 'umi';
import { Skeleton } from 'antd';
import { post } from '@/services/https'
import { EditableProTable, ProCard, StatisticCard } from '@ant-design/pro-components';
import { language } from '@/utils/language';
import { DualAxes, TinyArea, TinyColumn } from '@ant-design/plots';
let H = document.body.clientHeight - 862
var clientHeight = H ? H : 0;

const Logchart = (props) => {

  let topPaddingBox = clientHeight > 0 ? (clientHeight) % 16 : 0;
  let diffenence = 0;
  let accesstabletrNum = clientHeight > 0 ? Math.floor((clientHeight) / 16) : 0;
  let accesstabletrTop = (accesstabletrNum) + 'px 0px';
  let accesstabletr = (accesstabletrNum) + 'px 0px';
  if (accesstabletrNum < 5) {
    diffenence = clientHeight > 0 ? Math.floor((clientHeight - 8) % 16) : 0;
    accesstabletrNum = clientHeight > 0 ? Math.floor((clientHeight - 8) / 16) : 0;
    accesstabletrTop = (accesstabletrNum + 4) + 'px 0px';
    accesstabletr = accesstabletrNum + 'px 0px';
    if(topPaddingBox > diffenence){
      topPaddingBox = topPaddingBox - diffenence;
    }

  } 

  let editTableHeight = 200;
  if (clientHeight > 0) {
    editTableHeight = 205 + clientHeight - 9;
  }
  const active = props.active;
  const [resTitle, setResTitle] = useState({ title: '', count: 0 });
  const [resData, setResData] = useState([]);
  const [resList, setResList] = useState([]);
  useEffect(() => {
    showResList();
  }, [props.incID])

  //资产总数趋势图
  const showResList = () => {
    post('/cfg.php?controller=sysHeader&action=showResList').then((res) => {
      setResData(res.lines);
      setResList(res.top);
      let tArr = {
        title: res.title,
        name: res.name,
        total: res.total
      }
      setResTitle(tArr);

    })
  }

  const config = {
    data: [resData, resData],
    height: 50,
    autoFit: true,
    xField: 'time',
    yField: ['used', 'alloc'],
    padding: [1, 1, 1, 1],
    appendPadding: [1, 1, 1, 1],
    yAxis: {
      // 隐藏右坐标轴
      used: false,
      alloc: false,
      min: 10,
    },
    meta: {
      used: {
        alias: language('index.tac.used'),
      },
      alloc: {
        alias: language('index.tac.assigned'),
      },
    },
    legend: false,
    xAxis: false,
    geometryOptions: [
      {
        geometry: 'column',
        color: '#5B8FF9',
      },
      {
        geometry: 'line',
        smooth: true,
        color: '#87B9F9',
        line: {
          color: '#87B9F9'
        },
        point: {
          color: '#87B9F9',
        }
      },
    ],
    // 更改柱线交互，默认为 [{type: 'active-region'}]
    interactions: [
      {
        type: 'element-highlight',
      },
      {
        type: 'active-region',
      },
    ],

  };

  const columns = [
    {
      title: language('index.tac.sort'),
      dataIndex: 'id',
      align: 'left',
      ellipsis: true,
      width: 40,
    },
    {
      title: <div style={{ padding: accesstabletrTop }}>{language('index.tac.orgname')}</div>,
      dataIndex: 'org',
      align: 'left',
      ellipsis: true,
      width: 140,
      render: (text, record, index) => {
        return <div className={record.allocNum > 0 ? 'accesstabletr tablemousehand' : 'accesstabletr nottablemousehand'} onClick={() => {
          if (record.allocNum > 0) {
            jHref('/central/ressta', record.orgID);
          }
        }} style={{ padding: accesstabletr }}>{record.org}</div>
      }
    },
    {
      title: language('index.tac.subnetnum'),
      dataIndex: 'subnetNum',
      align: 'left',
      ellipsis: true,
      key: 'num',
      width: 70,
    },
    {
      title: language('index.tac.ipaddrnum'),
      dataIndex: 'ipaddrNum',
      align: 'left',
      ellipsis: true,
      key: 'num',
      width: 70,
    },
    {
      title: language('index.tac.allocnum'),
      dataIndex: 'allocNum',
      align: 'left',
      ellipsis: true,
      key: 'num',
      width: 70,
    }
  ]

  const jHref = (url = '', type = '') => {
    history.push({ pathname: url, state: { type: type } })
  }

  return (
    <div className='accesscountbox'>
      <ProCard title={resTitle.title ? resTitle.title : <Skeleton.Button active={active} size={23} shape='default' style={{ width: '80px' }} block={true} />}  >
        <div className='resourcesmodebox' style={{ paddingBottom: topPaddingBox }}>
          {resTitle.title ?
            <StatisticCard chartPlacement="right" statistic={{
              title: resTitle.name,
              value: resTitle.total,
              valueStyle: {
                display: 'none',
              },
              description: <div onClick={() => {
                if (resTitle.total > 0) {
                  jHref('/central/ressta');
                }
              }} className={ resTitle.total > 0 ? 'mousehand' : 'notmousehand'} >{resTitle.total}</div>
            }} chart={<DualAxes className='dualaxescanvas'  {...config} />} />
            : <div style={{ padding: '0px 24px', width: '100%' }}><Skeleton.Input active={active} shape='default' style={{ height: '79px' }} block={true} /></div>}
        </div>
        <div>
          {resTitle.title ?
            <EditableProTable style={{ height: editTableHeight }}
              className='accessdtable'
              rowKey="id"
              size='small'
              value={resList}
              bordered={true}
              columns={columns}
              recordCreatorProps={false}
            />
            : <div style={{ padding: '0px 24px', width: '100%' }}><Skeleton.Input active={active} shape='default' style={{ height: editTableHeight }} block={true} /></div>}
        </div>

      </ProCard>
    </div >
  )

}
export default Logchart
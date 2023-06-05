import React, { useRef } from 'react'
// import { Line } from '@ant-design/charts'
import { Card, Row, Col } from 'antd'
import { Area } from '@ant-design/plots'
import { get, post } from '@/services/https'
import styles from '../index.less'
let H = document.body.clientHeight - 551
var clientHeight = H
class Cpu extends React.Component {
  formRef = React.createRef()
  state = {
    tftitle: '',
    list: [],
    tflow: {},
    tpkts: {},
    tconn: {},
  }
  //初始化时自调用一次，用于请求借口数据
  componentDidMount() {
    let that = this
    // setInterval(function () {
    that.getDatalist()
    // }, 0)
  }
  getDatalist = () => {
    post('/cfg.php?controller=sysHeader&action=showLogChart', {}).then(
      (res) => {
        if(!res.success){
          return false;
        }
        this.setState({
          tftitle: res.title,
          list: res.lines,
          tflow: res.tflow,
          tpkts: res.tpkts,
          tconn: res.tconn,
        })
      }
    )
  }
  render() {
    const { tftitle, list, tflow, tpkts, tconn } = this.state
    const config = {
      data: list,
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
            if (v < 1000) return v
            if (v < 1000000) return `${(v / 1000).toFixed(0)} K`
            if (v < 1000000000) return `${(v / 1000000).toFixed(0)} M`
            if (v < 1000000000000) return `${(v / 1000000000).toFixed(0)} G`
          },
        },
      },
      tooltip: {
        formatter: (v) => {
          if (v.value < 1000) return { name: v.name, value: v.value }
          if (v.value < 1000000)
            return { name: v.name, value: (v.value / 1000).toFixed(0) + ' K' }
          if (v.value < 1000000000)
            return {
              name: v.name,
              value: `${(v.value / 1000000).toFixed(0)} M`,
            }
          if (v.value < 1000000000000)
            return {
              name: v.name,
              value: `${(v.value / 1000000000).toFixed(0)} G`,
            }
        },
      },
      legend: false,
      smooth: true,
      // @TODO 后续会换一种动画方式
        // animation: {
        //   appear: {
        //     animation: 'path-in',
        //     duration: 5000,
        //   },
        // },
      areaStyle: () => {
        return {
          fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
        }
      },
    }
    return (
      <div>
        <Card title={tftitle} style={{ width: '100%' }}>
          {list.length == 0 ? (
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
              <div style={{ fontSize: '18px' }}>{tflow.name}</div>
              <div className={styles.size_20}>{tflow.value}</div>
            </div>
            <div>
              <div style={{ fontSize: '18px' }}>{tpkts.name}</div>
              <div className={styles.size_20}>{tpkts.value}</div>
            </div>
            <div>
              <div style={{ fontSize: '18px' }}>{tconn.name}</div>
              <div className={styles.size_20}>{tconn.value}</div>
            </div>
          </div>
        </Card>
      </div>
    )
  }
}
export default Cpu

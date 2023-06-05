import React, { useRef } from 'react'
// import { Line } from '@ant-design/charts'
import { Card, Row, Col, Skeleton } from 'antd'
import { DualAxes } from '@ant-design/plots'
import { get, post } from '@/services/https'
import styles from '../index.less'
let H = document.body.clientHeight - 505
var clientHeight = H
class Cpu extends React.Component {
  formRef = React.createRef()
  state = {
    tftitle: '',
    subtitle: '',
    list: [],
    bar: [],
    mathMax: 1000,
  }
  //初始化时自调用一次，用于请求借口数据
  componentDidMount() {
    let that = this
    that.getDatalist()
  }
  getDatalist = () => {
    post('/cfg.php?controller=sysAnalysis&action=showFlowConnStat', {}).then(
      (res) => {
        res.lines.map((item, index) => {
          item.count = item.value
          delete item.value
        })
        this.setState({
          tftitle: res.title,
          list: res.lines,
          bar: res.bar,
          subtitle: res.subtitle,
          mathMax: this.mathMax(res.bar),
        })
      }
    )
  }
  mathMax = (arrs) => {
    if (arrs.length == 0) {
      return
    }
    var max = arrs[0].value
    for (var i = 1, ilen = arrs.length; i < ilen; i++) {
      if (arrs[i].value > max) {
        max = arrs[i].value
      }
    }
    if (Math.ceil(max) > 150000) return Math.ceil(max) + 60000
    else if (Math.ceil(max) > 100000) return Math.ceil(max) + 50000
    else if (Math.ceil(max) > 80000) return Math.ceil(max) + 30000
    else if (Math.ceil(max) > 50000) return Math.ceil(max) + 15000
    else if (Math.ceil(max) > 20000) return Math.ceil(max) + 10000
    else if (Math.ceil(max) > 10000) return Math.ceil(max) + 4000
    else if (Math.ceil(max) > 8000) return Math.ceil(max) + 2000
    else if (Math.ceil(max) > 4000) return Math.ceil(max) + 1000
    else if (Math.ceil(max) > 1500) return Math.ceil(max) + 500
  }
  render() {
    const { tftitle, list, subtitle, bar, mathMax } = this.state
    const config = {
      data: [bar, list],
      xField: 'time',
      yField: ['value', 'count'],
      yAxis: {
        label: {
        formatter: (v) => {
          if (v < 1000) return v
          if (v < 1000000) return `${(v / 1000).toFixed(0)} K`
          if (v < 1000000000) return `${(v / 1000000).toFixed(0)} M`
          if (v < 1000000000000) return `${(v / 1000000000).toFixed(0)} G`
        },
      },
        // 格式化左坐标轴
        value: {
          min: 0,
          max: mathMax,
        },
        // 格式化右坐标轴
        count: {
          min: 0,
          max: mathMax,
        },
      },
      geometryOptions: [
        {
          geometry: 'column',
          columnWidthRatio: 0.4,
          seriesField: 'label',
        },
        {
          geometry: 'line',
          seriesField: 'label',
        },
      ],
      // 更改柱线交互，默认为 [{type: 'active-region'}]
      interactions: [
        {
          type: 'element-highlight',
        },
        {
          type: 'active-region',
        },
      ],
      legend: {
        layout: 'horizontal',
        position: 'bottom',
        offsetY: 8,
        itemHeight: 15,
      },
    }
    return (
      <div>
        <Card style={{ width: '100%' }}>
          <div className={styles.fon_16}>{tftitle}</div>
          <div className={styles.fon_12c}>{subtitle}</div>
          {bar.length == 0 ? (
            <Skeleton.Input style={{ height: clientHeight, width: '100%',minHeight:300 }}  active />
          ) : (
            <DualAxes
              {...config}
              style={{ height: clientHeight, margin: '6px 12px 0px 12px',minHeight:300 }}
            />
          )}
        </Card>
      </div>
    )
  }
}
export default Cpu

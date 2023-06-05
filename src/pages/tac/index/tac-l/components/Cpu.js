import React, { useRef } from 'react'
// import { Line } from '@ant-design/charts'
import {} from 'antd'
import { Area } from '@ant-design/plots'
class Cpu extends React.Component {
  formRef = React.createRef()
  state = {}
  //初始化时自调用一次，用于请求借口数据
  componentDidMount() {}
  render() {
    const { data, xstep } = this.props
    const config = {
      data: data,
      xField: 'time',
      yField: 'value',
      xAxis: {
        range: [0, 1],
        tickCount: 5,
      },
      yAxis: {
        min: 0,
        max: 100,
        tickInterval: 20,
      },
      tooltip: {
        formatter: (v) => {
          return { name: '使用率', value: v + '%' }
        },
      },
      areaStyle: () => {
        return {
          fill: 'l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff',
        }
      },
    }
    return (
      <div>
        <Area {...config} style={{ height: 80 }} />
      </div>
    )
  }
}
export default Cpu

import React, { useRef } from 'react'
import { get, post } from '@/services/https'
import Area from '@/components/Charts/Area/Area'
import styles from '../index.less'

let H = document.body.clientHeight - 310
var clientHeight = H / 4

class Cpu extends React.Component {
  formRef = React.createRef()
  state = {
    Rptlist: [],
    Rpttitle: '',
    field: '条目数',
  }
  //初始化时自调用一次，用于请求借口数据
  componentDidMount() {
    this.RptLog()
  }
  RptLog = () => {
    post('/cfg.php?controller=sysAnalysis&action=showRptLogRunChart', {}).then(
      (res) => {
        this.setState({
          field: res.field,
          Rptlist: res.lines,
          Rpttitle: res.title,
        })
      }
    )
  }
  tooltipFormat = (value) => {
    if (value.value < 1000) return { name: this.state.field, value: value.value }
    if (value.value < 1000000)
      return { name: this.state.field, value: (value.value / 1000).toFixed(0) + ' K' }
    if (value.value < 1000000000)
      return {
        name: this.state.field,
        value: `${(value.value / 1000000).toFixed(0)} M`,
      }
    if (value.value < 1000000000000)
      return {
        name: this.state.field,
        value: `${(value.value / 1000000000).toFixed(0)} G`,
      }
  }
  render() {
    const { Rptlist, xstep, Rpttitle } = this.state
    return (
      <div>
        <div className={styles.fon_16}>{Rpttitle}</div>
        <Area
          data={Rptlist}
          xField="time"
          yField="value"
          seriesField="name"
          xstep={5}
          clientHeight={clientHeight}
          tooltipFormat={this.tooltipFormat}
          legend={false}
          color='l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff'
          minHeight = {130}
        />
      </div>
    )
  }
}
export default Cpu

import React from 'react'
import CateCard  from '@/components/Index/CateCard/CateCard'
import { post } from '@/services/https'
class Cpu extends React.Component {
  state = {
    lines: [],
    usagecpu: '',
    title: this.props.type == 'cpu'?'CPU状态':'内存状态',
  }
  componentDidMount() {
        this.fetchSysData()
        this.checkRebootFinish()
  }
  componentWillUnmount(){
    clearInterval(this.timer)
  }
  fetchSysData = ()=>{
    post('/cfg.php?controller=sysHeader&action=showSysChart', {
      chartype: this.props.type,
    }).then((res) => {
      let lines = []
      res?.lines?.map((item, index) => {
        lines.push(item.value)
      })
      this.setState({
        lines: lines,
        usagecpu: res.usage,
        title: res.title,
      })
    })
  }
  checkRebootFinish = () => {
    this.timer = setInterval(() => {
      this.fetchSysData()
    }, 2000)
  }
  render() {
    const { lines, xstep, usagecpu, title } = this.state
    return (
      <CateCard title={title} usagecpu={usagecpu} lines={lines}/>
    )
  }
}
export default Cpu

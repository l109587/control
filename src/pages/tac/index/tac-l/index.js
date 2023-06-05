import React from 'react'
import { connect, history } from 'umi'
import { withI18n } from '@lingui/react'
import { StatisticCard, ProCard } from '@ant-design/pro-components';
import { Row, Col, Divider, Card,Progress, Tooltip, Button } from 'antd'
import styles from './index.less'
import  './index.less'
import '@/utils/index.less'
import { get, post } from '@/services/https'
import { language } from '@/utils/language';
import { ScheduleOutlined, AlertOutlined, LinkOutlined } from '@ant-design/icons'
import { TinyArea, Pie, Area, TinyAreae } from './components'
import imgUR from '@/assets/sys-god.png'
import Inter from '@/assets/nfd/Inter.png'
import Fw from '@/assets/nfd/Fw.png'
import HH from '@/assets/nfd/HH.png'
const { Meta } = Card;

let H = document.body.clientHeight - 380
var deviceheight = H
var halfdeheight = (deviceheight-100) / 2
var paddingnum = (halfdeheight-114) / 2
console.log(deviceheight)

var time //设置一个全局变量
@withI18n()
@connect(({ post, loading }) => ({ post, loading }))
class overview extends React.Component {
  formRef = React.createRef()
  state = {
    dtime: {},
    sinfo: {},
    state: {},
    usagecpu: '',
    usagemem: '',
    cpulist: [],
    memlist: [],
    list: [],
    Appslist: [],
    datalist: [],
    Stetle: '',
  }

  componentDidMount() {
    this.getData()
    this.getDataApps()
    this.getDataAp()
  }

  getData = () => {
    post('/cfg.php?controller=sysHeader&action=showSysInfo', {}).then((res) => {
      this.setState({ dtime: res.dtime, sinfo: res.sinfo, state: res.state })
    })
  }

  getDataApps = () => {
    post('/cfg.php?controller=sysHeader&action=showDeviceChart', {}).then(
      (res) => {
        this.setState({
          Stetle: res.title,
          Appslist: res.data,
        })
      }
    )
  }

  getDataAp = () => {
    post('/cfg.php?controller=sysHeader&action=showConfigChart', {}).then(
      (res) => {
        this.setState({
          datalist: res.data,
        })
      }
    )
  }

  render() {
    const {
      dtime,
      sinfo,
      state,
      Appslist,
      datalist,
      Stetle,
    } = this.state

   let onlinevalue = Appslist[2]?Appslist[2].value.split("%").join(""):''
    return (
      <div style={{ height:"100%" }}>
        <Row gutter={16}>
          <Col span={8}>
            <Card style={{ width: '100%' }}>
              <Row>
                <Col span={12}>
                  <div className={styles.dip_flex} style={{ height: '59px' }}>
                    <div
                      style={{
                        width: '60px',
                        textAlign: 'center',
                      }}
                    >
                      <img alt="logo" style={{ width: '40px' }} src={imgUR} />
                    </div>
                    <div>
                      <div className={styles.font_16}>{state.value}</div>
                      <div>{state.name}</div>
                    </div>
                  </div>
                </Col>
                <Col span={12}>
                  <div
                    className={styles.dip_flex}
                    style={{ height: '59px', justifyContent: 'flex-end' }}
                  >
                    <div></div>
                    <div>
                      <div className={styles.font_16}>{dtime.week}</div>
                      <div>{dtime.date}</div>
                    </div>
                  </div>
                </Col>
              </Row>
              <div style={{ height: '67px', padding: ' 8px 0px 0px 10px' }}>
                <Row className={styles.margin_shi}>
                  <Col span={12}>
                    <div className={styles.Font_col}>{language('index.tac.promodel')}</div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.Bang_color}>{sinfo.pmodel}</div>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <div className={styles.Font_col}>{language('index.tac.runtime')}</div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.Bang_color}>{sinfo.runtime}</div>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <TinyArea
              style={{ width: '100%' }}
              ref="getSwordTinyArea"
            ></TinyArea>
          </Col>
          <Col span={8}>
            <TinyAreae
              style={{ width: '100%' }}
              ref="getSwordTinyAreae"
            ></TinyAreae>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '15px' }}>
          <Col span={16}>
            <Area style={{ width: '100%' }}></Area>
          </Col>
          <Col span={8}>

              <ProCard  gutter={[20,20]} style={{ height: deviceheight+8  }} title={Stetle}  direction='column'>
                 <ProCard style={{ width:"100%", }}  ghost  gutter={[20,20]}>
                    <ProCard bordered={false} colSpan="50%" style={{ height:halfdeheight+10,}} >
                      <div style={{ height:"100%", }} className={styles.devicebox}>
                        <ScheduleOutlined style={{fontSize:"0.6rem", color:"#12C189",marginTop:"0.15rem" }} />
                        <p style={{ fontSize:16, color:'#555555' }}>{Appslist[0]?Appslist[0].name:''}</p>
                        <p style={{ marginTop:-8, fontSize:25, color:'#111111' }}>{Appslist[0]?Appslist[0].value:''}</p>
                      </div>  
                    </ProCard>
                    <ProCard style={{ height:halfdeheight+10 }} bordered={false} colSpan="50%">
                      <div style={{ height:"100%"}} className={styles.devicebox}>
                        <AlertOutlined  style={{ fontSize:"0.6rem",color:"#FFC478 ", marginTop:"0.15rem" }}  />
                        <p style={{ marginTop:3, fontSize:16, color:'#555555' }}>{Appslist[1]?Appslist[1].name:''}</p>
                        <p style={{ marginTop:-8, fontSize:25, color:'#111111' }}>{Appslist[1]?Appslist[1].value:''}</p>
                      </div>    
                    </ProCard>
                </ProCard>
                <ProCard style={{ height:halfdeheight-10, paddingTop:paddingnum,paddingBottom:paddingnum }} bordered={false} ghost >
                    <StatisticCard style={{ height:"100" }}
                        className='devicestatistic'
                        ghost
                        statistic={{
                            title: (<span style={{ fontSize:16 }} >{Appslist[2]?Appslist[2].name:''}</span>),
                            value: Appslist[2]?Appslist[2].value:'',
                            icon: (<LinkOutlined  style={{ fontSize:"0.6rem", marginTop:25, color:"#101010 " }} />),
                            description:(<div ><Progress size='small' percent={onlinevalue} showInfo={false}/>
                            <div style={{width:"100%",  display:'flex',alignItems:'center',justifyContent:'space-between' }}>
                                <div>{Appslist[3]?Appslist[3].name:''}</div>
                                <div>{Appslist[3]?Appslist[3].value:''}</div>
                              </div> 
                              </div>
                            )
                        }}/>
                </ProCard>
              </ProCard>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '15px' }}>
          {datalist.map((item, index) => {
            return (
              <Col span={24 / datalist.length}>
                <Card style={{ width: '100%' }}>

                  <div
                    className={styles.dip_flex}
                    style={{ justifyContent: 'space-between' }}
                  >
                    <div 
                      style={{
                        width: '60px',
                        textAlign: 'center',
                      }}
                    >
                      <img alt="logo" style={{ width: '40px' }} src={Fw} />
                    </div>
                    <div>
                      <div className={styles.size_28}>{item.value}</div>
                      <div className={styles.size_14}>{item.name}</div>
                    </div>
                  </div>
                </Card>
              </Col>
            )
          })}
        </Row>
      </div>
    )
  }
}
export default overview

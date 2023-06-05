import React from 'react'
import { connect, history } from 'umi'
import { withI18n } from '@lingui/react'
import { Row, Col, Card } from 'antd'
import styles from './index.less'
import '@/utils/index.less'
import { get, post } from '@/services/https'
import TinyArea from './components/TinyArea'
import Area from '@/components/Charts/Area/Area'
import Pie from '@/components/Charts/Pie/Pie'
import imgUR from '@/assets/nta/Zc.png'
import Fw from '@/assets/nta/Fw.png'

//面积图的高
let AreaHeight = document.body.clientHeight - 555

//环形图的高
let pieHeight = document.body.clientHeight - 455

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
    tflow: {},
    tpkts: {},
    tconn: {},
    Appslist: [],
    datalist: [],
    tftitle: '',
    Stetle: '',
  }

  componentDidMount() {
    this.getData()
    this.getDatalist()
    this.getDataApps()
    this.getDataAp()

    const { dispatch } = this.props
    history.listen((location, action) => {
      //监控
      if (location.pathname == '/index/index') {
        // dispatch({
        //   type: 'app/handleCollapseChange',
        //   payload: true,
        // })
      } else {
        // dispatch({
        //   type: 'app/handleCollapseChange',
        //   payload: false,
        // })
      }
    })
  }
  componentWillUnmount = () => {
    window.removeEventListener('beforeunload', this.beforeunload)
  }
  beforeunload = () => {
  }
  getData = () => {
    post('/cfg.php?controller=sysHeader&action=showSysInfo', {}).then((res) => {
      this.setState({ dtime: res.dtime, sinfo: res.sinfo, state: res.state })
    })
  }
  getDatalist = () => {
    post('/cfg.php?controller=sysHeader&action=showFlowChkChart', {}).then(
      (res) => {
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
  getDataApps = () => {
    post('/cfg.php?controller=sysHeader&action=showAppsTopChart', {}).then(
      (res) => {
        let Arrer = [
          { type: 'SSL加密协议', value: 0 },
          { type: '域名解析协议', value: 0 },
          { type: 'HTTP协议', value: 0 },
          { type: '其他协议', value: 0 },
        ]
        res.data?.map((item, index) => {
          Arrer?.map((item1, index) => {
            if (item.type == item1.type) {
              item1.value = item.value
            }
          })
        })
        this.setState({
          Stetle: res.title,
          Appslist: Arrer,
        })
      }
    )
  }
  getDataAp = () => {
    post('/cfg.php?controller=sysHeader&action=showLogStats', {}).then(
      (res) => {
        this.setState({
          datalist: res.data,
        })
      }
    )
  }

  tooltipFormat = (value) => {
    if (value.value < 1000) return { name: value.name, value: value.value }
    if (value.value < 1000000)
      return { name: value.name, value: (value.value / 1000).toFixed(0) + ' K' }
    if (value.value < 1000000000)
      return {
        name: value.name,
        value: `${(value.value / 1000000).toFixed(0)} M`,
      }
    if (value.value < 1000000000000)
      return {
        name: value.name,
        value: `${(value.value / 1000000000).toFixed(0)} G`,
      }
  }
  render() {
    const {
      dtime,
      sinfo,
      state,
      list,
      tflow,
      tpkts,
      tconn,
      Appslist,
      datalist,
      tftitle,
      Stetle,
    } = this.state
    return (
      <div>
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
                      <div className={styles.font_16}>{state?.value}</div>
                      <div>{state?.name}</div>
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
                      <div className={styles.font_16}>{dtime?.week}</div>
                      <div>{dtime?.date}</div>
                    </div>
                  </div>
                </Col>
              </Row>
              <div style={{ height: '67px', padding: ' 8px 0px 0px 10px' }}>
                <Row className={styles.margin_shi}>
                  <Col span={12}>
                    <div className={styles.Font_col}>产品型号</div>
                  </Col>
                  <Col span={12}>
                    <div className={styles.Bang_color}>{sinfo?.pmodel}</div>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <div className={styles.Font_col}>运行时间</div>
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
              type='cpu'
            ></TinyArea>
          </Col>
          <Col span={8}>
            <TinyArea
              style={{ width: '100%' }}
              type='mem'
            ></TinyArea>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '15px' }}>
          <Col span={16}>
            <Card title={tftitle||'镜像流量监测'} style={{ width: '100%' }}>
              <Area 
              data={list} 
              xstep={5}
              xField="time"
              yField="value"
              seriesField='name'
              clientHeight={AreaHeight}
              tooltipFormat={this.tooltipFormat}
              legend={false}
              color='l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff'/>
               <div className={styles.Jx_flex}>
            <div>
              <div style={{ fontSize: '18px' }}>{tflow?.name}</div>
              <div className={styles.size_20}>{tflow?.value}</div>
            </div>
            <div>
              <div style={{ fontSize: '18px' }}>{tpkts?.name}</div>
              <div className={styles.size_20}>{tpkts?.value}</div>
            </div>
            <div>
              <div style={{ fontSize: '18px' }}>{tconn?.name}</div>
              <div className={styles.size_20}>{tconn?.value}</div>
            </div>
          </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title={Stetle||'应用协议统计'} style={{ width: '100%' }}>
              <Pie data={Appslist} angleField='value' colorField='type' innerRadius={0.6} clientHeight={pieHeight} minHeight = {280}/>
            </Card>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '15px' }}>
          {datalist?.map((item, index) => {
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

import { Card, Row, Col } from 'antd'
import TinyLine from '@/components/Charts/TinyLine/TinyLine'
import styles from './CateCard.less'
import { language } from '@/utils/language'

export default function CateCard(props) {
  const {
    title = language('index.tac.cpustatus'),
    usagecpu = '0%',
    lines = [],
    usetitle =language('index.tac.currentusage'),
  } = props
  return (
    <div>
      <Card style={{ width: '100%' }}>
        <div style={{ height: 51 }}>
          <Row>
            <Col span={24} style={{ height: 25 }}>
              <div className={styles.Cpu_bold}>{title}</div>
            </Col>
          </Row>
          <Row className={styles.margin_shi}>
            <Col span={12}>
              <div className={styles.Font_col}>
                {usetitle}
              </div>
            </Col>
            <Col span={12}>
              <div
                className={styles.Font_col}
                style={{
                  float: 'right',
                  fontSize: '20px',
                  position: 'absolute',
                  right: '0px',
                  top: '-4px',
                }}
              >
                {usagecpu}
              </div>
            </Col>
          </Row>
        </div>

        <div style={{ margin: '12px -12px -12px', height: 75 }}>
          <TinyLine
            data={lines}
            color="#fff"
            height={75}
            max={100}
            backgroundImage="linear-gradient(to bottom right, #7c9efc,#64b4fd,#4fc7fc,#40d4fc)"
          />
        </div>
      </Card>
    </div>
  )
}

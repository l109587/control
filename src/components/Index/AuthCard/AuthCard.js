import React from 'react'
import { ProCard } from '@ant-design/pro-components'
import { language } from '@/utils/language'
import { Card, Row, Col } from 'antd'
import styles from './AuthCard.less'
import Cry from '@/assets/sys-bad.png'
import Smile from '@/assets/sys-god.png'

const AuthCard = (props) => {
  const { infodata } = props

  return (
    <>
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
                <img
                  alt="logo"
                  style={{ width: '40px' }}
                  src={infodata?.state?.value == '正常' ? Smile : Cry}
                />
              </div>
              <div>
                <div className={styles.font_16}>
                  {infodata.state ? infodata.state.value : ''}
                </div>
                <div>{infodata.state ? infodata.state.name : ''}</div>
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
                <div className={styles.font_16}>
                  {infodata.dtime ? infodata.dtime.week : ''}
                </div>
                <div>{infodata.dtime ? infodata.dtime.date : ''}</div>
              </div>
            </div>
          </Col>
        </Row>
        <div
          style={{
            height: '67px',
            padding: ' 8px 0px 0px 10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
          }}
        >
          <Row className="margin_shi">
            <Col span={12}>
              <div className={styles.Font_col}>
                {language('index.nbg.promodel')}
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.Bang_color}>
                {infodata.sinfo ? infodata.sinfo.pmodel : ''}
              </div>
            </Col>
          </Row>
          <Row className="margin_shi">
            <Col span={12}>
              <div className={styles.Font_col}>
                {language('index.nbg.runtime')}
              </div>
            </Col>
            <Col span={12}>
              <div className={styles.Bang_color}>
                {infodata.sinfo ? infodata.sinfo.runtime : ''}
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </>
  )
}

export default AuthCard

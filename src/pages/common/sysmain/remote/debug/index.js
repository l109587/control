import React, { useRef, useState } from 'react'
import { DatePicker, Form, Button, Divider, Input, Spin, message,Col } from 'antd'
import ProCard from '@ant-design/pro-card'
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons'
import moment from 'moment'
import { regIpList } from '@/utils/regExp'
import { language } from '@/utils/language'
import { formleftLayout } from '@/utils/helper'
import { ProForm, ProFormDatePicker, ProFormText } from '@ant-design/pro-components'
import DateRangePicker from '@/components/DateRangePicker';
import Download from '@/components/Common/download'
import { KeepAlive, history} from 'umi'

const DebugExp = (props) => {
  const timeForm = useRef();
  const [ipForm] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [devStartTime, setDevStartTime] = useState(moment().subtract(1, 'week'))
  const [devEndTime, setDevEndTime] = useState(moment())
  const [mgtAddr, setMgtAddr] = useState('')
  const [agtAddr, setAgtAddr] = useState('')

  const loadIcon = <LoadingOutlined spin />
  return (
    <>
      <Spin
        tip={language('project.sysdebug.wireshark.loading')}
        spinning={loading}
        indicator={loadIcon}
      >
        <ProCard bodyStyle={{display:'block',paddingTop:16}}>
          <ProCard title={language('project.sysdebug.export.derecord')} bodyStyle={{paddingBottom:0}}headStyle={{padding:0}}>
            <div>
              <ProForm submitter={false}
                formRef={timeForm}
                {...formleftLayout}
                initialValues={{
                  date_start: moment().subtract(1, 'week'),
                  date_end: moment(),
                }}
              >
                <DateRangePicker labelText={language('project.sysdebug.export.startime')} formName='date_start' width='220px' disabledDateFn={
                  (current) => {
                    let obj = timeForm.current.getFieldsValue(['date_end'])
                    return current > obj.date_end
                  }
                }
                onChange={
                  (value)=>{
                    const time = moment(value).format('YYYY-MM-DD')
                    setDevStartTime(time)
                  }
                }
                />
                <DateRangePicker labelText={language('project.sysdebug.export.endtime')} formName='date_end' width='220px' disabledDateFn={
                  (current) => {
                    let obj = timeForm.current.getFieldsValue(["date_start"])
                  return current < obj.date_start
                  }
                } 
                  onChange={
                    (value)=>{
                      const time = moment(value).format('YYYY-MM-DD')
                      setDevEndTime(time)
                    }
                  }
                />
              </ProForm>
              <Col offset={6}>
                <div>
                  <Download 
                    text={language('project.sysdebug.export.explog')} 
                    api='/cfg.php?controller=mtaDebug&action=exportDebugLog' 
                    params={{
                      begDate:moment(devStartTime).format('YYYY-MM-DD'),
                      endDate:moment(devEndTime).format('YYYY-MM-DD'),
                    }}
                    setLoading={setLoading}
                    icon={<DownloadOutlined/>}
                    buttonType='primary'
                  />
                </div>
              </Col>
            </div>
          </ProCard>
          {props.isShowAgtlog.current ? (
            <div>
              <Divider style={{marginBottom:16,marginTop:16}}/>
              <ProCard title={language('project.sysdebug.export.termlog')} headStyle={{padding:0}}>
                <Form
                  form={ipForm}
                  {...formleftLayout}
                >
                  <Form.Item
                    label={language('project.sysdebug.export.magip')}
                    name="mgtAddr"
                    rules={[
                      {
                        required: true,
                        message: language('project.sysdebug.export.mustip'),
                      },
                      {
                        pattern: regIpList.ipv4.regex,
                        message: regIpList.ipv4.alertText,
                      },
                    ]}
                  >
                    <Input
                      placeholder={language(
                        'project.sysdebug.export.magiptip.placeholder'
                      )}
                      style={{ width: '220px' }}
                      onChange={
                        (value)=>{
                          console.log(value.target.value,'value');
                          setMgtAddr(value.target.value)
                        }
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    label={language('project.sysdebug.export.termip')}
                    name="agtAddr"
                    rules={[
                      {
                        required: true,
                        message: language('project.sysdebug.export.mustip'),
                      },
                      {
                        pattern: regIpList.ipv4.regex,
                        message: regIpList.ipv4.alertText,
                      },
                    ]}
                  >
                    <Input
                      placeholder={language(
                        'project.sysdebug.export.termiptip.placeholder'
                      )}
                      style={{ width: '220px' }}
                      onChange={
                        (value)=>{
                          setAgtAddr(value.target.value)
                        }
                      }
                    />
                  </Form.Item>
                </Form>
                <Col offset={6}>
                <div>
                  <Download 
                    text={language('project.sysdebug.export.explog')} 
                    api='/cfg.php?controller=mtaDebug&action=exportAgentLog'
                    params={{
                      mgtAddr:mgtAddr,
                      agtAddr:agtAddr
                    }}
                    setLoading={setLoading}
                    icon={<DownloadOutlined/>}
                    buttonType='primary'
                    isLasting={true}
                  />
                </div>
              </Col>
              </ProCard>
            </div>
          ) : (
            ''
          )}
        </ProCard>
      </Spin>
    </>
  )
}

export default (props) => {
  const { isShowAgtlog } = props
  return (
    <KeepAlive
      // saveScrollPosition="screen" //自动保存共享屏幕容器的滚动位置
      id={history.location.pathname}  // 根据参数去缓存，如果参数不同就缓存多份，如果参数相同就使用同一个缓存。这样解决了传参改变时，页面不刷新的问题
      when={true}
    >
      {/* 页面组件 */}
      <DebugExp isShowAgtlog = {isShowAgtlog}></DebugExp> 
    </KeepAlive>
  )
};

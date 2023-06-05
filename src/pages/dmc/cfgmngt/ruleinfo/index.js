import { useRef, useState, useEffect } from 'react'
import {
  ProForm,
  ProCard,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProTable
} from '@ant-design/pro-components'
import { formItemLayout } from '@/utils/helper'
import { language } from '@/utils/language'
import { Col, Button, message, Alert, Row } from 'antd'
import { post } from '@/services/https'
import { SaveOutlined } from '@ant-design/icons'
import styles from './index.less'
import { regList } from '@/utils/regExp';
import WebUploadr from '@/components/Module/webUploadr'

export default function Ruleinfo() {
  const formRef = useRef()
  const listenFormRef = useRef()
  const [superviseType, setSuperviseType] = useState('XZ') //监管类型
  const [level, setLevel] = useState('') //平台级别
  const [province, setProvince] = useState([]) //省级
  const [provinceCode, setProvinceCode] = useState('') //省级code
  const [cityCode, setCityCode] = useState('') //市级code
  const [countryCode, setCountryCode] = useState('') //县级code
  const [city, setCity] = useState([]) //地市级
  const [county, setCounty] = useState([]) //县级
  const [certData, setCertData] = useState([]) //证书列表
  const [uplisData, setUplisData] = useState([]) //上传证书返回表格数据

  useEffect(() => {
    fetchData()
  }, [])
  //中心级别配置回显
  const fetchData = () => {
    post('/cfg.php?controller=confCenterManage&action=show').then((res) => {
      if (res.success) {
        const { type, level, sysid,port } = res.data[0]
        const data = { type: type, level: level, sysid: sysid }
        setSuperviseType(type||'XZ')
        setLevel(level)
        setCertData(res.cert||[])
        if (type === 'XZ') {
          setProvinceCode(res.data[0]?.division[0]?.code || '')
          setCityCode(res.data[0]?.division[1]?.code || '')
          setCountryCode(res.data[0]?.division[2]?.code || '')
          let levelData = {}
          if (level === '2' && res.data[0]?.division.length === 1) {
            levelData = { province: res.data[0]?.division[0]?.text }
          } else if (level === '3' && res.data[0]?.division.length === 2) {
            levelData = {
              province: res.data[0]?.division[0]?.text,
              city: res.data[0]?.division[1]?.text,
            }
          } else if (level === '4' && res.data[0]?.division.length === 3) {
            levelData = {
              province: res.data[0]?.division[0]?.text,
              city: res.data[0]?.division[1]?.text,
              county: res.data[0]?.division[2]?.text,
            }
          }
          formRef.current.setFieldsValue({ ...data, ...levelData })
        } else if (type === 'HY') {
          formRef.current.setFieldsValue({ ...data, code: res.data[0].code })
        }
        listenFormRef.current.setFieldsValue({ port:port })
      }
    })
  }
  const lisColumns = [
    {
      title: language('project.sysconf.syscert.issuer'),
      dataIndex: 'issuer',
      width: 100,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syscert.subject'),
      dataIndex: 'subject',
      width: 150,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syscert.expire'),
      dataIndex: 'expire',
      width: 150,
      ellipsis: true,
    },
    {
      title: language('project.sysconf.syscert.serial'),
      dataIndex: 'serial',
      width: 250,
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 100,
      ellipsis: true,
    }
  ]
  const superviseTypes = [
    { label: language('project.cfgmngt.ruleinfo.xz'), value: 'XZ' },
    { label: language('project.cfgmngt.ruleinfo.hy'), value: 'HY' },
  ]
  const levels = [
    { label: language('project.cfgmngt.ruleinfo.nationlevel'), value: '1' },
    { label: language('project.cfgmngt.ruleinfo.provincelevel'), value: '2' },
    { label: language('project.cfgmngt.ruleinfo.citylevel'), value: '3' },
    { label: language('project.cfgmngt.ruleinfo.countylevel'), value: '4' },
  ]
  const fetchDivisionP = () => {
    post('/cfg.php?controller=confCenterManage&action=getDivision', {
      code: '000000',
    }).then((res) => {
      if (res.success) {
        const newData = []
        res.data?.map((item) => {
          newData.push({ value: item.code, label: item.text })
        })
        setProvince(newData)
      }
    })
  }

  const fetchDivisionM = () => {
    post('/cfg.php?controller=confCenterManage&action=getDivision', {
      code: provinceCode,
    }).then((res) => {
      if (res.success) {
        const newData = []
        res.data?.map((item) => {
          newData.push({ value: item.code, label: item.text })
        })
        setCity(newData)
      }
    })
  }
  const fetchDivisionC = () => {
    post('/cfg.php?controller=confCenterManage&action=getDivision', {
      code: cityCode,
    }).then((res) => {
      if (res.success) {
        const newData = []
        res.data?.map((item) => {
          newData.push({ value: item.code, label: item.text })
        })
        setCounty(newData)
      }
    })
  }

  const saveConfig = (op) => {
    const { type, level, code, sysid } = formRef.current.getFieldsValue(true)
    const { port } = listenFormRef.current.getFieldsValue(true)
    let params = {}
    if(op==='1'){
      if (type === 'XZ') {
        let div = {}
        if (level === '2') {
          div = { division: `${provinceCode}000000000000` }
        } else if (level === '3') {
          div = { division: `${provinceCode}${cityCode}000000` }
        } else if (level === '4') {
          div = { division: `${provinceCode}${cityCode}${countryCode}` }
        }
        params = {type: type, level: level, sysid: sysid, ...div }
      } else {
        params = {type: type, code: code, sysid: sysid }
      }
    }else {
      params = {port:port}
    }
    
    post('/cfg.php?controller=confCenterManage&action=set', params).then(
      (res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
        } else {
          res.msg && message.error(res.msg)
        }
      }
    )
  }
  const updateFinish = (params) =>{
    if(params.success){
      params.msg&&message.success(params.msg)
      setUplisData(params.data)
    }else{
      params.msg&&message.error(params.msg)
    }
}

  const UploadRender = (
    <span className={styles.uploadButton}>
      <WebUploadr
      isAuto={true}
      upbutext='上传国密数字证书'
      maxSize={3000}
      upurl="/cfg.php?controller=confCenterManage&action=uploadCert"
      isShowUploadList={false}
      maxCount={1}
      onSuccess={updateFinish}
      isUpsuccess={true}
      />
    </span>
  )

  return (
    <>
      <ProCard title={language('project.cfgmngt.ruleinfo.title')} style={{marginBottom:24}}>
        <Col offset={5} style={{ marginBottom: '20px' }}>
          <Alert
            style={{
              width: '600px',
              marginLeft: document.body.clientWidth < 1920 ? '-20px' : '',
            }}
            type="info"
            showIcon
            description={
              <div>
                <div>{language('project.cfgmngt.ruleinfo.desone')}</div>
                <div>{language('project.cfgmngt.ruleinfo.destwo')}</div>
              </div>
            }
            message={language('project.cfgmngt.ruleinfo.message')}
          ></Alert>
        </Col>
        <ProForm
          formRef={formRef}
          {...formItemLayout}
          autoFocusFirstInput
          submitter={false}
          className={styles.superviseType}
          onFinish={()=>{
            saveConfig('1')
          }}
        >
          <ProFormRadio.Group
            options={superviseTypes}
            label={language('project.cfgmngt.ruleinfo.superviseTypes')}
            radioType="button"
            name="type"
            fieldProps={{
              buttonStyle: 'solid',
              defaultValue: 'XZ',
              onChange: (value) => {
                setSuperviseType(value.target.value)
              },
            }}
          />
          <ProFormSelect
            options={levels}
            hidden={!(superviseType === 'XZ')}
            name="level"
            label={language('project.cfgmngt.ruleinfo.level')}
            width="300px"
            fieldProps={{
              onChange: (value) => {
                setLevel(value)
                if (value === '1') {
                  formRef.current.resetFields(['province', 'city', 'county'])
                  setProvinceCode('')
                  setCityCode('')
                  setCountryCode('')
                } else if (value === '2') {
                  formRef.current.resetFields(['province', 'city', 'county'])
                  setProvinceCode('')
                  setCityCode('')
                  setCountryCode('')
                } else if (value === '3') {
                  formRef.current.resetFields(['province', 'city', 'county'])
                  setProvinceCode('')
                  setCityCode('')
                  setCountryCode('')
                }
              },
            }}
          />
          <ProFormText
            hidden={
              !(
                superviseType === 'XZ' &&
                (level === '2' || level === '3' || level === '4')
              )
            }
            label={language('project.cfgmngt.ruleinfo.zoning')}
            className={styles.division}
          >
            <Row gutter={10}>
              <Col>
                <ProFormSelect
                  options={province}
                  name="province"
                  placeholder={language('project.cfgmngt.ruleinfo.province')}
                  width="93px"
                  rules={[
                    {
                      required: level === '2' || level === '3' || level === '4',
                      message: language('project.cfgmngt.ruleinfo.provincetip'),
                    },
                  ]}
                  hidden={!(level === '2' || level === '3' || level === '4')}
                  fieldProps={{
                    onChange: (value) => {
                      setProvinceCode(value)
                    },
                    onDropdownVisibleChange: (open) => {
                      open && fetchDivisionP()
                    },
                  }}
                />
              </Col>
              <Col>
                <ProFormSelect
                  options={city}
                  name="city"
                  placeholder={language('project.cfgmngt.ruleinfo.city')}
                  width="93px"
                  rules={[
                    {
                      required: level === '3' || level === '4',
                      message: language('project.cfgmngt.ruleinfo.citytip'),
                    },
                  ]}
                  hidden={!(level === '3' || level === '4')}
                  fieldProps={{
                    onChange: (value) => {
                      setCityCode(value)
                    },
                    onDropdownVisibleChange: (open) => {
                      open && fetchDivisionM()
                    },
                  }}
                />
              </Col>
              <Col>
                <ProFormSelect
                  options={county}
                  name="county"
                  placeholder={language('project.cfgmngt.ruleinfo.county')}
                  width="93px"
                  rules={[
                    {
                      required: level === '4',
                      message: language('project.cfgmngt.ruleinfo.countytip'),
                    },
                  ]}
                  hidden={!(level === '4')}
                  fieldProps={{
                    onChange: (value) => {
                      setCountryCode(value)
                    },
                    onDropdownVisibleChange: (open) => {
                      open && fetchDivisionC()
                    },
                  }}
                />
              </Col>
            </Row>
          </ProFormText>
          <ProFormText
            hidden={!(superviseType === 'HY')}
            name="code"
            label={language('project.cfgmngt.ruleinfo.code')}
            width="300px"
          />
          <ProFormText
            name="sysid"
            label={language('project.cfgmngt.ruleinfo.sysid')}
            width="300px"
            rules={[
              {
                required: true,
                message: language('project.cfgmngt.ruleinfo.required'),
              },
              {
                pattern: regList.sysid.regex,
                message: regList.sysid.alertText,
              },
            ]}
          />
          <ProFormText
            name=""
            label=""
            wrapperCol={{
              offset: 6,
              span: 16,
            }}
          >
            <Button type="primary" icon={<SaveOutlined />} htmlType="submit">
              {language('project.cfgmngt.ruleinfo.saveconfig')}
            </Button>
          </ProFormText>
        </ProForm>
      </ProCard>
      <ProCard title='监听设置' >
      <ProForm
          formRef={listenFormRef}
          {...formItemLayout}
          autoFocusFirstInput
          submitter={false}
          className={styles.superviseType}
          onFinish={()=>{
            saveConfig('2')
          }}
        >
          <ProFormText label='业务监听端口' name='port' width='140px' addonAfter={UploadRender}/>
          <ProFormText label='国密数字证书'>
          <ProTable
                size="small"
                columns={lisColumns}
                tableStyle={{ width: 700 }}
                className={styles.lisTable}
                tableAlertRender={false}
                search={false}
                options={false}
                dataSource={uplisData.length>0?uplisData:certData}
                pagination={false}
                rowKey="id"
          ></ProTable>
          </ProFormText>
          <Row style={{ marginBottom: '16px' }}>
              <Col span={6}></Col>
              <Col>
                <Button
                  icon={<SaveOutlined />}
                  type="primary"
                  htmlType="submit"
                >
                  {language('project.sysconf.syscert.saveConf')}
                </Button>
              </Col>
            </Row>
        </ProForm>
      </ProCard>
    </>
  )
}

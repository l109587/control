import React, { useRef, useState, useEffect } from 'react';
import { formleftLayout, violationitem } from "@/utils/helper";
import ProForm, { ProFormSwitch, ProFormItem, ProFormText, ProFormSelect } from '@ant-design/pro-form';
import EditTable from '@/components/Module/tinyEditTable/tinyEditTable'
import { SaveOutlined,DeleteOutlined  } from '@ant-design/icons';
import { post, postAsync } from '@/services/https';
import { Button, Row, Col, message, Popconfirm, Spin,Tooltip } from 'antd';
import { ProCard, EditableProTable } from '@ant-design/pro-components';
import { language } from '@/utils/language';
import { regList, regPortList, regIpList } from '@/utils/regExp';
import './outwhite.less'

export default () => {

  const formRef = useRef();
  const [dataSource, setDataSource] = useState([]);
  const [isSave, setIsSave] = useState(true) // 未保存当前数据不可下发
  const [editableKeys, setEditableRowKeys] = useState(() => dataSource.map((item) => item.id));//每行编辑的id

  useEffect(() => {
    getData();
  }, [])

  const fromcolumns = [
    {
      title: language('project.devname'),
      dataIndex: 'name',
      align: 'center',
      width: '35%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: language('project.mandatory')
          },
          {
            pattern: regList.name.regex,
            message: regList.name.alertText,
          },
          { validator: (rule, value) => {
              if(!isSave) {
                return Promise.reject(language('project.pleasesavedata'));
              } else {
                return Promise.resolve();
              }
            }
          },
        ],
      },
    },
    {
      title: language('monconf.outwhite.ipaddr'),
      dataIndex: 'ip',
      align: 'center',
      width: '55%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: language('project.mandatory')
          },
          {
            pattern: regIpList.ipv4.regex,
            message: regIpList.ipv4.alertText,
          },
          { validator: (rule, value) => {
              if(!isSave) {
                return Promise.reject(language('project.pleasesavedata'));
              } else {
                return Promise.resolve();
              }
            }
          },
        ],
      },
    },
    {
      title: language('project.mconfig.operate'),
      valueType: 'option',
      width: '25%',
      align: 'center',
      render: (text, record, _, action) => [
        <Popconfirm okText={language('project.yes')} cancelText={language('project.no')} title={language('project.delconfirm')} onConfirm={() => {
          setDataSource(dataSource.filter((item) => item.id !== record.id));
        }}>
          <Tooltip placement="top" title={language('project.del')}>
            <a key="delete" style={{ color:'red' }}>
              <DeleteOutlined />
            </a>
          </Tooltip>
        </Popconfirm>
      ]
    }
  ]

  const getData = () => {
    post('/cfg.php?controller=whiteConf&action=showConf').then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      let checked = false;
      if(res.state == 'Y') {
        checked = true;
      }
      res.state = checked;
      setTimeout(() => {
        formRef.current.setFieldsValue(res);
      }, 1000);
      setDataSource(res.iprang)
    }).catch(() => {
      console.log('mistake')
    })
  }


  const setOutwhite = () => {
    let obj = formRef.current.getFieldsValue(['state', 'iprang'])
    let data = {};
    data.state = obj.state === true ? 'Y' : 'N';
    data.iprang = dataSource;
    post('/cfg.php?controller=whiteConf&action=setConf', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
    })
  }

  return (
    <ProCard title={language('monconf.outwhite.whiiteConfig')}>
      <ProForm className='outwhiteForm' {...formleftLayout} formRef={formRef} submitter={{
        render: () => {
          return [<Row>
            <Col span={14} offset={6}>
              <Button type='primary' key='subment'
                style={{ marginTop: "5px", borderRadius: 5, }}
                onClick={() => {
                  if (!isSave) {
                    message.error(language('project.pleasesavedata'))
                  } else {
                    setOutwhite()
                  }
                }}><SaveOutlined />{language('project.set')}
              </Button>
            </Col>
          </Row>]
        }
      }}
        submitTimeout={2000} onFinish={async (values) => {
        }}>
        <div className='stateDiv'>
          <ProFormSwitch name="state" label={language('monconf.outwhite.state')} checkedChildren={language('project.open')} unCheckedChildren={language('project.close')} addonAfter={<span className='msgtext'>{language('monconf.outwhite.statetext')}</span>} />
        </div>
        <ProFormText label={language('monconf.outwhite.iprang')} name='iprang' style={{ width: '420px' }}>
          <EditTable columns={fromcolumns}  tableHeight={170} tableWidth={420} dataSource={dataSource} setDataSource={setDataSource}  deleteButShow={false} setIsSave={setIsSave}/>
        </ProFormText>
      </ProForm>
    </ProCard>
  )

}

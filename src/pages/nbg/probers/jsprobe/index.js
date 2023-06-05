import React, { useRef, useState, useEffect } from 'react';
import { SaveOutlined, PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import { ProTable, EditableProTable, ProCard, ProFormField } from '@ant-design/pro-components';
import ProForm, { ProFormSelect, ProFormDigit, ProFormText, ProFormCheckbox } from '@ant-design/pro-form';
import { formleftLayout, violationitem, illegalformLayout, modalFormLayoutTypeThree } from "@/utils/helper";
import { Button, Row, Col, Form, Popconfirm, Spin, Space, Tag, message, Alert } from 'antd';
import { post, postAsync } from '@/services/https';
import { language } from '@/utils/language';
import store from 'store';
import '@/utils/index.less';
import { fetchAuth, valiCompare } from '@/utils/common';
import './index.less'
import { regIpList, regList, regUrlList } from '@/utils/regExp'
import { useSelector } from 'umi'

const Configuration = () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 423
  const writable = fetchAuth()
  const formRef = useRef();
  const actionRef = useRef();
  let columnvalue = 'jsprobeTable'
  const [dataSource, setDataSource] = useState([]);
  const [initialValue, setInitialValue] = useState();
  const [totalPage, setTotalPage] = useState(0);//总条数
  const [nowPage, setNowPage] = useState(1);//当前页码
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [tabledata, setTabledata] = useState([]);
  const [loading, setLoading] = useState(true);//加载
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [fileurl, setFileurl] = useState('');
  const [form] = Form.useForm();
  const [oldCfgName, setOldCfgName] = useState([]);
  const [selectdata, setSelectdata] = useState([]);
  const startVal = 1;
  const limitVal = store.get('pageSize') ? store.get('pageSize') : 10;//默认每页条数
  const [columnsHide, setColumnsHide] = useState(store.get('jsprobecolumnvalue') ? store.get('jsprobecolumnvalue') : {
    id: { show: false },
    uid: { show: false }
  });//设置默认列
  let concealColumnList = {
    id: { show: false },
    uid: { show: false }
  }
  const [densitySize, setDensitySize] = useState('middle')

  useEffect(() => {
    getselect();
    getTabledata();
    showTableConf()
  }, [])

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
    },
    {
      title: 'UID',
      dataIndex: 'uid',
      width: '10%',
    },
    {
      title: language('project.mconfig.ectstu'),
      dataIndex: 'status',
      width: '5%',
      align: 'center',
      ellipsis: true,
      readonly: true,
      renderFormItem: (all, { isEditable }) => {
        let record = all.entry;
        let text = '';
        let color = 'success';
        if(record.status == 'normal') {
          color = 'success';
          text = language('project.temporary.srcprobes.normal')
        } else {
          color = 'error';
          text = language('project.temporary.srcprobes.abnormal')
        }
        return (
          <Space>
            <Tag style={{ marginRight: 0 }} color={color} key={record.type}>
              {text}
            </Tag>
          </Space>
        )
      },
      render: (text, record, index) => {
        let color = 'success';
        if(record.status == 'normal') {
          color = 'success';
          text = language('project.temporary.srcprobes.normal')
        } else {
          color = 'error';
          text = language('project.temporary.srcprobes.abnormal')
        }
        return (
          <Space>
            <Tag style={{ marginRight: 0 }} color={color} key={record.type}>
              {text}
            </Tag>
          </Space>
        )
      }
    },
    {

      title: language('project.temporary.srcprobes.srvName'),
      dataIndex: 'srvName',
      width: '12%',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: language('project.mandatory'),
          },
          {
            pattern: regList.chWordNum.regex,
            message: regList.chWordNum.alertText,
          },
          {
            max: 64
          },
        ],
      },
    },
    {

      title: language('project.temporary.srcprobes.url'),
      dataIndex: 'url',
      width: '14%',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: language('project.mandatory'),
          },
          {
            pattern: regUrlList.httptUrl.regex,
            message: regUrlList.httptUrl.alertText,
          },
          {
            max: 255,
          },
        ],
      },
    },
    {

      title: language('project.temporary.srcprobes.srvRegion'),
      dataIndex: 'srvRegion',
      width: '15%',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: language('project.mandatory'),
          },
          {
            pattern: regList.chWordNum.regex,
            message: regList.chWordNum.alertText,
          },
          {
            max: 64
          }
        ],
      },
    },
    {

      title: language('project.temporary.srcprobes.lastMonitorTM'),
      dataIndex: 'lastMonitorTM',
      width: '15%',
      ellipsis: true,
      readonly: true,
    },
    {

      title: language('project.temporary.srcprobes.lastDeployTM'),
      dataIndex: 'lastDeployTM',
      width: '15%',
      ellipsis: true,
      readonly: true,
    },
    {
      title: language('project.operate'),
      valueType: 'option',
      width: '10%',
      align: 'center',
      hideInTable: !writable,
      render: (text, record, _, action) => {
        const renderRemoveUser = (text) => (<Popconfirm onConfirm={() => { delList(record, text) }} key="popconfirm" title={language( 'project.delconfirm')}
          okText={language('project.yes')} cancelText={language('project.no')}>
          <a>{text}</a>
        </Popconfirm>);
        let node = renderRemoveUser(language('project.del'));
        return [
          <a key="editable" onClick={() => {
            var _a;
            (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id);
          }}>
            {language('project.deit')}
          </a>,
          node
        ]
      }
    },
  ];



  /* 表单数据 */
  const getFormdata = (outlineVal) => {
    post('/cfg.php?controller=probeManage&action=showScriptCfg').then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      if (res.state == 'N') {
        delete res.state;
      }
      let obj = res;
      if (!res.outlineCfgName && outlineVal.length > 0) {
        obj.outlineCfgName = outlineVal[0].value;
      } else if (res.outlineCfgName) {
        obj.outlineCfgName = res.outlineCfgName;
      } else {
        obj.outlineCfgName = '';
      }
      formRef.current.setFieldsValue(obj)
    }).catch(() => {
      console.log('mistake')
    })
  }


  /* 表格数据 start  数据起始值   limit 每页条数  */
  const getTabledata = (pagestart = '', pagelimit = '',) => {
    let page = pagestart != '' ? pagestart : startVal;
    let data = {};
    data.limit = pagelimit != '' ? pagelimit : limitVal;
    data.start = (page - 1) * data.limit;
    post('/cfg.php?controller=probeManage&action=showScriptDeploy', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      setLoading(false);
      if(res.data) {
        setTabledata(res.data);
        setTotalPage(res.total);
      }
    }).catch(() => {
      console.log('mistake')
    })
  }


  /* 下拉数据 */
  const getselect = () => {
    post('/cfg.php?controller=monitorManage&action=getOutlineAllCfg').then((res) => {
      setSelectdata(res.data)
      getFormdata(res.data);
    }).catch(() => {
      console.log('mistake')
    })
  }


  /* 脚本配置设置 */
  const setForm = () => {
    let obj = formRef.current.getFieldsValue(['outlineCfgName', 'monitorItems', 'state', 'period']);
    setOldCfgName(obj.outlineCfgName)/* 修改前的外联配置 */
    let outlineCfgName = '';/* 修改后的外联配置*/
    selectdata.map((item) => {
      if (item.value == obj.outlineCfgName) {
        outlineCfgName = item.value
      }
    })
    let data = {};
    data.oldCfgName = oldCfgName.length === 0 ? outlineCfgName : oldCfgName;
    data.outlineCfgName = outlineCfgName.length === 0 ? oldCfgName: outlineCfgName;
    data.monitorItems = obj.monitorItems;
    data.state = obj.state == false || !obj.state ? 'N' : 'Y';
    data.period = obj.period;
    post('/cfg.php?controller=probeManage&action=setScriptCfg', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
    }).catch(() => {
      console.log('mistake')
    })
  }





  /* 下载脚本探针 */
  const downLaod = () => {
    post('/cfg.php?controller=probeManage&action=downloadScript', { responseType: 'blob' }).then((res) => {
        let link = document.createElement('a');
        let href = window.URL.createObjectURL(new Blob([res]));
        link.href = href;
        link.download = 'outline.js';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(href);
    }).catch(() => {
        console.log('mistake')
    })
}




  /* 删除 */
  const delList = (record) => {
    let data = {};
    data.id = record.id;
    data.uid = record.uid;
    post('/cfg.php?controller=probeManage&action=delScriptDeploy', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      getTabledata();
    }).catch(() => {
      console.log('mistake')
    })
  }

  /* 添加/编辑 */
  const save = (record) => {
    let data = {}
    data.op = record.op == 'add' ? record.op : 'set';
    data.id = record.op != 'add' ? record.id : ' ';
    data.uid = record.op != 'add' ? record.uid : ' ';
    data.srvName = record.srvName
    data.url = record.url
    data.srvRegion = record.srvRegion
    post('/cfg.php?controller=probeManage&action=setScriptDeploy', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false
      }
      message.success(res.msg)
      getTabledata();
    }).catch(() => {
      console.log('mistake')
    })
  }

  /* 回显表格密度列设置 */
  const showTableConf = async () => {
    let data = []
    data.module = columnvalue
    let res
    res = await postAsync(
      '/cfg.php?controller=confTableHead&action=showTableHead',
      data
    )
    if (res.density) {
      setDensitySize(res.density)
    }
    if (!res.success || res.data.length < 1) {
      columns?.map((item) => {
        if (!concealColumnList[item.dataIndex] && item.hideInTable != true) {
          let showCon = {}
          showCon.show = true;
          concealColumnList[item.dataIndex] = showCon;
        }
      })
      let data = []
      data.module = columnvalue
      data.value = JSON.stringify(concealColumnList)
      res = await postAsync(
        '/cfg.php?controller=confTableHead&action=setTableHead',
        data
      )
      if (res.success) {
        setColumnsHide(concealColumnList)
      }
    } else {
      setColumnsHide(res.data ? res.data : {})
    }
  }

  /* 表格列设置配置 */
  const columnsTableChange = (value) => {
    let data = [];
    data.module = columnvalue;
    data.value = JSON.stringify(value);
    post('/cfg.php?controller=confTableHead&action=setTableHead', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setColumnsHide(value);
    }).catch(() => {
      console.log('mistake')
    })
  }

  /* 表格密度设置 */
  const sizeTableChange = (sizeType) => {
    let data = [];
    data.module = columnvalue;
    data.density = sizeType;
    post('/cfg.php?controller=confTableHead&action=setTableHead', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setDensitySize(sizeType);
    }).catch(() => {
      setDensitySize(sizeType);
      console.log('mistake')
    })
  }

  const hourlaver = (
    <div className='timeAfter'>{language('project.temporary.srcprobes.afterhover')}</div>
  );

  return (
    <div className='jsprobeContent'>
      {loading == true ? (
        <div className='jsprobespindiv' style={{ height: window.innerHeight, width: '100%' }}>
          <Spin style={{ position: "absolute", zIndex: '100', left: '50%', top: '40%', fontSize: '24px' }} />
        </div>
      ) : ('')}
      <ProCard ghost direction='column' gutter={[13, 13]}>
        <ProCard title={language('project.temporary.srcprobes.scrprotitle')}
          style={{ height: '345px' }}
        > <ProCard ghost colSpan="50%">
            <ProForm {...illegalformLayout}
              initialValue={initialValue}
              className='scrprobesForm'
              formRef={formRef}
              submitter={{
                render: (props, doms) => {
                  return [<Row>
                    <Col span={24} offset={9}>
                      <Button type='primary' key='set' disabled={!writable}
                        style={{ paddingLeft: 0, paddingRight: 0, borderRadius: 5, width: "90px", height: 34 }}
                        onClick={() => {
                          // setForm();
                          props.submit()
                        }}>
                        <SaveOutlined />{language('project.set')}
                      </Button>
                      <Button type='button' key='subment' disabled={!writable}
                        style={!writable ? { marginLeft: 20, borderRadius: 5, height: 36} : {
                          backgroundColor: '#12C189', height: 36,
                          marginLeft: 20, borderRadius: 5, color: '#FFFFFF',
                        }}
                        onClick={() => {
                          // downurl();
                          downLaod();
                        }}
                      >
                        <DownloadOutlined />{language('project.temporary.srcprobes.download')}
                      </Button>
                    </Col>
                  </Row>
                  ]
                }
              }}
              autoFocusFirstInput
              submitTimeout={2000} onFinish={async (values) => {
                setForm();
                return true;
              }}>

              <Col offset={4}>
                <ProFormSelect className='radiobutton' {...violationitem} name="outlineCfgName" label={language('project.monitor.illegal.outlinecfgname')}
                  options={selectdata} width='230px'
                />
              </Col>
              <Col offset={4}>
                <div className='jspromonpaent'>
                  <ProFormCheckbox.Group {...violationitem} name="monitorItems"
                    label={language('project.temporary.srcprobes.monitorItems')}
                    options={[{ label: language('monitor.illegal.inExtranet'), value: 'ckInOut' }, { label: language('monitor.mapping.ckWiw'), value: 'ckWiw' }, { label: language('monitor.illegal.documentLeak'), value: 'ckWebOut' }]}
                  />
                </div>
              </Col>
              <Col offset={4}>
                <div className='deploybox'>
                  <ProFormCheckbox {...violationitem} name="state"
                    label={language('project.temporary.srcprobes.state')} >{language( 'project.temporary.srcprobes.statetext')}</ProFormCheckbox>
                </div>
              </Col>
              <Col className='periodDiv' offset={9} style={{ marginTop: '-8px' }}>
                <ProFormDigit 
                  name="period"
                  fieldProps={{ precision: 0, controls: false, }} 
                  addonAfter={hourlaver} 
                  width='45px'
                  {...modalFormLayoutTypeThree}
                  rules={[
                    {
                      validator: (rule, value, callback) => {
                        valiCompare(value, callback, 1, 24)
                      }
                    }
                  ]} 
                />
              </Col>

              <Col offset={9}>
                <span className='textual'>{language('project.temporary.srcprobes.textual')}</span>
              </Col >
            </ProForm>
          </ProCard>
          <ProCard colSpan="40%">
            <Alert className='probealert' message={language('probers.jsprobe.alertmes')} description={language('probers.jsprobe.description')} type="info" showIcon />
          </ProCard>

        </ProCard>


        {/*   */}
        <ProCard ghost style={{ backgroundColor: 'white' }} >
          <EditableProTable scroll={{ y: store.get('layout') === 'top'?325:300 }}
            className='outedtable'
            rowKey="id"
            headerTitle={language('project.temporary.srcprobes.outedtabletitle')}
            bordered={true}
            // loading={loading}
            toolBarRender={() => [
              !writable ? false : <Button type="primary" style={{ borderRadius: 5 }} onClick={() => {
                var _a, _b;
                (_b = (_a = actionRef.current) === null || _a === void 0 ? void 0 : _a.addEditRecord) === null || _b === void 0 ? void 0 : _b.call(_a, {
                  id: (Math.random() * 1000000).toFixed(0),
                  op: 'add',
                });
              }} icon={<PlusOutlined />}>
                {language('project.temporary.outreach.setnew')}
              </Button>
            ]}
            size={densitySize}
            options={{
              reload: function () {
                setLoading(true);
                getTabledata(1)
                getFormdata()
              }
            }}
            onSizeChange={(e) => {
              sizeTableChange(e);
            }}
            pagination={{
              showSizeChanger: true,
              pageSize: limitVal,
              current: nowPage,
              total: totalPage,
              showTotal: total => language('project.page', {total:total}),
              onChange: (page, pageSize) => {
                clearTimeout(window.timer);
                window.timer = setTimeout(function () {
                  setNowPage(page);
                  store.set('pageSize', pageSize)
                  getTabledata(page, pageSize);
                }, 100)
              },
            }}
            columnsState={{
              value: columnsHide,
              persistenceType: 'sessionStorage',
              onChange: (value) => {
                // setColumnsHide(value);
                columnsTableChange(value)
                store.set('jsprobecolumnvalue', value)
              },
            }}
            actionRef={actionRef}
            // 关闭默认的新建按钮
            recordCreatorProps={false}
            columns={columns}
            value={tabledata}
            onChange={setTabledata}
            editable={{
              form,
              editableKeys,
              onSave: async (rowKey, data, row) => {
                save(data);
              },
              onChange: setEditableRowKeys,
              actionRender: (row, config, dom) => [dom.save, dom.cancel],
            }}
          />
        </ProCard>
      </ProCard>
    </div>
  )
}

export default Configuration

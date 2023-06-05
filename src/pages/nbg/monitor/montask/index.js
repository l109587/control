import React, { useRef, useState, useEffect } from 'react'
import {
  Button,
  Space,
  Tag,
  Input,
  message,
  Form,
  Switch,
  Popconfirm,
  Statistic,
  Radio,
  Spin,
  Progress,
} from 'antd'
import { get, post, postAsync, Delete } from '@/services/https'
import { PlusOutlined } from '@ant-design/icons'
import { ProTable, EditableProTable, ProCard } from '@ant-design/pro-components'
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormCheckbox,
  ProFormTextArea,
} from '@ant-design/pro-form'
import { modalFormLayout, violationitem, formSelect } from '@/utils/helper'
import { language } from '@/utils/language'
import '@/utils/index.less'
import './index.less'
import store from 'store'
import { regIpList } from '@/utils/regExp'
import { CastScreen } from '@icon-park/react'
import { fetchAuth } from '@/utils/common'
import { useSelector } from 'umi'
import { regList } from '../../../../utils/regExp'
const { Divider } = ProCard
const { Search } = Input

export default () => {
  const writable = fetchAuth()
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 220
  const renderRemoveUser = (text, record) => (
    <Popconfirm
      onConfirm={() => {
        delList(record, text)
      }}
      key="popconfirm"
      title={language('project.delconfirm')}
      okButtonProps={{
        loading: confirmLoading,
      }}
      okText={language('project.yes')}
      cancelText={language('project.no')}
    >
      <Button size='small' type='link'>{text}</Button>
    </Popconfirm>
  )
  const stopRemoveUser = (text, record) => (
    <Popconfirm
      onConfirm={() => {
        stop(record, text)
      }}
      key="popconfirm"
      title={language('project.monitor.montask.stopconfirm')}
      okButtonProps={{
        loading: confirmLoading,
      }}
      onCancel={() => {
        setVisible(false)
      }}
      visible={visible}
      okText={language('project.yes')}
      cancelText={language('project.no')}
    >
      <a>{text}</a>
    </Popconfirm>
  )
  const columns = [
    {
      title: language('project.mconfig.cfnid'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
    },
    {
      title: language('project.temporary.montask.status'),
      dataIndex: 'status',
      align: 'center',
      width: 100,
      render: (text, record, index) => {
        let checked = true
        if (record.status == 'N') {
          checked = false
        }
        if (!record.type) {
          return (
            <Switch
              checkedChildren={language('project.open')}
              unCheckedChildren={language('project.close')}
              checked={checked}
              onChange={(checked) => {
                SwitchBtn(record, checked)
              }}
            />
          )
        } else {
          return <></>
        }
      },
    },

    {
      title: language('project.temporary.montask.taskname'),
      dataIndex: 'name',
      width: 160,
      ellipsis: true,
      render: (text, record, index) => {
        if (record.type) {
          let color = 'blue'
          if (record.type == 'outline') {
            text = language('project.monitor.montask.outlinetext')
            return (
              <Space>
                <Tag color={color} key={record.type}>
                  {text}
                </Tag>
              </Space>
            )
          } else if (record.type == 'vioSrv') {
            text = language('project.monitor.montask.vioSrvtext')
            return (
              <Space>
                <Tag color={color} key={record.type}>
                  {text}
                </Tag>
              </Space>
            )
          } else {
            text = language('project.monitor.montask.viodevtext')
            return (
              <Space>
                <Tag color={color} key={record.type}>
                  {text}
                </Tag>
              </Space>
            )
          }
        } else {
          return record.name
        }
      },
    },
    {
      title: language('project.temporary.montask.range'),
      dataIndex: 'iprange',
      align: 'left',
      ellipsis: true,
      width: 240,
    },
    {
      title: language('project.temporary.montask.progress'),
      dataIndex: 'schedule',
      ellipsis: true,
      valueType: (record) => (record.type ? { type: 'progress' } : 'select'),
      // valueType: 'select',
      width: 280,
      valueEnum: (record) => {
        return record.type
          ? ''
          : {
              1: {
                text: language('project.monitor.montask.doing'),
                status: 'Processing',
              },
              2: {
                text: language('project.monitor.montask.waiting'),
                status: 'Warning',
              },
              3: {
                text: language('project.monitor.montask.nostart'),
                status: 'Default',
              },
            }
      },
    },
    {
      title: language('project.temporary.montask.exenum'),
      dataIndex: 'completed',
      ellipsis: true,
      width: 100,
    },
    {
      title: language('project.temporary.montask.moncontent'),
      dataIndex: 'content',
      ellipsis: true,
      width: 120,
      render: (text, record, _, action) => {
        if (record.children) {
          return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {record.children.map((item) => {
                let size = 18
                let color = ''
                if (item.state == 'Y') {
                  color = '#12C189'
                } else {
                  color = '#8E8D8D'
                }
                if (item.type == 'outline') {
                  return (
                    <CastScreen
                      style={{ color: color, marginTop: 2, fontSize: size }}
                    />
                  )
                } else if (item.type == 'vioSrv') {
                  return (
                    <i
                      style={{
                        color: color,
                        marginLeft: '10px',
                        fontSize: size,
                      }}
                      class="fa fa-server"
                    />
                  )
                } else if (item.type == 'vioDev') {
                  return (
                    <i
                      class="ri-router-fill"
                      style={{
                        color: color,
                        marginLeft: '10px',
                        marginTop: -3,
                        fontSize: size,
                      }}
                    />
                  )
                } else {
                  return (
                    <>
                      <i
                        class="ri-router-fill"
                        style={{ color: color, marginTop: -3, fontSize: size }}
                      />
                      <i
                        style={{
                          color: color,
                          marginLeft: '10px',
                          fontSize: size,
                        }}
                        class="fa fa-server"
                      />
                    </>
                  )
                }
              })}
            </div>
          )
        } else {
          let size = 18
          let color = ''
          if (record.state == 'Y') {
            color = '#12C189'
          } else {
            color = '#8E8D8D'
          }
          if (record.type == 'outline') {
            return <CastScreen style={{ color: color, fontSize: size }} />
          } else if (record.type == 'vioSrv') {
            return (
              <i
                style={{ color: color, fontSize: size }}
                class="fa fa-server"
              />
            )
          } else if (record.type == 'vioDev') {
            return (
              <i
                class="ri-router-fill"
                style={{ color: color, marginTop: -3, fontSize: size }}
              />
            )
          } else {
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <CastScreen
                  style={{ color: color, marginTop: 2, fontSize: size }}
                />
                <i
                  style={{ color: color, marginLeft: '10px', fontSize: size }}
                  class="fa fa-server"
                />
                <i
                  class="ri-router-fill"
                  style={{
                    color: color,
                    marginLeft: '10px',
                    marginTop: -3,
                    fontSize: size,
                  }}
                />
              </div>
            )
          }
        }
      },
    },
    {
      disable: true,
      title: language('project.mconfig.operate'),
      align: 'center',
      valueType: 'option',
      fixed: 'right',
      width: 120,
      hideInTable: !writable,
      render: (text, record, _, action) => [
        record.type ? (
          <>
            {record.kind === 'N' || record.state === 'N' ? (
              <Button type='link' size='small'
                style={{
                  color: 'rgba(0,0,0,.25)',
                  cursor: 'not-allowed',
                  disabled: true,
                }}
              >
                {language('project.temporary.montask.stop')}
              </Button>
            ) : (
              <Popconfirm
                key="popconfirm"
                style={{ position: 'absolute', top: '-50px', left: '20px' }}
                okButtonProps={{
                  loading: confirmLoading,
                }}
                okText={language('project.yes')}
                cancelText={language('project.no')}
                title={language('project.monitor.montask.stopconfirm')}
                onConfirm={() => {
                  stop(record)
                }}
              >
                <Button type='link' size='small'
                  onClick={() => {
                    console.log(text)
                  }}
                >
                  {language('project.temporary.montask.stop')}
                </Button>
              </Popconfirm>
            )}
          </>
        ) : (
          <>
            <Button type='link' size='small'
              key="editable"
              onClick={() => {
                setMontask(record, 'mod')
              }}
            >
              {language('project.deit')}
            </Button>
            {renderRemoveUser(language('project.del'), record)}
          </>
        ),
      ],
    },
  ]

  const formRef = useRef()
  const [modalStatus, setModalStatus] = useState(false) //model 添加弹框状态
  const [dataList, setList] = useState([]) //model 添加弹框状态
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) //选中id数组
  const [record, setRecord] = useState([]) //选中id数组
  const [delStatus, setipDelStatus] = useState(true) //选中id数组
  const [op, setop] = useState('add') //选中id数组
  const [editableKeys, setEditableRowKeys] = useState() //每行编辑的id
  const [timeShow, setTimeShow] = useState(false) //有效时间隐藏显示
  const [switchCheck, setSwitchCheck] = useState()
  const [queryVal, setQueryVal] = useState('') //搜索值
  const [schedule, setSchedule] = useState(0)
  const [totalPage, setTotalPage] = useState(0) //总条数
  const [nowPage, setNowPage] = useState(1) //当前页码
  const [carddata, setCarddata] = useState(1) //当前页码
  const [loading, setLoading] = useState(true) //加载
  const [visible, setVisible] = useState(false)
  const [taskstate, setTaskstate] = useState(false)
  const [staskstate, setStaskstate] = useState(false)
  const startVal = 1
  const limitVal = store.get('pageSize') ? store.get('pageSize') : 10 //默认每页条数
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [densitySize, setDensitySize] = useState('middle')
  let concealColumns = { id: { show: false } }
  let concealColumnList = concealColumns
  const [columnsHide, setColumnsHide] = useState(
    store.get('taskcolumnvalue')
      ? store.get('taskcolumnvalue')
      : {
          id: { show: false },
        }
  ) //设置默认列
  //列表数据
  let columnvalue = 'montaskTable'
  const actionRef = useRef()

  useEffect(() => {
    getList()
    showTableConf()
    // getcarddata()
  }, [])

  //start  数据起始值   limit 每页条数
  const getList = (
    pagestart = '',
    pagelimit = '',
    value = '',
    scheduleVal = ''
  ) => {
    let page = pagestart != '' ? pagestart : startVal
    let data = {}
    data.queryVal = value != '' ? value : queryVal
    data.limit = pagelimit != '' ? pagelimit : limitVal
    data.start = (page - 1) * data.limit
    data.schedule = scheduleVal != '' ? scheduleVal : schedule
    post('/cfg.php?controller=assetMapping&action=showMonitorTask', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        res.data.forEach((item, index) => {
          if (item.children.length < 1) {
            res.data[index].children = undefined
          }
        })
        setLoading(false)
        setTotalPage(res.total)
        res.data.forEach((item) => {
          if (item.children) {
            item.children.forEach((children) => {
              children.kind = item.status
            })
          }
        })
        console.log(res.data, '11111')

        setList([...res.data])
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const getcarddata = () => {
    let data = {}
    post('/cfg.php?controller=assetMapping&action=showMonitorSituation', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        setCarddata(res)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //搜索
  const handsearch = (values) => {
    setQueryVal(values)
    getList(startVal, limitVal, values)
  }
  //判断是否弹出添加model
  const getModal = (status, op) => {
    setop(op)
    if (status == 1) {
      setModalStatus(true)
    } else {
      formRef.current.resetFields()
      setModalStatus(false)
    }
  }

  //点击某行触发事件
  const selectRow = (record) => {
    let key = selectedRowKeys.indexOf(record.id)
    if (key == -1) {
      selectedRowKeys.push(record.id)
    } else {
      selectedRowKeys.splice(key, 1)
    }
    // setRecord(record)//选中行重新赋值
    setSelectedRowKeys([...selectedRowKeys])
    let deletestatus = true
    if (selectedRowKeys != false) {
      deletestatus = false
    }
    setipDelStatus(deletestatus) //添加删除框状态
  }

  //选中触发
  const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    // setRecord(record)//选中行重新赋值
    setSelectedRowKeys(selectedRowKeys)
    let deletestatus = true
    if (selectedRowKeys != false) {
      deletestatus = false
    }
    setipDelStatus(deletestatus) //添加删除框状态
  }

  //删除数据
  const delList = (record) => {
    let data = {}
    data.id = record.id
    data.name = record.name
    post('/cfg.php?controller=assetMapping&action=delMonitorTask', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        selectedRowKeys.forEach((i) => {
          dataList.forEach((each, index) => {
            if (each.id == i) {
              dataList.splice(index, 1)
            }
          })
        })
        var list = dataList
        setSelectedRowKeys([]) //清空选中数据
        setipDelStatus(true) //添加删除框状态
        setConfirmLoading(false)
        setList([...list])
        getList()
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  /** 停止接口 */
  const stop = (record) => {
    let data = {}
    data.id = record.pid
    data.name = record.pName
    data.taskType = record.type
    post('/cfg.php?controller=assetMapping&action=stopMonitorTask', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          setVisible(false)
          return false
        }
        message.success(res.msg)
        setVisible(false)
        getList()
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  /* 启用禁用 */
  const SwitchBtn = (record, checked) => {
    let data = {}
    data.id = record.id
    let status = 'N'
    if (checked) {
      status = 'Y'
    }
    data.name = record.name
    // data.status = checked ? 'Y' : 'N';
    data.status = status
    post('/cfg.php?controller=assetMapping&action=setMonitorTaskStatus', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        setTaskstate(checked)
        var list = dataList
        setList([...list])
        getList()
        message.success(res.msg)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //编辑
  const setMontask = (obj, op) => {
    console.log(obj)
    // if(obj.status == 'Y') {
    //     setSwitchCheck('checked');
    // } else {
    //     setSwitchCheck('');
    // }
    if (obj.status == 'Y' || obj.status == true) {
      setSwitchCheck('checked')
    } else {
      setSwitchCheck('')
    }
    if (obj.children !== undefined) {
      obj.kind = []
      obj.children.map((item) => {
        if (item.state == 'Y') {
          obj.kind.push(item.type)
        }
      })
    } else {
      obj.kind = []
    }
    let initialValues = obj
    getModal(1, op)
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues)
    }, 100)
  }

  //添加修改接口
  const save = (info) => {
    let status = 'N'
    if (info.status == 'Y' || info.status == true) {
      status = 'Y'
    }
    let data = {}
    data.op = op
    data.id = info.id
    data.status = status
    data.name = info.name
    data.iprange = info.iprange
    data.type = info.kind
    post('/cfg.php?controller=assetMapping&action=setMonitorTask', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          getModal(2)
          getList()
          return false
        }
        message.success(res.msg)
        getList()
        getModal(2)
      })
      .catch(() => {
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
      data.module =  
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

  return (
    <ProCard direction="column" ghost gutter={[13, 13]}>
      {/* <ProCard>

                {loading == true ? (
                    <div className='Spin_div'>
                        <Spin
                            spinning={loading}
                            style={{ position: "absolute", zIndex: '100', left: '50%', top: '45%', fontSize: '24px' }}
                        />
                    </div>
                ) : (<ProCard.Group cardbordered='false'>
                    <ProCard style={{ textAlign: 'center' }}>
                        <Statistic className='taskinfomation' title={trans({ id: 'project.monitor.montask.doingnum' })} value={carddata.totalTasking ? carddata.totalTasking + "个任务" : ''} />
                    </ProCard>
                    <Divider type='vertical' />
                    <ProCard style={{ textAlign: 'center' }} >
                        <Statistic className='taskinfomation' title={trans({ id: 'project.monitor.montask.dotime' })} value={carddata.avgProcessed ? carddata.avgProcessed + "分钟" : ''} />
                    </ProCard>
                    <Divider type='vertical' />
                    <ProCard style={{ textAlign: 'center' }}>
                        <Statistic className='taskinfomation' title={trans({ id: 'project.monitor.montask.finishnum' })} value={carddata.taskCompleted ? carddata.taskCompleted + "个任务" : ''} />
                    </ProCard>
                </ProCard.Group>)}
            </ProCard> */}
      <ProCard ghost>
        <ProTable
          className="montakTable"
          scroll={{ y: clientHeight + 14 }}
          size={densitySize}
          columnEmptyText={false}
          //边框
          // cardBordered={true}
          // bordered={true}
          rowkey="id"
          loading={loading}
          //单选框选中变化
          rowSelection={{
            selectedRowKeys,
            onChange: onSelectedRowKeysChange,
            getCheckboxProps: (record) => ({
              disabled: record.from === 'remote',
              // name: record.name,
            }),
          }}
          //设置选中提示消失
          tableAlertRender={false}
          columns={columns}
          actionRef={actionRef}
          //页面数据信息
          dataSource={dataList}
          editable={{
            type: 'multiple',
          }}
          columnsState={{
            value: columnsHide,
            persistenceType: 'sessionStorage',
            onChange: (value) => {
              store.set('taskcolumnvalue', value)
              columnsTableChange(value)
            },
          }}
          onSizeChange={(e) => {
            sizeTableChange(e);
          }}
          rowKey="id"
          //头部搜索框关闭
          search={false}
          form={{
            // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
            syncToUrl: (values, type) => {
              if (type === 'get') {
                return Object.assign(Object.assign({}, values), {
                  created_at: [values.startTime, values.endTime],
                })
              }
              return values
            },
          }}
          pagination={{
            showSizeChanger: true,
            pageSize: limitVal,
            current: nowPage,
            total: totalPage,
            showTotal: (total) => language('project.page', { total: total }),
            onChange: (page, pageSize) => {
              clearTimeout(window.timer)
              window.timer = setTimeout(function () {
                setNowPage(page)
                store.set('pageSize', pageSize)
                getList(page, pageSize)
              }, 100)
            },
          }}
          options={{
            reload: function () {
              setLoading(true)
              getList(1)
              // getcarddata()
            },
          }}
          dateFormatter="string"
          headerTitle={
            <>
              <Search
                placeholder={language('monitor.montask.searchText')}
                style={{ width: 200 }}
                allowClear
                onSearch={(queryVal) => {
                  setLoading(true)
                  setNowPage(1)
                  // setEditableRowKeys([Date.now()])
                  handsearch(queryVal)
                }}
              />
              <Radio.Group
                defaultValue="0"
                onChange={(val) => {
                  setLoading(true)
                  setSchedule(val.target.value)
                  getList(startVal, limitVal, '', val.target.value)
                }}
                style={{ marginLeft: 15 }}
              >
                <Radio.Button value="0">
                  {language('project.temporary.montask.all')}
                </Radio.Button>
                <Radio.Button value="1">
                  {language('project.temporary.montask.ing')}
                </Radio.Button>
                <Radio.Button value="2">
                  {language('project.temporary.montask.ed')}
                </Radio.Button>
              </Radio.Group>
            </>
          }
          toolBarRender={() => [
            !writable ? (
              false
            ) : (
              <Button
                key="button"
                onClick={() => {
                  setTimeShow(false)
                  getModal(1, 'add')
                }}
                type="primary"
                icon={<PlusOutlined />}
              >
                {language('project.add')}
              </Button>
            ),
          ]}
        />
      </ProCard>
      <ModalForm
        {...modalFormLayout}
        formRef={formRef}
        title={
          op == 'add' ? language('project.add') : language('project.alter')
        }
        visible={modalStatus}
        autoFocusFirstInput
        modalProps={{
          maskClosable: false,
          onCancel: () => {
            getModal(2)
          },
        }}
        onVisibleChange={setModalStatus}
        submitTimeout={2000}
        onFinish={async (values) => {
          save(values)
        }}
      >
        <ProFormText name="id" label="ID" hidden></ProFormText>
        <Form.Item
          name="status"
          label={language('monitor.montask.status')}
          valuePropName={switchCheck}
        >
          <Switch
            checkedChildren={language('monitor.montask.checked')}
            unCheckedChildren={language('monitor.montask.unchecked')}
          />
        </Form.Item>
        {op == 'add' ? (
          <ProFormText
            name="name"
            label={language('monitor.montask.taskname')}
            rules={[
              {
                required: true,
                message: language('project.mandatory'),
              },
              {
                pattern: regList.strmax.regex,
                message: regList.strmax.alertText,
              }
            ]}
          />
        ) : (
          <ProFormText
            disabled
            name="name"
            label={language('monitor.montask.taskname')}
            rules={[
              {
                required: true,
                message: language('project.mandatory'),
              },
              {
                pattern: regList.strmax.regex,
                message: regList.strmax.alertText,
              }
            ]}
          />
        )}

        <ProFormTextArea
          name="iprange"
          label={language('monitor.montask.iprange')}
          rules={[
            {
              required: true,
              pattern: regIpList.multipv4Mask.regex,
              message: regIpList.multipv4Mask.alertText,
            },
            {
              max: 1024,
              message: language('monitor.montask.iprangemaxlength1024'),
            },
          ]}
        />
        <ProFormCheckbox.Group
          {...modalFormLayout}
          name="kind"
          onChange={(key, val) => {}}
          rules={[{ required: true, message: language('project.select') }]}
          label={language('monitor.montask.kind')}
          options={[
            {
              label: language('project.monitor.illegal.outline'),
              value: 'outline',
            },
            {
              label: language('project.monitor.montask.vioSrvtext'),
              value: 'vioSrv',
            },
            {
              label: language('project.monitor.montask.viodevtext'),
              value: 'vioDev',
            },
          ]}
        />
      </ModalForm>
    </ProCard>
  )
}

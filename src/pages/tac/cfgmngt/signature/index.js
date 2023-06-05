import React, { useRef, useState, useEffect } from 'react'
import {
  Button,
  message,
  Switch,
  Modal,
  Alert,
  Popconfirm,
  Drawer,
  Space,
} from 'antd'
import { post } from '@/services/https'
import { language } from '@/utils/language'
import { NameText } from '@/utils/fromTypeLabel';
import { TableLayout } from '@/components'
import SignTable from '@/components/Module/signTable'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import BatchTemplate from '@/components/Module/signTable/batchTemplate.js'
const { ProtableModule } = TableLayout
import {
  ProTable,
  ModalForm,
  ProFormText,
  ProFormRadio,
  ProFormSwitch,
  ProFormSelect,
} from '@ant-design/pro-components'
import { modalFormLayout } from '@/utils/helper'
import styles from './index.less'
import asset_entry from '@/assets/tac/asset_entry.jpg'
import asset_access from '@/assets/tac/asset_access.jpg'
import asset_change from '@/assets/tac/asset_change.jpg'
import asset_withdrawal from '@/assets/tac/asset_withdrawal.jpg'
import entry_change from '@/assets/tac/entry_change.jpg'
import entry_withdrawal from '@/assets/tac/entry_withdrawal.jpg'
import asset_entry_batch from '@/assets/tac/asset_entry_batch.jpg'
import asset_access_batch from '@/assets/tac/asset_access_batch.jpg'
import asset_change_batch from '@/assets/tac/asset_change_batch.jpg'
import asset_withdrawal_batch from '@/assets/tac/asset_withdrawal_batch.jpg'
import entry_change_batch from '@/assets/tac/entry_change_batch.jpg'
import entry_withdrawal_batch from '@/assets/tac/entry_withdrawal_batch.jpg'
let clientHeight = document.body.clientHeight - 285

export default function Signature() {
  const rowKey = (record) => record.id //列表唯一值
  const [incID, setIncID] = useState(0) //递增的id 删除/添加的时候增加触发刷新
  const [visible, setVisible] = useState(false) //查看弹窗
  const [editVisible, setEditVisible] = useState(false) //编辑弹窗
  const [viewVisible, setViewVisible] = useState(false) //预览弹窗
  const [temId, setTemId] = useState('') //保存流程模板id
  const [title, setTitle] = useState('') //保存表格标题
  const [upData, setUpData] = useState([]) //表格上方数据源
  const [bottomData, setBottomData] = useState([]) //表格下方数据源
  const [batchData, setBatchData] = useState([]) //批量数据源
  const [signName, setSignName] = useState('') //签表人
  const [dateTime, setDateTime] = useState('') //签表时间
  const [sigtureList, setSigtureList] = useState([]) //字段
  const [modalStatus, setModalStatus] = useState(false) //添加流程弹窗显示
  const [orderType, setOrderType] = useState({}) //签章流程
  const [classify, setClassify] = useState({}) //表格分类
  const [classifyOptions, setClassifyOptions] = useState([]) //所有表格分类
  const [tableType, setTableType] = useState('N') //表格形式
  const [sigNamelist, setSigNamelist] = useState([]) //添加流程表单表格标题
  const [modalType, setModalType] = useState('') //模板类型 单个/批量
  const [filtersList, setFiltersList] = useState([]) //流程名称筛选选项
  const [buisusgList, setBuisusgList] = useState([]) //分类称筛选选项
  const formRef = useRef()

  const srcMap = {
    asset_entry: asset_entry,
    asset_access: asset_access,
    asset_change: asset_change,
    asset_withdrawal: asset_withdrawal,
    entry_change: entry_change,
    entry_withdrawal: entry_withdrawal,
  }
  const batchSrcMap = {
    asset_entry: asset_entry_batch,
    asset_access: asset_access_batch,
    asset_change: asset_change_batch,
    asset_withdrawal: asset_withdrawal_batch,
    entry_change: entry_change_batch,
    entry_withdrawal: entry_withdrawal_batch,
  }
  const picShow = () => {
    if (tableType === 'N') {
      return srcMap[orderType?.value]
    } else {
      return batchSrcMap[orderType?.value]
    }
  }

  useEffect(() => {
    fetchSignBuisusg()
  }, [])

  //业务用途字段回显
  const fetchSignBuisusg = () => {
    post('/cfg.php?controller=confSignature&action=showSignatureBuisusg').then(
      (res) => {
        if (res.success) {
          const buisusg = [...res.buisusg]
          const newArray = [{ value: '', label: '通用' }]
          const buiArr = [{ value: '通用', text: '通用' }]
          buisusg.map((item) => {
            newArray.push({ label: item, value: item })
            buiArr.push({ text: item, value: item })
          })
          setClassifyOptions(newArray)
          setBuisusgList(buiArr)
          setSigNamelist(res.sigNamelist)
          let filters = []
          res.sigNamelist.map((i)=>{
            filters.push({ text: i.label, value: i.value })
          })
          setFiltersList(filters)
        }
      }
    )
  }

  //签章流程回显
  const fetchSignNature = (operate, record) => {
    setTemId(record.id)
    fetchFelds(record.id)
    let type = ''
    if (operate === 'model') {
      type = 'Y'
    } else {
      type = 'N'
    }
    post('/cfg.php?controller=confSignature&action=showSigTemplate', {
      default: type,
      id: record.id,
    })
      .then((res) => {
        if (res.success) {
          setUpData(res.template?.upData)
          setBatchData(res.template?.batchData)
          setBottomData(res.template?.bottomData)
          setTitle(res.template?.title)
          setSignName(res.template?.name)
          setDateTime(res.template?.dataTime)
          if (operate === 'model') {
            setVisible(true)
          } else if (operate === 'edit') {
            setEditVisible(true)
          } else if (operate === 'preview') {
            setViewVisible(true)
          }
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }
  //签章流程字段回显
  const fetchFelds = (id) => {
    post('/cfg.php?controller=confSignature&action=showSignatureField', {
      id: id,
    }).then((res) => {
      if (res.success) {
        setSigtureList(res.signatureList)
      }
    })
  }
  //签章流程启用/禁用
  const changeStatus = (record, checked) => {
    const status = checked ? 'Y' : 'N'
    post('/cfg.php?controller=confSignature&action=enableSignature', {
      id: record.id,
      status: status,
    })
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
          setIncID(incID + 1)
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //保存签章表格
  const save = () => {
    const newUpData = upData?.length > 0 ? [...upData] : []
    newUpData.map((item) => {
      item.btnShow = false
    })
    const newBottomData = bottomData?.length > 0 ? [...bottomData] : []
    newBottomData.map((item) => {
      item.btnShow = false
    })
    const newBatData = batchData?.length > 0 ? [...batchData] : []
    newBatData.map((item) => {
      item.btnShow = false
    })
    post('/cfg.php?controller=confSignature&action=setSignature', {
      id: temId,
      title: title,
      template: JSON.stringify({
        title: title,
        name: signName,
        dataTime: dateTime,
        upData: newUpData,
        bottomData: newBottomData,
        batchData: newBatData,
      }),
    })
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
          setEditVisible(false)
          setIncID(incID + 1)
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }
  const columns = [
    {
      title: language('project.cfgmngt.signature.status'),
      dataIndex: 'status',
      width: 80,
      key: 'status',
      align: 'center',
      render: (_, record) => (
        <Switch
          checkedChildren={language('project.cfgmngt.signature.open')}
          unCheckedChildren={language('project.cfgmngt.signature.off')}
          onChange={(checked) => {
            changeStatus(record, checked)
          }}
          checked={record.status === 'Y'}
        />
      ),
    },
    {
      title: language('project.cfgmngt.signature.name'),
      dataIndex: 'name',
      width: 100,
      key: 'name',
      align: 'left',
      ellipsis: true,
      filters: filtersList,
      filterMultiple: false,
    },
    {
      title: language('project.cfgmngt.signature.buisusg'),
      dataIndex: 'buisusg',
      width: 80,
      key: 'buisusg',
      align: 'left',
      ellipsis: true,
      filters: buisusgList,
      filterMultiple: false,
    },
    {
      title: language('project.cfgmngt.signature.isBatch'),
      dataIndex: 'isBatch',
      width: 80,
      key: 'isBatch',
      align: 'left',
      render: (text) => {
        const map = {
          Y: language('project.cfgmngt.signature.batchmodal'),
          N: language('project.cfgmngt.signature.singlemodal'),
        }
        return <div>{map[text]}</div>
      },
      filters: [
        {text:language('project.cfgmngt.signature.batchmodal'),value:'Y'},
        {text:language('project.cfgmngt.signature.singlemodal'),value:'N'}
      ],
      filterMultiple: false,
    },
    {
      title: language('project.cfgmngt.signature.template'),
      dataIndex: 'template',
      width: 80,
      key: 'template',
      align: 'left',
      render: (_, record) => (
        <a
          onClick={() => {
            setModalType(record.isBatch)
            fetchSignNature('model', record)
          }}
        >
          {language('project.cfgmngt.signature.look')}
        </a>
      ),
    },
    {
      title: language('project.cfgmngt.signature.title'),
      dataIndex: 'title',
      width: 150,
      key: 'title',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('project.cfgmngt.signature.field'),
      dataIndex: 'field',
      width: 550,
      key: 'field',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('project.cfgmngt.signature.operate'),
      dataIndex: 'operate',
      width: 200,
      valueType: 'option',
      fixed: 'right',
      key: 'operate',
      align: 'center',
      render: (_, record) => {
        return (
          <>
            <Button
              type="link"
              onClick={() => {
                setModalType(record.isBatch)
                fetchSignNature('edit', record)
              }}
            >
              {language('project.cfgmngt.signature.edit')}
            </Button>
            <Button
              type="link"
              onClick={() => {
                setModalType(record.isBatch)
                fetchSignNature('preview', record)
              }}
            >
              {language('project.cfgmngt.signature.preview')}
            </Button>
            <Popconfirm
              placement="top"
              title={language('project.delconfirm')}
              onConfirm={() => {
                deleteSignNature(record.id)
              }}
              okText={language('project.yes')}
              cancelText={language('project.no')}
            >
              <Button type="link">
                {language('project.cfgmngt.signature.delete')}
              </Button>
            </Popconfirm>
          </>
        )
      },
    },
  ]
  //删除弹框
  const delClick = (selectedRowKeys) => {
    let sum = selectedRowKeys.length
    Modal.confirm({
      className: 'delclickbox',
      icon: <ExclamationCircleOutlined />,
      title: language('project.delconfirm'),
      content: language('project.cancelcon', { sum: sum }),
      onOk() {
        deleteSignNature(selectedRowKeys)
      },
    })
  }
  //删除数据
  const deleteSignNature = (selectedRowKeys) => {
    let ids = selectedRowKeys.toString()
    post('/cfg.php?controller=confSignature&action=delSignature', { ids: ids })
      .then((res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
          setIncID(incID + 1)
        } else {
          res.msg && message.error(res.msg)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }
  const addClick = () => {
    setModalStatus(true)
  }
  const tableTypes = [
    { label: '单个', value: 'N' },
    {
      label: '批量',
      value: 'Y',
    },
  ]
  const addSave = (values) => {
    console.log(values, 'values')
    const status = values.status ? 'Y' : 'N'
    const buisusg = classify?.label === '通用' ? '' : classify?.label
    const title = values.title
    const data = {
      status: status,
      name: orderType?.value,
      buisusg: buisusg,
      isBatch: tableType,
      title: title,
    }
    post('/cfg.php?controller=confSignature&action=addSignature', data).then(
      (res) => {
        if (res.success) {
          res.msg && message.success(res.msg)
          setIncID(incID + 1)
          setModalStatus(false)
          setOrderType({})
          formRef.current.resetFields()
        } else {
          res.msg && message.error(res.msg)
        }
      }
    )
  }
  return (
    <>
      <ProtableModule
        columns={columns}
        apishowurl="/cfg.php?controller=confSignature&action=showSignature"
        clientHeight={clientHeight}
        columnvalue="signColumnvalue"
        tableKey="signTable"
        rowkey={rowKey}
        incID={incID}
        addButton={true}
        addClick={addClick}
        delButton={true}
        delClick={delClick}
        rowSelection={true}
      />
      <Drawer
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'right' }}>
            <Button
              type="primary"
              onClick={() => {
                setVisible(false)
              }}
            >
              {language('project.cfgmngt.signature.takeoff')}
            </Button>
          </div>
        }
        contentWrapperStyle={{ width: 'auto' }}
      >
        {modalType === 'N' ? (
          <SignTable
            dataSource={upData}
            bottomData={bottomData}
            title={title}
            signName={signName}
            dateTime={dateTime}
            editable={false}
          />
        ) : (
          <BatchTemplate
            dataSource={upData}
            bottomData={bottomData}
            batchData={batchData}
            title={title}
            signName={signName}
            dateTime={dateTime}
            editable={false}
          />
        )}
      </Drawer>
      <Drawer
        visible={editVisible}
        onClose={() => {
          setEditVisible(false)
        }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'right' }}>
            <Space>
              <Button
                onClick={() => {
                  setEditVisible(false)
                }}
              >
                {language('cfgmngt.devlist.cancel')}
              </Button>
              <Button type="primary" onClick={save}>
                {language('project.cfgmngt.signature.save')}
              </Button>
            </Space>
          </div>
        }
        maskClosable={false}
        closable={false}
        contentWrapperStyle={{ width: 'auto' }}
      >
        <div>
          {modalType === 'N' ? (
            <SignTable
              dataSource={upData}
              bottomData={bottomData}
              setDataSource={setUpData}
              setBottomData={setBottomData}
              title={title}
              setTitle={setTitle}
              signName={signName}
              dateTime={dateTime}
              editable={true}
              sigtureList={sigtureList}
            />
          ) : (
            <BatchTemplate
              dataSource={upData}
              bottomData={bottomData}
              setDataSource={setUpData}
              setBottomData={setBottomData}
              batchData={batchData}
              setBatchData={setBatchData}
              title={title}
              setTitle={setTitle}
              signName={signName}
              dateTime={dateTime}
              editable={true}
              sigtureList={sigtureList}
            />
          )}
          <div>
            <Alert
              style={{ marginTop: '8px' }}
              message={language('project.cfgmngt.signature.tip')}
              type="info"
              showIcon
            />
          </div>
        </div>
      </Drawer>
      <Drawer
        visible={viewVisible}
        onClose={() => {
          setViewVisible(false)
        }}
        footer={
          <div style={{ display: 'flex', justifyContent: 'right' }}>
            <Button
              type="primary"
              onClick={() => {
                setViewVisible(false)
              }}
            >
              {language('project.cfgmngt.signature.takeoff')}
            </Button>
          </div>
        }
        closable={false}
        contentWrapperStyle={{ width: 'auto' }}
      >
        {modalType === 'N' ? (
          <SignTable
            dataSource={upData}
            bottomData={bottomData}
            title={title}
            signName={signName}
            dateTime={dateTime}
            editable={false}
          />
        ) : (
          <BatchTemplate
            dataSource={upData}
            bottomData={bottomData}
            batchData={batchData}
            title={title}
            signName={signName}
            dateTime={dateTime}
            editable={false}
          />
        )}
      </Drawer>
      <ModalForm
        {...modalFormLayout}
        width="650px"
        onFinish={(values) => {
          addSave(values)
        }}
        initialValues={{ status: false, isBatch: 'N' }}
        formRef={formRef}
        title={language('project.cfgmngt.signature.addSignature')}
        visible={modalStatus}
        autoFocusFirstInput
        modalProps={{
          maskClosable: false,
          // destroyOnClose: true,
          onCancel: () => {
            setModalStatus(false)
            setOrderType({})
            formRef.current.resetFields()
          },
          bodyStyle: { paddingBottom: 0 },
        }}
        onVisibleChange={setModalStatus}
        className={styles.addModalForm}
      >
        <ProFormSwitch
          name="status"
          label={language('project.cfgmngt.signature.status')}
          checkedChildren={language('project.enable')}
          unCheckedChildren={language('project.disable')}
          // valuePropName={switchCheck}
        />
        <ProFormSelect
          label={language('project.cfgmngt.signature.signame')}
          name="name"
          options={sigNamelist}
          fieldProps={{
            labelInValue: true,
            onChange: (values) => {
              setOrderType(values)
              setTableType('N')
              formRef.current.setFieldsValue({ isBatch: 'N' })
              const name = values?.label
              const buisusg = formRef.current.getFieldsValue(['buisusg'])
                .buisusg?.label
              if (name) {
                if (buisusg && buisusg !== '通用') {
                  formRef.current.setFieldsValue({
                    title: `${buisusg}${name}表`,
                  })
                } else {
                  formRef.current.setFieldsValue({ title: `${name}表` })
                }
              } else {
                formRef.current.setFieldsValue({ title: '' })
              }
            },
          }}
          width={280}
          rules={[
            {
              required: true,
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
        />
        <ProFormSelect
          label={language('project.cfgmngt.signature.tableclassfiy')}
          name="buisusg"
          options={classifyOptions}
          fieldProps={{
            labelInValue: true,
            onChange: (values) => {
              setClassify(values)
              const buisusg = values?.label
              const name = formRef.current.getFieldsValue(['name']).name?.label
              if (name) {
                if (!buisusg || buisusg === '通用') {
                  formRef.current.setFieldsValue({ title: `${name}表` })
                } else {
                  formRef.current.setFieldsValue({
                    title: `${buisusg}${name}表`,
                  })
                }
              }
            },
          }}
          width={280}
          rules={[
            {
              required: true,
              message: language('project.cfgmngt.ctrlcmd.required'),
            },
          ]}
        />
        <ProFormRadio.Group
          options={tableTypes}
          label={language('project.cfgmngt.signature.tablestyle')}
          radioType="button"
          name="isBatch"
          fieldProps={{
            buttonStyle: 'solid',
            defaultValue: 'single',
            onChange: (value) => {
              setTableType(value.target.value)
            },
          }}
        />
        <NameText
          width={280}
          name="title"
          label={language('project.cfgmngt.signature.title')}
          required={true}
        />
        <ProFormText
          width={280}
          name="template"
          label={language('project.cfgmngt.signature.template')}
        >
          <div>
            {orderType?.value ? (
              <img src={picShow()} style={{ width: '280px', height: '100%' }} />
            ) : null}
          </div>
        </ProFormText>
      </ModalForm>
    </>
  )
}

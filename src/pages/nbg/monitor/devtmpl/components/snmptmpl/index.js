import { Table } from '@/components'
import React, { useRef, useState, useEffect } from 'react'
import { getIntl, useIntl, FormattedMessage } from 'umi'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormCheckbox,
  ProFormDigit,
} from '@ant-design/pro-components'
import { modalFormLayout } from '@/utils/helper'
import { Modal, Tag, Button } from 'antd'
import { language } from '@/utils/language'
import { post, get } from '@/services/https'
import { msg } from '@/utils/fun'
import { regList } from '@/utils/regExp'
import { TableLayout } from '@/components'
import { fetchAuth } from '@/utils/common';
import { useSelector } from 'umi'
const { ProtableModule } = TableLayout
const { confirm } = Modal

// let H = document.body.clientHeight - 336
// var clientHeight = H

export default function DiscoverConfig() {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 264
  const writable = fetchAuth()
  const [modalStatus, setModalStatus] = useState(false) //控制添加/编辑弹窗
  const [editRecord, setEditRecord] = useState({})
  const [portStatus, setPortStatus] = useState(false)
  const [searchVal, setSearchVal] = useState({})
  const [selectDefaultValue, setSelectDefaultValue] = useState('0')
  const formRef = useRef()
  const addButton = true //增加按钮  与 addClick 方法 组合使用
  const delButton = true //删除按钮 与 delClick 方法 组合使用
  const rowSelection = true //是否开启多选框
  const [incID, setIncID] = useState(0) //递增的id 删除/添加的时候增加触发刷新
  const [privVal, setPrivVal] = useState(0)

  const versionMap = {
    1: 'SNMPv1',
    2: 'SNMPv2c',
    3: 'SNMPv3',
  }
  const columnsList = [
    {
      title: language('project.devname'),
      width: 120,
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('monitor.devtmpl.version'),
      width: 120,
      dataIndex: 'version',
      key: 'version',
      align: 'left',
      render: (val) => versionMap[Number(val)],
    },
    {
      title: language('monitor.devtmpl.cycle'),
      width: 80,
      dataIndex: 'cycle',
      key: 'cycle',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('monitor.devtmpl.timeout'),
      width: 80,
      dataIndex: 'timeout',
      key: 'timeout',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('monitor.devtmpl.retry'),
      width: 80,
      dataIndex: 'retry',
      key: 'retry',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('monitor.devtmpl.portDowngate'),
      width: 125,
      dataIndex: 'portDowngate',
      key: 'portDowngate',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('monitor.devtmpl.flowWarn'),
      width: 120,
      dataIndex: 'flowWarn',
      key: 'flowWarn',
      align: 'center',
      render: (val) =>
        //   console.log( typeof val,'vallllll')
        val !== '0' ? (
          <Tag style={{ border: 0 }} color="#1890ff">
            {language('monitor.devtmpl.open')}
          </Tag>
        ) : (
          <Tag style={{ border: 0 }} color="#cd201f">
            {language('monitor.devtmpl.close')}
          </Tag>
        ),
    },
    {
      title: language('monitor.devtmpl.requestDelay'),
      width: 100,
      dataIndex: 'requestDelay',
      key: 'requestDelay',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('monitor.devtmpl.flowVal'),
      width: 100,
      dataIndex: 'flowVal',
      key: 'flowVal',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('project.operate'),
      key: 'option',
      width: 100,
      valueType: 'option',
      align: 'center',
      hideInTable: !writable,
      ellipsis: true,
      fixed: 'right',
      render: (_, record) => [
        <Button type="link" size="small" onClick={() => editConfig(record)}>
          {language('project.alter')}
        </Button>,
      ],
    },
  ]

  //删除
  const delList = (selectedRows) => {
    const idsArr = selectedRows.map((e) => e.id)
    const ids = idsArr.join(',') + ','
    const namesArr = selectedRows.map((e) => e.name)
    const names = namesArr.join(',') + ','
    post('/cfg.php?controller=assetMapping&action=delSnmpTemp', {
      ids: ids,
      names: names,
    })
      .then((res) => {
        msg(res)
        setIncID(incID + 1)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const delClick = (selectedRowKeys, dataList, selectedRows) => {
    let sum = selectedRowKeys.length
    confirm({
      className: 'addrplanbox',
      icon: <ExclamationCircleOutlined />,
      title: language('project.delconfirm'),
      content: language('project.cancelcon', { sum: sum }),
      onOk() {
        delList(selectedRows)
      },
    })
  }

  const isShowPort = (e) => {
    setPortStatus(e.target.checked)
  }

  //打开添加弹窗
  const addConfig = () => {
    setEditRecord({})
    setModalStatus(true)
  }

  //打开编辑弹窗
  const editConfig = (record) => {
    const flowWarn = Number(record.flowWarn)
    setSelectDefaultValue(record.version)
    setPrivVal(record.priv)
    setPortStatus(flowWarn)
    const newRecord = {
      ...record,
      versionValue: record.version,
      privValue: record.priv,
      cycle: Number(record.cycle),
      timeout: Number(record.timeout),
      retry: Number(record.retry),
      portDowngate: Number(record.portDowngate),
      requestDelay: Number(record.requestDelay),
      flowVal: Number(record.flowVal),
    }
    setEditRecord(newRecord)
    setModalStatus(true)
  }

  //保存编辑或添加内容
  const Save = (values) => {
    if (editRecord.id) {
      const datas = formRef.current.getFieldsValue(true)
      const data = { ...datas, flowWarn: Number(datas.flowWarn) }
      post('/cfg.php?controller=assetMapping&action=setSnmpTemp', data)
        .then((res) => {
          if (!res.success) {
            msg(res)
            return false
          }
          setModalStatus(false)
          setIncID(incID + 1)
          msg(res)
          setSelectDefaultValue('0')
          setPrivVal(0)
        })
        .catch(() => {
          console.log('mistake')
        })
    } else {
      const datas = formRef.current.getFieldsValue(true)
      if (datas.flowWarn === true || datas.flowWarn == 1) {
        datas.flowWarn = 1
      } else {
        datas.flowWarn = 0
      }
      const defaultValue = {
        getPort: 1,
        getMac: 1,
        getArp: 1,
        getRoute: 1,
        getCdp: 1,
        geTip: 1,
      }
      const data = { ...defaultValue, ...datas }
      post('/cfg.php?controller=assetMapping&action=addSnmpTemp', data)
        .then((res) => {
          if (!res.success) {
            msg(res)
            return false
          }
          setModalStatus(false)
          setIncID(incID + 1)
          msg(res)
          setSelectDefaultValue('0')
          setPrivVal(0)
          setPortStatus(false)
        })
        .catch(() => {
          console.log('mistake')
        })
    }
  }

  const onSelect = (e) => {
    setSelectDefaultValue(e)
  }

  return (
    <div>
      <ProtableModule
        columns={columnsList}
        tableKey="snmptmpl"
        rowkey={(record) => record.id}
        apishowurl="/cfg.php?controller=assetMapping&action=showSnmpTempList"
        rowSelection={rowSelection}
        searchVal={searchVal}
        addButton={addButton}
        delButton={delButton}
        addClick={addConfig}
        delClick={delClick}
        incID={incID}
        clientHeight={clientHeight}
        columnvalue={'devtmplTable'}
      />
      <ModalForm
        {...modalFormLayout}
        modalProps={{
          destroyOnClose: true,
          maskClosable: false,
          onCancel: () => {
            setPortStatus(false)
            setSelectDefaultValue('0')
            setPrivVal(0)
          },
        }}
        visible={modalStatus}
        formRef={formRef}
        onVisibleChange={setModalStatus}
        initialValues={editRecord}
        title={
          Object.keys(editRecord).length === 0
            ? // <FormattedMessage id="project.add" />
              language('project.add')
            : language('project.alter')
        }
        onFinish={async (values) => {
          Save(values)
        }}
      >
        <ProFormText
          label={language('project.devname')}
          name="name"
          rules={[
            {
              required: true,
              message: language('project.mandatory'),
            },
            {
              pattern: regList.strmax.regex,
              message: regList.strmax.alertText,
            },
          ]}
        />
        <ProFormSelect
          label={language('monitor.devtmpl.version')}
          name="version"
          placeholder={language('project.select')}
          fieldProps={{
            onSelect: (val) => onSelect(val),
          }}
          options={[
            { label: 'SNMPv1', value: 1 },
            { label: 'SNMPv2c', value: 2 },
            { label: 'SNMPv3', value: 3 },
          ]}
        />
        {selectDefaultValue == '3' ? (
          <div>
            <ProFormText
              label={language('monitor.devtmpl.user')}
              name="user"
              rules={[
                {
                  required: true,
                  message: language('project.mandatory'),
                },
                {
                  pattern: regList.onlyChAndHan.regex,
                  message: regList.onlyChAndHan.alertText,
                },
              ]}
            />
            <ProFormSelect
              label={language('monitor.devtmpl.priv')}
              name="priv"
              placeholder={language('project.select')}
              options={[
                { label: 'noAuthNoPriv', value: 0 },
                { label: 'authNoPriv', value: 1 },
                { label: 'authPriv', value: 2 },
              ]}
              onChange={(val) => {
                setPrivVal(val)
              }}
            />
            {privVal == 1 ? (
              <div>
                <ProFormSelect
                  label={language('monitor.devtmpl.authPro')}
                  name="authPro"
                  options={[
                    {
                      label: 'md5',
                      value: '0',
                    },
                    {
                      label: 'sha',
                      value: '1',
                    },
                  ]}
                />
                <ProFormText.Password
                  label={language('monitor.devtmpl.authPass')}
                  name="authPass"
                />
              </div>
            ) : privVal == 2 ? (
              <div>
                <ProFormSelect
                  label={language('monitor.devtmpl.authPro')}
                  name="authPro"
                  options={[
                    {
                      label: 'md5',
                      value: '0',
                    },
                    {
                      label: 'sha',
                      value: '1',
                    },
                  ]}
                />
                <ProFormText.Password
                  label={language('monitor.devtmpl.authPass')}
                  name="authPass"
                />
                <ProFormSelect
                  label={language('monitor.devtmpl.privPro')}
                  name="privPro"
                  options={[
                    {
                      label: 'DES',
                      value: '0',
                    },
                    {
                      label: 'AES',
                      value: '1',
                    },
                  ]}
                />
                <ProFormText.Password
                  label={language('monitor.devtmpl.privPass')}
                  name="privPass"
                />
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <div>
            <ProFormText.Password
              label={language('monitor.devtmpl.read')}
              name="read"
              initialValue={'public'}
            />
            <ProFormText.Password
              label={language('monitor.devtmpl.write')}
              name="write"
              initialValue={'private'}
            />
          </div>
        )}
        <ProFormDigit
          label={language('monitor.devtmpl.cycle')}
          name="cycle"
          rules={[
            {
              required: true,
              message: language('project.mandatory'),
            },
            {
              type: 'number',
              max: 3600,
              message: language('monitor.devtmpl.max3600'),
            },
          ]}
          initialValue={60}
          addonAfter={language('project.monitor.illegal.second')}
        />
        <ProFormDigit
          label={language('monitor.devtmpl.timeoutnum')}
          name="timeout"
          initialValue={3}
          rules={[
            {
              type: 'number',
              max: 60,
              message: language('monitor.devtmpl.max60'),
            },
          ]}
          addonAfter={language('project.monitor.illegal.second')}
        />
        <ProFormDigit
          label={language('monitor.devtmpl.retry')}
          name="retry"
          initialValue={1}
          rules={[
            {
              type: 'number',
              max: 3,
              message: language('monitor.devtmpl.max3'),
            },
          ]}
          addonAfter={language('sysconf.adminset.admin.times')}
        />
        <ProFormDigit
          label={language('monitor.devtmpl.portDowngate')}
          name="portDowngate"
          initialValue={0}
          rules={[
            {
              type: 'number',
              max: 30,
              message: language('monitor.devtmpl.max30'),
            },
          ]}
          addonAfter={language('sysconf.adminset.admin.days')}
        />
        <ProFormDigit
          label={language('monitor.devtmpl.requestDelay')}
          name="requestDelay"
          rules={[
            {
              type: 'number',
              max: 1000,
              message: language('monitor.devtmpl.max1000'),
            },
          ]}
          addonAfter={language('monitor.devtmpl.ms')}
        />
        <ProFormCheckbox
          label={language('monitor.devtmpl.flowWarn')}
          name="flowWarn"
          onChange={isShowPort}
          fieldProps={{
            checked: portStatus,
          }}
        ></ProFormCheckbox>
        {portStatus ? (
          <ProFormDigit
            label={language('monitor.devtmpl.flowVal')}
            name="flowVal"
            initialValue={1}
            rules={[
              {
                type: 'number',
                max: 10000,
                message: language('monitor.devtmpl.max10000'),
              },
              {
                type: 'number',
                min: 1,
                message: language('monitor.devtmpl.min1'),
              },
            ]}
            addonAfter={'Mbps'}
          />
        ) : (
          ''
        )}
      </ModalForm>
    </div>
  )
}

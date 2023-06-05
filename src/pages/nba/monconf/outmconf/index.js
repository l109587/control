import React, { useRef, useState, useEffect } from 'react';
import { Space, message, Popconfirm, Input, Switch, Form, Tooltip } from 'antd';
import { post, get } from '@/services/https';
import { EditableProTable, ModalForm, ProFormItem, ProFormSwitch, ProFormText, ProFormTextArea, ProFormCheckbox, ProFormSelect } from '@ant-design/pro-components';
import { TableLayout } from '@/components';
import { language } from '@/utils/language';
import { modalFormLayout } from "@/utils/helper";
import { MessageOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { SendEmail } from '@icon-park/react';
import { regList, regPortList, regIpList } from '@/utils/regExp';
import './outmconf.less'
import { useSelector } from 'umi'
const { ProtableModule } = TableLayout;
const { Search } = Input;

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 222
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      align: 'center',
      key: 'id',
      ellipsis: true
    },
    {
      title: language('project.temporary.montask.status'),
      dataIndex: 'state',
      width: 100,
      key: 'state',
      align: 'center',
      render: (text, record, index) => {
        if(record.state == 'Y') {
          return (<Switch onChange={(checked) => { SwitchBtn(record, checked) }}
            checkedChildren={language('project.open')}
            unCheckedChildren={language('project.close')}
            defaultChecked
          />)
        }
        else if(record.state == 'N') {
          return (<Switch onChange={(checked) => { SwitchBtn(record, checked) }}
            checkedChildren={language('project.open')}
            unCheckedChildren={language('project.close')}
          />)
        }
      }
    },
    {
      title: language('monconf.outmconf.user'),
      dataIndex: 'user',
      width: 120,
      key: 'user',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('monconf.outmconf.flag'),
      dataIndex: 'flag',
      width: 120,
      key: 'flag',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('monconf.outmconf.port'),
      dataIndex: 'port',
      width: 120,
      key: 'port',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('monconf.outmconf.config'),
      dataIndex: 'config',
      width: 120,
      key: 'config',
      align: 'center',
      render: (text, record, action) => {
        if(record.mailState == 'Y' && record.smsState == 'Y') {
          return <Space style={{ lineHeight: 1 }}> <SendEmail theme='outline' size='24' fill='#12C189' /><MessageOutlined style={{ color: '#12C189', fontSize: "20px", marginBottom: '1px' }} /></Space>
        } else if(record.mailState == 'Y' && record.smsState == 'N') {
          return <Space style={{ lineHeight: 1 }}> <SendEmail theme='outline' size='24' fill='#12C189' /><MessageOutlined style={{ color: '#666', fontSize: "20px", marginBottom: '1px' }} /></Space>
        } else if(record.mailState == 'N' && record.smsState == 'Y') {
          return <Space style={{ lineHeight: 1 }}> <SendEmail theme='outline' size='24' fill='#666' /><MessageOutlined style={{ color: '#12C189', fontSize: "20px", marginBottom: '1px' }} /></Space>
        } else if(record.mailState == 'N' && record.smsState == 'N') {
          return <Space style={{ lineHeight: 1 }}> <SendEmail theme='outline' size='24' fill='#666' /><MessageOutlined style={{ color: '#666', fontSize: "20px", marginBottom: '1px' }} /></Space>
        }
      }
    },
    {
      title: language('monconf.outmconf.ipRang'),
      dataIndex: 'ipRang',
      width: 280,
      key: 'ipRang',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('project.remark'),
      dataIndex: 'desc',
      width: 140,
      key: 'desc',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('project.operate'),
      width: 120,
      align: 'center',
      valueType: 'option',
      render: (text, record, _, action) => [
        <a onClick={() => {
          setMod(record)
        }}>{language('project.edit')}</a>,
        <Popconfirm okText={language('project.yes')} cancelText={language('project.no')}
          title={language('project.delconfirm')}
          onConfirm={() => {
            handleDel(record)
          }}>
          <a>{language('project.del')}</a>
        </Popconfirm>
      ]
    },
  ]

  const fromcolumns = [
    {
      title: language('monconf.outmconf.address'),
      dataIndex: 'address',
      align: 'center',
      width: 200,
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            pattern: regIpList.multipv4Mask.regex,
            message: regIpList.multipv4Mask.alertText,
          }
        ],
      },
    },
    {
      title: language('project.operate'),
      width: 80,
      align: 'center',
      valueType: 'option',
      render: (text, record, _, action) => [
        <Popconfirm okText={language('project.yes')} cancelText={language('project.no')}
          title={language('project.delconfirm')}
          onConfirm={() => {
            const tableDataSource = formRef.current.getFieldsValue(['tablevalue']);
            formRef.current.setFieldsValue(
              { tablevalue: tableDataSource['tablevalue'].filter((item) => item.id != record.id), })
          }}>
          <a>{language('project.del')}</a>
        </Popconfirm>
      ]
    }
  ]

  const [op, setop] = useState('add');//选中状态
  const [editableKeys, setEditableRowKeys] = useState([]);//每行编辑的id
  const rowKey = (record => record.id);
  const formRef = useRef();
  const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
  const [queryVal, setQueryVal] = useState('');
  let searchVal = { value: queryVal };//顶部搜索框值 传入接口
  const apishowurl = '/cfg.php?controller=userOutlineConf&action=show';
  const concealColumns = {
    id: { show: false }
  };
  const tableKey = 'outmconf';
  const setcolumnKey = 'pro-table-singe-demos-outmconf';
  const columnvalue = 'otmonfcolumnvalue';
  const rowSelection = true;
  const [incID, setIncID] = useState(0);
  const addButton = true;
  const addTitle = language('project.newbuild')
  const [switchCheck, setSwitchCheck] = useState();
  const [userData, setUserData] = useState([])

  const tableTopSearch = () => {
    return (
      <Space>
        <Search
          placeholder={language('monconf.outmconf.searchText')}
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
        />
      </Space>
    )
  }

  useEffect(() => {
    getUserData();
  },[])

  const getUserData = () => {
    post('/cfg.php?controller=userOutlineConf&action=showUserCombox').then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      setUserData(res.data)
    })
  }

  const addClick = () => {
    getModal(1, 'add');
  }

  //弹出编辑model
  const getModal = (status, op) => {
    setop(op);
    if(status == 1) {
      setModalStatus(true);
    } else {
      formRef.current.resetFields();
      setModalStatus(false);
    }
  }

  //赋值编辑表格
  const setMod = (obj) => {
    if(obj.state == 'Y' || obj.state == true) {
      setSwitchCheck('checked');
    } else {
      setSwitchCheck('');
    }
    obj.config = [];
    if(obj.mailState == 'Y') {
      obj.config.push('mailState')
    }
    if(obj.smsState == 'Y') {
      obj.config.push('smsState')
    }
    if(obj.md5 == 'Y') {
      obj.config.push('md5')
    }
    let tabledata = [];
    let rowKey = [];
    if(obj.ipRang) {
      let iprang = obj.ipRang;
      let info = iprang.split(';')
      info.map((item, index) => {
        tabledata.push({ id: (index + 1), address: item })
        rowKey.push(index + 1);
      })
      obj.tablevalue = tabledata;
    } else {
      obj.tablevalue = ''
    }
    let initialValues = obj;
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues)
    }, 100)
    getModal(1, 'mod')
  }

  //关闭弹框
  const closeModal = () => {
    formRef.current.resetFields();
    getModal(2);
  }

  // 修改编辑
  const Save = (info) => {
    let state = 'N';
    if(info.state == 'Y' || info.state == true) {
      state = 'Y';
    }
    let data = {};
    data.opcode = op;
    data.id = info.id;
    data.state = state;
    data.user = info.user;
    data.flag = info.flag;
    data.port = info.port;
    data.desc = info.desc;
    if(info.config) {
      if(info.config.indexOf("mailState") >= 0) {
        data.mailState = 'Y';
      } else {
        data.mailState = 'N';
      }
      if(info.config.indexOf("smsState") >= 0) {
        data.smsState = 'Y';
      } else {
        data.smsState = 'N';
      }
    } else {
      data.mailState = 'N';
      data.smsState = 'N';
    }
    let arr = []
    if(info.tablevalue) {
      info.tablevalue.map((item) => {
        arr.push(item.address)
      })
    }
    data.ipRang = arr.join(';')
    post('/cfg.php?controller=userOutlineConf&action=set', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      closeModal();//关闭modal弹框
      setIncID(incID + 1);
    }).catch(() => {
      console.log('mistake')
    })
  }

  /* 启用禁用 */
  const SwitchBtn = (record, checked) => {
    let data = {};
    data.id = record.id;
    let state = 'N';
    if(checked) {
      state = 'Y';
    }
    data.state = state;
    post('/cfg.php?controller=userOutlineConf&action=setEnable', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      setIncID(incID + 1);
      message.success(res.msg);
    })
  }

  const handleDel = (record) => {
    let data = {};
    data.id = record.id;
    data.user = record.user;
    post('/cfg.php?controller=userOutlineConf&action=del', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      setIncID(incID + 1)
      message.success(res.msg);
    }).catch(() => {
      console.log('mistake')
    })
  }

  return (<>
    <ProtableModule columns={columns} rowkey={rowKey} clientHeight={clientHeight} apishowurl={apishowurl} searchVal={searchVal} concealColumns={concealColumns} tableKey={tableKey} setcolumnKey={setcolumnKey} columnvalue={columnvalue} incID={incID} searchText={tableTopSearch()} rowSelection={rowSelection} addButton={addButton} addTitle={addTitle} addClick={addClick} />

    <ModalForm className='networdtab'
      onFinish={async (values) => {
        Save(values);
      }}
      formRef={formRef}
      {...modalFormLayout}
      title={op == 'add' ? language('project.newbuild') : language('project.alter')}
      visible={modalStatus} autoFocusFirstInput
      modalProps={{
        maskClosable: false,
        onCancel: () => {
          closeModal()
        }
      }}
      onVisibleChange={setModalStatus}
      submitTimeout={2000}>
      <ProFormText label='ID' name='id' hidden />
      <Form.Item name="state" label={language('monconf.outmconf.state')} valuePropName={switchCheck}>
        <Switch checkedChildren={language('project.enable')} unCheckedChildren={language('project.disable')} />
      </Form.Item>
      <ProFormSelect 
        label={language('monconf.outmconf.user')} 
        name='user' 
        width='230px'
        options={userData}
        disabled={op == 'add' ? false : true}
        rules={[
          { 
            required: true, 
            message: language('project.mandatory') 
          }
        ]} 
      />
      <ProFormText label={language('monconf.outmconf.flag')} name='flag' width='230px' addonAfter={<Tooltip title={language('monconf.outmconf.flagmsg')}><QuestionCircleOutlined style={{ fontSize: 20 }} /></Tooltip>} rules={[
        {
          pattern: regList.numPa8.regex,
          message: regList.numPa8.alertText,
        },
        {
          required: true,
          message: language('project.mandatory')
        }
      ]} />
      <ProFormText label={language('monconf.outmconf.port')} name='port' width='230px' addonAfter={<Tooltip title={language('monconf.outmconf.portmsg')}><QuestionCircleOutlined style={{ fontSize: 20 }} /></Tooltip>} rules={[
        {
          pattern: regPortList.report.regex,
          message: regPortList.report.alertText,
        },
        {
          required: true,
          message: language('project.mandatory')
        }
      ]} />
      <ProFormCheckbox.Group label={language('monconf.outmconf.config')} initialValue={'mailState'} name='config' options={[{ label: language('monconf.outmconf.mailState'), value: 'mailState' }, { label: language('monconf.outmconf.smsState'), value: 'smsState' }]} />
      <ProFormItem label={language('monconf.outmconf.ipRang')} trigger="onValuesChange" name='tablevalue' >
        <EditableProTable
          className='outmcofmtable'
          style={{ width: "300px" }}
          scroll={{ y: 170 }}
          rowKey='id'
          size='small'
          toolBarRender={false}
          columns={fromcolumns}
          recordCreatorProps={{
            position: 'button',
            record: () => ({
              id: Date.now(),

            }),
          }} editable={{
            type: 'multiple',
            editableKeys,
            onChange: setEditableRowKeys,
            actionRender: (row, config, defaultDom) => {
              return [
                defaultDom.save,
                defaultDom.delete,
              ];
            },
          }} />
      </ProFormItem>
      <div className='descDiv'>
        <ProFormTextArea label={language('monconf.outmconf.desc')} name='desc' width='300px' rules={[{
          pattern: regList.notesLenght.regex,
          message: regList.notesLenght.alertText,
        }]} />
      </div>
    </ModalForm>
  </>)
}

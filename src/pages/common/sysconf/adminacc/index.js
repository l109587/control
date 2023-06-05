import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined, PoweroffOutlined, StopTwoTone, SafetyCertificateTwoTone } from '@ant-design/icons';
import { Button, Form, Space, message, Switch, Tag, Popconfirm, TreeSelect } from 'antd';
import ProTable from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormGroup, ProFormText, ProFormRadio, ProFormSwitch, 
  ProFormSelect, ProFormTreeSelect, ProFormTextArea } from '@ant-design/pro-form';
import { getIntl, useIntl, FormattedMessage } from 'umi';
import { regList, regIpList } from '@/utils/regExp';
import { language } from '@/utils/language';
import { string } from 'prop-types';
import store from 'store';
import style from './index.less'
import './index.less'
import { post, postAsync } from '@/services/https';
import '@/utils/index.less'
import { fetchAuth } from '@/utils/common'
import { useSelector } from 'umi'

/*
    <ProFormList        width="sm" name="domainContent" label="登录域内容" copyIconProps={false} max={5}
      deleteIconProps={{tooltipText: "删除"}}
      creatorButtonProps={{
        creatorButtonText: '添加IP地址',
        style: {width: '216px'},
        disabled: disabledDm
      }}
      creatorRecord={{ipaddr: ''}}
      itemRender={({listDom, action}) => (
        <div style={{display: 'inline-flex', marginBottom: '-15px'}} >
          {listDom}
          {action}
        </div>
      )} >
      <ProFormText width="sm" name="ipaddr" label="" style={{ padding: 0 }} fieldProps={{disabled: disabledDm}}/>
    </ProFormList>
*/

const reqHandle = async(url, data) => {
  try {
    let res = await postAsync(url, data);
    if (res.success)
      message.success(res.msg);
    else
      message.error(res.msg);
    return res.success;
  } catch (error) {
    message.error(language("adminacc.message.post.error"));
    return false;
  }
}

const handleEnb = (rcd, enable) => {
  let data = {
    id: rcd.id,
    name: rcd.name,
    status: enable ? '1' : '0'
  }

  return reqHandle('/cfg.php?controller=adminAcc&action=enableAdmin', data);
};

const handleUpt = (fields, opcode, id) => {
  let data = {
    op: opcode,
    id: id,
    ...fields
  }
  return reqHandle('/cfg.php?controller=adminAcc&action=setAdmin', data);
};

const handleDel = (fields) => {
  let data = {
    id: fields.id,
    name: fields.name,
  }

  return reqHandle('/cfg.php?controller=adminAcc&action=delAdmin', data);
};

const ModalAccSYS = (props, utype) => {
  const [disabledSt, setDisabledSt] = useState(false);
  let disStatus  = props.row?.name == 'admin' || props.row?.name == 'audit';
  let title = props.opcode == 'add'
    ? language('adminacc.label.add')
    : language('adminacc.label.edit')
  let place = props.opcode == 'add'
    ? {id:'adminacc.placeholder.pawd.add'}
    : {id:'adminacc.placeholder.pawd.mod'}

  useEffect(()=>{
    setDisabledSt(disStatus);
  }, [disStatus])

  return (
    <ModalForm width={460} layout="horizontal" labelCol={{ span: 6 }} wrapperCol={{ span: 20 }} 
      className='adminaccborder'
      title={title} visible={props.status} onVisibleChange={props.change}
      onFinish={props.onSubmit} modalProps={{destroyOnClose: true, maskClosable: false}}
      initialValues={{
        'name': props.row?.name,
        'type': props.row?.type ?? utype,
        'mail': props.row?.mail,
        'tele': props.row?.tele,
        'note': props.row?.note
      }}
    >
      <ProFormText width="sm" name="name" label={language('adminacc.label.name')} 
        disabled={disabledSt} 
        rules={[{
          required: true,
          message: language('adminacc.required.name')
        },
        {
          pattern: regList.namemax.regex,
          message: regList.namemax.alertText
        }]}
      /> 
      <ProFormSelect width="sm" name="type" label={language('adminacc.label.type')} disabled 
        valueEnum={{
          sys: language('adminacc.admin.type.sys'),
          sec: language('adminacc.admin.type.sec'),
          adt: language('adminacc.admin.type.adt')
        }}
      />
      <ProFormText.Password width="sm" name="pawd" label={language('adminacc.label.password')} 
        placeholder={getIntl().formatMessage(place)}
        rules={[{
          required: props.row?.name ? false : true,
          message: language('adminacc.required.pawd')
        },
        {
          pattern: regList.password.regex,
          message: regList.password.alertText
        }]}
      />
      <ProFormText.Password width="sm" name="pnew" label={language('adminacc.label.confirmp')}
        placeholder={getIntl().formatMessage(place)}
        rules={[{
          required: props.row?.name ? false : true,
          message: language('adminacc.required.pawd')
        },({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('pawd') === value) {
              return Promise.resolve()
            }
            return Promise.reject(new Error(language('adminacc.password.modify.nomatch')));
          },
        })]}
      />
      <ProFormText width="sm" name="mail" label={language('adminacc.label.mail')} 
        rules={[
          {
            pattern: regList.strictEmail.regex,
            message: language('adminacc.emailMsg'),
          },
          {
            max: 254
          }
        ]} 
      />
      <ProFormText width="sm" name="tele" label={language('adminacc.label.tele')}
        rules={[
          {
            pattern: regList.phoneorlandline.regex,
            message: regList.phoneorlandline.alertText,
          },
        ]}
      />
      <ProFormTextArea width="sm" name="note" label={language('adminacc.label.note')} rules={[
          {
            pattern: regList.namemax.regex,
            message: regList.namemax.alertText,
          }
        ]} />
    </ModalForm>
  )
};

const ModalAccSEC = (props) => {
  const [disabledDm, setDisabledDm] = useState(false);
  const [disabledSt, setDisabledSt] = useState(false);
  //区域数据
  const zoneType = 'zone';  
  let disControl = props.row?.name == 'admin' || props.row?.name == 'secadm' || props.row?.name == 'audit';
  let disContent = props.row ? props.row.domainControl == 0 : true;
  let checked = props.row?.status == 1 ? true : false;

  let title = props.opcode == 'add'
    ? language('adminacc.label.add')
    : language('adminacc.label.edit')
  let place = props.opcode == 'add'
    ? {id:'adminacc.placeholder.pawd.add'}
    : {id:'adminacc.placeholder.pawd.mod'}

  useEffect(()=>{
    setDisabledDm(disContent);
    setDisabledSt(disControl);
  }, [disControl, disContent])
  useEffect(()=>{
  }, [])
  const secField = () => {
    return (
    <>
      <ProFormText width="sm" name="name" label={language('adminacc.label.name')} 
        disabled={disabledSt} 
        rules={[
          {
            required: true,
            message: language('adminacc.required.name')
          },
          {
            pattern: regList.namemax.regex,
            message: regList.namemax.alertText
          }
        ]}
      />
      <ProFormText.Password width="sm" name="pawd" label={language('adminacc.label.password')} 
        placeholder={getIntl().formatMessage(place)}
        rules={[
          {
            required: props.row?.name ? false : true,
            message: language('adminacc.required.pawd')
          },
          {
            pattern: regList.password.regex,
            message: regList.password.alertText
          }
        ]}
        />
      <ProFormText.Password width="sm" name="pnew" label={language('adminacc.label.confirmp')}
        placeholder={getIntl().formatMessage(place)}
        rules={[{
          required: props.row?.name ? false : true,
          message: language('adminacc.required.pawd')
        },({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('pawd') === value) {
              return Promise.resolve()
            }
            return Promise.reject(new Error(language('adminacc.password.modify.nomatch')));
          },
        })]}
      />
      <ProFormText width="sm" name="mail" label={language('adminacc.label.mail')}  rules={[
          {
            pattern: regList.strictEmail.regex,
            message: language('adminacc.emailMsg'),
          },
          {
            max: 254
          }
        ]}  />
      <ProFormText width="sm" name="tele" label={language('adminacc.label.tele')} rules={[
          {
            pattern: regList.phoneorlandline.regex,
            message: regList.phoneorlandline.alertText,
          },
        ]} />
      <ProFormTextArea width="sm" name="note" label={language('adminacc.label.note')} rules={[
          {
            pattern: regList.namemax.regex,
            message: regList.namemax.alertText,
          }
        ]} />
    </>
    )
  }



  const sysField = (zone, menu) => {
    return (
    <div className='fieldform'>
      <ProFormTreeSelect width="sm" name="zone" label={language('adminacc.label.zone')}
        request={async()=>{
          return zone;
        }}
        fieldProps={{
          showArrow: false,
          filterTreeNode: true,
          dropdownMatchSelectWidth: false,
          labelInValue: false,
          autoClearSearchValue: true,
          treeNodeFilterProp: 'name',
          fieldNames: {
            label: 'name',
            value: 'id'
          },
        }}
      />
      
      <ProFormSelect width="sm" name="menu" label={language('adminacc.label.menu')}
        options={menu}
      />
    </div>
    )
  }

  return (
    <ModalForm width={480} layout="horizontal" labelCol={{ span: 7 }} wrapperCol={{ span: 20 }} 
      className='adminaccborder'
      formRef={props.formRef}
      title={title} visible={props.status} onVisibleChange={props.change}
      onFinish={props.onSubmit} modalProps={{destroyOnClose: true, maskClosable: false}}
      initialValues={{
        'status': props.row?.status ?? 0,
        'name': props.row?.name,
        'type': props.row?.type ?? 'sec',
        'mail': props.row?.mail,
        'tele': props.row?.tele,
        'note': props.row?.note,
        'zone': props.row?.zoneID,
        'menu': props.row?.menuID,
        'domainControl': props.row?.domainControl ?? 0,
        'domainContent': props.row?.domainContent,
      }}
      onValuesChange={(_, values) => {
        if (values.domainControl != undefined) {
          setDisabledDm(values.domainControl == 0 ? true : false)
        }
      }}
    >
      <ProForm.Item name="status" label={language('adminacc.label.status')} 
        valuePropName="checked" 
        getValueProps={value => {checked: value === 1 ? true : false}}
        getValueFromEvent={value => {return value ? 1 : 0;}} 
      > 
        <Switch 
          checkedChildren={language('adminacc.label.enable')}
          unCheckedChildren={language('adminacc.label.disable')}
          disabled={disabledSt} defaultChecked={checked} 
        />
      </ProForm.Item>
      <ProFormSelect width="sm" name="type" label={language('adminacc.label.type')} disabled 
        valueEnum={{
          sys: language('adminacc.admin.type.sys'),
          sec: language('adminacc.admin.type.sec'),
          adt: language('adminacc.admin.type.adt')
        }}
      />

      { props.opcode == 'add' && secField() }

      { props.row?.type == 'sec' && secField() }

      { props.row?.type == 'sys' && sysField(props.zone, props.menu) }

      <ProFormRadio.Group name="domainControl" label={language('adminacc.label.domainControl')} radioType="button" 
        fieldProps={{buttonStyle:"solid"}}
        options={[
          { label: language('adminacc.domainControl.label.close'), value: 0 },
          { label: language('adminacc.domainControl.label.permit'), value: 1 },
          { label: language('adminacc.domainControl.label.deny'), value: 2 }
        ]} />
      <ProFormTextArea width="250px" name="domainContent" label={language('adminacc.label.domainContent')} disabled={disabledDm} rules={[
        {
          pattern: regIpList.ipv4oripv6Mask.regex,
          message: regIpList.ipv4oripv6Mask.alertText
        },
        {
          max: 254
        }
      ]} />
    </ModalForm>
  )
};

const ModalAcc = (props) => {
  let type = store.get('utype');
  if (type == 'sys' || type == 'adt')
    return ModalAccSYS(props, type);

  return ModalAccSEC(props);
}

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 206
  const writable = fetchAuth()
  console.log(writable,'writeable')
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
      fixed: 'left',
      width: 10,
      ellipsis: true,
      hideInTable: true,
      key: 'id'
    },
    {
      title: language('adminacc.label.status'),
      dataIndex: 'status',
      align: 'center',
      fixed: 'left',
      width: 80,
      ellipsis: true,
      key: 'status',
      render: (text, record, index) => {
        let admType = store.get('utype');
        if (admType == 'sec') {
          let checked = record.status == 1 ? true : false;
          let disable = record.name == 'admin' || record.name == 'secadm' || record.name == 'audit';
          return (<Switch 
            checkedChildren = {language('adminacc.label.enable')}
            unCheckedChildren = {language('adminacc.label.disable')}
            checked={checked} disabled={disable}
            onChange={async(check) => {
              const success = await handleEnb(record, check);
              if(success)setReloadDL(reloadDL+1);
            }}
          />)
        }
        if (record.status == 1) {
          return (<Tag color="success" style={{ marginRight: 0 }} >
            {language('adminacc.label.enable')}
          </Tag>)
        } else {
          return (<Tag color="default" style={{ marginRight: 0 }} >
            {language('adminacc.label.disable')}
          </Tag>)
        }
      }
    },
    {
      title: language('adminacc.label.name'),
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      width: 150,
      ellipsis: true,
      key: 'name'
    },
    {
      title: language('adminacc.label.type'),
      dataIndex: 'type',
      align: 'center',
      hideInSearch: true,
      width: 100,
      ellipsis: true,
      key: 'type',
      render: (text, record, index) => {
        let na = '', co = 'default';
        switch (record.type) {
          case 'sys': na = language('adminacc.admin.type.sys'); co = '#1890ff'; break;
          case 'sec': na = language('adminacc.admin.type.sec'); co = '#52c41a'; break;
          case 'adt': na = language('adminacc.admin.type.adt'); co = '#fadb14'; break;
        }
        return (<Tag color={co} style={{ marginRight: 0 }} >{na}</Tag>)
      }
    },
    {
      title: language('adminacc.label.zone'),
      dataIndex: 'zone',
      align: 'center',
      key: 'zone',
      hideInSearch: true,
      ellipsis: true,
      width: 120
    },
    {
      title: language('adminacc.label.menu'),
      dataIndex: 'menu',
      key: 'menu',
      align: 'center',
      hideInSearch: true,
      ellipsis: true,
      width: 120
    },
    {
      title: language('adminacc.label.domainControl'),
      dataIndex: 'domainContent',
      key: 'domainContent',
      align: 'left',
      ellipsis: true,
      hideInSearch: true,
      render: (dom, record) => {
        switch (record.domainControl) {
          case 2:
            return (<Space><span>{<StopTwoTone twoToneColor="red" style={{fontSize: '16px', paddingTop: '2px'}} />}</span>{record.domainContent}</Space>)
          case 1:
            return (<Space><span>{<SafetyCertificateTwoTone style={{fontSize: '16px', paddingTop: '2px'}} />}</span>{record.domainContent}</Space>)
          default:
            return (<Space>{<PoweroffOutlined style={{fontSize: '16px', paddingTop: '2px'}} />}{record.domainContent}</Space>)
        }
      }
    },
    {
      title: language('adminacc.label.mail'),
      width:180,
      ellipsis: true,
      dataIndex: 'mail',
      key: 'mail',
      align: 'center',
      hideInSearch: true,
  
    },
    {
      title: language('adminacc.label.tele'),
      dataIndex: 'tele',
      ellipsis: true,
      align: 'center',
      key: 'tele',
      hideInSearch: true,
    },
    {
      title: language('adminacc.label.note'),
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      align: 'center',
      hideInSearch: true,
    }
  ];

  const formRef = useRef();

  const [loading, setLoading] = useState(false);
  const [dataList, setListData] = useState([]);
  const [dataZone, setZoneData] = useState([]);
  const [dataMenu, setMenuData] = useState([]);
  const [queryVal, setQueryVal] = useState('');     // 搜索值
  const [columnsHide, setColumnsHide] = useState(); // 设置默认列

  const initLtVal = store.get('pageSize') ? store.get('pageSize') : 20;
  const [limitVal, setLimitVal] = useState(initLtVal);// 每页条目
  const [currPage, setCurrPage] = useState(1);        // 当前页码
  const [totEntry, setTotEntry] = useState(0);        // 总条数
  const [reloadDL, setReloadDL] = useState(0);

  const [modalStatus, setModalStatus] = useState(false);  //对话框显示
  const [modalOPCode, setModalOPCode] = useState('');     //对话框操作

  const [currentRow, setCurrentRow] = useState(undefined);
  const [conLoading, setConLoading] = useState(false);

  const queryType = 'fuzzy';//默认模糊查找


  const showModal = (op, rcd=null) => {
    console.log(rcd)
    setModalStatus(true);
    setModalOPCode(op);
    setCurrentRow(rcd);
  };

  const getListData = () => {
    let data  = {};
    data.id = '-1';
    data.queryVal  = queryVal;
    data.queryType = queryType;
    data.start = limitVal * (currPage - 1);
    data.limit = limitVal;

    post('/cfg.php?controller=adminAcc&action=showAdmin', data).then((res) => {
      setListData(res.data);
      setTotEntry(res.total);
      setLoading(false);
    }).catch(() => {})
  }

  const getZoneData = async() => {
    let data = {};
    data.type = 'zone'
    data.depth = 1;
    let res = await postAsync('/cfg.php?controller=confZoneManage&action=showZoneTree', data);
    if (res) {
      let data = [];
      data.push(res);
      setZoneData(data)
     
    }
  }
 
  const getMenuData = () => {
    post('/cfg.php?controller=confAuthority&action=showAuthority', {}).then((res) => {
      if (res.success) {
        res.data.map((item, index) => {
          item.value = item.id;
          item.label = item.name;
        })

        setMenuData(res.data);
      }
    }).catch(() => {})
  }

  useEffect(() => {
    setLoading(true);
    getZoneData();
    getMenuData();
    getListData();
  }, [queryVal, currPage, limitVal, reloadDL])

  var opcol = [{
    title: language('adminacc.label.action'),
    align: 'center',
    fixed: 'right',
    width: 150,
    key: 'opcode',
    render: (text, record, _, action) => (
      <Space size="middle">
        <a key="editable" onClick={() => {showModal('mod', record)}}>
          {language('adminacc.label.edit')}
        </a>
        { (record.name != 'admin' && record.name != 'secadm' && record.name != 'audit') ? (
        <Popconfirm key="popconfirm" title={language('adminacc.message.popfirm.title')}
          okText={language('adminacc.message.popfirm.ok')} cancelText={language('adminacc.message.popfirm.cancel')}
          okButtonProps={{ loading: conLoading }}
          onConfirm={async() => {
            let suc = await handleDel(record);
            if (suc) setReloadDL(reloadDL+1);
          }} 
        >
          <a key="deltable" >{language('adminacc.label.delete')}</a>
        </Popconfirm>
        ) : ('')}
      </Space>
    )
  }];
  var cols = writable?columns.concat(opcol):columns;

  return (
  <>
    <ProTable
      key={'adminAcc'}
      className={style.table}
      search={false}
      bordered={true}
      loading={loading}
      size={'middle'}
      columns={cols}
      toolbar={{
        search: {
          placeholder: language('adminacc.label.tablesearch'),
          onSearch: (value) => {
            setQueryVal(value);
            setCurrPage(1);
          },
        },
        actions: writable?[
          <Button key="add" onClick={()=>{showModal('add')}} type="primary">
            <PlusOutlined /> {language('adminacc.label.add')}
          </Button>
        ]:[],
      }}
      options={{ density: false, fullScreen: false, setting: true , 
        reload: () => {
          setCurrPage(1);
          setReloadDL(reloadDL+1);
        }
      }}
      scroll = {{ x: 1500, y: clientHeight }}
      rowkey = {record => record.id}
      dataSource={dataList}

      columnsState={{
        value: columnsHide,
        persistenceType: 'localStorage',
        onChange:(value)=>{  
          setColumnsHide(value);
        },
      }}

      pagination={{
        showSizeChanger: true,
        pageSize: limitVal,
        current: currPage,
        total: totEntry,
        showTotal: total => language('project.page',{ total: total }),
        onChange: (page, pageSize) =>{
          /* fix antd bug */
          if (page == currPage && pageSize == limitVal)
            return

          store.set('pageSize', pageSize);
          setCurrPage(page);
          setLimitVal(pageSize);
        }
      }}
    />
    <ModalAcc key='acc' opcode={modalOPCode} status={modalStatus} change={setModalStatus} 
      row={currentRow || undefined} zone={dataZone} menu={dataMenu} formRef={formRef}
      onSubmit={async (value) => {
        console.log(value)
        const success = await handleUpt(value, modalOPCode, currentRow?.id, currentRow?.type);
        if (success) {
          setModalStatus(false);
          setCurrentRow(undefined);
          setCurrPage(1);
          setReloadDL(reloadDL+1);
        }
      }}
    />
  </>
  );
};

import React, { useRef, useState, useEffect } from 'react';
import { ExclamationCircleOutlined, GlobalOutlined } from '@ant-design/icons';
import ProForm, { ModalForm, ProFormText, ProFormRadio, ProFormSelect, ProFormTextArea, ProFormCheckbox, ProFormSwitch } from '@ant-design/pro-components';
import { Modal, Input, message, Popconfirm, Switch, Space, Tag, Tooltip, Form } from 'antd';
import { NameText } from '@/utils/fromTypeLabel';
import { post } from '@/services/https';
import { modalFormLayout } from "@/utils/helper";
import { language } from '@/utils/language';
import '@/utils/index.less';
import './index.less';
import { regList } from '@/utils/regExp';
import { TableLayout, DynFieldReg } from '@/components';
const { ProtableModule } = TableLayout;
const { confirm } = Modal;
let H = document.body.clientHeight - 296
var clientHeight = H
const { Search } = Input
export default (props) => {

  const validatorFn = (value, callback) => {
    if (value) {
      let reg = regList.onlyChAndHanMult.regex;
      let values = value.split(',');
      if (values[values.length - 1] == '') {
        values.pop();
      }
      if (values && values.length > 5) {
        callback(language('project.listlimit5'))
      }
      let isCheck = []
      values.map((item, index) => {
        if (item) {
          isCheck.push(reg.test(item))
        }
      })
      if (isCheck.indexOf(false) != -1) {
        callback(regList.onlyChAndHanMult.alertText)
      } else {
        callback()
      }
    } else {
      callback()
    }
  }


  const inputType = [
    {
      value: "list",
      label: language('project.cfgmngt.baseconf.listbox')
    },
    {
      value: "box",
      label: language('project.cfgmngt.baseconf.inputbox')
    },
  ]

  const selectList = [
    {
      value: "select",
      label: language('project.cfgmngt.baseconf.selectclass')
    },
  ]

  let boxList = [
    {
      value: "name",
      label: language('project.cfgmngt.baseconf.nameclass')
    },
    {
      value: "digital",
      label: language('project.cfgmngt.baseconf.arrayclass')
    },
    {
      value: "tel",
      label: language('project.cfgmngt.baseconf.telclass')
    },
    {
      value: "email",
      label: language('project.cfgmngt.baseconf.mailboxclass')
    }
  ]

  const publicField = [
    {
      value: "public",
      label: language('project.cfgmngt.baseconf.publicfield')
    },
    {
      value: "private",
      label: language('project.cfgmngt.baseconf.privatefield')
    }
  ]

  const moduleList = [
    {
      value: "asset",
      label: language('project.cfgmngt.baseconf.assetsfield')
    },
    {
      value: "resource",
      label: language('project.cfgmngt.baseconf.resourcesfield')
    }
  ]
  const formRef = useRef();
  const [modConState, setModConState] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
  const [formType, setFormType] = useState(inputType[0].value)
  const [op, setop] = useState('add');//选中id数组
  const [purposeList, setPurposeList] = useState([]);//业务用途
  const [purposeState, setPurposeState] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const renderRemove = (text, record) => (
    <Popconfirm onConfirm={() => { delList(record, text) }} key="popconfirm"
      title={language('project.delconfirm')}
      okButtonProps={{
        loading: confirmLoading,
      }} okText={language('project.yes')} cancelText={language('project.no')}>
      <a>{text}</a>
    </Popconfirm>
  );
  const columns = [
    {
      title: '配置ID',
      dataIndex: 'id',
      width: '100',
      ellipsis: true,
      hideInTable: true,
      sortOrder: 'descend',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: language('project.cfgmngt.baseconf.state'),
      dataIndex: 'state',
      width: 90,
      align: 'center',
      readonly: true,
      ellipsis: true,
      renderFormItem: (_, { isEditable }) => {
        let disabled = true;
        let checked = true;
        if (_.entry.state == 'N') {
          checked = false;
        }
        return (<
          Switch checkedChildren={language('project.open')}
          unCheckedChildren={language('project.close')}
          disabled={disabled}
          checked={checked}
        />
        )
      },
      render: (text, record) => {
        let disabled = false;
        if (record.dynamic == 'N') {
          disabled = true;
        }
        let checked = true;
        if (record.state == 'N') {
          checked = false;
        }
        return (<
          Switch checkedChildren={language('project.open')}
          unCheckedChildren={language('project.close')}
          disabled={disabled}
          checked={checked}
          onChange={
            (checked) => {
              statusSave(record, checked);
            }
          }
        />
        )
      }
    },
    {
      title: language('project.cfgmngt.baseconf.form'),
      dataIndex: 'belong',
      width: 80,
      align: 'center',
      readonly: true,
      ellipsis: true,
      renderFormItem: (_, { isEditable }) => {
        let color = 'cyan';
        let text = '';
        if (_.entry.belong == 'sys') {
          color = 'processing';
          text = language('project.cfgmngt.baseconf.system')
        } else {
          color = 'cyan';
          text = language('project.cfgmngt.baseconf.buildbyoneself')
        }
        return (
          <Space>
            <Tag style={{ marginRight: 0 }} color={color} key={_.entry.type}>
              {text}
            </Tag>
          </Space>
        )
      },
      render: (text, record) => {
        let color = 'cyan';
        if (record.belong == 'sys') {
          color = 'processing';
          text = language('project.cfgmngt.baseconf.system')
        } else {
          color = 'cyan';
          text = language('project.cfgmngt.baseconf.buildbyoneself')
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
      title: language('project.cfgmngt.baseconf.name'),
      dataIndex: 'name',
      width: 130,
      ellipsis: true,
    },
    {
      title: language('project.cfgmngt.baseconf.inputform'),
      dataIndex: 'form',
      width: 80,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        list: {
          "id": "list",
          "text": language('project.cfgmngt.baseconf.listbox')
        },
        box: {
          "id": "box",
          "text": language('project.cfgmngt.baseconf.inputbox')
        }
      },
    },
    {
      title: language('project.cfgmngt.baseconf.inputtype'),
      dataIndex: 'type',
      width: 80,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        select: {
          "id": "select",
          "text": language('project.cfgmngt.baseconf.selectclass')
        },
        name: {
          "id": "name",
          "text": language('project.cfgmngt.baseconf.nameclass')
        },
        digital: {
          "id": "digital",
          "text": language('project.cfgmngt.baseconf.arrayclass')
        },
        tel: {
          "id": "tel",
          "text": language('project.cfgmngt.baseconf.telclass')
        },
        email: {
          "id": "email",
          "text": language('project.cfgmngt.baseconf.mailboxclass')
        }
      },
    },
    {
      title: language('project.cfgmngt.baseconf.requiredornot'),
      dataIndex: 'required',
      width: 80,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        Y: {
          "status": "Y",
          "text": language('project.cfgmngt.baseconf.yes')
        },
        N: {
          "status": "N",
          "text": language('project.cfgmngt.baseconf.no')
        }
      },
    },
    {
      title: language('project.cfgmngt.baseconf.referencemodule'),
      dataIndex: 'module',
      width: 100,
      ellipsis: true,
      align: 'center',
      valueType: 'checkbox',
      valueEnum: {
        asset: {
          "status": "asset",
          "text": language('project.cfgmngt.baseconf.assetsfield')
        },
        resource: {
          "status": "resource",
          "text": language('project.cfgmngt.baseconf.resourcesfield')
        }
      },
      render: (text, record) => {
        let resourseColor = '#606060';
        let assetColor = '#606060';
        let content = record.module ? JSON.parse(record.module) : '';

        if (content?.resource == 'Y') {
          resourseColor = '#12C189';
        }
        if (content?.asset == 'Y') {
          assetColor = '#12C189';
        }
        return (
          <div className='modtypebox'>
            <Tooltip title={language('project.cfgmngt.baseconf.assetsfield')} placement='top'>
              <i className='iconfont icon-database' style={{ color: assetColor }} />
            </Tooltip>
            <Tooltip title={language('project.cfgmngt.baseconf.resourcesfield')} placement='top'>
              <GlobalOutlined className='iconfont icon-database' style={{ color: resourseColor, lineHeight: '23px' }} />
            </Tooltip>
          </div>
        )
      }
    },
    {
      title: language('project.cfgmngt.baseconf.fieldtype'),
      dataIndex: 'attribute',
      width: 90,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        public: {
          "id": "public",
          "text": language('project.cfgmngt.baseconf.publicfield')
        },
        private: {
          "id": "private",
          "text": language('project.cfgmngt.baseconf.privatefield')
        }
      },
    },
    {
      title: language('project.cfgmngt.baseconf.relationbusiness'),
      dataIndex: 'buisusg',
      ellipsis: true,
      width: 120,
      render: (text, record) => {
        if (record.buisusg && JSON.parse(record.buisusg).join(',')) {
          return JSON.parse(record.buisusg).join(',');
        } else {
          return language('project.cfgmngt.baseconf.all');
        }
      }
    },
    {
      title: language('project.cfgmngt.baseconf.presetcontent'),
      dataIndex: 'content',
      ellipsis: true,
    },
    {
      title: language('project.mconfig.operate'),
      valueType: 'option',
      width: 120,
      align: 'center',
      fixed: 'right',
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => {
          let status = false;
          if (record.name == language('project.cfgmngt.baseconf.purpose')) {
            status = true;
          }
          setModConState(status)
          mod(record, 'mod');
        }}>
          {language('project.deit')}
        </a>,
        record.belong == 'sys' ? '' :
          <>{renderRemove(language('project.del'), record)}</>,
      ],
    },
  ];

  /** table组件 start */
  const rowKey = (record => record.id);//列表唯一值
  const tableHeight = clientHeight;//列表高度
  const tableKey = 'baseconfc';//table 定义的key
  const rowSelection = true;//是否开启多选框
  const addButton = true; //增加按钮  与 addClick 方法 组合使用
  const delButton = false; //删除按钮 与 delClick 方法 组合使用
  const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const columnvalue = 'baseconfccolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const apishowurl = '/cfg.php?controller=confResField&action=showResFieldList';//接口路径
  const [queryVal, setQueryVal] = useState();//首个搜索框的值
  let searchVal = { queryVal: queryVal, queryType: 'fuzzy', filterType: 'all' };//顶部搜索框值 传入接口

  //初始默认列
  const concealColumns = {
    id: { show: false },
    valid_type: { show: false },
    createTime: { show: false },
    updateTime: { show: false },
  }
  /* 顶部左侧搜索框*/
  const tableTopSearch = () => {
    return (
      <Search
        placeholder={language('project.mconfig.baseconf.tablesearch')}
        style={{ width: 200 }}
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID(incID + 1);
        }}
      />
    )
  }

  //删除弹框
  const delClick = (selectedRowKeys, dataList) => {
    let sum = selectedRowKeys.length;
    confirm({
      className: 'delclickbox',
      icon: <ExclamationCircleOutlined />,
      title: language('project.delconfirm'),
      content: language('project.cancelcon', { sum: sum }),
      onOk() {
        delList(selectedRowKeys, dataList)
      }
    });
  };

  //添加按钮点击触发
  const addClick = () => {
    let initialValue = [];
    initialValue.state = true;
    initialValue.form = 'list';
    initialValue.required = 'N';
    initialValue.attribute = 'public';
    setFormType(inputType[0].value);
    setPurposeState(false);
    setModConState(false);
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValue)
    }, 100);
    getModal(1, 'add');
  }

  /** table组件 end */

  const incAdd = () => {
    let inc;
    clearTimeout(inc);
    inc = setTimeout(() => {
      setIncID(incID + 1);
    }, 100);
  }

  useEffect(() => {
    getBusinessPurpose();
  }, []);

  //业务用途 获取资源字段 id
  const getBusinessPurpose = (id = 1) => {
    post('/cfg.php?controller=confResField&action=showResField', { id: id }).then((res) => {
      let info = [];
      res.data.map((item) => {
        let confres = [];
        confres.label = item;
        confres.value = item;
        info.push(confres)
      })
      setPurposeList(info)
    }).catch(() => {
      console.log('mistake')
    })
  }

  //判断是否弹出添加model
  const getModal = (status, op) => {
    if (status == 1) {
      setop(op)
      setModalStatus(true);
    } else {
      formRef.current.resetFields();
      setModalStatus(false);
    }
  }

  const closeModal = () => {
    getModal(2)
  }

  //启用禁用
  const statusSave = (record, checked) => {
    let state = 'N';
    if (checked) {
      state = 'Y';
    }
    let id = record.id;
    post('/cfg.php?controller=confResField&action=enableResField', { id: id, state: state }).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      incAdd();
      message.success(res.msg);
    }).catch(() => {
      console.log('mistake')
    })
  }

  //删除功能
  const delList = (record) => {
    let data = {};
    data.ids = record.id;
    post('/cfg.php?controller=confResField&action=delResField', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      incAdd();
    }).catch(() => {
      console.log('mistake')
    })
  }

  //编辑
  const mod = (obj, op) => {
    let initialValues = { ...obj };
    let addModule = [];
    let resource = JSON.parse(obj.module);
    if (resource.resource == 'Y') {
      addModule.push('resource')
    }
    if (resource.asset == 'Y') {
      addModule.push('asset')
    }
    setFormType(initialValues.form);
    initialValues.buisusg = initialValues.buisusg ? JSON.parse(initialValues.buisusg) : '';
    initialValues.module = addModule;
    initialValues.state = obj.state == true || obj.state == 'Y' ? true : false;
    initialValues.op = 'mod';
    if (initialValues.attribute == 'public') {
      setPurposeState(false);
    } else {
      setPurposeState(true);
    }
    setTimeout(function () {
      formRef.current.setFieldsValue(initialValues)
    }, 100)
    getModal(1, 'mod');
  }

  //更新修改功能
  const save = (record) => {
    let data = {};
    data.id = record.op != 'add' ? record.id : '';
    data.op = record.op == 'add' ? record.op : 'mod';
    data.state = record.state == true || record.state == 'Y' ? 'Y' : 'N';
    data.belong = record.op == 'add' ? 'user' : record.belong;
    data.attribute = record.attribute
    data.name = record.name;
    let module = {};
    if (record.module.indexOf('resource') != -1) {
      module.resource = 'Y';
    } else {
      module.resource = 'N';
    }
    if (record.module.indexOf('asset') != -1) {
      module.asset = 'Y';
    } else {
      module.asset = 'N';
    }
    data.module = JSON.stringify(module);
    data.buisusg = JSON.stringify(record.buisusg);
    data.form = record.form;
    data.type = record.type;
    data.required = record.required;
    data.content = record.content;
    post('/cfg.php?controller=confResField&action=setResField', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
      }
      closeModal();
      incAdd();
    }).catch(() => {
      incAdd();;
    })
  }

  return (<>
    <div className='bctablebox'>
      <ProtableModule concealColumns={concealColumns} columns={columns} apishowurl={apishowurl} incID={incID} clientHeight={tableHeight} columnvalue={columnvalue} tableKey={tableKey} searchText={tableTopSearch()} searchVal={searchVal} rowkey={rowKey} delButton={delButton} delClick={delClick} addButton={addButton} addClick={addClick} rowSelection={rowSelection} />
    </div>
    <ModalForm {...modalFormLayout}
      formRef={formRef}
      title={op == 'add' ? language('project.add') : language('project.alter')}
      className='baseconsavemodal'
      visible={modalStatus} autoFocusFirstInput
      modalProps={{
        wrapClassName: 'baseconbox',
        maskClosable: false,
        onCancel: () => {
          closeModal(2)
        },
      }}
      onVisibleChange={setModalStatus}
      submitTimeout={2000} onFinish={async (values) => {
        save(values);
      }}>
      <ProFormText hidden={true} type="hidden" name="id" label="IP" />
      <ProFormText hidden={true} type="hidden" name="belong" label="IP" />
      <ProFormText hidden={true} name="op" label={language('project.sysconf.syszone.opcode')} initialValue={op} />
      <ProFormSwitch checkedChildren={language('project.open')} disabled={modConState} unCheckedChildren={language('project.close')}
        name='state' label={language('project.cfgmngt.baseconf.state')} />
      <NameText name='name' label={language('project.cfgmngt.baseconf.fieldname')} disabled={modConState} required={true} />
      <div className='typegbox'>
        <ProFormRadio.Group
          disabled={modConState}
          radioType='button'
          name="form"
          fieldProps={{
            buttonStyle: 'solid',
            onChange: (e) => {
              setFormType(e.target.value);
              formRef.current.setFieldsValue({ type: '' })
            }
          }}
          width='100%'
          label={language('project.cfgmngt.baseconf.inputform')}
          initialValue={0}
          options={inputType}
        />
      </div>
      <ProFormSelect
        options={formType == 'box' ? boxList : selectList}
        disabled={modConState}
        name="type"
        label={language('project.cfgmngt.baseconf.listtype')}
        rules={[{ required: true }]} />
      <div className='confcheckbox'>
        <ProFormRadio.Group
          name='required'
          disabled={modConState}
          label={language('project.cfgmngt.baseconf.requiredornot')}
          options={[{
            value: "Y",
            label: language('project.cfgmngt.baseconf.yes')
          },
          {
            value: "N",
            label: language('project.cfgmngt.baseconf.no')
          }]}
        />
        <ProFormCheckbox.Group
          options={moduleList}
          disabled={modConState}
          name="module"
          label={language('project.cfgmngt.baseconf.referencemodule')}
          rules={[{ required: true }]} />
      </div>
      <div className='typegbox'>
        <ProFormRadio.Group
          disabled={modConState}
          radioType='button'
          name="attribute"
          fieldProps={{
            buttonStyle: 'solid'
          }}
          onChange={(e) => {
            if (e.target.value == 'public') {
              setPurposeState(false);
            } else {
              setPurposeState(true);
            }
          }}
          width='100%'
          label={language('project.cfgmngt.baseconf.fieldtype')}
          options={publicField}
        />
      </div>
      {purposeState ? <ProFormSelect
        options={purposeList}
        fieldProps={{
          mode: 'multiple'
        }}
        name="buisusg"
        disabled={purposeState ? false : true}
        label={language('project.cfgmngt.baseconf.relationbusiness')}
        rules={[{ required: true }]} /> : ''}
      <ProFormTextArea name="content"
        rules={[
          { required: formType == inputType[0].value ? true : false },
          {
            validator: (rule, value, callback) => {
              validatorFn(value, callback)
            }
          }
        ]}
        label={language('project.cfgmngt.baseconf.presetcontent')}
        placeholder={language('project.cfgmngt.baseconf.multilineinput')} />
    </ModalForm>

  </>);
};
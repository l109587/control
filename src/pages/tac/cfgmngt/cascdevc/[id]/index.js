import React, { useRef, useState, useEffect } from 'react';
import { Button, Input, Tabs } from 'antd';
import { post } from '@/services/https';
import { language } from '@/utils/language';
import '@/utils/index.less';
import './../index.less';
import { TableLayout, LeftTree } from '@/components';
const { ProtableModule } = TableLayout;

const { Search } = Input;
const { TabPane } = Tabs;
let H = document.body.clientHeight - 105
var clientHeight = H
export default (props) => {
  
  useEffect(() => {
    showadmpolicydata();
  }, [])

  const accessModeList = [
    { text: language('mconfig.nacpolicy.networkaccessinspection'), label: language('mconfig.nacpolicy.networkaccessinspection'), value: 'check' },
    { text: language('mconfig.nacpolicy.denyaccess'), label: language('mconfig.nacpolicy.denyaccess'), value: 'forbid' },
    { text: language('mconfig.nacpolicy.allownetworkaccess'), label: language('mconfig.nacpolicy.allownetworkaccess'), value: 'allow' },
  ];

  const devSource = (type) => {
    if(type == '-1'){
      return language('project.mconfig.devctl.local');
    }else{
      return language('project.mconfig.devctl.form');
    }
  }

  const [devTypeList, setDevTypeList] = useState([]);//设备类型
  const [sysTypeList, setSysTypeList] = useState([]);//系统类型

  const showadmpolicydata = () => {
    post('/cfg.php?controller=confAdmissionPolicy&action=showadmpolicydata').then((res) => {
      if (res.success) {
        if (res.devType?.length > 0) {
          setDevTypeList(res.devType);
        }
        if (res.sysType?.length > 0) {
          setSysTypeList(res.sysType);
        }
      }
    }).catch(() => {
      console.log('mistake')
    })
  }


  const aptaddrColumns = [
    {
      // title: '配置ID',
      title: language('project.mconfig.cfnid'),
      dataIndex: 'id',
      align: 'center',
      hideInTable: true,
    },
    {
      // title: '名称',
      title: language('project.devname'),
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.mconfig.devctl.source'),
      dataIndex: 'area',
      align: 'center',
      ellipsis: true,
      width: 80,
      render: (text, record, index) => {
        return devSource(record.area);
      }
    },
    {
      // title: '生效状态',
      title: language('project.mconfig.ectstu'),
      dataIndex: 'status',
      align: 'center',
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        if (record.status == 'Y') {
          return language('project.enable');
        } else {
          return language('project.disable');
        }
      },
    },
    {
      // title: '动作',
      title: language('project.logmngt.devactions'),
      dataIndex: 'block',
      align: 'center',
      width: 150,
      ellipsis: true,
      render: (text, record, index) => {
        if (record.block == 'Y') {
          return language('project.mconfig.aptaddr.blockaudit');
        } else {
          return language('project.mconfig.aptaddr.audit');
        }
      }
    },
    {
      //有效期类型
      title: language('project.mconfig.validtype'),
      dataIndex: 'valid_type',
      align: 'center',
      ellipsis: true,
      width: 130,
      render: (text, record, index) => {
        if (record.valid_type == 'forever') {
          return language('project.mconfig.forever');
        } else {
          return language('project.mconfig.expire');
        }
      },
    },
    {
      // title: '有效时间',
      title: language('project.mconfig.vdtime'),
      dataIndex: 'expire_time',
      align: 'center',
      ellipsis: true,
      width: 180,
      render: (text, record, index) => {
        if (record.expire_time == 0) {
          return language('project.mconfig.forever');
        } else {
          return record.expire_time;
        }
      },
    },

    {
      // title: '内容',
      title: language('project.mconfig.aptaddr.content'),
      dataIndex: 'addrlist',
      width: 150,
      ellipsis: true,
      align: 'center',
      render: (text, record, index) => {
        if (record.addrlist) {
          return record.addrlist.join(';');
        } else {
          return record.addrlist;
        }
      }
    },
    {
      // title: '备注',
      title: language('project.remark'),
      dataIndex: 'notes',
      width: 150,
      ellipsis: true,
      align: 'center',
    },
  ];

  const blklistColumns = [
    {
      // title: '配置ID',
      title: language('project.mconfig.cfnid'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
      hideInTable: true,
    },
    {
      // title: '名称',
      title: language('project.devname'),
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.mconfig.devctl.source'),
      dataIndex: 'area',
      align: 'center',
      ellipsis: true,
      width: 80,
      render: (text, record, index) => {
        return devSource(record.area);
      }
    },
    {
      // title: '生效状态',
      title: language('project.mconfig.ectstu'),
      dataIndex: 'status',
      align: 'center',
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        if (record.status == 'Y') {
          return language('project.enable');
        } else {
          return language('project.disable');
        }
      },
    },
    {
      //有效期类型
      title: language('project.mconfig.validtype'),
      dataIndex: 'valid_type',
      align: 'center',
      ellipsis: true,
      width: 150,
      render: (text, record, index) => {
        if (record.valid_type == 'forever') {
          return language('project.mconfig.forever');
        } else {
          return language('project.mconfig.expire');
        }
      },
    },
    {
      // title: '有效时间',
      title: language('project.mconfig.vdtime'),
      dataIndex: 'expire_time',
      align: 'center',
      ellipsis: true,
      width: 180,
      render: (text, record, index) => {
        if (record.expire_time == 0) {
          return language('project.mconfig.forever');
        } else {
          return record.expire_time;
        }
      },
    },

    {
      // title: '黑名单地址内容',
      title: language('project.mconfig.blklist.bac'),
      dataIndex: 'addrlist',
      align: 'center',
      width: 150,
      ellipsis: true,
    },
    {
      // title: '备注',
      title: language('project.remark'),
      dataIndex: 'notes',
      align: 'center',
      ellipsis: true,
      width: 150,
    },
  ];


  const whtlistColumns = [
    {
      // title: '配置ID',
      title: language('project.mconfig.cfnid'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
      hideInTable: true,
    },
    {
      // title: '名称',
      title: language('project.devname'),
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.mconfig.devctl.source'),
      dataIndex: 'area',
      align: 'center',
      ellipsis: true,
      width: 80,
      render: (text, record, index) => {
        return devSource(record.area);
      }
    },
    {
      // title: '生效状态',
      title: language('project.mconfig.ectstu'),
      dataIndex: 'status',
      align: 'center',
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        if (record.status == 'Y') {
          return language('project.enable');
        } else {
          return language('project.disable');
        }
      },
    },
    {
      //有效期类型
      title: language('project.mconfig.validtype'),
      dataIndex: 'valid_type',
      align: 'center',
      ellipsis: true,
      width: 150,
      render: (text, record, index) => {
        if (record.valid_type == 'forever') {
          return language('project.mconfig.forever');
        } else {
          return language('project.mconfig.expire');
        }
      },
    },
    {
      // title: '有效时间',
      title: language('project.mconfig.vdtime'),
      dataIndex: 'expire_time',
      align: 'center',
      ellipsis: true,
      width: 180,
      render: (text, record, index) => {
        if (record.expire_time == 0) {
          return language('project.mconfig.forever');
        } else {
          return record.expire_time;
        }
      },
    },

    {
      // title: '白名单地址内容',
      title: language('project.mconfig.whtlist.wac'),
      dataIndex: 'addrlist',
      align: 'center',
      ellipsis: true,
      width: 150,
    },
    {
      // title: '备注',
      title: language('project.remark'),
      dataIndex: 'notes',
      align: 'center',
      ellipsis: true,
      width: 150,
    },
  ];

  const serverlistColumns = [
    {
      // title: '配置ID',
      title: language('project.mconfig.cfnid'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
      hideInTable: true,
    },
    {
      // title: '名称',
      title: language('project.devname'),
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.mconfig.devctl.source'),
      dataIndex: 'area',
      align: 'center',
      ellipsis: true,
      width: 80,
      render: (text, record, index) => {
        return devSource(record.area);
      }
    },
    {
      // title: '生效状态',
      title: language('project.mconfig.ectstu'),
      dataIndex: 'status',
      align: 'center',
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        if (record.status == 'Y') {
          return language('project.enable');
        } else {
          return language('project.disable');
        }
      },
    },
    {
      //有效期类型
      title: language('project.mconfig.validtype'),
      dataIndex: 'valid_type',
      align: 'center',
      ellipsis: true,
      width: 150,
      render: (text, record, index) => {
        if (record.valid_type == 'forever') {
          return language('project.mconfig.forever');
        } else {
          return language('project.mconfig.expire');
        }
      },
    },
    {
      // title: '有效时间',
      title: language('project.mconfig.vdtime'),
      dataIndex: 'expire_time',
      align: 'center',
      ellipsis: true,
      width: 180,
      render: (text, record, index) => {
        if (record.expire_time == 0) {
          return language('project.mconfig.forever');
        } else {
          return record.expire_time;
        }
      },
    },

    {
      // title: '白名单地址内容',
      title: language('project.mconfig.whtlist.wac'),
      dataIndex: 'addrlist',
      align: 'center',
      ellipsis: true,
      width: 150,
    },
    {
      // title: '备注',
      title: language('project.remark'),
      dataIndex: 'notes',
      align: 'center',
      ellipsis: true,
      width: 150,
    },
  ];

  const macWhtlistColumns = [
    {
      // title: '配置ID',
      title: language('project.mconfig.cfnid'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
      hideInTable: true,
    },
    {
      // title: '名称',
      title: language('project.devname'),
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.mconfig.devctl.source'),
      dataIndex: 'area',
      align: 'center',
      ellipsis: true,
      width: 80,
      render: (text, record, index) => {
        return devSource(record.area);
      }
    },
    {
      // title: '生效状态',
      title: language('project.mconfig.ectstu'),
      dataIndex: 'status',
      align: 'center',
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        if (record.status == 'Y') {
          return language('project.enable');
        } else {
          return language('project.disable');
        }
      },
    },
    {
      //有效期类型
      title: language('project.mconfig.validtype'),
      dataIndex: 'valid_type',
      align: 'center',
      ellipsis: true,
      width: 150,
      render: (text, record, index) => {
        if (record.valid_type == 'forever') {
          return language('project.mconfig.forever');
        } else {
          return language('project.mconfig.expire');
        }
      },
    },
    {
      // title: '有效时间',
      title: language('project.mconfig.vdtime'),
      dataIndex: 'expire_time',
      align: 'center',
      ellipsis: true,
      width: 180,
      render: (text, record, index) => {
        if (record.expire_time == 0) {
          return language('project.mconfig.forever');
        } else {
          return record.expire_time;
        }
      },
    },

    {
      // title: '白名单地址内容',
      title: language('project.mconfig.whtlist.wac'),
      dataIndex: 'addrlist',
      align: 'center',
      ellipsis: true,
      width: 150,
    },
    {
      // title: '备注',
      title: language('project.remark'),
      dataIndex: 'notes',
      align: 'center',
      ellipsis: true,
      width: 150,
    },
  ];

  const macBlklistColumns = [
    {
      // title: '配置ID',
      title: language('project.mconfig.cfnid'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
      hideInTable: true,
    },
    {
      // title: '名称',
      title: language('project.devname'),
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.mconfig.devctl.source'),
      dataIndex: 'area',
      align: 'center',
      ellipsis: true,
      width: 80,
      render: (text, record, index) => {
        return devSource(record.area);
      }
    },
    {
      // title: '生效状态',
      title: language('project.mconfig.ectstu'),
      dataIndex: 'status',
      align: 'center',
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        if (record.status == 'Y') {
          return language('project.enable');
        } else {
          return language('project.disable');
        }
      },
    },
    {
      //有效期类型
      title: language('project.mconfig.validtype'),
      dataIndex: 'valid_type',
      align: 'center',
      ellipsis: true,
      width: 150,
      render: (text, record, index) => {
        if (record.valid_type == 'forever') {
          return language('project.mconfig.forever');
        } else {
          return language('project.mconfig.expire');
        }
      },
    },
    {
      // title: '有效时间',
      title: language('project.mconfig.vdtime'),
      dataIndex: 'expire_time',
      align: 'center',
      ellipsis: true,
      width: 180,
      render: (text, record, index) => {
        if (record.expire_time == 0) {
          return language('project.mconfig.forever');
        } else {
          return record.expire_time;
        }
      },
    },

    {
      // title: '黑名单地址内容',
      title: language('project.mconfig.blklist.bac'),
      dataIndex: 'addrlist',
      align: 'center',
      width: 150,
      ellipsis: true,
    },
    {
      // title: '备注',
      title: language('project.remark'),
      dataIndex: 'notes',
      align: 'center',
      ellipsis: true,
      width: 150,
    },
  ];

  const authconfigColumns = [
    {
      title: language('mconfig.cfgpolicy.id'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
    },
    {
      title: language('mconfig.cfgpolicy.name'),
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.mconfig.devctl.source'),
      dataIndex: 'area',
      align: 'center',
      ellipsis: true,
      width: 80,
      render: (text, record, index) => {
        return devSource(record.area);
      }
    },
    {
      title: language('mconfig.cfgpolicy.authcontent'),
      dataIndex: 'contentStr',
      width: 320,
      align: 'center',
      ellipsis: true,
    },
    {
      // title: '备注',
      title: language('project.remark'),
      dataIndex: 'notes',
      align: 'center',
      width: 130,
      ellipsis: true,
    }
  ];

  const roleauthColumns = [
    {
      title: language('mconfig.cfgpolicy.id'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
    },
    {
      title: language('mconfig.cfgpolicy.name'),
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.mconfig.devctl.source'),
      dataIndex: 'area',
      align: 'center',
      ellipsis: true,
      width: 80,
      render: (text, record, index) => {
        return devSource(record.area);
      }
    },
    {
      title: language('mconfig.cfgpolicy.jurisdiction'),
      dataIndex: 'secDomain',
      width: 120,
      align: 'center',
      ellipsis: true,
    },
    {
      title: language('mconfig.cfgpolicy.member'),
      dataIndex: 'memberStr',
      width: 320,
      align: 'center',
      ellipsis: true,
    },
    {
      // title: '备注',
      title: language('project.remark'),
      dataIndex: 'notes',
      align: 'center',
      width: 130,
      ellipsis: true,
    },

  ];

  const authenticationColumns = [
    {
      title: language('mconfig.agtpolicy.id'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
    },
    {
      title: language('mconfig.agtpolicy.name'),
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.mconfig.devctl.source'),
      dataIndex: 'area',
      align: 'center',
      ellipsis: true,
      width: 80,
      render: (text, record, index) => {
        return devSource(record.area);
      }
    },
    {
      title: language('mconfig.agtpolicy.status'),
      dataIndex: 'status',
      align: 'center',
      ellipsis: true,
      width: 80,
      valueEnum: {
        Y: { text: language('project.open') },
        N: { text: language('project.close') },
      },
    },
    {
      title: language('mconfig.agtpolicy.targetofexecution'),
      dataIndex: 'devgrpName',
      align: 'center',
      width: 90,
      ellipsis: true,
    },
    {
      title: language('mconfig.agtpolicy.typecertification'),
      dataIndex: 'kind',
      align: 'center',
      ellipsis: true,
      width: 110,
      valueEnum: {
        portal: { text: language('mconfig.agtpolicy.portalauthentication') },
        dot1x: { text: language('mconfig.agtpolicy.xauthentication') },
      },
    },
    {
      // title: '备注',
      title: language('project.remark'),
      dataIndex: 'notes',
      align: 'center',
      width: 130,
      ellipsis: true,
    },
  ];

  //注册审核策略
  const regreviewColumns = [
    {
      title: language('mconfig.nacpolicy.id'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
    },
    {
      title: language('mconfig.nacpolicy.name'),
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.mconfig.devctl.source'),
      dataIndex: 'area',
      align: 'center',
      ellipsis: true,
      width: 80,
      render: (text, record, index) => {
        return devSource(record.area);
      }
    },
    {
      title: language('mconfig.nacpolicy.registrationmethod'),
      dataIndex: 'regType',
      align: 'center',
      width: 100,
      ellipsis: true,
      render: (text, record, index) => {
        if (record.regType == '1') {
          return language('mconfig.nacpolicy.client');
        } else {
          return language('mconfig.nacpolicy.web');
        }
      },
    },
    {
      title: language('mconfig.nacpolicy.auditmethod'),
      dataIndex: 'verifyType',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        if (record.verifyType == '3') {
          return <>{language('mconfig.nacpolicy.artificialexamine')}</>;
        } else if (record.verifyType == '2') {
          return <>{language('mconfig.nacpolicy.automaticexamine')}</>;
        } else {
          return <>{language('mconfig.nacpolicy.donotapprove')}</>;
        }
      },
    },
    {
      title: language('mconfig.nacpolicy.handlingmethod'),
      dataIndex: 'dealType',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        if (record.dealType == 2) {
          return language('mconfig.nacpolicy.giveanalarm');
        } else {
          return language('mconfig.nacpolicy.block');
        }
      },
    },
    {
      title: language('mconfig.nacpolicy.downloadaddress'),
      dataIndex: 'agentUrl',
      align: 'center',
      ellipsis: true,
      width: 180,
    },
  ];

  //终端入网策略
  const accTerminalColumns = [
    {
      // title: '配置ID',
      title: language('mconfig.nacpolicy.id'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
    },
    {
      title: language('mconfig.nacpolicy.name'),
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.mconfig.devctl.source'),
      dataIndex: 'area',
      align: 'center',
      ellipsis: true,
      width: 80,
      render: (text, record, index) => {
        return devSource(record.area);
      }
    },
    {
      title: language('mconfig.nacpolicy.status'),
      dataIndex: 'status',
      align: 'center',
      ellipsis: true,
      width: 80,
      valueEnum: {
        Y: { text: language('project.open') },
        N: { text: language('project.close') },
      },
    },
    {
      title: language('mconfig.nacpolicy.targetofexecution'),
      dataIndex: 'agentGroupName',
      align: 'center',
      width: 90,
      ellipsis: true,
    },
    {
      title: language('mconfig.nacpolicy.equipmenttype'),
      dataIndex: 'devType',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        let name = '';
        devTypeList.map((item) => {
          if (item.value == record.devType) {
            name = item.label;
          }
        })
        return name;
      },
    },
    {
      title: language('mconfig.nacpolicy.systemtype'),
      dataIndex: 'sysType',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        let name = '';
        sysTypeList.map((item) => {
          if (item.value == record.sysType) {
            name = item.label;
          }
        })
        return name;
      },
    },
    {
      title: language('mconfig.nacpolicy.accessmode'),
      dataIndex: 'accessMode',
      align: 'center',
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        let name = '';
        accessModeList.map((item) => {
          if (item.value == record.accessMode) {
            name = item.label;
          }
        })
        return name;
      },
    },
  ];

  //访问控制策略
  const accessModeArr = [
    { text: language('mconfig.nacpolicy.terminalobject'), label: language('mconfig.nacpolicy.terminalobject'), value: 'dev' },
    { text: language('mconfig.nacpolicy.roleobject'), label: language('mconfig.nacpolicy.roleobject'), value: 'role' },
  ];

  const actionList = [
    { text: language('mconfig.nacpolicy.allow'), label: language('mconfig.nacpolicy.allow'), value: 'permit' },
    { text: language('mconfig.nacpolicy.refuse'), label: language('mconfig.nacpolicy.refuse'), value: 'drop' },
  ];

  const accessControlColumns = [
    {
      // title: '配置ID',
      title: language('mconfig.nacpolicy.id'),
      dataIndex: 'id',
      align: 'center',
      ellipsis: true,
    },
    {
      title: language('mconfig.nacpolicy.name'),
      dataIndex: 'name',
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      width: 130,
    },
    {
      title: language('project.mconfig.devctl.source'),
      dataIndex: 'area',
      align: 'center',
      ellipsis: true,
      width: 80,
      render: (text, record, index) => {
        return devSource(record.area);
      }
    },
    {
      title: language('mconfig.nacpolicy.status'),
      dataIndex: 'status',
      align: 'center',
      fixed: 'left',
      ellipsis: true,
      width: 80,
      valueEnum: {
        Y: { text: language('project.open') },
        N: { text: language('project.close') },
      },
    },
    {
      title: language('mconfig.nacpolicy.executiontype'),
      dataIndex: 'type',
      align: 'center',
      ellipsis: true,
      width: 100,
      render: (text, record, index) => {
        let name = '';
        accessModeArr.map((item) => {
          if (item.value == record.type) {
            name = item.label;
          }
        })
        return name;
      },
    },
    {
      title: language('mconfig.nacpolicy.targetofexecution'),
      dataIndex: 'devGroupName',
      align: 'center',
      width: 90,
      ellipsis: true,
    },
    {
      title: language('mconfig.nacpolicy.accessarea'),
      dataIndex: 'areaName',
      align: 'center',
      width: 90,
      ellipsis: true,
    },
    {
      title: language('mconfig.nacpolicy.accessaction'),
      dataIndex: 'visitAction',
      align: 'center',
      ellipsis: true,
      width: 110,
      render: (text, record, index) => {
        let name = '';
        actionList.map((item) => {
          if (item.value == record.visitAction) {
            name = item.label;
          }
        })
        return name;
      },
    },
  ];
  
  const columnsHide = {
    id: { show: false },
  };//设置默认列
  const tableListHeight = clientHeight - 259 > 150 ? clientHeight - 259 : 150;//列表高度
  let devicesID = props.match.params.id;//设置默认设置id
  
  /** table组件  MAC白名单 start */
  const dmwrowKeyDev = (record => record.id);//列表唯一值
  const dmwtableHeightDev = tableListHeight;//列表高度
  const dmwtableKeyDev = 'dmwaptaddrdev';//table 定义的key
  const dmwrowSelectionDev = false;//是否开启多选框
  const dmwaddButtonDev = false; //增加按钮  与 addClick 方法 组合使用
  const dmwdelButtonDev = false; //删除按钮 与 delClick 方法 组合使用
  const [dmwIncIDDev, setDmwIncIDDev] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const dmwcolumnvalueDev = 'dmbaptaddrdevcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const dmwapishowurlDev = '/cfg.php?controller=confMACList&action=showWhiteMACList';//接口路径
  let dmwsearchValDev = { id: devicesID };//顶部搜索框值 传入接口
  /** table组件 end */

  /** table组件  MAC黑名单 start */
  const dmbrowKeyDev = (record => record.id);//列表唯一值
  const dmbtableHeightDev = tableListHeight;//列表高度
  const dmbtableKeyDev = 'dmwaptaddrdev';//table 定义的key
  const dmbrowSelectionDev = false;//是否开启多选框
  const dmbaddButtonDev = false; //增加按钮  与 addClick 方法 组合使用
  const dmbdelButtonDev = false; //删除按钮 与 delClick 方法 组合使用
  const [dmbIncIDDev, setDmbIncIDDev] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const dmbcolumnvalueDev = 'dmbaptaddrdevcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const dmbapishowurlDev = '/cfg.php?controller=confMACList&action=showBlackMACList';//接口路径
  let dmbsearchValDev = { id: devicesID };//顶部搜索框值 传入接口
  /** table组件 end */

  /** table组件  服务器访问白名单 start */
  const dswrowKeyDev = (record => record.id);//列表唯一值
  const dswtableHeightDev = tableListHeight;//列表高度
  const dswtableKeyDev = 'dswwaptaddrdev';//table 定义的key
  const dswrowSelectionDev = false;//是否开启多选框
  const dswaddButtonDev = false; //增加按钮  与 addClick 方法 组合使用
  const dswdelButtonDev = false; //删除按钮 与 delClick 方法 组合使用
  const [dswIncIDDev, setDswIncIDDev] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const dswcolumnvalueDev = 'dswaptaddrdevcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const dswapishowurlDev = '/cfg.php?controller=confServerList&action=showServerList';//接口路径
  let dswsearchValDev = { id: devicesID };//顶部搜索框值 传入接口
  /** table组件 end */

  /** table组件 基础策略 start */
  const carowKey = (record => record.id);//列表唯一值
  const catableHeight = tableListHeight;//列表高度
  const catableKey = 'caauthconfigdev';//table 定义的key
  const carowSelection = true;//是否开启多选框
  const caaddButton = false; //增加按钮  与 addClick 方法 组合使用
  const cadelButton = false; //删除按钮 与 delClick 方法 组合使用
  const [caincID, setCaIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const cacolumnvalue = 'caauthconfigcolumnvalueDev';//设置默认显示的 key 变动 set.strot 存储key
  const caapishowurl = '/cfg.php?controller=confSecDomain&action=showSecDomain';//接口路径
  let casearchVal = { id: devicesID };//顶部搜索框值 传入接口
  /** table组件 end */

  /** table组件 角色权限配置 start */
  const crrowKey = (record => record.id);//列表唯一值
  const crtableHeight = clientHeight;//列表高度
  const crtableKey = 'crroleauthdev';//table 定义的key
  const crrowSelection = false;//是否开启多选框
  const craddButton = false; //增加按钮  与 addClick 方法 组合使用
  const crdelButton = false; //删除按钮 与 delClick 方法 组合使用
  const [crincID, setCrIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const crcolumnvalue = 'crroleauthcolumnvaluedev';//设置默认显示的 key 变动 set.strot 存储key
  const crapishowurl = '/cfg.php?controller=confAuthGroup&action=showAuthGroup';//接口路径
  let crsearchVal = { id: devicesID };//顶部搜索框值 传入接口
  /** table组件 end */

  /** table组件 接入认证策略 start */
  const daarowKey = (record => record.id);//列表唯一值
  const daatableHeight = clientHeight;//列表高度
  const daatableKey = 'daauthenticationdev';//table 定义的key
  const daarowSelection = false;//是否开启多选框
  const daaaddButton = false; //增加按钮  与 addClick 方法 组合使用
  const daadelButton = false; //删除按钮 与 delClick 方法 组合使用
  const [daaincID, setDaaIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const daacolumnvalue = 'daauthenticationcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const daaapishowurl = '/cfg.php?controller=confDot1xPolicy&action=showDot1xPolicy';//接口路径
  let daasearchVal = { id: devicesID };//顶部搜索框值 传入接口
  /** table组件 end */

  /** table组件 注册审核策略 start */
  const nrrowKey = (record => record.id);//列表唯一值
  const nrtableHeight = clientHeight;//列表高度
  const nrtableKey = 'dnregreview';//table 定义的key
  const nrrowSelection = false;//是否开启多选框
  const nraddButton = false; //增加按钮  与 addClick 方法 组合使用
  const nrdelButton = false; //删除按钮 与 delClick 方法 组合使用
  const [nrincID, setNrIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const nrcolumnvalue = 'dnregreviewcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const nrapishowurl = '/cfg.php?controller=confregVerify&action=showpolicy';//接口路径
  let nrsearchVal = { id: devicesID };//顶部搜索框值 传入接口
  /** table组件 end */

  /** table组件 终端入网策略 start */
  const narowKey = (record => record.id);//列表唯一值
  const natableHeight = clientHeight;//列表高度
  const natableKey = 'dnaccterminal';//table 定义的key
  const narowSelection = false;//是否开启多选框
  const naaddButton = false; //增加按钮  与 addClick 方法 组合使用
  const nadelButton = false; //删除按钮 与 delClick 方法 组合使用
  const [naincID, setNaIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const nacolumnvalue = 'dnaccterminalcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const naapishowurl = '/cfg.php?controller=confAdmissionPolicy&action=showadmpolicy';//接口路径
  let nasearchVal = { id: devicesID };//顶部搜索框值 传入接口
  /** table组件 end */

  /** table组件 访问控制策略 start */
  const dnarowKey = (record => record.id);//列表唯一值
  const dnatableHeight = clientHeight;//列表高度
  const dnatableKey = 'dnaaccesscontrol';//table 定义的key
  const dnarowSelection = false;//是否开启多选框
  const dnaaddButton = false; //增加按钮  与 addClick 方法 组合使用
  const dnadelButton = false; //删除按钮 与 delClick 方法 组合使用
  const [dnaincID, setDnaIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const dnacolumnvalue = 'dnaaccesscontrolcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const dnaapishowurl = '/cfg.php?controller=confAccessPolicy&action=showAccessPolicy';//接口路径
  let dnasearchVal = { id: devicesID };//顶部搜索框值 传入接口
  /** table组件 end */

  /** table组件 start */
  const arowKeyDev = (record => record.id);//列表唯一值
  const atableHeightDev = tableListHeight;//列表高度
  const atableKeyDev = 'daptaddrdev';//table 定义的key
  const arowSelectionDev = false;//是否开启多选框
  const aaddButtonDev = false; //增加按钮  与 addClick 方法 组合使用
  const adelButtonDev = false; //删除按钮 与 delClick 方法 组合使用
  const [aincIDDev, setAIncIDDev] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const acolumnvalueDev = 'daptaddrdevcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const aapishowurlDev = '/cfg.php?controller=confBlacklist&action=showWanBlackList';//接口路径
  let asearchValDev = { id: devicesID };//顶部搜索框值 传入接口

  /** table组件 end */

  /** table组件 start */
  const browKeyDev = (record => record.id);//列表唯一值
  const btableHeightDev = tableListHeight;//列表高度
  const btableKeyDev = 'dblickdev';//table 定义的key
  const browSelectionDev = false;//是否开启多选框
  const baddButtonDev = false; //增加按钮  与 addClick 方法 组合使用
  const bdelButtonDev = false; //删除按钮 与 delClick 方法 组合使用
  const [bincIDDev, setBIncIDDev] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const bcolumnvalueDev = 'dblickdevcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const bapishowurlDev = '/cfg.php?controller=confBlacklist&action=showLanBlackList';//接口路径
  let bsearchValDev = { id: devicesID };//顶部搜索框值 传入接口

  /** table组件 end */

  /** table组件 start */
  const wrowKeyDev = (record => record.id);//列表唯一值
  const wtableHeightDev = tableListHeight;//列表高度
  const wtableKeyDev = 'dwhitedev';//table 定义的key
  const wrowSelectionDev = false;//是否开启多选框
  const waddButtonDev = false; //增加按钮  与 addClick 方法 组合使用
  const wdelButtonDev = false; //删除按钮 与 delClick 方法 组合使用
  const [wincIDDev, setWIncIDDev] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const wcolumnvalueDev = 'dwhitedevcolumnvalue';//设置默认显示的 key 变动 set.strot 存储key
  const wapishowurlDev = '/cfg.php?controller=confWhitelist&action=showLanWhiteList';//接口路径
  let wsearchValDev = { id: devicesID };//顶部搜索框值 传入接口

  /** table组件 end */

  return (
    <>
      <Tabs className='lefttabsbox' type="card" tabPosition='left' style={{ height: clientHeight }}>
        <TabPane tab={language('project.mconfig.devices.aptaddr')} key="1">
        <div>
            <Tabs type="card">
              <TabPane tab={language('project.mconfig.devices.aptaddr')} key="11">
              <ProtableModule concealColumns={columnsHide} columns={aptaddrColumns} apishowurl={aapishowurlDev} incID={aincIDDev} clientHeight={atableHeightDev} columnvalue={acolumnvalueDev} tableKey={atableKeyDev} searchVal={asearchValDev} rowkey={arowKeyDev} delButton={adelButtonDev} addButton={aaddButtonDev} rowSelection={arowSelectionDev} />
              </TabPane>
            </Tabs>
          </div>
        </TabPane>
        <TabPane tab={language('cfgmngt.cascdevc.whtblk')} key="2">
          <div>
            <Tabs type="card">
              <TabPane tab={language('project.mconfig.blkwhtl.ipblk')} key="21">
                <ProtableModule concealColumns={columnsHide} columns={blklistColumns} apishowurl={bapishowurlDev} incID={bincIDDev} clientHeight={btableHeightDev} columnvalue={bcolumnvalueDev} tableKey={btableKeyDev} searchVal={bsearchValDev} rowkey={browKeyDev} delButton={bdelButtonDev} addButton={baddButtonDev} rowSelection={browSelectionDev} />
              </TabPane>
              <TabPane tab={language('project.mconfig.blkwhtl.ipwht')} key="22">
                <ProtableModule concealColumns={columnsHide} columns={whtlistColumns} apishowurl={wapishowurlDev} incID={wincIDDev} clientHeight={wtableHeightDev} columnvalue={wcolumnvalueDev} tableKey={wtableKeyDev} searchVal={wsearchValDev} rowkey={wrowKeyDev} delButton={wdelButtonDev} addButton={waddButtonDev} rowSelection={wrowSelectionDev} />
              </TabPane>
              <TabPane tab={language('project.mconfig.blkwhtl.macwht')} key="23">
                <ProtableModule concealColumns={columnsHide} columns={macWhtlistColumns} apishowurl={dmwapishowurlDev} incID={dmwIncIDDev} clientHeight={dmwtableHeightDev} columnvalue={dmwcolumnvalueDev} tableKey={dmwtableKeyDev} searchVal={dmwsearchValDev} rowkey={dmwrowKeyDev} delButton={dmwdelButtonDev} addButton={dmwaddButtonDev} rowSelection={dmwrowSelectionDev} />
              </TabPane>
              <TabPane tab={language('project.mconfig.blkwhtl.macblk')} key="24">
                <ProtableModule concealColumns={columnsHide} columns={macBlklistColumns} apishowurl={dmbapishowurlDev} incID={dmbIncIDDev} clientHeight={dmbtableHeightDev} columnvalue={dmbcolumnvalueDev} tableKey={dmbtableKeyDev} searchVal={dmbsearchValDev} rowkey={dmbrowKeyDev} delButton={dmbdelButtonDev} addButton={dmbaddButtonDev} rowSelection={dmbrowSelectionDev} />
              </TabPane>
              <TabPane tab={language('project.mconfig.blkwhtl.serverwht')} key="25">
                <ProtableModule concealColumns={columnsHide} columns={serverlistColumns} apishowurl={dswapishowurlDev} incID={dswIncIDDev} clientHeight={dswtableHeightDev} columnvalue={dswcolumnvalueDev} tableKey={dswtableKeyDev} searchVal={dswsearchValDev} rowkey={dswrowKeyDev} delButton={dswdelButtonDev} addButton={dswaddButtonDev} rowSelection={dswrowSelectionDev} />
              </TabPane>
            </Tabs>
          </div>
        </TabPane>
        <TabPane tab={language('cfgmngt.cascdevc.basicstrategy')} key="3">
          <div>
            <Tabs type="card">
              <TabPane tab={language('mconfig.cfgpolicy.accessrightsconfiguration')} key="31">
                <ProtableModule concealColumns={columnsHide} columns={authconfigColumns} apishowurl={caapishowurl} incID={caincID} clientHeight={catableHeight} columnvalue={cacolumnvalue} tableKey={catableKey} searchVal={casearchVal} rowkey={carowKey} delButton={cadelButton} addButton={caaddButton} rowSelection={carowSelection} />
              </TabPane>
              <TabPane tab={language('mconfig.cfgpolicy.roleconfiguration')} key="32">
                <ProtableModule concealColumns={columnsHide} columns={roleauthColumns} apishowurl={crapishowurl} incID={crincID} clientHeight={crtableHeight} columnvalue={crcolumnvalue} tableKey={crtableKey} searchVal={crsearchVal} rowkey={crrowKey} delButton={crdelButton} addButton={craddButton} rowSelection={crrowSelection} />
              </TabPane>
            </Tabs>
          </div>
        </TabPane>
        <TabPane tab={language('cfgmngt.cascdevc.terminalstrategy')} key="4">
          <div>
            <Tabs type="card">
              <TabPane tab={language('mconfig.agtpolicy.accessauthenticationpolicy')} key="41">
                <ProtableModule concealColumns={columnsHide} columns={authenticationColumns} apishowurl={daaapishowurl} incID={daaincID} clientHeight={daatableHeight} columnvalue={daacolumnvalue} tableKey={daatableKey} searchVal={daasearchVal} rowkey={daarowKey} delButton={daadelButton} addButton={daaaddButton} rowSelection={daarowSelection} />
              </TabPane>
            </Tabs>
          </div>
        </TabPane>
        <TabPane tab={language('cfgmngt.cascdevc.accessstrategy')} key="5">
          <div>
            <Tabs type="card">
              <TabPane tab={language('mconfig.nacpolicy.registerauditpolicy')} key="1">
                <ProtableModule concealColumns={columnsHide} columns={regreviewColumns} apishowurl={nrapishowurl} incID={nrincID} clientHeight={nrtableHeight} columnvalue={nrcolumnvalue} tableKey={nrtableKey} searchVal={nrsearchVal} rowkey={nrrowKey} delButton={nrdelButton} addButton={nraddButton} rowSelection={nrrowSelection} />
              </TabPane>
              <TabPane tab={language('mconfig.nacpolicy.terminalaccessstrategy')} key="2">
                <ProtableModule concealColumns={columnsHide} columns={accTerminalColumns} apishowurl={naapishowurl} incID={naincID} clientHeight={natableHeight} columnvalue={nacolumnvalue} tableKey={natableKey} searchVal={nasearchVal} rowkey={narowKey} delButton={nadelButton} addButton={naaddButton} rowSelection={narowSelection} />
              </TabPane>
              <TabPane tab={language('mconfig.nacpolicy.accesscontrolpolicy')} key="3">
                <ProtableModule concealColumns={columnsHide} columns={accessControlColumns} apishowurl={dnaapishowurl} incID={dnaincID} clientHeight={dnatableHeight} columnvalue={dnacolumnvalue} tableKey={dnatableKey} searchVal={dnasearchVal} rowkey={dnarowKey} delButton={dnadelButton} addButton={dnaaddButton} rowSelection={dnarowSelection} />
              </TabPane>
            </Tabs>
          </div>
        </TabPane>
      </Tabs>
    </>
  )

}
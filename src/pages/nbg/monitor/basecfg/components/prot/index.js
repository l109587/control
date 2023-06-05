import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { EditableProTable} from '@ant-design/pro-components';
import { Button, Row, Col, Form, Popconfirm, Input, Space, Tag, message } from 'antd';
import { post, get, postAsync } from '@/services/https';
import store from 'store';
import { language } from '@/utils/language';
import '@/utils/index.less';
import './../..//index.less'
import { fetchAuth } from '@/utils/common';
import { regList, regPortList } from '@/utils/regExp'
import { useSelector } from 'umi'

const Configuration = (props) => {
    const contentHeight = useSelector(({ app }) => app.contentHeight)
    const clientHeight = contentHeight / 2 - 197
    const columnvalue = 'basecfgPortTable'
    const writable = fetchAuth()
    const formRef = useRef();
    const actionRef = useRef();
    const actionsecondRef = useRef();
    const [dataSource, setDataSource] = useState([]);
    const [initialValue, setInitialValue] = useState();
    const [editableKeys, setEditableRowKeys] = useState([]);
    const [toptableKeys, setToptableKeys] = useState([]);
    const [tabledata, setTabledata] = useState([]);
    const [topdata, setTopdata] = useState([]);
    const [loading, setLoading] = useState(true);//加载
    const [revise, setRevise] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    const startVal = 1;
    const [totalPage, setTotalPage] = useState(0);//总条数
    const [nowPage, setNowPage] = useState(1);//当前页码
    const limitVal = store.get('pageSize') ? store.get('pageSize') : 10;//默认每页条数
    const [topcolumnHide, settopcolumnHide] = useState(store.get('baseportcolumnvalue') ? store.get('baseportcolumnvalue') : {
        id: { show: false },
    });//设置默认列
    let concealColumnList = {
      id: { show: false },
    }
    const [densitySize, setDensitySize] = useState('middle')

    const topcolumn = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '5%',
            key: 'id'
        },
        {
            title: language('monitor.basecfg.type'),
            width: '6%',
            dataIndex: 'type',
            readonly: true,
            align: 'center',
            key: 'type',
            renderFormItem: (all, { isEditable }) => {
                let record = all.entry;
                let text = '';
                let color = 'cyan';
                if(record.type == 'sys') {
                    color = 'processing';
                    text = language('project.temporary.outreach.sys')
                } else {
                    color = 'cyan';
                    text = language('project.temporary.outreach.cyan')
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
                let color = 'cyan';
                if(record.type == 'sys') {
                    color = 'processing';
                    text = language('project.temporary.outreach.sys')
                } else {
                    color = 'cyan';
                    text = language('project.temporary.outreach.cyan')
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
            title: language('project.devname'),
            dataIndex: 'name',
            width: '12%',
            readonly: revise,
            key: 'name',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: language('project.mandatory'),
                    },
                    {
                        pattern: regList.strmax.regex,
                        message: regList.strmax.alertText,
                    },
                ],
            },
        },
        {
            title: language('monitor.basecfg.ports'),
            dataIndex: 'ports',
            ellipsis: true,
            key: 'ports',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: language('project.mandatory'),
                    },
                    {
                        pattern: regPortList.Uports.regex,
                        message: regPortList.ports.alertText,
                    },
                ],
            },
        },
        {
            title: language('project.operate'),
            valueType: 'option',
            width: '10%',
            align: 'center',
            key: 'option',
            hideInTable: !writable,
            render: (text, record, _, action) => [
                record.type == 'sys' ? (<>
                    <a key="editable" onClick={() => {
                        setRevise(true);
                        var _a;
                        action?.startEditable?.(record.id, { name: record.name })
                        // (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id,record.name);
                    }}>
                        {language('project.deit')}
                    </a>
                </>
                ) : (<><a key="editable" onClick={() => {
                    setRevise(true);
                    var _a;
                    (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id);
                }}>
                    {language('project.deit')}
                </a>
                    <Popconfirm okText={language('project.yes')} cancelText={language('project.no')} title={language('project.delconfirm')} onConfirm={() => {
                        delData(record)
                    }}>
                        <a>{language('project.del')}</a>
                    </Popconfirm></>
                )
            ]
        },
    ]

    useEffect(() => {
        setLoading(true)
        gettopData();
        showTableConf()
    }, [])


    /* 端口配置表格数据数据 */
    const gettopData = (pagestart = '', pagelimit = '') => {
        let page = pagestart != '' ? pagestart : startVal;
        let data = {};
        data.limit = pagelimit != '' ? pagelimit : limitVal;
        data.start = (page - 1) * data.limit;
        post('/cfg.php?controller=monitorManage&action=showGlobalPortConf', data).then((res) => {
            console.log(res)
            if(!res.success) {
                message.error(res.msg);
                return false;
            }
            setLoading(false);
            setTotalPage(res.total)
            setTopdata(res.data)

        }).catch(() => {
            console.log('mistake')
        })
    }

    /* 端口配置删除 */
    const delData = (record) => {
        let data = {};
        data.id = record.id;
        data.name = record.name;
        post('/cfg.php?controller=monitorManage&action=delGlobalPortConf', data).then((res) => {
            if(!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(language('project.messagedel'));
            // setDataSource(dataSource.filter((item) => item.id !== record.id));
            gettopData();
        }).catch(() => {
            console.log('mistake')
        })
    }


    /* 端口配置添加/编辑 */
    const saveTop = (record) => {
        let data = {}
        data.op = record.op == 'add' ? record.op : 'mod';
        data.name = record.name;
        data.id = record.id
        data.ports = record.ports
        post('/cfg.php?controller=monitorManage&action=setGlobalPortConf', data).then((res) => {
            if(!res.success) {
                message.error(res.msg);
                return false
            }
            message.success(res.msg)
            gettopData();
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
      topcolumn?.map((item) => {
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
        settopcolumnHide(concealColumnList)
      }
    } else {
      settopcolumnHide(res.data ? res.data : {})
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
      settopcolumnHide(value);
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
        <div>
            <EditableProTable scroll={{ y: clientHeight }}
                className='outedtable'
                rowKey="id"
                headerTitle={language('project.temporary.outreach.portconfig')}
                bordered={true}
                loading={loading}
                columns={topcolumn}
                value={topdata}
                toolBarRender={() => [
                    !writable ? false : <Button type="primary" style={{ borderRadius: 5, float: 'right' }} onClick={() => {
                        setRevise(false)
                        var _a, _b;
                        (_b = (_a = actionsecondRef.current) === null || _a === void 0 ? void 0 : _a.addEditRecord) === null || _b === void 0 ? void 0 : _b.call(_a, {
                            id: (Math.random() * 1000000).toFixed(0),
                            op: 'add',
                        }, { position: 'top' });
                    }} icon={<PlusOutlined />}>
                        {language('project.temporary.outreach.setnew')}
                    </Button>
                ]}
                options={{
                    reload: function () {
                        setLoading(true);
                        gettopData();
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
                            gettopData(page, pageSize);
                        }, 100)
                    },
                }}
                size={densitySize}
                columnsState={{
                    value: topcolumnHide,
                    persistenceType: 'sessionStorage',
                    onChange: (value) => {
                        // settopcolumnHide(value);
                        store.set('baseportcolumnvalue', value)
                        columnsTableChange(value)
                    },
                }}
                actionRef={actionsecondRef}
                // 关闭默认的新建按钮
                recordCreatorProps={false}
                onChange={setTopdata}
                editable={{
                    form,
                    toptableKeys,
                    onSave: async (rowKey, data, row) => {
                        saveTop(data);
                    },
                    onChange: setToptableKeys,
                    actionRender: (row, config, dom) => [dom.save, dom.cancel],
                }}
            />
        </div>
    )
}

export default Configuration

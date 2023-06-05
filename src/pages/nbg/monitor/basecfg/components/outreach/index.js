import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { EditableProTable} from '@ant-design/pro-components';
import { Button, Row, Col, Form, Popconfirm, Input, Space, Tag, message } from 'antd';
import { post, get, postAsync } from '@/services/https';
import store from 'store';
import '@/utils/index.less';
import './../..//index.less';
import { regList, regPortList, regIpList } from '@/utils/regExp';
import { language } from '@/utils/language';
import { fetchAuth } from '@/utils/common';
import { useSelector } from 'umi'

const Configuration = (props) => {
    let columnvalue = 'basecfgotrTable'
    const contentHeight = useSelector(({ app }) => app.contentHeight)
    const clientHeight = contentHeight / 2 - 197
    const writable = fetchAuth()
    const actionRef = useRef();
    const [dataSource, setDataSource] = useState([]);
    const [editableKeys, setEditableRowKeys] = useState([]);
    const [toptableKeys, setToptableKeys] = useState([]);
    const [tabledata, setTabledata] = useState([]);
    const [revise, setRevise] = useState(false);
    const [loading, setLoading] = useState(true);//加载
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();
    const startVal = 1;
    const [totalPage, setTotalPage] = useState(0);//总条数
    const [nowPage, setNowPage] = useState(1);//当前页码
    const limitVal = store.get('pageSize')?store.get('pageSize'):10;//默认每页条数
    const [columnsHide,setColumnsHide] = useState(store.get('baseoutcolumnvalue') ? store.get('baseoutcolumnvalue') : {
        id:{show:false},
    });//设置默认列
    let concealColumnList = {
      id: { show: false },
    }
    const [densitySize, setDensitySize] = useState('middle')
    
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width:'5%',
        },
        {
            title: language('project.mconfig.equipmentdevtype'),
            width:'6%',
            dataIndex:'type',
            readonly:true,
            align:'center',
            renderFormItem:(all, {isEditable}) => {
                let record = all.entry;
                let text = '';
                let color = 'cyan';
                if(record.type == 'sys'){      
                    color = 'processing';
                    text = language('project.temporary.outreach.sys')
                }else{
                    color = 'cyan';
                    text = language('project.temporary.outreach.cyan')
                }
                return(
                    <Space>
                    <Tag style={{marginRight:0}} color={color} key={record.type}>
                        {text}
                      </Tag>
                    </Space>
                )
            },
            render:(text, record, index) => {
                let color = 'cyan';
                if(record.type == 'sys'){                      
                    color = 'processing';
                    text = language('project.temporary.outreach.sys')
                }else{
                    color = 'cyan';
                    text = language('project.temporary.outreach.cyan')
                }
                return(
                    <Space>
                    <Tag style={{marginRight:0}} color={color} key={record.type}>
                        {text}
                      </Tag>
                    </Space>
                )
            }
        },
        {
            title: language('project.devname'),
            dataIndex: 'name',
            readonly: revise,
            width:'12%',
            formItemProps: {
                rules: [
                    {
                        pattern: regList.strmax.regex,
                        message: regList.strmax.alertText,
                    },
                ],
            },
        },
        {
            title: language('project.temporary.outreach.rptFlag'),
            dataIndex: 'rptFlag',
            width:'12%',
            ellipsis:true,
            formItemProps: {
                rules: [
                    {
                        pattern: regList.numPa8.regex,
                        message: regList.numPa8.alertText,
                    },
                ],
            },
        },
        {
            title: language('project.temporary.outreach.rptAddrv4'),
            dataIndex: 'rptAddrv4',
            width: '15%',
            ellipsis:true,
            formItemProps: {
                rules: [
                    {
                        pattern: regIpList.ipv4.regex,
                        message: regIpList.ipv4.alertText,
                    },
                ],
            },
        },
        {
            title: language('project.temporary.outreach.rptAddrv6'),
            dataIndex: 'rptAddrv6',
            width: '28%',
            ellipsis:true,
            formItemProps: {
                rules: [
                    {
                        pattern: regIpList.ipv6.regex,
                        message: regIpList.ipv6.alertText,
                    },
                ],
            },
        },
        {
            title: language('project.temporary.outreach.rptPort'),
            dataIndex: 'rptPort',
            width: '15%',
            ellipsis:true,
            formItemProps: {
                rules: [
                    {
                        pattern: regPortList.port.regex,
                        message: regPortList.port.alertText,
                    },
                ],
            },
        },
        {
            title: language('project.operate'),
            valueType: 'option',
            width: '10%',
            align:'center',
            hideInTable: !writable,
            render: (text, record, _, action) =>  [
                record.type == 'sys'?(<>
                    <a key="editable" onClick={() => {
                         setRevise(true);
                        var _a;
                            (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id);
                    }}>
                        {language('project.deit')}
                    </a>
                    </>
                ):(<><a key="editable" onClick={() => {
                    setRevise(true);
                            var _a;
                            (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id);
                    }}>
                        {language('project.deit')}
                    </a>
                    <Popconfirm okText={language('project.yes')} cancelText={language('project.no')} title={language('project.delconfirm')} onConfirm={() => {
                                delList(record)
                            }}>
                        <a>{language('project.del')}</a>
                    </Popconfirm></>
                )  
            ]
        },
    ];
    
    useEffect(() => {
        setLoading(true)
        getbottomList();
        showTableConf()
    },[])

    /* 表格数据 start  数据起始值   limit 每页条数  */
    const getbottomList = (pagestart = '',pagelimit = '',) => {
        let page = pagestart != ''?pagestart:startVal;
        let data = {};
        data.limit = pagelimit != ''?pagelimit:limitVal;
        data.start = (page -1) * data.limit;
        post('/cfg.php?controller=monitorManage&action=showOutlineConf',data).then((res) => {
            if(!res.success){
                message.error(res.msg);
                return false;
            }
            setLoading(false);
            if(res.data) {
                setTabledata(res.data)
            }
        }).catch(() => {
            console.log('mistake')
        })
    }

    /* 删除 */
    const delList = (record) => {
        let data = {};
        data.id = record.id;
        data.name = record.name;
        post('/cfg.php?controller=monitorManage&action=delOutlineConf',data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(res.msg);
            setDataSource(dataSource.filter((item) => item.id !== record.id));
            getbottomList();
        }).catch(() => {
            console.log('mistake')
        })
    }


    /* 添加/编辑 */
    const save = (record) => {
        let data = {}
        data.op = record.op == 'add'?record.op:'mod';
        data.name = record.name;
        data.id = record.id
        data.rptFlag = record.rptFlag
        data.rptAddrv4 = record.rptAddrv4
        data.rptAddrv6 = record.rptAddrv6
        data.rptPort = record.rptPort
        post('/cfg.php?controller=monitorManage&action=setOutlineConf',data).then((res) => {
            if (!res.success) {
                message.error(res.msg);
                return false
            }
            message.success(res.msg)
            getbottomList();
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

  return (
    <div>
        <EditableProTable scroll={{ y: clientHeight }}
            className='outedtable'
            rowKey="id" 
            headerTitle={language('project.temporary.outreach.outconfig')}
            bordered={true}
            loading={loading}
            toolBarRender={() => [
                !writable ? false : <Button type="primary" style={{ borderRadius:5, float:'right' }} onClick={() => {
                    setRevise(false)
                    var _a, _b;
                    (_b = (_a = actionRef.current) === null || _a === void 0 ? void 0 : _a.addEditRecord) === null || _b === void 0 ? void 0 : _b.call(_a, {
                        id: (Math.random() * 1000000).toFixed(0),
                        op:'add',
                    },{position:'top'});
                }} icon={<PlusOutlined />}>
                    {language('project.temporary.outreach.setnew')}
                </Button>
            ]}
            options = {{
                reload:function(){
                    setLoading(true);
                    getbottomList();
                }
            }} 
            size={densitySize}
            pagination={{
                showSizeChanger:true,
                pageSize:limitVal,
                current:nowPage,
                total:totalPage,
                showTotal: total => language('project.page', {total:total}),
                onChange: (page,pageSize) =>{
                    clearTimeout(window.timer);
                    window.timer = setTimeout(function () {
                        setNowPage(page);
                        store.set('pageSize',pageSize)
                        getbottomList(page,pageSize);
                    },100)
                },
            }}
            columnsState={{
                value: columnsHide,
                persistenceType: 'sessionStorage',
                onChange:(value)=>{   
                    // setColumnsHide(value);
                    store.set('baseoutcolumnvalue',value)
                    columnsTableChange(value)
                },
            }} 
            onSizeChange={(e) => {
              sizeTableChange(e);
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

    </div>
  )
}

export default Configuration

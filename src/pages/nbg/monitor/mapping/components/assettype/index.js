import React, { useRef,useState ,useEffect } from 'react';
import ProTable, { EditableProTable, ProCard, ProFormField, ProFormRadio } from '@ant-design/pro-components';
import { Button, Input ,message, Popconfirm } from 'antd';
import { post, get, postAsync } from '@/services/https';
import {  PlusOutlined } from '@ant-design/icons';
import iconMap from 'utils/iconMap'
import { language } from '@/utils/language';
import store from 'store';
import iconTypeList from '@/utils/IconType.js';
import '@/utils/index.less';
import './../../index.less';
import './index.less'
import WebUploadr from '@/components/Module/webUploadr'
import { fetchAuth } from '@/utils/common';
import { useSelector } from 'umi'
import { regList } from '../../../../../../utils/regExp';

const { Search } = Input

export default (props) => {
    const contentHeight = useSelector(({ app }) => app.contentHeight)
    const clientHeight = contentHeight - 240
    const writable = fetchAuth()
    const [editableKeys, setEditableRowKeys] = useState([]);//编辑框id
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys,setSelectedRowKeys] = useState([]) ;//选中id数组
    const [dataList,setDataList] = useState([]) ;//选中id数组
    const [queryVal, setQueryVal] = useState('');//搜索值
    const [totalPage, setTotalPage] = useState(0);//总条数
    const [nowPage, setNowPage] = useState(1);//当前页码
    const actionsecondRef =useRef();
    const [loading, setLoading] = useState(true);//加载
    const [columnsHide, setColumnsHide] = useState(store.get('asstypecolumnvalue') ? store.get('asstypecolumnvalue') : {
    });//设置默认列
    const [confirmLoading, setConfirmLoading] = useState(false);
    const startVal = 1;
    const limitVal = store.get('pageSize')?store.get('pageSize'):10;//默认每页条数
    const renderRemove = (text,record) => (
        <Popconfirm onConfirm={() => {delList(record,text)}} key="popconfirm" 
            title={language('project.delconfirm')}   
            okButtonProps={{
            loading: confirmLoading,
            }} okText={language('project.yes')} cancelText={language('project.no')}>
            <a>{text}</a>
        </Popconfirm>
    );
   
    const columns1 = [
        {
            title: language('project.sysconf.analysis.cardtitleid'),
            dataIndex: 'id',
            width: '22%',
            ellipsis:true,
            hideInTable:true,
        },
        {
            title: language('project.sysconf.analysis.assetgrouping'),
            dataIndex: 'group',
            width: '22%',
            ellipsis:true,
            hideInTable:true,
        },

        {
            title: language('project.sysconf.analysis.assetgrouping'),
            dataIndex: 'groupId',
            width: 200,
            ellipsis:true,
            valueType: 'select',
        },
        {
            title: language('project.sysconf.analysis.cardtype'),
            dataIndex: 'name',
            width: 180,
            ellipsis: true,
            formItemProps: {
                rules: [
                    {
                        pattern: regList.strmax.regex,
                        message: regList.strmax.alertText
                    }
                ]
            },
            render: (text, record, index) => {
                return [
                    <div style={{ display: 'flex', alignItems: 'center', }}>
                        <div style={{ marginTop: 1 }}>{iconTypeList(record.icon)}</div><div style={{ width: 5 }}></div><>{record.name}</>
                    </div>
                ]; 
            },
        },
        {
            title: language('project.sysconf.analysis.fingerprintnum'),
            dataIndex: 'count',
            width: 180,
            readonly: true,
            ellipsis:true,
        },
        {
            title: language('project.sysconf.analysis.attribute'),
            dataIndex: 'property',
            readonly: true,
            ellipsis:true,
            width: 240,
            renderFormItem:(value, {isEditable}) => {
                if (value.entry.property == 0) {
                    return language("project.sysconf.analysis.system" );
                } else {
                    return language("project.sysconf.analysis.custom");
                }
            },
            render: (text, record, index) => {
                if (record.property == 0) {
                    return language("project.sysconf.analysis.system");
                } else {
                    return language("project.sysconf.analysis.custom");
                }
            },
        },
       
        {
            title: language('project.mconfig.operate'),
            valueType: 'option',
            width: 140,
            align: 'center',
            hideInTable: !writable,
            render: (text, record, _, action) => [
                record.property == 1 ?(<a key="editable" onClick={() => {
                        var _a;
                        (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id);
                    }}>
                        {language("project.deit")}
                </a>):(''),
                 record.property == 1 ?(
                  renderRemove(language("project.del"),record)
               ):(''),
                                      
            ],
        },
    ];
    const [columns, setColumns] = useState(columns1);
    const [densitySize, setDensitySize] = useState('middle')
    const concealColumns = {}
    let concealColumnList = concealColumns
    let columnvalue = 'assetTypeTable'
    useEffect(()=>{
      showTableConf()
      assetType();
    },[])
    const assetType = ()=>{
        let data = {};
        data.start = 0;
        data.limit = -1;
        post('/cfg.php?controller=assetMapping&action=showAssetGroupList',data).then((res) => {
            let info = {};
            res.data.map((item)=>{
                var  a =item.id;
                info[a] = {text:item.text,status:item.id}
            })
            columns1.map((item)=>{
                if(item.dataIndex == 'groupId'){
                    item.valueEnum = info;
                }
            })
            setColumns(columns1)
            getList();
        }).catch(() => {
            console.log('mistake')
        })
    }
    //start  数据起始值   limit 每页条数 
    const getList = (pagestart = '',pagelimit = '',value = '')=>{
        let page = pagestart != ''?pagestart:startVal;
        let  data = {};
        data.queryVal = value != ''?value:queryVal;
        data.limit = pagelimit != ''?pagelimit:limitVal;
        data.start = (page -1) * data.limit;
        post('/cfg.php?controller=assetMapping&action=showAssetTypeList',data).then((res) => {
            setLoading(false);
            setTotalPage(res.total)
            setDataList(res.data)
        }).catch(() => {
            console.log('mistake')
        })
    }

    //删除功能
    const delList = (record)=>{
        let data = {};
        data.id = record.id;
        data.name = record.name;
        post('/cfg.php?controller=assetMapping&action=delAssetTypeInfo',data).then((res) => {
            if(!res.success){
                message.error(res.msg);
                return false;
            }
            setDataSource(dataSource.filter((item) => item.id !== record.id));
            getList()
        }).catch(() => {
            console.log('mistake')
        })
    }

    //更新修改功能
    const save = (record)=>{
        let data = {};
        data.groupId = record.groupId;
        data.id = record.op != 'add'?record.id:'';
        data.name = record.name;
        data.op = record.op == 'add'?record.op:'mod';
        post('/cfg.php?controller=assetMapping&action=setAssetTypeInfo',data).then((res) => {
            if(!res.success){
                message.error(res.msg);
                return false;
            }
            getList(startVal)
        }).catch(() => {
            console.log('mistake')
        })
    }

    //搜索
    const handsearch = (values) => {
        setQueryVal(values);
        getList(startVal,limitVal,values);
    }
    //选中触发
    const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
        // setRecord(record)//选中行重新赋值
        // setSelectedRowKeys(selectedRowKeys)
        let deletestatus = true;
        if(selectedRowKeys != false){
            deletestatus = false;
        }
        // setipDelStatus(deletestatus);//添加删除框状态
    }
    const updateFinish = (params) =>{
        if(params.success){
          params.msg&&message.success(params.msg)
          assetType()
        }else{
          params.msg&&message.error(params.msg)
        }
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

    return (<>
        <EditableProTable 
            className='edittablelist'
            scroll={{ y: clientHeight }}
            //单选框选中变化
            rowSelection={{
                columnWidth: 25,
                selectedRowKeys,
                onChange: onSelectedRowKeysChange,
                getCheckboxProps: (record) => ({
                    disabled: record.from === 'remote',
                    // name: record.name,
                }),
            }} 
            rowKey="id" 
            bordered={true}
            columnEmptyText = {false}
            //边框
            cardBordered={true}
            toolBarRender={() => [
                !writable ? false : <WebUploadr
                    isAuto={true}
                    upbutext={language('monitor.mapping.upload')}
                    maxSize={10000000000}
                    upurl="/cfg.php?controller=assetMapping&action=ImportAssetFinge"
                    isShowUploadList={false}
                    maxCount={1}
                    onSuccess={updateFinish}
                    isUpsuccess={true}
                    buttonType='primary'
                />
        ]}
        actionRef={actionsecondRef}
            // 关闭默认的新建按钮
            recordCreatorProps={false}
            //loading 加载
            loading={loading} 
            columns={columns} 
            //右边密度搜索 功能
            options = {{
                reload:function(){
                    setLoading(true)
                    getList(startVal)
                }
            }}
            dateFormatter="string" 
            headerTitle={ 
                <Search
                    allowClear
                    placeholder={language('monitor.mapping.asstypeList.searchText')}
                    style={{ width: 200}}
                    onSearch={(queryVal)=>{
                    setNowPage(1);
                    handsearch(queryVal)
                }}
                />
            }
            //分页功能
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
                        getList(page,pageSize);
                    },100)
                },
            }}
            size={densitySize}

             //设置列操作
             columnsState={{
                value: columnsHide,
                persistenceType: 'sessionStorage ',
                onChange: (value) => {
                    columnsTableChange(value)
                    // setColumnsHide(value)
                    store.set('asstypecolumnvalue',value)
                },
            }}
            onSizeChange={(e) => {
              sizeTableChange(e);
            }}
            //页面数据信息
            value={dataList} 
            onChange={setDataList} 
            editable={{
            type: 'multiple',
            editableKeys,
            actionRender: (row, config, defaultDom) => {
                return [
                    defaultDom.save,
                    defaultDom.cancel,
                  ];
            },
            //保存信息
            onSave: async (rowKey, data, row) => {
                save(data);
            },
            onChange: setEditableRowKeys,
        }}/>
    </>);
};

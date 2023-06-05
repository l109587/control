import React, { useRef,useState ,useEffect } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import { Input ,message } from 'antd';
import { post,get } from '@/services/https';
import store from 'store';
import '@/utils/index.less';
import { language } from '@/utils/language';
import { fetchAuth } from '@/utils/common';
import { useSelector } from 'umi'
import { regIpList, regList } from '../../../../utils/regExp';

const { Search } = Input
export default () => {
    const contentHeight = useSelector(({ app }) => app.contentHeight)
    const clientHeight = contentHeight - 262
    const writable = fetchAuth()
    const [editableKeys, setEditableRowKeys] = useState([]);//编辑框id
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys,setSelectedRowKeys] = useState([]) ;//选中id数组
    const [dataList,setDataList] = useState([]) ;//选中id数组
    const [queryVal, setQueryVal] = useState('');//搜索值
    const [totalPage, setTotalPage] = useState(0);//总条数
    const [nowPage, setNowPage] = useState(1);//当前页码
    const [loading, setLoading] = useState(true);//加载
    const [columnsHide, setColumnsHide] = useState(store.get('apiauthcolumnvalue') ? store.get('apiauthcolumnvalue') : {});//设置默认列

    const startVal = 1;
    const limitVal = store.get('pageSize')?store.get('pageSize'):10;//默认每页条数
    const queryType = 'fuzzy';//默认模糊查找

    const validatorFn = (value, callback) => {
        if (value) {
            let reg = regIpList.signIPV4OrIPV6.regex;
            let values = value.split(';');
            let isCheck = []
            values.map((item, index) => {
                isCheck.push(reg.test(item))  
            })
            if (isCheck.indexOf(false) != -1) {
                callback(language('project.IPV4sOrIPV6'))
            } else {
                callback()
            }
        } else {
            callback()
        }
    }

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            width: '15px',
            hideInTable:true,
        },
        {
            title:  language('project.devname'),
            dataIndex: 'name',
            width: '12%',
            ellipsis:true,
            formItemProps: (form, { rowKey, rowIndex  }) => {
                return {
                  rules: rowKey > 1 ? [
                    { required: true, message:  language('project.mandatory') },
                    {
                        pattern: regList.strmax.regex,
                        message: regList.strmax.alertText
                    }
                  ] : [],
                };
            },
        },

        {
            title: language('project.sysconf.apiauth.ipaddrs'),
            dataIndex: 'ipAddrs',
            width: '16%',
            ellipsis:true,
            formItemProps: {
                rules: [
                    {
                        validator: (rule, value, callback) => {
                            validatorFn(value, callback)
                        }
                    }
                ]
            }
        },
        {
            title: language('project.sysconf.apiauth.validtime'),
            dataIndex:'validTime',
            width: '10%',
            ellipsis:true,
            tip: language('sysconf.apiauth.validTimeTip'),
            formItemProps: {
                rules: [
                    {
                        pattern: regList.onlyNum.regex,
                        message: regList.onlyNum.alertText
                    },
                    {
                        validator: (rule, value) => {
                            if (Number(value) < 1 || 9999 < Number(value)) {
                                return Promise.reject(new Error(language('sysconf.apiauth.validTime.numMsg')))
                            } else {
                                return Promise.resolve()
                            }
                        }
                    }
                ]
            }
        },
        {
            title:'apiKey',
            dataIndex: 'key',
            width: '20%',
            readonly: true,
            ellipsis:true,
        },
        {
            title:'Token',
            dataIndex: 'token',
            width: '30%',
            align:'center',
            readonly: true,
        },
        {
            title: language('project.sysconf.apiauth.tokentime'),
            dataIndex: 'time',
            align:'center',
            width: '15%',
            readonly: true,
            tip: language('sysconf.apiauth.imeTip')
        },
        {
            title: language('project.mconfig.operate'),
            valueType: 'option',
            width: '12%',
            align: 'center',
            fixed: 'right',
            hideInTable:!writable,
            render: (text, record, _, action) => [
                record.token?(''):(<> 
                    <a key="editable"  onClick={() => {
                            var _a;
                            (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id);
                        }}>
                   {language('project.deit')}
                    </a>
                    <a key="delete"
                        onClick={() => {
                                delList(record)
                        }}>
                       {language('project.del')}
                    </a></>
                )
            ],
        },
    ];
    useEffect(()=>{
        getList();       
    },[])
    //start  数据起始值   limit 每页条数 
    const getList = (pagestart = '',pagelimit = '',value = '')=>{
        setLoading(true);
        let page = pagestart != ''?pagestart:startVal;
        let  data = {};
        data.queryVal = value != ''?value:queryVal;
        data.limit = pagelimit != ''?pagelimit:limitVal;
        data.start = (page -1) * data.limit;
        data.queryType = queryType;
        post('/cfg.php?controller=confApiAuthorize&action=showApiAuthorize',data).then((res) => {
            setLoading(false);
            if(!res.success){
                setTotalPage(0)
                setDataList([])
                message.error(res.msg);
                return false;
            }else{
                res.data.forEach((item, index) => { 
                    res.data[index].ipAddrs = item.ipAddrs.join(';');
                    if(item.children.length < 1){
                        res.data[index].children = undefined;
                    }
                })
                setTotalPage(res.total)
                setDataList(res.data)
            }
            
        }).catch(() => {
            console.log('mistake')
        })
    }
    //删除功能
    const delList = (record)=>{
        let data = {};
        data.ids = record.id;
        console.log(data)
        post('/cfg.php?controller=confApiAuthorize&action=delApiAuthorize',data).then((res) => {
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
        data.ipAddrs = record.ipAddrs;
        data.id = record.op == 'add'?'':record.id;
        data.name = record.name;
        data.validTime = record.validTime;
        data.op = record.op == 'add'?record.op:'mod';
        console.log(record)
        console.log(data)
        post('/cfg.php?controller=confApiAuthorize&action=setApiAuthorize',data).then((res) => {
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
    return (<>
        <EditableProTable 
            scroll={{ y: clientHeight }}
            //单选框选中变化
            rowSelection={{
                selectedRowKeys,
                onChange: onSelectedRowKeysChange,
                getCheckboxProps: (record) => ({
                    disabled: record.from === 'remote',
                    name: record.name,
                }),
            }} 


            rowKey="id" 
            bordered={true}
            columnEmptyText = {false}
            //边框
            cardBordered={true}

            //新增一条
            recordCreatorProps={{
                style:{
                    display:!writable?'none':'block'
                },
                position: 'top',
                record: () => ({ id: (Math.random() * 1000000).toFixed(0),op:'add'}),
            }} 
            //loading 加载
            loading={loading} 
            toolBarRender={() => [
            ]}
            columns={columns} 
            //右边密度搜索 功能
            options = {{
                reload:function(){
                    getList(startVal)
                }
            }}
            dateFormatter="string" 
            headerTitle={ 
                <Search
                    placeholder={language('project.sysconf.apiauth.tablesearch')}
                    style={{ width: 200}}
                    onSearch={(queryVal)=>{
                    setNowPage(1);
                    handsearch(queryVal)
                }}
                />
            }
            columnsState={{
                value: columnsHide,
                onChange: (value) => {
                    setColumnsHide(value);
                    store.set('apiauthcolumnvalue', value)
                },
            }}
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
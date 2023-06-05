import React, { useRef,useState ,useEffect } from 'react';
import { LaptopOutlined, HddOutlined, ClusterOutlined, CameraTwoTone, PrinterTwoTone, SafetyCertificateTwoTone, FileUnknownTwoTone, PlaySquareOutlined, TabletTwoTone, MobileOutlined } from '@ant-design/icons';
import ProTable, { EditableProTable, ProCard, ProFormField, ProFormRadio } from '@ant-design/pro-components';
import { Button, Input ,message } from 'antd';
import { post,get } from '@/services/https';
import { formatMessage, useIntl, FormattedMessage } from 'umi';
import iconMap from 'utils/iconMap'
import store from 'store';
import '@/utils/index.less';
import './index.less';
let H = document.body.clientHeight - 350
var clientHeight = H
const { Search } = Input
export default () => {
    const [editableKeys, setEditableRowKeys] = useState([]);//编辑框id
    const [dataSource, setDataSource] = useState([]);
    const [selectedRowKeys,setSelectedRowKeys] = useState([]) ;//选中id数组
    const [dataList,setDataList] = useState([]) ;//选中id数组
    const [queryVal, setQueryVal] = useState('');//搜索值
    const [totalPage, setTotalPage] = useState(0);//总条数
    const [nowPage, setNowPage] = useState(1);//当前页码
    const [loading, setLoading] = useState(true);//加载
    const startVal = 1;
    const limitVal = store.get('pageSize')?store.get('pageSize'):10;//默认每页条数
    const queryType = 'fuzzy';//默认模糊查找
    const [columnsHide, setColumnsHide] = useState(store.get('reportcolumnvalue') ? store.get('reportcolumnvalue') : {});//设置默认列
    const columns = [
        {
            title: formatMessage({id:'project.sysconf.escalationconfigure.id'}),
            dataIndex: 'id',
            width: '15px',
            ellipsis:true,
            hideInTable:true,
        },
        {
            title: formatMessage({id:'project.sysconf.escalationconfigure.name'}),
            dataIndex: 'name',
            width: '22%',
            ellipsis:true,
            formItemProps: (form, { rowKey, rowIndex  }) => {
                return {
                  rules: rowKey > 1 ? [{ required: true, message: '此项为必填项' }] : [],
                };
            },
        },

        {
            title: formatMessage({id:'project.sysconf.escalationconfigure.ip'}),
            dataIndex: 'ip',
            width: '22%',
            ellipsis:true,
        },
        {
            title: formatMessage({id:'project.sysconf.escalationconfigure.protocol'}),
            dataIndex: 'protocol',
            width: '22%',
            ellipsis:true,
            valueType: 'select',
            valueEnum: {
                // TCP: { text: 'TCP', status: 'TCP' },
                UDP: {
                  text: 'UDP',
                  status: 'UDP',
                }
            },
        },
        {
            title: formatMessage({id:'project.sysconf.escalationconfigure.port'}),
            dataIndex: 'port',
            width: '22%',
            ellipsis:true,
        },
        {
            title: formatMessage({id:'project.mconfig.operate'}),
            valueType: 'option',
            width: '12%',
            align: 'center',
            render: (text, record, _, action) => [
                <a key="editable" onClick={() => {
                        var _a;
                        (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id);
                    }}>
                   <FormattedMessage id="project.deit" />
                </a>,
                <a key="delete"
                    onClick={() => {
                            delList(record)
                    }}>
                    <FormattedMessage id="project.del" />
                </a>,
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
        post('/cfg.php?controller=confLog&action=showLogReport',data).then((res) => {
            setLoading(false);
            if(!res.success){
                setTotalPage(0)
                setDataList([])
                message.error(res.msg);
                return false;
            }else{
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
        data.name = record.name;
        post('/cfg.php?controller=confLog&action=delLogReport',data).then((res) => {
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
        console.log(record)
        let data = {};
        data.ip = record.ip;
        data.id = record.op == 'add'?'':record.id;
        data.name = record.name;
        data.port = record.port;
        data.protocol = record.protocol;
        data.op = record.op == 'add'?record.op:'mod';
        post('/cfg.php?controller=confLog&action=setLogReport',data).then((res) => {
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
                    // name: record.name,
                }),
            }} 

            rowKey="id" 
            bordered={true}
            columnEmptyText = {false}
            //边框
            cardBordered={true}

            //新增一条
            recordCreatorProps={{
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
                    placeholder={formatMessage({id:'project.mconfig.report.tablesearch'})}
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
                    store.set('reportcolumnvalue', value)
                },
            }}
            //分页功能
            pagination={{
                showSizeChanger:true,
                pageSize:limitVal,
                current:nowPage,
                total:totalPage,
                showTotal: total => <FormattedMessage id="project.page" values={{ total: total}} />,
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
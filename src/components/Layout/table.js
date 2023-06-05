import React, { useRef,useState ,useEffect} from 'react';
import { Button, Input } from 'antd';
import { post,get } from '@/services/https';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { formatMessage, useIntl, FormattedMessage } from 'umi';
import moment from 'moment';
import { DatePicker } from 'antd';
import '@/utils/box.less';
import store from 'store';
const { Search } = Input;

let H = document.body.clientHeight - 301
var clientHeight = H


const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD HH:mm:ss';


const Table = (props) => {
    const [dataList,setList] = useState([]) ;
    const actionRef = useRef();
    const [reloadDL, setReloadDL] = useState(0);//刷新
    const [queryVal, setQueryVal] = useState('');//搜索值
    const [totalPage, setTotalPage] = useState(0);//总条数
    const [nowPage,setNowPage] = useState(1);//当前页码
    const [loading,setLoading] = useState(true);//加载
    const [olddata,setOlddata] =useState(moment().subtract(1, "months").format(dateFormat)); 
    const [newdata,setNewdata] = useState(moment().format(dateFormat));
    const startVal = 1;
    const [filters, setFilters] = useState({});
    const initLtVal = store.get('pageSize') ? store.get('pageSize') : 20;
    const [limitVal, setLimitVal] = useState(initLtVal);// 每页条目
    const queryType = 'fuzzy';//默认模糊查找
    
    const [columnsHide,setColumnsHide] = useState({
        devid:{show:false},
    });//设置默认列


    useEffect(() => {
        getList()
     }, [nowPage, queryVal, filters, limitVal ])
   
     
    const getList = ()=>{
        setLoading(true);
        let page = nowPage;
        let  data = {};
        data.queryVal = queryVal;
        data.limit = limitVal;
        data.start = (page -1) * data.limit;
        data.queryType = queryType;
        data.begDate = olddata;
        data.endDate = newdata;
        data.filters = filters;
        post(props.apiurl, data).then((res) => {
            setLoading(false);
            setTotalPage(res.total)
            setList([...res.data]);
        }).catch(() => {
            console.log('mistake')
        })
      }

      //搜索
      const handsearch = (values) => {
        setQueryVal(values);
    }
 
    return (
    <div> 
        <ProTable
        columns={props.columns} 
        dataSource={dataList}
        scroll={{ y: clientHeight }}

        columnEmptyText = {false}
        //边框
        loading = {loading}
        bordered={true}
        rowkey = 'id'

        //设置选中提示消失
        tableAlertRender={false} 

        
        // actionRef={actionRef}  
        //页面数据信息
        // dataSource={dataList}
            
        editable={{
                type: 'multiple',
            }} 
        //设置列操作
        columnsState={{
            value: columnsHide,
            persistenceKey: props.setcolumnKey,
            persistenceType: 'sessionStorage ',
            onChange:(value)=>{   
                setColumnsHide(value);
            },
        }} 
            
        rowKey="id" 
        //头部搜索框关闭
        search={false}
        form={{
            // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
            syncToUrl: (values, type) => {
                if (type === 'get') {
                    return Object.assign(Object.assign({}, values), { created_at: [values.startTime, values.endTime] });
                }
                return values;
            },
        }}
        onChange={(paging, filters) => {
            setFilters(JSON.stringify(filters));
            setLimitVal(paging.pageSize);
            setNowPage(paging.current);
            store.set('pageSize', paging.pageSize)
        }}
        pagination={{
            showSizeChanger:true,
            pageSize:limitVal,
            // page:startVal,
            current:nowPage,
            total:totalPage,
            showTotal: total => <FormattedMessage id="project.page" values={{ total: total}} />,
        }}
        options = {{
            setting: true,
            reload:function(){
                setNowPage(1);
                setReloadDL(reloadDL + 1);
            }
        }}
        // dateFormatter="string" 
        headerTitle={ 
            <div style={{ display:'flex',justifyContent:'space-around',alignItems:'center' }} >
            <Search                                             
            placeholder={formatMessage({id:props.language})}   
            style={{ width: 200, height:30 }} 
            onSearch={(queryVal)=>{
                setNowPage(1);
                handsearch(queryVal)
            }}
        />
            <div style={{marginLeft: 20,marginBottom:0 }}>
                <RangePicker showTime={{ format: 'HH:mm:ss' }}
                    defaultValue={[moment(olddata, dateFormat),
                    moment(newdata, dateFormat)]}
                    format={dateFormat}
                    onChange = {(val,time)=>{
                        setNewdata(time[1])
                        setOlddata(time[0])
                    }}
                />
            </div>
        </div>  
        }
        /> 
    </div>
        );
};
export default Table

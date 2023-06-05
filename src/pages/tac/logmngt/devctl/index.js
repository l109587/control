import React, { useRef,useState ,useEffect} from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { post,get } from '@/services/https';
import { ProTable, EditableProTable } from '@ant-design/pro-components';
import '@/utils/box.less';
import store from 'store';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import { language } from '@/utils/language';
import { DatePicker, Input, Space } from 'antd';
import { TableLayout } from '@/components';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { RangePicker } = DatePicker;
let H = document.body.clientHeight - 301
var clientHeight = H

export default () => {
    const columns = [
        {
            disable: true,
            width: 180,
            title: language('project.logmngt.time'),
            dataIndex: 'time',
            filters: true,
            onFilter: true,
            hideInSearch: true,
            align: 'center',
        },
        {
            width: 180,
            title: language('project.logmngt.devctl.devip'),
            dataIndex: 'devip',
            align: 'center',
        },
        {
            disable: true,
            width: 200,
            title: language('project.devid'),
            dataIndex: 'devid',
            filters: true,
            onFilter: true,
            hideInSearch: true,
            align: 'center',
            ellipsis:true,
        },
        {
            disable: true,
            width: 300,
            title: language('project.logmngt.devname'),
            dataIndex: 'devname',
            filters: true,
            onFilter: true,
            hideInSearch: true,
            align: 'center',
            ellipsis:true,
        },
        {
            disable: true,
            width: 160,
            title: language('project.logmngt.devactions'),
            dataIndex: 'event',
            filters: true,
            onFilter: true,
            hideInSearch: true,
            align: 'center',
        },
        {
            width: 180,
            title: language('project.logmngt.devctl.ip'),
            dataIndex: 'ip',
            align: 'center',
        },
        {
            disable: true,
            title: language('project.logmngt.devdetails'),
            dataIndex: 'details',
            filters: true,
            onFilter: true,
            hideInSearch: true,
            align: 'left',
            ellipsis:true,
        },
    ];

    const dateFormat = 'YYYY/MM/DD HH:mm:ss';
    const setcolumnKey = 'pro-table-singe-demos-devctl';
    const tableKey = 'logdevctl'
    const [olddate, setOlddate] = useState(moment().subtract(1, "months").format(dateFormat));
    const [newdate, setNewdate] = useState(moment().format(dateFormat));
    const [queryVal, setQueryVal] = useState();//首个搜索框的值
    let searchVal = { value: queryVal, type: 'fuzzy', begDate: olddate, endDate: newdate };//顶部搜索框值 传入接口
    const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
    const apishowurl = '/cfg.php?controller=log&action=showControllog';
    const columnvalue = 'dtlcolumnvalue';
    const concealColumns = {
        devid: { show: false },
    }

    const tableTopSearch = () => {
        return (
            <Space>
                <Search
                    placeholder={language('project.mconfig.devctl.tablesearch')}
                    style={{ width: 200 }}
                    onSearch={(queryVal) => {
                        setQueryVal(queryVal)
                        setIncID(incID + 1)
                    }}
                />
                <RangePicker showTime={{ format: 'HH:mm:ss' }}
                    defaultValue={[moment(olddate, dateFormat),
                    moment(newdate, dateFormat)]}
                    format={dateFormat}
                    onChange={(val, time) => {
                        setNewdate(time[1])
                        setOlddate(time[0])
                        setIncID(incID + 1)
                    }}
                />
            </Space>
        )
    }
    return (
        <div> 
           <ProtableModule clientHeight={clientHeight} concealColumns={concealColumns} searchText={tableTopSearch()} searchVal={searchVal} incID={incID} tableKey={tableKey} columns={columns} apishowurl={apishowurl} setcolumnKey={setcolumnKey} columnvalue={columnvalue} olddate={olddate} newdate={newdate} />
        </div>
        );
};

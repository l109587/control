import React, { useRef, useState, useEffect } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ProTable, EditableProTable } from '@ant-design/pro-components';
import { DatePicker, Input, Space } from 'antd';
import ProCard from '@ant-design/pro-card';
import { post, get } from '@/services/https';
import '@/utils/box.less';
import moment from 'moment';
import store from 'store';
import { PlusOutlined } from '@ant-design/icons';
import { language } from '@/utils/language';
import { TableLayout } from '@/components';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD HH:mm:ss';
let H = document.body.clientHeight - 301
var clientHeight = H

export default () => {


    const columns = [
        {
            disable: true,
            width: 180,
            title: language('project.logmngt.time'),
            dataIndex: 'time',
            align: 'center',
        },
        {
            disable: true,
            width: 180,
            title: language('project.devid'),
            dataIndex: 'devid',
            align: 'center',
            ellipsis: true,
        },
        {
            disable: true,
            title: language('project.devip'),
            dataIndex: 'devip',
            align: 'center',
            width: 180,
            ellipsis: true,
        },
        {
            disable: true,
            title: language('project.logmngt.devname'),
            dataIndex: 'devname',
            align: 'center',
            width: 160,
            ellipsis: true,
        },
        {
            disable: true,
            title: language('project.logmngt.devactions'),
            dataIndex: 'event',
            align: 'center',
            width: 160,
            ellipsis: true,
        },
        {
            disable: true,
            title: language('project.logmngt.devdetails'),
            dataIndex: 'details',
            align: 'left',
            ellipsis: true,
        },
    ];
    const tableKey = 'logdevice'
    const setcolumnKey = 'pro-table-singe-demos-device';
    const [olddate, setOlddate] = useState(moment().subtract(1, "months").format(dateFormat));
    const [newdate, setNewdate] = useState(moment().format(dateFormat));
    const [queryVal, setQueryVal] = useState();//首个搜索框的值
    let searchVal = { value: queryVal, type: 'fuzzy', begDate: olddate, endDate: newdate };//顶部搜索框值 传入接口
    const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
    const apishowurl = '/cfg.php?controller=log&action=showDevicelog';
    const columnvalue = 'devcolumnvalue';
    const concealColumns = {
        devid: { show: false },
    }

    const tableTopSearch = () => {
        return (
            <Space>
                <Search
                    placeholder={language('project.mconfig.device.tablesearch')}
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
            <ProtableModule concealColumns={concealColumns} searchText={tableTopSearch()} searchVal={searchVal} incID={incID} tableKey={tableKey} columns={columns} apishowurl={apishowurl} setcolumnKey={setcolumnKey} columnvalue={columnvalue} olddate={olddate} clientHeight={clientHeight} newdate={newdate} />
        </div>
    );
};

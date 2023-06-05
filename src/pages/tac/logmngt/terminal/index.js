import React, { useRef, useState, useEffect } from 'react';
import { post, get } from '@/services/https';
import '@/utils/box.less';
import './index.less';
import moment from 'moment';
import { language } from '@/utils/language';
import { ProFormSelect } from '@ant-design/pro-form';
import { DatePicker, Input, Space } from 'antd';
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
      width: 90,
      title: language('logmngt.terminal.id'),
      dataIndex: 'id',
      ellipsis: true,
      align: 'center',
    },
    {
      disable: true,
      width: 130,
      title: language('logmngt.terminal.time'),
      dataIndex: 'time',
      ellipsis: true,
      align: 'center',
    },
    {
      disable: true,
      title: language('logmngt.terminal.event'),
      dataIndex: 'event',
      align: 'center',
      ellipsis: true,
      width: 100,
    },
    {
      disable: true,
      title: language('logmngt.terminal.devip'),
      dataIndex: 'devip',
      align: 'center',
      ellipsis: true,
      width: 110,
    },
    {
      disable: true,
      width: 100,
      title: language('logmngt.terminal.terminalname'),
      dataIndex: 'devname',
      ellipsis: true,
      align: 'center',
    },
    {
      disable: true,
      width: 120,
      title: language('logmngt.terminal.ipaddr'),
      dataIndex: 'ipaddr',
      ellipsis: true,
      align: 'center',
    },
    {
      disable: true,
      width: 130,
      title: language('logmngt.terminal.macaddr'),
      dataIndex: 'macaddr',
      ellipsis: true,
      align: 'center',
    },
    {
      disable: true,
      width: 100,
      title: language('logmngt.terminal.personliable'),
      dataIndex: 'resperson',
      ellipsis: true,
      align: 'center',
    },
    {
      disable: true,
      width: 100,
      title: language('logmngt.terminal.loguser'),
      dataIndex: 'user',
      ellipsis: true,
      align: 'center',
    },
    {
      disable: true,
      width: 150,
      title: language('logmngt.terminal.details'),
      dataIndex: 'details',
      ellipsis: true,
      align: 'center',
    },
  ];

  useEffect(() => {
    showEventID();
  }, [])

  const showEventID = () => {
    post('/cfg.php?controller=log&action=showEventID').then((res) => {
      setEventList(res.data);
    }).catch(() => {
      console.log('mistake')
    })
    
  }

  const incAdd = () => {
		let inc;
		clearTimeout(inc);
		inc = setTimeout(() => {
			setIncID((incID) => incID + 1);
		}, 100);
	}

  const tableKey = 'terminal'
  const setcolumnKey = 'pro-table-singe-demos-terminal';
  const [eventVal, setEventVal] = useState();
  const [eventList, setEventList] = useState([]);
  const [olddate, setOlddate] = useState(moment().subtract(1, "months").format(dateFormat));
  const [newdate, setNewdate] = useState(moment().format(dateFormat));
  const [queryVal, setQueryVal] = useState();//首个搜索框的值
  let searchVal = { value: queryVal, type: 'fuzzy', begDate: olddate, endDate: newdate, eventID: eventVal };//顶部搜索框值 传入接口
  const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const apishowurl = '/cfg.php?controller=log&action=showTermEvent';
  const columnvalue = 'terminalcolumnvalue';
  const concealColumns = {
    id: { show: false },
  }

  const tableTopSearch = () => {
    return (
      <Space>
        <Search
          placeholder={language('logmngt.terminal.tablesearch')}
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            incAdd()
          }}
        />
        <RangePicker showTime={{ format: 'HH:mm:ss' }}
          defaultValue={[moment(olddate, dateFormat),
          moment(newdate, dateFormat)]}
          format={dateFormat}
          onChange={(val, time) => {
            setNewdate(time[1])
            setOlddate(time[0])
            incAdd()
          }}
        />
        <div className='eventbox'>
          <ProFormSelect width="150px" options={eventList}
            onChange={
              (checked) => {
                setEventVal(checked)
                incAdd()
              }
            } />
        </div>

      </Space>
    )
  }
  return (
    <div>
      <ProtableModule clientHeight={clientHeight} concealColumns={concealColumns} searchText={tableTopSearch()} searchVal={searchVal} incID={incID} tableKey={tableKey} columns={columns} apishowurl={apishowurl} setcolumnKey={setcolumnKey} columnvalue={columnvalue} olddate={olddate} newdate={newdate} />
    </div>
  );
};

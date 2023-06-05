import React, { useRef,useState ,useEffect} from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { ProTable, EditableProTable } from '@ant-design/pro-components';
import { Tooltip } from 'antd';
import { post,get } from '@/services/https';
import '@/utils/box.less';
import './index.less'
import store from 'store';
import { formatMessage, useIntl } from 'umi';
import moment from 'moment';
import { language } from '@/utils/language';
import { DatePicker, Input, Space } from 'antd';
import { TableLayout } from '@/components';
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { RangePicker } = DatePicker;
import { useSelector } from 'umi'
const dateFormat = 'YYYY/MM/DD HH:mm:ss';

let H = document.body.clientHeight - 301
var clientHeight = H


export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 224
  const columnsList = [
    {
      title: language('sysmain.admlog.timestamp'),
      dataIndex: 'timestamp',
      key: '1',
      align: 'center',
      width: 200,
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      key: '2',
      align: 'left',
      ellipsis: true,
      width: 200,
    },
    {
      title: language('sysmain.admlog.user'),
      dataIndex: 'user',
      key: '3',
      align: 'left',
      ellipsis: true,
      width: 150,
    },
    {
      title: language('sysmain.admlog.module'),
      dataIndex: 'module',
      align: 'left',
      key: '4',
      ellipsis: true,
      width: 150,
    },
    {
      title: language('sysmain.admlog.action'),
      dataIndex: 'action',
      key: '5',
      width: 100,
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('sysmain.admlog.info'),
      dataIndex: 'info',
      key: '6',
      align: 'left',
      width: 800,
      ellipsis: true,
    },
  ]

    const apishowurl = '/cfg.php?controller=adminLog&action=show';
    const setcolumnKey = 'pro-table-singe-demos-admlog'
    const tableKey = 'logpolicy'
    const [olddate, setOlddate] = useState(moment().subtract(3, "months").format(dateFormat));
    const [newdate, setNewdate] = useState(moment().format(dateFormat));
    const [queryVal, setQueryVal] = useState();//首个搜索框的值
    let searchVal = { queryVal: queryVal, begDate: olddate, endDate: newdate };//顶部搜索框值 传入接口
    const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
    const columnvalue = 'adminlogColumnvalue';
    const tableTopSearch = () => {
      return (
          <Space>
              <Search
                  placeholder={language('sysmain.admlog.searchText')}
                  style={{ width: 200 }}
                  allowClear
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
          <> 
               <ProtableModule clientHeight={clientHeight} searchText={tableTopSearch()} searchVal={searchVal} incID={incID} tableKey={tableKey} columns={columnsList} apishowurl={apishowurl} setcolumnKey={setcolumnKey} columnvalue={columnvalue} olddate={olddate} newdate={newdate} />
          </>
        );
};

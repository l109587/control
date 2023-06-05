import React, { useRef, useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { Space, message, Tag, Input, DatePicker } from 'antd';
import { post, get } from '@/services/https';
import moment from 'moment';
import { TableLayout } from '@/components';
import { language } from '@/utils/language';
import store from 'store';
import { useSelector } from 'umi'
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { RangePicker } = DatePicker;

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 222
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      align: 'center',
      key: 'id',
      ellipsis: true
    },
    {
      title: language('illevent.edpreport.starttime'),
      dataIndex: 'starttime',
      width: 160,
      key: 'starttime',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.edpreport.endtime'),
      dataIndex: 'endtime',
      width: 160,
      key: 'endtime',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.edpreport.continuetime'),
      dataIndex: 'continuetime',
      width: 160,
      key: 'continuetime',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.nacreport.sid'),
      dataIndex: 'onlyid',
      width: 120,
      key: 'onlyid',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.nacreport.inIp'),
      dataIndex: 'inip',
      width: 160,
      key: 'inip',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.nacreport.devMac'),
      dataIndex: 'mac',
      width: 180,
      key: 'mac',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.netseries.outIp'),
      dataIndex: 'outip',
      width: 160,
      key: 'outIp',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.edpreport.department'),
      dataIndex: 'department',
      width: 100,
      key: 'department',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.nacreport.devUser'),
      dataIndex: 'username',
      width: 100,
      key: 'username',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.nacreport.devUser'),
      dataIndex: 'telnumber',
      width: 100,
      key: 'telnumber',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.nacreport.devName'),
      dataIndex: 'pcname',
      width: 150,
      key: 'pcname',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.edpreport.diskid'),
      dataIndex: 'diskid',
      width: 120,
      key: 'diskid',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('illevent.edpreport.servername'),
      dataIndex: 'servername',
      width: 120,
      key: 'servername',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('illevent.edpreport.servercode'),
      dataIndex: 'servercode',
      width: 120,
      key: 'servercode',
      align: 'left',
      ellipsis: true,
    },
  ];

  const dateFormat = 'YYYY/MM/DD';
  const [olddate, setOlddate] = useState(moment().subtract(7, "days").format(dateFormat));
  const [newdate, setNewdate] = useState(moment().format(dateFormat));
  const [queryVal, setQueryVal] = useState();
  let searchVal = { value: queryVal, type: 'fuzzy', begDate: olddate, endDate: newdate };//顶部搜索框值 传入接口
  const apishowurl = '/cfg.php?controller=cemsReportEvent&action=show';
  const concealColumns = {
    id: { show: false },
    continuetime: { show: false },
    telnumber: { show: false },
    servername: { show: false },
    servercode: { show: false },
  };
  const tableKey = 'edpreport';
  const setcolumnKey = 'pro-table-singe-demos-edpreport';
  const columnvalue = 'edportcolumnvalue';
  const [incID, setIncID] = useState(0);
  const downloadButton = true;
  store.set('edpreport',50)

  const tableTopSearch = () => {
    return (
      <Space>
        <Search
          placeholder={language('illevent.nacreport.searchText')}
          style={{ width: 200 }}
          allowClear
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            setIncID(incID + 1)
          }}
        />
        <RangePicker
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

  //导出按钮
  const downloadClick = () => {
    handleExport();
  }

  const handleExport = () => {
    let data = {};
    data.value = queryVal;
    data.startTime = olddate;
    data.endTime = newdate;
    post('/cfg.php?controller=cemsReportEvent&action=export', data, { responseType: 'blob' }).then((res) => {
      let link = document.createElement('a');
      let href = window.URL.createObjectURL(new Blob([res.data]));
      // let href = window.URL.createObjectURL(new Blob(['\ufeff'+res]));
      link.href = href;
      link.download = language('illevent.edpreport.downFileName');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(href);
    }).catch(() => {
      console.log('mistake')
    })
  }

  return (<>
    <ProtableModule isDelay={true} columns={columns} clientHeight={clientHeight} apishowurl={apishowurl} searchVal={searchVal} concealColumns={concealColumns} tableKey={tableKey} setcolumnKey={setcolumnKey} columnvalue={columnvalue} incID={incID} searchText={tableTopSearch()} downloadButton={downloadButton} downloadClick={downloadClick} />
  </>)
}

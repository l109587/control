import React, { useRef, useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { Space, Select, Tag, Input, DatePicker } from 'antd';
import { post, get } from '@/services/https';
import moment from 'moment';
import store from 'store';
import { TableLayout } from '@/components';
import { language } from '@/utils/language';
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
      title: language('illevent.netseries.findTime'),
      dataIndex: 'findTime',
      width: 160,
      key: 'findTime',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.offoutline.probeFlag'),
      dataIndex: 'probeFlag',
      width: 120,
      key: 'probeFlag',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.nacreport.devMac'),
      dataIndex: 'devMac',
      width: 200,
      key: 'devMac',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.fileleak.inIp'),
      dataIndex: 'inIp',
      width: 180,
      key: 'inIp',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.fileleak.outIp'),
      dataIndex: 'outIp',
      width: 180,
      key: 'outIp',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.netseries.region'),
      dataIndex: 'region',
      width: 100,
      key: 'region',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.netseries.city'),
      dataIndex: 'city',
      width: 100,
      key: 'city',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.netseries.isp'),
      dataIndex: 'isp',
      width: 150,
      key: 'isp',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.netseries.operator'),
      dataIndex: 'operator',
      width: 120,
      key: 'operator',
      align: 'left',
      ellipsis: true,
    },
    {
      title: language('illevent.illoutline.findType'),
      dataIndex: 'findType',
      width: 120,
      key: 'findType',
      align: 'center',
      render: (text, record, index) => {
        let color = 'success';
        if(text == 1) {
          color = 'magenta';
          text = language('illevent.illoutline.findTypepro');
        } else if(text == 2) {
          color = 'gold';
          text = language('illevent.illoutline.findTypeadmit');
        } else if(text == 3) {
          color = 'red';
          text = language('illevent.illoutline.findTypeflow');
        } else if(text == 4) {
          color = 'cyan';
          text = language('illevent.illoutline.findTypegate');
        } else if(text == 5) {
          color = 'blue'
          text = language('illevent.illoutline.findTypeprobscan');
        }
        return (
          <Space>
            <Tag style={{ marginRight: 0 }} color={color} key={record.findType}>
              {text}
            </Tag>
          </Space>
        )
      }
    },
    {
      title: language('illevent.netseries.flag'),
      dataIndex: 'flag',
      width: 120,
      key: 'flag',
      align: 'cneter',
      ellipsis: true
    }
  ];

  const dateFormat = 'YYYY/MM/DD';
  const [userValue, setUserValue] = useState('')
  const [olddate, setOlddate] = useState(moment().subtract(7, "days").format(dateFormat));
  const [newdate, setNewdate] = useState(moment().format(dateFormat));
  const [queryVal, setQueryVal] = useState();
  let searchVal = { value: queryVal, begDate: olddate, endDate: newdate, user: userValue ? userValue : store.get('userVal') }
  const apishowurl = '/cfg.php?controller=offlineEvent&action=show';
  const concealColumns = {
    id: { show: false },
    region: { show: false }
  };
  const tableKey = 'offoutline';
  const setcolumnKey = 'pro-table-singe-demos-offoutline';
  const columnvalue = 'offolicolumnvalue';
  const [incID, setIncID] = useState(0);
  const downloadButton = true;
  const [userList, setUserList] = useState([]);
  store.set('offoutline', 50)
  
  useEffect(() => {
    getUserList()
  }, [])

  const getUserList = () => {
    post('/cfg.php?controller=sysHeader&action=showAdminListName').then((res) => {
      setUserList(res.data)
    }).catch(() => {
      console.log('mistake')
    })
  }

  const tableTopSearch = () => {
    return (
      <Space>
        <Search
          placeholder='IP/MAC'
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
        <Select
          showSearch
          allowClear
          style={{
            width: 120,
          }}
          options={userList}
          defaultValue={store.get('userVal')}
          name='user'
          placeholder={language('illevent.placeuser')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label.toUpperCase() ?? '').includes(input.toUpperCase())}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
          onChange={(value) => {
            store.set('userVal', value)
            setUserValue(value)
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
    data.user = userValue ? userValue : store.get('userVal');
    post('/cfg.php?controller=offlineEvent&action=export', data, { responseType: 'blob' }).then((res) => {
      let link = document.createElement('a');
      let href = window.URL.createObjectURL(new Blob([res.data]));
      // let href = window.URL.createObjectURL(new Blob(['\ufeff'+res]));
      link.href = href;
      link.download = language('illevent.offoutline.downFileName');
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
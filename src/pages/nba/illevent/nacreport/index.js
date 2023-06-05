import React, { useRef, useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { Space, Select, Tag, Input, DatePicker } from 'antd';
import { post, showTimeout } from '@/services/https';
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
      title: language('illevent.netseries.findTime'),
      dataIndex: 'findTime',
      width: 160,
      key: 'findTime',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.nacreport.sid'),
      dataIndex: 'sid',
      width: 120,
      key: 'sid',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.nacreport.inIp'),
      dataIndex: 'inIp',
      width: 200,
      key: 'inIp',
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
      title: language('illevent.nacreport.devUser'),
      dataIndex: 'devUser',
      width: 120,
      key: 'devUser',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.nacreport.devPhone'),
      dataIndex: 'devPhone',
      width: 120,
      key: 'devPhone',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.nacreport.area'),
      dataIndex: 'area',
      width: 150,
      key: 'area',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.nacreport.devName'),
      dataIndex: 'devName',
      width: 150,
      key: 'devName',
      align: 'left',
      ellipsis: true
    },
    {
      title: language('illevent.netseries.outIp'),
      dataIndex: 'outIp',
      width: 150,
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
      dataIndex: 'violateType',
      width: 120,
      key: 'violateType',
      align: 'center',
      render: (text, record, index) => {
        let color = 'success';
        let name = '';
        if (text == '11') {
          color = 'blue';
          name = language('illevent.nacreport.findTypeinoutnet')
        } else if (text == '12') {
          color = 'success';
          name = language('illevent.nacreport.findTypeunauth')
        }
        return (
          <Tag style={{ marginRight: 0 }} color={color} key={record.findType}>
            {name}
          </Tag>
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
  ]

  const dateFormat = 'YYYY/MM/DD';
  const [userValue, setUserValue] = useState('')
  const [olddate, setOlddate] = useState(moment().subtract(7, "days").format(dateFormat));
  const [newdate, setNewdate] = useState(moment().format(dateFormat));
  const [queryVal, setQueryVal] = useState('');
  let searchVal = { value: queryVal, begDate: olddate, endDate: newdate, user: userValue ? userValue : store.get('userVal') };//顶部搜索框值 传入接口
  const apishowurl = '/cfg.php?controller=clientEvent&action=show';
  const concealColumns= {
    id: { show: false },
    devPhone: { show: false },
    devName: { show: false },
    region: { show: false }
  };
  const tableKey = 'nacreport';
  const setcolumnKey = 'pro-table-singe-demos-nacreport';
  const columnvalue = 'nacportcolumnvalue';
  const downloadButton = true;
  const [incID, setIncID] = useState(0);
  const [userList, setUserList] = useState([]);
  store.set('nacreport', 50)

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
    post('/cfg.php?controller=clientEvent&action=export', data, { responseType: 'blob' }).then((res) => {
      let link = document.createElement('a');
      let href = window.URL.createObjectURL(new Blob([res.data]));
      // let href = window.URL.createObjectURL(new Blob(['\ufeff'+res]));
      link.href = href;
      link.download = language('illevent.nacreport.downFileName');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(href);
    }).catch(() => {
      console.log('mistake')
    })
  }


  return (<>
    <ProtableModule columns={columns} clientHeight={clientHeight} apishowurl={apishowurl} searchVal={searchVal} concealColumns={concealColumns} tableKey={tableKey} setcolumnKey={setcolumnKey} columnvalue={columnvalue} incID={incID} searchText={tableTopSearch()} downloadButton={downloadButton} downloadClick={downloadClick} isDelay={true} />
  </>)  
}

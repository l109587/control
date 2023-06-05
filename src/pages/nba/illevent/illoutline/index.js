import React, { useRef, useState, useEffect } from 'react';
import ProCard from '@ant-design/pro-card';
import { Space, message, Tag, Input, DatePicker, Select, Tooltip } from 'antd';
import { ProTable, ModalForm, ProFormText, } from '@ant-design/pro-components';
import { post, delayPost, postAsync, fileDown } from '@/services/https';
import moment from 'moment';
import { TableLayout } from '@/components';
import { language } from '@/utils/language';
import store, { set } from 'store';
import { DownloadOutlined } from '@ant-design/icons';
import { BsChevronContract } from "react-icons/bs";
import { ViewGridList } from '@icon-park/react';
import './illoutline.less';
import { useSelector } from 'umi'
const { ProtableModule } = TableLayout;
const { Search } = Input;
const { RangePicker } = DatePicker;

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 206
  store.get('userVal')
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      align: 'center',
      key: 'id',
    },
    {
      title: language('illevent.netseries.findTime'),
      dataIndex: 'findTime',
      align: 'left',
      width: 180,
      key: 'findTime',
      ellipsis: true,
    },
    {
      title: language('illevent.illoutline.inIp'),
      dataIndex: 'inIp',
      key: 'inIp',
      width: 180,
      render: (text, record, index) => {
        if(record.multiple == 'Y') {
          return (<Space className='illexpendDiv'>
            <>{text}</>
            <Tooltip title={language('illevent.expand')}>
              <ViewGridList className='illexpendIcon'  theme='outline' size='18' fill='#FF7429' onClick={() => {
                setIsdetails(true)
                setNowPage(1)
                getDetailds(record.inIp)
                setSeinip(record.inIp)
              }}/>
            </Tooltip>
          </Space>)
        } else if(record.folding == "Y") {
          return (<Space className='illexpendDiv'>
            <>{text}</>
            <Tooltip title={language('illevent.stow')}>
              <BsChevronContract className='illexpendIcon'  style={{ fontSize: '18px', color:'#FF7429', marginBottom:'-4px' }} onClick={() => {
                getTabledata()
              }} />
            </Tooltip>
          </Space>)
        }
        else {
          return (
            <>{text}</>
          )
        }
      }
    },
    {
      title: language('illevent.netseries.area'),
      width: 100,
      dataIndex: 'area',
      key: 'area',
      ellipsis: true,
    },
    {
      title: language('illevent.illoutline.devMac'),
      dataIndex: 'devMac',
      width: 160,
      key: 'devMac',
      ellipsis: true,
    },
    {
      title: language('illevent.netseries.outIp'),
      width: 120,
      dataIndex: 'outIp',
      key: 'outIp',
      ellipsis: true,
    },
    {
      title: language('illevent.netseries.region'),
      width: 120,
      dataIndex: 'region',
      key: 'region',
      ellipsis: true,
    },
    {
      title: language('illevent.netseries.city'),
      width: 120,
      dataIndex: 'city',
      key: 'city',
      ellipsis: true,
    },
    {
      title: language('illevent.netseries.isp'),
      width: 90,
      dataIndex: 'isp',
      key: 'isp',
      ellipsis: true,
    },
    {
      title: language('illevent.netseries.operator'),
      width: 100,
      dataIndex: 'operator',
      key: 'operator',
      ellipsis: true,
    },
    {
      title: language('illevent.illoutline.findType'),
      width: 100,
      align: 'center',
      dataIndex: 'findType',
      key: 'findType',
      render: (text, record, index) => {
        let color = 'success';
        if(text == 1) {
          color = 'magenta';
          text = language('illevent.illoutline.findTypepro');
        } else if (text == 2) {
          color = 'gold';
          text = language('illevent.illoutline.findTypeadmit');
        } else if (text == 3) {
          color = 'red';
          text = language('illevent.illoutline.findTypeflow');
        } else if (text == 4) {
          color = 'cyan';
          text = language('illevent.illoutline.findTypegate');
        } else if (text == 5) {
          color = 'blue'
          text = language('illevent.illoutline.findTypeprobscan');
        } else if (text == 7) {
          color = 'lime'
          text = language('illevent.illoutline.selfCheck');
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
      width: 100,
      dataIndex: 'flag',
      key: 'flag',
      ellipsis: true,
    },
    {
      title: language('illevent.illoutline.type'),
      width: 100,
      dataIndex: 'type',
      key: 'type',
      ellipsis: true,
    },
    {
      title:  language('illevent.illoutline.serverName'),
      width: 130,
      dataIndex: 'serverName',
      key: 'serverName',
      ellipsis: true,
    },
  ]

  const dateFormat = 'YYYY/MM/DD';
  const [olddate, setOlddate] = useState(moment().subtract(7, "days").format(dateFormat));
  const [newdate, setNewdate] = useState(moment().format(dateFormat));
  const [userValue, setUserValue] = useState('')
  const [columnsHide, setColumnsHide] = useState(store.get('ilotlneclmnvalue') ? store.get('ilotlneclmnvalue') : {
    id: { show: false },
    region: { show: false },
    devMac: { show: false }
  });//设置默认列
  const [queryVal, setQueryVal] = useState();//首个搜索框的值
  const [loading, setLoading] = useState(false);//加载
  const actionRef = useRef();
  const [tabledata, setTabledata] = useState([]);
  const [totalPage, setTotalPage] = useState(0);//总条数
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);//选中id数组
  const [nowPage, setNowPage] = useState(1);//当前页码
  const initLtVal = store.get('pageSize') ? store.get('pageSize') : 50;//默认每页条数
  const [limitVal, setLimitVal] = useState(initLtVal);// 每页条目
  const searchArr = [nowPage, limitVal, queryVal, olddate, newdate, userValue];
  const [seinip, setSeinip] = useState('');
  const [isdetails, setIsdetails] = useState(false);
  const [userList, setUserList] = useState([]);
  let columnvalue = 'illoutlineTable'
  let concealColumnList = {
    id: { show: false },
    region: { show: false }
  }
  const [densitySize, setDensitySize] = useState('middle')

  useEffect(() => {
    setLoading(true)
    if (isdetails === false) {
      getTabledata()
    } else {
      getDetailds(seinip)
    }
  }, searchArr)

  useEffect(() => {
    showTableConf()
    getUserList()
  }, [])

  /* 表格数据 start  数据起始值   limit 每页条数  */
  const getTabledata = () => {
    let data = {};
    data.value = queryVal;
    data.limit = limitVal;
    data.start = limitVal * (nowPage - 1);
    data.startTime = olddate;
    data.endTime = newdate;
    data.user = userValue ? userValue : store.get('userVal');
    delayPost('/cfg.php?controller=outlineEvent&action=show', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        setLoading(false);
        return false;
      }
      setIsdetails(false);
      setLoading(false);
      setTotalPage(res.total)
      setTabledata([...res.data])
    }).catch(() => {
      console.log('mistake')
    })
  }

  /* 获取详情数据 */
  const getDetailds = (ipvalue) => {
    let data = {};
    data.limit = limitVal;
    data.start = limitVal * (nowPage - 1);
    data.inIp = ipvalue;
    data.startTime = olddate;
    data.endTime = newdate;
    data.user = userValue ? userValue : store.get('userVal');
    delayPost('/cfg.php?controller=outlineEvent&action=showDetails',data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      setIsdetails(true);
      setLoading(false);
      setTotalPage(res.total)
      setTabledata(res.data)
    }).catch(() => {
      console.log('mistake')
    })
  };

  const getUserList = () => {
    post('/cfg.php?controller=sysHeader&action=showAdminListName').then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      setUserList(res.data)
    }).catch(() => {
      console.log('mistake')
    })
  }

  /* 导出 */
  const handleExport = () => {
    let data = {};
    data.value = queryVal;
    data.startTime = olddate;
    data.endTime = newdate;
    data.user = userValue ? userValue : store.get('userVal');
    fileDown('/cfg.php?controller=outlineEvent&action=export', data, { responseType: 'blob' }).then((res) => {
      let link = document.createElement('a');
      let href = window.URL.createObjectURL(new Blob([res.data]));
      // let href = window.URL.createObjectURL(new Blob(['\ufeff'+res]));
      link.href = href;
      link.download = language('illevent.illoutline.downFileName');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(href);
    }).catch(() => {
      console.log('mistake')
    })
  }

  //选中触发
  const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    // setRecord(record)//选中行重新赋值
    setSelectedRowKeys(selectedRowKeys)
  }

  /* 回显表格密度列设置 */
  const showTableConf = async () => {
    let data = []
    data.module = columnvalue
    let res
    res = await postAsync(
      '/cfg.php?controller=confTableHead&action=showTableHead',
      data
    )
    if (res.density) {
      setDensitySize(res.density)
    }
    if (!res.success || res.data.length < 1) {
      columns?.map((item) => {
        if (!concealColumnList[item.dataIndex] && item.hideInTable != true) {
          let showCon = {}
          showCon.show = true;
          concealColumnList[item.dataIndex] = showCon;
        }
      })
      let data = []
      data.module = columnvalue
      data.value = JSON.stringify(concealColumnList)
      res = await postAsync(
        '/cfg.php?controller=confTableHead&action=setTableHead',
        data
      )
      if (res.success) {
        setColumnsHide(concealColumnList)
      }
    } else {
      setColumnsHide(res.data ? res.data : {})
    }
  }

  /* 表格列设置配置 */
  const columnsTableChange = (value) => {
    let data = [];
    data.module = columnvalue;
    data.value = JSON.stringify(value);
    post('/cfg.php?controller=confTableHead&action=setTableHead', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setColumnsHide(value);
    }).catch(() => {
      console.log('mistake')
    })
  }

  /* 表格密度设置 */
  const sizeTableChange = (sizeType) => {
    let data = [];
    data.module = columnvalue;
    data.density = sizeType;
    post('/cfg.php?controller=confTableHead&action=setTableHead', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      setDensitySize(sizeType);
    }).catch(() => {
      setDensitySize(sizeType);
      console.log('mistake')
    })
  }

  return (
    <div>
      <ProTable className='illoutlineTable'
        search={false}
        bordered={true}
        scroll={{ x: 1800, y: clientHeight }}
        dateFormatter="string"
        loading={loading}
        columnEmptyText={false}
        //设置选中提示消失
        tableAlertRender={false}
        actionRef={actionRef}
        rowkey={record => record.id}
        columns={columns}
        dataSource={tabledata}
        rowSelection={false}
        onSizeChange={(e) => {
          sizeTableChange(e);
        }}
        size={densitySize}
        columnsState={{
          value: columnsHide,
          persistenceType: 'sessionStorage',
          onChange: (value) => {
            columnsTableChange(value)
            store.set('ilotlneclmnvalue', value)
          },
        }}
        headerTitle={
          <Space>
            <Search
              placeholder={language('illevent.illoutline.searchholder')}
              allowClear
              style={{ width: 200 }}
              onSearch={(queryVal) => {
                setQueryVal(queryVal)
                setNowPage(1)
              }}
            />
            <RangePicker
              defaultValue={[moment(olddate, dateFormat),
              moment(newdate, dateFormat)]}
              format={dateFormat}
              onChange={(val, time) => {
                setNewdate(time[1])
                setOlddate(time[0])
                setNowPage(1)
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
                setNowPage(1)
              }}
            />
          </Space>
        }
        options={{
          reload: function () {
            setLoading(true);
            if (isdetails === false) {
              getTabledata()
            } else {
              getDetailds(seinip)
            }
          }
        }}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            if(type === 'get') {
              return Object.assign(Object.assign({}, values), { created_at: [values.startTime, values.endTime] });
            }
            return values;
          },
        }}

        toolBarRender={() => [
          <Tooltip title={language('project.export')} placement='top'>
            <DownloadOutlined style={{ fontSize: '15px' }} onClick={() => {
              handleExport()
            }} />
          </Tooltip>
        ]}
        onChange={(paging, filters, sorter) => {
          setLoading(true);
          setNowPage(paging.current);
          setLimitVal(paging.pageSize);
          store.set('pageSize', paging.pageSize)
        }}
        pagination={{
          showSizeChanger: true,
          pageSize: limitVal,
          current: nowPage,
          total: totalPage,
          showTotal: total => language('project.page', { total: total }),
        }}
      />
    </div>
  )
}

import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { EditableProTable } from '@ant-design/pro-components';
import { Button, Row, Col, Form, Popconfirm, Input, Space, Tag, message } from 'antd';
import { post, postAsync } from '@/services/https';
import store from 'store';
import '@/utils/index.less';
import './iaddrmap.less'
import { regList, regPortList, regIpList } from '@/utils/regExp';
import { language } from '@/utils/language';
import { useSelector } from 'umi'
const { Search } = Input

let H = document.body.clientHeight - 293
var clientHeight = H

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 206
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: '5%',
    },
    {
      title: language('monconf.alertnotice.areaNmae'),
      dataIndex: 'areaNmae',
      width: '20%',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: language('project.mandatory')
          },
          {
            pattern: regList.name.regex,
            message: regList.name.alertText,
          }
        ],
      },
    },
    {
      title: language('monconf.iaddrmap.iprang'),
      dataIndex: 'iprang',
      width: '65%',
      ellipsis: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: language('project.mandatory')
          },
          {
            pattern: regIpList.multipv4Mask.regex,
            message: regIpList.multipv4Mask.alertText,
          },
        ],
      },
    },
    {
      title: language('project.operate'),
      valueType: 'option',
      width: '15%',
      align: 'center',
      render: (text, record, _, action) => [
        <a key="editable" onClick={() => {
          var _a;
          (_a = action === null || action === void 0 ? void 0 : action.startEditable) === null || _a === void 0 ? void 0 : _a.call(action, record.id);
        }}>
          {language('project.deit')}
        </a>,
        <Popconfirm okText={language('project.yes')} cancelText={language('project.no')} title={language('project.delconfirm')} onConfirm={() => {
          delList(record)
        }}>
          <a>{language('project.del')}</a>
        </Popconfirm>
      ]
    },
  ]


  const [form] = Form.useForm();
  const actionRef = useRef();
  const [loading, setLoading] = useState(true);//加载
  const [columnsHide, setColumnsHide] = useState(store.get('iaddrcolumnvalue') ? store.get('iaddrcolumnvalue') : {
    id: { show: false },
  });//设置默认列
  const startVal = 1;
  const limitVal = store.get('pageSize') ? store.get('pageSize') : 10;//默认每页条数
  const [totalPage, setTotalPage] = useState(0);//总条数
  const [tabledata, setTabledata] = useState([]);
  const [nowPage, setNowPage] = useState(1);//当前页码
  const [editableKeys, setEditableRowKeys] = useState([]);
  const [queryVal, setQueryVal] = useState('');//搜索值
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);//选中id数组
  let columnvalue = 'iaddramap'
  let concealColumnList = {
    id: { show: false },
    region: { show: false }
  }
  const [densitySize, setDensitySize] = useState('middle')

  useEffect(() => {
    setLoading(true)
    showTableConf()
    getData();
  }, [])

  const getData = (pagestart = '', pagelimit = '', value = '') => {
    let page = pagestart != '' ? pagestart : startVal;
    let data = {};
    data.limit = pagelimit != '' ? pagelimit : limitVal;
    data.start = (page - 1) * data.limit;
    data.value = value != '' ? value : queryVal;
    post('/cfg.php?controller=areaIpConf&action=show', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      setLoading(false);
      setTotalPage(res.total)
      setTabledata([...res.data])
    }).catch(() => {
      console.log('mistake')
    })
  }

  //搜索
  const handsearch = (values) => {
    setQueryVal(values);
    getData(startVal, limitVal, values);
  }

  const setData = (record) => {
    let data = {};
    data.op = record.op == 'add' ? record.op : 'mod';
    data.id = record.op == 'add' ? '' : record.id;
    data.areaNmae = record.areaNmae;
    data.iprang = record.iprang;
    post('/cfg.php?controller=areaIpConf&action=set', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      getData(startVal)
    }).catch(() => {
      console.log('mistake')
    })
  }

  const delList = (record) => {
    let data = {};
    data.id = record.id
    post('/cfg.php?controller=areaIpConf&action=del', data).then((res) => {
      if(!res.success) {
        message.error(res.msg);
        return false;
      }
      message.success(res.msg);
      getData(startVal)
    }).catch(() => {
      console.log('mistake')
    })
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

    return (<>
      <EditableProTable scroll={{ y: clientHeight }}
        className='iaddrampTable'
        rowKey="id"
        bordered={true}
        loading={loading}
        actionRef={actionRef}
        toolBarRender={() => [
          <Button type="primary" style={{ borderRadius: 5, float: 'right' }} onClick={() => {
            var _a, _b;
            (_b = (_a = actionRef.current) === null || _a === void 0 ? void 0 : _a.addEditRecord) === null || _b === void 0 ? void 0 : _b.call(_a, {
              id: (Math.random() * 1000000).toFixed(0),
              op: 'add',
            }, { position: 'top' });
          }} icon={<PlusOutlined />}>
            {language('project.temporary.outreach.setnew')}
          </Button>
        ]}
        headerTitle={
          <Search
            placeholder={language('monconf.iaddrmap.searchtext')}
            style={{ width: 200 }}
            onSearch={(queryVal) => {
              setNowPage(1);
              handsearch(queryVal)
            }}
          />
        }
        // 关闭默认的新建按钮
        recordCreatorProps={false}
        columns={columns}
        value={tabledata}
        onChange={setTabledata}
        options={{
          reload: function () {
            setLoading(true);
            getData()
          }
        }}
        columnEmptyText={false}
        //单选框选中变化
        rowSelection={false}
        dateFormatter="string"
        pagination={{
          showSizeChanger: true,
          pageSize: limitVal,
          current: nowPage,
          total: totalPage,
          showTotal: total => language('project.page', { total: total }),
          onChange: (page, pageSize) => {
            clearTimeout(window.timer);
            window.timer = setTimeout(function () {
              setNowPage(page);
              store.set('pageSize', pageSize)
              getData(page, pageSize);
            }, 100)
          },
        }}
        onSizeChange={(e) => {
          sizeTableChange(e);
        }}
        size={densitySize}
        columnsState={{
          value: columnsHide,
          persistenceType: 'sessionStorage',
          onChange: (value) => {
            columnsTableChange(value)
            store.set('iaddrcolumnvalue', value)
          },
        }}
        editable={{
          form,
          editableKeys,
          onSave: async (rowKey, data, row) => {
            setData(data);
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
      />
    </>)
  }
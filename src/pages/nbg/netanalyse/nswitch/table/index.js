import React, { useRef, useState, useEffect } from 'react'
import { Button, Input, Modal, message } from 'antd'
import {
  PlusOutlined,
  CloseCircleFilled,
  ExclamationCircleOutlined,
  SecurityScanOutlined,
} from '@ant-design/icons'
import { post, postAsync, get } from '@/services/https'
import ProTable from '@ant-design/pro-table'
import { getIntl, useIntl, FormattedMessage } from 'umi'
import { language } from '@/utils/language'
import '@/utils/box.less'
import '@/utils/index.less'
import './table.less'
import store from 'store'
import { msg } from '@/utils/fun'
import { fetchAuth } from '@/utils/common';
const { Search } = Input
const { confirm } = Modal
export default (props) => {
  const selectkey = props.rowkey
  const columnvalue = props.columnvalue
  let concealColumnList = props.concealColumns
  const writable = fetchAuth()
  const { addClick, delClick, scanClick } = props
  const incID = props.incID ? props.incID : 0 //递增的id 删除/添加的时候增加触发刷新
  const [selectedRowKeys, setSelectedRowKeys] = useState([]) //选中id数组
  const [delStatus, setipDelStatus] = useState(true) //选中id数组
  const [dataList, setList] = useState([])
  const [reloadDL, setReloadDL] = useState(0) //刷新
  const initLtVal = store.get('pageSize') ? store.get('pageSize') : 50
  const [limitVal, setLimitVal] = useState(initLtVal) // 每页条目
  const [loading, setLoading] = useState(false) //加载
  const [columnsHide, setColumnsHide] = useState(
    store.get(props.columnvalue)
      ? store.get(props.columnvalue)
      : props.concealColumns
  ) // 设置默认列
  const [currPage, setCurrPage] = useState(1) // 当前页码
  const [totEntry, setTotEntry] = useState(0) // 总条数
  const [filters, setFilters] = useState({})
  const [selectedRows, setSelectedRows] = useState([])
  const [densitySize, setDensitySize] = useState('middle')

  const searchArr = [
    currPage,
    limitVal,
    reloadDL,
    props.searchVal,
    filters,
    incID,
  ]
  useEffect(() => {
    clearTimeout(window.timer)
    setLoading(true)
    window.timer = setTimeout(function () {
      getListdata()
    }, 100)
  }, searchArr)

  useEffect(() => {
    showTableConf()
  }, [])

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
        props.columns?.map((item) => {
          if (!concealColumnList[item.dataIndex] && item.hideInTable != true) {
            let showCon = {}
            showCon.show = true;
            concealColumnList[item.dataIndex] = showCon;
          }
        })
        let data = []
        data.module =  
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

  // 回显数据请求
  const getListdata = () => {
    // let data = {};
    // data = props.searchVal;
    // data.start = limitVal * (currPage - 1);
    // data.limit = limitVal;
    // data.filters = filters;
    const data = {
      start: limitVal * (currPage - 1),
      limit: limitVal,
      ...props.searchVal,
    }
    post(props.apishowurl, data)
      .then((res) => {
        setLoading(false)
        setTotEntry(res.total)
        setList([...res.data.term])
        msg(res)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //选中触发
  const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRows(selectedRows)
    let deletestatus = true
    console.log(selectedRowKeys)
    if (selectedRowKeys != false || selectedRowKeys[0] == '0') {
      deletestatus = false
    }
    console.log(deletestatus)
    setipDelStatus(deletestatus) //添加删除框状态
  }

  /* 顶部右侧功能按钮 */
  const toolButton = () => {
    return (
      <>
        {props.addButton ? (
          <Button
            key="button"
            onClick={() => {
              addClick()
            }}
            type="primary"
          >
            <PlusOutlined /> {language('project.add')}
          </Button>
        ) : (
          ''
        )}
        {props.delButton ? (
          <Button
            type="danger"
            disabled={delStatus}
            onClick={(e) => {
              delClick(selectedRowKeys, dataList, selectedRows)
            }}
          >
            <CloseCircleFilled /> {language('project.del')}
          </Button>
        ) : (
          ''
        )}
        {props.scanButton ? (
          <Button
            type="primary"
            onClick={(e) => {
              scanClick()
            }}
          >
            <SecurityScanOutlined style={{ fontSize: '16px' }} /> 重新扫描
          </Button>
        ) : (
          ''
        )}
      </>
    )
  }

  return (
    <div className="components-table-resizable-column">
      <ProTable
        key={props.tableKey}
        search={false}
        bordered={true}
        size={densitySize}
        className={props.className}
        columns={props.columns}
        headerTitle={props.searchText}
        components={props.components}
        loading={loading}
        options={{
          setting: true,
          reload: () => {
            setLoading(true)
            setCurrPage(1)
            setReloadDL(reloadDL + 1)
          },
        }}
        //设置选中提示消失
        tableAlertRender={false}
        scroll={props.clientHeight}
        rowKey={selectkey}
        dataSource={dataList}
        columnsState={{
          value: columnsHide,
          persistenceType: 'localStorage',
          onChange: (value, key) => {
            columnsTableChange(value)
            store.set(props.columnvalue, value)
          },
        }}
        onSizeChange={(e) => {
          sizeTableChange(e);
        }}
        rowSelection={
          props.rowSelection
            ? {
                columnWidth: 32,
                selectedRowKeys,
                onChange: onSelectedRowKeysChange,
                getCheckboxProps: (record) => ({}),
              }
            : false
        }
        toolBarRender={!writable ? null : toolButton}
        onChange={(paging, filters) => {
          setLoading(true)
          setFilters(JSON.stringify(filters))
          setCurrPage(paging.current)
          setLimitVal(paging.pageSize)
          store.set('pageSize', paging.pageSize)
        }}
        pagination={{
          showSizeChanger: true,
          pageSize: limitVal,
          current: currPage,
          total: totEntry,
          showTotal: (total) => (
            <FormattedMessage id="project.page" values={{ total: total }} />
          ),
        }}
      />
    </div>
  )
}

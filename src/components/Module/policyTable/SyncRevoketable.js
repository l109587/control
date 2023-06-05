import React, { useRef, useState, useEffect } from 'react';
import { post, postAsync } from '@/services/https';
import { ProTable } from '@ant-design/pro-components';
import { language } from '@/utils/language';
import '@/utils/box.less';
import '@/utils/index.less';
import './Revoketable.less';
import store from 'store';

export default (props) => {

  // rowKeyID与rowkey对应  与props.isDefaultCheck 组合使用props.isDefaultCheck 成功配置
  const { showPage, setSelectData, contentList, rowKeyID } = props;
  const incID = props.incID ? props.incID : 0;//递增的id 删除/添加的时候增加触发刷新
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);//选中id数组
  const [dataList, setList] = useState([]);
  const [reloadDL, setReloadDL] = useState(0);//刷新
  const initLtVal = store.get(props.tableKey) ? store.get(props.tableKey) : 20;
  const [limitVal, setLimitVal] = useState(initLtVal);// 每页条目
  const [loading, setLoading] = useState(true);//加载
  const [columnsHide, setColumnsHide] = useState(store.get(props.columnvalue) ? store.get(props.columnvalue) : props.concealColumns); // 设置默认列
  const [currPage, setCurrPage] = useState(1);// 当前页码
  const [totEntry, setTotEntry] = useState(0);// 总条数
  const [filters, setFilters] = useState({});
  const [sortOrder, setSortOrder] = useState(''); // 排序顺序
  const [sortText, setSorttext] = useState(''); // 排序字段
  const [selectedRows, setSelectedRows] = useState([])
  const searchArr = [ currPage, limitVal, reloadDL, filters, sortText, sortOrder, incID];
  let searchVal = props.searchVal
  let searchValList  = []
  for (const key in searchVal) {
    searchValList.push(searchVal[key])
  }

  useEffect(() => {
    clearTimeout(window.timer);
    setLoading(true);
    window.timer = setTimeout(function () {
      getListdata();
      setSelectedRowKeys([]);
    }, 100)
  }, searchArr)

  useEffect(() => {
    setCurrPage(1);
  }, searchValList)

  useEffect(() => {
    dataList?.map((item)=>{
      if(contentList[item.id]){
        item.end = contentList[item.id];
      }
    })
    setList(dataList)
  }, [contentList])

  // 回显数据请求
  const getListdata = (num) => {
    let data = {};
    data = {...props.searchVal};
    data.start = showPage ? 0 : limitVal * (currPage - 1);
    data.limit = showPage ? 20 : limitVal;
    data.filters = filters;
    data.sort = sortText;
    if(sortOrder == 'ascend') {
      data.order = 'asc';
    } else if(sortOrder == 'descend') {
      data.order = 'desc';
    } else {
      data.order = ' ';
    }
    post(props.apishowurl, data).then((res) => {
      if (props.isDefaultCheck) {
        let defaultlist = []
        res.data.map((item) => {
          if (item.isSelect == 'Y') {
            defaultlist.push(item[rowKeyID ? rowKeyID : 'devid'])
          }
        })
        setSelectedRowKeys(defaultlist)
        if (setSelectData) {setSelectData(defaultlist)}
      }
      setLoading(false);
      setTotEntry(res.total);
      setList([...res.data]);
    }).catch(() => {
      console.log('mistake')
    })
  }

  //选中触发
  const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRows(selectedRows)
    if (setSelectData) {setSelectData(selectedRowKeys)}
  }

  return (
    <div className="components-table-resizable-column">
      <ProTable
        key={props.tableKey}
        search={false}
        className='proTableBox'
        bordered={true}
        columns={props.columns}
        headerTitle={
          props.searchText
        }
        loading={loading}
        options={{
          setting: true,
          reload: () => {
            setLoading(true);
            setCurrPage(1);
            setReloadDL(reloadDL + 1);
          }
        }}
        //设置选中提示消失
        tableAlertRender={false}
        scroll={{ y: props.clientHeight + 16 }}
        rowKey={props.rowkey}
        dataSource={dataList}

        columnsState={{
          value: columnsHide,
          persistenceType: 'localStorage',
          onChange: (value, key) => {
            setColumnsHide(value);
            store.set(props.columnvalue, value)
          },
        }}
        rowSelection={props.rowSelection ?
          {
            columnWidth: 32,
            selectedRowKeys: selectedRowKeys,
            onChange: onSelectedRowKeysChange,
            getCheckboxProps: (record) => {
              return {
                disabled: props.tableKey == 'distribute' ? record.isSelect == 'Y' ? true : false : false,
              }
            },
          } : false
        }
        onChange={(paging, filters, sorter) => {
          setLoading(true);
          setFilters(JSON.stringify(filters));
          setSortOrder(sorter.order);
          setSorttext(sorter.field);
          setCurrPage(paging.current);
          setLimitVal(paging.pageSize);
          store.set(props.tableKey, paging.pageSize)
        }}
        pagination={showPage ? false : {
          showSizeChanger: true,
          pageSize: limitVal,
          current: currPage,
          total: totEntry,
          showTotal: total => language('project.page', { total: total }),
        }}
      />
    </div>
  );
};

import React, { useRef, useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { post, postAsync } from '@/services/https';
import ProTable from '@ant-design/pro-table';
import { language } from '@/utils/language';
import '@/utils/box.less';
import '@/utils/index.less';
import './index.less';
import store from 'store';
const { Search } = Input;

export default (props) => {
  const [dataList, setList] = useState([]);
  const [reloadDL, setReloadDL] = useState(0);//刷新
  const initLtVal = store.get('pageSize') ? store.get('pageSize') : 20;
  const [limitVal, setLimitVal] = useState(initLtVal);// 每页条目
  const [loading, setLoading] = useState(true);//加载
  const [columnsHide, setColumnsHide] = useState(props.concealColumns); // 设置默认列
  const [currPage, setCurrPage] = useState(1);// 当前页码
  const [totEntry, setTotEntry] = useState(0);// 总条数
  const [filters, setFilters] = useState({});
  const searchArr = [currPage, limitVal, reloadDL, props.searchVal, filters];
  useEffect(() => {
    clearTimeout(window.timer);
    setLoading(true);
    window.timer = setTimeout(function () {
      getListdata();
    }, 100)
  }, searchArr)

  // 回显数据请求
  const getListdata = () => {
    let data = {};
    data = props.searchVal;
    data.start = limitVal * (currPage - 1);
    data.limit = limitVal;
    data.filters = filters;
    post(props.apishowurl, data).then((res) => {
      setLoading(false);
      setTotEntry(res.total);
      setList(res.data);
    }).catch(() => {
      console.log('mistake')
    })
  }

  return (
    <>
      <ProTable
        // 传
        key={props.key}
        search={false}
        bordered={true}
        size={'middle'}
        className={props.className}
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
        scroll={props.clientHeight}
        // 传
        rowkey={props.rowkey}
        dataSource={dataList}
        columnsState={{
          value: columnsHide,
          persistenceType: 'localStorage',
          onChange: (value) => {
            setColumnsHide(value);
          },
        }}
        onChange={(paging, filters) => {
          setFilters(JSON.stringify(filters));
          setCurrPage(paging.current);
          setLimitVal(paging.pageSize);
          store.set('pageSize', paging.pageSize)
        }}
        pagination={{
          showSizeChanger: true,
          pageSize: limitVal,
          current: currPage,
          total: totEntry,
          showTotal: total => language('project.page',{ total: total }),
        }}
      />
    </>
  );
};

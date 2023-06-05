import React, { useRef, useState, useEffect } from 'react';
import { Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { post, postAsync } from '@/services/https';
import ProTable from '@ant-design/pro-table';
import { language } from '@/utils/language';
import '@/utils/box.less';
import './index.less'
import store from 'store';
const { Search } = Input;

let H = document.body.clientHeight - 555
var clientHeight = H > 150 ? H : 150;

export default (props) => {
  const [dataList, setList] = useState([]);
  const [queryVal, setQueryVal] = useState('');//搜索值
  const [reloadDL, setReloadDL] = useState(0);
  const initLtVal = store.get('pageSize') ? store.get('pageSize') : 20;
  const [limitVal, setLimitVal] = useState(initLtVal);// 每页条目
  const [loading, setLoading] = useState(true);//加载
  const queryType = 'fuzzy';//默认模糊查找
  const [columnsHide, setColumnsHide] = useState(props.concealColumns); // 设置默认列
  const [currPage, setCurrPage] = useState(1);        // 当前页码
  const [totEntry, setTotEntry] = useState(0);        // 总条数

  useEffect(() => {
    getListdata();
  }, [ queryVal, currPage, limitVal, reloadDL, props.id])

  // 回显数据请求
  const getListdata = () => {
    let data = {};
    data.queryVal = queryVal;
    data.queryType = queryType;
    data.start = limitVal * (currPage - 1);
    data.limit = limitVal;
    data.id = props.id
    post(props.apishowurl, data).then((res) => {
      setLoading(false);
      setTotEntry(res.total);
      setList([...res.data]);
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
        options={{
          setting: true,
          reload: () => {
            setCurrPage(1);
            setReloadDL(reloadDL + 1);
          }
        }}
        scroll={{  y: clientHeight }}
        // 传
        rowkey={record => record.id}
        dataSource={dataList}
        columnsState={{
          value: columnsHide,
          persistenceType: 'localStorage',
          onChange: (value) => {
            setColumnsHide(value);
          },
        }}

        pagination={{
          showSizeChanger: true,
          pageSize: limitVal,
          current: currPage,
          total: totEntry,
          showTotal: total => language('project.page',{ total: total }) ,
          onChange: (page, pageSize) => {
            /* fix antd bug */
            if(page == currPage && pageSize == limitVal)
              return

            store.set('pageSize', pageSize); //有问题
            setCurrPage(page);
            setLimitVal(pageSize);
          }
        }}
      />
    </>
  );
};

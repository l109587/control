import React, { useEffect, useState } from 'react';
import ProTable from '@ant-design/pro-table';
import { Resizable } from 'react-resizable';
import { post, postAsync } from '@/services/https';
import { getIntl, useIntl, FormattedMessage } from 'umi';
import './ResizeTable.less';
import store from 'store';




// 拖拽调整table
const ResizeTable = (props) => {




  const [dataList, setList] = useState([]);
  const [reloadDL, setReloadDL] = useState(0);
  const [selectedRowKeys,setSelectedRowKeys] = useState([]) ;//选中id数组
  const initLtVal = store.get('pageSize') ? store.get('pageSize') : 20;
  const [limitVal, setLimitVal] = useState(initLtVal);// 每页条目
  const [loading, setLoading] = useState(true);//加载
  const queryType = 'fuzzy';//默认模糊查找
  const [columnsHide, setColumnsHide] = useState(props.concealColumns); // 设置默认列
  const [currPage, setCurrPage] = useState(1);        // 当前页码
  const [totEntry, setTotEntry] = useState(0);        // 总条数
  const [filters, setFilters] = useState({});
  const searchArr = [currPage, limitVal, reloadDL, props.searchVal, filters];
  useEffect(() => {
    clearTimeout(window.timer);
    window.timer = setTimeout(function () {
      getListdata();
    }, 100)
  }, searchArr)


  // 回显数据请求
  const getListdata = () => {
    let data = {};
    data.start = limitVal * (currPage - 1);
    data.limit = limitVal;
    data.queryVal = props.searchVal;
    data.filters = filters;
    post(props.apishowurl, data).then((res) => {
      setLoading(false);
      setTotEntry(res.total);
      setList([...res.data]);
    }).catch(() => {
      console.log('mistake')
    })
  }



  return (
    <div className="components-table-resizable-column">
      <ProTable
        key={props.tableKey}
        search={false}
        bordered={true}
        size={'middle'}
        headerTitle={
          props.searchText
        }
        loading={loading}
        components={props.components}
        columns={props.columns}
        dataSource={dataList}
        options={{
          setting: true,
          reload: () => {
            setLoading(true);
            setCurrPage(1);
            setReloadDL(reloadDL + 1);
          }
        }}
        scroll={{ x: 1500, y: props.clientHeight}}
        rowkey={record => record.id}
        //设置选中提示消失
        tableAlertRender={false} 
        columnsState={{
          value: columnsHide,
          persistenceKey: props.setcolumnKey,
          persistenceType: 'localStorage',
          onChange: (value) => {
            setColumnsHide(value);
          },
        }}

        onChange={(paging, filters) => {
          console.log(filters)
          setLoading(true);
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
          showTotal: total => <FormattedMessage id="project.page" values={{ total: total }} />,
        }}
      />
    </div>
  )
}

export default ResizeTable;

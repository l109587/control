import React, { useRef, useState, useEffect } from 'react';
import { Button, Tooltip, message } from 'antd';
import { PlusOutlined, CloseCircleFilled, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { post, postAsync, delayPost } from '@/services/https';
import { ProTable, arrayMoveImmutable, useRefFunction } from '@ant-design/pro-components';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { language } from '@/utils/language';
import { Resizable } from 'react-resizable';
import { fetchAuth } from '@/utils/common';
import '@/utils/box.less';
import '@/utils/index.less';
import './Protable.less';
import store from 'store';
// 调整table表头 拖拽
const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;
  if (!width) {
    return <th {...restProps} />;
  }
  return (
    <Resizable
      width={width}
      height={0}
      onResize={onResize}
      draggableOpts={{ enableUserSelectHack: false }}
    >
      <th {...restProps} />
    </Resizable>
  );
};

/* 
  表格组件使用规范：
    1. 如有排序需求，需在表头对应字段添加 sorter: true 配置,传sortText代表所需排序字段，sortOrder代表排序顺序，asc代表正序，desc代表倒序;
    2. 如需要表格拖拽宽度功能，需在页面文件引入Resizable，组件中传相应components，详情见analyse/illinn;
    3. 如需要增删导入导出功能，需传对应字段表示是否启用，增：props.addButton，删：props.delClick，导入：props.uploadClick，导出：props.downloadClick;
    4. 首页钻取 配置默认筛选功能 filterChange, filtersType
    5. 配置行不可选中内容 selectDisabled
    6. 添加行className rowOpenClassName
    7. 展开配置 expandAble
*/

export default (props) => {
  const writable = fetchAuth()
  const [columnsHide, setColumnsHide] = useState({}); // 设置默认列\
 
  const [tableZWidth, setTableZWidth] = useState(0);
  const tableRef = useRef();
  let tableWidth = tableRef.current?.offsetWidth - 48;//获取页面宽度

  //页面更新宽度触发
  window.addEventListener('resize', function () {
    tableWidth = tableRef.current?.offsetWidth - 48;
    setTableZWidth(tableWidth)
  })

  //获取table 长度
  let configWidth = 0;
  props.columns?.map((item) => {
    if (!columnsHide[item.dataIndex] || columnsHide[item.dataIndex].show == true) {
      configWidth = configWidth + (item.width ? item.width : 200);
    }
  })

  const checkRowKey = props.checkRowKey;
  /** 拖拽排序功能 start */
  const SortableItem = SortableElement((props) => <tr {...props} />);
  const SortContainer = SortableContainer((props) => <tbody {...props} />);
  const onSortEnd = useRefFunction(({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      dragSort(oldIndex, newIndex, dataList);//拖拽后处理
      const newData = arrayMoveImmutable(dataList.slice(), oldIndex, newIndex).filter((el) => !!el);
      setList([...newData]);
    }
  });
  const DraggableContainer = (props) => (<SortContainer useDragHandle disableAutoscroll helperClass="row-dragging" onSortEnd={onSortEnd} {...props} />);
  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    const index = dataList.findIndex((x) => x[checkRowKey] === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };
  /** 拖拽排序 end */

  // 定义头部组件
  let components = {};
  //判断是否启用内容排序
  if (props.checkRowKey) {
    components.body = {
      wrapper: DraggableContainer,
      row: DraggableBodyRow,
    }
  }

  //判断是否启用宽度拖拽
  if (props.components) {
    components.header = {
      cell: ResizeableTitle,
    }
  }

  const { addClick, delClick, uploadClick, downloadClick, dragSort, setScreenList, otherOperate = null, showPage, Transmit, filterChange, filtersType, selectDisabled, filterValue, rowOpenClassName, expandAble, onExpandUrl, expandData, typeLeft, getColHide, concealColumns, developShowKey,isDelay} = props;
  let concealColumnList = concealColumns ? concealColumns : {};
  const incID = props.incID ? props.incID : 0;//递增的id 删除/添加的时候增加触发刷新
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);//选中id数组
  const [delStatus, setDelStatus] = useState(true);//删除按钮状态
  const [dataList, setList] = useState([]);
  const [reloadDL, setReloadDL] = useState(0);//刷新
  const initLtVal = store.get(props.tableKey) ? store.get(props.tableKey) : 20;
  const [limitVal, setLimitVal] = useState(initLtVal);// 每页条目
  const [loading, setLoading] = useState(false);//加载
  const [currPage, setCurrPage] = useState(1);// 当前页码
  const [totEntry, setTotEntry] = useState(0);// 总条数
  const [filters, setFilters] = useState(filtersType ? JSON.stringify(filtersType) : {});
  const [sortOrder, setSortOrder] = useState(''); // 排序顺序
  const [sortText, setSorttext] = useState(''); // 排序字段
  const [selectedRows, setSelectedRows] = useState([])
  const [loadStatus, setLoadStatus] = useState(false)
  const [fieldStatus, setFieldStatus] = useState(true);
  const [tableLChange, setTableLChange] = useState(true);
  const [expandedRows, setExpandedRows] = useState([]);
  const [densitySize, setDensitySize] = useState('middle');
  let searchArr = [];
  if (typeLeft) {
    searchArr = [currPage, limitVal, reloadDL, filters, sortText, sortOrder];
  } else {
    searchArr = [currPage, limitVal, reloadDL, filters, sortText, sortOrder, incID];
  }
  let searchVal = props.searchVal
  let searchValList = []
  for (const key in searchVal) {
    searchValList.push(searchVal[key])
  }

  //展开功能拼接
  if(expandAble && onExpandUrl){
    expandAble.expandedRowKeys = expandedRows;
  }

  if (expandAble && developShowKey) {
    let aList = [];
    props.columns?.map((item) => {
      if (columnsHide[item.dataIndex]?.show == true && item.hideInTable != true) {
        aList.push(item.dataIndex);
      }
    })
    let num = aList.indexOf(developShowKey) == -1 ? -1 : aList.indexOf(developShowKey) + 2;
    expandAble.expandIconColumnIndex = num;
  }

  useEffect(() => {
    clearTimeout(window.timer);
    setLoading(true);
    window.timer = setTimeout(function () {
      if (fieldStatus) {
        columnsTablel();
      } else {
        if (props.onlyOneReq) {
          if (!props.searchVal.zoneID) {
            return false
          }
        }
        getListdata();
      }
      setSelectedRowKeys([]);
      setDelStatus(true);//添加删除框状态
    }, 100)
  }, searchArr)

  if (typeLeft) {
    useEffect(() => {
      setLoadStatus(true);
      clearTimeout(window.timer);
      setLoading(true);
      window.timer = setTimeout(function () {
        if (fieldStatus) {
          columnsTablel();
        } else {
          getListdata();
        }
        setSelectedRowKeys([]);
        setDelStatus(true);//添加删除框状态
      }, 100)
    }, [incID])
  }

  useEffect(() => {
    setCurrPage(1);
  }, searchValList)

  useEffect(() => {
    if (filterValue) {
      setFilters(JSON.stringify(filterValue))
    }
    setCurrPage(1);
  }, [filterValue])

  // 回显数据请求
  const getListdata = async (num) => {
    let data = {};
    data = { ...props.searchVal };
    data.start = showPage ? 0 : limitVal * (currPage - 1);
    data.limit = showPage ? 20 : limitVal;
    data.filters = filters;
    data.sort = sortText;
    if (sortOrder == 'ascend') {
      data.order = 'asc';
    } else if (sortOrder == 'descend') {
      data.order = 'desc';
    } else {
      data.order = ' ';
    }

    let res;
    setExpandedRows([]);
    if (isDelay) {
      delayPost(props.apishowurl, data).then((res) => {
        setLoading(false);
        if(!res.success){
          setTotEntry(0);
          setList([]);
          message.error(res.msg);
        }else{
          setTotEntry(res.total);
          setList([...res.data]);
        }
      }).catch(() => {
        console.log('mistake')
      })
    } else {
      if (!typeLeft) {
        res = await postAsync(props.apishowurl, data);
        setLoading(false);
        if (!res.success) {
          setTotEntry(0);
          setList([]);
          message.error(res.msg);
        } else {
          setTotEntry(res.total);
          let list = res.data ? res.data : [];
          setList([...list]);
        }
      } else if (typeLeft && loadStatus) {
        res = await postAsync(props.apishowurl, data);
        setLoading(false);
        if (!res.success) {
          setTotEntry(0);
          setList([]);
          message.error(res.msg);
        } else {
          setTotEntry(res.total);
          let list = res.data ? res.data : [];
          setList([...list]);
        }
      }
    }
  }

  //选中触发
  const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRows(selectedRows)
    if (Transmit) { Transmit(selectedRows) }
    let deletestatus = true;
    if (selectedRowKeys != false || selectedRowKeys[0] == '0') {
      deletestatus = false;
    }
    setDelStatus(deletestatus);//添加删除框状态
  }

  /* 顶部右侧功能按钮 */
  const toolButton = () => {
    return (<>
      {props.addButton ? <Button key="button" onClick={() => {
        addClick()
      }} type="primary">
        <PlusOutlined />{props.addTitle ? props.addTitle : language('project.add')}
      </Button> : ''}
      {props.delButton ? <Button type='danger' disabled={delStatus} onClick={(e) => {
        delClick(selectedRowKeys, dataList, selectedRows);
      }} >
        <CloseCircleFilled />	{language('project.del')}
      </Button> : ''}
      {props.uploadButton ? <Tooltip title={language('project.import')} placement='top'>
        <UploadOutlined onClick={() => {
          uploadClick()
        }} style={{ fontSize: '15px' }} />
      </Tooltip> : <></>
      }
      {props.downloadButton ? <Tooltip title={language('project.export')} placement='top'>
        <DownloadOutlined onClick={() =>
          downloadClick({ module: props.columnvalue, value: JSON.stringify(props.columns) })
        } style={{ fontSize: '15px' }} />
      </Tooltip> : <></>}
      {props.otherOperate ? otherOperate() : <></>}
    </>)
  }

  const onExpand = (expanded, record) => {
    //expanded是否展开 record每一项的值 
    let data = { ...expandData }
    const pList = dataList;
    let enRowKeys = [...expandedRows];
    if (!expanded) {
      setExpandedRows(enRowKeys.filter( item => expandAble.rowkey ? item != record[expandAble.rowkey] : item != record.id ));
      pList.map((items) => {
        if (items.id == record.id) {
          if (!items.children) {
            items.children = [];
          }
        }
      });
      setList([...pList]);
      return false;
    };
    enRowKeys.push(expandAble.rowkey? record[expandAble.rowkey] : record.id)
    setExpandedRows(enRowKeys);
    if (record.children?.length > 0)
      return;
    post(onExpandUrl, data).then((res) => {
      pList.map((items) => {
        if (items.id == record.id) {
          if (!items.children || record.children.length < 1) {
            items.children = res.data ? res.data : [];
          }
        }
      });
      setList([...pList]);
    }).catch(() => {
      console.log('mistake')
    })
  }

  /**
   * table 列显示隐藏
   */
  const columnsTablel = async () => {
    setFieldStatus(false);
    setTableLChange(false);
    let data = [];
    data.module = props.columnvalue;
    let res;
    res = await postAsync('/cfg.php?controller=confTableHead&action=showTableHead', data);
    if(res.density){
      setDensitySize(res.density);
    }
    if (!res.success || res.data.length < 1) {
      let aList = [];
      props.columns?.map((item) => {
        if (!concealColumnList[item.dataIndex] && item.hideInTable != true) {
          let showCon = {}
          showCon.show = true;
          concealColumnList[item.dataIndex] = showCon;
          aList.push(item.dataIndex);
        }
      })
      if (expandAble && developShowKey) {
        let num = aList.indexOf(developShowKey) == -1 ? -1 : aList.indexOf(developShowKey) + 2
        expandAble.expandIconColumnIndex = num;
      } 
      let data = [];
      data.module = props.columnvalue;
      data.value = JSON.stringify(concealColumnList);
      res = await postAsync('/cfg.php?controller=confTableHead&action=setTableHead', data)
      if (res.success) {
        setColumnsHide(concealColumnList);
      }
    } else {
      if (expandAble && developShowKey) {
        let aList = [];
        props.columns?.map((item) => {
          if (res.data[item.dataIndex]?.show == true && item.hideInTable != true) {
            aList.push(item.dataIndex);
          }
        })
        let num = aList.indexOf(developShowKey) == -1 ? -1 : aList.indexOf(developShowKey) + 2
        expandAble.expandIconColumnIndex = num;
      }
      setColumnsHide(res.data ? res.data : {});
    }
  }

  useEffect(() => {
    clearTimeout(window.time);
    window.time = setTimeout(() => {
      if (expandAble && developShowKey) {
        let aList = [];
        props.columns?.map((item) => {
          if (columnsHide[item.dataIndex]?.show == true && item.hideInTable != true) {
            aList.push(item.dataIndex);
          }
        })
        let num = aList.indexOf(developShowKey) == -1 ? -1 : aList.indexOf(developShowKey) + 2;
        expandAble.expandIconColumnIndex = num;
      }
      if (!tableLChange) {
        getListdata(1);
      }
    }, 100);
  }, [columnsHide])

  const columnsTableChange = (value) => {
    setTableLChange(true);
    let data = [];
    data.module = props.columnvalue;
    data.value = JSON.stringify(value);
    post('/cfg.php?controller=confTableHead&action=setTableHead', data).then((res) => {
      if (!res.success) {
        message.error(res.msg);
        return false;
      }
      let aList = [];
      if (expandAble && developShowKey) {
        props.columns?.map((item) => {
          if (value[item.dataIndex]?.show == true && item.hideInTable != true) {
            aList.push(item.dataIndex);
          }
        })

        let num = aList.indexOf(developShowKey) == -1 ? -1 : aList.indexOf(developShowKey) + 2
        expandAble.expandIconColumnIndex = num;
      }
      setColumnsHide(value);
    }).catch(() => {
      console.log('mistake')
    })
  }

  const sizeTableChange = (sizeType) => {
    let data = [];
    data.module = props.columnvalue;
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
    <div ref={tableRef} className="components-table-resizable-column">
      <ProTable
        key={props.tableKey}
        search={false}
        className={tableZWidth > 0 ? tableZWidth > configWidth + 120 ? 'proTableBox autoassmbtablebox' : 'proTableBox regassmbtablebox' :
          tableWidth > configWidth + 120 ? 'proTableBox autoassmbtablebox' : 'proTableBox regassmbtablebox'}
        bordered={true}
        columns={props.columns}
        headerTitle={
          props.searchText
        }
        components={components}
        rowClassName={(record) => {
          return rowOpenClassName ? rowOpenClassName(record) : '';
        }}
        onExpand={onExpandUrl ? onExpand : false}
        expandable={expandAble ? expandAble : false}
        loading={loading}
        options={{
          setting: true,
          reload: () => {
            setLoading(true);
            setCurrPage(1);
            setReloadDL(reloadDL + 1);
          }
        }}

        size={densitySize}
        //修改表格密度
        onSizeChange={(e) => {
          sizeTableChange(e);
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
            columnsTableChange(value)
            if (getColHide) {
              getColHide(value)
            }
          },
        }}
        rowSelection={props.rowSelection ?
          {
            columnWidth: 32,
            selectedRowKeys,
            onChange: onSelectedRowKeysChange,
            getCheckboxProps: (record) => {
              if (selectDisabled) {
                return selectDisabled(record);
              }
            },
          } : false
        }
        toolBarRender={
          !writable ? null : toolButton
        }
        onChange={(paging, filters, sorter) => {
          setLoading(true);
          setFilters(JSON.stringify(filters));
          //判断是否开启拖拽上下移动
          if (setScreenList) {
            setScreenList(JSON.stringify(filters));
          }
          if (filterChange) {
            filterChange(filters);
          }
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

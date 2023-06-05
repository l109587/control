import React, { useRef, useState, useEffect } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Space, message, Tag, Input, Spin } from 'antd';
import { post, get } from '@/services/https';
import '@/utils/box.less';
import store from 'store';
import { Resizable } from 'react-resizable';
import { TableLayout } from '@/components';
import { language } from '@/utils/language';
import download from '@/utils/downnloadfile'
import { useSelector } from 'umi'

const { ProtableModule } = TableLayout;
const { Search } = Input;

// 调整table表头
const ResizeableTitle = (props) => {
  const { onResize, width, ...restProps } = props;
  if(!width) {
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

export default () => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  let clientHeight = contentHeight - 220
  const columnlist = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      align: 'center',
      key: 'id'
    },
    {
      title: language('analyse.resrisk.level'),
      dataIndex: 'level',
      align: 'center',
      width: 100,
      key: 'level',
      render: (text, record, index) => {
        let color = 'success';
        let name = language('analyse.resrisk.level.low');
        if(record.level == '1') {
          color = 'rgb(255, 173, 20)';
          name = language('analyse.resrisk.level.low');
        } else if(record.level == '2') {
          color = '#FA561F';
          name = language('analyse.resrisk.level.intermediate');
        } else if(record.level == '3') {
          color = '#FF0000';
          name = language('analyse.resrisk.level.high');
        } else {
          color = '#BD3124';
          name = language('analyse.resrisk.level.serious');
        }
        return (
          <Space>
            <Tag style={{ marginRight: 0, padding: '0 10px' }} color={color} key={record.online}>
              {name}
            </Tag>
          </Space>
        )
      }
    },
    {
      width: 120,
      title: language('analyse.resrisk.addr'),
      dataIndex: 'addr',
      key: 'addr',
      ellipsis: true,
    },
    {
      width: 120,
      title: language('project.analyse.illout.host'),
      dataIndex: 'devName',
      key: 'devName',
      ellipsis: true,
    },
    {
      title: language('project.analyse.illout.mac'),
      dataIndex: 'mac',
      width: 140,
      key: 'mac',
      ellipsis: true,
    },
    {
      title: language('analyse.resrisk.type'),
      width: 110,
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      ellipsis: true,
      render: (text, record, index) => {
        let color = 'success';
        let name = language('analyse.resrisk.type.sysflaw');
        if(record.type == '1') {
          color = 'red';
          name = language('analyse.resrisk.type.sysflaw');
        } else if(record.type == '2') {
          color = 'magenta';
          name = language('analyse.resrisk.type.portopen');
        } else if(record.type == '3') {
          color = 'purple';
          name = language('analyse.resrisk.type.sandisk');
        } else {
          color = 'volcano';
          name = language('analyse.resrisk.type.weakpasd');
        }
        return (
          <Space>
            <Tag style={{ marginRight: 0, padding: '0 10px' }} color={color} key={record.online}>
              {name}
            </Tag>
          </Space>
        )
      }
    },
    {
      title: language('analyse.resrisk.riskName'),
      width: 120,
      dataIndex: 'riskName',
      key: 'riskName',
      ellipsis: true,
    },
    {
      title: language('analyse.resrisk.riskInfo'),
      width: 180,
      dataIndex: 'riskInfo',
      key: 'riskInfo',
      ellipsis: true,
    },
    {
      title: language('analyse.resrisk.verifyInfo'),
      width: 140,
      dataIndex: 'verifyInfo',
      key: 'verifyInfo',
      ellipsis: true,
    },
    {
      title: language('analyse.resrisk.findTM'),
      width: 150,
      dataIndex: 'findTM',
      key: 'findTM',
      ellipsis: true
    },
  ]

// 表格列
  const [cols, setCols] = useState(columnlist);
  const [columns, setColumns] = useState([])
  const [downLoading, setDownLoading] = useState(false);

  // 定义头部组件
  const components = {
    header: {
      cell: ResizeableTitle,
    },
  };

  // 处理拖拽
  const handleResize = (index) => (e, { size }) => {
    const nextColumns = [...cols];
    // 拖拽时调整宽度
    nextColumns[index] = {
      ...nextColumns[index],
      width: size.width < 75 ? 75 : size.width,
    };
    setCols(nextColumns);
  };

  useEffect(() => {
    setColumns((cols || []).map((col, index) => ({
      ...col,
      onHeaderCell: (column) => ({
        width: column.width,
        onResize: handleResize(index),
      }),
    })))
  }, [cols])

  useEffect(() => {
    getfillter();
  }, [])

  const getfillter = () => {
    post('/cfg.php?controller=assetMapping&action=filterRiskAnalysis',).then((res) => {
      let levelfillter = [];
      let typefillter = [];
      res.data.map((item) => {
        if (item.filterName == "type") {
            item.info.map((each) => {
              let name = language('analyse.resrisk.type.sysflaw');
              if(each.text == '1') {
                name = language('analyse.resrisk.type.sysflaw');
              } else if(each.text == '2') {
                name = language('analyse.resrisk.type.portopen');
              } else if(each.text == '3') {
                name = language('analyse.resrisk.type.sandisk');
              } else {
                name = language('analyse.resrisk.type.weakpasd');
              }
              typefillter.push({text: name, value: each.text})
            })
        } else if (item.filterName == "level") {
            item.info.map((each) => {
              let name = language('analyse.resrisk.level.low');
              if(each.text == '1') {
                name = language('analyse.resrisk.level.low');
              } else if(each.text == '2') {
                name = language('analyse.resrisk.level.intermediate');
              } else if(each.text == '3') {
                name = language('analyse.resrisk.level.high');
              } else {
                name = language('analyse.resrisk.level.serious');
              }
                levelfillter.push({text: name, value: each.text})
            })
        } else {

        }
    })
    columnlist.map((item) => {
      if (item.dataIndex == 'type') {
        item.filters = typefillter;
        item.filterMultiple = false;
      } else if (item.dataIndex == "level") {
        item.filters = levelfillter;
        item.filterMultiple = false;
      } else {

      }
    })
    setCols([...columnlist]);
    }).catch(() => {
      console.log('mistake')
    })
  }

  const [queryVal, setQueryVal] = useState();//首个搜索框的值
  let searchVal = { queryVal: queryVal, type: 'fuzzy' };//顶部搜索框值 传入接口
  const apishowurl = '/cfg.php?controller=assetMapping&action=showRiskAnalysis';
  const concealColumns = {
    id: { show: false },
  };
  const tableKey = 'resrisk';
  let rowkey =(record => record.id);
  const columnvalue = 'resriskColumnvalue';
  const [incID, setIncID] = useState(0);//递增的id 删除/添加的时候增加触发刷新
  const downloadButton = true;

  // 导出按钮
  const downloadClick = () => {
    download('/cfg.php?controller=assetMapping&action=exportRiskAnalysis', '', setDownLoading)
  }

  const tableTopSearch = () => {
    return (
      <Search
      placeholder={language('analyse.resrisk.searchText')}
        style={{ width: 200 }}
        allowClear
        onSearch={(queryVal) => {
          setQueryVal(queryVal);
          setIncID(incID+1);
        }}
      />
    )
  }

  return (
    <div>
      <ProtableModule incID={incID} rowkey={rowkey} columnvalue={columnvalue} columns={columns} tableKey={tableKey} clientHeight={clientHeight} apishowurl={apishowurl} searchText={tableTopSearch()} searchVal={searchVal} concealColumns={concealColumns} downloadButton={downloadButton} downloadClick={downloadClick} components={components} />
    </div>
  )
}



import React, { useRef, useState, useEffect } from 'react';
import { ProTable, ModalForm, ProFormText, } from '@ant-design/pro-components';
import { Button, Popconfirm, Space, Tag, message, Input, Tooltip, Spin } from 'antd';
import { post, postAsync } from '@/services/https';
import { DownloadOutlined, LoadingOutlined } from '@ant-design/icons';
import store from 'store';
import { modalFormLayout } from "@/utils/helper";
import '@/utils/index.less';
import './index.less'
import Find from '@/assets/nfd/iconPark-find.svg';
import Blweb from '@/assets/nfd/blueif-web.png';
import Grweb from '@/assets/nfd/garyif-web.png'
import BlSver from '@/assets/nfd/blueservers.svg';
import GrSver from '@/assets/nfd/grayservers.svg';
import BlAssem from '@/assets/nfd/blue-assembly.svg';
import GrAssem from '@/assets/nfd/gray-assembly.svg';
import Blv6 from '@/assets/nfd/bluev6.png';
import Grv6 from '@/assets/nfd/grayv6.png';
import { FaGlobe } from "react-icons/fa";
import { GiAbstract051 } from "react-icons/gi";
import { GrZoomln } from "react-icons/gr";
import { AssemblyLine } from '@icon-park/react';
import { language } from '@/utils/language';
import download from '@/utils/downnloadfile'
import { fetchAuth } from '@/utils/common';
import { useSelector } from 'umi'
import { regList } from '../../../../../../utils/regExp';
const { Search } = Input;
let H = document.body.clientHeight - 320
var clientHeight = H

const Configuration = (props) => {
    const contentHeight = useSelector(({ app }) => app.contentHeight)
	const clientHeight = contentHeight - 248
    const writable = fetchAuth()
    const formRef = useRef();
    const actionRef = useRef();
    const [queryVal, setQueryVal] = useState('');//搜索值
    const [totalPage, setTotalPage] = useState(0);//总条数
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);//选中id数组
    const [nowPage, setNowPage] = useState(1);//当前页码
    const [tabledata, setTabledata] = useState([]);
    const [requestNum, setRequestNum] = useState('');
    const [loading, setLoading] = useState(true);//加载
    const [modalStatus, setModalStatus] = useState(false);//model 添加弹框状态
    const startVal = 1;
    const initLtVal = store.get('pageSize') ? store.get('pageSize') : 50;//默认每页条数
    const [limitVal, setLimitVal] = useState(initLtVal);// 每页条目
    const [sortOrder, setSortOrder] = useState(''); // 排序顺序
    const [sortText, setSorttext] = useState(''); // 排序字段
    const [columnsHide, setColumnsHide] = useState(store.get('tioncolumnvalue') ? store.get('tioncolumnvalue') : {
        id: { show: false },
    });//设置默认列
    const [columns, setColumns] = useState(columnlist)
    const [filters, setFilters] = useState({});
    const [downLoading, setDownLoading] = useState(false);
    let columnvalue = 'teprobelist'
    let concealColumnList = {
        id: { show: false },
      }
    const [densitySize, setDensitySize] = useState('middle')

    const columnlist = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '5%',
        },
        {
            title: language('project.mconfig.ectstu'),
            dataIndex: 'state',
            width: '8%',
            align: 'center',
            render: (text, record, index) => {
                let color = 'success';
                if(record.state == 'online') {
                    color = 'success';
                    text = language('project.sysconf.analysis.online')
                }
                else {
                    color = 'default';
                    text = language('project.sysconf.analysis.noline')
                }
                return (
                    <Space>
                        <Tag style={{ marginRight: 0 }} color={color} key={record.type}>
                            {text}
                        </Tag>
                    </Space>
                )
            }
        },
        {
            title: language('project.temporary.terminal.sid'),
            dataIndex: 'sid',
            width: '15%',
            ellipsis: true,
            sorter: true,
        },
        {
            title: language('project.temporary.terminal.devName'),
            dataIndex: 'devName',
            width: '15%',
            ellipsis: true,
        },
        {
            title: language('project.temporary.terminal.addr'),
            dataIndex: 'addr',
            width: '15%',
            ellipsis: true,
            sorter: true,
        },
        {
            title: language('project.temporary.terminal.mac'),
            dataIndex: 'mac',
            width: '15%',
            ellipsis: true,
        },
        {
            title: language('project.temporary.terminal.os'),
            dataIndex: 'os',
            width: '15%',
            ellipsis: true,
            // readonly:true 不可编辑
        },
        {
            title: language('project.temporary.terminal.listversion'),
            dataIndex: 'version',
            width: '8%',
            ellipsis: true,
        },
        {
            title: language('project.temporary.terminal.conf'),
            dataIndex: 'conf',
            width: '10%',
            align: 'center',
            ellipsis: true,
            render: (text, record, _, action) => {
                let Ifweb = '';
                let Sverver = '';
                let Assem = '';
                let V6avatar = '';
                if (record.conf.indexOf("ckInOut") !== -1) {
                    Ifweb = Blweb;
                }
                if (record.conf.indexOf("ckInOut") === -1) {
                    Ifweb = Grweb;
                }
                if (record.conf.indexOf("vioSrv") !== -1) {
                    Sverver = BlSver;
                }
                if (record.conf.indexOf("vioSrv") === -1) {
                    Sverver = GrSver;
                }
                if (record.conf.indexOf("vioDev") !== -1) {
                    Assem = BlAssem;
                }
                if (record.conf.indexOf("vioDev") === -1) {
                    Assem = GrAssem;
                }
                if (record.conf.indexOf("IPV6AssetRpt") !== -1) {
                    V6avatar = Blv6;
                }
                if (record.conf.indexOf("IPV6AssetRpt") === -1) {
                    V6avatar = Grv6;
                }
                return(<Space>
                    <Tooltip title={language('probers.teprobe.ckInOut')}><img src={Ifweb} style={{ width:'18px', height:'18px'}}/></Tooltip>
                    <Tooltip title={language('probers.teprobe.vioSrv')}><img src={Sverver} style={{ width:'18px', height:'18px'}}/></Tooltip>
                    <Tooltip title={language('probers.teprobe.vioDev')}><img src={Assem} style={{ width:'18px', height:'18px'}}/></Tooltip>
                    <Tooltip title={language('probers.teprobe.IPv6mon')}><img src={V6avatar} style={{ width:'18px', height:'18px'}}/></Tooltip>
                </Space>)
            }
        },
        {
            title: language('project.temporary.terminal.registTM'),
            dataIndex: 'registTM',
            width: '15%',
            ellipsis: true,
        },
        {
            title: language('project.mconfig.operate'),
            valueType: 'option',
            width: '12%',
            align: 'center',
            render: (text, record, _, action) => [
                <Popconfirm title={language('project.temporary.terminal.unloadcontitle')}
                    okText={language('project.yes')} cancelText={language('project.no')}
                    onConfirm={() => {
                        unLoad(record)
                    }}>
                    <a>
                        {language('project.temporary.terminal.unload')}
                    </a>
                </Popconfirm>
                ,
                <Popconfirm okText={language('project.yes')} cancelText={language('project.no')} title={language('project.delconfirm')}
                    onConfirm={() => {
                        delProbe(record)
                    }}>
                    <a>{language('project.del')} </a>
                </Popconfirm>
            ]
        },
    ]
    const searchArr = [nowPage, limitVal, queryVal, filters, sortText, sortOrder];
    useEffect(() => {
        setLoading(true)
        getfillter()
        showTableConf()
    }, [])

    useEffect(() => {
        clearTimeout(window.timer);
        window.timer = setTimeout(function () {
            getTabledata();
        }, 100)
    }, searchArr)

    const getfillter = () => {
        post('/cfg.php?controller=probeManage&action=filterAgentProbeList',).then((res) => {
            let versionfillter = [];
            let osfillter = [];
            let statefillter = [];
            if(res.data) {
                res.data.map((item) => {
                    if(item.filterName == "version") {
                        item.info.map((each) => {
                            versionfillter.push({ text: each.text, value: each.text })
                        })
                    } else if(item.filterName == "os") {
                        item.info.map((each) => {
                            osfillter.push({ text: each.text, value: each.text })
                        })
                    } else if(item.filterName == "state") {
                        item.info.map((each) => {
                            statefillter.push({ text: each.text, value: each.id })
                        })
                    } else {

                    }
                })
                columnlist.map((item) => {
                    if(item.dataIndex == 'version') {
                        item.filters = versionfillter;
                        item.filterMultiple = false;
                    } else if(item.dataIndex == "os") {
                        item.filters = osfillter;
                        item.filterMultiple = false;
                    } else if(item.dataIndex == "state") {
                        item.filters = statefillter;
                        item.filterMultiple = false;
                    } else {

                    }
                })
            } else {

            }
            setColumns([...columnlist]);
        }).catch(() => {
            console.log('mistake')
        })
    }


    /* 表格数据 start  数据起始值   limit 每页条数  */
    const getTabledata = (pagestart = '', pagelimit = '', value = '') => {
        let data = {};
        data.queryVal = value != '' ? value : queryVal;
        data.limit = pagelimit != '' ? pagelimit : limitVal;
        data.start = limitVal * (nowPage - 1);
        data.filters = filters;
        data.sort = sortText;
        if(sortOrder == 'ascend') {
            data.order = 'asc';
        } else if(sortOrder == 'descend') {
            data.order = 'desc';
        } else {
            data.order = ' ';
        }
        post('/cfg.php?controller=probeManage&action=showAgentProbeList', data).then((res) => {
            if(!res.success) {
                message.error(res.msg);
                return false;
            }
            setLoading(false);
            res.data.forEach((each, index) => {
                res.data[index].conf = each.conf.join(',');
            })
            setTotalPage(res.total)
            setTabledata([...res.data])
        }).catch(() => {
            console.log('mistake')
        })
    }




    /* 探针卸载 */
    const unLoad = (record, obj) => {
        let data = {};
        data.ids = record.id;
        data.sids = record.sid;
        post('/cfg.php?controller=probeManage&action=agentUninstall', data).then((res) => {
            if(!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(res.msg)
            getTabledata()
        }).catch(() => {
            console.log('mistake')
        })
    }



    /* 探针删除 */
    const delProbe = (record) => {
        let data = {};
        data.ids = record.id;
        data.sids = record.sid;
        post('/cfg.php?controller=probeManage&action=agentDelete', data).then((res) => {
            if(!res.success) {
                message.error(res.msg);
                return false;
            }
            message.success(res.msg)
            getTabledata()
        }).catch(() => {
            console.log('mistake')
        })
    }






    //点击某行触发事件
    const selectRow = (record) => {
        let key = selectedRowKeys.indexOf(record.id);
        if(key == -1) {
            selectedRowKeys.push(record.id)
        } else {
            selectedRowKeys.splice(key, 1);
        }
        // setRecord(record)//选中行重新赋值
        setSelectedRowKeys([...selectedRowKeys]);
    }


    //弹出查询model
    const getModal = (status) => {
        if(status == 1) {
            setModalStatus(true);
        } else {
            formRef.current.resetFields();
            setModalStatus(false);
        }
    }



    //选中触发
    const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
        // setRecord(record)//选中行重新赋值
        setSelectedRowKeys(selectedRowKeys)
    }



    const searchafter = (
        <Button onClick={async () => {
            formRef.current.submit()
        }} type="primary">{language('project.temporary.terminal.findtext')}</Button>
    )


    /* 查询卸载码 */
    const inQuire = () => {
        let obj = formRef.current.getFieldsValue(['requestCode', 'uninstallCode']);
        let data = {};
        data.requestCode = obj.requestCode
        post('/cfg.php?controller=probeManage&action=getUninstallCode', data).then((res) => {
            if(!res.success) {
                message.error(res.msg);
                return false;
            }
            setTimeout(function () {
                formRef.current.setFieldsValue(res)
            }, 100)
            setRequestNum(res.uninstallCode)
            message.success(res.msg)
        }).catch(() => {
            console.log('mistake')
        })
    }


    const handleExport = () => {
        post('/cfg.php?controller=probeManage&action=exportAgentList', { responseType: 'blob' }).then((res) => {
            let link = document.createElement('a');
            let href = window.URL.createObjectURL(new Blob(['\ufeff'+res]));
            link.href = href;
            link.download = 'regist_list.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(href);
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

    return (
        <Spin spinning={downLoading} tip={language('project.sysdebug.wireshark.loading')} indicator={<LoadingOutlined spin />}>
            <ProTable className='probeliTable'
                search={false}
                editable={{
                    type: 'multiple',
                }}
                bordered={true}
                scroll={{ x: 1800, y: clientHeight }}
                dateFormatter="string"
                loading={loading}
                columnEmptyText={false}
                //设置选中提示消失
                tableAlertRender={false}
                actionRef={actionRef}
                rowKey='id'
                rowkey={record => record.id}
                columns={columns}
                dataSource={tabledata}
                //单选框选中变化
                rowSelection={{
                    selectedRowKeys,
                    onChange: onSelectedRowKeysChange,
                    getCheckboxProps: (record) => ({
                        //   disabled: record.user_id == 1 || record.user_id == 2 || record.user_id == 4, // Column configuration not to be checked
                    }),
                }}
                columnsState={{
                    value: columnsHide,
                    persistenceType: 'sessionStorage',
                    onChange: (value) => {
                        columnsTableChange(value)
                        store.set('tioncolumnvalue', value)
                    },
                }}
                onSizeChange={(e) => {
                    sizeTableChange(e);
                }}
                size={densitySize}
                headerTitle={
                    <Search allowClear
                        className='tebeListSearch'
                        placeholder={language('probers.teprobe.hdprobelist.searchText')}
                        onSearch={(queryVal) => {
                            setQueryVal(queryVal)
                        }}
                    />
                }
                options={{
                    reload: function () {
                        setLoading(true);
                        getTabledata()
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
                    !writable ? false : <>
                      <Button type="primary" style={{  marginRight:'8px' }} onClick={() => { getModal(1) }} icon={<img alt="logo" className='findlogo' src={Find} />}>{language('project.temporary.terminal.findload')}</Button>
                      <Tooltip title={language('project.export')} placement='top'>
                         <DownloadOutlined style={{ fontSize: '15px' }} onClick={() => {
                          download('/cfg.php?controller=probeManage&action=exportAgentList', {}, setDownLoading)
                          }} />
                       </Tooltip>
                    </>
                ]}
                onChange={(paging, filters, sorter) => {
                    setLoading(true);
                    setSortOrder(sorter.order)
                    setSorttext(sorter.field)
                    setFilters(JSON.stringify(filters));
                    setNowPage(paging.current);
                    setLimitVal(paging.pageSize);
                    store.set('pageSize', paging.pageSize)
                }}
                pagination={{
                    showSizeChanger: true,
                    pageSize: limitVal,
                    current: nowPage,
                    total: totalPage,
                    showTotal: total => language('project.page', {total:total}),
                }}
            ></ProTable>


            <ModalForm className='probelistModal'
                submitter={false}
                formRef={formRef} layout="horizontal"
                {...modalFormLayout}
                title={language('project.temporary.terminal.findload')}
                visible={modalStatus} autoFocusFirstInput
                modalProps={{
                    maskClosable: false,
                    onCancel: () => {
                        getModal(2)
                    }
                }}

                onVisibleChange={setModalStatus}
                submitTimeout={2000} onFinish={async (values) => {
                    inQuire()
                }}>
                <ProFormText 
                  label={language('project.temporary.terminal.requestCode')} 
                  width="200px" 
                  name="requestCode" 
                  addonAfter={searchafter} 
                  rules={[
                    { 
                      required: true, 
                      message: language("project.fillin") 
                    },
                    {
                      pattern: regList.wordNum.regex,
                      message: regList.wordNum.alertText,
                    },
                  ]} 
                />
                <ProFormText width="200px" name="uninstallCode" label={language('project.temporary.terminal.uninstallCode')} addonAfter={<Button
                    onClick={async () => {
                        await navigator.clipboard.writeText(requestNum)
                        if(requestNum != ' ') {
                            message.success(language('project.temporary.terminal.requestNum'))
                        }
                    }} type="primary">{language('project.temporary.terminal.ctrlc')}</Button>} />
            </ModalForm>
        </Spin>
    )
}

export default Configuration
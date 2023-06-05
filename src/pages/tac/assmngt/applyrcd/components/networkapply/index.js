import React, { useRef, useState, useEffect, createRef } from 'react'
import {
  Button,
  Input,
  message,
  Space,
  Tag,
  TreeSelect,
  Popconfirm,
  Divider,
  Steps,
  Tooltip,
  Alert,
  Spin,
} from 'antd'
import {
  ProTable,
  DrawerForm,
  ProFormText,
  ProFormTextArea,
  ProFormGroup,
  ProCard,
  ProFormSelect,
  ProDescriptions,
  ProFormItem,
} from '@ant-design/pro-components'
import { post, fileDown } from '@/services/https'
import './index.less'
import { regList, regMacList, regSeletcList } from '@/utils/regExp'
import { vermodal, modalFormLayout } from '@/utils/helper'
import { language } from '@/utils/language'
import { NameText, NotesText, ContentText } from '@/utils/fromTypeLabel';
import '@/utils/index.less'
import {
  HandPaintedPlate,
} from '@icon-park/react'
import { BiArchiveOut, BiUserCircle } from 'react-icons/bi'
import { BsChevronContract } from 'react-icons/bs'
import { ViewGridList } from '@icon-park/react'
import {
  CloseOutlined,
  EditFilled,
  LoadingOutlined,
} from '@ant-design/icons'
import {
  BsFillCheckCircleFill,
  BsQuestionCircleFill,
  BsXCircleFill,
} from 'react-icons/bs'
import { GoTrashcan } from 'react-icons/go'
import {
  AiFillEye,
  AiOutlineClockCircle,
  AiFillInfoCircle,
} from 'react-icons/ai'
import DownnLoadFile from '@/utils/downnloadfile.js';
import PdfSeize from '@/assets/tac/pdfseize.png'
import { TableLayout, PDFViewer, ExportPDF, DynFieldReg, LeftTree, CardModal } from '@/components'
const { ProtableModule, WebUploadr, SignTable, BatchTemplate } = TableLayout
const { Search } = Input
const { Step } = Steps
let clientHeight = document.body.clientHeight - 335
let applyList
let expandData = {}
let columnsOldList = [];
export default () => {
  const columns = [
    {
      title: language('project.assmngt.id'),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      ellipsis: true,
    },
    {
      title: '',
      dataIndex: 'zoneID',
      key: 'zoneID',
      width: 80,
      ellipsis: true,
      hideInTable: true,
    },
    {
      title: '',
      dataIndex: 'orgID',
      key: 'orgID',
      width: 80,
      ellipsis: true,
      hideInTable: true,
    },
    {
      title: language('project.assmngt.resapply.orderstate'), // 状态
      dataIndex: 'orderState',
      width: 90,
      align: 'center',
      key: 'orderState',
      ellipsis: true,
      filterMultiple: false,
      filters: [
        { text: language('project.assmngt.approved'), value: 'approved' },
        { text: language('project.assmngt.unsubmitted'), value: 'unsubmitted' },
        { text: language('project.assmngt.rejected'), value: 'rejected' },
        { text: language('project.assmngt.inapproval'), value: 'inapproval' },
      ],
      render: (test, record, index) => {
        let color = ''
        let text = language('project.assmngt.approved')
        if (record.orderState == 'unsubmitted') {
          color = 'processing'
          text = language('project.assmngt.unsubmitted')
        } else if (record.orderState == 'rejected') {
          color = 'purple'
          text = language('project.assmngt.rejected')
        } else if (record.orderState == 'inapproval') {
          color = 'volcano'
          text = language('project.assmngt.inapproval')
        } else {
          color = 'success'
          text = language('project.assmngt.approved')
        }
        if (!record.innerID) {
          return (
            <Space>
              <Tag
                style={{ marginRight: '0px' }}
                color={color}
                key={record.orderState}
              >
                {text}
              </Tag>
            </Space>
          )
        }
      },
    },
    {
      title: language('project.assmngt.processingstate'),
      dataIndex: 'handleState',
      key: 'handleState',
      ellipsis: true,
      width: 100,
      align: 'center',
      filterMultiple: false,
      filters: [
        { text: language('project.assmngt.processed'), value: 'handled' },
        { text: language('project.assmngt.unprocessed'), value: 'unhandled' },
      ],
      render: (test, record, index) => {
        if (record.innerID) {
          return <div></div>
        } else {
          if (record.handleState == 'handled') {
            return (
              <Tag style={{ marginRight: '0px' }} color="success">
                {language('assmngt.applyrcd.handled.alredy')}
              </Tag>
            )
          } else {
            return (
              <Tag style={{ marginRight: '0px' }} color="default">
                {language('project.assmngt.resapply.notprocessed')}
              </Tag>
            )
          }
        }
      },
    },
    {
      title: language('project.assmngt.resapply.orderid'), // 编号
      dataIndex: 'orderID',
      width: 150,
      ellipsis: true,
      valueType: 'select',
      key: 'orderID',
      render: (test, record, index) => {
        if (record.batch == 'Y') {
          return (
            <Tooltip title={record.orderID}>
              <div className="orderidbox">{record.orderID}</div>
            </Tooltip>
          )
        } else {
          return <Tooltip title={record.orderID}>{record.orderID}</Tooltip>
        }
      },
    },
    {
      title: language('project.assmngt.resapply.zone'), // 所属区域
      dataIndex: 'zone',
      key: 'zone',
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.resapply.organization'), //所属机构
      dataIndex: 'org',
      key: 'org',
      width: 120,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.resapply.applicant'), // 使用人
      dataIndex: 'user',
      key: 'user',
      width: 80,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.assinput.phone'), // 电话
      dataIndex: 'phone',
      key: 'phone',
      width: 110,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.macaddr'), // MAC地址
      dataIndex: 'macaddr',
      key: 'macaddr',
      width: 135,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.assettype'), // 资产类型
      dataIndex: 'assetType',
      key: 'assetType',
      width: 110,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.assetmodel'),
      dataIndex: 'assetModel',
      width: 110,
      readonly: true,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.resapply.purpose'), // 业务用途
      dataIndex: 'buisUsg',
      key: 'buisUsg',
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.location'), // 所在位置
      dataIndex: 'location',
      key: 'location',
      width: 120,
    },
    {
      title: language('project.assmngt.approval.notes'), // 申请人
      dataIndex: 'notes',
      key: 'notes',
      width: 120,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.approval.applypeople'), // 申请人
      dataIndex: 'applicant',
      key: 'applicant',
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.resmngt.signaturefile'), //签章文件
      dataIndex: 'signaturefile',
      key: 'signaturefile',
      width: 80,
      ellipsis: true,
      render: (test, record, index) => {
        if (record.showSignature != 'Y') {
          return <></>
        } else {
          return (
            <>
              <a
                style={
                  record.orderState != 'unsubmitted'
                    ? {
                      color: 'rgba(0,0,0,.25)',
                      cursor: 'not-allowed',
                      disabled: true,
                    }
                    : {}
                }
                onClick={() => {
                  if (record.orderState == 'unsubmitted') {
                    showTemplate(record)
                  }
                }}
              >
                <HandPaintedPlate style={{ fontSize: '18px' }} />
              </a>
              <a
                style={
                  record.orderState != 'unsubmitted'
                    ? {
                      color: 'rgba(0,0,0,.25)',
                      cursor: 'not-allowed',
                      disabled: true,
                    }
                    : {}
                }
                onClick={() => {
                  if (record.orderState == 'unsubmitted') {
                    let arr = record.signature.split(';')
                    setFileName(arr[0])
                    seeModalFrame(record, 'file')
                    if (record.batch == 'Y') {
                      setModPFromType(true)
                      setBatchId(record.id)
                    } else {
                      getDynamicField('form', 'private', record.buisUsg)
                    }
                  }
                }}
              >
                <i
                  className="mdui-icon material-icons"
                  style={{ fontSize: '18px', marginLeft: '8px' }}
                >
                  &#xe415;
                </i>
              </a>
            </>
          )
        }
      },
    },
    {
      title: language('project.mconfig.operate'),
      valueType: 'option',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (text, record, _, action) => {
        if (record.opbutton == 'edit') {
          return (
            <Space>
              <Tooltip title={language('project.edit')}>
                <a>
                  <EditFilled
                    style={{ fontSize: '18px' }}
                    onClick={() => {
                      if (record.batch == 'N') {
                        editForm(record)
                      } else if (record.batch == 'Y') {
                        setModPFromType(true)
                        setBatchId(record.id)
                        showUpTable('open', record, 'request')
                      }
                    }}
                  />
                </a>
              </Tooltip>
              <Popconfirm
                title={language('project.delconfirm')}
                okText={language('project.yes')}
                cancelText={language('project.no')}
                onConfirm={() => {
                  handleDel(record.id)
                }}
              >
                <Tooltip title={language('project.del')}>
                  <a>
                    <GoTrashcan style={{ fontSize: '18px', color: 'red' }} />
                  </a>
                </Tooltip>
              </Popconfirm>
              <Popconfirm
                title={language('project.submitconfirm')}
                okText={language('project.yes')}
                cancelText={language('project.no')}
                onConfirm={() => {
                  if (record.batch == 'N') {
                    setEnter('submit', record, 'N')
                  } else {
                    // setBatchId(record.id)
                    showPSignINApply(record, 'submit')
                  }
                }}
              >
                <Tooltip title={language('project.submit')}>
                  <a>
                    <BiArchiveOut
                      className="seeicon"
                      size={18}
                      style={{ fontSize: '18px', color: '#12C189' }}
                    />
                  </a>
                </Tooltip>
              </Popconfirm>
            </Space>
          )
        } else if (record.opbutton == 'show') {
          return (
            <>
              <Tooltip title={language('project.see')}>
                <a>
                  <AiFillEye
                    className="seeicon"
                    size={18}
                    style={{ fontSize: '18px' }}
                    onClick={() => {
                      getDynamicField('form', 'private', record.buisUsg)
                      setIsBatch(record.batch)
                      setRecordFind(record)
                      showWatchMod('open', record)
                    }}
                  />
                </a>
              </Tooltip>
            </>
          )
        }
      },
    },
  ]

  const uploadColumns = [
    {
      title: language('project.assmngt.resapply.zone'), // 所属区域
      dataIndex: 'zone',
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.resapply.organization'), //所属机构
      dataIndex: 'org',
      width: 120,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.resapply.applicant'), // 使用人
      dataIndex: 'user',
      width: 80,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.assinput.phone'), // 电话
      dataIndex: 'phone',
      width: 110,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.macaddr'), // MAC地址
      dataIndex: 'macaddr',
      width: 120,
      importStatus: true,
      ellipsis: true,
    },
    {
      title: language('project.assmngt.assettype'), // 资产类型
      dataIndex: 'assetType',
      width: 110,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.resapply.purpose'), // 业务用途
      dataIndex: 'buisUsg',
      width: 100,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.location'), // 所在位置
      dataIndex: 'location',
      key: 'location',
      width: 120,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.assetmodel'), // 所在位置
      dataIndex: 'assetModel',
      key: 'assetModel',
      width: 120,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.mconfig.operate'),
      valueType: 'option',
      width: 80,
      fixed: 'right',
      align: 'center',
      render: (text, record, _, action) => {
        return (
          <Space>
            <Popconfirm
              title={language('project.delconfirm')}
              onConfirm={() => {
                const data = [...applyList]
                const newdata = data.filter(
                  (item) => item.innerID != record.innerID
                )
                setUpTableData(newdata)
                applyList = newdata
              }}
            >
              <Tooltip title={language('project.del')}>
                <a>
                  <GoTrashcan style={{ fontSize: '18px', color: 'red' }} />
                </a>
              </Tooltip>
            </Popconfirm>
          </Space>
        )
      },
    },
  ]

  const batchColumns = [
    {
      title: language('project.assmngt.resapply.zone'), // 所属区域
      dataIndex: 'zone',
      width: 100,
      ellipsis: true,
    },
    {
      title: language('project.assmngt.resapply.organization'), //所属机构
      dataIndex: 'org',
      width: 120,
      ellipsis: true,
    },
    {
      title: language('project.assmngt.resapply.applicant'), // 使用人
      dataIndex: 'user',
      width: 80,
      ellipsis: true,
    },
    {
      title: language('project.assmngt.assinput.phone'), // 电话
      dataIndex: 'phone',
      width: 110,
      ellipsis: true,
    },
    {
      title: language('project.assmngt.macaddr'), // MAC地址
      dataIndex: 'macaddr',
      width: 120,
      ellipsis: true,
      importStatus: true,
    },
    {
      title: language('project.assmngt.assettype'), // 资产类型
      dataIndex: 'assetType',
      width: 110,
      ellipsis: true,
    },
    {
      title: language('project.assmngt.resapply.purpose'), // 业务用途
      dataIndex: 'buisUsg',
      width: 100,
      ellipsis: true,
    },
    {
      title: language('project.assmngt.location'), // 所在位置
      dataIndex: 'location',
      key: 'location',
      width: 120,
      ellipsis: true,
    },
    {
      title: language('project.assmngt.assetmodel'),
      dataIndex: 'assetModel',
      key: 'assetModel',
      width: 120,
      ellipsis: true,
    },
  ]

  const watchFormRef = useRef()
  const drawRef = useRef()
  const upDrawRef = useRef()
  const upTableRef = useRef()
  const zFileFormRef = useRef()
  const pdfFormRef = createRef()
  const [buisUsgVal, setBuisUsgVal] = useState('');//业务用途选中信息
  const [queryVal, setQueryVal] = useState() //首个搜索框的值
  const [incID, setIncID] = useState(0)
  const [drawStatus, setDrawStatus] = useState(false)
  const [upDrawStatus, setUpDrawStatus] = useState(false)
  const [watchStatus, setWatchStatus] = useState(false)
  const [applyInfo, setApplyInfo] = useState({})
  const [batchApplyInfo, setBatchApplyInfo] = useState([])
  const [stepData, setStepData] = useState([])
  const [privateField, setPrivateField] = useState([]) //私有动态字段列表
  const [dynamicFieldList, setDynamicFieldList] = useState([]) //动态字段列表
  const [upTableSta, setUpTableSta] = useState(false)
  const [upTableData, setUpTableData] = useState([])
  const [upTotal, setUpTotal] = useState('')
  const [isBatch, setIsBatch] = useState(false)
  const [batchFile, setBatchFile] = useState('')
  const [batchId, setBatchId] = useState('')
  const [modPFromType, setModPFromType] = useState(false)
  const [importLoading, setImportLoading] = useState(false)
  let dynamicFieldArr = [] //动态字段列表

  const tableKey = 'applycrdTable'
  const uploadButton = true;
  const downloadButton = true; //导出按钮 与 downloadClick 方法 组合使用
  const addButton = true
  const rowSelection = true
  const rowKey = (record) => record.id //列表唯一值
  const addTitle = language('project.assmngt.resapply.apply')
  const columnvalue = 'aapplyrcdcolumnvalue';
  const apiShowUrl =
    '/cfg.php?controller=confAssetManage&action=showSignINApply'
  let searchVal = {
    queryVal: queryVal,
    queryType: 'fuzzy',
    buisUsg: buisUsgVal,
    flow: 'asset_entry',
    assetflow: 'ASSETFLOW_LR',
  }
  const concealColumns = {
    id: { show: false },
  }

  const [batchFileSta, setBatchFileSta] = useState(false)

  const onExpandUrl =
    '/cfg.php?controller=confAssetManage&action=showSignINSingleApply'
  const expandAble = {
    indentSize: 30,
    expandIconAsCell: false,
    expandIconColumnIndex: 0,
    expandIcon: ({ expanded, onExpand, record }) => {
      return record.batch == 'Y' ? (
        expanded ? (
          <Tooltip title={language('illevent.stow')}>
            <BsChevronContract
              className="netipicon"
              style={{
                fontSize: '18px',
                color: '#FF7429',
                marginBottom: '-4px',
              }}
              onClick={(e) => {
                onExpand(record, e)
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip title={language('illevent.expand')}>
            <ViewGridList  // 展开
              className="netipicon"
              theme="outline"
              size="18"
              fill="#FF7429"
              onClick={(e) => {
                expandData.id = record.id
                expandData.orderID = record.orderID
                expandData.showFirst = 'N'
                onExpand(record, e)
              }}
            />
          </Tooltip>
        )
      ) : (
        ''
      )
    }
  }

  const searchDiv = () => {
    return (
      <Space className='netasearchbox'>
        <Search
          allowClear
          placeholder={language('project.assmngt.resapply.dissearch')}
          style={{ width: 200 }}
          onSearch={(queryVal) => {
            setQueryVal(queryVal)
            incAdd()
          }}
        />
        <ProFormSelect options={purposeList}
          name="deviceID"
          placeholder={language('project.assmngt.assinput.businesspurpose')}
          onChange={(key) => {
            setBuisUsgVal(key);
            getDynamicField('table', 'private', key);
          }}
        />
      </Space>
    )
  }

  const upSearchDiv = () => {
    return (
      <Space>
        <Alert
          className="applyUpAlert"
          type="info"
          showIcon
          message={language('project.assmngt.applyrcd.dataTotal', {
            upTotal: upTotal,
          })}
        />
      </Space>
    )
  }

  useEffect(() => {
    getDynamicField()
    getAssettype()
    getTree()
    getOrg()
    // getBusinessPurpose()
  }, [])

  //区域数据
  const zoneType = 'zone'
  const [treeValue, setTreeValue] = useState()
  const [treeData, setTreeData] = useState([])
  const [zoneVal, setZoneVal] = useState() //添加区域id、
  const [assettypeList, setAssettypeList] = useState([]) //资产类型
  const [purposeList, setPurposeList] = useState([]) //业务用途
  //组织机构
  const orgType = 'org'
  const [orgValue, setOrgValue] = useState()
  const [orgkey, setOrgkey] = useState([]) //选中多个key
  const [orgData, setOrgData] = useState([])
  const [orgVal, setOrgVal] = useState() //添加组织结构id、

  const [action, setAction] = useState('')
  const [submitType, setSubmitType] = useState() //提交类型，编辑还是添加
  const [signTitle, setSignTitle] = useState()
  const [signName, setSignName] = useState()
  const [signDataTime, setSignDataTime] = useState()
  const [topData, setTopData] = useState([])
  let topList = []
  const [bottomData, setBottomData] = useState([])
  const [fileModalStatus, setFileModalStatus] = useState(false) //model 签章
  const [recordFind, setRecordFind] = useState({})
  const [initialValue, setInitialValue] = useState([]) //默认查看头部列表数据
  const [batchInitVAl, setBatchInitVAl] = useState([])

  const [importFieldsList, setImportFieldsList] = useState([]) //导入 选择字段
  let importArrFields = [];
  const [impErrorShow, setImpErrorShow] = useState(false) //是否显示错误提示
  const [impErrorMsg, setImpErrorMsg] = useState(true) //错误提示信息
  const [importBui, setImportBui] = useState(' ') //导入业务用途
  const [importFieldsArr, setImportFieldsArr] = useState([]) //导入 选择字段数组
  const [columnList, setColumnList] = useState(uploadColumns) //table 头部数据
  const [columnsOld, setColumnsOld] = useState([]) //旧table 头数据,包含公有动态字段
  const [columnsNew, setColumnsNew] = useState(uploadColumns) //新table 头数据,包含公有动态字段, 导入使用
  const [appColumns, setAppColumns] = useState(columns)
  const [oldColumns, setOldColumns] = useState(columns)//历史表头 + 通用动态字段
  const [newColumns, setNewColumns] = useState(columns)//新表头 + 私有动态字段
  const [batchData, setBatchData] = useState([])
  const [batchLoading, setBatchLoading] = useState(false)

  const [saModalStatus, setSaModalStatus] = useState(false) //model 签章
  const [fileCode, setFileCode] = useState('utf-8') //文件编码
  const [fileName, setFileName] = useState(undefined)
  //接口参数
  const paramentUpload = {
    filecode: fileCode,
  }
  const fileList = []
  const uploadConfig = {
    accept: 'csv', //接受上传的文件类型：zip、pdf、excel、image
    max: 100000000000000, //限制上传文件大小
    url: '/cfg.php?controller=confAssetManage&action=importApply',
  }

  //上传功能
  const isAuto = true
  const upbutext = language('project.upload')
  const maxSize = 300
  const accept = '.tgz, .tar, .zip, .pdf'
  const upurl = '/cfg.php?controller=confSignature&action=uploadSignature'
  const isShowUploadList = false
  const maxCount = 1
  const isUpsuccess = true
  const [parameter, setParameter] = useState({})
  const [pdfUrl, setPdfUrl] = useState()
  const onSuccess = (res, info) => {
    setFileName(info.name)
    if (res.signature) {
      setPdfUrl('data:application/pdf;base64,' + res.signature)
    }
  }

  const getTree = (id = 1) => {
    let data = {}
    data.id = id ? id : 1
    data.type = zoneType
    post('/cfg.php?controller=confZoneManage&action=showZoneTree', data)
      .then((res) => {
        const treeInfoData = [
          {
            id: res.id,
            pId: res.gpid,
            value: res.id,
            title: res.name,
          },
        ]
        setTreeData(treeInfoData)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const getOrg = (id = '') => {
    let data = {}
    data.id = id ? id : zoneVal ? zoneVal : 1
    data.type = orgType
    post('/cfg.php?controller=confZoneManage&action=showZoneTree', data)
      .then((res) => {
        if (res.children.length > 0) {
          const treeInfoData = []
          res.children.map((item) => {
            let isLeaf = true
            if (item.leaf == 'N') {
              isLeaf = false
            }
            treeInfoData.push({
              id: item.id,
              pId: item.gpid,
              value: item.id,
              title: item.name,
              isLeaf: isLeaf,
            })
          })
          setOrgData(treeInfoData)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //业务用途 获取资源字段 id
  const getBusinessPurpose = (id = 1, list = '') => {
    post('/cfg.php?controller=confResField&action=showResField', { id: id })
      .then((res) => {
        let content = []
        res.data.map((item) => {
          let confres = []
          confres.label = item
          confres.value = item
          content.push(confres)
        })
        setPurposeList(content)
        let info = []
        res.data.map((item) => {
          info.push({ text: item, value: item })
        })
        if(list){
          let columnsList = list ? list : newColumns;
          columnsList.map((item) => {
            if (item.dataIndex == 'buisUsg') {
              item.filters = info
              item.filterMultiple = false
            }
          })
          setNewColumns(columnsList)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //资产类型 id
  const getAssettype = (id = 4) => {
    post('/cfg.php?controller=confResField&action=showResField', { id: id })
      .then((res) => {
        let info = []
        res.data.map((item) => {
          let confres = []
          confres.label = item
          confres.value = item
          info.push(confres)
        })
        setAssettypeList(info)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  // 查找父节点的值
  const wirelessVal = (value, parentId = false) => {
    let cValue = []
    if (!parentId) {
      cValue.push(value)
    }
    treeData.forEach((each, index) => {
      if (each.id == value) {
        if (each.pId != 0) {
          treeData.forEach((item, key) => {
            if (each.pId == item.id) {
              if (item.pId != 0) {
                let wirelessArr = wirelessVal(item.id, 999)
                cValue.push(item.id)
                cValue.push.apply(cValue, wirelessArr)
              } else {
                cValue.push(item.id)
              }
            }
          })
        } else {
          if (parentId) {
            cValue.push(each.id)
          }
        }
      }
    })
    return cValue
  }

  //下拉列表选中
  const onChangeSelect = (value, label, extra) => {
    let selKye = wirelessVal(value)
    selKye = selKye.reverse() //数组反转
    let selVal = [] //选中内容
    selKye.forEach((i) => {
      treeData.forEach((item, key) => {
        if (i == item.value) {
          selVal.push(item.title)
        }
      })
    })
    let selKyeNum = selKye[selKye.length - 1]
    drawRef.current.setFieldsValue({ zone: selVal.join('/') })
    drawRef.current.setFieldsValue({ zoneID: selKyeNum })
    setTreeValue(selVal.join('/'))
    setOrgValue()
    setZoneVal(selKyeNum)
    //获取组织机构列表
    getOrg(selKyeNum)
  }

  //区域管理下拉处理
  const onLoadData = ({ id, children }) =>
    new Promise((resolve) => {
      if (children) {
        resolve()
        return
      }
      let info = []
      let data = {}
      data.id = id
      data.type = zoneType
      post('/cfg.php?controller=confZoneManage&action=showZoneTree', data).then(
        (res) => {
          res.children.map((item) => {
            let isLeaf = true
            if (item.leaf == 'N') {
              isLeaf = false
            }
            info.push({
              id: item.id,
              title: item.name,
              isLeaf: isLeaf,
              pId: item.gpid,
              value: item.id,
            })
          })
          setTreeData(treeData.concat(info))
          resolve(undefined)
        }
      )
    })
  //区域管理end

  // 组织机构 查找父节点的值
  const orgwirelessVal = (value, parentId = false) => {
    let cValue = []
    if (!parentId) {
      cValue.push(value)
    }
    orgData.forEach((each, index) => {
      if (each.id == value) {
        if (each.pId != 0) {
          orgData.forEach((item, key) => {
            if (each.pId == item.id) {
              if (item.pId != 0) {
                let wirelessArr = orgwirelessVal(item.id, 999)
                cValue.push(item.id)
                cValue.push.apply(cValue, wirelessArr)
              } else {
                cValue.push(item.id)
              }
            }
          })
        } else {
          if (parentId) {
            cValue.push(each.id)
          }
        }
      }
    })
    return cValue
  }

  // 组织机构 下拉列表选中
  const onOrgSelect = (value, label, extra) => {
    let selKye = orgwirelessVal(value)
    selKye = selKye.reverse() //数组反转
    let selVal = [] //选中内容
    selKye.forEach((i) => {
      orgData.forEach((item, key) => {
        if (i == item.value) {
          selVal.push(item.title)
        }
      })
    })
    let selKyeNum = selKye[selKye.length - 1]
    upDrawRef.current?.setFieldsValue({ orgID: selKyeNum })
    drawRef.current?.setFieldsValue({ org: selVal.join('/') })
    drawRef.current?.setFieldsValue({ orgID: selKyeNum })
    setOrgValue(selVal.join('/'))
    setOrgkey(selKye)
    setOrgVal(selKyeNum)
  }

  //组织机构 下拉处理
  const onOrgData = ({ id, children }) =>
    new Promise((resolve) => {
      if (children) {
        resolve()
        return
      }
      let info = []
      let data = {}
      data.id = id
      data.type = orgType
      post('/cfg.php?controller=confZoneManage&action=showZoneTree', data).then(
        (res) => {
          res.children.map((item) => {
            let isLeaf = true
            if (item.leaf == 'N') {
              isLeaf = false
            }
            info.push({
              id: item.id,
              title: item.name,
              isLeaf: isLeaf,
              pId: item.gpid,
              value: item.id,
            })
          })
          setOrgData(orgData.concat(info))
          resolve(undefined)
        }
      )
    })
  //组织机构 end

  const incAdd = () => {
    let inc;
    clearTimeout(inc);
    inc = setTimeout(() => {
      setIncID(incID => incID + 1);
    }, 100);
  }

  const addClick = () => {
    showDraw('open')
  }

  const uploadClick = () => {
    showUpDraw('open')
  }

  const [fileDownLoading, setFileDownLoading] = useState(false);
  const loadIcon = <LoadingOutlined spin />
  const [filtersList, setFiltersList] = useState({});
  const filterChange = (filters) => {
    setFiltersList(filters)
  }

  //导出按钮
  const downloadClick = (list = {}) => {
    let api = '/cfg.php?controller=confAssetManage&action=exportApply';
    let data = list;
    data.queryVal = queryVal;
    data.filters = JSON.stringify(filtersList);
    data.assetflow = 'ASSETFLOW_LR';
    DownnLoadFile(api, data, setFileDownLoading)
  }

  /* 申请编辑 */
  const showDraw = (status, record) => {
    if (status == 'open') {
      getDynamicField('from', 'public')
      setDrawStatus(true)
    } else {
      setTreeValue('')
      setZoneVal()
      setOrgValue('')
      setOrgVal()
      setOrgData([])
      setPrivateField([])
      drawRef.current.resetFields()
      setDrawStatus(false)
    }
  }

  /* 导入 */
  const showUpDraw = (status, record) => {
    if (status == 'open') {
      setUpDrawStatus(true)
    } else {
      setUpDrawStatus(false)
    }
  }

  /* 导入弹框关闭 */
  const closeUpDraw = (type) => {
    setImpErrorMsg();
    setImpErrorShow(false);
    showUpDraw('close')
    setImportBui(' ')
    if (type == 2) {
      setColumnsNew([...columnsOld])
    }
    setNewColumns([...oldColumns])
    setImportFieldsList([])
    importArrFields = [];
    setImportFieldsArr([])
    upDrawRef.current.resetFields()
  }

  const showUpTable = (status, record, value) => {
    if (status == 'open') {
      if (value == 'request') {
        getBatchEditData(record)
      }
      setUpTableSta(true)
    } else {
      applyList = []
      setUpTableData([])
      setModPFromType(false)
      setUpTableSta(false)
    }
  }

  const getBatchEditData = (record) => {
    setBatchLoading(true)
    post('/cfg.php?controller=confAssetManage&action=showSignINSingleApply', {
      id: record.id,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      setUpTableData(res.data)
      applyList = res.data
      setBatchLoading(false)
    })
  }

  /* 查看 */
  const showWatchMod = (status, record) => {
    if (status == 'open') {
      setWatchStatus(true)
      watchInfo(record)
    } else {
      setWatchStatus(false)
    }
  }

  const editForm = (values) => {
    showDraw('open')
    setTreeValue(values.fullZone)
    setZoneVal(values.zoneID)
    setOrgValue(values.fullOrg)
    setOrgVal(values.orgID)
    getDynamicField('from', 'private', values.buisUsg)
    setTimeout(function () {
      drawRef.current.setFieldsValue(values)
    }, 100)
  }

  const setEnter = (option, record, val) => {
    let data = record
    data.op = option
    data.zoneID = record.zoneID ? record.zoneID : zoneVal
    data.orgID = record.orgID ? record.orgID : orgVal
    data.zone = record.zone ? record.zone : treeValue
    data.org = record.org ? record.org : orgValue
    data.ipaddr = JSON.stringify(record.ipaddr)
    data.flow = 'asset_entry'
    data.assetflow = 'ASSETFLOW_LR'
    data.children = ''
    data.list = JSON.stringify(record.children)
    post('/cfg.php?controller=confAssetManage&action=setSignINApply', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        } else {
          if (val == 'zfile') {
            closeFileModal()
          } else if (val == 'upTable') {
            showUpTable('close')
          } else if (val == 'batchFile') {
            showBatchFileModal(2)
          } else if (!val) {
            showDraw('close')
          }
          message.success(res.msg)
          incAdd()
        }
      })
      .catch(() => {
        console.log('error')
      })
  }

  const handleEnter = (option, record, val) => {
    let data = {}
    data.op = option
    data.list = JSON.stringify(applyList.length > 0 ? applyList : batchInitVAl)
    data.zoneID = record.zoneID ? record.zoneID : zoneVal
    data.orgID = record.orgID ? record.orgID : orgVal
    data.flow = 'asset_entry'
    data.assetflow = 'ASSETFLOW_LR'
    data.id = modPFromType ? batchId : ''
    post(
      '/cfg.php?controller=confAssetManage&action=setSignINApply',
      data
    ).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      } else {
        if (val == 'upTable') {
          showUpTable('close')
        } else if (val == 'batchFile') {
          showBatchFileModal(2)
        }
        message.success(res.msg)
        incAdd()
      }
    })
  }

  const handleDel = (idVal) => {
    post('/cfg.php?controller=confAssetManage&action=delSignINApply', {
      ids: idVal,
    }).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      } else {
        message.success(res.msg)
        incAdd()
      }
    })
  }

  /* 查看接口 */
  const watchInfo = (record) => {
    setBatchLoading(true)
    let data = {}
    data.id = record.id
    data.batch = record.batch
    post(
      '/cfg.php?controller=confAssetManage&action=showSignINFlow',
      data
    ).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      }
      if (record.batch == 'Y') {
        setBatchApplyInfo(res.data?.applyInfo)
        let filename = res?.data?.signature.split(';')
        setBatchFile(filename[0])
        setBatchLoading(false)
      } else {
        setApplyInfo(res.data?.applyInfo)
      }
      setStepData(res.data?.flowInfo)
    })
  }

  const titleNameStep = (state) => {
    switch (state) {
      case 'submit':
        return language('project.assmngt.subbmit')
      case 'approval':
        return language('project.assmngt.approval')
      default:
        return language('project.assmngt.unapproval')
    }
  }

  //拼接列表图标
  const iconStep = (result) => {
    switch (result) {
      case 'approved':
        return <BsFillCheckCircleFill />
      default:
        return <BsXCircleFill color="red" />
    }
  }

  //查看审核状态list
  const showStep = () => {
    let approvalNum = stepData?.length
    return stepData?.map((item, index) => {
      let titleType = titleNameStep(item.action)
      let icon = iconStep(item.result)
      return (
        <>
          <Step
            title={titleType}
            status="process"
            description={
              item.action == 'unapproved' ? (
                <div className="stepcardempty"></div>
              ) : (
                <ProCard
                  className="stepcard"
                  bordered={true}
                  direction="column"
                  ghost
                >
                  <div className="cardbox">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="iconbox">
                        {<BiUserCircle className="icon" />}
                      </div>
                      {item.admin}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="iconbox">
                        <AiOutlineClockCircle />
                      </div>
                      {item.time}
                    </div>
                  </div>
                  <div style={{ paddingLeft: 50 }}>
                    <div>{item.desc}</div>
                  </div>
                </ProCard>
              )
            }
          ></Step>
          {approvalNum == 1 ? (
            <>
              <Step
                title={language('project.assmngt.unapproval')}
                status="process"
                description={<div className="stepcardempty"></div>}
              ></Step>
              <Step
                icon={<BsQuestionCircleFill />}
                status="process"
                description={<div className="stepcardempty"></div>}
              ></Step>
            </>
          ) : (
            <></>
          )}
          {item.action === 'approval' &&
            index + 1 >= approvalNum &&
            (item.result == 'approved' || item.result == 'rejected') ? (
            <Step
              title={
                item.result === 'approved'
                  ? language('project.adopt')
                  : language('project.reject')
              }
              icon={icon}
              status="process"
              description={
                <ProCard
                  className="stepcard"
                  bordered={true}
                  direction="column"
                  ghost
                >
                  <div className="cardbox">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="iconbox">
                        {<AiFillInfoCircle className="icon" />}
                      </div>
                      {item.result === 'approved'
                        ? language('project.assmngt.approvalinstructions')
                        : language('project.assmngt.reasonfrorejection')}
                    </div>
                    {/* <div style={{ display:'flex',alignItems:'center' }}>
                                    <div className='iconbox' ><AiOutlineClockCircle /></div>
                                    {item.time}
                                </div> */}
                  </div>
                  <div style={{ paddingLeft: 50 }}>
                    <div>{item.notes}</div>
                  </div>
                </ProCard>
              }
            ></Step>
          ) : (
            <></>
          )}
        </>
      )
    })
  }

  //获取动态字段列表 attribute  private 私有  public 公有
  const getDynamicField = (
    type = 'table',
    attribute = 'public',
    buisusg = ''
  ) => {
    let data = {}
    data.filterType = 'dynamic'
    data.modtype = 'asset'
    data.attribute = attribute
    data.buisusg = buisusg
    post('/cfg.php?controller=confResField&action=showResFieldList', data)
      .then((res) => {
        if (res.data) {
          if (attribute == 'public') {
            setDynamicFieldList(res.data)
            dynamicFieldArr = res.data
            setPrivateField(res.data)
            if (type == 'table') {
              tableList(type, res.data, columns, attribute, appColumns)
            } else if (type == 'formtable') {
              tableList(type, res.data, columnsOld.length >= 1 ? columnsOld: columnsOldList, attribute, oldColumns)
            } else {
              setPrivateField(res.data)
            }
          } else {
            if (type == 'table') {
              tableList(type, res.data, oldColumns, attribute, oldColumns)
            } else if (type == 'formtable') {
              tableList(type, res.data, columnsOld, attribute, oldColumns)
            } else {
              let arr =
                dynamicFieldList.length >= 1
                  ? dynamicFieldList
                  : dynamicFieldArr
              setPrivateField(arr.concat(res.data))
            }
          }
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //处理表头数据
  const tableList = (type, data, list, attribute, appColumnlist) => {
    let columnsArr = [...list]
    let appcolsArr = [...appColumnlist]
    data.map((item) => {
      let info = {}
      info.title = item.name
      info.dataIndex = item.key
      info.ellipsis = true
      info.importStatus = true
      info.width = 100
      if (type == 'table' && attribute == 'public') {
        columnsArr.splice(-3, 0, info)
      } else if (type == 'table') {
        columnsArr.splice(-3, 0, info)
      } else {
        columnsArr.splice(-1, 0, info)
      }
      appcolsArr.splice(-3, 0, info)
      // columnsArr.splice(-1, 0, info)
    })
    getBusinessPurpose(1)
    if (attribute == 'public' && type == 'table') {
      let fileColumnArr = [...uploadColumns];
      data.map((item) => {
        let info = {};
        info.title = item.name;
        info.dataIndex = item.key;
        info.ellipsis = true;
        info.importStatus = true;
        info.width = 100;
        fileColumnArr.splice(-1, 0, info);
      })
      setColumnList([...fileColumnArr])
      setColumnsOld([...fileColumnArr])
      columnsOldList = [...fileColumnArr]
      setColumnsNew([...fileColumnArr])
      setAppColumns([...columnsArr])
      setOldColumns([...columnsArr])
      setNewColumns([...columnsArr])
    } else if (type == 'table') {
      setNewColumns([...columnsArr])
      incAdd()
    } else {
      setColumnsNew([...columnsArr])
    }
  }


  const getOptions = (item) => {
    let info = []
    let contents = item.content.split(',')
    if (contents.length > 0) {
      contents.map((val) => {
        let confres = []
        confres.label = val
        confres.value = val
        info.push(confres)
      })
    }
    return info
  }

  //签章流程字段回显
  const showTemplate = (record) => {
    let data = {}
    data.name = 'asset_entry'
    data.buisusg = record.buisUsg
    data.isBatch = record.batch //Y 批量  N单个
    post('/cfg.php?controller=confSignature&action=showTemplate', data)
      .then((res) => {
        if (res.success) {
          setIsBatch(record.batch)
          setSignTitle(res.template?.title)
          setSignName(res.template?.name)
          setSignDataTime(res.template?.dataTime)
          setTopData(res.template?.upData)
          topList = res.template?.upData
          setBottomData(res.template?.bottomData)
          if (record.batch == 'Y') {
            showPSignINApply(record, 'template', res.template?.batchData)
          }
          incAdd()
          getSaModal(1, record)
        } else {
          message.error(res.msg)
          return false
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const showPSignINApply = (record, type = '', batchData = []) => {
    //expanded是否展开 record每一项的值
    let data = {}
    data.id = record.id
    data.orderID = record.orderID
    data.batch = record.batch
    post(
      '/cfg.php?controller=confAssetManage&action=showSignINSingleApply',
      data
    )
      .then((res) => {
        if (type == 'template') {
          let dArr = []
          dArr.push(batchData[0])
          let childrenBat = [...batchData[1].children]
          res.data?.map((item) => {
            let findList = { title: '' }
            findList.children = saModListTitle(childrenBat, item)
            dArr.push(findList)
          })
          setBatchData(dArr)
        } else {
          plSave(type, res.data ? res.data : [], 'submit', record.id)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  //批量提交
  const plSave = (op = '', list, type = '', idVal) => {
    let data = {}
    data.op = op
    data.list = JSON.stringify(list)
    data.flow = 'asset_entry'
    data.batch = 'Y'
    data.id = idVal
    data.assetflow = 'ASSETFLOW_LR'
    post(
      '/cfg.php?controller=confAssetManage&action=setSignINApply',
      data
    ).then((res) => {
      if (!res.success) {
        message.error(res.msg)
        return false
      } else {
        message.success(res.msg)
        incAdd()
      }
    })
  }

  //文件签章内容处理title
  const saModListTitle = (list, record) => {
    let data = []
    if (list.length > 0) {
      list.map((item) => {
        data.push({ title: record[item.key] })
      })
    }
    return data
  }

  //判断是否弹出文件签章model
  const getSaModal = (status, record = '') => {
    if (status == 1) {
      saModContent(record)
      setSaModalStatus(true)
    } else {
      setSaModalStatus(false)
    }
  }

  const closeSaModal = () => {
    getSaModal(2)
  }

  //文件签章内容赋值
  const saModContent = (record) => {
    setSignName(record?.applicant)
    setSignDataTime(record?.createTime)
    if (topList.length > 0) {
      topList.map((item) => {
        saModList(item.children, record)
      })
    }
    setTopData(topList)
  }

  //文件签章内容处理
  const saModList = (list, record = '') => {
    if (list.length > 0) {
      list.map((item) => {
        item.value = record[item.key]
      })
    }
    return list
  }

  //查看弹出框页面数据赋值
  const seeModalFrame = (record, type) => {
    setBatchLoading(true)
    let data = {}
    data.id = record.id
    data.batch = record.batch
    // setRecordFind(record);
    post('/cfg.php?controller=confAssetManage&action=showSignINFlow', data)
      .then((res) => {
        if (!res.success) {
          message.error(res.msg)
          return false
        }
        setRecordFind(record)
        setInitialValue(res.data?.applyInfo)
        if (type == 'file') {
          setParameter({
            id: record.id,
            name: 'asset_entry',
            buisusg: record.buisUsg,
            isBatch: record.batch,
          })
          uploadSignature(record)
          if (record.batch == 'Y') {
            setBatchInitVAl(res.data?.applyInfo)
            showBatchFileModal('open')
            setBatchLoading(false)
          } else {
            getFileModal(1)
          }
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const showBatchFileModal = (status) => {
    if (status == 'open') {
      setBatchFileSta(true)
    } else {
      setBatchFileSta(false)
    }
  }

  //文件流查看
  const uploadSignature = (record, type = '') => {
    let data = {}
    data.id = record.id
    data.name = 'asset_entry'
    post('/cfg.php?controller=confSignature&action=previewSignature', data, {
      responseType: 'blob',
    }).then((res) => {
      if (type == 'seeFile') {
        if (res.data?.size > 0) {
          let url = window.URL.createObjectURL(
            new Blob([res.data], { type: 'application/pdf' })
          )
          window.open(url)
        }
      } else {
        if (res.data?.size > 5) {
          let url = window.URL.createObjectURL(
            new Blob([res.data], { type: 'application/pdf' })
          )
          if (url) {
            setPdfUrl(url)
          }
        }
      }
    })
  }

  const closeFileModal = () => {
    setPrivateField([])
    dynamicFieldArr = []
    setPdfUrl()
    getFileModal(2)
  }

  //判断是否弹出上传签章文件model
  const getFileModal = (status) => {
    if (status == 1) {
      setFileModalStatus(true)
    } else {
      zFileFormRef.current?.resetFields()
      setFileModalStatus(false)
    }
  }

  /* 提交导入内容标题 */
  const importTitle = async (info) => {
    let data = {}
    data.headerLine = JSON.stringify(Object.values(info))
    data.field = JSON.stringify(Object.keys(info))
    setBatchLoading(true)
    post('/cfg.php?controller=confAssetManage&action=importApply', data)
      .then((res) => {
        if (!res.success) {
          setImpErrorMsg(res.msg)
          setImpErrorShow(true)
          setImportLoading(false)
          setBatchLoading(false)
          return false
        }
        message.success(res.msg)
        setUpTableData(res.data)
        applyList = res.data
        setUpTotal(res.total)
        setImportLoading(false)
        closeUpDraw()
        setBatchLoading(false)
        setTimeout(() => {
          showUpTable('open')
        }, 100)
      })
      .catch(() => {
        // setSpinning(false)
        console.log('mistake')
      })
  }

  /* 导入成功文件返回 */
  const onFileSuccess = (res) => {
    if (res.success) {
      let info = [{ value: '', label: language('project.select') }]
      res.data.map((val, index) => {
        res.data[index] = val.trim()
        let confres = []
        confres.label = val
        confres.value = index + '&&' + val.trim()
        info.push(confres)
      })
      setImportFieldsList(res.data);
      importArrFields = res.data;
      setImportFieldsArr(info);
    } else {
      setImpErrorMsg(res.msg);
      setImpErrorShow(true);
    }
  }

  return (
    <>
      <ProtableModule
        concealColumns={concealColumns}
        developShowKey={'orderID'}
        columns={newColumns}
        apishowurl={apiShowUrl}
        incID={incID}
        clientHeight={clientHeight}
        columnvalue={columnvalue}
        tableKey={tableKey}
        searchText={searchDiv()}
        searchVal={searchVal}
        rowkey={rowKey}
        addTitle={addTitle}
        addButton={addButton}
        addClick={addClick}
        rowSelection={rowSelection}
        uploadButton={uploadButton}
        uploadClick={uploadClick}
        downloadButton={downloadButton}
        downloadClick={downloadClick}
        filterChange={filterChange}
        onExpandUrl={onExpandUrl}
        expandAble={expandAble}
        expandData={expandData}
      />
      {/* 添加编辑抽屉 */}
      <DrawerForm
        className="applyForm"
        formRef={drawRef}
        width="520px"
        title={language('project.assmngt.applyrcd.title')}
        visible={drawStatus}
        onVisibleChange={setDrawStatus}
        drawerProps={{
          placement: 'right',
          destroyOnClose: true,
          closable: false,
          maskClosable: false,
          extra: (
            <CloseOutlined
              className="closeIcon"
              onClick={() => {
                showDraw('close')
              }}
            />
          ),
          bodyStyle: {
            paddingLeft: 5,
            paddingRight: 5,
          },
        }}
        submitter={{
          render: (props, defaultDoms) => {
            return [
              <Button
                type="default"
                key="rest"
                onClick={() => {
                  showDraw('close')
                }}
              >
                {language('project.assmngt.assinput.cancel')}
              </Button>,
              <Button
                type="primary"
                key="save"
                onClick={() => {
                  props.submit()
                  setAction('save')
                }}
              >
                {language('project.save')}
              </Button>,
              // <Button
              //   type="primary"
              //   key="submit"
              //   onClick={() => {
              //     props.submit('submit')
              //     setAction('submit')
              //   }}
              // >
              //   {language('project.submit')}
              // </Button>,
            ]
          },
        }}
        onFinish={async (values) => {
          setEnter(action, values)
        }}
      >
        <ProFormText name="id" hidden></ProFormText>
        <ProFormText name="zoneID" hidden></ProFormText>
        <ProFormText name="orgID" hidden></ProFormText>
        <ProFormGroup>
          <ProFormSelect
            label={language('project.assmngt.resapply.zone')}
            name="zone"
            width="200px"
            rules={[
              { required: true, message: regSeletcList.select.alertText },
            ]}
          >
            <TreeSelect
              name="zone"
              style={{ width: 200 }}
              treeDataSimpleMode
              value={treeValue}
              dropdownStyle={{
                maxHeight: 400,
                overflow: 'auto',
              }}
              placeholder={language('project.select')}
              onChange={onChangeSelect}
              loadData={onLoadData}
              treeData={treeData}
            />
          </ProFormSelect>
          <ProFormSelect
            label={language('project.assmngt.resapply.organization')}
            name="org"
            width="200px"
            rules={[
              { required: true, message: regSeletcList.select.alertText },
            ]}
          >
            <TreeSelect
              name="org"
              style={{ width: 200 }}
              treeDataSimpleMode
              value={orgValue}
              dropdownStyle={{
                maxHeight: 400,
                overflow: 'auto',
              }}
              placeholder={language('project.select')}
              onChange={onOrgSelect}
              loadData={onOrgData}
              treeData={orgData}
            />
          </ProFormSelect>
        </ProFormGroup>
        <ProFormGroup>
          <NameText
            label={language('project.assmngt.resapply.applicant')}
            name="user"
            width="200px"
            required={true}
          />
          <ProFormText
            label={language('project.assmngt.assinput.phone')}
            width="200px"
            name="phone"
            rules={[
              {
                pattern: regList.phoneorlandline.regex,
                message: regList.phoneorlandline.alertText,
              },
              {
                required: true,
                message: language('project.mandatory')
              }
            ]}
          />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormSelect
            options={assettypeList}
            label={language('project.assmngt.assettype')}
            name="assetType"
            width="200px"
            rules={[{ required: true, message: language('project.select') }]}
          />
          <ContentText
            label={language('project.assmngt.assetmodel')}
            name="assetModel"
            width="200px"
            required={true}
          />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormText
            label={language('project.assmngt.macaddr')}
            name="macaddr"
            width="200px"
            rules={[
              {
                required: true,
                pattern: regMacList.mac.regex,
                message: regMacList.mac.alertText,
              },
            ]}
          />
          <ContentText
            label={language('project.assmngt.location')}
            name="location"
            width="200px"
            required={true}
          />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormSelect
            options={purposeList}
            width="200px"
            name="buisUsg"
            onChange={(e) => {
              let type = 'public'
              if (e) {
                type = 'private'
              }
              getDynamicField('form', type, e)
            }}
            label={language('project.assmngt.assinput.businesspurpose')}
            rules={[{ required: true, message: language('project.fillin') }]}
          />
          {privateField.length - 1 == -1 ? (
            ''
          ) : (
            <div className="dynamicbox">
              <ProFormGroup
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}
              >
                {privateField[0].form == 'box' ? (
                  <ProFormText
                    width="200px"
                    label={privateField[0].name}
                    name={privateField[0].key}
                    rules={DynFieldReg(
                      privateField[0].type,
                      privateField[0].required
                    )}
                    valueType="text"
                  />
                ) : (
                  <ProFormSelect
                    width="200px"
                    options={getOptions(privateField[0])}
                    name={privateField[0].key}
                    label={privateField[0].name}
                    rules={DynFieldReg(
                      privateField[0].type,
                      privateField[0].required
                    )}
                  />
                )}
              </ProFormGroup>
            </div>
          )}
        </ProFormGroup>
        {privateField.length - 1 == -1
          ? ''
          : privateField.map((item, index) => {
            //判断输入形式是下拉框还是列表框
            let info = []
            if (item.form == 'list') {
              let contents = item.content.split(',')
              if (contents.length > 0) {
                contents.map((val) => {
                  let confres = []
                  confres.label = val
                  confres.value = val
                  info.push(confres)
                })
              }
            }
            if (index != 0) {
              if ((index + 1) % 2 == 0) {
                if (privateField.length - 1 < index + 1) {
                  return (
                    <div className="dynamicbox">
                      <ProFormGroup
                        style={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                        }}
                      >
                        {item.form == 'box' ? (
                          <ProFormText
                            width="200px"
                            label={item.name}
                            name={item.key}
                            rules={DynFieldReg(item.type, item.required)}
                            valueType="text"
                          />
                        ) : (
                          <ProFormSelect
                            width="200px"
                            options={info}
                            name={item.key}
                            label={item.name}
                            rules={DynFieldReg(item.type, item.required)}
                          />
                        )}
                      </ProFormGroup>
                    </div>
                  )
                } else {
                  let privateFieldLen = privateField.length - 1
                  let infoList = []
                  if (privateFieldLen >= index + 1) {
                    if (privateField[index + 1].form == 'list') {
                      let contents =
                        privateField[index + 1].content.split(',')
                      if (contents.length > 0) {
                        contents.map((val) => {
                          let confres = []
                          confres.label = val
                          confres.value = val
                          infoList.push(confres)
                        })
                      }
                    }
                  }
                  return (
                    <ProFormGroup
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-around',
                        alignItems: 'center',
                      }}
                    >
                      {item.form == 'box' ? (
                        <ProFormText
                          width="200px"
                          label={item.name}
                          name={item.key}
                          rules={DynFieldReg(item.type, item.required)}
                          valueType="text"
                        />
                      ) : (
                        <ProFormSelect
                          width="200px"
                          options={info}
                          name={item.key}
                          label={item.name}
                          rules={DynFieldReg(item.type, item.required)}
                        />
                      )}
                      {privateFieldLen < 1 ? (
                        ' '
                      ) : privateField[index + 1].form == 'box' ? (
                        <ProFormText
                          width="200px"
                          label={privateField[index + 1].name}
                          name={privateField[index + 1].key}
                          rules={DynFieldReg(
                            privateField[index + 1].type,
                            privateField[index + 1].required
                          )}
                          valueType="text"
                        />
                      ) : (
                        <ProFormSelect
                          width="200px"
                          options={infoList}
                          name={privateField[index + 1].key}
                          label={privateField[index + 1].name}
                          rules={DynFieldReg(
                            privateField[index + 1].type,
                            privateField[index + 1].required
                          )}
                        />
                      )}
                    </ProFormGroup>
                  )
                }
              }
            }
          })}
        <NotesText style={{ marginLeft: 5 }}  name="notes" label={language('project.remark')} required={false} /> 
      </DrawerForm>
      {/* 导入抽屉 */}
      <DrawerForm
        {...modalFormLayout}
        formRef={upDrawRef}
        className="afilemodal"
        title={language('project.import')}
        width="570px"
        visible={upDrawStatus}
        onVisibleChange={setUpDrawStatus}
        drawerProps={{
          placement: 'right',
          destroyOnClose: true,
          closable: false,
          maskClosable: false,
          extra: (
            <CloseOutlined
              className="closeIcon"
              onClick={() => {
                closeUpDraw(2)
              }}
            />
          ),
        }}
        submitter={{
          render: (props, doms) => {
            return [
              doms[0],
              <Button
                type="primary"
                key="subment"
                loading={importLoading}
                onClick={() => {
                  // upDrawRef.current.submit()
                  props.submit()
                }}
              >
                {language('project.import')}
              </Button>,
            ]
          },
        }}
        onFinish={async (values) => {
          setImportLoading(true)
          importTitle(values)
        }}
      >
        <div className="dynamicbox" style={{ marginLeft: '10px' }}>
          <Alert
            className="filealert"
            message={language(
              'project.assmngt.assinput.uploadfilebuisusgprivatefield'
            )}
            type="info"
            showIcon
          />
          <div style={{ marginLeft: '4px' }}>
            <ProFormGroup
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <ProFormSelect
                key="upbuisUsg"
                name='spurpose'
                options={purposeList}
                width="200px"
                onChange={(e) => {
                  let type = 'public'
                  if (e) {
                    type = 'private'
                  }
                  setImportBui(e)
                  console.log(editForm)
                  getDynamicField('formtable', type, e)
                }}
                label={language('project.assmngt.assinput.businesspurpose')}
                rules={[
                  {
                    required: true,
                    message: language('project.messageselect'),
                  },
                ]}
              />
            </ProFormGroup>
          </div>
          <ProFormGroup
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <ProFormText
              tooltip={language('project.cfgmngt.syszone.fileformatcsv')}
              label={language('project.cfgmngt.syszone.import')}
            >
              <div className="importupDiv">
                <WebUploadr
                  isAuto={true}
                  upurl={'/cfg.php?controller=confAssetManage&action=importApply'}
                  upbutext={language('project.cfgmngt.syszone.importfile')}
                  maxSize={100000000000000}
                  accept='.csv'
                  onSuccess={onFileSuccess}
                  parameter={paramentUpload}
                  isUpsuccess={true}
                  isShowUploadList={true}
                  maxCount={1}
                />
              </div>
            </ProFormText>
          </ProFormGroup>
          {impErrorShow ? (
            <Alert
              className="filealert"
              message={impErrorMsg}
              type="error"
              onClose={() => {
                setImpErrorShow(false)
              }}
              showIcon
              closable
            />
          ) : (
            ''
          )}
        </div>
        <Divider orientation="left">{language('project.datamapping')}</Divider>
        <div className="addrplanborderbox">
          <ProFormGroup style={{ width: '100%' }}>
            <div style={{ width: '200px', marginBottom: '12px' }}>
              {language('project.importfilefields')}
            </div>
            <div style={{ width: '200px', marginBottom: '12px' }}>
              {language('project.mappingfields')}
            </div>
          </ProFormGroup>
          {columnsNew.map((item) => {
            if (item.importStatus) {
              if (
                item.title ==
                language('project.assmngt.assinput.businesspurpose')
              ) {
                if (importFieldsList.length >= 1 && importFieldsArr.length >= 1) {
                  return (
                    <ProFormGroup style={{ width: '100%' }}>
                      <ProFormText width="200px" value={importBui} disabled />
                      <ProFormText width="200px" value={item.title} disabled />
                      <ProFormSelect
                        hidden={true}
                        width="200px"
                        options={importFieldsArr}
                        name={item.dataIndex}
                        initialValue={
                          importFieldsList.indexOf(item.title) == -1
                            ? ''
                            : importFieldsList.indexOf(item.title) +
                            '&&' +
                            item.title
                        }
                        fieldProps={{
                          allowClear: false,
                        }}
                      />
                    </ProFormGroup>
                  )
                } else {
									return (
										<ProFormGroup style={{ width: "100%" }}>
											<ProFormText
												width="200px"
                        value={importBui}
												disabled
											/>
											<ProFormText
												width="200px"
												value={item.title}
												disabled
											/>
										</ProFormGroup>
									)
								}
              } else {
                if (
                  importFieldsList.length >= 1 &&
                  importFieldsArr.length >= 1
                ) {
                  return (
                    <ProFormGroup style={{ width: '100%' }}>
                      <ProFormSelect
                        width="200px"
                        options={importFieldsArr}
                        name={item.dataIndex}
                        initialValue={
                          importFieldsList.indexOf(item.title) == -1
                            ? ''
                            : importFieldsList.indexOf(item.title) +
                            '&&' +
                            item.title
                        }
                        fieldProps={{
                          allowClear: false,
                        }}
                      />
                      <ProFormText width="200px" value={item.title} disabled />
                    </ProFormGroup>
                  )
                } else {
                  return (
                    <ProFormGroup style={{ width: '100%' }}>
                      <ProFormSelect
                        width="200px"
                        fieldProps={{
                          allowClear: false,
                        }}
                      />
                      <ProFormText width="200px" value={item.title} disabled />
                    </ProFormGroup>
                  )
                }
              }
            }
          })}
        </div>
      </DrawerForm>
      {/* 导入表格 */}
      <DrawerForm
        className="uploadForm"
        title={
          <div className="uploadTitle">
            {language('project.assmngt.applyrcd.title')}
          </div>
        }
        width="65%"
        formRef={upTableRef}
        visible={upTableSta}
        onVisibleChange={setUpTableSta}
        drawerProps={{
          placement: 'right',
          destroyOnClose: true,
          closable: false,
          maskClosable: false,
          extra: (
            <CloseOutlined
              className="closeIcon"
              onClick={() => {
                showUpTable('close')
              }}
            />
          ),
        }}
        submitter={{
          render: (props, defaultDoms) => {
            return [
              <Button
                type="default"
                key="rest"
                onClick={() => {
                  showUpTable('close')
                }}
              >
                {language('project.assmngt.assinput.cancel')}
              </Button>,
              <Button
                type="primary"
                key="submit"
                onClick={() => {
                  props.submit()
                  handleEnter('save', upTableData, 'upTable')
                }}
              >
                {language('project.save')}
              </Button>,
              <Button
                type="primary"
                key="submit"
                onClick={() => {
                  props.submit()
                  handleEnter('submit', upTableData, 'upTable')
                }}
              >
                {language('project.submit')}
              </Button>,
            ]
          },
        }}
        onFinish={async (values) => { }}
      >
        <ProTable
          columns={columnsNew}
          scroll={{ y: clientHeight - 36 }}
          dataSource={upTableData}
          loading={batchLoading}
          search={false}
          options={true}
          headerTitle={upSearchDiv()}
          rowSelection={false}
          rowKey="id"
          rowClassName={(record) => {
            return record.repeat == 1
              ? 'highLight'
              : '' && record.invalid == 'Y'
                ? 'invalidVal'
                : ''
          }}
          pagination={false}
        />
      </DrawerForm>
      {/* 查看 */}
      <DrawerForm
        title={language('project.assmngt.resapply.approveview')}
        className="watchModal"
        width="600px"
        layout="horizontal"
        visible={watchStatus}
        onVisibleChange={setWatchStatus}
        formRef={watchFormRef}
        submitter={false}
        drawerProps={{
          placement: 'right',
          destroyOnClose: true,
          closable: false,
          maskClosable: false,
          extra: (
            <CloseOutlined
              className="closeIcon"
              onClick={() => {
                showWatchMod('close')
              }}
            />
          ),
          bodyStyle: {
            padding: 24,
          },
        }}
      >
        <Divider orientation="left">
          {language('project.assmngt.applicationinformation')}
        </Divider>
        {isBatch == 'Y' ? (
          <>
            <ProTable
              size="small"
              columns={batchColumns}
              scroll={{ y: clientHeight - 36 }}
              dataSource={batchApplyInfo}
              loading={batchLoading}
              search={false}
              options={false}
              rowSelection={false}
              rowKey="id"
              pagination={false}
            />
            <ProFormItem
              labelCol={{ xs: { span: 5 } }}
              label={language('project.assmngt.resapply.signaturefile')}
            >
              <div
                className="fileDiv"
                onClick={() => {
                  if (batchFile) {
                    uploadSignature(recordFind, 'seeFile')
                  }
                }}
              >
                {batchFile}
              </div>
            </ProFormItem>
          </>
        ) : (
          <div className="watchInfoDiv">
            <ProDescriptions column={2}>
              <ProDescriptions.Item
                label={language('project.assmngt.resapply.applicant')}
              >
                <Tooltip title={applyInfo?.user}>{applyInfo?.user}</Tooltip>
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={language('project.assmngt.assinput.phone')}
              >
                <Tooltip title={applyInfo?.phone}>{applyInfo?.phone}</Tooltip>
              </ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item
                label={language('project.assmngt.assinput.zone')}
              >
                <Tooltip title={applyInfo?.zone}>{applyInfo?.zone}</Tooltip>
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={language('project.assmngt.addrallc.organization')}
              >
                <Tooltip title={applyInfo?.org}>{applyInfo?.org}</Tooltip>
              </ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item
                label={language('project.assmngt.assettype')}
              >
                <Tooltip title={applyInfo?.assetType}>
                  {applyInfo?.assetType}
                </Tooltip>
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={language('project.assmngt.assetmodel')}
              >
                <Tooltip title={applyInfo?.assetModel}>
                  {applyInfo?.assetModel}
                </Tooltip>
              </ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item label={language('project.assmngt.macaddr')}>
                <Tooltip title={applyInfo?.macaddr}>
                  {applyInfo?.macaddr}
                </Tooltip>
              </ProDescriptions.Item>
              <ProDescriptions.Item
                label={language('project.assmngt.location')}
              >
                <Tooltip title={applyInfo?.location}>
                  {applyInfo?.location}
                </Tooltip>
              </ProDescriptions.Item>
            </ProDescriptions>
            {privateField.length - 1 == -1
              ? ''
              : privateField.map((item, index) => {
                if (index % 2 == 0) {
                  if (privateField.length - 1 < index + 1) {
                    return (
                      <ProDescriptions column={2}>
                        <ProDescriptions.Item label={item.name}>
                          <Tooltip
                            title={
                              applyInfo[item.key] ? applyInfo[item.key] : ' '
                            }
                          >
                            {applyInfo[item.key] ? applyInfo[item.key] : ' '}
                          </Tooltip>
                        </ProDescriptions.Item>
                      </ProDescriptions>
                    )
                  } else {
                    let privateFieldLen = privateField.length - 1
                    return (
                      <ProDescriptions column={2}>
                        <ProDescriptions.Item label={item.name}>
                          <Tooltip
                            title={
                              applyInfo[item.key] ? applyInfo[item.key] : ' '
                            }
                          >
                            {applyInfo[item.key] ? applyInfo[item.key] : ' '}
                          </Tooltip>
                        </ProDescriptions.Item>
                        {privateFieldLen < 1 ? (
                          ' '
                        ) : (
                          <ProDescriptions.Item
                            label={privateField[index + 1].name}
                          >
                            <Tooltip
                              title={
                                applyInfo[privateField[index + 1].key]
                                  ? applyInfo[privateField[index + 1].key]
                                  : ' '
                              }
                            >
                              {applyInfo[privateField[index + 1].key]
                                ? applyInfo[privateField[index + 1].key]
                                : ' '}
                            </Tooltip>
                          </ProDescriptions.Item>
                        )}
                      </ProDescriptions>
                    )
                  }
                }
              })}
            <ProDescriptions column={2}>
              <ProDescriptions.Item
                label={language('project.assmngt.resapply.signaturefile')}
              >
                <div
                  className="fileDiv"
                  onClick={() => {
                    if (applyInfo.signature) {
                      uploadSignature(recordFind, 'seeFile')
                    }
                  }}
                >
                  {applyInfo?.signature?.split(';')[0]}
                </div>
              </ProDescriptions.Item>
            </ProDescriptions>
          </div>
        )}
        <Divider orientation="left">
          {language('project.assmngt.approvalprocess')}
        </Divider>
        <div className="stepsDiv">
          <Steps direction="vertical" current={1} size="small">
            {showStep()}
          </Steps>
        </div>
      </DrawerForm>
      {/* //查看上传签章文件 */}
      <DrawerForm
        width="570px"
        layout="horizontal"
        className="seemodalfrom"
        formRef={zFileFormRef}
        title={language('project.resmngt.uploadsignaturefile')}
        visible={fileModalStatus}
        autoFocusFirstInput
        drawerProps={{
          onCancel: () => {
            closeFileModal(2)
          },
          placement: 'right',
          destroyOnClose: true,
          closable: false,
          maskClosable: false,
          extra: (
            <CloseOutlined
              className="closeIcon"
              onClick={() => {
                closeFileModal(2)
              }}
            />
          ),
          bodyStyle: {
            paddingTop: 0,
            paddingBottom: 24,
            paddingLeft: 24,
            paddingRight: 24,
          },
        }}
        submitter={{
          render: (props, doms, info) => {
            return [
              doms[0],
              <Button
                key="buttonsave"
                type="primary"
                htmlType="submit"
                onClick={() => {
                  setSubmitType('save')
                  closeFileModal(2)
                  // zFileFormRef.current.submit()
                }}
              >
                <span className="buttonmargint">
                  {language('project.save')}
                </span>
              </Button>,
              <Button
                key="buttonsubmit"
                type="primary"
                onClick={() => {
                  setSubmitType('submit')
                  zFileFormRef.current.submit()
                }}
              >
                <span className="buttonmargint">
                  {language('project.submit')}
                </span>
              </Button>,
            ]
          },
        }}
        onVisibleChange={setFileModalStatus}
        submitTimeout={1000}
        onFinish={async (values) => {
          setEnter(submitType, recordFind, 'zfile')
        }}
      >
        <Divider orientation="left">
          {language('project.assmngt.applicationinformation')}
        </Divider>
        <>
          <div className="singleWatchDiv">
            <ProDescriptions column={2}>
              <ProDescriptions.Item
                name="applicant"
                label={language('project.assmngt.resapply.user')}
              >
                <Tooltip title={initialValue?.user ? initialValue?.user : ''}>
                  {initialValue?.user ? initialValue?.user : ''}
                </Tooltip>
              </ProDescriptions.Item>
              <ProDescriptions.Item
                name="phone"
                label={language('project.assmngt.resapply.contactnumber')}
              >
                <Tooltip
                  title={initialValue?.phone ? initialValue?.phone : ' '}
                >
                  {initialValue?.phone ? initialValue?.phone : ' '}
                </Tooltip>
              </ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item
                name="zone"
                label={language('project.assmngt.resapply.zone')}
              >
                <Tooltip title={initialValue?.zone ? initialValue?.zone : ''}>
                  {initialValue?.zone ? initialValue?.zone : ''}
                </Tooltip>
              </ProDescriptions.Item>
              <ProDescriptions.Item
                name="org"
                label={language('project.assmngt.resapply.organization')}
              >
                <Tooltip title={initialValue?.org ? initialValue?.org : ' '}>
                  {initialValue?.org ? initialValue?.org : ' '}
                </Tooltip>
              </ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item
                name="assetType"
                label={language('project.assmngt.assettype')}
              >
                <Tooltip
                  title={initialValue?.assetType ? initialValue?.assetType : ''}
                >
                  {initialValue?.assetType ? initialValue?.assetType : ''}
                </Tooltip>
              </ProDescriptions.Item>
              <ProDescriptions.Item
                name="assetModel"
                label={language('project.assmngt.assetmodel')}
              >
                <Tooltip
                  title={
                    initialValue?.assetModel ? initialValue?.assetModel : ' '
                  }
                >
                  {initialValue?.assetModel ? initialValue?.assetModel : ' '}
                </Tooltip>
              </ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item
                name="macaddr"
                label={language('project.assmngt.resapply.macaddress')}
              >
                <Tooltip
                  title={initialValue?.macaddr ? initialValue?.macaddr : ''}
                >
                  {initialValue?.macaddr ? initialValue?.macaddr : ''}
                </Tooltip>
              </ProDescriptions.Item>
              <ProDescriptions.Item
                name="purpose"
                label={language('project.assmngt.resapply.businesspurpose')}
              >
                <Tooltip
                  title={initialValue?.buisUsg ? initialValue?.buisUsg : ''}
                >
                  {initialValue?.buisUsg ? initialValue?.buisUsg : ''}
                </Tooltip>
              </ProDescriptions.Item>
            </ProDescriptions>
            <ProDescriptions column={2}>
              <ProDescriptions.Item
                name="location"
                label={language('project.assmngt.location')}
              >
                <Tooltip
                  title={initialValue?.location ? initialValue?.location : ''}
                >
                  {initialValue?.location ? initialValue?.location : ''}
                </Tooltip>
              </ProDescriptions.Item>
              {privateField.length - 1 == -1 ? (
                ''
              ) : (
                <ProDescriptions.Item
                  name="purpose"
                  label={privateField[0].name}
                >
                  <Tooltip
                    title={
                      initialValue[privateField[0].key]
                        ? initialValue[privateField[0].key]
                        : ''
                    }
                  >
                    {initialValue[privateField[0].key]
                      ? initialValue[privateField[0].key]
                      : ''}
                  </Tooltip>
                </ProDescriptions.Item>
              )}
            </ProDescriptions>
            {privateField.length - 1 == -1
              ? ''
              : privateField.map((item, index) => {
                if (index != 0) {
                  if (index % 2 == 1) {
                    if (privateField.length - 1 < index + 1) {
                      return (
                        <ProDescriptions column={2}>
                          <ProDescriptions.Item label={item.name}>
                            <Tooltip
                              title={
                                initialValue[item.key]
                                  ? initialValue[item.key]
                                  : ' '
                              }
                            >
                              {initialValue[item.key]
                                ? initialValue[item.key]
                                : ' '}
                            </Tooltip>
                          </ProDescriptions.Item>
                        </ProDescriptions>
                      )
                    } else {
                      let privateFieldLen = privateField.length - 1
                      return (
                        <ProDescriptions column={2}>
                          <ProDescriptions.Item label={item.name}>
                            <Tooltip
                              title={
                                initialValue[item.key]
                                  ? initialValue[item.key]
                                  : ' '
                              }
                            >
                              {initialValue[item.key]
                                ? initialValue[item.key]
                                : ' '}
                            </Tooltip>
                          </ProDescriptions.Item>
                          {privateFieldLen < 1 ? (
                            ' '
                          ) : (
                            <ProDescriptions.Item
                              label={privateField[index + 1].name}
                            >
                              <Tooltip
                                title={
                                  initialValue[privateField[index + 1].key]
                                    ? initialValue[
                                    privateField[index + 1].key
                                    ]
                                    : ' '
                                }
                              >
                                {initialValue[privateField[index + 1].key]
                                  ? initialValue[privateField[index + 1].key]
                                  : ' '}
                              </Tooltip>
                            </ProDescriptions.Item>
                          )}
                        </ProDescriptions>
                      )
                    }
                  }
                }
              })}
          </div>
        </>
        <Divider orientation="left">
          {language('project.resmngt.previewfile')}
        </Divider>
        <div className="assignmentinformation pdfbox">
          <div className="seepdfbox">
            {pdfUrl ? (
              <PDFViewer url={pdfUrl} />
            ) : (
              <div>
                <img src={PdfSeize} />
              </div>
            )}
          </div>
        </div>
        <div className="qzfileDiv">
          <ProFormText
            label={language('sysmain.update.qzfile')}
            name="upload"
            addonAfter={<div>{fileName ? fileName : ''}</div>}
          >
            <div className="acaluploadbox">
              <WebUploadr
                parameter={parameter}
                isUpsuccess={isUpsuccess}
                isAuto={isAuto}
                upbutext={upbutext}
                maxSize={maxSize}
                accept={accept}
                upurl={upurl}
                onSuccess={onSuccess}
                isShowUploadList={isShowUploadList}
                maxCount={maxCount}
              />
            </div>
          </ProFormText>
          <div className="alertbox">
            <Alert
              className="caddressalertinfo"
              message={language(
                'project.resmngt.assapply.scanthesigneddocumentspdffilesanduploadthem'
              )}
              type="info"
              showIcon
            />
          </div>
        </div>
      </DrawerForm>
      {/* 查看批量签章模板 */}
      <DrawerForm
        width="570px"
        layout="horizontal"
        className="seemodalfrom"
        formRef={zFileFormRef}
        title={language('project.resmngt.uploadsignaturefile')}
        visible={batchFileSta}
        autoFocusFirstInput
        drawerProps={{
          maskClosable: false,
          placement: 'right',
          destroyOnClose: true,
          closable: false,
          extra: (
            <CloseOutlined
              className="closeIcon"
              onClick={() => {
                showBatchFileModal(2)
              }}
            />
          ),
          bodyStyle: {
            paddingTop: 0,
            paddingBottom: 24,
            paddingLeft: 24,
            paddingRight: 24,
          },
        }}
        submitter={{
          render: (props, doms, info) => {
            return [
              doms[0],
              <Button
                key="buttonsave"
                type="primary"
                htmlType="submit"
                onClick={() => {
                  setSubmitType('save')
                  showBatchFileModal(2)
                  // zFileFormRef.current.submit()
                }}
              >
                <span className="buttonmargint">
                  {language('project.save')}
                </span>
              </Button>,
              <Button
                key="buttonsubmit"
                type="primary"
                onClick={() => {
                  setSubmitType('submit')
                  zFileFormRef.current.submit()
                }}
              >
                <span className="buttonmargint">
                  {language('project.submit')}
                </span>
              </Button>,
            ]
          },
        }}
        onVisibleChange={setBatchFileSta}
        submitTimeout={1000}
        onFinish={async (values) => {
          handleEnter(submitType, batchInitVAl, 'batchFile')
        }}
      >
        <Divider orientation="left">
          {language('project.assmngt.applicationinformation')}
        </Divider>
        <ProTable
          size="small"
          columns={batchColumns}
          scroll={{ y: clientHeight - 36 }}
          dataSource={batchInitVAl}
          search={false}
          options={false}
          rowSelection={false}
          loading={batchLoading}
          rowKey="index"
          pagination={false}
        />
        <Divider orientation="left">
          {language('project.resmngt.previewfile')}
        </Divider>
        <div className="assignmentinformation pdfbox">
          <div className="seepdfbox">
            {pdfUrl ? (
              <PDFViewer url={pdfUrl} />
            ) : (
              <div>
                <img src={PdfSeize} />
              </div>
            )}
          </div>
        </div>
        <div className="qzfileDiv">
          <ProFormText
            label={language('sysmain.update.qzfile')}
            name="upload"
            addonAfter={<div>{fileName ? fileName : ''}</div>}
          >
            <div className="acaluploadbox">
              <WebUploadr
                parameter={parameter}
                isUpsuccess={isUpsuccess}
                isAuto={isAuto}
                upbutext={upbutext}
                maxSize={maxSize}
                accept={accept}
                upurl={upurl}
                onSuccess={onSuccess}
                isShowUploadList={isShowUploadList}
                maxCount={maxCount}
              />
            </div>
          </ProFormText>
          <div className="alertbox">
            <Alert
              className="caddressalertinfo"
              message={language(
                'project.resmngt.assapply.scanthesigneddocumentspdffilesanduploadthem'
              )}
              type="info"
              showIcon
            />
          </div>
        </div>
      </DrawerForm>
      {/* //生成签章文件 */}
      <DrawerForm width='auto'
        layout="horizontal"
        className="sarmodalfrom"
        title={language('project.resmngt.generatesignaturefile')}
        visible={saModalStatus}
        autoFocusFirstInput
        drawerProps={{
          className: 'watchFileModal',
          placement: 'right',
          destroyOnClose: true,
          closable: false,
          maskClosable: false,
          extra: (
            <CloseOutlined
              className="closeIcon"
              onClick={() => {
                closeSaModal()
              }}
            />
          ),
          bodyStyle: {
            padding: 24,
          },
        }}
        submitter={{
          render: (props, doms, info) => {
            return [
              doms[0],
              <Button
                key="buttonsave"
                type="primary"
                htmlType="submit"
                onClick={() => {
                  ExportPDF(signTitle, pdfFormRef.current, false, isBatch == 'Y' ? 'l' : 'p');
                  closeSaModal(2)
                }}
              >
                <span className="buttonmargint">
                  {language('project.export')}
                </span>
              </Button>,
              <Button
                key="buttonsubmit"
                type="primary"
                onClick={() => {
                  ExportPDF(signTitle, pdfFormRef.current, true, isBatch == 'Y' ? 'l' : 'p');
                  closeSaModal(2)
                }}
              >
                <span className="buttonmargint">
                  {language('project.print')}
                </span>
              </Button>,
            ]
          },
        }}
        onVisibleChange={setSaModalStatus}
        submitTimeout={2000}
      >
        <div ref={pdfFormRef}>
          <div style={{ padding: '24px' }}>
            {isBatch == 'Y' ? (
              <BatchTemplate
                dataSource={topData}
                bottomData={bottomData}
                editable={false}
                title={signTitle}
                signName={signName}
                dateTime={signDataTime}
                batchData={batchData}
              />
            ) : (
              <SignTable
                dataSource={topData}
                bottomData={bottomData}
                editable={false}
                title={signTitle}
                signName={signName}
                dateTime={signDataTime}
              />
            )}
          </div>
        </div>
      </DrawerForm>
    </>
  )
}

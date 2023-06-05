import React, { useRef,useState ,useEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { ProTable, ModalForm, ProFormText, ProFormRadio } from '@ant-design/pro-components';
import { Button, Input ,message, Popconfirm, Tree, Steps, Transfer } from 'antd';
import { post,get } from '@/services/https';
import { defaultModalFormLayout } from "@/utils/helper";
import store, { set } from 'store';
import { language } from '@/utils/language';
import styles from './index.less'
import { fetchAuth } from '@/utils/common';
import { useSelector } from 'umi'
import { regList } from '../../../../utils/regExp';
const { Search } = Input
const { Step } = Steps;
const authContent = [
    {
        label: language('project.sysconf.sysmenu.wholejurisdiction'),
        value: 'all',
        disabled:true
    },
    {
        label: language('project.sysconf.sysmenu.appointjurisdiction'),
        value: 'specify',
    }
]
export default () => {
    const contentHeight = useSelector(({ app }) => app.contentHeight)
    const clientHeight = contentHeight - 210
    const writable = fetchAuth()
    //删除气泡框
    const [confirmLoading, setConfirmLoading] = useState(false);
    const defaultContent = [
        {
            label: language('project.sysconf.sysmenu.wholejurisdiction'),
            value: 'all',
            disabled:true
        },
        {
            label: language('project.sysconf.sysmenu.appointjurisdiction'),
            value: 'specify',
        }
    ]
    const renderRemove = (text,record) => (
        <Popconfirm onConfirm={() => {
               //删除方法
               delList(record)
            }} key="popconfirm" 
            title={language('project.delconfirm')}   
            okButtonProps={{
            loading: confirmLoading,
            }} okText={language('project.yes')}  cancelText={language('project.no')} >
            <a>{text}</a>
        </Popconfirm>
    );
    const rolesMap ={
        zone:language('project.sysconf.sysmenu.zone'),
        maintain:language('project.sysconf.sysmenu.maintain'),
        sysadm:language('project.sysconf.sysmenu.admin'),
    }

    const columns = [
        {
            title: '',
            dataIndex: 'id',
            width: 80,
            ellipsis:true,
            hideInTable:true,
        },
        {
            title: language('project.sysconf.sysmenu.authname'),
            dataIndex: 'name',
            width: 140,
            readonly: true,
            ellipsis:true,
            
        },
        {
            title: language('project.sysconf.sysmenu.type'),
            dataIndex: 'type',
            width: 140,
            // readonly: true,
            render:(text)=> {
                return rolesMap[text]
            }
        },
        {
            title: language('project.sysconf.sysmenu.refcnt'),
            dataIndex: 'refcnt',
            width: 80,
            readonly: true,
            ellipsis:true,
            
        },
        {
            title: language('project.sysconf.sysmenu.level'),
            dataIndex: 'level',
            width: 100,
            readonly: true,
            filters: [
				{ text: language('project.sysconf.sysmenu.onelevel'), value: 1 },
				{ text: language('project.sysconf.sysmenu.twolevel'), value: 2 },
			],
            filterMultiple: false,
            render:(text)=>{
                const levelMap = {
                    1:language('project.sysconf.sysmenu.onelevel'),
                    2:language('project.sysconf.sysmenu.twolevel')
                }
                return levelMap[text]
            }
        },
        {
            title: language('project.sysconf.sysmenu.content'),
            dataIndex: 'content',
            readonly: true,
            ellipsis:true,
        },
        {
            title: language('project.sysconf.sysmenu.notes'),
            dataIndex: 'notes',
            width: 160,
            readonly: true,
            ellipsis:true,
            
        },
        {
            title: language('project.operate'),
            valueType: 'option',
            width: 120,
            fixed: 'right', 
            align: 'center',
            hideInTable:!writable,
            render: (text, record, _, action) => [
                <> 
                    <a key="editable" onClick={() => {
                            setTargetKeys([])
                            mod(record);
                        }}>
                            {language('project.deit')}
                    </a>
                    {renderRemove(language('project.del'),record)}
                </>
            ],
        },
    ];
    const dateFormat = 'YYYY/MM/DD';
    const formRef = useRef();
    const [modalStatus,setModalStatus] = useState(false) ;//model 添加弹框状态
    const [selectedRowKeys,setSelectedRowKeys] = useState([]) ;//选中id数组
    const [op,setop] = useState('add') ;//选中id数组
    const [dataSource, setDataSource] = useState([]);
    const [dataList, setDataList] = useState([]) ;//选中id数组
    const [menuList, setMenyList] = useState([]) ;//选中id数组
    const [menuSelected, setMenuSelected] = useState([]) ;//默认所有menu key
    const [jurisdictionType, setJurisdictionType] = useState('specify');//权限选择  ，默认全部权限
    const [queryVal, setQueryVal] = useState('');//搜索值
    const [totalPage, setTotalPage] = useState(0);//总条数
    const [nowPage, setNowPage] = useState(1);//当前页码
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(true);//加载
    const startVal = 1;
    const [record, setRecord] = useState({});
    const [role, setRole] = useState('zone'); //管理员类型
    const [authority, setAuthority] = useState(authContent); //权限内容
    const initLtVal = store.get('pageSize') ? store.get('pageSize') : 20;
    const [limitVal, setLimitVal] = useState(initLtVal);// 每页条目
    const [columnsHide,setColumnsHide] = useState(store.get('sysmenucolumnvalue') ? store.get('sysmenucolumnvalue') :{
        id:{show:false},
    });//设置默认列
   
    useEffect(()=>{
        getList();
    },[queryVal])

    //菜单列表
    const getMenuList = (id = 0,level = 1,admin)=>{
        let data = {};
        data.id = id;
        data.level = level;
        data.type = admin || 'zone';
        let menuSelected = [];
        post('/cfg.php?controller=confAuthority&action=showAuthorityContent',data).then((res) => {
            let rightKeys = [];
            res.data.map((item)=>{
                menuSelected.push(item.key);
                if(item.sel == 'Y'){
                    rightKeys.push(item.key);
                }
                if(item.children&&item.children.length > 0){
                    item.children.map((val)=>{
                        menuSelected.push(val.key);
                        if(val.sel == 'Y'){
                            rightKeys.push(val.key);
                        }
                         if(val.children&&val.children.length>0){
                                val.children.map((child)=>{
                                    child.key&&menuSelected.push(child.key);
                                    if(child.sel == 'Y'){
                                        rightKeys.push(child.key);
                                    }
                                })  
                            }
                    })
                }
            })
            setMenuSelected(menuSelected);
            setMenyList(res.data);

            setTargetKeys(rightKeys);
        }).catch(() => {
            console.log('mistake')
        })
        
    }
    //start  数据起始值   limit 每页条数 
    const getList = (pagestart = '',pagelimit = '',value = '', filter = '')=>{
        setLoading(true);
        let page = pagestart != ''?pagestart:startVal;
        let  data = {};
        data.queryVal = value != ''?value:queryVal;
        data.limit = pagelimit != ''?pagelimit:limitVal;
        data.start = (page -1) * data.limit;
        data.filters = filter != ''?filter:filters;
        post('/cfg.php?controller=confAuthority&action=showAuthority',data).then((res) => {
            setLoading(false);
            setTotalPage(res.total)
            setDataList(res.data)
        }).catch(() => {
            console.log('mistake')
        })
    }

    //删除功能
    const delList = (record)=>{
        let data = {};
        data.ids = record.id;
        data.names = record.name;
        post('/cfg.php?controller=confAuthority&action=delAuthority',data).then((res) => {
            if(!res.success){
                message.error(res.msg);
                return false;
            }
            setDataSource(dataSource.filter((item) => item.id !== record.id));
            getList()
        }).catch(() => {
            console.log('mistake')
        })
    }

    //更新修改功能
    const save = (record)=>{
        const rightKeys = rightTreeList()
        console.log(rightKeys,'rightKeys');
        const keys = []
        const authkeys =[]
        const authnames = []
        rightKeys.map((item)=>{
            keys.push(item.key)
            authnames.push(item.title)
            if(item.children&&item.children.length>0){
                item.children.map((child)=>{
                    if(child.children&&child.children.length>0){
                        authnames.push(child.title)
                    }else{
                        authkeys.push(child.key)
                    }
                    keys.push(child.key)
                    authnames.push(child.title)
                })
            }
        })
        console.log(authkeys,'authkeys');
        let data = {};
        const { level,type,notes } = formRef.current.getFieldsValue(true)
        if(role==='zone'){
            data.level = level;
        }
        if(jurisdictionType==='specify'&&targetKeys.length===0){
            return message.error(language('project.sysconf.sysmenu.authtip'))
        }
        data.op = op == 'add'? op : 'mod';
        data.id = record.id;
        data.name = record.name;
        data.content = jurisdictionType == 'all' ? '' : `${keys.join(',')}#${authkeys.length>0?authkeys.join(','):''}#${authnames.join(',')}`;
        data.type = type
        data.notes = notes
        post('/cfg.php?controller=confAuthority&action=setAuthority',data).then((res) => {
            if(!res.success){
                message.error(res.msg);
                return false;
            }
            getModal(2);
            getList(startVal)
            setRole('')
            setRecord({})
            setAuthority(defaultContent)
            setJurisdictionType('specify')
        }).catch(() => {
            console.log('mistake')
        })
    }

    //搜索
    const handsearch = (values) => {
        setQueryVal(values);
    }
    //选中触发
    const onSelectedRowKeysChange = (selectedRowKeys, selectedRows) => {
        // setRecord(record)//选中行重新赋值
        setSelectedRowKeys(selectedRowKeys)
        let deletestatus = true;
        if(selectedRowKeys != false){
            deletestatus = false;
        }
        // setipDelStatus(deletestatus);//添加删除框状态
    }

    //判断是否弹出添加model
    const getModal = (status,op)=>{
        setop(op)
        if(status == 1){
            setModalStatus(true);
        }else{
            formRef.current.resetFields();
            // setJurisdictionType('all');
            setModalStatus(false);
        }
    }

    //编辑赋值
    const mod = (record)=>{
        getMenuList(record.id,record.level);
        setRecord(record);
        setRole(record.type)
        let content = 'all'
        if(record.content){
            content = 'specify';
        }else {
            const newArray = [...authContent]
            newArray[0].disabled = false
            setAuthority(newArray)
        }
        setJurisdictionType(content);
        setTimeout(function () {
            formRef.current.setFieldsValue(record)
            formRef.current.setFieldsValue({jurisdiction:content})
        }, 100)
        getModal(1,'mod');
    }

    //穿梭框开始
    const [targetKeys, setTargetKeys] = useState([]);

    const changeTransfer = (keys,value,vv) => {
        //选中到右侧的数据的key
        setTargetKeys(keys);
    };
    const isChecked = (selectedKeys, eventKey) => selectedKeys.includes(eventKey);
    const isCheckeds = (oldList, newList) =>{
        let status = true;
        if(oldList.length >= newList.length){
            status = false;
        }
        return status;        
    } 
    //右侧树形列表数据
    const rightTreeList = ()=>{
        let rightMenyList = generateTree(menuList,targetKeys);
        let rightList = []
        rightMenyList.map((item) =>{
            let list = {};
            let pChecked = false;
            let sechecked = false;
            if(item.children.length > 0 ){
                item.children.map((val)=>{
                    if(val.disabled === true){
                        pChecked = true;
                    }
                    if(val.children.length>0){
                        val.children.map((sechild)=>{
                            if(sechild.disabled === true){
                                sechecked = true;
                            }
                        })
                    }
                })
            }
            if(item.disabled === true || pChecked === true ||sechecked ===true){
                let childrenLists = [];
                if(item.children.length > 0 ){
                    item.children.map((val)=>{
                        let secheckedTow = false;
                        if(val.children.length>0){
                            val.children.map((sechild)=>{
                                if(sechild.disabled === true){
                                    secheckedTow = true;
                                }
                            })
                        }
                        let childrenList = {};
                        if(val.disabled === true || secheckedTow ===true){
                            let sechildLists = []
                            if(val.children.length >0){
                                val.children.map((child)=>{
                                    let sechildList = []
                                    if(child.disabled){
                                        sechildList.key = child.key
                                        sechildList.title = child.title
                                        sechildLists.push(sechildList)
                                    }
                                })
                                childrenList.children = sechildLists;
                            }
                            childrenList.key = val.key;
                            childrenList.title = val.title;
                            childrenLists.push(childrenList)
                        }
                    })
                    list.children = childrenLists;
                }
                list.key = item.key;
                list.title = item.title;
                rightList.push(list);
            }
            
        })
        return generateRTree(rightList);
    }

    //左侧属性列表数据
    const generateTree = (treeNodes = [], checkedKeys = []) =>
    treeNodes.map(({ children, ...props }) => ({
        ...props,
        disabled: checkedKeys.includes(props.key),
        children: generateTree(children, checkedKeys),
    }));

    //右侧侧属性列表数据
    const generateRTree = (treeNodes = [], checkedKeys = []) =>
    treeNodes.map(({ children, ...props }) => ({
        ...props,
        disabled: false,
        children: generateTree(children, checkedKeys),
    }));

    const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {
        const transferDataSource = [];

        function flatten(list = []) {
            list.forEach((item) => {
            transferDataSource.push(item);
            flatten(item.children); 
            });
        }
        const Extra = (
            <>
                <Button  type='link' onClick={()=>{
                    const newArr = targetKeys.filter((item)=>!item.includes('able'))
                    setTargetKeys(newArr)
                }}>一键只读</Button>
            </>
        )

        flatten(dataSource);
        return (
            <Transfer
            {...restProps}
            targetKeys={targetKeys}
            dataSource={transferDataSource}
            className="tree-transfer"
            render={(item) => item.title}
            showSelectAll={true}
            titles={['',Extra]}
            >
            {({ direction, filteredItems, onItemSelectAll, onItemSelect, selectedKeys: listSelectedContent}) => {
                
                if (direction === 'left') {
                const checkedKeys = [...listSelectedContent];
                return (
                    <Tree
                        blockNode
                        checkable
                        defaultExpandAll
                        checkedKeys={listSelectedContent}
                        treeData={generateTree(dataSource, targetKeys)}
                        checkStrictly={true}
                        onCheck={(keys, { node: { key } ,halfCheckedKeys}) => {
                            let data = []
                            dataSource.map((val)=>{
                                if(val.key === key){
                                    if(val.children&&val.children.length>0){
                                        val.children.map((child)=>{
                                            data.push(child.key)
                                            if(child.children&&child.children.length>0){
                                                child.children.map((childItem)=>{
                                                    data.push(childItem.key)
                                                })
                                            }
                                        })
                                    }
                                }else{
                                    if(val.children&&val.children.length>0){
                                        val.children.map((child)=>{
                                            if(child.key === key){
                                                if(child.children&&child.children.length>0){
                                                    child.children.map((childItem)=>{
                                                        data.push(childItem.key)
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                            let checkList = keys?.checked.concat(data);
                            if(!isCheckeds(checkedKeys, keys?.checked)){
                                checkList = menuSelected.filter(item=> !keys.checked.includes(item));
                                dataSource.map((val)=>{
                                    if(val.key === key){
                                        if(val.children&&val.children.length>0){
                                            val.children.map((child)=>{
                                                checkList.push(child.key)
                                                if(child.children&&child.children.length>0){
                                                    child.children.map((childItem)=>{
                                                        checkList.push(childItem.key)
                                                    })
                                                }
                                            })
                                        }
                                    }else{
                                        if(val.children&&val.children.length>0){
                                            val.children.map((child)=>{
                                                if(child.key === key){
                                                    if(child.children&&child.children.length>0){
                                                        child.children.map((childItem)=>{
                                                            checkList.push(childItem.key)
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                            onItemSelectAll(checkList, isCheckeds(checkedKeys, keys?.checked));
                        }}
                        onSelect={(_, { node: { key } }) => {
                            onItemSelect(key, !isChecked(checkedKeys, key));
                        }}
                    />
                );
                }
                else{
                    const checkedKeys = [ ...listSelectedContent];
                    return (
                    <Tree
                        blockNode
                        checkable
                        defaultExpandAll
                        checkedKeys={listSelectedContent}
                        treeData={rightTreeList()}
                        checkStrictly={true}
                        onCheck={(keys, { node: { key } ,halfCheckedKeys}) => {
                            let data = []
                            dataSource.map((val)=>{
                                if(val.key === key){
                                    if(val.children&&val.children.length>0){
                                        val.children.map((child)=>{
                                            data.push(child.key)
                                            if(child.children&&child.children.length>0){
                                                child.children.map((childItem)=>{
                                                    data.push(childItem.key)
                                                })
                                            }
                                        })
                                    }
                                }else{
                                    if(val.children&&val.children.length>0){
                                        val.children.map((child)=>{
                                            if(child.key === key){
                                                if(child.children&&child.children.length>0){
                                                    child.children.map((childItem)=>{
                                                        data.push(childItem.key)
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                                
                            })
                            let checkList = keys?.checked.concat(data);
                            if(!isCheckeds(checkedKeys, keys?.checked)){
                                checkList = menuSelected.filter(item=> !keys.checked.includes(item));
                                dataSource.map((val)=>{
                                    if(val.key === key){
                                        if(val.children&&val.children.length>0){
                                            val.children.map((child)=>{
                                                checkList.push(child.key)
                                                if(child.children&&child.children.length>0){
                                                    child.children.map((childItem)=>{
                                                        checkList.push(childItem.key)
                                                    })
                                                }
                                            })
                                        }
                                    }else{
                                        if(val.children&&val.children.length>0){
                                            val.children.map((child)=>{
                                                if(child.key === key){
                                                    if(child.children&&child.children.length>0){
                                                        child.children.map((childItem)=>{
                                                            checkList.push(childItem.key)
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                    }
                                })
                            }
                            onItemSelectAll(checkList, isCheckeds(checkedKeys, keys?.checked));
                        }}
                        onSelect={(_, { node: { key } }) => {
                            onItemSelect(key, !isChecked(checkedKeys, key));
                        }}
                    />
                )
                }
               
            }
            }
            </Transfer>
        );
    };
    
    const roles = [
        {
            label:language('project.sysconf.sysmenu.zone'),
            value:'zone',
        },
        {
            label:language('project.sysconf.sysmenu.maintain'),
            value:'maintain',
        },
        {
            label:language('project.sysconf.sysmenu.admin'),
            value:'sysadm',
        },
    ]
    return (<>
        <ProTable 
            className='authconfigtable'
            scroll={{ y: clientHeight }}
             //边框
            cardBordered={true}
            bordered={true}
            rowkey = 'id'
            loading = {loading}
            //单选框选中变化
            rowSelection={{
                selectedRowKeys,
                onChange: onSelectedRowKeysChange,
                getCheckboxProps: (record) => ({
                //   disabled: record.user_id == 1 || record.user_id == 2 || record.user_id == 4, // Column configuration not to be checked
                }),
            }} 

            //设置选中提示消失
            tableAlertRender={false} 
            columns={columns} 
            //页面数据信息
            dataSource={dataList}
                
            editable={{
                    type: 'multiple',
                }} 
            columnsState={{
                value: columnsHide,
                onChange:(value)=>{   
                    setColumnsHide(value);
                    store.set('sysmenucolumnvalue', value)
                },
            }} 
        
            rowKey="id" 
            //头部搜索框关闭
            search={false}
            form={{
                // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
                syncToUrl: (values, type) => {
                    if (type === 'get') {
                        return Object.assign(Object.assign({}, values), { created_at: [values.startTime, values.endTime] });
                    }
                    return values;
                },
            }}

            onChange={(paging, filters) => {
                setFilters(JSON.stringify(filters));
                setLimitVal(paging.pageSize);
                setNowPage(paging.current);
                getList(paging.current,paging.pageSize,'',JSON.stringify(filters));
                store.set('pageSize', paging.pageSize)
            }}

            pagination={{
                showSizeChanger:true,
                pageSize:limitVal,
                // page:startVal,
                current:nowPage,
                total:totalPage,
                showTotal: total => language('project.page',{ total: total }),
            }}
            options = {{
                reload:function(){
                    getList(1)
                }
            }}
            toolBarRender={() => [
                <Button key="button" onClick={() => {
                    getMenuList();
                    getModal(1,'add');
                }}  type="primary" icon={<PlusOutlined />}>
              {language('project.add')}
            </Button>,
      
            ]}
            dateFormatter="string" 
            headerTitle={ 
                <Search
                    placeholder={language('project.sysconf.sysmenu.searchplace')}
                    style={{ width: 200}}
                    onSearch={(queryVal)=>{
                        setNowPage(1);
                        handsearch(queryVal)
                    }}
                    allowClear={true}
                />
            } 
        />
        {/* 添加编辑弹出框 */}
        <ModalForm className={styles.authconfigform}
            {...defaultModalFormLayout}
            width='567px'
            formRef={formRef}
            title={op == 'add'? language('project.resmngt.resapply.allocationrequest'): language('project.resmngt.resapply.allocationrequest')}
            visible={modalStatus} autoFocusFirstInput
            modalProps={{
                maskClosable:false,
                destroyOnClose:true,
                onCancel: () =>{
                    getModal(2)
                    formRef.current.resetFields()
                    setRole('')
                    setRecord({})
                    setAuthority(defaultContent)
                    setJurisdictionType('specify')
                },
                wrapClassName:styles.modalform
            }} 
            onVisibleChange={setModalStatus}
            submitTimeout={2000} onFinish={async (values) => {
                save(values);
            }}>
           
            <div className='authconfigtbox'>
                <ProFormText hidden  name='id'  />
                <ProFormText
                  name='name' 
                  label={language('project.sysconf.sysmenu.authname')} 
                  width={290}
                  rules={[
                    {
                        required: true,
                        message: language('project.mandatory')
                    },
                    {
                        max: 63
                    },
                    {
                        pattern: regList.onlyChAndHan.regex,
                        message: regList.onlyChAndHan.alertText
                    }
                  ]}
                />
                <div className={styles.radioGroups}>
                    <ProFormRadio.Group
                        name="type"
                        label={language('project.sysconf.sysmenu.type')}
                        radioType="button"
                        initialValue='zone'
                        value={role}
                        onChange={(values)=>{
                            const role = values.target.value
                            setRole(role)
                            if(role==='sysadm'){
                                const newArray = [...authContent]
                                newArray[0].disabled = false
                                setAuthority(newArray)
                            }else {
                                const newArray = [...authContent]
                                newArray[0].disabled = true
                                setAuthority(newArray)
                                setJurisdictionType('specify')
                                formRef.current.setFieldsValue({jurisdiction:'specify'})
                                if(role ==='zone'){
                                    formRef.current.setFieldsValue({level:'1'})
                                }
                            }
                            getMenuList(record.id,1,role)
                        }}
                        options={roles}
                        fieldProps={{
                            buttonStyle: 'solid',
                        }}
                    />
                </div>
                
                <div className={styles.radioGroup}>
                <ProFormRadio.Group
                    name="level"
                    label={language('project.sysconf.sysmenu.level')}
                    radioType="button"
                    initialValue='1'
                    onChange={(key)=>{
                        getMenuList(record.id,key.target.value);
                    }}
                    hidden={role==='maintain'||role==='sysadm'}
                    options={[
                        {
                        label: language('project.sysconf.sysmenu.onelevel'),
                        value: '1',
                        },
                        {
                        label: language('project.sysconf.sysmenu.twolevel'),
                        value: '2',
                        }
                    ]}
                    fieldProps={{
                        buttonStyle: 'solid',
                    }}
                />
                </div>
                <div className={styles.radioGroup}>
                <ProFormRadio.Group
                    name="jurisdiction"
                    label={language('project.sysconf.sysmenu.content')}
                    radioType="button"
                    initialValue='specify'
                    value= {jurisdictionType}
                    onChange={(key)=>{
                        setJurisdictionType(key.target.value)
                    }}
                    options={authority}
                    fieldProps={{
                        buttonStyle: 'solid',
                    }} 
                />
                <ProFormText  name='notes' label={language('project.sysconf.sysmenu.notes')} width={290}/>
                </div>
                <div className='transferbox'>
                    {jurisdictionType != 'all' ?
                    (<TreeTransfer dataSource={menuList} targetKeys={targetKeys} onChange={changeTransfer} />)
                    :('')}
                </div>
            </div>
           
        </ModalForm>
    </>);
};
import React, { useRef, useState, useEffect } from 'react'
import { Button, Dropdown, Menu, message, Input, Modal, Select } from 'antd'
import { ModalForm, ProFormSelect } from '@ant-design/pro-components'
import { language } from '@/utils/language';
import styles from './index.less'
import { PlusCircleOutlined,DeleteOutlined } from '@ant-design/icons';

export default function SignTable(props) {
  const {
    title,
    setTitle,
    dataSource = [],
    bottomData = [],
    setDataSource,
    setBottomData,
    signName,
    dateTime,
    editable = true,
    sigtureList = [],
  } = props
  const [titleInput, setTitleInput] = useState(false) //表格标题状态
  const [addVisible, setAddVisible] = useState(false) //添加弹窗
  const [id, setId] = useState('') //保存当前行的id
  const [rowSpan, setRowSpan] = useState(1) //保存当前行rowSpan
  const [columnsNum, setColumnsNum] = useState('single') //添加单列或双列
  const [addSite, setAddSite] = useState('') //添加的位置
  const formRef = useRef()
  const contentRef = useRef()

  useEffect(()=>{
    console.log(contentRef.current.clientHeight,'contentRef');
  })

  //判断表格内是否有正在编辑的行
  const isEditing = () => {
    const isUpEdit =
      dataSource.filter((item) => item['btnShow'] == true).length !== 0
    const isBottomEdit =
      bottomData.filter((item) => item['btnShow'] == true).length !== 0
    return isUpEdit || isBottomEdit
  }

  //筛选字段
  const filterFields = () => {
    const keys = []
    dataSource.map((item) => {
      item.children.map((chilItem) => {
        keys.push(chilItem.key)
      })
    })
    const arr = sigtureList.filter((item) => {
      return keys.every((e) => e != item.value)
    })
    return arr
  }
  //添加下方同级
  const addBottom = (msg) => {
    const data = [...dataSource]
    const index = data.findIndex((val) => {
      return val.id === id
    })
    let newObj = {}
    if (columnsNum === 'single') {
      newObj = {
        id: Date.now(),
        title: '双击编辑标题',
        children: [
          {
            key: msg[0].value,
            id: Math.random().toString(36),
            title: msg[0].label,
            titleColSpan: 1,
            value: '',
            valueColSpan: 3,
          },
        ],
        rowSpan: 1,
      }
    } else if (columnsNum === 'double') {
      newObj = {
        id: Date.now(),
        title: '双击编辑标题',
        children: [
          {
            key: msg[0].value,
            id: Math.random().toString(36),
            title: msg[0].label,
            titleColSpan: 1,
            value: '',
            valueColSpan: 1,
          },
          {
            key: msg[1].value,
            id: Math.random().toString(36),
            title: msg[1].label,
            titleColSpan: 1,
            value: '',
            valueColSpan: 1,
          },
        ],
        rowSpan: 1,
      }
    } else if (columnsNum === 'cell') {
      newObj = {
        id: Date.now(),
        title: msg[0].label,
        children: [
          {
            key: msg[0].value,
            id: Math.random().toString(36),
            value: '',
            valueColSpan: 4,
          },
        ],
        rowSpan: 1,
      }
    }
    data.splice(index + rowSpan, 0, newObj)
    data[index].btnShow = false
    setDataSource(data)
    setAddVisible(false)
  }
  //添加右侧子级
  const addRight = (msg) => {
    const data = [...dataSource]
    const index = data.findIndex((val) => {
      return val.id === id
    })
    data[index].rowSpan += 1
    let newObj = {}
    if (columnsNum === 'single') {
      newObj = {
        id: Math.random().toString(36),
        title: '',
        value: '',
        children: [
          {
            key: msg[0].value,
            id: Math.random().toString(36),
            title: msg[0].label,
            titleColSpan: 1,
            value: '',
            valueColSpan: 3,
          },
        ],
        rowSpan: 1,
      }
    } else if (columnsNum === 'double') {
      newObj = {
        id: Date.now(),
        title: '',
        value: '',
        children: [
          {
            key: msg[0].value,
            id: Math.random().toString(36),
            title: msg[0].label,
            titleColSpan: 1,
            value: '',
            valueColSpan: 1,
          },
          {
            key: msg[1].value,
            id: Math.random().toString(36),
            title: msg[1].label,
            titleColSpan: 1,
            value: '',
            valueColSpan: 1,
          },
        ],
        rowSpan: 1,
      }
    }
    data.splice(index + rowSpan, 0, newObj)
    data[index].btnShow = false
    setDataSource(data)
    setAddVisible(false)
  }
  //添加底部列表
  const addBottomTd = (id) => {
    const data = [...bottomData]
    const index = data.findIndex((val) => {
      return val.id === id
    })
    let newObj = {
      id: Date.now(),
      title: '双击编辑标题',
      signName: '签字:',
      date: '日期:',
      chapter: '(公章):',
    }
    data.splice(index + 1, 0, newObj)
    data[index].btnShow = false
    setBottomData(data)
  }
  //删除
  const deleteTd = (id, row) => {
    const data = [...dataSource]
    const index = data.findIndex((val) => {
      return val.id === id
    })
    for (let i = index; i >= 0; i--) {
      if (data[i].title) {
        data[i].rowSpan -= 1
        break
      }
    }
    data.splice(index, row)
    setDataSource(data)
  }

  //底部删除
  const deleteBottomTd = (id) => {
    const data = [...bottomData]
    const index = data.findIndex((val) => {
      return val.id === id
    })
    data.splice(index, 1)
    setBottomData(data)
  }

  //表头编辑保存
  const onTitleSave = (e, id) => {
    const data = [...dataSource]
    const index = data.findIndex((val) => {
      return val.id === id
    })
    data[index].title = e.target.value
    data[index].titleEditable = false
    setDataSource(data)
  }
  //底部表头保存
  const onBotTitleSave = (e, id) => {
    const data = [...bottomData]
    const index = data.findIndex((val) => {
      return val.id === id
    })
    data[index].title = e.target.value
    data[index].editable = false
    setBottomData(data)
  }
  //单元格编辑保存
  const onSaveItem = (e, fatherId, id) => {
    const data = [...dataSource]
    const index = data.findIndex((val) => {
      return val.id === fatherId
    })
    const chilIndex = data[index].children.findIndex((val) => {
      return val.id === id
    })
    data[index].children[chilIndex].title = e.target.value
    data[index].children[chilIndex].editable = false
    setDataSource(data)
  }

  const menu = (id, rowSpan) => {
    return (
      <Menu>
        <Menu.SubMenu title={language('project.cfgmngt.signature.bottom')}>
          <Menu.Item
            onClick={() => {
              setColumnsNum('cell')
              setAddVisible(true)
              setAddSite('bottom')
            }}
          >
            {language('project.cfgmngt.signature.cell')}
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              setColumnsNum('single')
              setAddVisible(true)
              setAddSite('bottom')
            }}
          >
            {language('project.cfgmngt.signature.single')}
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              setColumnsNum('double')
              setAddVisible(true)
              setAddSite('bottom')
            }}
          >
            {language('project.cfgmngt.signature.double')}
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu title={language('project.cfgmngt.signature.right')}>
          <Menu.Item
            onClick={() => {
              setColumnsNum('single')
              setAddVisible(true)
              setAddSite('right')
            }}
          >
            {language('project.cfgmngt.signature.single')}
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              setColumnsNum('double')
              setAddVisible(true)
              setAddSite('right')
            }}
          >
            {language('project.cfgmngt.signature.double')}
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    )
  }
  const add = (values) => {
    if (values.field1 === values.field2) {
      message.error(language('project.cfgmngt.signature.repeat'))
    } else {
      if (addSite === 'right') {
        if (columnsNum === 'single') {
          const msg = filterFields().filter(
            (item) => item.value === values.field1
          )
          addRight(msg)
        } else if (columnsNum === 'double') {
          const msg1 = filterFields().filter(
            (item) => item.value === values.field1
          )
          const msg2 = filterFields().filter(
            (item) => item.value === values.field2
          )
          const msg = msg1.concat(msg2)
          addRight(msg)
        } else {
          return false
        }
      } else if (addSite === 'bottom') {
        if (columnsNum === 'double') {
          const msg1 = filterFields().filter(
            (item) => item.value === values.field1
          )
          const msg2 = filterFields().filter(
            (item) => item.value === values.field2
          )
          const msg = msg1.concat(msg2)
          addBottom(msg)
        } else {
          const msg = filterFields().filter(
            (item) => item.value === values.field1
          )
          addBottom(msg)
        }
      }
    }
  }

  //表格底部内容
  const tableButtomHtml = () => {
    return bottomData?.map((item) => {
      return (
        <tr
          key={item.id}
          style={{ height: '80px' }}
          onDoubleClick={() => {
            if (editable) {
              const data = [...bottomData]
              const topData = [...dataSource]
              topData.map((item)=>{
                item.btnShow = false
              })
              data.map((i)=>{
                if(i.id !== item.id){
                  i.btnShow = false
                }else {
                  i.btnShow = true
                }
              })
              setBottomData(data)
            } else {
              return false
            }
            isEditing()
          }}
        >
          <td colspan={1}>
            {item.editable ? (
              <Input
                size='small'
                defaultValue={item.title}
                onBlur={(e) => {
                  onBotTitleSave(e, item.id)
                }}
                style={{ width: 100 }}
              />
            ) : (
              <span onDoubleClick={()=>{
                if (editable) {
                  const data = [...bottomData]
                  const index = data.findIndex((val) => {
                    return val.id === item.id
                  })
                  data[index].editable = true
                  setBottomData(data)
                }
              }}>{item.title}</span>
            )}
          </td>
          <td
            colspan={4}
            style={{
              textAlign: 'left',
              paddingLeft: '5%',
              paddingRight: '30%',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{item.signName}</span>
                <span>{item.chapter}</span>
              </div>

              <div>{item.date}</div>
            </div>
          </td>
          {item.btnShow && (
            <td>
              <div style={{width:'150px'}}>
                {item.title && (
                  <Button
                    type="primary"
                    size="small"
                    style={{ marginRight: 6 }}
                    onClick={() => {
                      addBottomTd(item.id)
                    }}
                    icon={<PlusCircleOutlined/>}
                  >
                    {language('project.cfgmngt.signature.add')}
                  </Button>
                )}
                <Button
                  onClick={() => {
                    deleteBottomTd(item.id)
                  }}
                  size="small"
                  type="danger"
                  icon={<DeleteOutlined/>}
                >
                  {language('project.cfgmngt.signature.delete')}
                </Button>
              </div>
            </td>
          )}
        </tr>
      )
    })
  }

  return (
    <>
    <div ref={contentRef}>
    <div style={{display:'flex',justifyContent:'space-between'}}>
        <div style={{width:15,height:15,borderRight:'1px solid #bbb',borderBottom:'1px solid #bbb'}}></div>
        <div style={{width:15,height:15,borderLeft:'1px solid #bbb',borderBottom:'1px solid #bbb'}}></div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {titleInput ? (
          <Input
            defaultValue={title}
            style={{ width: 200, marginBottom: 8 }}
            onBlur={(e) => {
              setTitleInput(false)
              setTitle(e.target.value)
            }}
          />
        ) : (
          <h2
            onDoubleClick={() => {
              editable && setTitleInput(true)
            }}
          >
            {title}
          </h2>
        )}
      </div>
      <table
        id="myTable"
        border="1"
        style={{
          margin: '0 auto',
        }}
        className={styles.signTable}
      >
        {dataSource?.map((item) => {
          return (
            <tr
              key={item.id}
              onDoubleClick={() => {
                if (editable) {
                  const data = [...dataSource]
                  const botData = [...bottomData]
                  botData.map((item)=>{
                    item.btnShow = false
                  })
                  data.map((i)=>{
                    if(i.id !== item.id){
                      i.btnShow = false
                    }else {
                      i.btnShow = true
                    }
                  })
                  setDataSource(data)
                } else {
                  return false
                }
                isEditing()
              }}
            >
              {item.title && (
                <td rowSpan={item.rowSpan}>
                  <div style={{width:100}}>
                    {item.titleEditable ? (
                      <Input
                        size='small'
                        defaultValue={item.title}
                        onBlur={(e) => {
                          onTitleSave(e, item.id)
                        }}
                        style={{ width: 100 }}
                      />
                    ) : (
                      <span onDoubleClick={()=>{
                        if (editable) {
                          const data = [...dataSource]
                          const index = data.findIndex((val) => {
                            return val.id === item.id
                          })
                          data[index].titleEditable = true
                          setDataSource(data)
                        }
                      }}>{item.title}</span>
                    )}
                  </div>
                </td>
              )}
              {item.children?.map((chilItem) => {
                return (
                  <React.Fragment>
                    {chilItem.title ? (
                      <React.Fragment>
                        <td colSpan={chilItem.titleColSpan}>
                          <div style={{width:100}}>
                            {chilItem.editable ? (
                              <Input
                                size='small'
                                defaultValue={chilItem.title}
                                style={{ width: 100 }}
                                onBlur={(e) => {
                                  onSaveItem(e, item.id, chilItem.id)
                                }}
                              />
                            ) : (
                              <span
                                onDoubleClick={() => {
                                  if (editable) {
                                    const data = [...dataSource]
                                    const index = data.findIndex((val) => {
                                      return val.id === item.id
                                    })
                                    const chilIndex = data[index].children.findIndex((val) => {
                                      return val.id === chilItem.id
                                    })
                                    data[index].children[chilIndex].editable = true
                                    setDataSource(data)
                                  }
                                }}
                              >
                                {chilItem.title}
                              </span>
                            )}
                          </div>
                        </td>
                        <td colSpan={chilItem.valueColSpan} style={chilItem.valColor ? {backgroundColor: chilItem.valColor} : {}}>
                          <div style={{width: chilItem.valueColSpan * 100}}>
                            {chilItem.value}
                          </div>
                        </td>
                      </React.Fragment>
                    ) : (
                      <td colSpan={chilItem.valueColSpan} style={chilItem.valColor ? {backgroundColor: chilItem.valColor} : {}}>
                        <div style={{width: chilItem.valueColSpan * 100}}>
                          {chilItem.value}
                        </div>
                      </td>
                    )}
                  </React.Fragment>
                )
              })}
              {item.btnShow && (
                <td>
                  <div style={{width:150}}>
                    {item.title && (
                      <Dropdown
                        overlay={menu(item.id, item.rowSpan)}
                        trigger={['click']}
                      >
                        <Button
                          type="primary"
                          size="small"
                          style={{ marginRight: 6 }}
                          onClick={() => {
                            setId(item.id)
                            setRowSpan(item.rowSpan)
                          }}
                          icon={<PlusCircleOutlined/>}
                        >
                          {language('project.cfgmngt.signature.add')}
                        </Button>
                      </Dropdown>
                    )}
                    <Button
                      onClick={() => {
                        deleteTd(item.id, item.rowSpan)
                      }}
                      size="small"
                      type="danger"
                      icon={<DeleteOutlined/>}
                    >
                      {language('project.cfgmngt.signature.delete')}
                    </Button>
                  </div>
                </td>
              )}
            </tr>
          )
        })}
        {tableButtomHtml()}
      </table>
      <div
        style={{
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '12px',
          fontSize:12
        }}
      >
        <div>
          <span>{language('project.cfgmngt.signature.people')}</span>
          <span>{signName}</span>
        </div>
        <div style={{ marginRight: isEditing() ? 150 : 0 }}>
          <span>{language('project.cfgmngt.signature.datetime')}</span>
          <span style={{ minWidth: 100, display: 'inline-block' }}>
            {dateTime}
          </span>
        </div>
      </div>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:10}}>
        <div style={{width:15,height:15,borderRight:'1px solid #bbb',borderTop:'1px solid #bbb'}}></div>
        <div style={{width:15,height:15,borderLeft:'1px solid #bbb',borderTop:'1px solid #bbb'}}></div>
      </div>
    </div>
      
      <ModalForm
        layout="horizontal"
        destroyOnClose
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 15 }}
        visible={addVisible}
        width="300px"
        title={language('project.cfgmngt.signature.addtitle')}
        onVisibleChange={setAddVisible}
        modalProps={{
          destroyOnClose: true,
          wrapClassName:styles.fieldsModal
        }}
        onFinish={(values) => {
          add(values)
        }}
        formRef={formRef}
      >
        <ProFormSelect
          name="field1"
          label={language('project.cfgmngt.signature.firstfield')}
          width="150px"
          options={filterFields()}
          rules={[
            {
              required: true,
              message: language('project.messagedel'),
            },
          ]}
        />
        {columnsNum === 'double' && (
          <ProFormSelect
            name="field2"
            label={language('project.cfgmngt.signature.secondfield')}
            width="150px"
            options={filterFields()}
            rules={[
              {
                required: true,
                message: language('project.messagedel'),
              },
            ]}
          />
        )}
      </ModalForm>
    </>
  )
}

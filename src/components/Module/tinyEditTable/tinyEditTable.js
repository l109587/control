import React, { useState, useEffect } from 'react'
import { EditableProTable } from '@ant-design/pro-components'
import {
  DeleteOutlined,
  SaveFilled,
  CloseCircleOutlined,
} from '@ant-design/icons'
import { Tooltip } from 'antd'
import { language } from '@/utils/language'
import styles from './tinyEditTable.less'

export default function TinyEditTable(props) {
  const {
    dataSource, //数据
    name, //表格名称
    setDataSource, //数据更改
    columns, //表头
    maxLength = 512, //最大行数
    addButPosition = 'bottom', //添加按钮的位置
    addButShow = true, //添加按钮的显隐
    tableWidth, //表格宽度
    tableHeight, //表格高度
    editButShow = true, //编辑按钮
    deleteButShow = true, //删除按钮
    cancelButShow = true, //取消按钮
    setIsSave,
    addButDisable
  } = props

  return (
    <>
      <EditableProTable
        size="small"
        className={styles.editable}
        columns={columns}
        name={name}
        bordered={true}
        tableStyle={{ width: tableWidth }}
        scroll={tableHeight && { y: tableHeight }}
        rowKey="id"
        value={dataSource}
        controlled={true}
        onChange={setDataSource}
        maxLength={maxLength}
        recordCreatorProps={addButShow&&{
          position: addButPosition,
          disabled: addButDisable,
          record: () => ({ id: Date.now() }),
          style: addButPosition === 'bottom' && {
            width: tableWidth,
            marginBottom: 0,
          },
          creatorButtonText: language('project.sysconf.syscert.add'),
          onClick: () => {
            setIsSave&&setIsSave(false)
          }
        }}
        editable={{
          type: 'single',
          actionRender: (row, config, defaultDom) => {
            return [
              editButShow && defaultDom.save,
              deleteButShow && defaultDom.delete,
              cancelButShow && defaultDom.cancel,
            ]
          },
          onSave:  (key,val) => {
            setDataSource
          },
          saveText: (
            <Tooltip
              placement="top"
              title={language('project.sysconf.syscert.save')}
            >
              <SaveFilled onClick={() => {
                setIsSave&&setIsSave(true)
              }} />
            </Tooltip>
          ),
          deleteText: (
            <Tooltip
              placement="top"
              title={language('project.sysconf.syscert.delete')}
            >
              <DeleteOutlined style={{ color: 'red' }} onClick={() => {
              }} />
            </Tooltip>
          ),
          cancelText: (
            <Tooltip
              placement="top"
              title={language('project.sysconf.syscert.cancel')}
            >
              <CloseCircleOutlined style={{ color: 'grey' }} onClick={() => {
                setIsSave&&setIsSave(true)
              }} />
            </Tooltip>
          ),
        }}
      />
    </>
  )
}

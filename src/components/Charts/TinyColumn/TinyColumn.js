import { TinyColumn } from '@ant-design/plots'
import { Skeleton } from 'antd';

export default function DemoTinyColumn(props) {
  const { data, color = '#13dafe', customContent ,height=60} = props
  const config = {
    autoFit: true,
    data,
    tooltip:customContent? {
      customContent: (_, data) => customContent(data),
    }:{
      customContent: (_, data) => {
        return `<div>${data[0]?.data?.y}<div>`
      },
    },
    color,
  }
  return (
    <>
      <div>
        {data.length == 0 ? (
          <Skeleton.Input style={{height:height ,width:'100%'}} active/>
        ) : (
          <TinyColumn
            {...config}
            style={{ height: height}}
          />
        )}
      </div>
    </>
  )
}

import { TinyLine } from '@ant-design/plots'
import { Skeleton } from 'antd'

export default function DemoTinyLine(props) {
  const { data, color = '#ffffff', height = 75, max ,backgroundImage} = props
  const config = {
    data,
    smooth: true,
    color,
    xAxis: {
      range: [0, 1],
    },
    yAxis: {
      min: 0,
      max,
    },
  }
  return (
    <>
      <div>
        {data.length == 0 ? (
          <Skeleton.Input style={{ height: height, width: '100%' }} active />
        ) : (
          <TinyLine
            {...config}
            style={{
              height: height,
              backgroundImage
            }}
          />
        )}
      </div>
    </>
  )
}

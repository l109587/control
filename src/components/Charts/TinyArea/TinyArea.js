import { TinyArea } from '@ant-design/plots'
import { Skeleton } from 'antd';

export default function DemoTinyArea(props){
    const { data, color = '#13dafe',height=60} = props
    const config = {
        data,
        color,
        areaStyle: {
          lineOpacity:0,
          fill: color,
        },
        xAxis: {
            range: [0, 1],
          },
      }
    return (
        <>
          <div>
            {data.length == 0 ? (
              <Skeleton.Input style={{height:height ,width:'100%'}} active/>
            ) : (
              <TinyArea
                {...config}
                style={{ height: height}}
              />
            )}
          </div>
        </>
      )
}
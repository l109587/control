import { Column } from '@ant-design/plots'
import { Skeleton } from 'antd'

export default function DemoColumn(props) {
  const {
    data, //图表数据源
    xField, //x轴对应的字段
    yField, //y轴对应的字段
    seriesField, //分组字段
    isGroup, //是否是分组柱状图
    yAMax, //y轴选择范围的最大值
    clientHeight, //图表高度
    tickInterval, //坐标轴刻度间隔
    legend = true, //是否展示图例
    minHeight = 200 //最小高度
  } = props
  const config = {
    appendPadding: [12, 12, 0, 12],
    data,
    xField,
    yField,
    seriesField,
    isGroup,
    yAxis: {
      label: {
        formatter: (v) => {
          if (v < 1000) return v
          if (v < 1000000) return `${(v / 1000).toFixed(0)} K`
          if (v < 1000000000) return `${(v / 1000000).toFixed(0)} M`
          if (v < 1000000000000) return `${(v / 1000000000).toFixed(0)} G`
        },
      },
      min: 0,
      max: yAMax,
      tickInterval: tickInterval,
    },
    legend: legend && {
      layout: 'horizontal',
      position: 'bottom',
      offsetY: 8,
      itemHeight: 15,
    },
  }
  return (
    <>
      <div>
        {data.length == 0 ? (
          <Skeleton.Input
            style={{ height: clientHeight, width: '100%',minHeight:minHeight }}
            active
          />
        ) : (
          <Column {...config} style={{ height: clientHeight,minHeight:minHeight }} />
        )}
      </div>
    </>
  )
}

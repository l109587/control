import { Line } from '@ant-design/plots'
import { Skeleton } from 'antd'

export default function DemoLine(props) {
  const {
    data, //图表数据源
    xField, //x轴对应的字段
    yField, //y轴对应的字段
    seriesField, //分组字段
    xstep, //期望的坐标轴刻度数量
    yAMax, //y轴选择范围的最大值
    clientHeight, //图表高度
    tooltipFormat, //格式化tooltip函数
    tickInterval, //坐标轴刻度间隔
    legend = true, //是否展示图例
    minHeight = 180, //最小高度
  } = props

  const config = {
    data,
    xField,
    yField,
    seriesField,
    xAxis: { tickCount: xstep },
    appendPadding: [12, 12, 0, 12],
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
    tooltip: tooltipFormat && {
      formatter: (value) => tooltipFormat(value),
    },
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
    legend: legend && {
      layout: 'horizontal',
      position: 'bottom',
      itemHeight: 15,
    },
  }

  return (
    <>
      <div>
        {data.length == 0 ? (
          <Skeleton.Input
            style={{ height: clientHeight, width: '100%',minHeight: minHeight }}
            active
          />
        ) : (
          <Line
            {...config}
            style={{ height: clientHeight, minHeight: minHeight }}
          />
        )}
      </div>
    </>
  )
}

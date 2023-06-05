import { Area } from '@ant-design/plots'
import { Skeleton } from 'antd'

export default function DemoArea(props) {
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
    color, //图表颜色
    minHeight = 180 //最小高度
  } = props
  const config = {
    data,
    xField,
    yField,
    seriesField,
    autoFit:true,
    appendPadding: [12, 12, 0, 12],
    xAxis: {
      range: [0, 1],
      tickCount: xstep,
    },
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
    legend: legend && {
      layout: 'horizontal',
      position: 'bottom',
      offsetY: 8,
      itemHeight: 15,
    },
    smooth: true,
    // @TODO 后续会换一种动画方式
    animation: {
      appear: {
        animation: 'path-in',
        duration: 5000,
      },
    },
    areaStyle: () => {
      return {
        fill: color,
      }
    },
  }
  return (
    <>
      {data.length == 0 ? (
        <Skeleton.Input style={{ height: clientHeight, width: '100%',minHeight:minHeight, }}  active />
      ) : (
        <Area {...config} style={{ height: clientHeight,minHeight:minHeight}} />
      )}
    </>
  )
}

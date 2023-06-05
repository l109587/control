import React, { useEffect, useState } from 'react'
import { Graph, Vector } from '@antv/x6'
import '@antv/x6-react-shape'
import { Tooltip } from 'antd'
import { language } from '@/utils/language'
import { post, get } from '@/services/https'
import { msg } from '@/utils/fun'
import Portdgt from '@/assets/switch/portdgt.png' //网口 上  深绿
import Portdg from '@/assets/switch/portdg.png' // 网口下  深绿
import Portbt from '@/assets/switch/portbt.png'
import Portb from '@/assets/switch/portb.png'
import Portgt from '@/assets/switch/portgt.png'
import Portg from '@/assets/switch/portg.png'
import Portlgt from '@/assets/switch/portlgt.png'
import Portlg from '@/assets/switch/portlg.png'
import Portrt from '@/assets/switch/portrt.png'
import Portr from '@/assets/switch/portr.png'
import Portot from '@/assets/switch/portot.png'
import Porto from '@/assets/switch/porto.png'
import Nactppc from '@/assets/switch/nac_tp_pc.png' //电脑显示器 灰
import Cisco from '@/assets/switch/logo_cisco.png'
import H3c from '@/assets/switch/logo_h3c.png'
import Huawei from '@/assets/switch/logo_huawei.png'
import Ruijie from '@/assets/switch/logo_ruijie.png'
import Unknow from '@/assets/switch/logo_unknow.png'
import './topo.less'
let H = document.body.clientHeight - 296
var clientHeight = H > 600 ? H : 600
var topoY = clientHeight / 2 - 60
var topoX = 100
export default (props) => {
  useEffect(() => {
    getList()
  }, [props.swip])

  const getList = () => {
    let data = {}
    data.swip = props.swip
    data.start = 0
    data.limit = 100
    post('/cfg.php?controller=assetMapping&action=showSwitchDetail', data)
      .then((res) => {
        if (!res.success) {
          msg(res)
          return false
        }
        showSwitchDetail(res.data)
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  /* tootip 显示框 */
  const registerPortTooltip = (container, text, offsetY) => {
    container.addEventListener('mouseenter', (e) => {
      let className = e.fromElement ? e.fromElement.className : ''
      if (className == 'ant-modal-body') {
        return false
      }
      const tooltip = document.querySelector('.x6-tooltip')
      const content = tooltip?.querySelector('.ant-tooltip-inner')
      if (content) {
        content.innerHTML = text
        // tooltip.style.left = `${e.clientX - content.offsetWidth / 2 + 5}px`
        // tooltip.style.top = `${e.clientY - offsetY}px`
        tooltip.style.left = `${
          e.clientX - content.offsetWidth / 2 + 5
        }px`
        tooltip.style.top = `${e.clientY - offsetY}px`
      }
    })
    container.addEventListener('mouseleave', () => {
      const tooltip = document.querySelector('.x6-tooltip')
      tooltip.style.left = '-3000px'
      tooltip.style.top = '-3000px'
    })
  }
  /* 内容 */
  const showSwitchDetail = (topoInfo) => {
    const graph = new Graph({
      container: document.getElementById('container'),
      grid: true,
      width: '100%',
      height: clientHeight,
      embedding: {
        enabled: true,
      },
      attrs: {
        body: {
          fill: '#fff',
          stroke: '#fff',
        },
      },
      interacting: function (cellView) {
        if (
          cellView.cell.getData() != undefined &&
          !cellView.cell.getData().disableMove
        ) {
          return { nodeMovable: false }
        }
        return true
      },
    })
    let parentWidth = topoInfo.term
      ? Math.ceil(topoInfo.term.length / 2) * 40 + 350
      : 400
    const parent = graph.addNode({
      id: 'parent',
      x: topoX,
      y: topoY,
      width: parentWidth,
      height: 140,
      zIndex: 1,
      magnet: true,
      attrs: {
        magnet: true,
        body: {
          fill: '#ecf0f1',
          stroke: '#ecf0f1',
        },
      },
    })
    parent.addChild(
      graph.addNode({
        id: 'parenttop',
        x: topoX,
        y: topoY,
        width: parentWidth,
        height: 20,
        zIndex: 10,
        magnet: true,
        label: `${language('project.netanalyse.nettopo.ip')}:${
          topoInfo.ip
        }  ${language('project.netanalyse.nettopo.portnum')}:${topoInfo.ifNum}`,
        attrs: {
          body: {
            fill: '#2c3e50',
            stroke: '#2c3e50',
          },
          label: {
            fill: '#fff',
            fontSize: 12,
            refX: '100%',
            refX2: -8,
            refY: 0.5,
            textAnchor: 'end',
            textVerticalAnchor: 'middle',
          },
        },
        data: {
          disableMove: false, //true为可拖拽，false不可拖拽
        },
      })
    )
    let oddLocalTopoX = topoX + 40
    let evenLocalTopoX = topoX + 40

    topoInfo.term.map((item, index) => {
      if (index % 2 == 0) {
        paddingTopo(parent, graph, item, index, oddLocalTopoX, topoY + 40)
        if (item.termNum) {
          let marginTopoY = topoY - 80
          if (index % 4 == 0) {
            marginTopoY = topoY - 150
          }
          marginTopo(graph, item, oddLocalTopoX, marginTopoY)
        }
        oddLocalTopoX = oddLocalTopoX + 42
      } else {
        paddingTopo(parent, graph, item, index, evenLocalTopoX, topoY + 80)
        if (item.termNum) {
          let marginTopoY = topoY + 250
          if (index % 4 == 1) {
            marginTopoY = topoY + 180
          }
          marginTopo(graph, item, evenLocalTopoX, marginTopoY)
        }
        evenLocalTopoX = evenLocalTopoX + 42
      }
    })
    let rightIconType = topoInfo.icon
      ? topoInfo.icon.substring(topoInfo.icon.lastIndexOf('/') + 1)
      : ''
    parent.addChild(
      graph.addNode({
        id: 'parentright',
        x: oddLocalTopoX - 20,
        y: topoY,
        width: 100,
        height: 80,
        zIndex: 10,
        magnet: true,
        attrs: {
          image: {
            'xlink:href': rightIcon(rightIconType),
            width: 230,
            height: 110,
            x: 12,
            y: 14,
          },
          title: {
            text: topoInfo.model,
            refX: 130,
            refY: 115,
            fill: 'rgb(0,0,0)',
            fontSize: 15,
          },
        },
        markup: [
          {
            tagName: 'image',
            selector: 'image',
          },
          {
            tagName: 'text',
            selector: 'title',
          },
        ],
        data: {
          disableMove: false, //true为可拖拽，false不可拖拽
        },
      })
    )
    graph.on('node:mouseenter', ({ e, node }) => {
      if (
        node.id != 'parent' ||
        node.id != 'parentright' ||
        node.id != 'parenttop'
      ) {
        topoInfo.term.map((item, index) => {
          let link
          if (item.link == '1')
            link = language('project.netanalyse.nettopo.trunkmouth')
          else link = language('project.netanalyse.nettopo.accessmouth')
          if (item.portId == node.id) {
            let text = `${language('project.netanalyse.nettopo.port')}:${
              item.ifName
            }<br/>
            ${language('project.netanalyse.nettopo.indexes')}: ${
              item.ifType
            }<br/>
            ${language('project.netanalyse.nettopo.type')}:${link}<br/>
            ${language('project.netanalyse.nettopo.terminalnum')}:${
              item.termNum
            }`
            registerPortTooltip(e.currentTarget, text, 115)
          }
          if (item.ip == node.id) {
            let text = `${item.ifName}<br/>
            ${language('project.netanalyse.nettopo.mac')}:${item.mac} <br/>
            ${language('project.netanalyse.nettopo.ip')}:${item.ip} `
            registerPortTooltip(e.currentTarget, text, 95)
          }
        })
      }
    })
  }
  const rightIcon = (n) => {
    switch (n) {
      case 'logo_cisco.png':
        return Cisco
      case 'logo_h3c.png':
        return H3c
      case 'logo_huawei.png':
        return Huawei
      case 'logo_ruijie.png':
        return Ruijie
      default:
        return Unknow
    }
  }
  const paddingTopo = (parent, graph, item, index, refX, refY) => {
    let iconType = index % 2 == 0 ? 'up' : 'down'
    let icon
    if (parseInt(item.link) == 1) {
      //级联
      icon = iconType == 'up' ? Portbt : Portb
    } else if (parseInt(item.status) == 0) {
      //离线
      icon = iconType == 'up' ? Portgt : Portg
    } else if (parseInt(item.status) == 1) {
      //空闲
      icon = iconType == 'up' ? Portlgt : Portlg
    } else if (Number(item.inFlowWarn) > 0) {
      //告警终端
      icon = iconType == 'up' ? Portrt : Portr
    } else if (item.termNum > 1) {
      //多终端
      icon = iconType == 'up' ? Portot : Porto
    } else if (item.termNum == 1) {
      //单终端
      icon = iconType == 'up' ? Portdgt : Portdg
    } else {
      //无终端
      icon = iconType == 'up' ? Portlgt : Portlg
    }
    parent.addChild(
      graph.addNode({
        id: item.portId,
        x: refX,
        y: refY,
        width: 40,
        height: 40,
        zIndex: 10,
        shape: 'image',
        imageUrl: icon,
        data: {
          disableMove: false, //true为可拖拽，false不可拖拽
        },
      })
    )
  }
  const marginTopo = (graph, item, refX, refY) => {
    graph.addNode({
      id: item.ip,
      x: refX,
      y: refY, //实际120
      width: 60,
      height: 60,
      zIndex: 11,
      shape: 'react-shape',
      component() {
        return (
          <div className="wrap">
            <img src={Nactppc} alt="" />
            <span>
              {item.termNum} <p className="pcontent"></p>
            </span>
            <p className="title">{item.ip}</p>
          </div>
        )
      },
    })
    const path = graph.addEdge({
      source: item.portId,
      target: item.ip,
      attrs: {
        line: {
          targetMarker: null,
        },
      },
    })
    const view = graph.findViewByCell(path)
    if (view) {
      const path = view.findOne('path')
      if (path) {
        const token = Vector.create('circle', {
          r: 4,
          fill: '#f8ea48',
        })
        token.animateAlongPath(
          {
            dur: '2s',
            repeatCount: 'indefinite',
          },
          path
        )
        token.appendTo(path.parentNode)
      }
    }
  }

  // const refContainer = (container) => {
  //   container = container;
  // }
  return (
    <div>
      <div className="x6-graph-wrap">
        <div className="x6-graph" />
        <Tooltip title="content" overlayClassName="x6-tooltip" visible={true}>
          <span style={{ position: 'relative', left: -3000, top: -3000 }} />
        </Tooltip>
      </div>
      <div id="container"></div>
    </div>
  )
}

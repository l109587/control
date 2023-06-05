import React, { useEffect, useState, useRef } from 'react'
import { Graph, Vector } from '@antv/x6'
import '@antv/x6-react-shape'
import { Tooltip } from 'antd'
import { language } from '@/utils/language'
import { post, postAsync } from '@/services/https'
import { msg } from '@/utils/fun'
import {
  rightIcon,
  paddingTopo,
  iconRight,
  iconLeft,
  iconNactppc,
} from '@/utils/topoIcon'

import $ from 'jquery'
import './topo.less'
import './beixinyuan'
import './ht'
import './ht-flow'
var bdnum = 1
var bdcount = 1
var switchIP = ''
var switchSysName = ''
var page = 0
var tw, th
var dataModel
var graphView
let H = document.body.clientHeight - 296
var clientHeight = H
export default (props) => {
  const formRefMod = useRef()
  let swip = props.swip
  useEffect(() => {
    $('#topo1').css({
      height: props.topoHeight ? props.topoHeight : clientHeight,
    })
    $('#topo1').css({
      width: '100%',
    })
    getList()
    return () => {
      dataModel.clear()
      graphView.invalidate(0)
    }
  }, [swip])

  const showSwitchDetail = (data = {}) => {
    let res = postAsync(props.topoModalShowUrl, data)
    return res
  }

  const getList = async () => {
    let data = {}
    data.swip = swip
    data.start = 0
    data.limit = 100
    data.bdnum = 1
    let res = await showSwitchDetail(data)
    if (!res.success) {
      msg(res)
      return false
    }
    bdcount = res.data?.bdcount
    getnasCharts(swip, 1)
  }

  async function getnasCharts(oip, tabtype = '') {
    if (oip == undefined || oip == '') {
      return
    }
    tw = $('#topo1').width()
    th = $('#topo1').height()
    var start = page * 50
    let rsp = await showSwitchDetail({
      swip: oip,
      start: start,
      limit: 50,
      bdnum: bdnum,
    })

    dataModel = new window.ht.DataModel()
    graphView = new window.ht.graph.GraphView(dataModel)
    graphView.setPannable(true)
    graphView.setTranslateX(-30)
    graphView.setTranslateY(-30)
    var view = graphView.getView()
    view.className = bdcount > 1 ? 'topomod topotow' : 'topomod topoone'
    document.getElementById('topo1').appendChild(view)
    window.addEventListener(
      'resize',
      function (e) {
        graphView.invalidate(0)
      },
      false
    )

    // 启用ToolTip
    graphView.enableToolTip()
    graphView.getToolTip = function (e) {
      var data = graphView.getDataAt(e)
      if (data instanceof window.ht.Node) {
        var _tip = ''
        if (data.type === 'port') {
          var link = ''
          if (data.link === '1') link = 'Trunk口'
          else link = 'Access口'
          _tip =
            '端口：' + data.ifName + '<br/>' + '描述：' + data.ifalias + '<br/>'
        } else if (data.type === 'vendor') {
          _tip =
            '<br><span style="white-space: normal;">' +
            data.data.snmpdesp +
            '</span>'
        } else if (data.type === 'title') {
          _tip = data.data.name
        } else if (data.type === 'term') {
          _tip =
            '接入端口：' +
            data.ifName +
            '<br/>' +
            '端口描述：' +
            data.alias +
            '<br/>' +
            '终端IP：' +
            data.ip +
            '<br/>' +
            '终端MAC：' +
            data.mac +
            '<br/>'
        } else if (data.type === 'prev' || data.type === 'next') {
          return
        } else {
          return
        }
        var _html = '<div class="tipBackgroud">' + _tip + '</div>'
        return {
          html: _html,
        }
      }
    }

    // 点击事件
    graphView.addInteractorListener(function (e) {
      if (e.kind == 'doubleClickData') {
        // 双击节点
        if (e.data instanceof window.ht.Node) {
          setTimeout(function () {
            if (typeof e.data.type != 'undefined') {
              if (e.data.clickType == 'port') {
                //端口
              } else if (e.data.clickType == 'term') {
                //终端
              } else if (e.data.clickType == 'prev') {
                //前一页
                page = page - 1
                getnasCharts(swip)
              } else if (e.data.clickType == 'next') {
                //后一页
                page = page + 1
                getnasCharts(swip)
              } else if (e.data.clickType == 'switch') {
              }
            }
          }, 300)
        }
      }
    })

    var portGroup = createGroup(dataModel)
    portGroup.setStyle('group.background', null)
    portGroup.type = 'switch'
    portGroup.clickType = 'switch'
    portGroup.setExpanded(true)

    var switchGroup = createGroup(dataModel)
    switchGroup.addChild(portGroup)
    switchGroup.type = 'switch'
    switchGroup.clickType = 'switch'
    switchGroup.setExpanded(true)

    var resultJson = rsp
    switchIP = resultJson.data.ip
    switchSysName = resultJson.data.name
    var ifNum = resultJson.data.ifNum
    var port = resultJson.data.term
    var ff = Math.ceil(port.length / 2)
    tw = (tw - ff * 50) / 2
    th = th / 2
    if (tabtype) {
      tpoTab(rsp.data.bdcount, rsp.data.ifNum)
    }

    if (port[0]?.portId > 1) {
      //第一个portId大于1，说明可以前翻
      var itemToPrev = createNode(dataModel, portGroup)
      itemToPrev.type = 'prev'
      itemToPrev.clickType = 'prev'
      itemToPrev.setImage(iconRight)
      itemToPrev.setPosition(tw - w, th + 20)
    }
    //交换机信息节点
    var switchInfoNode = createNode(dataModel, switchGroup)
    var vendorIcon = resultJson.data.icon
    if (typeof vendorIcon === 'undefined' || vendorIcon === '') {
      switchInfoNode.setImage(rightIcon())
    } else {
      let rightIconType = vendorIcon.substring(vendorIcon.lastIndexOf('/') + 1)
      switchInfoNode.setImage(rightIcon(rightIconType))
    }

    switchInfoNode.setName(resultJson.data.model)
    switchInfoNode.type = 'switch'
    switchInfoNode.clickType = 'switch'

    //生成端口&终端节点并连线
    for (var index = 0; index < port.length; index++) {
      var portNode = port[index]
      portNode['type'] = 'port'
      portNode['itype'] = 'port'
      portNode['clickType'] = 'port'
      portNode['icontype'] = portNode.portId % 2 == 0 ? 'down' : 'up'
      portNode['ifName'] = portNode.ifName
      portNode['ifalias'] = portNode.alias
      portNode['link'] = portNode.link
      portNode['flagid'] = resultJson.data.id
      portNode['ifIndex'] = portNode.ifIndex
      portNode['ifType'] = portNode.ifType
      portNode['ip'] = portNode.ip
      portNode['id'] = portNode.phyMac + '' + portNode.ifIndex
      portNode['termNum'] = portNode.termNum
      portNode['status'] = portNode.status
      portNode['inFlowWarn'] = portNode.inFlowWarn
      portNode = createPortOrTerminalNode(portNode, dataModel, index, portGroup)

      if (port[index].termNum > 0) {
        var terminalNode = {}
        terminalNode['type'] = 'term'
        terminalNode['clickType'] = 'term'
        terminalNode['icontype'] = port[index].icontype
        terminalNode['itype'] = port[index].devtype
        terminalNode['ifName'] = port[index].ifName
        terminalNode['ifalias'] = port[index].alias
        terminalNode['link'] = port[index].link
        terminalNode['mac'] = port[index].mac || ''
        terminalNode['ip'] = port[index].ip || ''
        terminalNode['portId'] = port[index].portId
        terminalNode['termNum'] = port[index].termNum
        terminalNode['blockipnum'] = port[index].blockipNum
        terminalNode['ifIndex'] = port[index].ifIndex
        terminalNode['ifType'] = port[index].ifType
        terminalNode['flagid'] = resultJson.data.id
        terminalNode['id'] = port[index].mac
        terminalNode['icon'] = port[index].icon
        terminalNode['status'] = ''
        terminalNode['inFlowWarn'] = ''
        terminalNode = createPortOrTerminalNode(
          terminalNode,
          dataModel,
          index,
          portGroup
        )
        createEdge(portNode, terminalNode, dataModel)
      }
    }

    if (port[port.length - 1] && ifNum > port[port.length - 1]?.portId) {
      //说明允许后翻
      var itemToNext = createNode(dataModel, portGroup)
      itemToNext.type = 'next'
      itemToNext.clickType = 'next'
      itemToNext.setImage(iconLeft)
      itemToNext.setPosition(tw + ff * w, th + 20)
    }

    graphView.enableFlow(20)

    if (port.length >= 1) {
      switchGroup.setName(
        '名称：' +
          switchSysName +
          '  IP:' +
          switchIP +
          '  端口数:' +
          resultJson.data.ifNum
      )
      switchInfoNode.setPosition(tw + (port.length / 2) * w + 100, th + 14)
    }
    switchInfoNode.setScale(1.5, 1.5)

    var blinkTask = {
      interval: 500,
      action: function (data) {
        if (data.blockipnum > 0) {
          var timage = data.getImage()
          var iswarn = timage.indexOf('_warn.png') > 0
          if (iswarn) {
            timage = timage.replace('_warn.png', '.png')
            data.setImage(timage)
          } else {
            timage = timage.replace('.png', '_warn.png')
            data.setImage(timage)
          }
        }
      },
    }
    dataModel.addScheduleTask(blinkTask)

    graphView.fitContent(false, 1000)
    graphView.setZoom(1.1)
  }

  function tpoTab(num = 0, ifNum = 0) {
    if (num <= 1 || !num) {
      num = 1
    } else {
      $('.toptip').html(
        '交换机类型为堆叠交换机，交换机面板数为' +
          num +
          '，端口总数为' +
          ifNum +
          ''
      )
      $('.toptip').css('display', 'block')
      var tabArr = Array()
      for (var i = 1; i <= num; i++) {
        if (i > 1) {
          tabArr.push(
            '<li id="tab' + i + '" value=\'' + i + "' class='cativeC' >"
          )
        } else {
          tabArr.push(
            '<li id="tab' +
              i +
              '" value=\'' +
              i +
              "'  class='cativeC activeTabTow' >"
          )
        }
        tabArr.push('		<a > ' + '面板' + ' ' + i + '</a>')
        tabArr.push('	</li>')
      }
      $('.topwidget').find('ul').html(tabArr.join(''))
      $('.topwidget').css('display', 'block')
    }
  }

  // 创建节点
  var w = 40,
    h = 40

  function createNode(dataModel, group) {
    var node = new window.ht.Node()
    node.setParent(group)
    dataModel.add(node)
    return node
  }

  function createGroup(dataModel) {
    var group = new window.ht.Group()
    group.setExpanded(true)
    group.setStyle('group.toggleable', false)
    dataModel.add(group)
    return group
  }

  function createPortOrTerminalNode(nodeInfo, dataModel, index, group) {
    var node = new window.ht.Node()
    node.id = nodeInfo.id
    node.setTag(nodeInfo.id)
    node.ifName = nodeInfo.ifName
    node.ifalias = nodeInfo.ifalias
    node.mac = nodeInfo.mac
    var link = nodeInfo.link
    node.link = link
    node.type = nodeInfo.type
    var tm = nodeInfo.termNum
    node.termNum = tm
    node.blockipnum = nodeInfo.blockipnum
    node.clickType = nodeInfo.clickType
    node.ifIndex = nodeInfo.ifIndex
    node.flagid = nodeInfo.flagid
    node.ip = nodeInfo.ip
    var icontype = nodeInfo.icontype
    index = Math.floor(index / 2)
    if (nodeInfo.type == 'port') {
      node.setSize(w, h)
      node.setImage(paddingTopo(nodeInfo, icontype))
      if (icontype == 'up') {
        node.setPosition(tw + index * w, th)
      } else if (icontype == 'down') {
        node.setPosition(tw + index * w, th + 40)
      }
      node.setParent(group)
    } else if (nodeInfo.type == 'term') {
      node.setSize(w - 5, h)
      if (icontype == 'up') {
        if (index % 2 == 0) {
          node.setPosition(tw + index * w, th - 180)
        } else {
          node.setPosition(tw + index * w, th - 100)
        }
      } else {
        if (index % 2 == 0) {
          node.setPosition(tw + index * w, th + 220)
        } else {
          node.setPosition(tw + index * w, th + 140)
        }
      }
      node.setName(nodeInfo.ip)
      node.setStyle('note', nodeInfo.termNum)
      node.setStyle('note.color', 'black')
      node.setStyle('note.offset.x', -10)
      node.setStyle('note.offset.y', 15)
      node.setStyle('note.background', '#FFA000')
      node.setImage(iconNactppc)
    }
    dataModel.add(node)
    return node
  }

  // 创建连线
  function createEdge(sourceNode, targetNode, dataModel) {
    var edge = new window.ht.Edge(sourceNode, targetNode)
    edge.hideMe = true
    edge.s({
      'edge.center': true,
      'edge.width': 1,
      'edge.color': '#000',
      flow: true,
      'edge.independent': true, // 是否一直显示
      'flow.autoreverse': true, // 是否循环滚动
      'flow.element.shadow.visible': true,
      'flow.element.autorotate': true,
      'flow.element.background': '#f7df73', // 流动元素颜色
    })
    dataModel.add(edge)
    return edge
  }
  return (
    <div className="wrapper" style={{ width: '100%', overflow: 'hidden' }}>
      <div
        class="toptip"
        style={{
          height: '35px',
          backgroundColor: '#e8f4fe',
          lineHeight: '37px',
          paddingLeft: '23px',
          borderRadius: '5px',
          marginTop: '10px',
          display: 'none',
        }}
      ></div>
      <div
        id="topo1"
        style={{ width: '100%', overflow: 'hidden' }}
        ref={formRefMod}
      ></div>
    </div>
  )
}

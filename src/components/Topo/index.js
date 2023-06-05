import React, { useEffect, useState, useRef } from 'react'
import { post, postAsync } from '@/services/https'
import { Input, Button } from 'antd'
import { ModalForm, ProFormText } from '@ant-design/pro-components'
import { iconTypeShow } from '@/utils/topoIcon'
import { msg, onSuccess, onError } from '@/utils/fun'
import { useSelector } from 'umi'
import { language } from '@/utils/language'

import Topo from './Topo'
import $ from 'jquery'
import './index.less'
import './beixinyuan'
import './ht'
import './ht-autolayout'
import './ht-contextmenu'
import './ht-edgetype'
import './ht-flow'
import './ht-quickfinder'
import './ht-cssanimation'

const { Search } = Input
var autoLayoutList = [
  'circular',
  'symmetric',
  'towardnorth',
  'towardsouth',
  'towardeast',
  'towardwest',
  'hierarchical',
]
var clickNum = 1
var g_data
var quickFinder
var graphView

let documentWidth = document.body.clientWidth - 300
export default (props) => {
  const contentHeight = useSelector(({ app }) => app.contentHeight)
  const clientHeight = contentHeight - 220
  window.htconfig = {
    Default: {
      contextMenuBackground: 'rgb(240,240,240)',
      contextMenuLabelColor: 'black',
      contextMenuHoverBackground: 'rgb(28,161,251)',
      contextMenuHoverLabelColor: 'black',
      contextMenuSeparatorColor: 'rgb(145,165,200)',
      contextMenuScrollerBorderColor: 'rgb(145,165,200)',
      contextMenuBorderColor: 'rgb(145,165,200)',
    },
  }
  const topoHeight = props.topoHeight
  const indHeight = props.height
  const checkedTabKey = props.checkedTabKey
  const formRef = useRef()
  const [swip, setSwip] = useState()
  const [swid, setSwid] = useState()
  const [topoModal, setTopoModal] = useState(false)

  useEffect(() => {
    $('#topo').css({
      height: indHeight ? indHeight : clientHeight,
    })
    if (checkedTabKey == 1) {
      getGateway()
    }
  }, [checkedTabKey])

  const topolocation = () => {
    getGateway(true)
    clickNum++
    if (clickNum > 6) {
      clickNum = 0
    }
  }

  $('body').on('click', '#modal_open1', function () {
    $('#dialog-modal1').find('input').val('')
    $('.attentionPrompt').removeClass('attentionPrompt')
    $('#dialog-modal1 #swip_1,#dialog-modal1 #linkip_1')
      .find('.selectivity-single-result-container')
      .html('<div class="selectivity-placeholder">请选择</div>')
    $('#dialog-modal1').find('select').val('').change()
    $('#dialog-modal1').dialog('open')
    return false
  })
  //计算topo
  const scanTopo = () => {
    post(props.scanTopoUrl)
      .then((res) => {
        if (!res.success) {
          onError(res)
          return false
        }
        onSuccess({ msg: res.msg })
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  var ifNum = []

  //保存位置
  const saveTopo = (type = '') => {
    var strJson = []
    strJson.push({ ip: 'layout', pos: autoLayoutList[clickNum] })
    g_data.each(function (data) {
      if (data instanceof window.ht.Node) {
        strJson.push({ ip: data.ipAddr, pos: data.getPosition() })
      }
    })
    post(props.saveTopoUrl, { pos: JSON.stringify(strJson) })
      .then((res) => {
        if (!res.success) {
          onError(res)
          return false
        }
        if (type == 'click') {
          onSuccess(res)
        }
      })
      .catch(() => {
        console.log('mistake')
      })
  }

  const getTopoPos = () => {
    let res = postAsync(props.getTopoPosUrl)
    return res
  }

  const showTopology = () => {
    let data = postAsync(props.topoShowUrl)
    return data
  }

  async function getGateway() {
    var autoL = autoLayoutList[clickNum]
    var config = {
      assetids: [],
    }
    var dataModel = new window.ht.DataModel()
    g_data = dataModel
    graphView = new window.ht.graph.GraphView(dataModel)
    var view = graphView.getView()
    view.className = 'topobox'
    document.getElementById('topo').appendChild(view)
    // 启用tooltip
    graphView.enableToolTip()
    graphView.getToolTip = function (e) {
      var data = graphView.getDataAt(e)
      if (data instanceof window.ht.Node) {
        var _tip = data.name
        if (typeof data.ipAddr != 'undefined') {
          _tip =
            `${language('project.devname')}：` + data.name +
            `<br>${language('project.analyse.illinn.addr')}：` +
            data.ipAddr +
            `<br>${language('netanalyse.nettopo.termNum')}：` +
            data.termNum
        }
        var _html = '<div class="tipBackgroud">' + _tip + '</div>'
        return {
          html: _html,
        }
      }
    }

    // 去掉无效的
    window.addEventListener(
      'resize',
      function (e) {
        graphView.iv()
      },
      false
    )

    // 点击事件
    graphView.addInteractorListener(function (e) {
      if (e.kind == 'doubleClickData') {
        // 双击节点

        if (e.data instanceof window.ht.Node) {
          setTimeout(function () {
            setSwip(e.data.ipAddr)
            setSwid(e.data.id)
            getModal(1)
          }, 300)
        }
      }
    })

    var topoPos = new Map()
    if (arguments.length === 0) {
      let resp = await getTopoPos()
      if (resp instanceof Array) {
        for (let key in resp) {
          topoPos[resp[key].ip] = resp[key].pos
        }
        if (topoPos['layout']) {
          autoL = topoPos['layout']
        }
      }
    }

    let data = await showTopology()
    var nodes = data.nodes
    if (!!nodes) {
      $.each(nodes, function (n, node) {
        config.assetids.push(node.ipAddr)
        node['name'] = node.name
        node['icon'] = node.icon
        node['id'] = node.id
        node['devtype'] = node.devtype
        node['ipAddr'] = node.ipAddr
        node['ifNum'] = node.ifNum
        node['mac'] = node.mac
        node['online'] = node.online
        node['root'] = node.root
        node['termNum'] = node.termNum
        node['termOnline'] = node.termOnline
        node['termWarning'] = node.termWarning
        node['blockterm'] = node.blockterm
        node['pos'] = topoPos[node.ipAddr]
        createNode(node, dataModel)
      })
    }
    var line = data.lines
    if (line) {
      $.each(line, function (l, line) {
        createEdge(line.from, line.to, dataModel)
      })
    }
    quickFinder = new window.ht.QuickFinder(dataModel, 'ipAddr', 'attr')

    let blinkTask = {
      interval: 500,
      action: function (data) {
        if (data.blockterm == 1) {
          let ison = data.nodeImage.indexOf('_on.png') > 0
          let timage
          if (ison) {
            timage = data.nodeImage.replace('_on.png', '_warn.png')
            data.nodeImage = timage
            data.setImage(timage)
          } else {
            timage = data.nodeImage.replace('_warn.png', '_on.png')
            data.nodeImage = timage
            data.setImage(timage)
          }
        }
      },
    }
    dataModel.addScheduleTask(blinkTask)

    setTimeout(function () {
      var autoLayout = new window.ht.layout.AutoLayout(graphView) // 自动布局
      autoLayout.isLayoutable = function (data) {
        if (data instanceof window.ht.Node) {
          let pos = data.getPosition()
          if (pos.x > 0 || pos.y > 0) {
            return false
          }
        }
        return true
      }
      autoLayout.layout(autoL, function () {
        graphView.fitContent(true, 20, true) // 让图形自适应但是去掉zoom效果
      })
    }, 0)
    if (arguments.length) {
      setTimeout(saveTopo, 1000)
    }
  }

  // 创建节点
  function createNode(item, dataModel) {
    var node = new window.ht.Node()
    node.id = item.id
    node.ipAddr = item.ipAddr
    node.guid = item.ipAddr
    node.setTag(item.ipAddr)
    node.ifNum = item.ifNum
    node.termNum = item.termNum
    node.termOnline = item.termOnline
    node.termWarning = item.termWarning
    node.blockterm = item.blockterm
    node.online = item.online
    node.mac = item.mac
    node.root = item.root
    node.icon = item.icon
    var image = 'nodeImg'
    if (node.icon != null) {
      let img = iconTypeShow(item)
      image = img
    }
    node.nodeImage = image
    node.setImage(image)
    var name = item.name
    node.name = name
    node.setAttr('ipAddr', item.ipAddr)
    node.setName(name + '\n(' + item.ipAddr + ')')
    node.setSize(60, 60)
    if (item.pos) {
      node.setPosition(item.pos.x, item.pos.y)
    } else {
      node.setPosition(0, 0)
    }
    var labelColor = item.labelColor
    if (!labelColor) {
      node.s({
        'label.color': '#000',
      })
    }
    dataModel.add(node)
    return node
  }

  // 创建连线
  function createEdge(sourceIP, targetIP, dataModel) {
    let sourceNode = dataModel.getDataByTag(sourceIP)
    let targetNode = dataModel.getDataByTag(targetIP)
    if (!sourceNode || !targetNode) {
      return
    }
    var edge = new window.ht.Edge(sourceNode, targetNode)
    edge.hideMe = true
    edge.setTag(sourceIP + '-' + targetIP)
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

  const seartchNode = (v) => {
    let nodesS = quickFinder.findFirst(v)
    if (nodesS) {
      graphView.fitData(nodesS, !0, 20, !0)
      graphView.sm().ss(nodesS)
    }
    var ww = $('#topo').width() / 2
    var hh = $('#topo').height() * 0.2
    var x = nodesS.getX()
    var y = nodesS.getY()
    if (y < hh) {
      y = y - hh
    } else {
      y = hh - y
    }
    graphView.dm().each(function (data) {
      try {
        data.setX(data.getX() + ww - x)
        data.setY(data.getY() - y)
      } catch (e) {}
    })
  }

  //弹出编辑model
  const getModal = (status) => {
    if (status == 1) {
      setTopoModal(true)
    } else {
      formRef.current.resetFields()
      setTopoModal(false)
    }
  }

  return (
    <>
      <div className="widget oneth check">
        <div id="dyn" className="shownpars oneTable">
          <div
            className="tabletopbtn topoBtn"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'self-end',
            }}
          >
            <Search
              placeholder={language('netanalyse.nettopo.placeenterIP')}
              allowClear
              style={{ width: 200, marginRight: 15 }}
              onSearch={(queryVal) => {
                seartchNode(queryVal)
              }}
            />
            <Button
              type="primary"
              style={{ marginTop: 20, width: 100, marginRight: 15 }}
              onClick={() => {
                scanTopo()
              }}
            >
              {language('netanalyse.nettopo.scanTopo')}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                topolocation()
              }}
              style={{ marginTop: 20, width: 100, marginRight: 15 }}
            >
              {language('netanalyse.nettopo.topoSwitch')}
            </Button>
            <Button
              type="primary"
              style={{ marginTop: 20, width: 100, marginRight: 15 }}
              onClick={() => {
                saveTopo('click')
              }}
            >
              {language('netanalyse.nettopo.saveLayout')}
            </Button>
          </div>
          <div id="topo" style={{ width: '100%', height: '100%', position: 'relative' }}></div>
        </div>
        <div className="clear"></div>
      </div>
      <ModalForm
        className="topoform"
        width={documentWidth}
        height="100%"
        formRef={formRef}
        title={language('netanalyse.nettopo.Charts')}
        visible={topoModal}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
          maskClosable: false,
          onCancel: () => {
            getModal(2)
          },
        }}
        submitter={false}
        onVisibleChange={setTopoModal}
        submitTimeout={2000}
      >
        {topoModal ? (
          <Topo
            swip={swip}
            swid={swid}
            topoModalShowUrl={props.topoModalShowUrl}
            topoHeight={topoHeight}
          />
        ) : (
          ''
        )}
      </ModalForm>
    </>
  )
}

import Mock from 'mockjs'

export default function dmcmconfigFn(getParam, postParam, res) {
  let json = ''
  if(getParam.action == 'show') {
    if(postParam.module == 'trojan') {
      json = Mock.mock({
        "success": true,
        "total": "21",
        "data|21": [{
          "state": "N",
          "rule_id|+1": 1,
          "from": "local",
          "refcnt|0-200": 0,
          "info": {
            "risk|0-4": 2,
            "trojan_id|+1": 1,
            "trojan_type|1-4": 3,
            "store_pcap|1-2": 1,
            "os": "windows",
            "trojan_name": "name",
            "desc": "######",
            "rule": "#####",
          }
        }]
      })
    } else if(postParam.module == 'attack') {
      json = Mock.mock({
        "success": true,
        "total": "21",
        "data|21": [{
          "state": "N",
          "rule_id|+1": 1,
          "from": "local",
          "refcnt|0-999": 0,
          "info": {
            "risk|0-4": 2,
            "trojan_id|+1": 1,
            "trojan_type|1-4": 3,
            "store_pcap|1-2": 1,
            "os": "windows",
            "trojan_name": "name",
            "desc": "@@@@@@@",
            "rule": "@@@@@@@",
          }
        }]
      })
    }
  } else if (getParam.action == 'showData') {
    if(postParam.module == 'trojan') {
      json = require('../json/dmc/mconfig/attachck/troationSelect.json')
    }
  } else if (getParam.action == 'showDevice') {
      json = require('../json/dmc/mconfig/attachck/troationedTable.json')
  }
  res.send(json)
}
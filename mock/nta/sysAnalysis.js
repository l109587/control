export default function sysAnalysis(getParam, postParam, res) {
    let json = ''
    if(getParam.action == 'showFlowConnStat') {
        json = require('../json/nta/sysMonitor/showFlowConnStat.json');
    }else if(getParam.action == 'showFlowTotalStat'){
        json = require('../json/nta/sysMonitor/showFlowTotalStat.json')
    }else if(getParam.action == 'showFlowPktsStat'){
        json = require('../json/nta/sysMonitor/showFlowPktsStat.json')
    }else if(getParam.action == 'showAppsChart'){
        json = require('../json/nta/sysMonitor/showAppsChart.json')
    }else if(getParam.action == 'showAppsTable'){
        json = require('../json/nta/sysMonitor/showAppsTable.json')
    }else if(getParam.action == 'showRptLogCard'){
        json = require('../json/nta/sysMonitor/showRptLogCard.json')
    }else if(getParam.action == 'showRptLogPieChart'){
        json = require('../json/nta/sysMonitor/showRptLogPieChart.json')
    }else if(getParam.action == 'showRptLogBarChart'){
        json = require('../json/nta/sysMonitor/showRptLogBarChart.json')
    }else if(getParam.action == 'showRptLogRunChart'){
        json = require('../json/nta/sysMonitor/showRptLogRunChart.json')
    }
    res.send(json)
  }

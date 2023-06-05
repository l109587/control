export default function confReport(getParam, postParam, res) {
    let json = ''
    if(getParam.action == 'showLogTypeList') {
        json = require('../json/nta/confReport/showLogTypeList.json');
    }else if (getParam.action == 'showReport'){
        json = require('../json/nta/confReport/showReport.json');
    }else if (getParam.action == 'setReport'){
        json = require('../json/nta/confReport/setReport.json');
    }
    res.send(json)
}
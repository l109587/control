export default function ruleinfo(getParam, postParam, res) {
    let json = ''
    if(getParam.action == 'getDivision') {
        json = require('../json/dmc/ruleinfo/getDivision.json');
    }else if(getParam.action == 'show'){
        json = require('../json/dmc/ruleinfo/show.json')
    }
    res.send(json)
}
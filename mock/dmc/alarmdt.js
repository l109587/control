export default function alarmdt(getParam, postParam, res) {
    let json = ''
    if(getParam.action == 'show') {
        json = require('../json/dmc/confAlarm/show.json');
    }
    res.send(json)
}
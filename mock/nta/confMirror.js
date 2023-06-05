export default function confMirror(getParam, postParam, res) {
    let json = ''
    if(getParam.action == 'showMirror') {
        json = require('../json/nta/confMirror/showMirror.json');
    }else if(getParam.action == 'setMirror'){
        json = require('../json/nta/confMirror/setMirror.json');
    }
    res.send(json)
}
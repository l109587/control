export default function ctrlcmd(getParam, postParam, res) {
    let json = ''
    if(getParam.action == 'show') {
        json = require('../json/dmc/ctrlcmd/showCtrlData.json');
    }else if(getParam.action == 'storeFirmware'){
        json = require('../json/dmc/ctrlcmd/storeFirmware.json');
    }else if(getParam.action == 'storePolicyFile'){
        json = require('../json/dmc/ctrlcmd/storePolicyFile.json');
    }else if(getParam.action == 'getModuleNames'){
        json = require('../json/dmc/ctrlcmd/getModuleNames.json');
    }
    res.send(json)
}
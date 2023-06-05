export default function confDevice(getParam, postParam, res) {
  let json = ''
  if(getParam.action == 'showSynclist'){
    json = require('../json/dmc/mconfig/attachck/synclist.json');
  }else if(getParam.action == 'showList'){
    json = require('../json/dmc/confDevice/devshowList.json');
  }else if(getParam.action == 'detail'){
    json = require('../json/dmc/confDevice/detail.json');
  }else if(getParam.action == 'regShowList'){
    json = require('../json/dmc/confDevice/regShowList.json');
  }else{

  }
  res.send(json)
}
export default function alarmditFn(getParam, postParam, res) {
  let json = ''
  if(getParam.action == 'showTransferAlarm') {
    if (postParam.class == 1) {
      json = require('../json/nta/alarmdt/transfer.json');
    } else if (postParam.class == 2) {
      json = require('../json/nta/alarmdt/tarnsferkeyword.json');
    } else if (postParam.class == 3) {
      json = require('../json/nta/alarmdt/tarnsferkeyword.json');
    } else if (postParam.class == 4) {
      json = require('../json/nta/alarmdt/tarnsferkeyword.json');
    } else if (postParam.class == 5) {
      json = require('../json/nta/alarmdt/tarnsferkeyword.json');
    }
  } else if (getParam.action == 'showTrojanAlarm') {
    json = require('../json/nta/alarmdt/attackertrojan.json');
  } else if (getParam.action == 'showAttackAlarm') {
    json = require('../json/nta/alarmdt/attackvulner.json');
  } else if (getParam.action == 'showIPAlarm') {
    json = require('../json/nta/alarmdt/targetadtIp.json');
  } else if (getParam.action == 'showDNSAlarm') {
    json = require('../json/nta/alarmdt/targetadtIp.json');
  } else if (getParam.action == 'showAbnormalAlarm') {
    if (postParam.alarmType == 1) {
      json = require('../json/nta/alarmdt/unknowremote.json');
    } else  if (postParam.alarmType == 2) {
      json = require('../json/nta/alarmdt/unknowsusicious.json');
    }
  } else if (getParam.action == 'showMalwareAlarm') {
    json = require('../json/nta/alarmdt/attackermailcious.json');
  } else if (getParam.action == 'showURLAlarm') {
    json = require('../json/nta/alarmdt/targetadturl.json');
  } else if (getParam.action == 'showSMTPAlarm') {
    json = require('../json/nta/alarmdt/targetadtstmp.json');
  } else if (getParam.action == 'showFTPAlarm') {
    json = require('../json/nta/alarmdt/targetadtftp.json');
  }
  res.send(json)
}
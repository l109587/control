import Mock from 'mockjs'
import sysMonitor from './nta/sysMonitor'
import sysAnalysis from './nta/sysAnalysis'
import confMirror from './nta/confMirror'
import confReport from './nta/confReport'
import alarmditFn from './nta/alarmdt'
import dmcmconfigFn from './dmc/dmcmconfig'
import ctrlcmd from './dmc/ctrlcmd'
import ruleinfo from './dmc/ruleinfo'
import alarmdt from './dmc/alarmdt'
import confDevice from './dmc/confDevice'

export default {
	'post /login.php': (req, res) => {
		//get 参数
		let getParam = req.query;
		//post 参数
		let psotParam = req.body;
		if(getParam.action == 'login') {
			var json = '';
			var admin = {
				username: 'admin',
				password: 'c4ca4238a0b923820dcc509a6f75849b'
			}
			var sec = {
				username: 'secadm',
				password: 'c4ca4238a0b923820dcc509a6f75849b'
			}
			var adt = {
				username: 'audit',
				password: 'c4ca4238a0b923820dcc509a6f75849b'
			}
			var data = psotParam;
			if(data.username == admin.username && data.password == admin.password) {
				json = require('./json/equipment/login.json');
			} else if(data.username == sec.username && data.password == sec.password) {
				json = require('./json/login/secLogin.json');
			} else if(data.username == adt.username && data.password == adt.password) {
				json = require('./json/login/adtLogin.json');
			} else {
				json = { success: false, msg: '请输入正确的用户名或密码！' }
			}
			res.send(json)
		} else if(getParam.action == 'token') {
			// console.debug(getParam.action);
			json = require('./json/login/token.json');
			res.send(json);
		} else if(getParam.action == 'captcha') {
			json = require('./json/login/captcha.json');
			res.send(json);
		} else if(getParam.action == 'config') {
			json = require('./json/login/config.json');
			res.send(json);
		} else if(getParam.action == 'redirect') {
			json = require('./json/login/redirect.json');
			res.send(json);
		} else if(getParam.action == 'loginCert') {
			json = require('./json/equipment/login.json');
			res.send(json);
		}
		else {

		}
	},
	'post /cfg.php': (req, res) => {
		//get 参数
		let getParam = req.query;
		//post 参数
		let psotParam = req.body;
		if(getParam.controller == 'sysSetting') {
			let json = '';
			//系统设置
			if(getParam.action == 'getSystime') {
				json = require('./json/systime/time.json');
				//NTP
			}	else if(getParam.action == 'getNTP') {
				json = require('./json/systime/ntp.json');
			}
			 else if(getParam.action == 'getSNMP') {
				json = require('./json/sysconf/sysserv.json');
			}
			else {
				// json = require('./json/equipment/network.json')
			}
			res.send(json);
		} else if(getParam.controller == 'sys') {
			let json = '';
			//系统装填
			if(getParam.action == 'showSystemState') {
				json = require('./json/sysmain/status.json')
				//NTP
			} else if(getParam.action == 'showSystemVersion') {
				json = {
					"success": true,
					"version": "v2.0.20",
					"builder": "v2.0.45 Alpha Build 3345 x86_64"
				};
			}
			else if(getParam.action == 'systemUpload') {
				json = require('./json/sysmain/sysload.json')
			}
			else if(getParam.action == 'systemUpdate') {
				json = require('./json/sysmain/sysupdate.json')
			}
			else if(getParam.action == 'checkRebootFinish') {
				json = require('./json/sysmain/checkreboot.json')
			}
			else if(getParam.action == 'licenseUpload') {
				json = require('./json/sysmain/sysload.json')
			}
			else if(getParam.action == 'licenseUpdate') {
				json = require('./json/sysmain/sysupdate.json')
			}
			else {

			}
			res.send(json);
		} else if(getParam.controller == 'netSetting') {
			let json = '';
			if(getParam.action == 'showInterface') {
				json = require('./json/equipment/network.json')
			} else if(getParam.action == 'getIFTypeList') {
				json = require('./json/equipment/typeList.json')
			}
			else if(getParam.action == 'showTrunkList') {
				json = require('./json/monitor/trunklist.json')
			}
			else if(getParam.action == 'getIFGatewayMAC') {
				json = require('./json/monitor/gatewaymac.json')
			}
			else if(getParam.action == 'clearIFeth') {
				json = require('./json/sysconf/clearIFeth.json')
			}
			else if(getParam.action == 'showSingleMGT') {
				json = require('./json/sysconf/netconfdata.json')
			}
			else if(getParam.action == 'showDNS') {
				json = require('./json/sysconf/showDNS.json')
			}else if(getParam.action == 'showMirrorList') {
				json = require('./json/nta/netSetting/showMirrorList.json');
			}
			else {

			}
			res.send(json);
		} else if(getParam.controller == 'adminAcc') {
			let json = '';
			if(getParam.action == 'showAdmin') {
				json = require('./json/equipment/adminacc.json')
			} else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'sysHeader') {
			let json = '';
			if(getParam.action == 'showLogChart') {
				json = require('./json/indexcharts/flowchkchart.json')
			}
			else if(getParam.action == 'showSysChart') {
				if (psotParam.chartype == 'cpu') {
					json = require('./json/indexcharts/syscpuchart.json')
				} else if (psotParam.chartype == 'mem') {
					json = require('./json/indexcharts/sysemechart.json')
				}
			}
			else if(getParam.action == 'showMFlowChart') {
				json = require('./json/indexcharts/flowchkchart.json')
			}
			else if(getParam.action == 'showSysInfo') {
				json = require('./json/indexcharts/SysInfo.json')
			}
			else if(getParam.action == 'showDeviceChart') {
				json = require('./json/indexcharts/AppsTopChart.json')
			}
			else if(getParam.action == 'showConfigChart') {
				json = require('./json/indexcharts/LogStats.json')
			}
			else if(getParam.action == 'showAssetChart') {
				json = require('./json/monindex/apptopchart.json')
			}
			else if(getParam.action == 'showDataStats') {
				json = require('./json/monindex/logstats.json')
			}
			else if(getParam.action == 'showCheckStats') {
				json = require('./json/monindex/showCheckStats.json')
			}
			else if(getParam.action == 'showCascadeState') {
				json = require('./json/monindex/showCascadeState.json')
			}
			else if(getParam.action == 'showAssetsChart') {
				json = require('./json/monindex/showAssetsChart.json')
			}
			else if(getParam.action == 'showAssetsCtrlChart') {
				json = require('./json/monindex/showAssetsCtrlChart.json')
			}
			else if(getParam.action == 'showDevRegStats') {
				json = require('./json/monindex/showDevRegStats.json')
			}
			else if(getParam.action == 'showResList') {
				json = require('./json/monindex/showResList.json')
			}
			else if(getParam.action == 'showPolicyStats') {
				json = require('./json/monindex/showPolicyStats.json')
			}else if(getParam.action == 'showFlowChkChart'){
				json = require('./json/nta/sysHeader/showFlowChkChart.json')
			}else if(getParam.action == 'showAppsTopChart'){
				json = require('./json/nta/sysHeader/showAppsTopChart.json')
			}else if(getParam.action == 'showLogStats'){
				json = require('./json/nta/sysHeader/showLogStats.json')
			}	else if(getParam.action == 'showMOutChart') {
				json = require('./json/indexcharts/nbamoutData.json')
			}	else if(getParam.action == 'showMReportChart') {
				json = require('./json/indexcharts/nbameportChart.json')
			}	else if(getParam.action == 'showMUserChart') {
				json = require('./json/indexcharts/nbashowProtable.json')
			} else if(getParam.action == 'showAdminListName') {
				json = require('./json/indexcharts/nbaUserList.json')
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'adminSet') {
			let json = '';
			if(getParam.action == 'showAdminConf') {
				json = require('./json/indexcharts/adminconf.json')
			} else if (getParam.action == 'upload2FACert') {
				json = require('./json/sysconf/adminsetupdata.json')
			}
			res.send(json);
		}
		else if(getParam.controller == 'menu') {
			let json = '';
			if(getParam.action == 'menuTree') {
				var admin = 'fa18c52981606ff872097d3118dac83c';
				var sec = '5b63abb4fc706cc5dnda8b4d3b50d15b';
				var adt = '5b73abb4fc706cc5d7da8b4d3b50d15b';
				if(psotParam.token == admin) {
					if(psotParam.env =='tac'){
						json = require('./json/login/tacMenuTree.json');
					}else if(psotParam.env == 'nbg'){
						json = require('./json/login/nbgMenuTree.json');
					}else if(psotParam.env == 'nta'){
						json = require('./json/login/ntaMenuTree.json');
					}else if(psotParam.env == 'nba'){
						json = require('./json/login/nbaMenuTree.json');
					}else if(psotParam.env == 'dmc'){
						json = require('./json/login/dmcMenuTree.json');
					 }else{
						json = require('./json/equipment/menuTree.json');
					}
				} else if(psotParam.token == sec) {
					json = require('./json/login/secTree.json');
				} else if(psotParam.token == adt) {
					json = require('./json/login/adtTree.json');
				} else {
					return { success: false, msg: '请输入正确的用户名或密码！' }
				}
			}
			res.send(json);
		}
		else if(getParam.controller == 'device') {
			let json = '';
			if(getParam.action == 'showDeviceList') {
				if(psotParam.zoneID != '5') {
					json = require('./json/configure/device1.json');
				} else {
					json = require('./json/configure/device.json');
				}

			}
			else if(getParam.action == 'showCfgLinkDev') {
				json = require('./json/mconfig/showCfgLinkDev.json');
			}
			res.send(json);
		}
		else if(getParam.controller == 'confBlacklist') {
			let json = '';
			if(getParam.action == 'showWanBlackList') {
				if(psotParam.status == 'Y') {
					json = require('./json/configure/aptaddr1.json');
				} else {
					json = require('./json/configure/aptaddr.json');
				}

			}
			if(getParam.action == 'showLanBlackList') {
				json = require('./json/configure/blacklist.json');
			}
			res.send(json);
		}
		else if(getParam.controller == 'blacklist') {
			let json = '';
			if(getParam.action == 'showLanBlackList') {
				json = require('./json/configure/blacklist.json');
			}
			res.send(json);
		}
		else if(getParam.controller == 'confWhitelist') {
			let json = '';
			if(getParam.action == 'showLanWhiteList') {
				json = require('./json/configure/whitelist.json');
			}
			res.send(json);
		}
		else if(getParam.controller == 'log') {
			let json = '';
			if(getParam.action == 'showDevicelog') {
				json = require('./json/admlog/device.json');
			} else if(getParam.action == 'showPolicylog') {
				json = require('./json/admlog/policylog.json');
			}
			else if(getParam.action == 'showControllog') {
				json = require('./json/admlog/controllog.json');
			}
			else if(getParam.action == 'showAuditlog') {
				json = require('./json/admlog/auditlog.json');
			}
			res.send(json);
		}
		else if(getParam.controller == 'confZoneManage') {
			let json = '';
			if(getParam.action == 'showZoneTree') {
				if(psotParam.id == 5) {
					json = require('./json/admlog/zonetree1.json');
				} else if(psotParam.id == 10) {
					json = require('./json/admlog/zonetree2.json');
				} else {
					json = require('./json/admlog/zonetree.json');
				}

			} else if(getParam.action == 'showZoneList') {
				json = require('./json/admlog/zonelist.json');
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'confIPAddrManage') {
			let json = '';
			if(getParam.action == 'showIPSubNetAddr') {
				if(psotParam.orgID == 1) {
					json = require('./json/configure/subnet.json');
				} else {
					json = require('./json/configure/subnet1.json');
				}

			}
			else if(getParam.action == 'queryIPAddr') {
				json = require('./json/configure/queryIPAddr.json');
			}
			else if(getParam.action == 'exportIPSubNetAddr') {
				json = require('./json/temporary/file.json');
			}
			else if(getParam.action == 'showAllocSubnet') {
				json = require('./json/configure/showAllocSubnet.json');
			}
			else if(getParam.action == 'showIPAddrList') {
				json = Mock.mock({
					"success": true,
					"total": "1",
					'data|256': [{
						'id|+1': 1,
						"subnetID": 6,
						"subnet": "192.168.12.0",
						"ipaddr": "192.168.12.2",
						"macaddr": "00:50:56:8A:51:57",
						"mngState": "unassigned",
						"validType": "forever",
						"expireTime": 0,
						"buisUsgID": "3",
						"buisUsg": "服务器",
						"devTypeID": "5",
						"devType": "个人电脑",
						"user": "张三",
						"phone": "13823568746",
						"location": "一楼大厅",
						"createTime": "2022-04-26 01:22:12",
						"updateTime": "2022-04-25 18:19:33"
					}]
				})
				res.send(json);
				return false;
				json = require('./json/configure/showIPAddrList.json');
			}
			else if(getParam.action == 'showPlanIPNetAddrList') {
				if(psotParam.leaf == 'N') {
					json = require('./json/configure/addrplan.json');
				} else {
					json = require('./json/configure/addrplan.json');
				}
			}
			else if(getParam.action == 'showIPAddrApplication') {
				json = require('./json/monitor/showIPAddrApplication.json');
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'confIPOrderManage') {
			let json = '';
			if(getParam.action == 'applicationStat') {
				json = require('./json/resmngt/applicationStastics.json');
			} else if(getParam.action == 'showIPAllocFlow') {
				json = require('./json/resmngt/checkIPAllocApply.json');
			} else if(getParam.action == 'approvalStat') {
				json = require('./json/resmngt/approvalStast.json');
			} else if(getParam.action == 'showIPAllocApply') {
				json = require('./json/monitor/showIPAddrApplication.json');
			} else if(getParam.action == 'showSubnet') {
				json = require('./json/resmngt/showSubnet.json');
			}
			else if(getParam.action == 'showIPRecycleApply') {
				json = require('./json/resmngt/showIPRecycleApply.json');
			}
			else if(getParam.action == 'showIPChangeApply') {
				json = require('./json/resmngt/showIPChangeApply.json');
			}
			else if(getParam.action == 'showIPChangeFlow') {
				json = require('./json/resmngt/showIPChangeFlow.json');
			}
			else if(getParam.action == 'showIPRecycleFlow') {
				json = require('./json/resmngt/showIPRecycleFlow.json');
			}
			else if(getParam.action == 'preAllocIPAddr') {
				json = require('./json/resmngt/preAllocIPAddr.json');
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'confLog') {
			let json = '';
			if(getParam.action == 'showLogReport') {
				json = require('./json/sysconf/showLogReport.json');
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'confsub') {
			let json = '';
			if(getParam.action == 'showSubTree') {
				json = require('./json/configure/subtree.json');
			}
			else {
			}
			res.send(json);
		}
		else if(getParam.controller == 'assetMapping') {
			let json = '';
			if(getParam.action == 'showAssetClassify') {
				json = require('./json/admlog/assettree.json');
			}
			else if (getParam.action == 'getSnmpModelList') {
				json = require('./json/monitor/showSnmpModeList.json');
			}
			else if (getParam.action == 'showSnmpTempList') {
				json = require('./json/monitor/showSnmpTempList.json');
			}
			else if(getParam.action == 'showAssetList') {
				json = require('./json/admlog/assetlist.json');
			}
			else if(getParam.action == 'showIdentifyConf') {
				json = require('./json/sysconf/assetIdentification.json');
			}
			else if(getParam.action == 'showAssetTypeList') {
				json = require('./json/sysconf/showAssetTypeList.json');
			}
			else if(getParam.action == 'showAssetGroupList') {
				json = require('./json/sysconf/showAssetGroupList.json');
			}
			else if(getParam.action == 'showMonitorTask') {
				json = require('./json/temporary/montasktable.json');
			}
			else if(getParam.action == 'showMonitorSituation') {
				json = require('./json/temporary/moncard.json');
			}
			else if(getParam.action == 'showVioOutline') {
				json = require('./json/analyse/illout.json')
			}
			else if(getParam.action == 'showVioNetcross') {
				json = require('./json/analyse/series.json')
			}
			else if(getParam.action == 'showVioInline') {
				json = require('./json/analyse/showVioInline.json')
			}
			else if(getParam.action == 'showVioInSummary') {
				json = require('./json/analyse/showVioInSummary.json')
			}
			else if(getParam.action == 'showVioSrvSummary') {
				json = require('./json/analyse/visrvsummary.json')
			}
			else if(getParam.action == 'showVioService') {
				json = require('./json/analyse/showVioService.json')
			}
			else if(getParam.action == 'filterAssetList') {
				json = require('./json/analyse/assetsfillter.json')
			}
			else if(getParam.action == 'filterVioOutline') {
				json = require('./json/analyse/illoutfillter.json')
			}
			else if(getParam.action == 'filterVioInline') {
				json = require('./json/analyse/illinnfillter.json')
			}
			else if(getParam.action == 'filterVioNetcross') {
				json = require('./json/analyse/seriesfillter.json')
			}
			else if(getParam.action == 'filterVioService') {
				json = require('./json/analyse/serverfillter.json')
			}
			else if(getParam.action == 'showResource') {
				json = require('./json/analyse/resmaptable.json')
			}
			else if(getParam.action == 'showMatrix') {
				json = require('./json/analyse/showMatrix.json')
			}
			else if(getParam.action == 'showProbeDetail') {
				json = require('./json/analyse/showProbeDetail.json')
			}
			else if(getParam.action == 'showResourceSummary') {
				json = require('./json/analyse/resmapsummary.json')
			} else if(getParam.action == 'showRiskAnalysis') {
				json = require('./json/analyse/resrisk.json')
			} else if(getParam.action == 'filterRiskAnalysis') {
				json = require('./json/analyse/resriskfilter.json')
			} else if(getParam.action == 'showRiskPercepCfg') {
				json = require('./json/monitor/riskperce.json')
			}
			else if(getParam.action == 'showSwitchDiscovery') {
				json = require('./json/monitor/showSwitchDiscovery.json')
			}
			else if(getParam.action == 'getSwitchlist') {
				json = require('./json/monitor/switchlist.json')
			}
			else if(getParam.action == 'showSwitchDetail') {
				json = require('./json/monitor/showSwitchDetail.json')
			}
			else if(getParam.action == 'showPortTerm') {
				json = require('./json/monitor/showPortTerm.json')
			}
			else if(getParam.action == 'showPortMAC') {
				json = require('./json/monitor/showPortMAC.json')
			}
			else if(getParam.action == 'getSwitchVenderList') {
				json = require('./json/monitor/venderList.json')
			}
			else if(getParam.action == 'showTopology') {
				json = require('./json/monitor/showTopo.json')
			}
			else if(getParam.action == 'showTopoList') {
				json = require('./json/monitor/showTopoList.json')
			}
			else if(getParam.action == 'getSwitchip') {
				json = require('./json/monitor/showswitchip.json')
			}
			else if(getParam.action == 'getPortName') {
				json = require('./json/monitor/getProtName.json')
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'confApiAuthorize') {
			let json = '';
			if(getParam.action == 'showApiAuthorize') {
				json = require('./json/admlog/authorize.json');
			} else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'confAuthority') {
			let json = '';
			if(getParam.action == 'showAuthority') {
				json = require('./json/sysconf/showAuthority.json');
			}
			else if(getParam.action == 'showAuthorityContent') {
				json = require('./json/sysconf/showAuthorityContent.json');
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'confOrgManage') {
			let json = '';
			if(getParam.action == 'showOrgTree') {
				json = require('./json/resmngt/mechanism.json');
			} else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'confBusinessUsage') {
			let json = '';
			if(getParam.action == 'showBusinessUsage') {
				json = require('./json/resmngt/showBusinessUsage.json');
			} else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'monitorManage') {
			let json = '';
			if(getParam.action == 'showGlobalPortConf') {
				json = require('./json/temporary/outtoptable.json');
			} else if(getParam.action == 'showOutlineConf') {
				json = require('./json/temporary/outableother.json');
			} else if(getParam.action == 'showNetcrossCfg') {
				json = require('./json/temporary/serialine.json');
			} else if(getParam.action == 'showMonitorCfg') {
				json = require('./json/temporary/violation.json');
			} else if(getParam.action == 'getOutlineAllCfg') {
				json = require('./json/temporary/setselect.json');
			} else if(getParam.action == 'getPortsListName') {
				json = require('./json/temporary/protslist.json');
			}
			else if(getParam.action == 'getPortsListFilter') {
				json = require('./json/temporary/protslist.json');
			}
			else if(getParam.action == 'getNcInfList') {
				json = require('./json/monitor/trunklist.json')
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'confResField') {
			let json = '';
			if(getParam.action == 'showResField') {
				json = require('./json/sysconf/showResField.json');
			} else if(getParam.action == 'showResFieldList') {
				if(psotParam.id == '1') {
					json = require('./json/sysconf/showResFieldList.json');
				} else{
					json = require('./json/sysconf/showResFieldList1.json');
				} 
				
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'mtaConf') {
			let json = '';
			if(getParam.action == 'showLocalBackup') {
				json = require('./json/temporary/tenancetable.json')
			}
			else if(getParam.action == 'exportBackupConf') {
				if(psotParam.op == 'export') {
					json = require('./json/temporary/exportBackupConf.json')
				} else if(psotParam.op == 'rdnext') {
					json = require('./json/temporary/nocode.json')
				} else if(psotParam.op == 'dnload') {
					json = require('./json/temporary/file.json')
				}
			}
			else if(getParam.action == 'showBackupConf') {
				json = require('./json/sysmain/showBackupConf.json')
			}
			else if(getParam.action == 'loadLocalBackup') {
				json = require('./json/temporary/loadlocalbackup.json')
			}
			else if(getParam.action == 'checkImportFinished') {
				json = require('./json/temporary/finish.json')
			}
			else if(getParam.action == 'checkResetFinished') {
				json = require('./json/temporary/finish.json')
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'probeManage') {
			let json = '';
			if(getParam.action == 'showScriptCfg') {
				json = require('./json/temporary/scrproform.json')
			}
			else if(getParam.action == 'showScriptDeploy') {
				json = require('./json/temporary/scrprotable.json')
			}
			else if(getParam.action == 'showAgenCfg') {
				json = require('./json/temporary/terproform.json')
			}
			else if(getParam.action == 'showAgentMakeList') {
				json = require('./json/temporary/terprotable.json')
			}
			else if(getParam.action == 'showAgentProbeList') {
				json = require('./json/temporary/probelist.json')
			}
			else if(getParam.action == 'getUninstallCode') {
				json = require('./json/temporary/uninstall.json')
			}
			else if(getParam.action == 'downloadScript') {
				json = require('./json/temporary/down.json')
			}
			else if(getParam.action == 'agentMakeOperate') {
				json = require('./json/temporary/down.json')
			}
			else if(getParam.action == 'agentPkgUpload') {
				json = require('./json/temporary/finish.json')
			}
			else if(getParam.action == 'filterAgentProbeList') {
				json = require('./json/probers/teprobefillter.json')
			}
			else if(getParam.action == 'showHrdprbCfg') {
				json = require('./json/probers/hdrprbCfg.json')
			}
			else if(getParam.action == 'showHrdprbList') {
				json = require('./json/probers/hdprobelist.json')
			}
			else if(getParam.action == 'showHrdprbUpgrade') {
				json = require('./json/probers/hdprobeuplist.json')
			}
			else if(getParam.action == 'showRegisterCfg') {
				json = require('./json/prbmgt/devreg.json')
			}
			else if(getParam.action == 'showHrdprbAssets') {
				json = require('./json/prbmgt/chkinfo.json')
			}
			else if(getParam.action == 'filterHrdprbAssets') {
				json = require('./json/prbmgt/chkinfofilters.json')
			}
			else if(getParam.action == 'setRegisterCfg') {
				json = require('./json/prbmgt/setRegisterCfg.json')
			}
			else if(getParam.action == 'syncRegister') {
				json = require('./json/prbmgt/syncRegister.json')
			}
			else if(getParam.action == 'showHrdprbOutlineCfg') {
				json = require('./json/prbmgt/getOutConfig.json')
			}
			else if(getParam.action == 'showHrdprbMonitorCfg') {
				json = require('./json/prbmgt/showMonitorCfg.json')
			}
			else if(getParam.action == 'showHrdprbBasic') {
				json = require('./json/prbmgt/hdprbbase.json')
			}
			else if(getParam.action == 'showHrdprbConfInfo') {
				json = require('./json/probers/hrdprbConfInfo.json')
			}
			else if(getParam.action == 'showHrdprbMonitorInfo') {
				json = require('./json/probers/hdprbmonData.json')
			}
			else if(getParam.action == 'showAutoLoginInfo') {
				json = require('./json/prbmgt/historypush.json')
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'adminLog') {
			let json = '';
			if(getParam.action == 'show') {
				json = require('./json/admlog/action.json')
			}
			else if(getParam.action == 'showmodule') {
				json = require('./json/sysmain/showmouule.json')
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'central') {
			let json = '';
			if(getParam.action == 'assets') {
				json = require('./json/central/assets.json');
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'analyze') {
			let json = '';
			if(getParam.action == 'showAssetsBaseinfo') {
				json = require('./json/central/showAssetsBaseinfo.json');
			}
			if(getParam.action == 'showAssetsCtrlinfo') {
				json = Mock.mock({
					"success": true,
					"total": "50",
					'data|50': [{
						'id|+1': 1,
						"ctrlResult": "pass",
						"ctrlState": "white",
						"regState": "verify",
						"macaddr": "xx:xx:xx:xx:xx:xx",
						"ipaddr": "x.x.x.x",
						"name": "zhangsan-PC",
						"systypeID|+1": 2,
						"systype": "Windows",
						"devtypeID|+1": 2,
						"devtype": "个人电脑",
						"agentTypeID|+1": 2,
						"agentType": "Windows",
						"agentVersion": "v3.0.954",
						"responsible": "张三",
						"authPolicy": "xxx",
						"ctrlPolicy": "xx",
						"scheckPolicy": "xxx",
						"scheckResult": "pass",
						"authUser": "认证用户",
						"blockReason": "xxx",
						"devip": "192.168.12.1"
					}]
				})
				res.send(json);
				return false;
				json = require('./json/central/showAssetsCtrlinfo.json');
			}
			if(getParam.action == 'showResourceStats') {
				json = require('./json/central/showResourceStats.json');
			}
			if(getParam.action == 'showResourceInfo') {
				json = require('./json/central/showResourceInfo.json');
			}
			if(getParam.action == 'showDevtype') {
				json = require('./json/central/showDevtype.json');
			}
			if(getParam.action == 'showSystype') {
				json = require('./json/central/showSystype.json');
			}
			if(getParam.action == 'showAgentType') {
				json = require('./json/central/showAgentType.json');
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'confMaintain') {
			let json = '';
			if(getParam.action == 'showConfig') {
				json = require('./json/sysmain/showConfig.json');
			}
			else if(getParam.action == 'showRecovery') {
				json = require('./json/sysmain/showRecovery.json');
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'radnas') {
			let json = '';
			if(getParam.action == 'show') {
				json = require('./json/temporary/nastable.json');
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'confAssetManage') {
			let json = '';
			if(getParam.action == 'showAsset') {
				json = Mock.mock({
					"success": true,
					"total": "50",
					'data|50': [{
						'id|+1': 1,
						"origin": "record",
						"zoneID": 1,
						"zone": "北京市",
						"fullZone": "北京市/海淀区",
						"orgID": 1,
						"org": "北京市",
						"fullOrg": "北京市/海淀区",
						"assetTypeID": 1,
						"assetType": "PC",
						"ipaddr": "192.168.100.100",
						"macaddr": "00:0C:29:77:57:09",
						"user": "zhangsan",
						"phone": "18234789704",
						"assetModel": "1508",
						"buisUsg": "监控设备",
						"location": "一楼",
						"notes": "监控设备"
					}]
				})
			}
			else if(getParam.action == 'applicationStat') {
				json = require('./json/confAssetManage/applicationStat.json');
			}
			else if(getParam.action == 'approvalStat') {
				json = require('./json/confAssetManage/approvalStat.json');
			}
			else if(getParam.action == 'showSignINFlow') {
				json = require('./json/confAssetManage/showSignINFlow.json');
			}
			else if(getParam.action == 'showSignChangeFlow') {
				json = require('./json/confAssetManage/showSignChangeFlow.json');
			}
			else if(getParam.action == 'queryAsset') {
				json = require('./json/confAssetManage/queryAsset.json');
			}
			else if(getParam.action == 'showSignOUTFlow') {
				json = require('./json/confAssetManage/showSignOUTFlow.json');
			}
			else if(getParam.action == 'preAllocIPAddr') {
				json = require('./json/confAssetManage/preAllocIPAddr.json');
			}
			else if(getParam.action == 'showSignOUTApply') {
				json = Mock.mock({
					"success": true,
					"total": "50",
					'data|50': [{
						'id|+1': 1,
						"orderState": "unprocessed",
						"orderID": "ASxxx",
						"macaddr": "AA-BB-CC-DD-EE-FF",
						"ipaddr": "192.168.100.100",
						"zone": "北京市",
						"org": "北京市",
						"user": "zhangsan",
						"phone": "15112345678",
						"assetType": "PC",
						"assetModel": "1508",
						"buisUsg": "办公设备",
						"location": "一楼",
						"vlan": "12",
						"notes": "备注",
						"applicant": "申请人",
						"approver": "审批人",
					}]
				})
			}
			else if(getParam.action == 'showSignChangeApply') {
				json = Mock.mock({
					"success": true,
					"total": "50",
					'data|50': [{
						'id|+1': 1,
						"orderState": "unprocessed",
						"orderID": "ASxxx",
						"macaddr": "AA:BB:CC:DD:EE:FF",
						"ipaddr": "192.168.10.1",
						"zone": "北京市",
						"org": "北京市",
						"assetType": "PC",
						"user": "zhangsan",
						"phone": "15112345678",
						"assetModel": "1508",
						"buisUsg": "办公设备",
						"location": "一楼",
						"vlan": "12",
						"notes": "备注",
						"applicant": "申请人",
						"approver": "审批人",
					}]
				})
			}
			else if(getParam.action == 'showSignINApply') {
				json = Mock.mock({
					"success": true,
					"total": "50",
					'data|50': [{
						'id|+1': 1,
						"orderState": "unprocessed",
						"orderID": "ASxxx",
						"zoneID": 1,
						"zone": "北京市",
						"fullZone": "北京市/海淀区",
						"orgID": 1,
						"org": "北京市",
						"fullOrg": "北京市/海淀区",
						"user": "zhangsan",
						"phone": "15112345678",
						"macaddr": "AA-BB-CC-DD-EE-FF",
						"assetType": "PC",
						"assetModel": "1508",
						"buisUsg": "办公设备",
						"location": "一楼",
						"vlan": "12",
						"notes": "备注",
						"applicant": "申请人",
						"approver": "审批人",
					}]
				})
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'mtaData') {
			let json = '';
			if(getParam.action == 'showBackupConf') {
				json = require('./json/sysmain/mtadatconf.json');
			}
			else if(getParam.action == 'exportData') {
				if(psotParam.op == 'export') {
					json = require('./json/temporary/exportBackupConf.json')
				} else if(psotParam.op == 'rdnext') {
					json = require('./json/temporary/nocode.json')
				} else if(psotParam.op == 'dnload') {
					json = require('./json/temporary/file.json')
				}
			}
			else if(getParam.action == 'importData') {
				json = require('./json/temporary/importBackupConf.json')
			}
			else if(getParam.action == 'checkImportFinished') {
				json = require('./json/temporary/finish.json')
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'userSync') {
			let json = '';
			if(getParam.action == 'showUserSync') {
				json = require('./json/userSync/showUserSync.json');
			}
			else if(getParam.action == 'getSyncServerType') {
				json = require('./json/userSync/getSyncServerType.json');
			}
			else if(getParam.action == 'getSyncUserAttr') {
				json = require('./json/userSync/getSyncUserAttr.json');
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'mtaOPlog') {
			let json = '';
			if(getParam.action == 'showBackupConf') {
				json = require('./json/sysmain/logback.json');
			}
			else if(getParam.action == 'exportData') {
				if(psotParam.op == 'export') {
					json = require('./json/temporary/exportBackupConf.json')
				} else if(psotParam.op == 'rdnext') {
					json = require('./json/temporary/nocode.json')
				} else if(psotParam.op == 'dnload') {
					json = require('./json/temporary/file.json')
				}
			}
			else if(getParam.action == 'downloadFile') {
				if(psotParam.op == 'export') {
					json = require('./json/temporary/exportBackupConf.json')
				} else if(psotParam.op == 'rdnext') {
					json = require('./json/temporary/nocode.json')
				} else if(psotParam.op == 'dnload') {
					json = require('./json/temporary/file.json')
				}
			}
			else if (getParam.action == 'importData') {
				json = require('./json/temporary/importBackupConf.json')
			}
			else if(getParam.action == 'checkImportFinished') {
				json = require('./json/temporary/finish.json')
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'userList') {
			let json = '';
			if(getParam.action == 'showUserInfo') {
				json = require('./json/cfgmngt/showUserInfo.json');
			}
			else if(getParam.action == 'getUserType') {
				json = require('./json/cfgmngt/getUserType.json')
			}
			else {

			}
			res.send(json);
		}
		else if(getParam.controller == 'mtaDebug'){
			let json = ''
			if(getParam.action == 'getPageContent') {
				json = require('./json/sysmain/remote.json');
			}
			else if(getParam.action == 'showPcapList'){
				json = require('./json/sysmain/pcapList.json');
			}
			else if(getParam.action == 'exportAgentLog'){
				if(psotParam.op == 'export') {
					json = require('./json/temporary/exportBackupConf.json')
				} else if(psotParam.op == 'rdnext') {
					json = require('./json/temporary/nocode.json')
				} else if(psotParam.op == 'dnload') {
					json = require('./json/temporary/file.json')
				}
			}
			res.send(json)
		}
		else if(getParam.controller == 'netcrossEvent'){
			let json = ''
			if(getParam.action == 'show') {
				json = require('./json/illevent/netseriestable.json');
			} else if (getParam.action == 'showDetails') {
				json = require('./json/illevent/netseriesdetails.json');
			}
			res.send(json)
		}
		else if(getParam.controller == 'outlineEvent'){
			let json = ''
			if(getParam.action == 'show') {
				json = require('./json/illevent/illoutline.json');
			} else if (getParam.action == 'showDetails') {
				json = require('./json/illevent/illoutlinedetails.json');
			}
			res.send(json)
		}
		else if(getParam.controller == 'clientEvent'){
			let json = ''
			if(getParam.action == 'show') {
				json = require('./json/illevent/nacreporttable.json');
			}
			res.send(json)
		}
		else if(getParam.controller == 'userOutlineConf'){
			let json = ''
			if(getParam.action == 'show') {
				json = require('./json/monconf/outmconftable.json');
			} else if(getParam.action == 'showUserCombox') {
				json = require('./json/indexcharts/nbaUserList.json')
			} 
			res.send(json)
		}
		else if(getParam.controller == 'warnConf'){
			let json = ''
			if(getParam.action == 'showSmsConf') {
				json = require('./json/monconf/showSmsConf.json');
			} else if (getParam.action == 'showWarnConf') {
				json = require('./json/monconf/showWarnConf.json');
			} else if (getParam.action == 'showSmsTypeList') {
				json = require('./json/monconf/showSmsTypeList.json');
			} else if (getParam.action == 'showMailConf') {
				json = require('./json/monconf/alertnotice.json');
			} else if (getParam.action == 'testMailSend') {
				json = require('./json/monconf/testmailsend.json');
			}
			res.send(json)
		}
		else if(getParam.controller == 'areaIpConf'){
			let json = ''
			if(getParam.action == 'show') {
				json = require('./json/monconf/iaddrmap.json');
			}
			res.send(json)
		}
		else if(getParam.controller == 'offlineEvent'){
			let json = ''
			if(getParam.action == 'show') {
				json = require('./json/monconf/offoutline.json');
			}
			res.send(json)
		}
		else if(getParam.controller == 'fileLeakEvent'){
			let json = ''
			if(getParam.action == 'show') {
				json = require('./json/monconf/fileleak.json');
			}
			res.send(json)
		}
		else if(getParam.controller == 'cemsReportEvent'){
			let json = ''
			if(getParam.action == 'show') {
				json = require('./json/illevent/edpreport.json');
			}
			res.send(json)
		}
		else if(getParam.controller == 'whiteConf'){
			let json = ''
			if(getParam.action == 'showConf') {
				json = require('./json/monconf/outwhite.json');
			}
			res.send(json)
		}
		else if(getParam.controller == 'sysDeploy'){
			let json = ''
			if(getParam.action == 'showSysCert') {
				json = require('./json/sysconf/showsyscert.json');
			} else if (getParam.action == 'uploadSysCert') {
				json = require('./json/temporary/finish.json');
			}else if (getParam.action == 'showDepartment'){
				json = require('./json/nta/sysDeploy/showDepartment.json');
			}else if (getParam.action == 'showDevRegist'){
				json = require('./json/nta/sysDeploy/showDevRegist.json');
			}else if(getParam.action == 'setDevRegist'){
				json = require('./json/nta/sysDeploy/setDevRegist.json');
			}else if(getParam.action == 'getRegistPageContent'){
				json = require('./json/nta/sysDeploy/getRegistPageContent.json');
			}
			res.send(json)
		}
		else if(getParam.controller == 'confDot1xPolicy'){
			let json = ''
			if(getParam.action == 'showDot1xPolicy') {
				json = require('./json/confDot1xPolicy/showDot1xPolicy.json');
			} else if (getParam.action == 'uploadSysCert') {
				json = require('./json/temporary/finish.json');
			}
			res.send(json)
		}
		else if(getParam.controller == 'confregVerify'){
			let json = ''
			if(getParam.action == 'showpolicy') {
				json = require('./json/confregVerify/showpolicy.json');
			} else if (getParam.action == 'uploadSysCert') {
				json = require('./json/temporary/finish.json');
			}
			res.send(json)
		}else if(getParam.controller == 'sysMonitor'){
			sysMonitor(getParam, psotParam, res)
		}else if(getParam.controller == 'sysAnalysis'){
			sysAnalysis(getParam, psotParam, res)
		}else if(getParam.controller == 'confMirror'){
			confMirror(getParam, psotParam, res)
		}else if(getParam.controller == 'confReport'){
			confReport(getParam, psotParam, res)
		}
		else if(getParam.controller == 'confAdmissionPolicy'){
			let json = ''
			if(getParam.action == 'showadmpolicy') {
			 json = require('./json/confAdmissionPolicy/showadmpolicy.json');
			}else if (getParam.action == 'showadmpolicydata') {
			 json = require('./json/confAdmissionPolicy/showadmpolicydata.json');
			}
			res.send(json)
		 }
		else if(getParam.controller == 'confCheckPolicy'){
			let json = ''
			if(getParam.action == 'showCheckPolicy') {
			 json = require('./json/confCheckPolicy/showCheckPolicy.json');
			}
			res.send(json)
		}
		else if(getParam.controller == 'confAccessPolicy'){
			let json = ''
			if(getParam.action == 'showAccessPolicy') {
			 json = require('./json/confAccessPolicy/showAccessPolicy.json');
			}else if (getParam.action == 'showAccessPolicyDate') {
				json = require('./json/confAccessPolicy/showAccessPolicyDate.json');
			 }
			res.send(json)
		} else if (getParam.controller == 'logAudit') {
			let json = ''
			if(getParam.action == 'showTraffic') {
			 json = Mock.mock({
				"success": true,
				"total": "50",
				'data|50': [{
					'id|+1': 1,
					"start_time": "2003-05-16 17:53:12",
					"end_time": "2003-05-16 17:53:12",
					"sip": '192.1168.122.122',
					"zone": "北京市",
					"fullZone": "北京市/海淀区",
					"orgID": 1,
					"org": "北京市",
					"fullOrg": "北京市/海淀区",
					"user": "zhangsan",
					"phone": "15112345678",
					"macaddr": "AA-BB-CC-DD-EE-FF",
					"assetType": "PC",
					"assetModel": "1508",
					"buisUsg": "办公设备",
					"location": "一楼",
					"vlan": "12",
					"notes": "备注",
					"applicant": "申请人",
					"approver": "审批人",
				}]
			})
			} else if (getParam.action == 'showWebVisit') {
				json = Mock.mock({
					"success": true,
					"total": "50",
					'data|50': [{
						'id|+1': 1,
						"time": "2003-05-16 17:53:12",
						"end_time": "2003-05-16 17:53:12",
						"sip": '192.1168.122.122',
						"zone": "北京市",
						"fullZone": "北京市/海淀区",
						"orgID": 1,
						"org": "北京市",
						"fullOrg": "北京市/海淀区",
						"user": "zhangsan",
						"phone": "15112345678",
						"macaddr": "AA-BB-CC-DD-EE-FF",
						"assetType": "PC",
						"assetModel": "1508",
						"buisUsg": "办公设备",
						"location": "一楼",
						"vlan": "12",
						"notes": "备注",
						"applicant": "申请人",
						"approver": "审批人",
					}]
				})
			}
			res.send(json)
		}
		else if(getParam.controller == 'ntaAlarmLog'){
			alarmditFn(getParam, psotParam, res)
		}else if(getParam.controller == 'confSignature'){
			let json = ''
			if(getParam.action == 'showSignature'){
				json = require('./json/cfgmngt/showSign.json');
			}
			else if(getParam.action == 'showSigTemplate'){
				json = require('./json/cfgmngt/showSignature.json');
			}else if(getParam.action == 'SignatureBatchTemplate'){
				json = require('./json/cfgmngt/signatureBatchTemplate.json');
			} else if(getParam.action == 'showSignatureField'){
				json = require('./json/cfgmngt/showSignatureField.json');
			}else if(getParam.action == 'showSignatureBuisusg'){
				json = require('./json/cfgmngt/showSignatureBuisusg.json');
			}
			
			res.send(json)
		} else if(getParam.controller == 'confPolicy'){
			dmcmconfigFn(getParam, psotParam, res)
		} else if(getParam.controller == 'confDevice'){
			confDevice(getParam, psotParam, res)
		}else if(getParam.controller == 'confRemoteCmd'){
			ctrlcmd(getParam, psotParam, res)
		}else if(getParam.controller == 'confCenterManage'){
			ruleinfo(getParam, psotParam, res)
		}else if(getParam.controller == 'confDevice'){
			if(getParam.action == 'showSynclist'){
				let json = ''
				json = require('./json/dmc/ctrlcmd/showSynclist.json');
				res.send(json)
			}
		}else if(getParam.controller == 'confAlarm'){
			alarmdt(getParam, psotParam, res)
		}
		else if(getParam.controller == 'confHA'){
			if(getParam.action == 'show'){
				let json = ''
				json = require('./json/sysconf/show.json');
				res.send(json)
			}
		}
		else {
			
		}

	},

}


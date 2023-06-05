import React, { useRef, useState, useEffect } from 'react';
import { LaptopOutlined, HddOutlined,  ClusterOutlined, PlaySquareOutlined, MobileOutlined, CloudServerOutlined, PrinterOutlined, SafetyCertificateOutlined, FileUnknownOutlined, TabletOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { AllApplication } from '@icon-park/react';
import './index.less'

const iconTypeList = (props) => {
    let icon = props?props.toUpperCase():'';
    if(icon == 'PC') {
        return (<i className='iconfont icon-bijibendiannao' style={{ color: '#08c' }} />);
    }
    else if(icon == "SWITCH") {
        return (<ClusterOutlined style={{ color: '#08c' }} />);
    }
    else if(icon == "VM") {
        return <i className='iconfont icon-PCxuniji' style={{ color: '#08c' }}></i>;
    }
    else if(icon == 'CAMERA') {
        return (<i className='iconfont icon-shexiangtou' style={{ color:'#08c' }} />);
    }
    else if(icon == 'CUSTOM') {
        return (<LaptopOutlined style={{ color: '#08c' }} />);
    }
    else if(icon == 'SERVER') {
        return (<HddOutlined style={{ color: '#08c' }} />);
    }
    else if(icon == 'PRINTER') {
        return (<PrinterOutlined style={{ color: '#08c' }} />);
    }
    else if(icon == 'SAFETYDEV') {
        return (<SafetyCertificateOutlined style={{ color: '#08c' }} />);
    }
    else if(icon == 'UNKNOWN') {
        return (<FileUnknownOutlined style={{ color: '#08c' }} />);
    }
    else if(icon == 'VIDEOSERVER') {
        return (<PlaySquareOutlined style={{ color: '#08c' }} />);
    }
    else if(icon == 'TABLET') {
        return (<TabletOutlined style={{ color: '#08c' }} />);
    }
    else if(icon == 'MOBILE') {
        return (<MobileOutlined style={{ color: '#08c' }} />);
    }
    else if(icon == 'THINCLIENT') {
        return (<i className='iconfont icon--kehuduan' style={{ color: '#08c' }}/>);
    }
    else if(icon == 'MOBILEPHONE') {
        return (<i className='asseticon iconfont icon-shouji' style={{ color: '#08c' }}/>);
    }
    else if(icon == 'PAD') {
        return (<i className='asseticon iconfont icon-pad' style={{ color: '#08c' }}/>);
    }
    else if(icon == 'ROUTER') {
        return (<i className='asseticon iconfont icon-luyouqi' style={{ color: '#08c' }} />);
    }
    else if(icon == 'FIREWALL') {
        return (<i className='asseticon iconfont icon-fanghuoqiang' style={{ color:'#08c' }} />);
    }
    else if(icon == 'GAP') {
        return (<FileUnknownOutlined style={{ color:'#08c' }} />);
    }
    else if(icon == 'BASTIONHOST') {
        return (<i className='asseticon iconfont icon-baoleiji' style={{ color:'#08c' }} />);
    }
    else if(icon == 'AUTH') {
        return (<i className='iconfont icon-shenfenrenzheng' style={{ color:'#08c' }} />);
    }
    else if(icon == 'WEBSCAN') {
        return (<i className='iconfont icon-webscan' style={{ color:'#08c' }} />);
    }
    else if(icon == 'DDOSPROTECTION') {
        return (<i className='iconfont icon-kangddos' style={{ color:'#08c' }} />);
    }
    else if(icon == 'LOADBALANCE') {
        return (<i className='iconfont icon-wangluoshebei' style={{ color:'#08c' }} />);
    }
    else if(icon == 'AC') {
        return (<i className='iconfont icon-shangwanghangweiguanlishangwangguanli' style={{ color:'#08c' }} />);
    }
    else if(icon == 'NTC') {
        return (<i className='iconfont icon-liuliangguanli' style={{ color:'#08c' }} />);
    }
    else if(icon == 'UTM') {
        return (<i className='iconfont icon-guanli' style={{ color:'#08c' }} />);
    }
    else if(icon == 'WAF') {
        return (<i className='iconfont icon-waf' style={{ color:'#08c' }} />);
    }
    else if(icon == 'IDS') {
        return (<i className='iconfont icon-ids' style={{ color:'#08c' }} />);
    }
    else if(icon == 'VPN') {
        return (<i className='iconfont icon-vpn' style={{ color:'#08c' }} />);
    }
    else if(icon == 'DLP') {
        return (<i className='iconfont icon-DLPdapingxitong' style={{ color:'#08c' }} />);
    }
    else if(icon == 'DBA') {
        return (<i className='iconfont icon-shujukushenji' style={{ color:'#08c' }} />);
    }
    else if(icon == 'ASSET') {
        return (<i className='iconfont icon-zichanguanli' style={{ color:'#08c' }} />);
    }
    else if(icon == 'VDS') {
        return (<i className='iconfont icon-avds' style={{ color:'#08c' }} />);
    }
    else if(icon == 'SAS') {
        return (<i className='iconfont icon-anquanshenji' style={{ color:'#08c' }} />);
    }
    else if(icon == 'WIRELESS') {
        return (<i className='iconfont icon-luyouqi1' style={{ color:'#08c' }} />);
    }
    else if(icon == 'NAC') {
        return (<i className='iconfont icon-wangluo-' style={{ color:'#1890ff' }} />);
    }
    else if(icon == 'AP') {
        return (<i className='iconfont icon-redian' style={{ color:'#08c' }} />);
    }
    else if(icon == 'APROBE') {
        return (<i className='iconfont icon-liuliangtanzhen' style={{ color:'#08c' }} />);
    }
    else if(icon == 'IPPBX') {
        return (<i className='iconfont icon-yuyinwenjianshibie' style={{ color:'#08c' }} />);
    }
    else if(icon == 'LOGMANAGER') {
        return (<i className='iconfont icon-rizhifenxi' style={{ color:'#08c' }} />);
    }
    else if(icon == 'SAFETY') {
        return (<i className='iconfont icon-anquanguanli' style={{ color:'#1890ff' }} />);
    }
    else if(icon == 'NETWORKDEVICE') {
        return (<i className='iconfont icon-zichan-wangluoshebei' style={{ color:'#08c' }} />);
    }
    else if(icon == 'VMSERVER') {
        return (<i className='iconfont icon-33xunihuapingtaiguanli' style={{ color:'#08c' }} />);
    }
    else if(icon == 'NAS') {
        return (<i className='iconfont icon-naswenjiancunchuNAS' style={{ color:'#08c' }} />);
    }
    else if(icon == 'MCUSERVER') {
        return (<i className='iconfont icon-wulifuwuqi' style={{ color:'#08c' }} />);
    }
    else if(icon == 'ATTENDANCE') {
        return (<i className='iconfont icon-kaoqin' style={{ color:'#08c' }} />);
    }
    else if(icon == 'ADSERVER') {
        return (<i className='iconfont icon-fuwuqi' style={{ color:'#08c' }} />);
    }
    else if(icon == 'LDAPSERVER') {
        return (<i className='iconfont icon-weiwangguanicon-defuben-' style={{ color:'#08c' }} />);
    }
    else if(icon == 'PROXYSERVER') {
        return (<i className='iconfont icon-dailifuwuqi_huaban1' style={{ color:'#1890ff' }} />);
    }
    else if(icon == 'SERIALSERVER') {
        return (<i className='iconfont icon-chuankoushezhi' style={{ color:'#08c' }} />);
    }
    else if(icon == 'PRINTINGSERVER') {
        return (<i className='iconfont icon-print' style={{ color:'#08c' }} />);
    }
    else if(icon == 'FAXSERVER') {
        return (<i className='iconfont icon-chuanzhen' style={{ color:'#08c' }} />);
    }
    else if(icon == 'BIGDATA') {
        return (<i className='iconfont icon-dashuju' style={{ color:'#08c' }} />);
    }
    else if(icon == 'STORAGEDEVICE') {
        return (<i className='iconfont icon-cunchushebei' style={{ color:'#08c' }} />);
    }
    else if(icon == 'AM') {
        return (<i className='iconfont icon-kaoqinji-01' style={{ color:'#08c' }} />);
    }
    else if(icon == 'ATM') {
        return (<i className='iconfont icon-jigouneijiaofei' style={{ color:'#08c' }} />);
    }
    else if(icon == 'UPS') {
        return (<i className='iconfont icon-UPS' style={{ color:'#08c' }} />);
    }
    else if(icon == 'MCU') {
        return (<i className='iconfont icon-shipinhuiyishebei' style={{ color:'#08c' }} />);
    }
    else if(icon == 'CLOUDTERMINAL') {
        return (<CloudServerOutlined style={{ color:'#08c' }} />);
    }
    else if(icon == 'SMARTMETER') {
        return (<i className='iconfont icon-zhinengbaobiao' style={{ color:'#08c' }} />);
    }
    else if(icon == 'POS') {
        return (<i className='iconfont icon-yidongPOSzhongduan' style={{ color:'#08c' }} />);
    }
    else if(icon == 'STORAGEDEVICE') {
        return (<i className='iconfont icon-cunchushebei' style={{ color:'#08c' }} />);
    }
    else if(icon == 'FAX') {
        return (<i className='iconfont icon-chuanzhenji' style={{ color:'#08c' }} />);
    }
    else if(icon == 'SCANNER') {
        return (<i className='iconfont icon-saomiaoyi' style={{ color:'#08c' }} />);
    }
    else if(icon == 'ACT') {
        return (<i className='iconfont icon-menjin' style={{ color:'#08c' }} />);
    }
    else if(icon == 'COM') {
        return (<i className='iconfont icon-shebeijiekou' style={{ color:'#08c' }} />);
    }
    else if(icon == 'VOIP') {
        return (<i className='iconfont icon-nanhaiIPdianhuashenqing' style={{ color:'#08c' }} />);
    }
    else if(icon == 'ONU') {
        return (<i className='iconfont icon-wangluoxitong' style={{ color:'#08c' }} />);
    }
    else if(icon == 'APPSERVER') {
        return (<AllApplication className='appserIcon' theme="outline"  fill="#08c" />);
    }
    else if(icon == 'IPS') {
        return (<i className='iconfont icon-xuniips' style={{ color:'#08c' }} />);
    }
    else if(icon == 'MEDIADEV') {
        return (<MedicineBoxOutlined style={{ color:'#08c' }} />);
    }
    else {
        return (<FileUnknownOutlined style={{ color:'#08c' }} theme="outline" size="18" fill="#08c"  />);
    }
}

export default iconTypeList
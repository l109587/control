import React, { useRef,useState ,useEffect } from 'react';
import { IdcardFilled } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { Tabs } from 'antd';
import { language } from '@/utils/language';
import { Allocationapproval, Cancellationapproval, Changeapproval } from './components';
import { RiEraserFill, RiArrowUpDownLine } from "react-icons/ri";
import { post } from '@/services/https';
import './index.less';
const { TabPane } = Tabs;

export default () => {
    const [countList, setCountList] = useState([{
		"IPAlloc": {
			"unapproved": 0,
			"approved": 0,
			"rejected": 0,
		},
		"IPChange": {
			"unapproved": 0,
			"approved": 0,
			"rejected": 0,
		},
		"IPRecycle": {
			"unapproved": 0,
			"approved": 0,
			"rejected": 0,
		}
	}]);
    useEffect(()=>{
        getCount();
    },[])
    const getCount = ()=>{
        post('/cfg.php?controller=confIPOrderManage&action=approvalStat').then((res) => {
            setCountList(res.data);
        }).catch(() => {
            console.log('mistake')
        })
    }
    return (
        <>
            <ProCard ghost gutter={[13,13]}>
                <ProCard ghost bordered={true}  direction='column' className='topcartinfo'>
                    <ProCard ghost className='topcartinfoupper'>
                            <div className='topcartinfoupperinfo' >
                                <div className='dipflex' >
                                    <div
                                        className='dipfleximg'
                                    >
                                        <IdcardFilled style={{ fontSize: '36px',color:'#FFFFFF'}}/>
                                    </div>
                                    <div>
                                        <div className='uppertitleinfo' >{language('project.resmngt.approval.requestpendingaudit')}</div>
                                    </div>
                                    
                                </div>
                                <div className='rightsize'>{countList.IPAlloc ?countList.IPAlloc.unapproved : 0}</div>
                            </div>
                    </ProCard>
                    <ProCard  ghost className='dipbottomcolro'>
                        <ProCard ghost >
                            <div className='dipflex dipflexleft'>
                                <div>
                                    <div className='bottomcontentnum'>{countList.IPAlloc ?countList.IPAlloc.approved : 0}</div>
                                    <div className='bottomcontenttext'>{language('project.resmngt.approval.approved')}</div>
                                </div>
                            </div>
                        </ProCard>
                        <ProCard ghost >
                            <div className='dipflex dipflexright'>
                                <div>
                                    <div className='bottomcontentnum'>{countList.IPAlloc ?countList.IPAlloc.rejected : 0}</div>
                                    <div className='bottomcontenttext'>{language('project.resmngt.approval.approvalrejected')}</div>
                                </div>
                            </div>
                        </ProCard>
                    </ProCard>
                   
                </ProCard>
                <ProCard ghost bordered={true}  direction='column' className='topcartinfo'>
                    <ProCard ghost className='topcartinfoupper'>
                            <div className='topcartinfoupperinfo'>
                                <div className='dipflex' >
                                    <div
                                        className='dipfleximg'
                                    >
                                        <RiArrowUpDownLine style={{ fontSize: '36px',color:'#FFFFFF'}}/>
                                    </div>
                                    <div>
                                        <div className='uppertitleinfo' >{language('project.resmngt.approval.changependingaudit')}</div>
                                    </div>
                                </div>
                                <div className='rightsize'>{countList.IPChange ?countList.IPChange.unapproved : 0}</div>
                            </div>
                    </ProCard>
                    <ProCard  ghost className='dipbottomcolro'>
                        <ProCard ghost >
                            <div className='dipflex dipflexleft'>
                                <div>
                                    <div className='bottomcontentnum'>{countList.IPChange ?countList.IPChange.approved : 0}</div>
                                    <div className='bottomcontenttext'>{language('project.resmngt.approval.approved')}</div>
                                </div>
                            </div>
                        </ProCard>
                        <ProCard ghost >
                            <div className='dipflex dipflexright'>
                                <div>
                                    <div className='bottomcontentnum'>{countList.IPChange ?countList.IPChange.rejected : 0}</div>
                                    <div className='bottomcontenttext'>{language('project.resmngt.approval.approvalrejected')}</div>
                                </div>
                            </div>
                        </ProCard>
                    </ProCard>
                   
                </ProCard>
                <ProCard ghost bordered={true}  direction='column' className='topcartinfo'>
                    <ProCard ghost className='topcartinfoupper'>
                        <div className='topcartinfoupperinfo'>
                            <div className='dipflex' >
                                <div
                                    className='dipfleximg'
                                >
                                    <RiEraserFill style={{ fontSize: '36px',color:'#FFFFFF'}}/>
                                </div>
                                <div>
                                    <div className='uppertitleinfo' >{language('project.resmngt.approval.cancellationpendingaudit')}</div>
                                </div>
                            </div>
                            <div className='rightsize'>{countList.IPRecycle ?countList.IPRecycle.unapproved : 0}</div>
                        </div>
                    </ProCard>
                    <ProCard  ghost className='dipbottomcolro'>
                        <ProCard ghost>
                            <div className='dipflex dipflexleft'
                            >
                                <div>
                                    <div className='bottomcontentnum'>{countList.IPRecycle ?countList.IPRecycle.approved : 0}</div>
                                    <div className='bottomcontenttext'>{language('project.resmngt.approval.approved')}</div>
                                </div>
                            </div>
                        </ProCard>
                        <ProCard ghost >
                            <div className='dipflex dipflexright'
                            >
                                <div>
                                    <div className='bottomcontentnum'>{countList.IPRecycle ?countList.IPRecycle.rejected : 0}</div>
                                    <div className='bottomcontenttext'>{language('project.resmngt.approval.approvalrejected')}</div>
                                </div>
                            </div>
                        </ProCard>
                    </ProCard>
                   
                </ProCard>
            </ProCard>
            <div className="allocationcard card-container" >
                <Tabs type="card" >
                    <TabPane tab={language('project.resmngt.approval.distributionapproval')} key="1">
                        <Allocationapproval />
                    </TabPane>
                    <TabPane tab={language('project.resmngt.approval.changeapproval')} key="2">
                        <Changeapproval />
                    </TabPane>
                    <TabPane tab={language('project.resmngt.approval.cancellationapproval')} key="3">
                        <Cancellationapproval />
                    </TabPane>
                </Tabs>
            </div>
        </>

      );
}
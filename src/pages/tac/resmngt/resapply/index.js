import React, { useEffect, useState } from 'react';
import { IdcardFilled } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import { Tabs } from 'antd';
import { language } from '@/utils/language';
import { Allocationrequest, Changerequest, Cancellationapply } from './components';
import { RiEraserFill, RiArrowUpDownLine } from "react-icons/ri";
import { post, get } from '@/services/https';
import './index.less';
const { TabPane } = Tabs;
let H = document.body.clientHeight - 143
var clientHeight = H

export default () => {
    const [countList, setCountList] = useState([{
        "IPAlloc": {
            "total": 0,
            "unsubmitted": 0,
            "unapproved": 0,
            "approved": 0,
            "rejected": 0
        },
        "IPChange": {
            "total": 0,
            "unsubmitted": 0,
            "unapproved": 0,
            "approved": 0,
            "rejected": 0
        },
        "IPRecycle": {
            "total": 0,
            "unsubmitted": 0,
            "unapproved": 0,
            "approved": 0,
            "rejected": 0
        },
    }]);
    useEffect(() => {
        getCount();
    }, [])
    const getCount = () => {
        post('/cfg.php?controller=confIPOrderManage&action=applicationStat').then((res) => {
            setCountList(res.data);
        }).catch(() => {
            console.log('mistake')
        })
    }
    return (
        <div className='resapplybox'>
            <ProCard ghost gutter={[13, 13]}>
                <ProCard ghost bordered={true} direction='column' className='topcartinfo'>
                    <ProCard ghost className='rtopcartinfoupper'>
                        <ProCard ghost colSpan={14} >
                            <div className='dipflex' >
                                <div
                                    className='dipfleximg'
                                >
                                    <IdcardFilled style={{ fontSize: '36px', color: '#FFFFFF' }} />
                                </div>
                                <div>
                                    <div className='uppertitleinfo' >{language('project.resmngt.resapply.totalallocationrequests')}<span>{countList.IPAlloc ? countList.IPAlloc.total : 0}</span></div>
                                </div>
                            </div>
                        </ProCard>
                        <ProCard ghost >
                            <div className='dipflex dipflexright'>
                                <div>
                                    <div className='topcontenthight topcontentinfo'><span className='signintext'>{language('project.resmngt.resapply.approved')}</span><span className='signinnum'>{countList.IPAlloc ? countList.IPAlloc.approved : 0}</span></div>
                                    <div className='topcontentinfo'><span className='signintext'>{language('project.resmngt.resapply.approvalrejected')}</span><span className='signinnum'>{countList.IPAlloc ? countList.IPAlloc.rejected : 0}</span></div>
                                </div>
                            </div>
                        </ProCard>
                    </ProCard>
                    <ProCard ghost className='dipbottomcolro'>
                        <ProCard ghost >
                            <div className='dipflex dipflexleft'>
                                <div>
                                    <div className='bottomcontentnum'>{countList.IPAlloc ? countList.IPAlloc.unsubmitted : 0}</div>
                                    <div className='bottomcontenttext'>{language('project.resmngt.resapply.unsubmittedapplication')}</div>
                                </div>
                            </div>
                        </ProCard>
                        <ProCard ghost >
                            <div className='dipflex dipflexright'>
                                <div>
                                    <div className='bottomcontentnum'>{countList.IPAlloc ? countList.IPAlloc.unapproved : 0}</div>
                                    <div className='bottomcontenttext'>{language('project.resmngt.resapply.applicationapproved')}</div>
                                </div>
                            </div>
                        </ProCard>
                    </ProCard>

                </ProCard>
                <ProCard ghost bordered={true} direction='column' className='topcartinfo'>
                    <ProCard ghost className='rtopcartinfoupper'>
                        <ProCard ghost colSpan={14} >
                            <div className='dipflex' >
                                <div
                                    className='dipfleximg'
                                >
                                    <RiArrowUpDownLine style={{ fontSize: '36px', color: '#FFFFFF' }} />
                                </div>
                                <div>
                                    <div className='uppertitleinfo' >{language('project.resmngt.resapply.totalchangeaudit')}<span>{countList.IPChange ? countList.IPChange.total : 0}</span></div>
                                </div>
                            </div>
                        </ProCard>
                        <ProCard ghost >
                            <div className='dipflex dipflexright'>
                                <div>
                                    <div className='topcontenthight topcontentinfo'><span className='signintext'>{language('project.resmngt.resapply.approved')}</span><span className='signinnum'>{countList.IPChange ? countList.IPChange.approved : 0}</span></div>
                                    <div className='topcontentinfo'><span className='signintext'>{language('project.resmngt.resapply.approvalrejected')}</span><span className='signinnum'>{countList.IPChange ? countList.IPChange.rejected : 0}</span></div>
                                </div>
                            </div>
                        </ProCard>
                    </ProCard>
                    <ProCard ghost className='dipbottomcolro'>
                        <ProCard ghost >
                            <div className='dipflex dipflexleft'>
                                <div>
                                    <div className='bottomcontentnum'>{countList.IPChange ? countList.IPChange.unsubmitted : 0}</div>
                                    <div className='bottomcontenttext'>{language('project.resmngt.resapply.unsubmittedapplication')}</div>
                                </div>
                            </div>
                        </ProCard>
                        <ProCard ghost >
                            <div className='dipflex dipflexright'>
                                <div>
                                    <div className='bottomcontentnum'>{countList.IPChange ? countList.IPChange.unapproved : 0}</div>
                                    <div className='bottomcontenttext'>{language('project.resmngt.resapply.applicationapproved')}</div>
                                </div>
                            </div>
                        </ProCard>
                    </ProCard>

                </ProCard>
                <ProCard ghost bordered={true} direction='column' className='topcartinfo'>
                    <ProCard ghost className='rtopcartinfoupper'>
                        <ProCard ghost colSpan={14} >
                            <div className='dipflex' >
                                <div
                                    className='dipfleximg'
                                >
                                    <RiEraserFill style={{ fontSize: '36px', color: '#FFFFFF' }} />
                                </div>
                                <div>
                                    <div className='uppertitleinfo' >{language('project.resmngt.resapply.totalcancellationrequests')}<span>{countList.IPRecycle ? countList.IPRecycle.total : 0}</span></div>
                                </div>
                            </div>
                        </ProCard>
                        <ProCard ghost >
                            <div className='dipflex dipflexright'
                            >
                                <div>
                                    <div className='topcontenthight topcontentinfo'><span className='signintext'>{language('project.resmngt.resapply.approved')}</span><span className='signinnum'>{countList.IPRecycle ? countList.IPRecycle.approved : 0}</span></div>
                                    <div className='topcontentinfo'><span className='signintext'>{language('project.resmngt.resapply.approvalrejected')}</span><span className='signinnum'>{countList.IPRecycle ? countList.IPRecycle.rejected : 0}</span></div>
                                </div>
                            </div>
                        </ProCard>
                    </ProCard>
                    <ProCard ghost className='dipbottomcolro'>
                        <ProCard ghost>
                            <div className='dipflex dipflexleft'
                            >
                                <div>
                                    <div className='bottomcontentnum'>{countList.IPRecycle ? countList.IPRecycle.unsubmitted : 0}</div>
                                    <div className='bottomcontenttext'>{language('project.resmngt.resapply.unsubmittedapplication')}</div>
                                </div>
                            </div>
                        </ProCard>
                        <ProCard ghost >
                            <div className='dipflex dipflexright'
                            >
                                <div>
                                    <div className='bottomcontentnum'>{countList.IPRecycle ? countList.IPRecycle.unapproved : 0}</div>
                                    <div className='bottomcontenttext'>{language('project.resmngt.resapply.applicationapproved')}</div>
                                </div>
                            </div>
                        </ProCard>
                    </ProCard>

                </ProCard>
            </ProCard>
            <div className="allocationcard card-container" >
                <Tabs type="card">
                    <TabPane tab={language('project.resmngt.resapply.distributionapply')} key="1">
                        <Allocationrequest />
                    </TabPane>
                    <TabPane tab={language('project.resmngt.resapply.changeapply')} key="2">
                        <Changerequest />
                    </TabPane>
                    <TabPane tab={language('project.resmngt.resapply.cancellationapply')} key="3">
                        <Cancellationapply />
                    </TabPane>
                </Tabs>
            </div>
        </div>

    );
}
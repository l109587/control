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
		"SignIN": {
      "total": 0,
      "unsubmitted": 0,
      "inapproval": 0,
      "approved": 0,
      "rejected": 0
    },
    "SignChange": {
      "total": 0,
      "unsubmitted": 0,
      "inapproval": 0,
      "approved": 0,
      "rejected": 0
    },
    "SignOUT": {
      "total": 0,
      "unsubmitted": 0,
      "inapproval": 0,
      "approved": 0,
      "rejected": 0
    },
	}]);
	useEffect(() => {
		getCount();
	}, [])
	const getCount = () => {
		post('/cfg.php?controller=confAssetManage&action=applicationStat').then((res) => {
			setCountList(res.data ? res.data : []);
		}).catch(() => {
			console.log('mistake')
		})
	}
	return (
		<div className='assapplybox'>
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
									<div className='uppertitleinfo' >{language('project.assmngt.resapply.totalallocationrequests')}<span>{countList.SignIN ? countList.SignIN.total : 0}</span></div>
								</div>
							</div>
						</ProCard>
						<ProCard ghost >
							<div className='dipflex dipflexright'>
								<div>
									<div className='topcontenthight topcontentinfo'><span className='signintext'>{language('project.assmngt.resapply.approved')}</span><span className='signinnum'>{countList.SignIN ? countList.SignIN.approved : 0}</span></div>
									<div className='topcontentinfo'><span className='signintext'>{language('project.assmngt.resapply.approvalrejected')}</span><span className='signinnum'>{countList.SignIN ? countList.SignIN.rejected : 0}</span></div>
								</div>
							</div>
						</ProCard>
					</ProCard>
					<ProCard ghost className='dipbottomcolro'>
						<ProCard ghost >
							<div className='dipflex dipflexleft'>
								<div>
									<div className='bottomcontentnum'>{countList.SignIN ? countList.SignIN.unsubmitted : 0}</div>
									<div className='bottomcontenttext'>{language('project.assmngt.resapply.unsubmittedapplication')}</div>
								</div>
							</div>
						</ProCard>
						<ProCard ghost >
							<div className='dipflex dipflexright'>
								<div>
									<div className='bottomcontentnum'>{countList.SignIN ? countList.SignIN.inapproval : 0}</div>
									<div className='bottomcontenttext'>{language('project.assmngt.resapply.applicationapproved')}</div>
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
									<div className='uppertitleinfo' >{language('project.assmngt.resapply.totalchangeaudit')}<span>{countList.SignChange ? countList.SignChange.total : 0}</span></div>
								</div>
							</div>
						</ProCard>
						<ProCard ghost >
							<div className='dipflex dipflexright'>
								<div>
									<div className='topcontenthight topcontentinfo'><span className='signintext'>{language('project.assmngt.resapply.approved')}</span><span className='signinnum'>{countList.SignChange ? countList.SignChange.approved : 0}</span></div>
									<div className='topcontentinfo'><span className='signintext'>{language('project.assmngt.resapply.approvalrejected')}</span><span className='signinnum'>{countList.SignChange ? countList.SignChange.rejected : 0}</span></div>
								</div>
							</div>
						</ProCard>
					</ProCard>
					<ProCard ghost className='dipbottomcolro'>
						<ProCard ghost >
							<div className='dipflex dipflexleft'>
								<div>
									<div className='bottomcontentnum'>{countList.SignChange ? countList.SignChange.unsubmitted : 0}</div>
									<div className='bottomcontenttext'>{language('project.assmngt.resapply.unsubmittedapplication')}</div>
								</div>
							</div>
						</ProCard>
						<ProCard ghost >
							<div className='dipflex dipflexright'>
								<div>
									<div className='bottomcontentnum'>{countList.SignChange ? countList.SignChange.inapproval : 0}</div>
									<div className='bottomcontenttext'>{language('project.assmngt.resapply.applicationapproved')}</div>
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
									<div className='uppertitleinfo' >{language('project.assmngt.resapply.totalcancellationrequests')}<span>{countList.SignOUT ? countList.SignOUT.total : 0}</span></div>
								</div>
							</div>
						</ProCard>
						<ProCard ghost >
							<div className='dipflex dipflexright'
							>
								<div>
									<div className='topcontenthight topcontentinfo'><span className='signintext'>{language('project.assmngt.resapply.approved')}</span><span className='signinnum'>{countList.SignOUT ? countList.SignOUT.approved : 0}</span></div>
									<div className='topcontentinfo'><span className='signintext'>{language('project.assmngt.resapply.approvalrejected')}</span><span className='signinnum'>{countList.SignOUT ? countList.SignOUT.rejected : 0}</span></div>
								</div>
							</div>
						</ProCard>
					</ProCard>
					<ProCard ghost className='dipbottomcolro'>
						<ProCard ghost>
							<div className='dipflex dipflexleft'
							>
								<div>
									<div className='bottomcontentnum'>{countList.SignOUT ? countList.SignOUT.unsubmitted : 0}</div>
									<div className='bottomcontenttext'>{language('project.assmngt.resapply.unsubmittedapplication')}</div>
								</div>
							</div>
						</ProCard>
						<ProCard ghost >
							<div className='dipflex dipflexright'
							>
								<div>
									<div className='bottomcontentnum'>{countList.SignOUT ? countList.SignOUT.inapproval : 0}</div>
									<div className='bottomcontenttext'>{language('project.assmngt.resapply.applicationapproved')}</div>
								</div>
							</div>
						</ProCard>
					</ProCard>

				</ProCard>
			</ProCard>
			<div className="allocationcard card-container" >
				<Tabs type="card">
					<TabPane tab={language('project.assmngt.resapply.distributionapply')} key="1">
						<Allocationrequest />
					</TabPane>
					<TabPane tab={language('project.assmngt.resapply.changeapply')} key="2">
						<Changerequest />
					</TabPane>
					<TabPane tab={language('project.assmngt.resapply.cancellationapply')} key="3">
						<Cancellationapply />
					</TabPane>
				</Tabs>
			</div>
		</div>

	);
}
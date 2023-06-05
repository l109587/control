import React, { useRef, useState, useEffect } from 'react';
import { IdcardFilled } from '@ant-design/icons';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { message, Tabs } from 'antd';
import { language } from '@/utils/language';
import { Allocationapproval, Cancellationapproval, Changeapproval } from './components';
import { RiEraserFill, RiArrowUpDownLine } from "react-icons/ri";
import { post, get } from '@/services/https';
import './index.less';
const { TabPane } = Tabs;
let H = document.body.clientHeight - 143
var clientHeight = H

export default () => {
	const [countList, setCountList] = useState([{
		"IPAlloc": {
			"inapproval": 0,
			"approved": 0,
			"rejected": 0,
		},
		"IPChange": {
			"inapproval": 0,
			"approved": 0,
			"rejected": 0,
		},
		"IPRecycle": {
			"inapproval": 0,
			"approved": 0,
			"rejected": 0,
		}
	}]);
	useEffect(() => {
		getCount();
	}, [])
	const getCount = () => {
		post('/cfg.php?controller=confAssetManage&action=approvalStat').then((res) => {
			setCountList(res.data);
		}).catch(() => {
			console.log('mistake')
		})
	}
	return (
		<>
			<ProCard ghost gutter={[13, 13]}>
				<ProCard ghost bordered={true} direction='column' className='topcartinfo'>
					<ProCard ghost className='topcartinfoupper'>
						<div className='topcartinfoupperinfo' >
							<div className='dipflex' >
								<div
									className='dipfleximg'
								>
									<IdcardFilled style={{ fontSize: '36px', color: '#FFFFFF' }} />
								</div>
								<div>
									<div className='uppertitleinfo' >{language('project.assmngt.approval.requestpendingaudit')}</div>
								</div>

							</div>
							<div className='rightsize'>{countList.SignIN ? countList.SignIN.inapproval : 0}</div>
						</div>
					</ProCard>
					<ProCard ghost className='dipbottomcolro'>
						<ProCard ghost >
							<div className='dipflex dipflexleft'>
								<div>
									<div className='bottomcontentnum'>{countList.SignIN ? countList.SignIN.approved : 0}</div>
									<div className='bottomcontenttext'>{language('project.assmngt.approval.approved')}</div>
								</div>
							</div>
						</ProCard>
						<ProCard ghost >
							<div className='dipflex dipflexright'>
								<div>
									<div className='bottomcontentnum'>{countList.SignIN ? countList.SignIN.rejected : 0}</div>
									<div className='bottomcontenttext'>{language('project.assmngt.approval.approvalrejected')}</div>
								</div>
							</div>
						</ProCard>
					</ProCard>

				</ProCard>
				<ProCard ghost bordered={true} direction='column' className='topcartinfo'>
					<ProCard ghost className='topcartinfoupper'>
						<div className='topcartinfoupperinfo'>
							<div className='dipflex' >
								<div
									className='dipfleximg'
								>
									<RiArrowUpDownLine style={{ fontSize: '36px', color: '#FFFFFF' }} />
								</div>
								<div>
									<div className='uppertitleinfo' >{language('project.assmngt.approval.changependingaudit')}</div>
								</div>
							</div>
							<div className='rightsize'>{countList.SignChange ? countList.SignChange.inapproval : 0}</div>
						</div>
					</ProCard>
					<ProCard ghost className='dipbottomcolro'>
						<ProCard ghost >
							<div className='dipflex dipflexleft'>
								<div>
									<div className='bottomcontentnum'>{countList.SignChange ? countList.SignChange.approved : 0}</div>
									<div className='bottomcontenttext'>{language('project.assmngt.approval.approved')}</div>
								</div>
							</div>
						</ProCard>
						<ProCard ghost >
							<div className='dipflex dipflexright'>
								<div>
									<div className='bottomcontentnum'>{countList.SignChange ? countList.SignChange.rejected : 0}</div>
									<div className='bottomcontenttext'>{language('project.assmngt.approval.approvalrejected')}</div>
								</div>
							</div>
						</ProCard>
					</ProCard>

				</ProCard>
				<ProCard ghost bordered={true} direction='column' className='topcartinfo'>
					<ProCard ghost className='topcartinfoupper'>
						<div className='topcartinfoupperinfo'>
							<div className='dipflex' >
								<div
									className='dipfleximg'
								>
									<RiEraserFill style={{ fontSize: '36px', color: '#FFFFFF' }} />
								</div>
								<div>
									<div className='uppertitleinfo' >{language('project.assmngt.approval.cancellationpendingaudit')}</div>
								</div>
							</div>
							<div className='rightsize'>{countList.SignOUT ? countList.SignOUT.inapproval : 0}</div>
						</div>
					</ProCard>
					<ProCard ghost className='dipbottomcolro'>
						<ProCard ghost>
							<div className='dipflex dipflexleft'
							>
								<div>
									<div className='bottomcontentnum'>{countList.SignOUT ? countList.SignOUT.approved : 0}</div>
									<div className='bottomcontenttext'>{language('project.assmngt.approval.approved')}</div>
								</div>
							</div>
						</ProCard>
						<ProCard ghost >
							<div className='dipflex dipflexright'
							>
								<div>
									<div className='bottomcontentnum'>{countList.SignOUT ? countList.SignOUT.rejected : 0}</div>
									<div className='bottomcontenttext'>{language('project.assmngt.approval.approvalrejected')}</div>
								</div>
							</div>
						</ProCard>
					</ProCard>

				</ProCard>
			</ProCard>
			<div className="allocationcard card-container" >
				<Tabs type="card">
					<TabPane tab={language('project.assmngt.approval.distributionapproval')} key="1">
						<Allocationapproval />
					</TabPane>
					<TabPane tab={language('project.assmngt.approval.changeapproval')} key="2">
						<Changeapproval />
					</TabPane>
					<TabPane tab={language('project.assmngt.approval.cancellationapproval')} key="3">
						<Cancellationapproval />
					</TabPane>
				</Tabs>
			</div>
		</>

	);
}
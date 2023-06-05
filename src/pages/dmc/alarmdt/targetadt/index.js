
import Tab from '@/components/Tabs'
import IPadt from './ipadt'
import Domainadt from './domainadt'
import Urladt from './urladt'
import Account from './accountadt'

export default function Attacker() {
  const titles = ['IP审计','域名审计','URL审计','账号审计']
  const keys = ['ipadt','domainadt','urladt','account']
  const contents = [<IPadt/>,<Domainadt/>,<Urladt/>,<Account/>]
  return (
    <>
      <Tab
        titles={titles}
        keys={keys}
        contents={contents}
      />
    </>
  )
}
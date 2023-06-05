
import Tab from '@/components/Tabs'
import Trojan from './trojan'
import Malice from './malice'
import Hole from './hole'

export default function Attacker() {
  const titles = ['木马攻击','漏洞攻击','恶意攻击']
  const keys = ['木马攻击','漏洞攻击','恶意攻击']
  const contents = [<Trojan/>,<Hole/>,<Malice/>]
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

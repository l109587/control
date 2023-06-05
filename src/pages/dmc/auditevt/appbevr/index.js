import React from 'react'
import Tab from '@/components/Tabs'
import Webvisit from './webvisit'
import Domainreq from './domainreq'
import Email from './email'
import Filetrans from './filetrans'
import Sslvisit from './sslvisit'
import { language } from '@/utils/language'

export default function Attacker() {
  const titles = [language('netaudit.webvisit.tabname'),language('netaudit.domainreq.tabname'), language('netaudit.email.tabname'), language('netaudit.filetrans.tabname'), language('netaudit.sslvisit.tabname')]
  const keys = ['webvisit','domainreq','email','filetrans','sslvisit']
  const contents = [<Webvisit/>,<Domainreq/>,<Email/>,<Filetrans/>,<Sslvisit/>]
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
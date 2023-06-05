import tacRouter from './tacRouter'
import nbgRouter from './nbgRouter'
import nbaRouter from './nbaRouter'
import ntaRouter from './ntaRouter'
import dmcRouter from './dmcRouter'
const { SYSTEM } = process.env

let routers = []
if (SYSTEM) {
  if (SYSTEM === 'tac') {
    routers = tacRouter
  } else if (SYSTEM === 'nbg') {
    routers = nbgRouter
  } else if (SYSTEM === 'nba') {
    routers = nbaRouter
  } else if (SYSTEM === 'nta') {
    routers = ntaRouter
  } else if (SYSTEM === 'dmc') {
    routers = dmcRouter
  }
} else {
  routers = tacRouter.concat(nbgRouter).concat(nbaRouter).concat(ntaRouter).concat(dmcRouter)
}

export default [
  {
    path: '/404',
    component: '@/pages/common/404.tsx',
  },
  {
    path: '/glogin',
    component: '@/pages/common/glogin/index.js',
  },
  {
    path: '/',
    component: '@/layouts/index.js',
    routes: [
      {
        path: '/404',
        exact: true,
        component: '@/pages/common/404.tsx',
      },
      {
        path: '/loading',
        exact: true,
        component: '@/pages/common/loading.js',
      },
      {
        path: '/login',
        exact: true,
        component: '@/pages/common/login/index.js',
      },
      {
        path: '/glogin',
        exact: true,
        component: '@/pages/common/glogin/index.js',
      },
      {
        path: '/sysconf/adminacc',
        exact: true,
        component: '@/pages/common/sysconf/adminacc/index',
      },
      {
        path: '/sysconf/adminset',
        exact: true,
        component: '@/pages/common/sysconf/adminset/index.js',
      },
      {
        path: '/sysconf/apiauth',
        exact: true,
        component: '@/pages/common/sysconf/apiauth/index.js',
      },
      {
        path: '/sysconf/network',
        exact: true,
        component: '@/pages/common/sysconf/network/index.js',
      },
      {
        path: '/sysconf/sysmenu',
        exact: true,
        component: '@/pages/common/sysconf/sysmenu/index.js',
      },
      {
        path: '/sysconf/sysserv',
        exact: true,
        component: '@/pages/common/sysconf/sysserv/index.js',
      },
      {
        path: '/sysconf/systime',
        exact: true,
        component: '@/pages/common/sysconf/systime/index.js',
      },
      {
        path: '/sysconf/ecustom',
        exact: true,
        component: '@/pages/common/sysconf/ecustom/index.js',
      },
      {
        path: '/sysconf/netconf',
        exact: true,
        component: '@/pages/common/sysconf/netconf/index.js',
      },
      {
        path: '/sysconf/syscert',
        exact: true,
        component: '@/pages/common/sysconf/syscert/index.js',
      },
      {
        path: '/sysconf/deployd',
        exact: true,
        component: '@/pages/common/sysconf/deployd/index.js',
      },
      {
        path: '/sysconf/standby',
        exact: true,
        component: '@/pages/common/sysconf/standby/index.js',
      },
      {
        path: '/cfgmngt/zoneconf',
        exact: true,
        component: '@/pages/common/sysconf/zoneconf/index.js',
      },
      {
        path: '/sysmain/admlog',
        exact: true,
        component: '@/pages/common/sysmain/admlog/index.js',
      },
      {
        path: '/sysmain/mtacfg',
        exact: true,
        component: '@/pages/common/sysmain/mtacfg/index.js',
      },
      {
        path: '/sysmain/mtadat',
        exact: true,
        component: '@/pages/common/sysmain/mtadat/index.js',
      },
      {
        path: '/sysmain/mtalog',
        exact: true,
        component: '@/pages/common/sysmain/mtalog/index.js',
      },
      {
        path: '/sysmain/remote',
        exact: true,
        component: '@/pages/common/sysmain/remote/index.js',
      },
      {
        path: '/sysmain/status',
        exact: true,
        component: '@/pages/common/sysmain/status/index.js',
      },
      {
        path: '/sysmain/update',
        exact: true,
        component: '@/pages/common/sysmain/update/index.js',
      },
      ...routers,
      {
        component: '@/pages/common/404.tsx',
      },
    ],
  }
]

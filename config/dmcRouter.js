export default [
  {
    path: '/',
    exact: true,
    component: '@/pages/dmc/mconfig/attachchk/index.js',
  },
  {
    path: '/mconfig/attachchk',
    exact: true,
    component: '@/pages/dmc/mconfig/attachchk/index.js',
  },
  {
    path: '/mconfig/transmchk',
    exact: true,
    component: '@/pages/dmc/mconfig/transmchk/index.js',
  },
  {
    path: '/mconfig/targetadt',
    exact: true,
    component: '@/pages/dmc/mconfig/targetadt/index.js',
  },
  {
    path: '/mconfig/behavioradt',
    exact: true,
    component: '@/pages/dmc/mconfig/behavioradt/index.js',
  },
  {
    path: '/mconfig/blkwhtl',
    exact: true,
    component: '@/pages/dmc/mconfig/blkwhtl/index.js',
  },
  {
    path: '/cfgmngt/ctrlcmd',
    exact: true,
    component: '@/pages/dmc/cfgmngt/ctrlcmd/index.js',
  },
  {
    path: '/cfgmngt/ruleinfo',
    exact: true,
    component: '@/pages/dmc/cfgmngt/ruleinfo/index.js',
  },
  {
    path: '/cfgmngt/devlist',
    exact: true,
    component: '@/pages/dmc/cfgmngt/devlist/index.js',
  },
  {
    path: '/cfgmngt/devlist/:id',
    exact: true,
    component: '@/pages/dmc/cfgmngt/devlist/[id]/index.js',
  },
  {
    path: '/cfgmngt/reglist',
    exact: true,
    component: '@/pages/dmc/cfgmngt/reglist/index.js',
  },
  {                       
    path: '/alarmdt/transfer',
    exact: true,
    component: '@/pages/dmc/alarmdt/transfer/index.js',
  },
  {                       
    path: '/alarmdt/attacker',
    exact: true,
    component: '@/pages/dmc/alarmdt/attacker/index.js',
  },
  {                       
    path: '/alarmdt/targetadt',
    exact: true,
    component: '@/pages/dmc/alarmdt/targetadt/index.js',
  },
  {                       
    path: '/alarmdt/unknown',
    exact: true,
    component: '@/pages/dmc/alarmdt/unknown/index.js',
  },
  {                       
    path: '/auditevt/connect',
    exact: true,
    component: '@/pages/dmc/auditevt/connect/index.js',
  },
  {                       
    path: '/auditevt/appbevr',
    exact: true,
    component: '@/pages/dmc/auditevt/appbevr/index.js',
  },
]

import Mock from 'mockjs'

export default function sysMonitor(getParam, postParam, res) {
    let json = ''
    if(getParam.action == 'showChartStat'){
        json = Mock.mock({
            'count': 150,
            'title': "CPU使用率(%)",
            'xstep': 15,
            'yAMax': 100,
            'lines|100':[{
                'name':'cpu',
                'time':'@time',
                'value|0-100':0
            }]
        })
    }else if(getParam.action == 'showChartFlow'){
        json = Mock.mock({
            'count': 168,
            'title': "接收流量(bps)",
            'xstep': 10,
            'lines|100':[{
                'name':'eth0',
                'time':'@time',
                'value|0-1000':0
            },
            {
                'name':'eth1',
                'time':'@time',
                'value|0-1000':0
            },
            {
                'name':'eth2',
                'time':'@time',
                'value|0-1000':0
            }
        ]
        })
    }
    res.send(json)
  }

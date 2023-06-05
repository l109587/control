import React, { PureComponent } from 'react'
import { Redirect } from 'umi'
import { withI18n } from '@lingui/react'

import store from 'store'
@withI18n()
class Index extends PureComponent {
    state={ 
        link:''
    }
    componentDidMount() {
        let Permission=  store.get('Permission')
        if (Permission[0].route){
            this.setState({link:Permission[0].route })
        } else{
            this.setState({link:Permission[0].children[0].route })
        }
      }
    render () {
        const {link} = this.state
        return <Redirect to={link} />
    }
}
export default Index

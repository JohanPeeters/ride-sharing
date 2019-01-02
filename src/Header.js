import React, {Component} from 'react'
import {AppBar, Toolbar, Typography, Button} from '@material-ui/core'
import AuthenticatedUserContext from './AuthenticatedUserContext'

class Header extends Component {
    static contextType = AuthenticatedUserContext

    constructor(props) {
      super(props)
      this.userManager = this.props.userManager
    }

    login = () => {
      this.userManager.signinRedirect()
    }

    render() {
      return(
        <AppBar position='relative'>
          <Toolbar>
            <Typography variant='h3'>
              Ride sharing
            </Typography>
              <Button onClick={this.context?this.props.logout:this.login}>
                {this.context?'logout':'login'}
              </Button>
          </Toolbar>
        </AppBar>
      )
    }
}

export default Header

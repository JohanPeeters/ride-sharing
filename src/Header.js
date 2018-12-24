import React, {Component} from 'react'
import {AppBar, Toolbar, Typography, Button} from '@material-ui/core'

class Header extends Component {

    constructor(props) {
      super(props)
      this.userManager = this.props.userManager
      this.state = {}
    }

    componentWillMount() {
      const params = (new URL(document.location)).searchParams
      if (params && params.get('code'))
        this.userManager.signinRedirectCallback()
          .then(user => {
            this.props.update()
          }, err =>
            console.log(`login not successful: ${err}`)
          )
    }

    login = () => {
      this.userManager.signinRedirect()
    }

    logout = async () => {
      this.userManager.removeUser()
        .then(() => {
          this.props.update()
        })
      }

    render() {
      return(
        <AppBar position='relative'>
          <Toolbar>
            <Typography variant='h3'>
              Ride sharing
            </Typography>
            {!this.props.loggedIn &&
              <Button onClick={this.login}>Login</Button>
            }
            {this.props.loggedIn &&
              <Button onClick={this.logout}>Logout</Button>
            }
          </Toolbar>
        </AppBar>
      )
    }
}

export default Header

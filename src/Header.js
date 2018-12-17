import React, {Component} from 'react'
import {AppBar, Toolbar, Typography, Button} from '@material-ui/core'

class Header extends Component {

    constructor(props) {
      super(props)
      this.auth = props.auth
      this.state = {
      }
      this.login = this.login.bind(this)
      this.logout = this.logout.bind(this)
    }

    login() {
      this.auth.getToken()
        .then(token => {
          this.props.update()
        }, err => {
          this.props.update()
        })
    }

    logout() {
      this.auth.wipeTokens()
      this.props.update()
    }

    render() {
      return(
        <AppBar position='relative'>
          <Toolbar>
            <Typography variant='h3'>
              Ride sharing
            </Typography>
            {this.auth && !this.props.loggedIn &&
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

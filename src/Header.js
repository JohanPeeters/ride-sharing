import React, {Component} from 'react'
import {AppBar, Toolbar, Typography, Button} from '@material-ui/core'
import axios from 'axios'

class Header extends Component {

    constructor(props) {
      super(props)
      this.auth = props.auth
      this.state = {
      }
      this.login = this.login.bind(this)
      this.logout = this.logout.bind(this)
    }

    componentDidMount() {
      this.auth && this.auth.callback()
      // const fragment = window.location.hash
      // console.log(`header called with fragment ${fragment}`)
    }

    login() {
      this.auth.getToken()
        .then(token => {
          console.log(`got it: ${JSON.stringify(token)}`)
          this.setState({
            loggedIn: true
          })
        }, err => {
          console.log(`drats: ${err}`)
          this.setState({
            loggedIn: false
          })
        })
    }

    logout() {
      this.auth.wipeTokens()
      // const config = {
      //   baseURL: process.env.REACT_APP_API,
      //   url: 'rides',
      //   method: 'post',
      //   headers: {
      //     'x-api-key': process.env.REACT_APP_API_KEY,
      //     'Authorization': `Bearer ${this.state.accessToken}`
      //   },
      //   data: {
      //     from: this.state.from,
      //     to: this.state.to,
      //     when: this.state.when
      //   }
      // }
      // axios(config)
      //   .then(
      //     res => {
      //       this.setState({
      //         enteringRide: false
      //       })
      //       this.listRides()
      //     },
      //     rejectionReason => {
      //       this.setState({
      //         errorMessage: `cannot share ride - ${rejectionReason}`,
      //         enteringRide: false
      //       })
      //     }
      //   )
      this.setState({
        loggedIn: false
      })
    }

    render() {
      return(
        <AppBar position='relative'>
          <Toolbar>
            <Typography variant='h3'>
              Ride sharing
            </Typography>
            {this.auth && !this.auth.checkToken() &&
              <Button onClick={this.login}>Login</Button>
            }
            {this.auth && this.auth.checkToken() &&
              <Button onClick={this.logout}>Logout</Button>
            }
          </Toolbar>
        </AppBar>
      )
    }
}

export default Header

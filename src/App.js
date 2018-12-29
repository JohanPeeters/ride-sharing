import React, {Component} from 'react'
import axios from 'axios'
import {Button} from '@material-ui/core'
import {UserManager} from 'oidc-client'
import {Rides} from './Rides'
import RideForm from './RideForm'
import './css/App.css'
import Header from './Header'
import AuthenticatedUserContext from './AuthenticatedUserContext'

const config = {
  authority: process.env.REACT_APP_ISSUER,
  client_id: process.env.REACT_APP_CLIENT_ID,
  redirect_uri: window.origin,
  response_type: 'code',
  post_logout_redirect_uri: window.origin,
  scope: 'openid rides/create rides/delete rides/update'
}

class App extends Component {

  constructor(props) {
    super(props)
    this.userManager =  new UserManager(config)
    this.state = {}
    this.userManager.events.addUserLoaded(() => {
        this.userManager.getUser()
          .then(user => {
            if (user)
              this.setState({
                user: user
              })
          })
        })
    this.userManager.events.addUserUnloaded(() => {
      this.setState({
        user: undefined
      })
    })
    this.userManager.events.addAccessTokenExpired(() => {
      this.setState({
        user: undefined
      })
    })
  }

  componentWillMount() {
    const params = (new URL(window.location)).searchParams
    if (params && params.get('code')) {
      this.userManager.signinRedirectCallback()
    //  window.location = window.origin
    }
    this.userManager.getUser()
      .then(user => {
        this.setState({
          user: user
        })
      })
    this.listRides()
  }

  logout = () => {
    this.userManager.removeUser()
    this.setState({
      user: undefined,
      errorMessage: undefined
    })
  }

  done = (errorMessage) => {
    this.setState({
      errorMessage: errorMessage
    })
    this.listRides()
  }

  listRides = () => {
    const config = {
      baseURL: process.env.REACT_APP_API,
      url: 'rides',
      method: 'get',
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY
      }
    }
    axios(config)
      .then(
        (res) => {
          this.setState({
            rides: res.data,
            enteringRide: false
          })
      })
      .catch(
        (err) => {
          this.setState({
            enteringRide: false,
            errorMessage: `cannot retrieve rides - ${err}`
          })
      })
  }

  addRide = () => {
    this.setState({
      enteringRide: true
    })
  }

  render() {
    return (
      <div className="App">
        <AuthenticatedUserContext.Provider value={this.state.user}>
          <Header userManager={this.userManager} logout={this.logout}/>
          {this.state.user && !this.state.enteringRide &&
              <Button onClick={this.addRide}>
                Share another ride
              </Button>
          }
          {this.state.user && this.state.enteringRide &&
            <RideForm data={{}} method='post' done={this.done}/>
          }
          <Rides list={this.state.rides}
                update={this.done}
                />
          {this.state.errorMessage &&
            <p className='error'>
              {this.state.errorMessage}
            </p>
          }
        </AuthenticatedUserContext.Provider>
        <h3>
          Ride sharing is the future. Check out some of the other initiatives.
        </h3>
        <iframe
          title='background information'
          width="560"
          height="315"
          src="https://www.youtube.com/embed/TcQUIfhOSyU"
          frameBorder="0"
          allow="fullscreen"
          sandbox="allow-scripts allow-same-origin allow-presentation"
        />
      </div>
    )
  }
}

export default App

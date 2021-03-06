import React, {Component} from 'react'
import axios from 'axios'
import {Button} from '@material-ui/core'
import {UserManager} from 'oidc-client'
import {getPayload} from './helpers/tokens'
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
  scope: 'openid rides/create rides/delete rides/update',
  loadUserInfo: false,
  automaticSilentRenew: true
}

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {}
    this.userManager =  new UserManager(config)
    const urlStr = window.location
    const url = new URL(urlStr)
    const params = url.searchParams
    if (params && params.get('code')) {
      this.userManager.signinRedirectCallback(urlStr)
        .then(user => {
          this.stripCode()
        })
        .catch(error => {
          this.setState({
            errorMessage: `cannot login: error exchanging code for token - ${JSON.stringify(error)}`
          })
        })
        .finally (
          this.listRides()
        )
    } else {
      this.setUser()
      this.listRides()
    }
    this.userManager.events.addUserLoaded(() => {
      this.setUser()
    })
    this.userManager.events.addUserUnloaded(() => {
      this.setState({
        user: undefined
      })
    })
    this.userManager.events.addAccessTokenExpired(() => {
      this.userManager.removeUser()
      this.setState({
        user: undefined
      })
    })
  }

  stripCode = () => {
    window.history.replaceState({}, '', window.origin)
  }

  setUser = () => {
    this.userManager.getUser()
      .then(user => {
        if (user) {
          const profile = getPayload(user.id_token)
          user.profile = profile
          this.setState({
            user: user
          })
        } else {
          this.setState({
            user: undefined
          })
        }
      })
      // no catch - getUser never throws an Error
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
      errorMessage: errorMessage,
      enteringRide: false
    })
    this.listRides()
  }

  listRides = () => {
    const config = {
      baseURL: `https://${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_STAGE}`,
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
            <RideForm method='post' done={this.done}/>
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
          height="615"
          src="https://www.gocarma.com/news/"
          frameBorder="0"
          sandbox=""
        />
      </div>
    )
  }
}

export default App

import React, {Component} from 'react'
import axios from 'axios'
import {Button} from '@material-ui/core'
import {UserManager} from 'oidc-client'
import {Rides} from './Rides'
import RideForm from './RideForm'
import './css/App.css'
import Header from './Header'

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
  }

  componentWillMount() {
    this.checkLogin()
    this.listRides()
  }

  checkLogin = () => {
    this.userManager.getUser()
      .then(user => {
        if (user)
          this.setState({
            user: user
          })
        else
          this.setState({
            user: undefined
          })
      })
      .catch(err => {
        this.setState({
          user: undefined
        })
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

  addRide = async () => {
    this.setState({
      enteringRide: true
    })
  }

  render() {
    return (
      <div className="App">
        <Header userManager={this.userManager} update={this.checkLogin} loggedIn={this.state.user}/>
        {this.state.user && !this.state.enteringRide &&
            <Button onClick={this.addRide}>
              Share another ride
            </Button>
        }
        {this.state.enteringRide &&
          <RideForm data={{}} user={this.state.user} method='post' done={this.done}/>
        }
        <Rides list={this.state.rides}
              user={this.state.user}
              update={this.done}
              />
        {this.state.errorMessage &&
          <p>
            {this.state.errorMessage}
          </p>
        }
      </div>
    )
  }
}

export default App

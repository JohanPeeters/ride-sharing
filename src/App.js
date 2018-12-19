import React, {Component} from 'react'
import {JSO} from 'jso'
import axios from 'axios'
import {Button} from '@material-ui/core'
import {Rides} from './Rides'
import RideForm from './RideForm'
import './css/App.css'
import Header from './Header'
import {verify} from './helpers/tokens'

class App extends Component {

  constructor(props) {
    super(props)
    const jsoConfig = {
      client_id: process.env.REACT_APP_CLIENT_ID,
      redirect_uri: window.origin,
      response_type: 'token',
      authorization: props.asConfig.authorization_endpoint
    }
    this.auth = new JSO(jsoConfig)
    this.state = {}
  }

  componentWillMount() {
    this.auth.callback()
    this.checkLogin()
    this.listRides()
  }

  checkLogin = async () => {
    const tokens = this.auth.checkToken()
    if (tokens) {
      let idToken
      try {
        idToken = await verify(tokens.id_token, this.props.truststore)
      } catch (err) {
        this.setState({
          loggedIn: false,
          user: undefined,
          errorMessage: `cannot verify token - ${err}`
        })
        return
      }
      if (idToken) {
        this.setState({
          loggedIn: true,
          user: idToken.sub,
          errorMessage: undefined
        })
        return
      }
    }
    this.setState({
      loggedIn: false,
      user: undefined
    })
  }

  listRides = (errorMessage) => {
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
            enteringRide: false,
            errorMessage: errorMessage?errorMessage:undefined
          })
        },
        (rejectionReason) => {
          this.setState({
            enteringRide: false,
            errorMessage: `cannot retrieve rides - ${rejectionReason}`
          })
        }
      )
  }

  addRide = async () => {
    this.setState({
      enteringRide: true
    })
  }

  render() {
    return (
      <div className="App">
        <Header auth={this.auth} update={this.checkLogin} loggedIn={this.state.loggedIn}/>
        {this.state.loggedIn && !this.state.enteringRide &&
            <Button onClick={this.addRide}>
              Share another ride
            </Button>
        }
        {this.state.enteringRide &&
          <RideForm data={{}} auth={this.auth} method='post' done={this.listRides}/>
        }
        <Rides list={this.state.rides}
              auth={this.auth}
              update={this.listRides}
              loggedIn={this.state.loggedIn}
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

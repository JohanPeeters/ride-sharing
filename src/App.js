import React, {Component} from 'react'
import {TextField, Button} from '@material-ui/core'
import {JSO} from 'jso'
import axios from 'axios'
import Rides from './Rides'
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
    const now = new Date(Date.now())
    this.state = {
      to: '',
      from: '',
      when: `${1900 + now.getYear()}-${now.getMonth() + 1}-${now.getDate() + 1}T12:00`
    }
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
      }
      if (idToken) {
        console.log(`got idToken: ${JSON.stringify(idToken)}`)
        this.setState({
          loggedIn: true,
          user: idToken.sub
        })
        return
      }
    }
    this.setState({
      loggedIn: false,
      user: undefined
    })
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
            rides: res.data
          })
        },
        (rejectionReason) => {
          this.setState({
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

  submitRide = e => {
    e.preventDefault()
    this.auth.getToken()
      .then(
        tokens => {
          const config = {
            baseURL: process.env.REACT_APP_API,
            url: 'rides',
            method: 'post',
            headers: {
              'x-api-key': process.env.REACT_APP_API_KEY,
              'Authorization': `Bearer ${tokens.access_token}`
            },
            data: {
              from: this.state.from,
              to: this.state.to,
              when: this.state.when
            }
          }
          axios(config)
            .then(
              res => {
                this.setState({
                  enteringRide: false
                })
                this.listRides()
              },
              rejectionReason => {
                this.setState({
                  errorMessage: `cannot share ride - ${rejectionReason}`,
                  enteringRide: false
                })
              }
            )
        },
        err =>
          this.setState({
            errorMessage: `cannot get token - ${err}`
          })
      )
  }

  handleChange = ({target: {name, value}}) =>
    this.setState({
      [name]: value
  })

  render() {
    let {to, from, when} = this.state
    return (
      <div className="App">
        <Header auth={this.auth} update={this.checkLogin} loggedIn={this.state.loggedIn}/>
        {this.state.loggedIn && !this.state.enteringRide &&
            <Button onClick={this.addRide}>
              Share another ride
            </Button>
        }
        {this.state.enteringRide &&
          <form onSubmit={this.submitRide}>
            <TextField
              label='From'
              name='from'
              value={from}
              onChange={this.handleChange}
            />
            <TextField
              label='To'
              name='to'
              value={to}
              onChange={this.handleChange}
            />
            <TextField
              label='When'
              name='when'
              type='datetime-local'
              value={when}
              onChange={this.handleChange}
            />
            <Button type='submit'>
              Share!
            </Button>
          </form>
        }
        <Rides list={this.state.rides} auth={this.auth} update={this.listRides}  loggedIn={this.state.loggedIn}/>
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

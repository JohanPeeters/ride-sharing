import React, { Component } from 'react'
import {TextField, Button} from '@material-ui/core'
import {JSO} from 'jso'
import Rides from './Rides'
import './css/App.css'
import axios from 'axios'
import Header from './Header'

class App extends Component {

  constructor(props) {
    super(props)
    this.auth = new JSO({
        client_id: process.env.REACT_APP_CLIENT_ID,
        redirect_uri: window.origin,
        response_type: 'token',
        authorization: `${process.env.REACT_APP_ISSUER}/oauth2/authorize`,
        debug: true
      })
    this.state = {}
    const axiosConfig = {
      baseURL: process.env.REACT_APP_ISSUER,
      url: '.well-known/openid-configuration',
      method: 'get'
    }
    axios(axiosConfig)
      .then(
        (res) => {
          this.auth.configure({
              client_id: process.env.REACT_APP_CLIENT_ID,
              redirect_uri: window.origin,
              response_type: 'token',
              authorization: res.data.authorization_endpoint,
              debug: true
            })
        },
        (rejectionReason) => {
          this.setState({
            errorMessage: `cannot retrieve issuer configuration - ${rejectionReason}`
          })
        }
      )
    const now = new Date(Date.now())
    this.state = {
      to: '',
      from: '',
      when: `${1900 + now.getYear()}-${now.getMonth() + 1}-${now.getDate() + 1}T12:00`
    }
  }

  componentWillMount() {
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
        <Header auth={this.auth}/>
        {!this.state.enteringRide &&
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
        <Rides list={this.state.rides} errorMessage={this.state.errorMessage}/>
      </div>
    )
  }
}

export default App

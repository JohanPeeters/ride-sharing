import React, { Component } from 'react'
import Rides from './Rides'
import './App.css'
import axios from 'axios'
import {TextField, Button} from '@material-ui/core'
import {aws_exports} from './aws-exports'
import {Authenticator} from 'aws-amplify-react'
import Amplify, {Auth} from 'aws-amplify'
Amplify.configure(aws_exports)

class App extends Component {

  constructor(props) {
    super(props)
    const now = new Date(Date.now())
    this.state = {
      to: '',
      from: '',
      when: `${1900 + now.getYear()}-${now.getMonth() + 1}-${now.getDate() + 1}T12:00`
    }
  }

  componentWillMount() {
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
    Auth.currentSession()
      .then(data => {
        console.log(JSON.stringify(data))
        this.setState({
          enteringRide: true,
          accessToken: data.accessToken.jwtToken
        })
      })
      .catch(err => {
        this.setState({
          needsAuthentication: true
        })
      })
  }

  submitRide = e => {
    e.preventDefault()
    const config = {
      baseURL: process.env.REACT_APP_API,
      url: 'rides',
      method: 'post',
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY,
        'Authorization': `Bearer ${this.state.accessToken}`
      },
      data: {
        from: this.state.from,
        to: this.state.to,
        when: this.state.when
      }
    }
    axios(config)
      .then(
        (res) => {
          this.setState({
            enteringRide: false
          })
        },
        (rejectionReason) => {
          this.setState({
            errorMessage: `cannot share ride - ${rejectionReason}`,
            enteringRide: false
          })
        }
      )
  }

  handleChange = ({ target: { name, value } }) =>
    this.setState({
      [name]: value
  })

  render() {
    let {to, from, when} = this.state
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Ride Sharing
          </p>
        </header>
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
        {this.state.needsAuthentication &&
          <Authenticator amplifyConfig={aws_exports}/>
        }
        <Rides list={this.state.rides} errorMessage={this.state.errorMessage}/>
      </div>
    )
  }
}

export default App

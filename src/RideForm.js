import React, {Component} from 'react'
import {TextField, Button} from '@material-ui/core'
import axios from 'axios'
import AuthenticatedUserContext from './AuthenticatedUserContext'


class RideForm extends Component {
  static contextType = AuthenticatedUserContext

  constructor(props) {
    super(props)
    this.state = this.initialState()
  }

  initialState = () => {
    const now = new Date(Date.now())
    const initialized = this.props.data.to || this.props.data.from || this.props.data.when
    return {
      disabled: initialized?true:false,
      to: this.props.data.to,
      from: this.props.data.from,
      when: this.props.data.when || `${1900 + now.getYear()}-${now.getMonth() + 1}-${now.getDate() + 1}T12:00`
    }
  }

  handleChange = ({target: {name, value}}) =>
    this.setState({
      [name]: value
    })

  submitRide = e => {
    e.preventDefault()
    const path = this.props.data.id?`rides/${this.props.data.id}`:'rides'
    const config = {
      baseURL: process.env.REACT_APP_API,
      url: path,
      method: this.props.method || 'put',
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY,
        'Authorization': `Bearer ${this.context.access_token}`
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
          this.props.done()
          this.setState({
            disabled: true
          })
      })
      .catch(
        error => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            this.props.done(error.response.data.message)
            this.setState(this.initialState())
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            this.props.done(`no response to share request`)
            this.setState(this.initialState())
          } else {
            // Something happened in setting up the request that triggered an Error
            this.props.done(error.message)
            this.setState(this.initialState())
          }
        })
  }

  remove = e => {
    e.preventDefault()
    const config = {
      baseURL: process.env.REACT_APP_API,
      url: `rides/${this.props.data.id}`,
      method: 'delete',
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY,
        'Authorization': `Bearer ${this.context.access_token}`
      }
    }
    axios(config)
    .then(
      res => {
        this.props.done()
      }
    )
    .catch(
      error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          this.props.done(error.response.data.message)
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          this.props.done(`no response to delete request`)
        } else {
          // Something happened in setting up the request that triggered an Error
          this.props.done(error.message)
        }
      })
  }

  edit = e => {
    this.setState({
      disabled: false
    })
  }

  render() {
    return (
      <div>
        <form onSubmit={this.submitRide}>
          <TextField
            disabled={this.state.disabled}
            label='From'
            name='from'
            value={this.state.from}
            onChange={this.handleChange}
          />
          <TextField
            disabled={this.state.disabled}
            label='To'
            name='to'
            value={this.state.to}
            onChange={this.handleChange}
          />
          <TextField
            disabled={this.state.disabled}
            label='When'
            name='when'
            type='datetime-local'
            value={this.state.when}
            onChange={this.handleChange}
          />
          {!this.state.disabled &&
            <Button type='submit'>
              Share!
            </Button>
          }
        </form>
        {this.context &&
          <div>
            <Button onClick={this.remove}>
              Delete
            </Button>
            <Button onClick={this.edit}>
              Edit
            </Button>
          </div>
        }
      </div>
    )
  }
}

export default RideForm

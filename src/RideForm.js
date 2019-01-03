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
    const ensure2Digits = number => {
      return ('0' + number).slice(-2)
    }
    const now = new Date(Date.now())
    const initialized = this.props.data
    return {
      disabled: initialized?true:false,
      to: initialized?this.props.data.to:undefined,
      from: initialized?this.props.data.from:undefined,
      when: initialized?this.props.data.when :
        `${1900 + now.getYear()}-${ensure2Digits(now.getMonth() + 1)}-${ensure2Digits(now.getDate() + 1)}T12:00`
    }
  }

  handleChange = ({target: {name, value}}) =>
    this.setState({
      [name]: value
    })

  submitRide = e => {
    e.preventDefault()
    const path = this.props.data?`rides/${this.props.data.id}`:'rides'
    const config = {
      baseURL: `https://${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_STAGE}`,
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
      baseURL: `https://${process.env.REACT_APP_API_HOST}/${process.env.REACT_APP_API_STAGE}`,
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
    this.prevState = this.state
    this.setState({
      disabled: false
    })
  }

  cancel = e => {
    this.setState(this.prevState)
    this.props.done()
  }

  render() {
    return (
      <AuthenticatedUserContext.Consumer>
      {user => <div>
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
            <div>
              <Button type='submit'>
                Share!
              </Button>
              <Button type='reset' onClick={this.cancel}>
                Cancel
              </Button>
            </div>
          }
        </form>
        {user && this.props.data &&
          user.profile.sub === this.props.data.sub &&
          this.state.disabled &&
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
    }
      </AuthenticatedUserContext.Consumer>
    )
  }
}

export default RideForm

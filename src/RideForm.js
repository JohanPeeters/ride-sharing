import React, {Component} from 'react'
import {TextField, Button} from '@material-ui/core'
import axios from 'axios'


class RideForm extends Component {

  constructor(props) {
    super(props)
    const now = new Date(Date.now())
    this.state = {
      disabled: props.disabled,
      to: props.data.to,
      from: props.data.from,
      when: props.data.when || `${1900 + now.getYear()}-${now.getMonth() + 1}-${now.getDate() + 1}T12:00`
    }
  }

  handleChange = ({target: {name, value}}) =>
    this.setState({
      [name]: value
  })

  submitRide = e => {
    e.preventDefault()
    const path = this.props.data.id?`rides/${this.props.data.id}`:'rides'
    this.props.auth.getToken()
      .then(
        tokens => {
          const config = {
            baseURL: process.env.REACT_APP_API,
            url: path,
            method: this.props.method || 'put',
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
                  enteringRide: false,
                  disabled: true
                })
                this.props.done()
              },
              rejectionReason => {
                this.setState({
                  disabled: true,
                  to: this.props.data.to,
                  from: this.props.data.from,
                  when: this.props.data.when
                })
                this.props.done(`cannot share ride - ${rejectionReason}`)
              }
            )
        },
        err =>
          this.props.done(`cannot get token - ${err}`)
      )
  }

  remove = e => {
    e.preventDefault()
    this.props.auth.getToken()
      .then(
        tokens => {
          const config = {
            baseURL: process.env.REACT_APP_API,
            url: `rides/${this.props.data.id}`,
            method: 'delete',
            headers: {
              'x-api-key': process.env.REACT_APP_API_KEY,
              'Authorization': `Bearer ${tokens.access_token}`
            }
          }
          axios(config)
          .then(
            res => {
              this.props.done()
            }
          )
          .catch(
            err => {
              this.props.done(err.response.data.message)
            }
          )
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
        {this.props.loggedIn &&
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

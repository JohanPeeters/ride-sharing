import React from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import axios from 'axios'

const Rides = (props) => {
  return(
    <div>
      {props.list && props.list.map(ride =>
        <Ride data={ride} auth={props.auth} key={ride.id} update={props.update} loggedIn={props.loggedIn}/>
      )}
      {!props.list &&
        <p>
          Waiting for rides to load
        </p>
      }
    </div>
  )
}

const Ride = (props) => {
  const {to, id, from, when} = props.data
  const remove = e => {
    e.preventDefault()
    props.auth.getToken()
      .then(
        tokens => {
          const config = {
            baseURL: process.env.REACT_APP_API,
            url: `rides/${id}`,
            method: 'delete',
            headers: {
              'x-api-key': process.env.REACT_APP_API_KEY,
              'Authorization': `Bearer ${tokens.access_token}`
            }
          }
          axios(config)
          .then(
            res => props.update()
          )
      })
  }
  return (
      <Card>
        <CardContent>
          <Typography>
            <em>From</em>: {from}
          </Typography>
          <Typography>
            <em>To</em>: {to}
          </Typography>
          <Typography>
            <em>On</em>: {when}
          </Typography>
        </CardContent>
        {props.loggedIn &&
          <CardActions>
            <Button onClick={remove}>Delete</Button>
          </CardActions>
        }
      </Card>
  )
}

export default Rides

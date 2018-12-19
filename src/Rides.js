import React from 'react'
import RideForm from './RideForm'

const Rides = (props) => {
  return(
    <div>
      {props.list && props.list.map(ride =>
        <RideForm data={ride}
              disabled={true}
              auth={props.auth}
              key={ride.id}
              done={props.update}
              loggedIn={props.loggedIn}/>
      )}
      {!props.list &&
        <p>
          Waiting for rides to load
        </p>
      }
    </div>
  )
}

export {Rides}

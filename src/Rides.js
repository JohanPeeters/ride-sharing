import React from 'react'
import RideForm from './RideForm'

const Rides = (props) => {
  return(
    <div>
      {props.list && props.list.map(ride =>
        <RideForm data={ride}
              disabled={true}
              user={props.user}
              key={ride.id}
              done={props.update}/>
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

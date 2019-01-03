import React from 'react'
import RideForm from './RideForm'

const Rides = (props) => {
  if (props.list) {
    const rides = props.list
    rides.sort((ride1, ride2) => {
      if (ride1.when < ride2.when) return -1
      if (ride1.when > ride2.when) return 1
      return 0
    })
    return(
      <div>
        {rides.map(ride =>
          <RideForm data={ride}
              disabled={true}
              key={ride.id}
              done={props.update}/>
        )}
      </div>
    )
  } else {
    return (
      <p>
        Waiting for rides to load
      </p>
    )
  }
}

export {Rides}

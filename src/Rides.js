import React, { Component } from 'react'
import ReactJson from 'react-json-view'

class Rides extends Component {

  render() {
    return(
      <div>
        {this.props.list && <ReactJson src={this.props.list}/>}
        {this.props.errorMessage &&
          <p>
            {this.props.errorMessage}
          </p>}
        {!this.props.list && <p>
          Waiting for rides to load
        </p>}
      </div>
    )
  }
}

export default Rides

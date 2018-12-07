import React, { Component } from 'react'
import './App.css'
require('dotenv').config()

class App extends Component {
  render() {
    let msg = JSON.stringify(process.env)
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Ride Sharing
          </p>
        </header>
        <p>
          All environment variables: {msg}
        </p>
      </div>
    )
  }
}

export default App;

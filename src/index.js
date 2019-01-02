import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import jose from 'node-jose'
import './css/index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

const config = {
  baseURL: process.env.REACT_APP_ISSUER,
  url: '.well-known/openid-configuration',
  method: 'get'
}
axios(config)
  .then(res => {
    const jwksConfig = {
      url: res.data.jwks_uri,
      method: 'get'
    }
    axios(jwksConfig)
      .then(jwksRes => {
        jose.JWK.asKeyStore(jwksRes.data.keys)
          .then(keystore => {
            ReactDOM.render(<App truststore={keystore}/>,
              document.getElementById('root'))
            })
          .catch(err => {
            ReactDOM.render(<p>{`cannot create a truststore - ${err}`}</p>,
              document.getElementById('root'))
          })
        })
      .catch(err => {
        ReactDOM.render(<p>{`cannot retrieve JWKS - ${err}`}</p>,
          document.getElementById('root'))
      })
  })
  .catch(err => {
    ReactDOM.render(<p>{`cannot retrieve authorization server configuration - ${err}`}</p>,
      document.getElementById('root'))
  })

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

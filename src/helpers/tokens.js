import jose from 'node-jose'


const verify = (token, truststore) => {
  /**
  * @function
  * verifies the JWT. The function throws an error unless
  *  - token.header.alg is RS256
  *  - the verifying key identified by token.header.kid is in the truststore
  *  - token.signature verifies with the verifying key
  *  - token.payload.aud is the current client's ID (process.env.REACT_APP_CLIENT_ID)
  *  - token.payload.iss is the trusted issuer (process.env.REACT_APP_ISSUER)
  *  - token.payload.exp is greater than Date.now()
  *  - token.payload.iat is not greater than Date.now()
  *
  * Unfortunately, the nonce, if present, cannot be verified here since it echoes
  * the nonce sent with the authorization request.
  *
  * @param {String} token The base64 encoded JWT.
  * @param {jose.JWK.KeyStore} truststore A KeyStore with verifying keys.
  * @returns {Promise} promise - resolves to the token payload.
  */
  return jose.JWS.createVerify(truststore, {algorithms: 'RS256', allowEmbeddedKey: false})
        .verify(token)
        .then(verifiedToken => {
          const payload = JSON.parse(jose.util.base64url.decode(token.split('.')[1]))
          if (payload.aud !== process.env.REACT_APP_CLIENT_ID)
            throw new Error(`token issued for ${payload.aud}, expected ${process.env.REACT_APP_CLIENT_ID}`)
          if (payload.iss !== process.env.REACT_APP_ISSUER)
            throw new Error(`token issued by ${payload.iss}, expected ${process.env.REACT_APP_ISSUER}`)
          if (payload.exp * 1000 <= Date.now())
            throw new Error(`token expired: ${payload.exp * 1000} <= ${Date.now()}`)
          if (payload.iat * 1000 > Date.now())
            throw new Error(`token has not been issued yet. Clock skew?`)
          return payload
        })
        .catch(err => {
          throw new Error(`token verification fails - ${err}`)
        })
}

export {verify}

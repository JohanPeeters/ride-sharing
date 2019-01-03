import jwtDecode from 'jwt-decode'


const getPayload = token => {
  return jwtDecode(token)
}

export {getPayload}

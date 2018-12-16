/** key in local storage for the key of the current authorization state. */
const AUTHORIZATION_STATE_KEY = 'current_authorization_state_key'

/** key for the current authorization state. */
const authorizationStateKey =
    (handle: string) => {
      return `${handle}_appauth_authorization_request`;
    }

export class Auth {
  static currentSession() {
    const handle = window.localStorage.getItem(AUTHORIZATION_STATE_KEY)
    if (handle) return window.localStorage.getItem(authorizationStateKey)
    else return undefined
  }
}

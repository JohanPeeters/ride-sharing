# Ride sharing

This is an SPA written for didactic purposes. It consumes a backend API defined in [a companion, Ride Sharing API project](https://github.com/JohanPeeters/rides-api).

## Getting Started

If you only want to observe the behavior of this SPA, you can do so at https://ride-sharing.tk. On the other hand, you can also set up your own experiments by cloning the repo and making changes. Here are the instructions for running the application locally:

1. Gain access to a backend API by setting one up for yourself or requesting the following from the author:
   * the URL (including stage) of the API
   * an API key
   * the URL of the authorization server (issuer)
   * a client ID
1. `git clone https://github.com/JohanPeeters/ride-sharing`
1. `cd ride-sharing`
1. All the information allowing you to connect to the API need to be supplied to the SPA. To do so, set the following environment variables, either in the shell or, better, in a `.env` file:
   * `REACT_APP_API`
   * `REACT_APP_API_KEY`
   * `REACT_APP_ISSUER`
   * `REACT_APP_CLIENT_ID`
1. `npm start`
   * starts a development server
   * opens a tab in the default browser
   * loads the SPA.
1. Make changes and watch the effects on the application.

## React

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More about React

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Security

### Access Control

The API is secured with an [AWS Cognito User Pool](https://docs.aws.amazon.com/cognito), which means that certain API calls will only succeed if accompanied by an appropriate security token. So, the SPA obtains tokens from Cognito. It uses the [JSO](https://github.com/andreassolberg/jso) OAuth 2.0 library to do so. In other words, it uses an OAuth redirection flow to request tokens. This means that the user is redirected to a Cognito hosted page for an authentication dialog. The more common solution is to offer the user a form embedded into the SPA to enter credentials. Indeed, this is the only option available in the library supplied by AWS to interact with Cognito, [Amplify Authenticate](https://aws-amplify.github.io/docs/js/authentication). Apart from *embedded authentication*, this technique is also often referred to as *cross-origin authentication*.

#### Log in

When the user logs in, he or she is redirected to a page hosted by Cognito containing a form requesting credentials. In the response headers, Cognito sets a cookie to keep track of the session. When the user authenticates successfully, Cognito returns security tokens via a redirect to the SPA and marks the session as authenticated. This means that when the user is redirected again to Cognito within the validity period of the authenticated session, tokens are re-issued without the need to re-enter credentials.

JSO checks whether there is an outstanding request for the received tokens and stores them in local storage.

#### Log out

The user may wish to stop using his or her credentials on the back end. There is no good way of doing this within the validity period of the session between the user agent and Cognito: JSO offers a `wipeTokens()` function, which discards tokens from local storage. However, a new login request is immediately satisfied without further authentication since the session between the user agent and Cognito has not expired. Removing the cookie is not an option since it is HttpOnly.

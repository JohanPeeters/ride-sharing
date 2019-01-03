# Ride sharing

This is an SPA written for didactic purposes. It consumes a backend API defined in [a companion, Ride Sharing API project](https://github.com/JohanPeeters/rides-api).

## Prerequisites

Node 8.x

## Getting Started

If you only want to observe the behavior of this SPA, you can do so at https://ride-sharing.tk. On the other hand, you can also set up your own experiments by cloning the repo and making changes. Here are the instructions for running the application locally:

1. Gain access to a backend API by setting one up for yourself or requesting the following from the author:
   * the URL (including stage) of the API
   * an API key
   * the issuer's URL
   * a client ID
1. `git clone https://github.com/JohanPeeters/ride-sharing`
1. `cd ride-sharing`
1. All the information allowing you to connect to the API need to be supplied to the SPA. To do so, set the following environment variables, either in the shell or, better, in a `.env` file:
   * `REACT_APP_API_KEY`
   * `REACT_APP_API_HOST`
   * `REACT_APP_API_STAGE`
   * `REACT_APP_CLIENT_ID`
   * `REACT_APP_ISSUER`
   * `REACT_APP_HOTJAR_ID`
   * `REACT_APP_HOTJAR_SNIPPET_VERSION`
   * `REACT_APP_HOTJAR_SRI`
   * `REACT_APP_HOTJAR_INLINE_SETUP_SRI`
   * `REPORT_URI_SUBDOMAIN`
   * `AS`
1. `npm install`
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

The API is secured with an [AWS Cognito User Pool](https://docs.aws.amazon.com/cognito), which means that certain API calls will only succeed if accompanied by an appropriate security token. So, the SPA obtains tokens from Cognito. It uses the [oidc-client-js](https://github.com/IdentityModel/oidc-client-js) OpenID Connect library to do so. In other words, it uses the OAuth Authorization Code flow with PKCE to request tokens. This means that the user is redirected to a Cognito hosted page for an authentication dialog. The more common solution is to offer the user a form embedded into the SPA to enter credentials. Indeed, this is the only option available in the library supplied by AWS to interact with Cognito, [Amplify Authenticate](https://aws-amplify.github.io/docs/js/authentication). This is called *embedded authentication*, but also often referred to as *cross-origin authentication*.

#### Log in

When the user logs in, he or she is redirected to a page hosted by Cognito containing a form requesting credentials. In the response headers, Cognito sets a cookie to keep track of the session. If the user authenticates successfully, Cognito returns a code via a redirect to the SPA and marks the session as authenticated. This means that when the user is redirected again to Cognito within the validity period of the authenticated session, codes are re-issued without the need to re-enter credentials.

oidc-client checks whether there is an outstanding request for the received code and, if so, exchanges the code for security tokens and stores them in local storage.

#### Log out

The user may wish to stop using his or her credentials on the back end. There is no good way of doing this within the validity period of the session between the user agent and Cognito: oidc-client offers a `removeUser()` function, which discards tokens from local storage, and Cognito has a logout endpoint which invalidates tokens. However, a new login request is immediately satisfied without further authentication since the session between the user agent and Cognito has not expired. Removing the cookie is not an option since it is HttpOnly.

## Open Issues

* *log out* - see above.
* *flicker on redirect* - when the user is logged in to the authorization server, but has cleared tokens, he or she can log back in without re-authenticating if the authenticated session has not expired (see above). In this scenario, there is a redirect from the client to the AS and back to the client without any user interaction. Ideally, the user would not notice. This is not the case since a redirect causes the React application to reload and re-render. My current thinking is that this is inherent in React and can only be avoided with considerable effort, but I am hoping to be proven wrong. Moving to popups does not seem to be a fruitful approach as it would merely replace one UI glitch with another.
* *token validity period* is 1 hour. This is rather long, but fixed by Cognito and, at the time of writing, cannot be changed.
* *network round trips* - each time a token is requested, issuer metadata are retrieved. oidc-client-js seems to do this by design. Since metadata, such as the location of the authorization or token endpoints change only very sporadically, they are prime candidates for caching. This could be done with the service worker. Currently, the service worker is disabled.
* the *script-src and style-src* CSP directives were designed to mitigate the risk of, respectively, script injection (XSS) and CSS. Unless explicitly allowed, the browser refuses to run any inline scripts. However, React uses both scripts and styles inline. It has been pointed out in the React community that this does not sit well with CSP, but there is no clear strategy or timeline on how this can be resolved. For now, therefore, the choice is between no CSP at all or one that is rather inadequate because it allows inlining scripts and styles.
* *script-src and style-src vs script-src-elem and style-src-elem* - the former are currently standardized, the latter are in the CSP level 3 draft standard. The latter affords more fine-grained control and will presumably become the directives of choice. As they are still at the draft stage, they have not been used for now.
* *GDPR* - the application loads a hotjar script that records the entire session. The user is not warned and cannot object or request for the data to be deleted. This has to be an infringement of GDPR somehow.
* *token validation* - oidc-client validates a number of claims such as `iss`, `iat`, `exp`, `aud` and `azp`. However, it does not verify the signature. Before placing the user in an authenticated context, `App` calls `helpers/tokens.verify()` to verify the signature. At the moment, this method also performs a number of redundant claim checks.

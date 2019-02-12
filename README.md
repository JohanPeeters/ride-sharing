# Ride sharing

This is an SPA written for didactic purposes. It consumes a backend API defined in [a companion, Ride Sharing API project](https://github.com/JohanPeeters/rides-api).

## Prerequisites

Node 8.x

## Prerequisites - Windows only
* MinGW with base MSYS package added to your PATH
* `copy c:\MinGW\bin\mingw32-make.exe c:\MinGW\bin\make.exe`
* `copy c:\MinGW\bin\mingw32-make.exe c:\MinGW\bin\make.exe`

## Getting Started

If you only want to observe the behavior of this SPA, you can do so at https://ride-sharing.tk, a site hosted on [Netlify](https://netlify.com). 

On the other hand, the instructions to set up your own experiments by cloning the repo and making changes locally are provided here. In addition, we also provide instructions to get the app up and running on Netlify, since that's the platform we chose to use for our exercise playground. You are free to use your own preferred platform, but you will lose the automatical configuration of the HTTP headers based on the environment variables. 

### Preparation:
* (Optional) Should you wish to host the app on netlify, create an account at https://www.netlify.com/
* (Optional) Set up your own authorization server and back-end API if not provided by the instructor by following the Getting Started section at https://github.com/JohanPeeters/rides-api
* (Optional) Create a freenom account at https://www.freenom.com
* (Optional) Register an account at https://report-uri.com

### Get the code
First clone into the repo  
`git clone https://github.com/JohanPeeters/ride-sharing.git`  
`cd ride-sharing`

Create a .env file in the root directory of the project:

    REACT_APP_API_KEY=<The AWS API key>
    REACT_APP_API_HOST=<API location (exclude the scheme)>
    REACT_APP_API_STAGE=<in case you use a path to indicate staging, leave empty if you are not certain>
    REACT_APP_CLIENT_ID=<the client ID registered at the authorization server>
    REACT_APP_ISSUER=<the issuer of the ID token>
    REPORT_URI_SUBDOMAIN=<in case you created a report-URI account, the subdomain of your report-URI account>
    AS=<AS location (exclude the scheme)>
    INLINE_RUNTIME_CHUNK=false

`npm install`  

### Run the code locally
`npm start`

This will start a development server, open a tab in your default browser, and load the SPA. You can now make changes and the changes will be live-reloaded.

### Deploy the code to Netlify
Should you wish to deploy the code to Netlify, simply run  
`make all`

Note that this will also prepare the netlify.toml and _headers file for deployment on Netlify in order for Netlify to set the correct HTTP headers automatically. 

In case you're simply copy pasting the build folder to Netlify you now have to copy paste the build folder.  
In case you have configured Netlify for continuous deployment, the deploy will happen automatically.  
Do not forget to manually set the environment variables in the settings of the Netlify app. 

### Deploy the code to a different platform
To get a compiled build folder, you can still run
`make all`

But you will have to find a different way to set the HTTP Headers (usually, this is platform-specific). 

## React

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can also run the following scripts. Note that by directly running these, the netlify.toml and headers file will not be modified using the variables present in the .env file:

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
* the *script-src* CSP directive was designed to mitigate the risk of XSS. Unless explicitly allowed, the browser refuses to run any inline scripts. By default React uses an inline script. This can be switched off in a production environment by setting the `INLINE_RUNTIME_CHUNK` to `false`.
* the *style-src* CSP directives was designed to mitigate the risk of CSS injection. Unless explicitly allowed, the browser refuses to load any inline styles. However, this application uses Material UI, which in turn relies on JSS for styling. JSS places styles inline. JSS documentation suggests [protecting these with a nonce](https://cssinjs.org/csp?v=v10.0.0-alpha.7), but the suggested technique relies on express middleware. Since our application is delivered as a static file, there is no need for express. Indeed, as nonces rely on being unique for every running instance, they cannot be used in this context. The 2 remaining alternatives are
   * supply an SRI-hash for every inline styles,
   * allow `unsafe-inline`.
I'm ashamed to admit I opted for this one. There are just too many inline styles for the former.
* *script-src and style-src vs script-src-elem and style-src-elem* - the former are currently standardized, the latter are in the CSP level 3 draft standard. The latter affords more fine-grained control and will presumably become the directives of choice. As they are still at the draft stage, they have not been used for now.
* *token validation* - oidc-client validates a number of claims such as `iss`, `iat`, `exp`, `aud` and `azp`. However, it does not verify the signature. Before placing the user in an authenticated context, `App` calls `helpers/tokens.verify()` to verify the signature. At the moment, this method also performs a number of redundant claim checks.

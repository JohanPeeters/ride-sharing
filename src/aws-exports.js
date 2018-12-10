export const aws_exports = {
  Auth: {
    // REQUIRED - Amazon Cognito Region
    region: 'eu-west-1',
    // OPTIONAL - Amazon Cognito User Pool ID
    userPoolId: 'eu-west-1_JbCcBZNCm',
    // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: '2fquluhrnam6ahuh2uclcqd6d'
  },
  API: {
    endpoints: [
        {
            name: "RideSharingAPI",
            endpoint: "https://3o7a5pnqt7.execute-api.eu-west-1.amazonaws.com"
        }
    ]
  }
}

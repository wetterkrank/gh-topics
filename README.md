# GitHub Topics Cloud
Displays a cloud-like list of topics for the given GitHub username.  
A click on a topic opens a popup with the list of related repos.

Demo: https://github-topics-cloud.vercel.app/

## Limitations
- Due to GitHub's REST API design and rate limits for unauthenticated requests, it takes a while to load all topics. In case of over 50 repositories for the username, your IP can hit the API rate limit.

## To do
- Saving the results in local storage
- Better API rate limit handling
- Option to copy the list as HTML with styles, to be pasted in a web page
- This app as a React component
- Implement GH OAuth and GraphQL to enable faster requests

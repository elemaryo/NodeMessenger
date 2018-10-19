import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import 'semantic-ui-css/semantic.min.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import * as firebase from 'firebase'
      // Initialize Firebase


var config = {
    apiKey: "AIzaSyDiUZegEvS10yKuSLMS0V2ZurdbJXyIYP4",
    authDomain: "nodem-2edaa.firebaseapp.com",
    databaseURL: "https://nodem-2edaa.firebaseio.com",
    projectId: "nodem-2edaa",
    storageBucket: "nodem-2edaa.appspot.com",
    messagingSenderId: "33137095871"
}
firebase.initializeApp(config)

var database = firebase.database()

  ReactDOM.render(<App firebase={firebase}/>, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
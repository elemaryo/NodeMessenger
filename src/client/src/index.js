import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';
      // Initialize Firebase


var config = {
    apiKey: "AIzaSyDiUZegEvS10yKuSLMS0V2ZurdbJXyIYP4",
    authDomain: "nodem-2edaa.firebaseapp.com",
    databaseURL: "https://nodem-2edaa.firebaseio.com",
    projectId: "nodem-2edaa",
    storageBucket: "nodem-2edaa.appspot.com",
    messagingSenderId: "33137095871"
};
firebase.initializeApp(config);

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      ReactDOM.render(<App firebase={firebase} user={user} />, document.getElementById('root'));
    } else {
      // User is signed out.
      ReactDOM.render(<App firebase={firebase} user={null} />, document.getElementById('root'));

    }
  });


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();

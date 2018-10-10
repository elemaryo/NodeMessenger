import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './components/Login/login';
import Login from './components/Login/login';
import Messenger from './components/Messenger/messenger'

class App extends Component {

	constructor(props){
		super(props);
			this.state = {
				uid: '',
				user: this.props.user,
			}

  	}
	
	
	signIn = (email, password) => {
		// this.props.firebase.auth().setPersistence(this.props.firebase.auth.Auth.Persistence.LOCAL)
		// 			.then((userData) => {
					
		// 				return this.props.firebase.auth().signInWithEmailAndPassword(email, password);
		// 			})
		// 			.catch((error) => {
		// 				console.log(error)
		// 			})

		this.setState({showScene:'messenger'})

		
	  }
	handleSignIn = (email, password) => {
		this.props.firebase.auth().signInWithEmailAndPassword(email, password)
					.then((userData) => {
					//switch scenes, render it
					//get user's chat data
					//render updated scene 
						this.signIn(email, password)
					})
					.catch((error) =>{console.log(error)})

		/*
		TODO: Implement ERROR CODES and render it on screen
		Refer DOCS for error codes
		https://firebase.google.com/docs/reference/js/firebase.auth.Auth?authuser=0#signInWithEmailAndPassword
		*/
	}

	handleSignUp = (email, password) => {
		this.props.firebase.auth().createUserWithEmailAndPassword(email, password)
					.then((userData) => {
						//Sign-Up process automatically signs in user 
						//so repeat the same process here as sign in
						this.signIn(email, password)
					})
					.catch((error) =>{console.log(error)})


	}

	render() {

		const user = this.state.user
		const scene = user ? <Messenger/> : <Login onSignIn={this.handleSignIn} onSignUp={this.handleSignUp}/>

		return (
		<div className="App">
			<header className="App-header">
				{scene}
			</header>
		</div>
		);
	}
}

export default App;

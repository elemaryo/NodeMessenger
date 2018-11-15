import React, { Component } from 'react'
import logo from './res/logo.svg'
import appLogo from './res/applogo.svg'
import './App.css'
import Login from './components/Login/login'
import Chat from './components/Chat/chat'


const LoadingScreen = () => (
	<header className="App-header">
		<div>
			<div>
				<img alt="Logo" src={appLogo} className="AppLogo"/>
			</div>
			<div>
				<img src={logo} className="Loading-logo" alt="Loading" />
			</div>
		</div>
	</header>
)

/**
 * App component
 */
class App extends Component {

	constructor(props){
		super(props);
		this.state = {
			authChecked: false,
			user: null,
			databaseRef: this.props.firebase.firestore()
		}
		
		//Disable deprecated features:
		this.state.databaseRef.settings({timestampsInSnapshots: true})
  	}
	
	componentDidMount(){
		this.props.firebase.auth().onAuthStateChanged((user) => {
			console.log('authchecked')
			this.setState({user: user, authChecked: true})
		})
	}
	/*
	signIn = (email, password) => {
		// this.props.firebase.auth().setPersistence(this.props.firebase.auth.Auth.Persistence.LOCAL)
		// 			.then((userData) => {
					
		// 				return this.props.firebase.auth().signInWithEmailAndPassword(email, password);
		// 			})
		// 			.catch((error) => {
		// 				console.log(error)
		// 			})

		// this.setState({showScene:'messenger'})

		
	  }
	  */
	handleSignIn = (email, password) => {
		this.props.firebase.auth().signInWithEmailAndPassword(email, password)
					.then((userData) => {
					//switch scenes, render it
					//get user's chat data
					//render updated scene 
						console.log(userData)
						this.signIn(email, password)
					})
					.catch((error) =>{console.log(error)})

		/*
		TODO: Implement ERROR CODES and render it on screen
		Refer DOCS for error codes
		https://firebase.google.com/docs/reference/js/firebase.auth.Auth?authuser=0#signInWithEmailAndPassword
		*/
	}

	//Sign-Up process automatically signs in user 
	handleSignUp = (email, password, userName) => {
		this.props.firebase.auth().createUserWithEmailAndPassword(email, password)
					.then((userData) => {
						
					
						//update user data on database
						userData.user.updateProfile({
							displayName: userName
						}).then().catch((error) => console.log(error))

						var database = this.state.databaseRef
						database.collection('users').doc(userData.user.uid).set({
							displayName: userName,
                            email: email,
                            conversations: []
						}).then().catch((error) => console.log(error))

						
					})

					.catch((error) =>{console.log(error)})


	}

	handleSignOut = () => {
		console.log('signing out')
		this.props.firebase.auth().signOut().then(function() {
			// Sign-out successful.
		  }).catch(function(error) {
			// An error happened.
		  })
	}

	render() {

		const user = this.state.user
		var scene;
		if(!this.state.authChecked)
			scene = <LoadingScreen/>
		else
			scene = user ?  <Chat firebaseRef={this.props.firebase} database={this.state.databaseRef} onSignOut={this.handleSignOut} user={user} /> : <Login onSignIn={this.handleSignIn} onSignUp={this.handleSignUp}/>
			
		
			
		return (
			<div className="App">
				{scene}
			</div>
		)
	}
}

export default App

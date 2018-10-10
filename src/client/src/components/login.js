import React, { Component } from 'react';

class Login extends Component {

    //declaring a constructor means the component is stateful i.e. it stores the data for the component that may 
    //change throughout the usage of that component
    //here since the component Login serves as the login ui it has to track the email and password that users
    //have entered so far
    constructor(props){
    
        super(props)
        this.state = {
            email: '',
            password: ''
        }
    
    }

    handleSubmit = (event) => {
        event.preventDefault();
        console.log('user login')
        if (this.state.email && this.state.password){
            console.log(this.state.email);
            console.log(this.state.password);
            // console.log(firebase);
        }

    }

    handleChange = (event) => {
        this.setState({[event.target.id]: event.target.value});
    }

    toggleLogin = () => {
        //here change the state to show sign up page

    }


    render() {
    //react components are basically blocks of html code
    //the render method returns this block of code whenever this component is called/updated
    //Look at App.js and how this component is used
    //Just like html you can add attributes such as className='login-div' or id='login-div' to apply css styling
    //If using css its better to create a seperate css. i.e. create a css file and import it in the declaration


        return (
        <div>   
            <form onSubmit={this.handleSubmit}>
                <div>
                    <label>Email:
                        <input type='text' value={this.state.email} id='email' onChange={this.handleChange}></input>
                    </label>
                </div> 
                <div>
                    <label>Password:
                        <input type='password' value={this.state.password} id='password' onChange={this.handleChange}></input>
                    </label>
                </div>
                <input type='submit' value='Login'></input>
                <button onClick={this.toggleLogin}>Sign Up</button>
            </form>
        </div>
        );
    }
}

export default Login;

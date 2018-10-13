import React from 'react';
import { Segment, Header, Form, Button, Icon } from 'semantic-ui-react';
import './signin.css'

class SignIn extends React.Component {
    state = { email: '', password: '' }

    handleChange = (e) => this.setState({ [e.target.id]: e.target.value })
  
    handleSubmit = () => {
    
      const { email, password } = this.state
      if (email && password){
        this.props.onSignIn(email, password);
      }
    }
  
    
    toggleLogin = () => {
        //here change the state to show sign up page

    }
    render() { 
        return (
            <div id='login'>
                <Segment padded='very'>
                    <div className='borders'>
                        <Header as='h1'>Login</Header>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <label><Icon name='mail' /> Email</label>
                                <input className='field' placeholder='john123@email.com' id='email' value={this.state.email} onChange={this.handleChange}/>
                            </Form.Field>
                            <Form.Field>
                                <label><Icon name='key' /> Password</label>
                                <input className='field' type='password' placeholder='Password' id='password' value={this.state.password} onChange={this.handleChange} />
                            </Form.Field>
                            <div style={{ textAlign:'center' }}>
                                <Button secondary>Login</Button>
                            </div>
                        </Form>
                    </div>
                </Segment>
            </div>
        );
    }
}
 
export default SignIn;
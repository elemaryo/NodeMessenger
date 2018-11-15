import React from 'react';
import { Segment, Header, Form, Button, Icon } from 'semantic-ui-react';
import './signup.css'

class Signup extends React.Component {
    state = { emailUp: '', passwordUp: '', confirmPasswordUp: '', displayName:'' }

    handleChange = (e) => this.setState({ [e.target.id]: e.target.value })
  
    handleSubmit = () => {
      
      const { emailUp, passwordUp, confirmPasswordUp, displayName } = this.state
      console.log(emailUp)
      if (passwordUp === confirmPasswordUp){
        this.props.onSignUp(emailUp, passwordUp, displayName);
      }
    }
    render() { 
        return (
            <div id='signup'>
                <Segment padded='very'>
                    <div className='borders'>
                        <Header as='h1'>Signup</Header>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <label><Icon name='user' /> Display Name</label>
                                <input className='field' placeholder='John' id='displayName' onChange={this.handleChange}/>
                            </Form.Field>
                            <Form.Field>
                                <label><Icon name='mail' /> Email</label>
                                <input className='field' type='email' id='emailUp' placeholder='john123@email.com' onChange={this.handleChange}/>
                            </Form.Field>
                            <Form.Field>
                                <label><Icon name='key' /> Password</label>
                                <input className='field' type='password' id='passwordUp' placeholder='Password' onChange={this.handleChange} />
                            </Form.Field>
                            <Form.Field>
                                <label><Icon name='key' /> Confirm Password</label>
                                <input className='field' type='password' id='confirmPasswordUp' placeholder='Password' onChange={this.handleChange}/>
                            </Form.Field>
                            <div style={{ textAlign:'center' }}>
                                <Button secondary>Signup</Button>
                            </div>
                        </Form>
                    </div>
                </Segment>
            </div>
        );
    }
}
 
export default Signup;
import React from 'react'
import { Segment, Grid, Divider, Header, Image } from 'semantic-ui-react'
import './login.css'
import Signup from './signup'
import SignIn from './signin'
import appLogo from '../../res/applogo.svg'

const Box = props => (
    <div>
        <Header color='teal' as='h1' textAlign='center'>
            <Image src={appLogo}/>Node Messenger
        </Header>
        <Segment inverted color='black' compact padded='very'>
            <Grid columns={2}>
                <Grid.Column>
                    <SignIn onSignIn={props.onSignIn} />
                </Grid.Column>
                <Divider inverted color='white' vertical style={{ left: '50%' }}>Or</Divider>
                <Grid.Column>
                    <Signup onSignUp={props.onSignUp}/>
                </Grid.Column>
            </Grid>
        </Segment>
    </div>
)

const Login = props => (
    <header className='App-header'>
        <Grid style={{height: '100%'}} verticalAlign='middle'>
            <Grid.Column>
                <div id='box'>
                    <Box onSignIn={props.onSignIn} onSignUp={props.onSignUp}/>
                </div>
            </Grid.Column>
        </Grid>
    </header>
)
    
 
export default Login
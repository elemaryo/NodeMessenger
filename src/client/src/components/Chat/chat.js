import React from 'react'
import { Grid, TextArea, Form, Input, Icon, Header, Image, Container, Segment, Comment, Divider } from 'semantic-ui-react'
import './chat.css'
import appLogo from '../../res/applogo.svg'
import io from 'socket.io-client'


const Message = props => (
  <div className='message' id={props.alignment}>
    <div id='message-data'>{props.message}</div>
  </div>
)

const ContactCard = props => (
  <div className='contacts-card' onClick={() => props.onClick(props.uid)}>
    <div id='contacts-icon'><Icon size='big' name='user'/></div>
    <div id='contacts-info'>
      <Header>{props.name}</Header>
    </div>
    <div id='contacts-last-message'>{props.lastMessage}</div>
  </div>
)

/**
 * 
 */
class Chat extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
					contacts: [],
					user: this.props.user,
					messages: [],
					socket: null,
         }
    }


    componentDidMount(){
      //get chat info here
      //connect to web sockets
		const socket = io('http://localhost:8080')
		
		socket.on('connect', () => {
			console.log(socket.id)
			
			socket.emit('set_name', {username:this.state.user.email})
			socket.emit('update-contacts')
			
			
		})
		
		socket.on('message', data => {
			this.setState({messages: [...this.state.messages, {alignment: 'l', data: data.message}]})
			})
		socket.on('update-contacts', data => {
			// console.log(data)
		})
	
		this.setState({socket: socket})

    }

    sendMessage = (e) => {
	  //this.state.socket.emit('private message', {to: 'john', data: message})
			e.preventDefault();
			const input = document.getElementById('message-input')
			const message = {alignment:'r', data: input.value}
			input.value = ''
			this.state.socket.emit('message', {message: message.data})
			this.setState({messages: [...this.state.messages, message]})
    }

    

    render() { 

		const conversation = this.state.messages.map((messageData, index) => {
			return(<Message key={index} alignment={messageData.alignment} message={messageData.data}/>)
		})

		const contacts = this.state.contacts.map((name) => {
			return(<ContactCard name={name} lastMessage='' uid='placeholder' onClick={this.showMessages}/>)
		})

		return(
			<div id='chat-grid'>
				<div id='chat-contacts-sidebar'>
					<div id='contacts-title-container'>
						<Header color='teal' as='h4' textAlign='center'>
							<Image src={appLogo} />
								Node Messenger
							</Header>
						<Divider/>
					</div>
					<div>
						{contacts}
					</div>
					<div id='contacts-signout' onClick={this.props.onSignOut}>
						Sign Out
					</div>
				</div>
				<div id='chat-divider'/>
				<div id='chat-message-box'>
					<div className='message-area'> 
						{conversation}
					</div>
					<div>
					<Form id='message-box' autocomplete='off' onSubmit={this.sendMessage}>
						<Input id='message-input' fluid icon={<Icon name='send' color='blue' circular link />} placeholder='Type a message' />
					</Form>  
					</div>
				</div>

			</div>
		)
    }
}
 
export default Chat
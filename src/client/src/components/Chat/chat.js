import React from 'react'
import { Form, Input, Icon, Header, Image, Divider, Label } from 'semantic-ui-react'
import './chat.css'
import appLogo from '../../res/applogo.svg'


const Message = props => (
  <div className='message' id={props.alignment}>
    <div id='message-data'>{props.message}</div>
  </div>
)

const ConversationCard = props => (
  <div className='conversation-card' onClick={() => props.onClick(props.cid)}>
    <div id='conversation-icon'><Icon size='big' name='user'/></div>
    <div id='conversation-info'>
      <Header>{props.members}</Header>
    </div>
    <div id='conversation-last-message'>{props.lastMessage}</div>
  </div>
)

/**
 * 
 */
class Chat extends React.Component {
    constructor(props) {

        super(props)
		console.log(this.props.user)
		this.state = { 
            conversations: [{cid: 'sdskds', members: 'Omar' , lastMessage: 'Yo'}],
			/*
				conversations
				{
					cid: 
					members:
					lastMessage: 

				}

			*/
            addConv: false,
            addSuccess: false,
			user: this.props.user,
			messages: [],
            databaseRef: this.props.database,

         }
    }


    componentDidMount(){
      //get chat info here
      //connect to web sockets
	/*
		cids = [user.cids]
		for(cid in cids):
			conversationsRef = conversations.cid.
			conversationsRef.orderBy('lastActive')
		
    */
        //get contacts once

        //listen for new messages
        
        //listen for contact changes
        var databaseRef = this.state.databaseRef
        databaseRef.collection("users").doc(this.state.user.uid)
            .onSnapshot((doc) => {
                var conversations = []
                //const conversationsIDs = doc.data().conversations.map((c) => c.cID)
            //     doc.data().conversations.forEach((conversationRef) => {
            //         databaseRef.collection('conversations').doc(conversationRef.id).get()
            //                     .then((doc) => conversations.push({cid: doc.data().id, members: doc.data().members, lastMessage: doc.data().lastMessage}))
            //                     .catch()
            //     })
            //    console.log(conversations[0])
            });

    }

    sendMessage = (e) => {
		//this.state.socket.emit('private message', {to: 'john', data: message})
			e.preventDefault();
			const input = document.getElementById('message-input')
			const message = {alignment:'r', data: input.value}
			input.value = ''
	
			this.setState({messages: [...this.state.messages, message]})
			
    }

	componentDidUpdate(){
		var elem = document.getElementById('message-area');
		elem.scrollTop = elem.scrollHeight;
    }
    

    showAddConvPopUp = () => {
        this.setState({addConv: !this.state.addConv})
    }

    handleAddConversation = (e) => {
        //look for user emails here
        var databaseRef = this.state.databaseRef
        var userID = this.state.user.uid
        var emailEntered = document.getElementById('popup-emailInput').value
        var cRef = null
        var newUid = null
        databaseRef.collection('users').where('email', '==', emailEntered)
                            .get()
                            .then(function(querySnapshot) {
                                console.log(querySnapshot)
                                //get user id of the person just added
								newUid = querySnapshot.docs[0].id
                               
                                // create a new conversation 			
								databaseRef.collection("conversations").add({
                                    members: [userID, newUid] 
							    })
                                    .then((conversationRef) => {
                                        cRef = conversationRef
                                    })
                                    .catch(function(error) {
                                        console.error("Error writing document: ", error);
                                    });
								
                                

                                //update both the client and user id to include the specific cid returned, 
								//use local variable cID and write to create ref 
								databaseRef.collection('users').doc(userID).update({
									conversations: databaseRef.FieldValue.arrayUnion(cRef)								
								})
                                databaseRef.collection('users').doc(newUid).update({
                                    conversations: databaseRef.FieldValue.arrayUnion(cRef)
                                })
                                
                        
                            })
                            .catch(function(error) {
                                console.log("Error getting documents: ", error);
                            })
    }

    render() { 
        const addSuccessLabel = <Label> </Label>
        const popup = this.state.addConv ? 
            <div id='popup-container'>
                <div id='popup-addConversation'>
                    <div id='popup-title'>
                        <Header size='large' inverted>
                            Enter user email 
                        </Header>
                        <Icon inverted size='big' id='popup-icon' name='close' onClick={this.showAddConvPopUp}></Icon>
                    </div>
                    <Divider/>
                    <Form onSubmit={this.handleAddConversation}>
                        <Input id='popup-emailInput' style={{width: '100%'}} 
                        icon={<Icon name='search' onClick={this.handleAddConversation} inverted circular link />} 
                        placeholder='Search...'/>
                    </Form>  
                </div>
            </div>
            : null
            

		const messages = this.state.messages.map((messageData, index) => {
			if(messageData.data !== ""){
				return(<Message key={index} alignment={messageData.alignment} message={messageData.data}/>)
			}
			else{
				return null
			}
		})

		const conversation = this.state.conversations.map((conversations) => {
			return(<ConversationCard members={conversations.members} lastMessage={conversations.lastMessage} onClick={this.showMessages}/>)
		})

		return(
			<div id='chat-grid'>
                {popup}
				<div id='chat-conversation-sidebar'>
					<div id='conversation-title-container'>
						<Header color='teal' as='h4' textAlign='center'>
							<Image src={appLogo} />
								Node Messenger
							</Header>
						<Divider/>
					</div>
					<div id='conversation-container'>
						<div>
							{conversation}
						</div>
						<Divider/>
						<div id='conversation-usercontrols'>
						
							<div id='conversation-signout' onClick={this.props.onSignOut}>
						
								Sign Out
							</div>
							<div id='conversation-addConv' onClick={this.showAddConvPopUp}>
								<Icon inverted size='big' name='add user'/>
							</div>
						</div>
					</div>
				</div>
				<div id='chat-divider'/>
				<div id='chat-message-box'>
					<div id='message-area'> 
						{messages}
					</div>
					<div>
					<Form id='message-box' autoComplete='off' onSubmit={this.sendMessage}>
						<Input id='message-input' fluid icon={<Icon name='send' color='blue' onClick={this.sendMessage} circular link />} placeholder='Type a message' />
					</Form>  
					</div>
				</div>

			</div>
		)
    }
}
 
export default Chat
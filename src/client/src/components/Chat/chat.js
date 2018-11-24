import React from 'react'
import { Form, Input, Icon, Header, Image, Divider } from 'semantic-ui-react'
import './chat.css'
import appLogo from '../../res/applogo.svg'


const Message = props => (
  <div className='message' id={props.alignment}>
    <div id='message-data'>{props.message}</div>
  </div>
)

const ConversationCard = props => (
    
    <div className='conversation-card' onClick={() => props.handleClick(props.cid)}>
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
            conversations: [],                  //stores the conversation metadata for this user
            addConv: false,                     //to handle add conversation pop up event
            addSuccess: false,                  //for displaying successful/error message when trying to start conversation
			user: this.props.user,              //firebase user object
            messages: [],                       //the messages in the current conversation
            messageUnsubscribe: null,           //reference to the message docs (used to detach listener, preventing memory leak)
            conversationRef: null,
            databaseRef: this.props.database,   //firestore reference for all read/write operations
            fetchTimestamp : null,               //keep track of when the messages were first fetched, so new messages can be pulled in after that
            membersToAdd: [{displayName: 'Shardool', uid:'s23imif23r23', email: 'shardool_patel@hotmail.com'}, 
                        {displayName: 'Omar', uid:'123412', email: 'omar@gmail.com'}]

         }
    }

   
    componentDidMount(){
      //get chat info here
    
        //get contacts once

        //listen for new messages
        
        //listen for contact changes
        var conversations = []
        var databaseRef = this.state.databaseRef
        databaseRef.collection("users").doc(this.state.user.uid)
            .onSnapshot((doc) => {
               
                // get callback promises and store it in an array
                var promises = [] 

                doc.data().conversations.forEach((conversationRef) => {
                    promises.push(databaseRef.collection('conversations').doc(conversationRef.id).get())   
                });
                //resolve. once all the data
                Promise.all(promises).then((docs) => {
                    docs.forEach((doc) => conversations.push(({cid: doc.id, 
                                                                members: doc.data().members, 
                                                                lastMessage: doc.data().lastMessage.message,
                                                                lastActive: doc.data().lastActive.toDate()})))
                    conversations.sort((a,b) => (a.lastActive > b.lastActive) ? 1 : ((b.lastActive > a.lastActive) ? -1 : 0)) 
                    this.setState({conversations: conversations})

                })
            })

    }

    componentDidUpdate = (prevProps, prevState) => {
        var elem = document.getElementById('message-area');
        elem.scrollTop = elem.scrollHeight;
        
        if(!this.state.conversationRef) {
            console.log('returning')
            return
        }

        if(prevState.conversationRef !== this.state.conversationRef){

            //unsubscribe/detach listener
            if(prevState.messageUnsubscribe)
            {
                console.log('detaching')
                prevState.messageUnsubscribe()

            }
                
            var databaseRef = this.state.databaseRef
            var unsubscribe = databaseRef.collection("messages").doc(this.state.conversationRef).collection("messageData").orderBy("timeSent").startAt(this.state.fetchTimestamp)
                .onSnapshot((snapshot) => {
                    console.log(snapshot.docs)

                        snapshot.docChanges().forEach((change) => {
                            if (change.type === "added") {
                                var doc = change.doc
                                let source = doc.metadata.hasPendingWrites ? 'Local' : 'Server'
                                if (source === 'Server') {
                                    this.setState({
                                        messages: [...this.state.messages, 
                                                    {message: doc.data().message, timeSent: doc.data().timeSent.toDate(), uid: doc.data().uid}],
                                    })
                                } else {
                                // Do nothing, it's a local update so ignore it
                                }
                                
                            }   
                        })
                    })

            this.setState({messageUnsubscribe: unsubscribe})

            //subscribe / add new listener
            
            
        }

    }
    
    componentWillUnmount = () => {
        if(this.state.messageUnsubscribe)
            this.state.messageUnsubscribe()
    }

    showMessages = (messagesRef) => {
        //get messages and attach a listener to the specific message doc
        //get the messages from messageData. order by 
        
        if (!this.state.conversationRef && messagesRef === this.state.conversationRef) return  //dont download again
        
        //thru the conversationRef get the mid and access the messages limit to first 50 order by timestamp
        //put query here and make a listener .onSnapshot ....
        // var query = ...
        // var databaseRef = this.state.databaseRef
        // var messages = databaseRef.collection("messages").doc(messagesRef).collection("messageData")

        // messages.orderBy("timeSent", "desc").limit(50)
        // .onSnapshot((querySnapshot) => {
                
        //         console.log(querySnapshot.docs[0].data().message) 
        //         //cycle through all the docs and store
        
        console.log('showing messsages')
        var databaseRef = this.state.databaseRef
        var messages = databaseRef.collection("messages").doc(messagesRef).collection("messageData")
        var messageObjects = []
        messages.orderBy("timeSent").limit(50).get()
            .then((querySnapshot) => {
                console.log(querySnapshot)
                querySnapshot.docs.forEach((doc) => {
                    messageObjects.push({message: doc.data().message, timeSent: doc.data().timeSent.toDate(), uid: doc.data().uid})
                })
                this.setState({conversationRef: messagesRef, messages: messageObjects, fetchTimestamp: new Date()})
            })
            .catch((err) => console.log(err))                    
            
        //this.setState({conversationRef: messagesRef}) 
        
    }
    sendMessage = (e) => {
        //this.state.socket.emit('private message', {to: 'john', data: message})

        if(!this.state.conversationRef) return //if no conversation is selected

        var messageRef = this.state.conversationRef
        var databaseRef = this.state.databaseRef
        e.preventDefault()
        const input = document.getElementById('message-input')
        if (input.value === "") return
        var timestamp = new Date()
        const messageData = {message: input.value, uid: this.state.user.uid, timeSent: timestamp}
        input.value = ''
        this.setState({messages: [...this.state.messages, messageData]})

        databaseRef.collection("messages").doc(messageRef).collection("messageData").add({
            message: messageData.message,
            timeSent: timestamp,
            uid: this.state.user.uid                                        
        })
			
    }

	
    

    showAddConvPopUp = () => {
        this.setState({addConv: !this.state.addConv})
    }

    handleAddConversation = (e) => {
        //look for user emails here
        var databaseRef = this.state.databaseRef
        var userID = this.state.user.uid
        var userDisplayName = this.state.user.displayName
        var emailEntered = document.getElementById('popup-emailInput').value
        var cRef = null
        databaseRef.collection('users').where('email', '==', emailEntered).get()
                            .then(function(querySnapshot) {
                                console.log(querySnapshot)
                                //get user id of the person just added
                                var addUID = querySnapshot.docs[0].id
                                var addDisplayName = querySnapshot.docs[0].data().displayName
                               
                                // create a new conversation 			
								databaseRef.collection("conversations").add({
                                    members: [{displayName: addDisplayName, uid: addUID},
                                                {displayName: userDisplayName, uid: userID}],
                                    lastActive:  databaseRef.ServerValue.TIMESTAMP,
                                    lastMessage: ""
							    })
                                    .then((conversationRef) => {
                                        cRef = conversationRef
                                    })
                                    .catch(function(error) {
                                        console.error("Error writing document: ", error);
                                    })
                                    
                                

                                //update both the client and user id to include the specific cid returned, 
								//use local variable cID and write to create ref 
								databaseRef.collection('users').doc(userID).update({
									conversations: databaseRef.FieldValue.arrayUnion(cRef)								
								})
                                databaseRef.collection('users').doc(addUID).update({
                                    conversations: databaseRef.FieldValue.arrayUnion(cRef)
                                })
                                
                        
                            })
                            .catch(function(error) {
                                console.log("Error getting documents: ", error);
                            })
    }

    render() { 
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
                    <Form>
                        <Input id='popup-emailInput' style={{width: '100%'}} 
                        icon={<Icon name='search' inverted circular link />} 
                        placeholder='Search...'/>
                    </Form>
                    <div id='popup-members'>
                        {/* {addedMembers} */}
                    </div> 
                </div>
            </div>
            : null
            

        const uid = this.state.user.uid
		const messages = this.state.messages.map((messageObject, index) => {
            var alignment = (uid === messageObject.uid) ? 'r' : 'l'
            return(<Message key={index} alignment={alignment} message={messageObject.message}/>)
		})
 
        
        //generate conversation cards
        console.log(this.state.messageUnsubscribe)
		const conversation = this.state.conversations.forEach((conversation) => {
            const members = conversation.members.mapEach((member) => {if(member.uid !== uid) return(<div key={member.displayName}>{member.displayName}</div>)})
			return(<ConversationCard key={conversation.cid} members={members} lastMessage={conversation.lastMessage} cid={conversation.cid} handleClick={this.showMessages}/>)
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

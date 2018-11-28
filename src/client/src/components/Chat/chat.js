import React from 'react'
import { Form, Input, Icon, Header, Image, Divider, Label, Segment, SegmentGroup, Button } from 'semantic-ui-react'
import './chat.css'
import appLogo from '../../res/applogo.svg'


const Message = props => (
    // access props.sentBy to get the name of the person who sent the message
    // access props.timeSent to get the time the message was sent

  <div>
      
      <div id="name" className={props.alignment}>
      
          {props.showDisplayName ? props.sentBy: ''}
          
      </div>
      <div>
      <div className={[props.alignment, "message"].join(' ')}>
      
      <div id='message-data' className={props.alignment==='r' ? "userColor":"otherColor"}>
      {props.message}</div>
      <div id="timeShow" className={props.alignment==='r' ? "timeL":"r"}>
      {props.timeSent.toLocaleString()}
      </div>
</div>

      </div>
      
      

      
  </div>
)

const ConversationCard = props => (
    <div className='conversation-card' id={props.selected ? 'conversation-card-selected': ''} onClick={() => props.handleClick(props.cid)}>
        <div id='conversation-icon'><Icon size='big' name={props.icon}/></div>
        <div id='conversation-info'>
            <Header>{props.members}</Header>
        </div>
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
            membersToAdd: [],
            initLoadMessages : 50,
            partialLoad : false,
            lastLoadedDocTimestamp: null,
            nextLoad: 100,
    

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
                console.log(promises)
                Promise.all(promises).then((docs) => {
                    conversations = []
                    docs.forEach((doc) => conversations.push(({cid: doc.id, 
                                                                members: doc.data().members, 
                                                                lastMessage: doc.data().lastMessage.message,
                                                                lastActive: doc.data().lastActive.toDate()})))
                    conversations.sort((a,b) => (a.lastActive > b.lastActive) ? 1 : ((b.lastActive > a.lastActive) ? -1 : 0))
                    console.log(conversations)
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
                
            var messageObjects = []
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
                                                    {message: doc.data().message, 
                                                        timeSent: doc.data().timeSent.toDate(), uid: doc.data().uid, 
                                                        displayName: doc.data().displayName}],
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
        if (!messages) return
        var messageObjects = []
        messages.orderBy("timeSent", "desc").limit(this.state.initLoadMessages).get()
            .then((querySnapshot) => {
                if (querySnapshot.docs.length === 0){
                    this.setState({conversationRef: messagesRef})
                    return
                } 

                for (let i = querySnapshot.docs.length - 1; i >= 0 ; i--) {
                    var doc = querySnapshot.docs[i]
                    messageObjects.push({message: doc.data().message, timeSent: doc.data().timeSent.toDate(), 
                        uid: doc.data().uid, displayName:doc.data().displayName})
                }

                this.setState({conversationRef: messagesRef, messages: messageObjects, 
                    fetchTimestamp: new Date(), lastLoadedDocTimestamp: messageObjects[0].timeSent, partialLoad: true})
            })
            .catch((err) => console.log(err))                    
            
        //this.setState({conversationRef: messagesRef}) 
        
    }

    loadMoreMessages = (e) => {

        var messageObjects = this.state.messages.slice()
            var databaseRef = this.state.databaseRef
            databaseRef.collection("messages").doc(this.state.conversationRef).collection("messageData")
                                            .orderBy("timeSent", "desc")
                                            .startAt(this.state.lastLoadedDocTimestamp)
                                            .limit(this.state.nextLoad+1)
                                            .get()
                .then((snapshot) => {
                    console.log(snapshot.docs)
                        if(snapshot.docs.length === 1)
                            this.setState({partialLoad: false})

                        
                        for (let i = 1; i < snapshot.docs.length ; i++) {
                            var doc = snapshot.docs[i]
                            console.log(doc.data())
                            messageObjects.unshift({message: doc.data().message, timeSent: doc.data().timeSent.toDate(), 
                                uid: doc.data().uid, displayName: doc.data().displayName})
                        }
                        this.setState({messages: messageObjects, lastLoadedDocTimestamp: messageObjects[0].timeSent})
                    })


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
            uid: this.state.user.uid,
            displayName: this.state.user.displayName                                   
        })
			
    }

	
    

    showAddConvPopUp = () => {
        this.setState({addConv: !this.state.addConv, membersToAdd: []},)
    }

    handleAddEmail = (e) => {
        
        var databaseRef = this.state.databaseRef
        var target = document.getElementById('popup-emailInput')
        var emailEntered = target.value
        if(!emailEntered) return 
        target.value = ""

        var obj = this.state.membersToAdd.find(member => member.email === emailEntered)
        if (obj || emailEntered === this.state.user.email) return // user already added

        var cRef = null
        this.state.databaseRef.collection('users').where('email', '==', emailEntered).get()
                            .then( (snapshot) => {
                                var doc = snapshot.docs[0]
                                if (doc){
                                    this.setState({membersToAdd: [...this.state.membersToAdd, {displayName: doc.data().displayName, 
                                                                                              email: emailEntered,
                                                                                              uid: doc.id}]})
                                }

                            })
    }

    handleAddConversation = (e) => {
        //look for user emails here
        if(this.state.membersToAdd.length === 0) return   
       // create a new conversation
        const membersToAdd = [...this.state.membersToAdd,
                            {displayName: this.state.user.displayName,
                            uid: this.state.user.uid,
                            email: this.state.user.email}]
                        
        const databaseRef = this.state.databaseRef
        databaseRef.collection("conversations").add({
            members: membersToAdd,
            lastActive:  new Date(),
            lastMessage: ""
        })
            .then((conversationRef) => {
                membersToAdd.forEach((member) => {
                    databaseRef.collection('users').doc(member.uid).update({
                        conversations: this.props.firebaseRef.firestore.FieldValue.arrayUnion(conversationRef)								
                    })
                })
                if(this.state.messageUnsubscribe)
                    this.state.messageUnsubscribe()
                this.setState({addConv: !this.state.addConv, messages: []})
                this.showMessages(conversationRef.id)
            })
            .catch(function(error) {
                console.error("Error writing document: ", error);
            })
            
        
        
        
        

        //update both the client and user id to include the specific cid returned, 
        //use local variable cID and write to create ref 
        // do the following once the user clicks on the add conversation button
        
        
       
                           
    }

    render() { 
        const addSuccessLabel = <Label> </Label>
        const displayMembers = this.state.membersToAdd.map((member) => <Segment key={member.uid}> {member.email} ({member.displayName})</Segment>)
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
                    <Form onSubmit={this.handleAddEmail}>
                        <Input id='popup-emailInput' style={{width: '100%'}} 
                        icon={<Icon name='add user' circular link onClick={this.handleAddEmail} />} 
                        placeholder='Add by Email...'/>
                    </Form>
                    <SegmentGroup id='popup-members'>
                        {displayMembers}
                    </SegmentGroup>
                    <Divider/>
                    <Segment id='popup-start' onClick={this.handleAddConversation}>
                        Start Conversation
                    </Segment>
                </div>
            </div>
            : null
            

        const uid = this.state.user.uid
        var messages = []
        
        for (let i = 0; i < this.state.messages.length ; i++) {
            var messageObject = this.state.messages[i]
            var alignment = (uid === messageObject.uid) ? 'r' : 'l'
            
            var showDisplayName = (i === 0  || this.state.messages[i - 1].uid !== messageObject.uid) && alignment !== 'r'
            console.log(showDisplayName, messageObject)
            messages.push(<Message key={i} alignment={alignment} sentBy={messageObject.displayName} 
                timeSent={messageObject.timeSent} showDisplayName={showDisplayName} message={messageObject.message}/>)
            
        }
        
        // this.state.messages.map((messageObject, index) => {
        //     var alignment = (uid === messageObject.uid) ? 'r' : 'l'
        //     return(<Message key={index} alignment={alignment} sentBy={messageObject.displayName} 
        //         timeSent={messageObject.timeSent} message={messageObject.message}/>)
		// })
        
       
        if(this.state.partialLoad)
            messages = <div>
                        <Button onClick={this.loadMoreMessages}>Load More Messages</Button>
                        {messages}
                      </div>
        
        //generate conversation cards

		const conversation = this.state.conversations.map((conversation) => {
            const members = conversation.members.map((member) => {if(member.uid !== uid) return(<div key={member.displayName}>{member.displayName}</div>)})
            var icon = 'user'
            if (conversation.members.length > 2) icon = 'users'

            return(<ConversationCard key={conversation.cid} selected={this.state.conversationRef === conversation.cid}
                                     icon={icon} members={members} lastMessage={conversation.lastMessage} cid={conversation.cid} 
                                     handleClick={this.showMessages}/>)
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
					
						<div id='conversation-conversationList'>
							{conversation}
						</div>
						
						<div id='conversation-usercontrols'>
						<Divider id='conversation-divider'/>
							<div id='conversation-signout' onClick={this.props.onSignOut}>
						
								Sign Out
							</div>
							<div id='conversation-addConv' onClick={this.showAddConvPopUp}>
								<Icon inverted size='big' name='add user'/>
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
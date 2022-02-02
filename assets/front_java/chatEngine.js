// socket for front end side
// it is known as subscriber file

class chatEngine{

    constructor(ChatBoxId,userEmail,userId){

        this.chatBox=$(`#${ChatBoxId}`);
        this.userEmail=userEmail;
        this.userId=userId;
        this.socket=io.connect('http://localhost:5000');
        
        if(this.userEmail){
            this.connectionHandler();
        }

    }

    connectionHandler(){
        // the connecting event name on front end side is 'connect' and in backend side is 'connection'

        // inside onconnect the 'this' will get changed so we have to save 'this' reference in some variable
        let self=this;
        this.socket.on('connect',function(){
            console.log('connection extablished using sockets');
            // first of all we have to make request to join a chatroom to the server by emitting event
            // yes the name of the will be 'join_room' here..we can name whatever we want..then server will join you in
            // that room namely 'codial' as requested by you..but if it isn't present then server will create a room
            // namely codial and join you over there and after joining it will also emit an event to tell everybody 
            // in that chatroom that you have joined the chatroom
            // so here we are emitting an event to join a chatroom
            self.socket.emit('join_room',{
                user_email:self.userEmail,
                chatroom:'codial'
            });
            // and here we are handling the event emitted by the server that you have joined chatroom
            self.socket.on('user_joined',function(data){
                console.log('a user joined!',data);
            });
            $('>form>button',self.chatBox).click(function(e){
                e.preventDefault();
                let message=$('>form>input',self.chatBox).val();
                if(message.length>0){
                    $('>form>input',self.chatBox).val("");
                    self.socket.emit('send_message',{
                        chatroomName:'codial',
                        email:self.userEmail,
                        message:message,
                        userId:self.userId
                    });
                }

            });
            self.socket.on('new_message',function(data){
                console.log('new message recieved',data);
                let cls='friend-msg';   

                if(data.email==self.userEmail){
                    cls='self-msg';
                }
                let messageHtml=`<li class="${cls} message">
                    ${data.message}
                </li>`
                $(' #messages',self.chatBox).append(messageHtml);
            });
        });
    }


}


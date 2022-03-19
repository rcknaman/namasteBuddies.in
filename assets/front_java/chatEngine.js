// socket for front end side
// it is known as subscriber file


class chatEngine{

    constructor(ChatBoxId,useremail,userid,username){

        this.chatBox=$(`#${ChatBoxId}`);
        this.userEmail=useremail;
        this.userId=userid.toString();
        this.username=username;
        this.socket=io.connect('http://50.19.145.241:5000');
        
        if(this.userEmail){
            this.connectionHandler();
        }
        // console.log('user._id.toString(): ',user._id.toString());
    }

    connectionHandler(){


        let self=this;
        let flag=1;//flag for handling nested click event here in 'initialchat'
        let groupFlag=1;
        let groupInfo=function(){

            $(document).on('click','.profile-btn',function(e){

                

                if($(this).attr('type')=='group'){

                    let groupId=$(this).parent().parent().attr('groupid');
                    console.log('groupId: ',groupId);
                    let admin=$(this).attr('admin');
                    $('#CreategroupModal form').attr('action',`/groups/update/${groupId}`);
                    $.ajax({
                        type:'get',
                        url:`/groups/info/${groupId}`,
                        success:function(data){

                            if(admin.toString()==self.userId.toString()){

                                let groupMembersDom=`
                                
                                <li class="list-group-item" aria-current="true">

                                    <p>
                                        ${data.data.group.admin.name}(admin)(You)
                                    </p>
                                </li>`;


                                for(let user of data.data.group.users){


                                    if(user._id.toString()!=self.userId.toString()){

                                        groupMembersDom+=

                                        `
                                        <li class="list-group-item form-check" aria-current="true">

                                            <input type="checkbox" id="grp_user_${user._id}" class="check_box" name="groupMembers" value="${user._id}" checked>
                                            <label class="form-check-label" for="grp_user_${user._id}">
                                            
                                                ${user.name}
                                            
                                            </label>
                                        </li>
                                        
                                        `

                                    }


                                }
                                for(let restuser of data.data.restUsers){

                                    groupMembersDom+=

                                    `
                                    <li class="list-group-item form-check" aria-current="true">

                                        <input type="checkbox" id="grp_user_${restuser._id}" class="check_box" name="groupMembers" value="${restuser._id}">
                                        <label class="form-check-label" for="grp_user_${restuser._id}">
                                        
                                            ${restuser.name}
                                        
                                        </label>
                                    </li>
                                    
                                    `




                                }
                                $('#CreategroupModal .list-group').html(`
                                
                                    ${groupMembersDom}
                                `);
                                console.log('group: ',data.data.group.description);
                                $('#CreategroupModal .group-name input').val(data.data.group.name);
                                console.log($('#CreategroupModal .group-desc input'));
                                $('#CreategroupModal .group-desc input').val(data.data.group.description);
                                $('#CreategroupModal .group-profile-pic img').attr('src',data.data.group.groupPic);
                                $('#CreategroupModal .create-group-form .group-section-heading').html('group Details');
                                $('#groupModalArea').html('Edit Group')
                                $(`#CreategroupModal button[type="submit"]`).html('Edit Group');
                                


                            }else{

                                let groupMembersDom=`
                                
                                <li class="list-group-item" aria-current="true">

                                    <p>
                                        ${data.data.group.admin.name}(admin)
                                    </p>
                                </li>
                                `;
                                for(let user of data.data.group.users){


                                    if(user._id.toString()==self.userId.toString()){

                                        groupMembersDom+=

                                        `
                                        <li class="list-group-item" aria-current="true">
    
                                            <p>
                                                ${user.name}(You)
                                            </p>
                                        </li>
                                        
                                        `

                                    }else{


                                        groupMembersDom+=

                                        `
                                        <li class="list-group-item" aria-current="true">
    
                                            <p>
                                                ${user.name}
                                            </p>
                                        </li>
                                        
                                        `

                                    }


                                }

                                $('#ShowGroupModal .list-group').html(`
                                
                                    ${groupMembersDom}
                                `);
                                console.log('group: ',data.data.group.description);
                                $('#ShowGroupModal .group-name input').val(data.data.group.name);
                                console.log($('#ShowGroupModal .group-desc input'));
                                $('#ShowGroupModal .group-desc input').attr('value',data.data.group.description);
                                $('#ShowGroupModal .group-profile-pic img').attr('src',data.data.group.groupPic);
                                

                            }
                        }
                    });

                }




            });


        }



        let initiateChat = function (self,friendId) {
            console.log('initiate chat');
            let chatHeader = $('#chat-container>div').first();

            function helper(curr,btn_source){


                if($(window).width()>890){




                    // console.log(`$('#chat-container').attr('friendId'): `,!$('#chat-container').attr('friendId'));
                    if(!$('#chat-container').attr('friendId') || $('#chat-container').attr('friendId').toString()!=friendId.toString()){
    
                        $.ajax({
    
                            type:'get',
                            url:`/message/loadMessage/${friendId}`,
                            success:function(data){
                                console.log('entered again 20e',friendId);
                                let messageDom=``;
                                if(data.data.isValid){

                                    $(' .notification-badge',$(this)).remove();
                                    $(chatHeader).css({
                                        'background-color': '#0A58CA',
                                        'color': "white"
                                    });
                                    $(' p', chatHeader).css('left', '10px');
                                    let username;
                                    console.log('btn_source: ',btn_source=='sideBarMsgBtn');
                                    if(btn_source=='sideBarMsgBtn'){
                                        username=$(' .profile-btn', $(curr).parent()).text();
                                        console.log($(' .profile-btn', $(curr).parent()).text());
                                    }else{
                                        username=$(curr).attr('username');
                
                                    }
                                    let userName = username+' '+'<i class="fas fa-angle-down"></i>';
                                    $(' p', chatHeader).fadeOut(200, function () {
                                        $(this).html(userName).fadeIn(500);
                                    });





                                    for(let message of data.data.messages){
    
                                        if(message.sentBy._id.toString()==self.userId.toString()){
                                            messageDom+=`
                                            
                                            <li class="self-msg">
                                                <div class="username"><p>You</p></div>
                                                <div class="msg-content"><p>${message.message}</p></div>
                                            </li>
                                            
                                            
                                            `
                                        }
                                        else{
                                            messageDom+=`
                                            
                                            <li class="user-msg">
                                                <div class="username"><p>${message.sentBy.name}</p></div>
                                                <div class="msg-content"><p>${message.message}</p></div>
                                            </li>               
                                            `
                                        }
        
        
                                    }

                                    $('#chat-container .chats-container').html(
        
                                        `<ul id="chats">`
        
                                        +messageDom+
        
        
        
                                        `</ul>
                                        <a href="#last-msg" style="display:none;"></a>
                                        <form id="create-msg" method="post" action='/message/create'>
                                            <div id="input-msg"><input type="text" placeholder="text here..."  name="message"></div>
                                            <input name="sentTo" type="hidden" value="${friendId}">
                                            
                                            <div id="send-msg"><button type="submit"><i class="fas fa-angle-double-right"></i></button></div>
                                        </form>`
                        
                        
                                    )
        
                                    $('#chats li').last().attr('id','last-msg');
        
                                                        
                                    function scrollToBottom(){
                                        const messages = document.getElementById('chats');
                                        const messagesid = document.getElementById('last-msg');
                                        if(messagesid){
                                            messages.scrollTop = messagesid.offsetTop;
                                        }
                                        
                                    }
                                    
                                    scrollToBottom();



                                }else{
                                    window.location.href = "/";
                                }
                            }
    
                        });
    
                        // $("#chats").animate({ scrollTop: 20000000 }, "slow");
                        $('#chat-container').attr('friendId',friendId);
                        $('#chat-container').attr('groupid','');
                        $('#chat-container').attr('type','friend');
                    }
     
                    if(flag==1){
                        // $(document).on('click',`#chat-container .heading i`,function(e){
                        //     e.preventDefault();
                        //     console.log($(this));
                        //     console.log(`$('#chat-container .chats-container'): `,$('#chat-container .chats-container'));
                        //     $(`#chat-container .chats-container`).toggleClass('minimize-chat-body');
                        //     $("#chat-container").toggleClass('minimize-chat-container');
                        //     $(this).toggleClass("fa-angle-up fa-angle-down");
                        // });
                        sendingMsg(self);
                        flag=0;
                    }

                }else{



                    window.location.href=`/message/messagepage/${friendId}`;




                }
    
            }


            $(document).on('click',`#friends li[friendId="${friendId}"] .initiate-msg`,function (e) {

                helper(this,'sideBarMsgBtn');
            });
            $(document).on('click',`.sendMsg button`,function (e) {

                helper(this,'profileMsgBtn');

            });

        }
        let groupInitiateMsg=function(self,groupId){
       
            let chatHeader = $('#chat-container>div').first();
            function helper(curr,groupId){

                console.log('groupId',groupId);
                if($(window).width()>890){




                    // console.log(`$('#chat-container').attr('friendId'): `,!$('#chat-container').attr('friendId'));
                    if(!$('#chat-container').attr('groupId') || $('#chat-container').attr('groupId').toString()!=groupId.toString()){
    
                        $.ajax({
    
                            type:'get',
                            url:`/groups/loadMessage/${groupId}`,
                            success:function(data){
                                console.log('entered again 20e',groupId);
                                let messageDom=``;
                                
                                if(data.data.isValid){

                                    $(' .notification-badge',$(curr)).remove();
                                    $(chatHeader).css({
                                        'background-color': '#0A58CA',
                                        'color': "white"
                                    });
                                    $(' p', chatHeader).css('left', '10px');
                                    let groupname;

                                    groupname=$(' .profile-btn', $(curr).parent()).text();

                                    groupname = groupname+' '+'<i class="fas fa-angle-down"></i>';
                                    $(' p', chatHeader).fadeOut(200, function () {
                                        $(this).html(groupname).fadeIn(500);
                                    });





                                    for(let message of data.data.messages){
    
                                        if(message.sentBy._id.toString()==self.userId.toString()){
                                            messageDom+=`
                                            
                                            <li class="self-msg">
                                                <div class="username"><p>You</p></div>
                                                <div class="msg-content"><p>${message.message}</p></div>
                                            </li>
                                            
                                            
                                            `
                                        }
                                        else{
                                            messageDom+=`
                                            
                                            <li class="user-msg">
                                                <div class="username"><p>${message.sentBy.name}</p></div>
                                                <div class="msg-content"><p>${message.message}</p></div>
                                            </li>               
                                            `
                                        }
        
        
                                    }

                                    $('#chat-container .chats-container').html(
        
                                        `<ul id="chats">`
        
                                        +messageDom+
        
        
        
                                        `</ul>
                                        <a href="#last-msg" style="display:none;"></a>
                                        <form id="create-msg" method="post" action='/groups/Createmessage'>
                                            <div id="input-msg"><input type="text" placeholder="text here..."  name="message"></div>
                                            <input name="groupId" type="hidden" value="${groupId}">
                                            
                                            <div id="send-msg"><button type="submit"><i class="fas fa-angle-double-right"></i></button></div>
                                        </form>`
                        
                        
                                    )
        
                                    $('#chats li').last().attr('id','last-msg');
        
                                                        
                                    function scrollToBottom(){
                                        const messages = document.getElementById('chats');
                                        const messagesid = document.getElementById('last-msg');
                                        if(messagesid){
                                            messages.scrollTop = messagesid.offsetTop;
                                        }
                                        
                                    }
                                    
                                    scrollToBottom();
 

                                }else{
                                    window.location.href = "/";
                                }
                            }
    
                        });
    
                        // $("#chats").animate({ scrollTop: 20000000 }, "slow");
                        $('#chat-container').attr('groupId',groupId);
                        $('#chat-container').attr('friendId','');
                        $('#chat-container').attr('type','group');
                    }
                    if(groupFlag==1){
                        // $(document).on('click',`#chat-container .heading i`,function(e){
                        //     e.preventDefault();
                        //     console.log($(this));
                        //     console.log(`$('#chat-container .chats-container'): `,$('#chat-container .chats-container'));
                        //     $(`#chat-container .chats-container`).toggleClass('minimize-chat-body');
                        //     $("#chat-container").toggleClass('minimize-chat-container');
                        //     $(this).toggleClass("fa-angle-up fa-angle-down");
                        // });
                        GroupSendingMsg(self);
                        groupFlag=0;
                    }


                }else{



                    window.location.href=`/groups/groupchatpage/${groupId}`;




                }
    
            }

            

            $(document).on('click',`#Groups li[groupid="${groupId}"] .msg-add-friend`,function (e) {
                helper(this,groupId);

            });





        }
        let deleteNotif=function(notificationType){
            $(document).on('click','.notif-close-btn',function(e){

                
                console.log($(this).parent().parent());
                let notif_self=this;
                console.log('$(this).parent().parent().attr("notif_uid"): ',);
                let notif_id=$(this).parent().parent().attr('notif_uid');
                let postid=$(this).parent().parent().attr('postid');
                let url;
                if(notificationType=='reqAccepted'){
                    url=`/users/delete-notifs/${notif_id}/${notificationType}/null`;
                }else if(!!postid){
                    url=`/users/delete-notifs/${notif_id}/${notificationType}/${postid}`;
                }
                $.ajax({

                    type:'get',
                    url:url,
                    success:function(data){
                        console.log($(notif_self).parent().parent());
                        $(notif_self).parent().parent().remove();
                        if($('#notification-bell li').length==1){
                            $('#no_notifs').prop('class','');
                        }
                    }
                })
            });
        }
        let removeFriend=function(){
            console.log($('#remove-friend'));
            // console.log($(`#friends li[friendid="${removedTo}"]`))   
            $(document).on('click','#remove-friend',function(e){
                e.preventDefault();
                $.ajax({

                    type:'get',
                    url:$(' a',$(this)).attr('href'),
                    success:function(data){
                        let avatarDom;
                        if(data.removedUserAvatar){
                            avatarDom=`<img src="${data.removedUserAvatar}>" alt="">`
                        }else{
                            avatarDom=`<i class="fas fa-user"></i>`
                        }
                        self.socket.emit('friend removed',{removedBy:self.userId,removedTo:data.removedUserId});
                        $('#remove-friend').remove();
                        $(`#friends li[friendid="${data.removedUserId}"]`).remove();


                        $('#users').prepend(`
                        
                            <li id="all_users_id_${data.removedUserId}">
                                <div class="list-content-wrapper">
                                <a href="/users/profile/${data.removedUserId}" class="profile-btn">
                                    
                                    <div class="img-container">
                                    ${avatarDom}
                                    </div>
                                    
                                    ${data.removedUserName}
                                
                                </a>
                                <a href="" class="msg-add-friend" userIdValue="${data.removedUserId}">
                                <i class="fas fa-user-plus"></i>
                                </a>
                                </div>
                                <div class="side-list-border"></div>
                            </li>
                        `)
                        let friendCount=$('#friends-count div').last().html();
                        console.log(typeof(friendCount));
                        $('#friends-count div').last().html(+friendCount -1);
                        $('#add-friend').attr('class','toggleFriendReq');
                        $('#add-friend button').html('Add friend');
                        $('#create-msg')
                    }
    
                })
            });



        }
        let acceptRejectBtn=function(){


            function helper(curr){
                let fromUserId=$(' .req-detail',$(curr).parent().parent()).attr('userid');
                if(!fromUserId){
                    fromUserId=$(curr).parent().attr('userid')
                }
                console.log('fromUserId: ',fromUserId);
                let decision=$(curr).attr('decision');

                // when clicking on accept button
                if(decision=='accept'){

                    $.ajax({

                        type:'post',
                        url:`/users/friends/toggle/${fromUserId}`,
                        success:function(data){
                            console.log('sucess:' ,data);
                            $(`a[userid="${fromUserId}"].req-detail`).parent().parent().remove();
                            $(`#all_users_id_${fromUserId}`).remove();
                            $('#add-friend').html(`
                            
                            <button>
                            Message</button>
                            
                            `)
                            $('#add-friend').attr('class','sendMsg');

                            if(!data.alreadyExists){
                                let profilePic;
                                if(data.profile_pic){
                                    profilePic=`<img src="${data.profile_pic}" alt="">`
                                }else{
                                    profilePic='<i class="fas fa-user"></i>'
                                }
                                $('#friends').prepend(`
                            
                                <li friendId="${fromUserId}" friendshipId="${data.friendshipId}">
                                    <div class="list-content-wrapper">
                                        <a href="/users/profile/${fromUserId}" class="profile-btn">
                                        
                                        
                                        <div class="img-container">
                                        ${profilePic}
                                        </div>
                                        
                                        
                                        
                                        ${data.friendName}</a>
                                        <a class="msg-add-friend initiate-msg"><i class="fas fa-comment-dots"></i></a>
                                    </div>
                                    <div class="side-list-border"></div>
                                </li>
        
                                `);
                                $('#profile-stats').append(`<div id="remove-friend" profileid="${fromUserId}"><a href="/users/friends/remove-friend/${fromUserId}/${self.userId}"><i class="fas fa-user-minus"></i></a></div>`)
                                initiateChat(self,fromUserId);
                                self.socket.emit('friend_request_accepted',{
                                    fromUserId:fromUserId,
                                    toUserId:self.userId,
                                    friendshipId:data.friendshipId
                                });
                                let friendCount=$('#friends-count div').last().html();
                                console.log(typeof(friendCount));
                                $('#friends-count div').last().html(+friendCount +1);
                            }
                            console.log(`$('#notification-bell li').length: `,$('#notification-bell li').length);
                            if($('#notification-bell li').length==1){
                                $('#no_notifs').prop('class','');
                            }
                        }
        
        
                    });
                    // when clicking on reject button
                }else{

                    $.ajax({

                        type:'get',
                        url:`/users/friends/reject_req/${fromUserId}`,
                        success:function(){

                            self.socket.emit('friend_request_rejected',{
                                fromUserId:fromUserId,
                                toUserId:self.userId
                            });
                            $(`a[useridvalue='${fromUserId}']`).css('pointer-events','');

                            $(`a[userid="${fromUserId}"].req-detail`).parent().parent().remove();

                            $('#add-friend').html(`
                            
                                <button userIdValue=${fromUserId}>
                                Add friend</button>
                            
                            `)
                            $('#add-friend').attr('class','toggleFriendReq');


                            if($('#notification-bell li').length==1){
                                $('#no_notifs').prop('class','');
                            }
                        }

                    })


                }
            }



            $(`.req-decision button`).click(function(e){
                helper(this);
            });
            $(`#add-friend.acceptReject button`).click(function(e){
                helper(this);
            });

        }
        let sendingMsg=function(self){

            $(document).on('submit','div[type="friend"].chat-box #create-msg',function(e){
                
                e.preventDefault()
                console.log($(this)[0]);
                console.log('$(formData).serialize(): ',$(this).serialize());
                $.ajax({

                    type:'post',
                    url:'/message/create',
                    data:$(this).serialize(),
                    success:function(data){
                        console.log(data.data);
                        if(data.data.valid){
                            console.log('repeat');
                            console.log('data: ',data);

                            $('#chats').append(
    
                                `
                                
                                <li class="self-msg">
                                    <div class="username"><p>You</p></div>
                                    <div class="msg-content"><p>${data.data.message}</p></div>
                                </li>
                                
                                
                                `);
                            $(document).ready(function(){
                                $('#input-msg input').val('');
                            });
    
                            self.socket.emit('message stored in db',{
                                sentBy:data.data.sentBy,
                                sentTo:data.data.sentTo,
                                message:data.data.message,
                                messageId:data.data.messageId
                            });
                        }else{
                            window.location.href = "/";
                        }



                    }


                });



            });



        }
        let GroupSendingMsg=function(self){

            $(document).on('submit','div[type="group"].chat-box #create-msg',function(e){
                
                e.preventDefault();
                console.log($(this)[0]);
                console.log('$(formData).serialize(): ',$(this).serialize());
                $.ajax({

                    type:'post',
                    url:'/groups/Createmessage',
                    data:$(this).serialize(),
                    success:function(data){
                        console.log(data.data);
                        if(data.data.valid){
                            console.log('repeat');
                            console.log('data: ',data);
                            $('#chats').append(
    
                                `
                                
                                <li class="self-msg">
                                    <div class="username"><p>You</p></div>
                                    <div class="msg-content"><p>${data.data.message}</p></div>
                                </li>
                                
                                
                                `);
                            $(document).ready(function(){
                                $('#input-msg input').val('');
                            });
                            console.log('data.data.members',data.data.members);
                            self.socket.emit('group message stored in db',{
                                sentBy:data.data.sentBy,
                                groupId:data.data.groupId,
                                message:data.data.message,
                                messageId:data.data.messageId,
                                members:data.data.members
                            });
                        }else{
                            window.location.href = "/";
                        }



                    }


                });



            });



        }
        this.socket.on('connect',function(){

            console.log(
                'connection established using sockets!'
            );
                console.log('self.userId: ',self.userId);
            self.socket.emit('join_universal_room',{

                user_id:self.userId,
                universal_room:'universal_room'
            });

            $(document).on('click','#users .msg-add-friend',function(e){

                e.preventDefault();
                self.socket.emit('sendFriendReq',{
                    fromUserId:self.userId,
                    toUserId:$(this).attr('userIdValue')
                })


            });
            $(document).on('click','#add-friend.toggleFriendReq button',function(e){

                e.preventDefault();
                self.socket.emit('sendFriendReq',{
                    fromUserId:self.userId,
                    toUserId:$(this).attr('userIdValue')
                });



            });


            $(document).on('click','#new-group',function(){
                $.ajax({
    
                    type:'get',
                    url:'/groups/allUsers',
                    success:function(data){
    
                        let groupMembersDom=``;
                        $(`#CreategroupModal form`).attr('action','/groups/create');
                        for(let user of data.allUsers){
                            if(user._id.toString()!=self.userId.toString()){

                                groupMembersDom+=`
                            
                            
                                <li class="list-group-item form-check" aria-current="true">
        
                                    <input type="checkbox" id="grp_user_${user._id}" class="check_box" name="groupMembers" value="${user._id}">
                                    <label class="form-check-label" for="grp_user_${user._id}">
                                    
                                        ${user.name}
                                    
                                    </label>
                                </li>
                                
                                
                                `



                            }

                        }
                        console.log('data.allUsers',data.allUsers);
                        $(`#CreategroupModal button[type="submit"]`).html('Create Group')
                        $('#CreategroupModal .list-group').html(groupMembersDom);
                        $('#CreategroupModal .create-group-form .group-section-heading').html('group Details');
                    }
                });
            });

            $(document).on('submit','#CreategroupModal form',function(e){

                var selected = [];
                $('#CreategroupModal .list-group input:checked').each(function() {
                    console.log($(this).attr('value'));
                    selected.push($(this).attr('value'));
                });
                let groupName=$('.group-name input').val();
                let admin=$(`#CreategroupModal input[name="admin"]`).val();
                self.socket.emit('new group created',{
                    members:selected,
                    groupName:groupName,
                    admin:admin
                });
            });
            // when the request is recieved by end user
            self.socket.on('universal room joined',function(data){

                console.log('data.userfriendId: ',data.userfriendId);
                for(let friend of data.userfriendId){
                    initiateChat(self,friend);
                }
                console.log('data.joinedGroups',data.joinedGroups)
                for(let group of data.joinedGroups){
                    groupInitiateMsg(self,group._id.toString());
                }
            });
            self.socket.on('added to a group',function(data){

                console.log('added to a group',data.groupName);

                $('#notification-bell ul').append(`
                
                                
                <li type="group-notifs"><div class="dropdown-item other-notifs">
                    <div class="req-detail">
                        <p>you have been added to a group ${data.groupName} by <a href="/users/profile/${data.adminId}">${data.adminName}</a> click <a href="/">here</a> to see changes
                        </p>
                    </div>
                    <div class="req-decision notif-close-btn">
                            <i class="fas fa-times"></i>
                    </div>
       
                </li>
                
                
                `)
                $(document).on('click','#notification-bell ul li .notif-close-btn',function(e){
                    if($(this).parent().attr('type')=='group-notifs'){
                        $(this).parent().remove();
                    }
                })


            });
            self.socket.on('friend_request_recieved',function(data){
                console.log('friend request recieved',data);
                $('#notification_btn').append(`
                <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                    <span class="visually-hidden">New alerts</span>
                </span>
                `);
                $('#notification-bell ul').prepend(`
                
                <li type="friend-request"><div class="dropdown-item request-drpdwn">


                <a class="req-detail" userid="${data.fromUser}" href="/users/profile/${data.fromUser}">
                <div>
                    <img src="${data.profile_pic}" alt="">
                </div>
                
                <p>${data.username}</p>
                </a>
                <div class="req-decision">
                <button decision="accept"><i class="far fa-check-circle fa-sm"></i></button>
                <button decision="reject"><i class="far fa-times-circle fa-sm"></i></button>
                </div>
                </div></li>
                `)

                $('#add-friend').attr('class','acceptReject');
                $('#add-friend').html(`
                
                <button  userIdValue="${data.fromUser}" decision="accept">
                    <i class="far fa-check-circle fa-sm"></i>
                </button>
                <button  userIdValue="${data.fromUser}" decision="reject">
                    <i class="far fa-times-circle fa-sm"></i>
                </button>
                
                `)


                $(`a[useridvalue='${data.fromUser}']`).css('pointer-events','none');
                $('#no_notifs').prop('class','hidden');
                acceptRejectBtn();

            });

            // while sending friend request
            self.socket.on('friend_request_sent',function(data){
                console.log('friend request sent');
                console.log(data.toUser);
                console.log($(`a[userIdValue="${data.toUser}"]`)[0]);
                $($(`a[userIdValue="${data.toUser}"]`)[0]).html('<i class="fas fa-check"></i>');
                $('#add-friend').html(`
                
                <button userIdValue=${data.toUser}>
                Pending</button>
            
                
                `);
                $('#add-friend').attr('class','toggleFriendReq');
            });


            // toggling between sending the friend request and taking it back---
            self.socket.on('friend_request_cancelled_reciever',function(data){


                $(`a[userid="${data.fromUser}"].req-detail`).parent().parent().remove();
                $('#notification_btn .notification-badge').remove();
                if($('#notification-bell li').length==1){
                    $('#no_notifs').prop('class','');
                }
                $(`a[useridvalue='${data.fromUser}']`).css('pointer-events','');
                console.log('xyz');
                $('#add-friend').html(`
                    
                    <button userIdValue=${data.fromUser}>
                    Add friend</button>
                `);
                $('#add-friend').attr('class','toggleFriendReq');
            })
            self.socket.on('friend_request_cancelled_sender',function(data){

                $(`a[userIdValue="${data.toUser}"]`).html('<i class="fas fa-user-plus"></i>');
                $('#add-friend').html(`
                
                <button userIdValue="${data.toUser}">
                Add friend</button>
                
                `);       
                $('#add-friend').attr('class','toggleFriendReq');       
            });
// --------------------------------------------


            // when clicking on accept or reject button
           
            self.socket.on('request accepted by friend',function(data){
                console.log('this: ',this);
                console.log('data.toUserId: ',data.toUser);
                $(`#all_users_id_${data.toUser}`).remove();
                let profilePic;
                if(data.profile_pic){
                    profilePic=`<img src="${data.profile_pic}" alt="">`
                }else{
                    profilePic='<i class="fas fa-user"></i>'
                }
                $('#friends').prepend(`
                            
                <li friendId="${data.toUser}" friendshipId="${data.friendshipId}">
                    <div class="list-content-wrapper">
                        <a href="/users/profile/${data.toUser}" class="profile-btn">
                        
                        <div class="img-container">
                            ${profilePic}
                        </div>
                        
                        ${data.toUserName}</a>
                        <a class="msg-add-friend initiate-msg"><i class="fas fa-comment-dots"></i></a>
                    </div>
                    <div class="side-list-border"></div>
                </li>
                                        

                `);
                $('#notification-bell button').append(`

                <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                    <span class="visually-hidden">New alerts</span>
                </span>
                `);
                $('#notification-bell ul').prepend(`
                
                
                    <li type="other-notifs" notif_uid="${data.toUser}"><div class="dropdown-item other-notifs">
                        <div class="req-detail">
                            <p><a href="/users/profile/${data.toUser}">${data.toUserName}</a> has accepted your friend request</p>
                        </div>
                        <div class="req-decision notif-close-btn">
                                 <i class="fas fa-times"></i>
                        </div>
               
                    </li>
                `);
                $('#profile-stats').append(`<div id="remove-friend" profileid="${data.toUser}"><a href="/users/friends/remove-friend/${data.toUser}/${self.userId}"><i class="fas fa-user-minus"></i></a></div>`)
                let friendCount=$('#friends-count div').last().html();
                $('#friends-count div').last().html(+friendCount +1);
                $('#add-friend').attr('class','sendMsg');
                $('#add-friend').html(`
                
                    <button userIdValue="${data.toUser}">
                    Message</button>
                `);


                deleteNotif('reqAccepted');
                $('#no_notifs').prop('class','hidden');
                initiateChat(self,data.toUser);
                $('#add-friend').html(`
                <button userIdValue="${data.toUser}">
                    Message</button>
                `);
                $('#add-friend').attr('class','sendMsg');

            });
            self.socket.on('request rejected by user',function(data){
                $(`a[useridvalue="${data.toUser}"]`).html('<i class="fas fa-user-plus"></i>');


                $('#add-friend').html(`
                
                <button userIdValue="${data.toUser}">
                Add friend</button>
                
                `);       
                $('#add-friend').attr('class','toggleFriendReq');       
            });
            self.socket.on('friend removed',function(data){
                console.log('friend removed');

                $('#remove-friend').remove();
                $(`#friends li[friendId="${removedTo}"]`).remove();
                $('#add-friend').attr('class','toggleFriendReq');
                $('#add-friend').html(`
                    <button  userIdValue="${data.removedBy}">
                    Add friend
                    </button>
                `)
                let friendCount=$('#friends-count div').last().html();
                console.log(typeof(friendCount));
                $('#friends-count div').last().html(+friendCount -1);
                $('#add-friend').attr('class','toggleFriendReq')

            });


            self.socket.on('new message recieved',function(data){
                



                if(($(`#chat-container`).attr('friendid') && $(`#chat-container`).attr('friendid').toString()==data.sentBy.toString())){
                    
                    $('#chats').append(

                        `
                        
                        <li class="user-msg">
                            <div class="username"><p>${data.senderName}</p></div>
                            <div class="msg-content"><p>${data.message}</p></div>
                        </li>
                        
                        
                    `);
                    
                    $.ajax({
                        type:'post',
                        url:`/message/seen/${data.messageId}`,
                        success:function(){
                            console.log('xyz: ',$(`li[friendid="${data.sentBy}"] .notification-badge`));
                            console.log(`li[friendid="${data.sentBy}"`);
                            console.log('data: ',data);
                            $(`li[friendid="${data.sentBy}"] .notification-badge`).remove();
                        }
                    });
                }else{



                    $(`#friends li[friendid=${data.sentBy}] .msg-add-friend`).append(

                        `
                        
                            <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                                <span class="visually-hidden">New alerts</span>
                            </span>
                        
                        `
                    )
                }



            });


            self.socket.on('new group message recieved',function(data){
                


                if(($(`#chat-container`).attr('groupid') && $(`#chat-container`).attr('groupid').toString()==data.groupId.toString())){
                    
                    if(data.sentBy.toString()!=self.userId.toString()){


                        $('#chats').append(

                            `
                            
                            <li class="user-msg">
                                <div class="username"><p>${data.senderName}</p></div>
                                <div class="msg-content"><p>${data.message}</p></div>
                            </li>
                            
                            
                        `);
                        
                        console.log('new group message recieved');
                        
                        $.ajax({
                            type:'post',
                            url:`/groups/seenMessage/${data.messageId}`,
                            success:function(){
                                console.log('xyz: ',$(`li[groupid="${data.groupId}"] .notification-badge`));
                                // console.log(`li[groupid="${data.sentBy}"`);
                                console.log('data: ',data);
                                $(`li[friendid="${data.sentBy}"] .notification-badge`).remove();
                            }
                        });
                    }

                }else{

                    $(`#Groups li[groupid=${data.groupId}] .msg-add-friend`).append(

                        `
                        
                            <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                                <span class="visually-hidden">New alerts</span>
                            </span>
                        
                        `
                    )


                }



            });
            self.socket.on('someone liked your post',function(data){
                console.log('someone liked your post');
                $('#notification-bell button').append(`

                <span class="position-absolute translate-middle p-2 rounded-circle notification-badge">
                    <span class="visually-hidden">New alerts</span>
                </span>
                `);
                $('#notification-bell ul').prepend(`
                
                
                    <li type="other-notifs" notif_uid="${data.likedBy}" postid="${data.postid}"><div class="dropdown-item other-notifs">
                        <div class="req-detail">
                            <p><a href="/users/profile/${data.likedBy}">${data.likedByName}</a> liked your <a href="#post-${data.assetId}">post</a></p>
                        </div>
                        <div class="req-decision notif-close-btn">
                                 <i class="fas fa-times"></i>
                        </div>
                    </li>
                `);

                deleteNotif('post_liked');
                
                $('#no_notifs').prop('class','hidden');


            });

            $(document).on('click',`#chat-container .heading i`,function(e){
                e.preventDefault();
                console.log($(this));
                console.log(`$('#chat-container .chats-container'): `,$('#chat-container .chats-container'));
                $(`#chat-container .chats-container`).toggleClass('minimize-chat-body');
                $("#chat-container").toggleClass('minimize-chat-container');
                $(this).toggleClass("fa-angle-up fa-angle-down");
            });


            deleteNotif('reqAccepted');
            deleteNotif('post_liked');
            acceptRejectBtn();
            removeFriend();
            groupInfo();
            $('#notification_btn').click(function(e){
                $('#notification_btn .notification-badge').remove();
            });

            let postList=$('.post');
            for(let post of postList){
                let like_btn=$(' .like-btn',$(post));
                console.log(like_btn);
                let flag=1;
                $(like_btn).on('click',function(e){
                    if(flag==1){
                        $(document).on('click','.popover-body>div',function(e){
                            if($(this).attr('id')!='unlike'){
                                self.socket.emit('post liked by user',{
                                    likedBy:self.userId,
                                    assetId:$(postList).attr('id').slice(5)
                                });
                            }

                        });
                        flag=0;
                    }

                });


            }



        });

        

    }
}


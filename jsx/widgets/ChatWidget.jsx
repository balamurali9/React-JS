var ChatWidget = React.createClass({
    mixins : [ServerPostMixin],
    getInitialState:function() {
        return {
            clientId:null,
            accessToken:null,
            friendList:[]
        };
    },
    initChats :function() {
        var self = this;

        var intiOptions = {
            client_id: this.state.clientId,
            mode: "sandbox",
            access_token: this.state.accessToken,
            invalid_token: function(result) {
              //alert("Invalid token for session_id: " + result.session_id);
            }
        };

        Moxtra.init(intiOptions);
      
        var options = {
          iframe: true,
          tagid4iframe: "chat_timelineview",
          iframewidth: "350px",
          iframeheight: "650px",
          request_view_binder: function(event) {
            console.log("Request to view binder Id: " + event.binder_id);
            //startChat(event.binder_id);
          },
          view_binder: function(event) {
            console.log("View binder Id: " + event.binder_id);
          },
          start_timeline: function(event) {
            console.log("TimelineView started session Id: " + event.session_id);
          },
          receive_feed:function(event) {
            self.showChatWidow(event.binder_id,event.title);

          },    
          error: function(event) {
            //alert("Chat error code: " + event.error_code + " error message: " + event.error_message);
          }
        };
      
        Moxtra.timelineView(options);
        /*
        var options1 = {
          iframe: true,
            tagid4iframe: "chat_timeline",
            iframewidth: "920px",
            iframeheight: "650px",
            autostart_meet: true,
            autostart_note: true,
            access_token: this  .state.accessToken,
            extension: { "show_dialogs": { "meet_invite": true,"member_invite": true } },
            start_timeline: function(event) {
                console.log("Timeline started session Id: " + event.session_id + " binder id: " + event.binder_id);
            },
            view_binder: function(event) {
                console.log("Binder switched session Id: " + event.session_id + " binder id: " + event.binder_id);
            },
            invite_member: function(event) {
                console.log("Invite member into binder Id: " + event.binder_id);
            },
            start_meet: function(event) {
                console.log("Meet started session key: " + event.session_key + " session id: " + event.session_id);
            },
            end_meet: function(event) {
                console.log("Meet end event");
            },
            save_meet: function(event) {
                console.log("Meet saved on binder: " + event.binder_id);
            },
            start_note: function(event) {
                console.log("session key: " + event.session_key + " session id: " + event.session_id);
            },
            save_note: function(event) {
                console.log("Note saved on binder: " + event.destination_binder_id);
            },
            cancel_note: function(event) {
                console.log("Note cancelled");
            },
            error: function(event) {
               // alert("Timeline error code: " + event.error_code + " error message: " + event.error_message);
            }
        };
        Moxtra.timeline(options1);
        */
    },
    showChatWidow:function(binderId){
        var self = this;
        var chatId = "chat_user_"+binderId;
        if ($("#"+chatId).length !== 0) {
            return;
        }
        
        $("#chat_container").html('');
        if ($("#"+chatId).length == 0) {
            $("#chat_friend_list").removeClass('hidden');
            $("#chat_container").removeClass('hidden');  
            $("#chat_container").append('<div class="user-chat"><div class="clearfix user-chat-header"><a class="pull-right" ><i class="ion-close"></i><a></div><div id="'+chatId+'"></div></div>');    
        }
         var options = {
            binder_id: binderId,
            iframe: true,
            iframewidth: "450px",
            iframeheight: "330px",
            tagid4iframe: chatId,
            access_token: self.state.accessToken,
            autostart_note: false,
            request_note: function(event) {
                console.log("Note start request");
            },
            start_chat: function(event) {
                console.log("ChatView started session Id: " + event.session_id,event);
                $("#"+chatId+" div").css({border:"none","box-shadow":"none"});
            },
            request_view_member: function(event) {
                console.log("view member: user id: " + event.user_id + " binder id: " + event.binder_id);
            },
            publish_feed: function(event) {
                console.log("publish feeds: " + event.message + " binder id: " + event.binder_id);
            },
            receive_feed: function(event) {
                console.log("receive feeds: " + event.message + " binder id: " + event.binder_id);
            },
            error: function(event) {
                console.log("Chat error code: " + event.error_code + " error message: " + event.error_message);
            }
        };
        Moxtra.chatView(options);
    },
    startChatWithUser :function(userId) {
        var self = this;
        Api.getData('/community/start-chat/'+userId,{},function(resp){
           self.showChatWidow(resp.data.binder_id,resp.data.name);
      });
    },
    componentDidMount:function() {
        var self = this;
        if (typeof Moxtra == 'undefined') {
            return;
        }
        Api.getData('/community/chat-token',function(resp){
            if (!resp.success) {
                console.log('failed to get the token');
                return;
            }
            Api.getData('/community/user-friends',function(fresp){
                self.setState({
                    clientId:resp.data.client_id,
                    accessToken:resp.data.access_token,
                    friendList:fresp.data
                }); 
                self.initChats();  
            });
        });
        $('body').on('click','.user-chat-header a',function(){
            $(this).parent().parent().remove();
        })
    },
    toggleChat:function(){
        $("#chat_friend_list").toggleClass('hidden');
        if ( $("#chat_friend_list").hasClass('hidden') ) {
            $("#chat_container").addClass('hidden');   
        } else {
             $("#chat_container").removeClass('hidden');  
        }
    },
    childLoaded:function(item){
        $(item.getDOMNode()).removeClass('invisible');
    },
    render:function(){

        var self = this;
        if (self.state.clientId == null) {
            return (<div></div>);
        }

        var list = [];

        for(var idx =0;idx < self.state.friendList.length;idx++) {
            var item = self.state.friendList[idx];
            list.push((<div className="chat-block" onClick={this.startChatWithUser.bind(null,item.id)}><img src={item.profile_image_url}  />
                    <span className="chat-name">{item.display_name}</span>
                </div>))
        }
        
        if (list.length == 0) {
            list.push((<h6 className="text-center">You dont have any connections</h6>));
            // list.push(<RecommendUsers onTileLoad={self.childLoaded}  />);
        }
        return (
            <div>
                <div id="chat_timelineview" className="hidden">
                </div>
                <div id="chat_timeline" >
                </div>
                <div  className="pull-right" >
                    <div id="chatHeader" onClick={this.toggleChat} className="chat-header">Chat</div>
                    <div id="chat_friend_list" className="hidden">
                    {list}
                    </div>
                </div>
                 <div id="chat_container" className="pull-right">
                </div>
                
            </div>

        )
    }

});
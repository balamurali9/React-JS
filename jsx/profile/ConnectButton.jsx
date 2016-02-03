var ProfileConnectButton = React.createClass({ 
  getInitialState:function(){
   return { 
    dataAvailable:false
   }
  },
  componentDidMount:function(){
    if (this.props.user.id == this.props.me.id) {
      return
    }
    this.state.dataAvailable =true;
    this.handleRequest('/community/is-connected');
  }, 
  handleRequest:function(endPoint) {  
    var self = this; 
    if (!self.state.dataAvailable) {
      return false;
    } 
    self.setState({dataAvailable:false});  
    Api.postData(endPoint,{
        user_id:self.props.user.id
      },function(resp){ 
        var state = self.state; 
        if ((resp && resp.data)){ 
          state.response = resp.data;
        }
        state.dataAvailable = true;
        self.setState(state);  
        if (endPoint != '/community/is-connected') {
          JiyoEvent.fire('user_2_user_connection');
        }
      }
    );   
  }, 
  sendFriendRequest:function(){ 
    this.handleRequest('/community/connect-with-user');
  },
  unFriendRequest : function(){
    this.handleRequest('/community/disconnect-with-user');
  },
  acceptFriendRequest:function(){
    this.handleRequest('/community/accept-connect-request');
  },
  rejectRequest:function(){
    this.handleRequest('/community/reject-connect-request');
  },
  cancelRequest:function(){
    this.handleRequest('/community/cancel-connect-request');
  },
  followUser : function(){
    this.handleRequest('/community/follow-user');   
  },
  unfollowUser:function(){
    this.handleRequest('/community/unfollow-user'); 
  },
  render:function(){ 
    var text = "Connect";
    var content = "Connect"
    if (this.props.user.id == this.props.me.id) {
      return (<span className="hidden">myself here</span>);
    }
    if (this.props.me.type != 'USER') {
      return (<span className="hidden">You are an author</span>);
    }

    var btnAlt = (<span></span>);
    var btnMain= null;
    var primBtn = "btn btn-sm  btnAlign orangeBtn";
    var dangBtn = "btn btn-sm  btnAlign orangeBtn";
    var defaBtn = "btn btn-sm btnAlign orangeBtn";

    if(this.state.dataAvailable) {
      var resp = this.state.response; 
 
      if (this.props.user.type == "USER") {  
        if (resp.friend.status == 2) {
          btnMain = (<button onClick={this.sendFriendRequest} className={primBtn} style={{"position":"relative","left":"-36px","border-top-right-radius":"4px","border-bottom-right-radius":"4px"}}>Send Request</button>) 
        } else if (resp.friend.status == 0 ) {
          if(resp.friend.user_id == this.props.me.id ) {
            btnMain = (<button className={defaBtn} style={{"margin":"10px","pointer-events":"none"}}>Awaiting Response</button>)
            btnAlt =  (<button className={dangBtn} onClick={this.cancelRequest}>Cancel Request</button>);
          } else { 
            btnMain = (<button className={primBtn} onClick={this.acceptFriendRequest} style={{"margin":"10px"}}>Accept Friend Request</button>);
            btnAlt =  (<button className={dangBtn} onClick={this.rejectRequest}>Reject Request</button>);
          } }
        // else if (resp.friend.status == 1) {
        //   btnMain = (<button className={dangBtn} onClick={this.unFriendRequest}>Un Friend</button>);
        // } 
      } 
    } else{
      btnMain = (<span className="throbber" style={{"margin-top":"-50px","margin-left":"-65px"}}/>);
    }
    
    return (
      <div className="btn-group" style={{margin:"2px -77px"}}>
        {btnMain}
        {btnAlt}
      </div>
    );
  }
});
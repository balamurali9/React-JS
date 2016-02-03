var ProfileConnectionsPanel = React.createClass({
  getInitialState : function() {
    return {
      searchString:'', 
      filterType:'FRIENDS',
      friends : null, 
      dataFetched:false, 
      friend_request:null,
    }
  },
  fetchUserData:function(endPoint){
    var self = this;
    Api.getData(endPoint,{user_id:this.props.user.id},function(response){

        if (!response.data) {
            return;
        } 
        var state = self.state;
        
        if (response.meta.friend) { 
           state.friends = response.data;      
        }

        if (response.meta.friend_request) { 
            state.friend_request = response.data;      
        }

        if (state.friend_request != null && state.friends != null) {
            state.dataFetched = true;
        }

        self.setState(state);
        
    });
  }, 
  setSearchString:function(event) { 
    this.setState({searchString:event.target.value})
  },
  match:function(text,search) {
    return text.toLowerCase().indexOf(search.toLowerCase()) >= 0;
  },
  componentDidMount:function(){ 
    var self = this; 
    JiyoEvent.subscribe('user_2_user_connection',function(){
      self.fetchUserData('/community/user-friends'); 
      if (self.props.user.id == self.props.me.id) {
         self.fetchUserData('/community/notifications/friend_request');
      }
    });
 
  
    if (this.props.user.id == this.props.me.id) {
      self.fetchUserData('/community/notifications/friend_request');
	  } else {
      self.state.friend_request = [];
    }

    self.fetchUserData('/community/user-friends'); 
    
    if(this.props.activeTab == "FriendRequest"){
        self.setState({filterType:"FRIEND_REQUESTS"})
    }   
  }, 
  filterConnections:function(type){
    this.setState({filterType:type});
  },
  makeVisible:function(item){ 
    $(item.getDOMNode()).removeClass('invisible');
  },
  render :function(){
    var self = this;
    var users = [];
    var filterClass = '';
    var filters = {
      'FRIENDS':'Friends',
      'FRIEND_REQUESTS':'Friends Request'
    };
    var buttons = [];
    var self = this;
    if (!this.state.dataFetched) {
      return (<div className="text-center"><LoadingIcon /></div>);
    }
    if (this.props.user.type == 'USER') { 
        if (self.state.filterType == 'FRIENDS') {
            self.state.friends.forEach(function(item){
                if (!self.match(item.display_name,self.state.searchString)) {
                  return;
                }
                users.push((<UserTeaserBlock  user={item} />));
              });
        } 
        if (self.state.filterType == 'FRIEND_REQUESTS') {
            self.state.friend_request.forEach(function(item){
                item.display_name = item.user_name;
                if (!self.match(item.display_name,self.state.searchString)) {
                  return;
                }
                users.push((<Friendrequest  user={item} />));
            });
        }       
    }    
    for(var key in filters) {
        var text = filters[key];
        cls = '';

        if (this.state.filterType == key) {
            cls = 'active'
        }

           
        if(this.props.me.id != this.props.user.id){
             //continue;             
             if(text=='Friends Request'){  
                cls='hidden';     
             }
        }

        if(text =='Friends'){
            friendId ='friendId'  
            friendIcon='friendIcon';
        }
        if(text=='Friends Request'){  
            friendId ='friendRequetId'      
            friendIcon='friendsRequestIcon'
            
        }
        buttons.push(
                <button className={"btn btn-link custom-connection "+cls} id={friendId} 
                    onClick={this.filterConnections.bind(null,key)} >
                    <span className={friendIcon}></span>
                    <span style={{"margin-left":"24px"}}>{text}</span>
                </button>
            );
    }
    var noResults = 'No Results';
    if (users.length == 0 ) {
        if (self.state.searchString) {
            noResults = "We don't have anyone by that name as yet.";
        } else if(self.state.filterType == 'FRIENDS') {
            noResults = 'Look for  your friends on Jiyo and start building new friendships  today';
        } else if(self.state.filterType == 'FRIEND_REQUESTS') {
            noResults = 'No friend requests';
        }
        users = (<div style={{"padding":"15px"}}>{noResults}</div>);
    }    
    return (<div className="connectionPanel" >
              <ul className="nav nav-tabs" role="tablist" style={{"backgroundColor":"#fff","border-radius":"6px","padding":"4px"}}>
                <li role="presentation" className="active friendsTabClass" style={{"text-align":"center !important","float":"inherit"}}>
                   {buttons}
                </li>  
                <li style={{"height":"0","float":"right !important"}}>
                  <input type="text" placeholder="Search Friends" 
                          onChange={this.setSearchString} style={{"marginTop":"-34px"}}
                          value={this.state.searchString} 
                          className="form-control"/>
                          <span className="glyphicon glyphicon-search connection-search-icon pull-right" style={{"top":"-24px","right":"7px","color":"#ff9933"}}></span>
                </li>        
              </ul>  

              <div className="tab-content" >
                  <div className="row">
                  <div className="col-lg-9">  
                    {users}
                    </div>
                    <div className="col-lg-3">         
                      <SocialFollow onTileLoad={self.childLoaded} />
                      <InviteFriends me={self.props.me} onTileLoad={self.childLoaded} /> 
                      <RecommendUsers onTileLoad={self.childLoaded}  />         
                    </div>       
                  </div>
              </div>
        </div>
        );
    }
});
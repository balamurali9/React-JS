var UserNoticationUpdater = React.createClass({
  getInitialState:function(){
    return {
      count:0,
      notification_popup:false,
      notifications:null,
      filterType:'all',
      activeClass:"",
    };
  },
  fetchNotificationCount:function(){
    var self = this;
    Api.getData('/community/notification-count',{},function(resp){
      self.setState({count:resp.data});
    })
  },
   updateNotifications:function() {
    var self = this;
    Api.getData('/community/notifications',{},function(response){
      self.setState({notifications:response.data});
      JiyoEvent.fire('update_notification',response.data.length);
    });
  },
  acceptFriendRequest:function(userId){
    var self = this;
    Api.postData('/community/accept-connect-request',{user_id:userId},function(){
       JiyoEvent.fire('user_2_user_connection');
    });
  },
  rejectFriendRequest:function(userId){
    var self = this;
    Api.postData('/community/reject-connect-request',{user_id:userId},function(){
      JiyoEvent.fire('user_2_user_connection');
    });
  },
   handleNotificationClick:function(event){    
  
    var nextState = !(this.state.notification_popup);
    this.setState({notification_popup:nextState});
      event.stopPropagation();
      if($('#notificationPopup').hasClass('open')){
          $('.notificationDiv').addClass('active');    
      }
    $("body").click(function() {      
     if($('.notificationDiv').find('.active')){
          $('.notificationDiv').removeClass('active'); 
     }
  });
  },
  componentDidMount:function() {
    this.updateNotifications();
    var self = this;
     var nofificationDiv = null; 
    setInterval(function(){
      self.fetchNotificationCount()
    },30000);
    self.fetchNotificationCount();
    JiyoEvent.subscribe('update_notification',function(val){
      if (val){
        self.setState({count:val});
      } else {
        self.fetchNotificationCount();
      }
    });
    
    JiyoEvent.subscribe('user_2_user_connection',function(){
      self.fetchNotificationCount();
       self.updateNotifications();
    })
    JiyoEvent.subscribe('notification_click',function(){

   });
    
  },
   renderFriendRequest:function(data){
    var localFrndReqTime  = moment.utc(data.tm_utc,'X').toDate();
    localFrndReqTime = moment(localFrndReqTime).format('HH:mm');
    return (
    <div className="media friendRequest">
    <div className="pull-left">           
         <a href="#">
            <img className="media-object media-middle img-circle" src={data.user_image} alt={data.user_name} />
         </a>
      </div>
      <div className="pull-right acceptRejectBtn">
        <button title="Accept" className="btn btn-primary accept-button" onClick={this.acceptFriendRequest.bind(null,data.user_id)}></button>
        <button title="Reject" className="btn btn-primary reject-button" onClick={this.rejectFriendRequest.bind(null,data.user_id)}></button>
      </div>      
      <div className="media-heading">
        <p>
          <span><a href="#" className="fontstyle13px userName">{data.user_name} </a></span><br/>
        </p>
      </div>      
    </div>
    );
  }, 
  renderTaskNotification : function(data) { 
    var localTaskTime  = moment.utc(data.task_utc,'X').toDate();
    localTaskTime = moment(localTaskTime).format('HH:mm');
    return (
      <div className="media taskRequest">
      <div className="pull-right">
        <span className="time-info">{localTaskTime}</span>  
      </div>
      <div className="pull-left ">           
       <div className="text-center task-number"><span>Task</span><br/><span>{data.task_number}</span></div>
      </div>
      <div className="media-heading fontStyle15 tasktext-heading"><a href={"/user/profile#"+data.task_id}>{data.title}</a></div>
      <div className="media-body fontStyle22 taskText-body">{data.brief}</div>
    </div>
   );
  },
  renderArticle:function(data){
    return (  
    <div className="media articleRequest">
      <div className="pull-right">
        <span className="time-info">{data.user_time}</span> 
      </div>
      <div className="pull-left">           
       <a href={"/user/profile/"+data.author_id}>
          <img className="media-object img-circle media-middle" alt={data.author_image} src={data.author_image} width="48" height="48" />
        </a>
      </div>
      <div className="media-heading fontStyle15"> <a href={data.url}>{data.title}</a> </div>
      <div className="media-body fontStyle16">By:<span>{data.author_name}</span></div>
    </div> 
  );
  },
  filterNotifications:function(type){
    this.setState({filterType:type})
  },
  render:function() {
    var count = "";
    var self = this;
    //console.log('connections',this.props.activeTab)
    if (self.state.notifications == null){
      return ( <img src=""/>);
    }
    var  notifications = self.state.notifications;    
    var list = [];
    var requests = [];
    var articles = [];
    var tasks = [];
    var requestCount = 0;
    var taskCount = 0;
    var articleCount = 0;
    for(var idx = 0;idx < notifications.length;idx++) {
      var data = notifications[idx];
      var item = null;
      var targetList = articles;
      var filter = this.state.filterType;
      if (filter == 'all') {
        filter = data.type;
      }
      if (data.type == 'article_publish') {
        item = this.renderArticle(data);
        articleCount++;
      } else if (data.type == 'friend_request') {
        item = this.renderFriendRequest(data);
        targetList = requests;
        requestCount++;

      } else if (data.type == 'task_notification' ) {
        item = this.renderTaskNotification(data);
        targetList = tasks;
        taskCount++;
      }
      if (data.type !== filter) {
        continue;
      }
      if (targetList.length < 3) {
        targetList.push((<li className="list-group-item">{item}</li>));
      }
      list.push((<li className="list-group-item col-md-6">{item}</li>));
    }
    if(requestCount!=0 || taskCount !=0){
     $("title").html("("+(requestCount+taskCount)+") Jiyo");
    }
    var filters = {
      'all':'All Notifications ('+notifications.length+')',
      'friend_request':'Friend Requests ('+requestCount+')',
      //task_notification':'Tasks ('+taskCount+')',
      // 'article_publish' : 'Articles ('+articleCount+')'
    };
    var filterClass = '';
    var buttons = [];
    var self = this;
    for(var key in filters) {
      var text = filters[key];
      var cls = '';
      if (this.state.filterType == key) {
        cls = 'active'
      }
      buttons.push(
    <button className={"btn btn-link custom-notification "+cls} 
          onClick={this.filterNotifications.bind(null,key)} >{text}
        </button>);
    }
    var requestPopupClass='',taskPopupClass='',articlePopupClass='';
    var paddingClass = '';
    if(articles.length == 0){
      articlePopupClass = 'hidden';
    }

    if (tasks.length == 0){ 
      taskPopupClass = 'hidden';
    }
    var view_all_div = '';
    if(requests.length != 0) {  
        view_all_div = <div className="viewAllDiv text-center"><a href="/user/profile/#friendRequest" className="text-center">View All</a></div>
    }
    if (requests.length == 0){
      paddingClass = 'popUpEmptyMsg';
      requestPopupClass = '';
      requests.push((<li>No friend requests</li>));
    }
    if(self.state.count == 0){
     return (<div className="notificationDiv" title="Friend Request"></div>);
    }    
    if (self.state.count > 0) {
      count = (
    <div>
      <li id="notificationPopup" className="dropdown">       
                <a data-toggle="dropdown" title="Friend Request" className="dropdown-toggle" onClick={self.handleNotificationClick} href="#" aria-expanded="true">
                    <div className="notificationDiv" onClick={self.handleNotificationClick}></div>
                    <p className="speech">{requestCount}</p>
                </a>
                <ul className="dropdown-menu notification_popup" >
                    <li>
                        <div className="topArrow"></div>
                        <div className="notification-popup-header text-center" ><span className="notification_popupHeader icon20"></span> &nbsp;Friend Requests</div>
                    </li>
                    <li>
                      <ul className="sub-notification-content">
                        <li className={requestPopupClass}>                      
                          <ul className={"notification-list "+paddingClass}>
                             {requests}
                          </ul>
                          {view_all_div}
                        </li>
                      </ul>  
                    </li>                   
                </ul> 
            </li>
    </div>
        )
    } else {
      count = '';//(<span className="label label-danger invisible">0</span>)
    }
    return (
    <span>{count}</span>
    );
  }
});

var UserTeaserBlock = React.createClass({   
  mixins:[ServerPostMixin],
  unFriendRequest:function(userId){
     var self = this;   
     var uname = self.props.user.display_name; 
      if (confirm("Are you sure you want to say goodbye to "+uname+" ?")== true) {
        Api.postData('/community/disconnect-with-user',{user_id:userId},function(){
            JiyoEvent.fire('user_2_user_connection');
        });
      }
    },
  render:function(){
    var profileUrl = "/user/profile/"+this.props.user.id;
    var publicStatus = this.props.user.public_status;
    var publicStatusClass = "";
    if(publicStatus==null){
      publicStatusClass='';
    }   
    var clsUnfriend="";
     if(paramObj.me.id != paramObj.user.id){
        clsUnfriend = "hidden";      
    }
    return (<div>
          <div className="col-lg-4">
            <div className="media user-connection-teaser">
                <div className="user-info-teaser clearfix">
                  <div className="pull-left">           
                     <a href={"/user/profile/"+this.props.user.id} >
                        <img className="media-object media-middle img-circle" src={this.props.user.profile_image_url} alt={this.props.user.profile_image_url} width="35" height="35"/>
                     </a>
                  </div>
                  <div className="pull-right">
                    <button title="Remove" className={"btn unfriend-button "+clsUnfriend} onClick={this.unFriendRequest.bind(null,this.props.user.id)}></button>
                  </div> 
                  <div className="media-heading">
                    <p>
                      <span><a href={"/user/profile/"+this.props.user.id} className="fontstyle13px">{this.props.user.display_name}</a></span><br/>                           
                    </p>
                  </div>
                </div>
            </div>
        </div>
      </div>);
    }
});

var Friendrequest = React.createClass({
  getInitialState:function(){
    return {
      count:0,
      notifications:null,
      filterType:'all',
      activeClass:"",
    };
  },
   updateNotifications:function() {
    var self = this;
    Api.getData('/community/notifications/friend_request',{},function(response){
      self.setState({notifications:response.data});
    });
  },
  acceptFriendRequest:function(userId){
    var self = this;
    Api.postData('/community/accept-connect-request',{user_id:userId},function(){
      JiyoEvent.fire('user_2_user_connection');
    });
  },
  rejectFriendRequest:function(userId){
    var self = this;
    Api.postData('/community/reject-connect-request',{user_id:userId},function(){
      JiyoEvent.fire('user_2_user_connection');
    });
  },  
  componentDidMount:function() {
    this.updateNotifications();
    var self = this;
    var nofificationDiv = null; 
    JiyoEvent.subscribe('user_2_user_connection',function(){
      self.updateNotifications();
    });     
  },
  render:function() {
    var count = "";
    var self = this;
    var data = this.props.user;
    var localFrndReqTime  = moment.utc(data.tm_utc,'X').toDate();
    localFrndReqTime = moment(localFrndReqTime).format('HH:mm'); 
    return (<div className="friendRequestTab">
         <div className="col-lg-4">
            <div className="friendRequestTeaser">
              <div className="media">
                  <div className="pull-right acceptRejectBtn">
                    <button title="Accept" className="btn btn-primary accept-button" onClick={this.acceptFriendRequest.bind(null,data.user_id)}></button>
                    <button title="Reject" className="btn btn-primary reject-button" onClick={this.rejectFriendRequest.bind(null,data.user_id)}></button>
                  </div> 
                  <div className="pull-left">           
                     <a href={"/user/profile/"+this.props.user.user_id}>
                        <img className="media-object media-middle img-circle" src={data.user_image} alt={data.user_name} width="35" height="35" />
                     </a>
                  </div>     
                  <div className="media-heading">
                    <p>
                      <span><a href="#" className="fontstyle13px userName">{data.user_name} </a></span>
                    </p>
                  </div>      
              </div>
            </div>
          </div>
        </div>);  
  }
});

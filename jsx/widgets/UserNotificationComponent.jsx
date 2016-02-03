var UserNotificationComponent = React.createClass({

  getInitialState:function(){
    return {
      searchString:'',
      filterType:'all',
      notifications:null,    
    };
  },
  updateNotifications:function() {
    var self = this;
    Api.getData('/community/notifications',{},function(response){
      self.setState({notifications:response.data});
      JiyoEvent.fire('update_notification',response.data.length);
    });
  },
  componentDidMount:function(){
    this.updateNotifications();    
  },
  acceptFriendRequest:function(userId){
    var self = this;
    Api.postData('/community/accept-connect-request',{user_id:userId},function(){
      self.updateNotifications();
    });
  },
  rejectFriendRequest:function(userId){
    var self = this;
    Api.postData('/community/reject-connect-request',{user_id:userId},function(){
      self.updateNotifications();
    });
  },
  renderFriendRequest:function(data){
    var localFrndReqTime  = moment.utc(data.tm_utc,'X').toDate();
    localFrndReqTime = moment(localFrndReqTime).format('HH:mm');
    return (
    <div className="media friendRequest">
        <div className="pull-right" style={{"display":"inline-flex"}}>
            <span className="time-info friendsRequesttimeInfo">{localFrndReqTime}</span>
            <button title="Accept" className="btn btn-primary accept-button" onClick={this.acceptFriendRequest.bind(null,data.user_id)}></button>
            <button title="Reject" className="btn btn-primary reject-button" onClick={this.rejectFriendRequest.bind(null,data.user_id)}></button>
        </div>
        <div className="pull-left">           
         <a href="#">
              <img className="media-object media-middle img-circle" src={data.user_image} alt={data.user_name} />
         </a>
        </div>
        <div className="media-heading fontStyle15"><a href="#">{data.user_name} </a></div>
    </div>
    );
  }, 
  renderTaskNotification : function(data) {  
    var localTaskTime  = moment.utc(data.task_utc,'X').toDate();
    localTaskTime = moment(localTaskTime).format('HH:mm');
    return (
      <div className="media taskRequest">
        <div className="pull-right" style={{"display":"inline-flex"}}>
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
    return (  <div className="media articleRequest">
        <div className="pull-right" style={{"display":"inline-flex"}}>
            <span className="time-info">{data.user_time}</span> 
        </div>
        <div className="pull-left">           
         <a href={"/user/profile/"+data.author_id}>
                <img className="media-object img-circle media-middle" alt={data.author_image} src={data.author_image} width="48" height="48" />
            </a>
        </div>
        <div className="media-heading fontStyle15"> <a href={data.url}>{data.title}</a> </div>
        <div className="media-body fontStyle16">By:<span>{data.author_name}</span></div>
    </div> );
  },
  filterNotifications:function(type){
    this.setState({filterType:type})
  },
  setSearchString:function(event) { 
    this.setState({searchString:event.target.value})
  },
  match:function(text,search) {
    return text.toLowerCase().indexOf(search.toLowerCase()) >= 0;
  },
  render :function(){
 
    var self = this;
    if (self.state.notifications == null){
      return (<LoadingIcon />);
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
        if (!self.match(data.title,self.state.searchString)) {
            data = '';
        }
        item = this.renderArticle(data);
        articleCount++;
      } else if (data.type == 'friend_request') {
        if (!self.match(data.user_name,self.state.searchString)) {
            data = '';
        }
        item = this.renderFriendRequest(data);
        targetList = requests;
        requestCount++;
      } else if (data.type == 'task_notification' ) {
        if (!self.match(data.title,self.state.searchString)) {
            data = '';
        }
        item = this.renderTaskNotification(data);
        targetList = tasks;
        taskCount++;
      }
      if (data.type !== filter) {
        continue;
      }
      if (targetList.length < 3) {
        targetList.push((<li className="list-group-item" style={{"padding":"0"}}>{item}</li>));
      }
      list.push((<li className="list-group-item col-md-6">{item}</li>));
    }
    if(list.length == 0){
      list.push(<div className="jumbotron" style={{"margin-left":"15px"}}>
                <p>You dont have any notifications.</p>
            </div>);
    }
    var filters = {
      'all':'All Notifications ('+notifications.length+')',
      'friend_request':'Friend Requests ('+requestCount+')',
      'task_notification':'Tasks ('+taskCount+')',
      // 'article_publish' : 'Articles ('+articleCount+')'
    };
    var filterClass = '';

    var buttons = [];
    var self = this;
    for(var key in filters) {
      var text = filters[key];
      cls = '';
      if (this.state.filterType == key) {
        cls = 'active'
      }
      buttons.push(<button className={"btn btn-default btn-responsive "+cls} 
          onClick={this.filterNotifications.bind(null,key)} >{text}
          </button>);
    }
    var requestPopupClass='',taskPopupClass='',articlePopupClass='';

    if(articles.length == 0){

      articlePopupClass = 'hidden';
    }

    if (tasks.length == 0){ 
      taskPopupClass = 'hidden';
    }

    if (requests.length == 0){
      requestPopupClass = 'hidden';
    }
   return (
    <div className="content"><div className="row">
   <div className="notificationCus"><h4 className="fontstyle5"></h4>
  <div className="panel">

   <div className="panel-heading" id="notificationTab"> 
          <div className="btn-group">
              {buttons}
          </div>
    </div>
    <div  className=" panel-body UserNotificationComponent ">   
      <div id="allNotifications">            
        <ul className="list-group col-md-12 notification-list"> 
           {list}             
        </ul>        
      </div> 
    </div> 
  </div> </div> </div></div>);
  }

}); 
 

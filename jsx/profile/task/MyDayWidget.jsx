var TaskDetailComponent = React.createClass({
    getInitialState:function(){
        return {
            task_data:null
        };
    },
    componentDidMount:function(){
      var self = this;     
      JiyoEvent.subscribe('showPageTaskModal',function(state){    
      self.setState(state);
        $("#taskDetailModal").modal('show');
      });
    },
    render:function(){
         var item = {};
         item = this.state.task_data;
                 var itemTitle = '';
                 var itemContent = [];
                 var itemType = '';
                 if(item != null) {  
                    itemTitle = item.title;
                    itemContent = item.content;
                    itemContent.type = item.type;
                 }
         var list = [];
         var innerList = [];
              itemContent.forEach(function(taskItem){
                switch (taskItem.type) {
                  case "image" : 
                      innerList.push(<div className="col-md-6"><img src={taskItem.content} className="img-responsive" onLoad={this.handleImageLoad} onError={this.handleImageError} style={{"width":"100%"}}/><br/></div>);
                    break;
                  case "audio": 
                     innerList.push(<div className="col-md-6"><audio controls="controls" style={{"width":"100%"}} > 
                    <source src={taskItem.content} type="audio/mpeg" ></source>
                      Your browser does not support the audio element.
                    </audio><br/></div>);
                    break;
                  case "video"  : 
                    innerList.push(<div className="col-md-6 cover-image js-video [vimeo, widescreen]">       
                        <video controls="controls" width="436" height="300">
                            <source src={taskItem.content} type="video/mp4"></source>
                            Your browser does not support HTML5 video.
                        </video><br/></div>);
                    break;
                   case "text": 
                      innerList.push(<div className="col-md-6">{taskItem.content}<br/></div>);
                    break;
                  default:
                    innerList.push(<div>{"We haven’t got anything to work with as yet!"}</div>);                     
                } 
            })
             list.push(innerList);    
      return (
            <div className="modal fade lens-modal"   tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" id="taskDetailModal">
                <button type="button" className="close lens-modal-close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">X</span>
                </button>
                 <div className="modal-content">
                    <div className="modal-header">                  
                      <h4 className="modal-title" >{itemTitle}</h4>
                    </div>
                    <div className="modal-body row">
                        <div>{list}</div>
                    </div>               
                  </div>          
            </div> 
        );
    }   
});

var SendTaskDetailComponent = React.createClass({
    mixins : [ServerPostMixin],
    getInitialState:function(){
        return {
            send_task_data:null,
            friends : [],
            dataFetched:false,
        };
    },
    sendhandleClick:function(Id){   
        var selectedUsers = $("li.select2-search-choice div").map(function() {
        if($(this).attr("id") != undefined) {
            return $(this).attr("id");
        }
        }).get();
        selectedUsers = selectedUsers.join(",");
        if( selectedUsers.length == 0 ){
                alert("Please select at least one user to send task");
                return;
            }
        Api.postData("/user/send-task",{"task_id":Id,"friend_list":selectedUsers},function(response){
          if (response.success) { 
                alert("Your request sent successfully");
                $('.select2-container').select2('val', '');
                $("#SendTaskDetailModal").modal('hide');
           } else {
                alert("Failed to process your request");
                $('.select2-container').select2('val', '');
                $("#SendTaskDetailModal").modal('hide');
              }
        })  
    },
    
    resethandleClick:function(){
        $('.select2-container').select2('val', '');
    },
    
    fetchUserData:function(endPoint){
        var self = this;
        Api.getData(endPoint,{user_id:this.props.user.id},function(response){
          if (!response.data) {
            return;
          }
          var state = self.state;
          state.friends = response.data;
          if (state.friends) {
            state.dataFetched = true;
            self.setState(state);
          }
        });
    },
      
    componentDidMount:function(){
      var self = this; 
     self.fetchUserData('/community/user-friends'); 
      
      JiyoEvent.subscribe('showPageSendTaskModal',function(state){ 
            self.setState(state);
            $("#SendTaskDetailModal").modal('show');
            $(".js-source-states-2").select2();
      });

    },
    render:function(){  
        var item = {};
        item = this.state.send_task_data;  
        var self = this;
        var users = []; 
        var total = 0;
        
          self.state.friends.forEach(function(userItem){
            total++;
            users.push((<option value={userItem.id}>{userItem.display_name}</option>));
          })
          
        if (users.length == 0 ) {
          users = (
            <div>No Results</div>
          );
        }
        var itemTitle = '';
        var itemId = '';

    if (self.state.item){
            itemTitle = self.state.item.title;
            itemId= self.state.item.id;
        }
      return (
        <div className="modal fade lens-modal"   tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" id="SendTaskDetailModal">
            <button type="button" className="close lens-modal-close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">X</span>
            </button>
             <div className="modal-content">
                <div className="modal-header">                  
                  <h4 className="modal-title" >{itemTitle}</h4>
                </div>
                <div className="modal-body row">
                    <div><h5 className="m-t-md">Select Users</h5></div>
                    <div className="hr-line-dashed"></div>
                    <div>
                        <select className="js-source-states-2" multiple="multiple" style={{"width" : "100%"}}>
                                {users}
                        </select>
                    </div>
                    <div className="hr-line-dashed"></div>
                    <div className="form-group">
                        <div className="pull-right">
                            <button type="reset" onClick={this.resethandleClick}  className="btn btn-default" style={{"margin-right" : "5px"}}>Reset</button>
                            <button type="submit" className="btn btn-primary" onClick={this.sendhandleClick.bind(null,itemId)} >Send</button>
                        </div>
                    </div>
                </div>               
              </div>          
        </div> 
        );
    }   
});

var UserMyDayWidget = React.createClass({
    mixins:[ServerPostMixin],
    getDefaultProps:function(){
        return {
            allPendingTasks:"NO"
        }
    },
      getInitialState : function() {
        return {
          program:{
            my_day:null,
            myDayFetchProgress:true,
          },
          activityClass:''
        }
      },
      taskProgressUpdate:function(e){ 
        $(e.target).siblings('.alert').html('Completed '+e.target.value+"%");
      },
      componentDidMount:function(){
        var state = this.state;
        var self = this;

        if (this.props.allPendingTasks == "YES") {
            Api.getData('/user/pending-tasks/'+moment(new Date()).format("YYYY-MM-DD"),{},function(result){
              state.program.my_day = result.data;
              state.program.myDayFetchProgress = false;
              self.setState(state)
              if (self.props.loadCallback) {
                self.props.loadCallback(self);
              }
            });
        } else {
            Api.getData('/user/task-history/'+moment(new Date()).format("YYYY-MM-DD"),{},function(result){
              state.program.my_day = result.data;
              state.program.myDayFetchProgress = false;
              self.setState(state)

              if (self.props.loadCallback) {
                self.props.loadCallback(self);
              }
            }); 
        }
        
      },
      fetchNextDay : function(event) { 
        var date = this.state.program.my_day.date; 
        var state = this.state;
        var self = this;
        state.program.myDayFetchProgress = true;
        self.setState(state); 
        Api.getData('/user/task-history/'+moment(date).add(1,'d').format("YYYY-MM-DD"),{
        },function(result){

           state.program.my_day = result.data;
           state.program.my_day.date = result.meta.date;
           state.program.myDayFetchProgress = false;
           self.setState(state);
        });
        $('#taskNotificationPopup').addClass('open');
      },
      fetchPreviousDay:function(){
        var date = this.state.program.my_day.date; 
        var state = this.state;
        var self = this;
        state.program.myDayFetchProgress = true;
        self.setState(state); 
        Api.getData('/user/task-history/'+moment(date).add(-1,'d').format("YYYY-MM-DD"),{
            },function(result){
                state.program.my_day = result.data;
                state.program.my_day.date = result.meta.date;
                state.program.myDayFetchProgress = false;
                self.setState(state);
        });
        $('#taskNotificationPopup').addClass('open')
      },
      renderMyDay : function() {
        var self = this;
        var state = this.state;
        var activityClass = '';
        var disableNext = false;
        var disablePrev = false;
        if (this.state.program.myDayFetchProgress) {
          disableNext = true;
          disablePrev = true;
        } else {
          activityClass += ' invisible';
        }
        
        
        
        if(state.program.my_day){
          if (state.program.my_day.prev_day  == null){
            disablePrev = true;
          }
          if (state.program.my_day.next_day == null) {
            disableNext = true;
          }
        }
        if (state.program.my_day == null) {
          return (<LoadingIcon /> );
        }
         

        var taskList = [];
        if(state.program.my_day.length == 0) {
            taskList = (<div style={ {padding:"20px"}}>We haven’t got anything to work with as yet!</div>);
        } else {
            state.program.my_day.forEach(function(item){
              taskList.push((<ProfileTaskCard task={item} />));
            });
        }
        var nextDayClass = '';
      var prevDayClass = '';

        var day = moment(state.program.my_day.date).format('DD-MM-YYYY');
        if(moment(state.program.my_day.date).format('DD-MM-YYYY') == moment().format('DD-MM-YYYY')) {
            day = 'Today';  
            nextDayClass = 'invisible';
        }
        if (this.props.allPendingTasks == 'YES') {
            day = "Bits";
        }

        return (
            <div>
                <div className={"pull-left "+prevDayClass}>
                <div className="my_day_left_arrow" onClick={this.fetchPreviousDay}></div>
                </div>
                 <img src="/assets/img/loading.gif" className={activityClass} style={ {width:"30px"}}/>
                <span className="fontstyle16pxBold">
                   <span className="mydayBlack icon20"></span> {day}</span>
                 <div className={ 'pull-right ' +nextDayClass}> 
                   <div className="my_day_right_arrow" onClick={this.fetchNextDay}></div>
                </div>
                <div className="divider"></div>                     
                <div className="task-list-container">
                  {taskList}
                </div>
          </div>  
        );
      },
      
    render:function() {
        var self = this;
        var activityClass = '';
        var disableNext = false;
        var disablePrev = false;
        if (this.state.program.myDayFetchProgress) {
          disableNext = true;
          disablePrev = true;
        } else {
          activityClass += ' invisible';
        }
        if(this.state.program.my_day){
          if (this.state.program.my_day.prev_day  == null){
            disablePrev = true;
          }
          if (this.state.program.my_day.next_day == null) {
            disableNext = true;
          }
        }
        return (
            <div id="me-program-my-day">
              <div id="my-day-body" >  
                   {self.renderMyDay()}
              </div>
            </div>
        ); 
    }
});

var UserTaskNoticationUpdater = React.createClass({
  getInitialState:function(){
    return {
      count:0,
      task_popup:false,
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
 
  handleTaskNotificationClick:function(event){   
  
    var nextState = !(this.state.task_popup);
    this.setState({task_popup:nextState});
    event.stopPropagation();

    console.log('have to open the popup');

    if($('#taskNotificationPopup').hasClass('open')){
        $('.taskNotificationDiv').addClass('active');    
    }
    $("body").click(function() {      
        if($('.taskNotificationDiv').find('.active')){
            $('.taskNotificationDiv').removeClass('active'); 
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
    })
    JiyoEvent.subscribe('notification_click',function(){

    });
    
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
 
  filterNotifications:function(type){
    this.setState({filterType:type})
  },
  render:function() {
    var count = "";
    var self = this;
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
     if (data.type == 'task_notification' ) {
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
    var filters = {
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
      buttons.push(
        <button className={"btn btn-link custom-notification "+cls} 
          onClick={this.filterNotifications.bind(null,key)} >{text}
        </button>);
    }
    var requestPopupClass='',taskPopupClass='',articlePopupClass='';
    if (tasks.length == 0){ 
      taskPopupClass = 'hidden';
    }
    var countCls = ''
    if(self.state.count == 0){
        countCls = 'hidden';
    }
     
    return (
        <span><div> 
            <li id="taskNotificationPopup" className="dropdown">       
                <a data-toggle="dropdown" title="My Day" className="dropdown-toggle" 
                    onClick={self.handleTaskNotificationClick} href="#" aria-expanded="false">
                    <div className="taskNotificationDiv" 
                        onClick={self.handleTaskNotificationClick}></div>
                    <p className={countCls +" speech"}>{taskCount}</p>
                </a>
                <ul className="dropdown-menu task_popup" >
                    <li>
                        <div className="topArrow"></div>                       
                    </li>
                    <li>
                        <ul className="sub-task-content">
                            <li className="">                      
                                <UserMyDayWidget me={this.props.me} user={this.props.user} />
                            </li>
                        </ul>   
                    </li>                   
                </ul> 
            </li>         
        </div>
    </span>
    );
  }
});
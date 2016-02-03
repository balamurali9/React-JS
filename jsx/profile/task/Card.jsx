var ProfileTaskCard = React.createClass({
    mixins : [ServerPostMixin],
    getInitialState:function(){
        return {
            showFull:false,
            program:{
               my_day:null,
               myDayFetchProgress:true,
             },
        };
    },  
    handleTaskClick:function(task_data){    
        JiyoEvent.fire('showPageTaskModal',{"task_data":this.props.task});
    },
    sendToTaskClick:function(send_task_data){
        JiyoEvent.fire('showPageSendTaskModal',{"send_task_data":this.props.task}); 
    },
    componentDidMount:function(){
        var self = this;
    },
    render:function(){
          var sendTaskButton = {};
          var statusImage = {};
          var item = this.props.task;
          var icon = "hidden"; 
          var taskAt = item.scheduled_at;
          var localTaskTime  = moment.utc(taskAt,'yyyy-mm-dd HH:mm:ss').toDate();             
          var tmDiff = moment().diff(localTaskTime);
          var description = item.description;
          var status = item.status;
          var item_status = item.time_status;
          var fontStyle = "fontstyleNormal13";
          var utcTime = moment(localTaskTime).format('hh:mm a');    
          var sender = item.sender;
          var senderDisplay ="";
          var senderId = '';
          if((status == 0) || (status == 1) || (status == 3)){  
           if(item_status='past'){      
            statusImage = (<span className="alarmred icon16"></span>)
            fontStyle = "fontstyleGrey13";
          }else if(item_status='future'){
            statusImage = (<span className="alarmGrey icon16"></span>)
            fontStyle = "fontstyleGrey13";
          }else{
            statusImage = (<span className="alarmBlue icon16"></span>)
            fontStyle = "fontstyleGrey13";
          }
          }else if(status == 2) {
            statusImage = (<span className="alarmReject icon16"></span>)
          }else if(status == 4) {
            statusImage = (<span className="alarmGreen icon16"></span>)
          } else if(status == 5) {
            statusImage = (<span className="alarmred icon16"></span>)
          } 
          statusIcon = (<span className={item.category.image_key}></span>);
          if(item_status=='future'){
            statusIcon = (<span className={item.category.image_key}></span>);
          }
          var style = "";
          var top = "";
          if(sender == null){
            senderDisplay = "";
            style="hidden"; 
            top = 0;        
          }else{
            senderDisplay = sender.name;
            senderId = sender.id;
            top = -43;
          }

          var url = item.share_url;

          if ((item.status < 4 && paramObj.me.id < 30 ) || gAppConfig.envVal < gAppConfig.ENV_PROD) {
            url = '/user/give-feedback/'+item.id;
          }

            return (
                <div className="jiyo-task-item clearfix">
                            <span className="statusIcons defaultPointer">{statusIcon}</span>
                            <a href={url} className="statusText">
                            <span className={fontStyle}>
                                <span className="taskNameEllipsis">
                                <TextEllipsis text={item.title} maxlimit="20" />
                                </span>
                            </span>
                            </a>
                            <div className={style +" sharedBitContent"}><a href={"/user/profile/"+senderId} className="primaryColor">{senderDisplay}</a> shared a bit</div>
                            <span className="pull-right defaultPointer" style={{"margin-top":top+"px"}}>
                                <span className="text-center bellAlign">{statusImage}</span><br/>
                                <span className="fontstyle9px text-center">{utcTime}</span>
                            </span>
                            <div className="subdivider"></div>      
                            <div className="height20"></div>
                </div>
              );
    }
});

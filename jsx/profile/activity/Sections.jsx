var ActivityAuthorSection = React.createClass({
  mixins:[HandleAssetLoadMixin],
  render : function(){
    var a = this.props.obj;
    return(<div>
      <div className="taskText"><a href="#">{a.text}</a></div>
       <div className="media-left"><img src={a.task.author.image}/></div>
       <div className="media-body">{a.task.author.name}</div>
      </div>)
  }
});

var ActivityHeadingSection = React.createClass({
  mixins:[HandleAssetLoadMixin],
  render : function(){
    var a = this.props.obj;
    if(a == null) {
        a = {};
        a.text = '';
        a.task = {};
        a.task.owner_info = {};
        a.task.owner_info.name = '';
        a.task.title = '';
    }   
     
    name = "You";
    name = a.task.owner_info.name;
    imgClass = '';
    if (paramObj.me.id == a.task.owner_info.id ) {
      name = "You";
      imgClass = 'hidden';
    }
    
    var statusIcon = (<img src={a.task.category_info.image}  width="15"  height="15" />);

    return (<div className="media">  
          <div className={"media-left "+ imgClass}>
          <a className="media-left" href={'/user/profile/'+a.user_id}>
            <img src={a.task.owner_info.image} className="img-100px-circle"/>      
          </a></div>
           <div className="media-body">
              <div className="completedLine"><span className="fontstyle16pxNormal">{name}</span> <span className="fontstyleGrey12">Completed</span></div>
              <div className="iconLine"><span style={{"marginRight":"5px"}}>{statusIcon}</span><span className="fontstyleGrey12"><span style={{"display":"inline-table"}}><a href={a.task.task_url} className="taskUrl"><TextEllipsis text={a.task.title} maxlimit={this.props.textLimit} /></a></span></span></div>
              <div className="headertimeLine"><span className="headertime">{jiyoFromNow(a.utc)}</span></div>  
           </div>    
    </div>)
  }
});

var ActivityFeedbackSection = React.createClass({
  mixins:[HandleAssetLoadMixin],
  render : function(){
    var a = this.props.obj;
    if(a == null) {
        a = {};
        a.task = {};
        a.task.task_feedback = '';
    }
    var obj= this.props.activity;
    var feedback_color = "";
    var task_feedback = "";
    var task_feedbackText = "";
     switch (a.task.task_feedback) {
         case "0" : 
            task_feedback = (<span className="hateFeedback" style={{"width":this.props.width,"height":this.props.height}}></span>) 
            task_feedbackText = (<span>Hate</span>) 
            feedback_color = a.task.feedback_color;        
            break;
         case "1": 
             task_feedback = (<span className="sadFeedback" style={{"width":this.props.width,"height":this.props.height}}></span>)
             task_feedbackText = (<span>Sad</span>) 
             feedback_color = a.task.feedback_color;     
             break;
          case "2" :
              task_feedback = (<span className="neutralFeedback" style={{"width":this.props.width,"height":this.props.height}}></span>)
              task_feedbackText = (<span>Neutral</span>)
              feedback_color = a.task.feedback_color;      
            break;
          case "3" :
            task_feedback = (<span className="happyFeedback" style={{"width":this.props.width,"height":this.props.height}}></span>)
            task_feedbackText = (<span>Happy</span>) 
            feedback_color = a.task.feedback_color;     
            break;
          case "4" :
            task_feedback = (<span className="loveFeedback" style={{"width":this.props.width,"height":this.props.height}}></span>)
            task_feedbackText = (<span>Love</span>) 
            feedback_color = a.task.feedback_color;     
            break;          
          default:
             task_feedback = (<span className="happyFeedback" style={{"width":this.props.width,"height":this.props.height}}></span>)
             task_feedbackText = (<span>Happy</span>)
             feedback_color = a.task.feedback_color;      
        } 
        var style = "";
        var top = 3;
        if(this.props.width == 30){
          style = 'hidden';
          top = 0;
        }

    return(<div className="feedbackEmotion" style={{'backgroundColor':feedback_color}}>
      <div className="media">  
          <div className="media-left">{task_feedback}</div>
           <div className="media-body ">
              <span className={"task_feedbackText "+style}>{task_feedbackText}<br/></span>
              <span className="feebackMsg" style={{"top":top+"px"}}>{a.task.feedback_message}</span>              
           </div> </div> 
      </div>)
  }
});

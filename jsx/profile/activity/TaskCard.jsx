var ProfileActivityTaskCard = React.createClass({
  mixins:[HandleAssetLoadMixin],
  handleTaskClick:function(){    
    JiyoEvent.fire('showPageModal',{obj:this.props.activity,childKey:'task'});
    return true;
  },
  renderVideo :function(a){
     return (<div className="play-container">
         <div className="play"><img height="40" width="40" src="/assets/img/svg/home_play_icon.svg"/></div> 
          <img 
          onLoad={this.props.onTileLoad} 
          onError={this.props.onTileLoad}  
          className="img-responsive"  src={a.preview} />
    </div>)
  },
  renderAudio:function(a){
    var width = 280;
    var height = width * 152/645;
     return (<div className="play-container audio text-center" style={{padding:"10px 0px"}}>  
        <div className="play">
          <img height="40" width="40" src="/assets/img/svg/home_play_icon.svg"/>
        </div>        
        <img 
          onLoad={this.props.onTileLoad} 
          onError={this.props.onTileLoad} 
          src="/assets/img/ui/task_audio.png" 
          style={{width:width+"px",height:height+"px"}} />     
    </div>)
  },
  renderImage:function(item){
      return (<div>
        <div className="cover-image">
            <img 
              onLoad={this.props.onTileLoad} 
              onError={this.props.onTileLoad} 
              src={item.content} 
              className="img-responsive" />
        </div>
      </div>);
  },
  componentDidMount:function(){
    var self = this;
    JiyoEvent.subscribe('comment_count_change',function  (obj) {
      if (obj.uuid == self.props.activity.task.uuid) {
        self.props.activity.task.comment_count = obj.count;
        self.forceUpdate();
      }
    });  
  },
  deleteActivity:function(uuid,actId){
     if (confirm('Do you really want to remove this bit?')) {
       JiyoEvent.fire('feed_item_delete',{
        actId:actId,
        uuid:uuid
       });
     } 
  },
  render : function(){
    var self = this;

    var a = this.props.activity;
    var list = [];
    var contentList = {};  
    var heading = [];
    var authorTask = [];
    var expression= null;
    var obj = this.props.activity;    

    if(a.action_type=="completed"){
      heading.push(<div className="taskHeader">
          <ActivityHeadingSection obj={obj} textLimit="30" />
      </div>)
    }
    authorTask.push(<div><ActivityAuthorSection obj={obj} /></div>)
    feedbackUI = null;

    var showBig = true;
    var loadHandled = false;
    a.task.content_list.forEach(function(item){
      var obj = {url:item.content};

      switch(item.type){
        case 'image':
            if(item.content != ""){
              showBig = false;
              list.push(this.renderImage(item));
              loadHandled = true;
            }            
            break;
        case 'audio':
        if(item.content != ""){
              showBig = false;
              list.push(this.renderAudio(obj));
              loadHandled = true;
            } 
            break;
         case 'video':
         if(item.content != ""){
              showBig = false;
              list.push(this.renderVideo(item));
              loadHandled = true;
           }  
            break;
          case 'text':
            if (item.content != '') {
              showBig = false;
              list.push(<div className="cover-image" style={{margin:"10px"}}>{item.content}</div>)
            }             
            break;
          default:                
           
      }
    },this);

    if (!loadHandled) {
      setTimeout(function(){
        // console.log("calling tile load when content list is ",
        //   JSON.stringify(a.task.content_list));
        self.props.onTileLoad();
      },25);
    }
    if(showBig) {
      expression = (<div><ActivityFeedbackSection obj={obj} width={50} height={50}/></div>)
    } else {
      expression = (<div><ActivityFeedbackSection obj={obj} width={30} height={30}/></div>)
    } 
    var cls = "";
    if (a.user_id != paramObj.me.id) {
      cls = "hidden";
    }
    //console.log(a);
     return (<div >     
      <div className="panel-heading defaultPointer"> {heading} </div>    
        <div className="panel-body" onClick={this.handleTaskClick}>     
        {list}      
        {expression}
        </div>
            <div className="panel-footer" style={{position:"relative", cursor:"default"}}>
                <div className="articlesSocialMediaIcons">
                  <span className="articlesSocialMediaIconsSpace20" style={{"display":"inline-table","cursor":"pointer"}} title="Likes">
                    <ContentLikeUnlike obj={obj.task} />
                  </span>
                  <span title="Comments">
                  <span className="articlesSocialMediaIconsSpace5 commentImg icon16" title="Comments"></span>				           
                  <span style={{"vertical-align":"middle","font-size":"13px"}}>{obj.task.comment_count}</span>
                  </span>
                   
                  <div className={cls +" dropup  pull-right"}>
                    <a className="btn btn-link dropdown-toggle"   title="Delete Activity" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <span className="caret"></span>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-right" style={{position:"absolute"}} aria-labelledby="dropdownMenu2">
                      <li><button className="btn btn-link" onClick={this.deleteActivity.bind(null,a.act_uuid,a.id)}>Delete Bit Feedback</button></li>
                    </ul>
                </div>
                </div>
            </div>
      </div>) 
  }
});

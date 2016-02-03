var ProfileActivityCard = React.createClass({
  tileLoadHandler:function(){
    this.props.onTileLoad(this);
  },
  render : function(){ 
    var specific = null;
    var self = this;
    var type = self.props.activity.card_type;
    switch (type) {
      // case "user" : 
      //   specific = (<ActivityUserConnect onTileLoad={self.tileLoadHandler}
      //       activity={self.props.activity} />);
      //   break;
      // case "article": 
      //   specific = (<ActivityArticleComponent onTileLoad={self.tileLoadHandler} 
      //     activity={self.props.activity} />);
      //   break;
      // case "post"  : 
      //   specific = (<ActivityUserStatus  onTileLoad={self.tileLoadHandler} 
      //     activity={self.props.activity} />);
      //   break;
      //  case "media": 
      //   specific = (<ActivityImageComponent  onTileLoad={self.tileLoadHandler} 
      //     activity={self.props.activity} />);
      //   break;
      case "assessment" :
        self.props.activity.task = self.props.activity.assessment;
        specific = (<ProfileActivityTaskCard  onTileLoad={self.tileLoadHandler} 
          activity={self.props.activity} />)
        break;
      case "task" :
        specific = (<ProfileActivityTaskCard  onTileLoad={self.tileLoadHandler} 
          activity={self.props.activity} />)
        break;
      default:
        specific = (<div>{"Unknown Activity"+type}</div>);
    } 
  
    return (<div id={self.props.activity.id} className="clearfix activityTile invisible">        
        <div className={"activity-body "+type } >{specific}</div>
    </div>)
  }
});

var ContentLikeUnlike = React.createClass({
  getInitialState:function(){
    return {
      likeInfo:{
        meLiked:false,
        count:null,
      },
	  errorMessage:null
    }
  },
  componentDidMount:function() {
    var self = this;
    JiyoEvent.subscribe('object_like',function(obj){ 
      if(obj.uuid == self.props.obj.uuid){
        if (obj.count){ 
          self.props.obj.like_count = obj.count;
        }
        self.forceUpdate();
      }
    });
    JiyoEvent.subscribe('object_unlike',function(obj){
      if(obj.uuid == self.props.obj.uuid){
        self.props.obj.like_count = obj.count;
        self.forceUpdate();
      }
    });
  },
  likeObject:function(){
    UserLikesManager.like(this.props.obj.uuid);

  },
  unlikeObject:function(){
    UserLikesManager.unlike(this.props.obj.uuid);
  },
  render:function() {  
    var self = this;   
    var errorMessage = null;
    if (this.state.errorMessage) {
      errorMessage = (<div className="text-danger">{this.state.errorMessage}</div>)
    }
    
    var likeUnlikeButton = ( <a onClick={this.likeObject}><span className="likeGrey icon16" title="Unlike"></span></a>);

    if (UserLikesManager.hasLiked(self.props.obj.uuid)) {
      likeUnlikeButton = ( <a onClick={this.unlikeObject}><span className="likeRed icon16" title="like"></span></a>);
    } 
    return (
		<div>
			<div>{likeUnlikeButton}<span className="likeCountSpan">{this.props.obj.like_count}</span></div> 
			<div>{errorMessage}</div>
		</div>
    );
  }
});
var ProfileActivityActionWidget = React.createClass({
  getInitialState:function(){
    return {
      errorMessage:null,      
    }
  },
  componentDidMount:function(){
    var self = this;
    JiyoEvent.subscribe('comment_count_change',function  (obj) {
      self.props.obj.comment_count = obj.count;  
      self.forceUpdate();
    });
  }, 
  render : function(){
    var comments = [];

    var obj = this.props.obj;
    if (typeof (obj.comment_count) == 'undefined'){
      obj.comment_count = 0 ;
    }

    var errorMessageClass = 'hidden';
    if (this.state.errorMessage != null) {
      errorMessageClass = ''
    }

    return (<div id="acitivityInteractionComponent"> 
      <div className="articlesSocialMediaIcons">
        <span className="articlesSocialMediaIconsSpace20 pointer" style={{"display":"inline-table"}} title="Likes">
          <ContentLikeUnlike obj={obj} />
        </span>
        <span title="Comments">
          <a href="#" ><span className="articlesSocialMediaIconsSpace5 commentImg icon16" title="Comments"></span></a>
          <span className="commentCount">{obj.comment_count}</span>
        </span>
      </div>
      <div className="commentsPanel arrow_box" >
        <ContentCommentWidget obj={obj} />
      </div>
    </div>);
  }
});

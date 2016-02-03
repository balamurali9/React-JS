var ContentCommentWidget = React.createClass({
  mixins : [ServerPostMixin],
  getInitialState:function(){
    return {
      comments :null,
      errorMessage:null,
    showCommentCount:3
    }
  },
 
  componentDidMount:function() {
    var self = this;
    Api.getData('/content/comments',{object_uuid:this.props.obj.uuid},function(resp){
      self.setState({comments:resp.data.comments})
    });

  
    $('[data-dismiss=modal]').on('click', function (e) {
      var $t = $(this),
          target = $t[0].href || $t.data("target") || $t.parents('.modal') || [];
      
      $(target)
      .find("input,textarea,select")
         .val('')
         .end()
      .find("input[type=checkbox], input[type=radio]")
         .prop("checked", "")
         .end();
    });
  },
  handleCommentSubmit:function(e){
    var self = this;
    var data = $('#commentSubmitForm').serializeToObject();
    self.setState({errorMessage:null});
    $('#article-post-comment').attr('disabled','disabled');
    Api.postData('/content/comment',data,function(response){
       if (response.success) {
        $('#cmntsCharCount').text(500);
        $("#commentTextArea").val('');
          self.setState({comments:response.data.comments});
          JiyoEvent.fire('comment_count_change',{
            count:response.data.count,
            uuid:response.data.object_uuid
          });

       } else {
          self.setState({errorMessage:response.message})
       }
       $('#article-post-comment').removeAttr('disabled');
    });
    return this.stopEvent(e);
  },  
  updateCommentCharactersCount:function(e){
    var len = e.target.value.length;
    if (len > 500) {
      e.target.value = e.target.value.substring(0, 500);
    } else {
      $('#cmntsCharCount').text(500 - len);
    }
    if (e.keyCode == 13) {
        this.handleCommentSubmit(e);
    }
  },
  deleteComment:function(commentId){
    var self = this;
     if (confirm("Are you sure you want to delete this comment?")) {
      Api.postData("/content/remove-comment",{comment_id:commentId},function(response){
        if (response.success) { 
          self.setState({comments:response.data.comments});

          JiyoEvent.fire('comment_count_change',{
            count:response.data.count,
            uuid:response.data.object_uuid
          });
          
        } else {
          self.setState({errorMessage:response.message})
        }
      });
    }
    return false;
  }, 
  showMoreComments:function(){
    this.setState({showCommentCount:this.state.showCommentCount+15});
  },
  render:function() {  

    var self = this;   
    var comments = null; 
    if (this.state.comments == null) {
      comments = (<div className="text-center"><span className="throbber"></span></div>)
    } else {
      comments = [];
    var idx = 0;
      this.state.comments.forEach(function(item){
    if (idx++ < self.state.showCommentCount) {
      comments.push(<ContentCommentCard deleteComment={self.deleteComment} comment={item} />);
    }
      });
     this.props.obj.comment_count = comments.length;
    }
  var viewMoreButton = null;
  if (idx > self.state.showCommentCount) {
  viewMoreButton = (<button className="btn btn-link btn-xs viewMoreBtn"  onClick={this.showMoreComments} >View More</button>)
  }
    var errorMessage = null;
    if (this.state.errorMessage) {
      errorMessage = (<div className="text-danger">{this.state.errorMessage}</div>)
    }

    return (
      <div id="article-comments-holder">
     
      <div className="clearfix commentHolderDiv">
        <h4>Say something</h4>
        <div className="list-group article-comments">
          <div className="comment-add-form" >
          <form id="commentSubmitForm" onSubmit={self.handleCommentSubmit}>
            <input type="hidden" name="object_uuid" value={this.props.obj.uuid} />
            <textarea onKeyUp={self.updateCommentCharactersCount} rows="5" id="commentTextArea" 
              className="text-area form-control textareaFormControl" placeholder="Tell us what you're thinking" name="comment"></textarea>
            <div><h6>Characters Remaining: <span id="cmntsCharCount">500</span></h6></div>
            <div>{errorMessage}</div>
            <div className="clearfix"><button id="article-post-comment" className="btn btn-primary pull-right btn-sm orangeBtn">Post Comment</button></div>
          </form>
          </div>
          <div>{comments}</div>
          <div className="text-center">{viewMoreButton}</div>
          <div className="height20 clearfix"></div>
        </div> 
      </div>

      </div>
      );
  }
});


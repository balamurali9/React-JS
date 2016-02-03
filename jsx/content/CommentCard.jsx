var ContentCommentCard = React.createClass({
	mixins : [ServerPostMixin],
	getInitialState:function() {
		return {
				viewClass:"",
				editClass:"hidden"
		}
	},

  reportComment:function(commentId){
    var self = this;
    JiyoEvent.fire('report_popup_open');

    $("#report_abuse_response").removeClass().addClass('hidden');
    $("#comment_report_id").val(commentId);
    setTimeout(function(){
     	$("#report_abuse_modal").modal('show');
    },100);
  },
  editCommentSubmit:function(e){
    var self = this;
    var data = $(e.target).serializeToObject();
	console.log(data);
	this.stopEvent(e);

    $('#article-edit-comment').attr('disabled','disabled');
    Api.postData('/content/update-comment',data,function(response){
       if (response.success) {
        $('#cmntsCharCount').text(500);
        $("#commentTextArea").val('');
		self.props.comment = response.data; 
		self.setState({
			viewClass:"",
			editClass:"hidden"
		});
       } else {
          self.setState({errorMessage:response.message})
       }
       $('#article-edit-comment').removeAttr('disabled');
    });
    return this.stopEvent(e);
  }, 
  editComment:function(commentId){
    this.setState({
			viewClass:"hidden",
			editClass:""
	})
  },
	render:function(){
		
		var comment = this.props.comment;
		  var deleteBtn = null;
    var reportBtn = null;
	var editBtn = null;
    if (paramObj.me.id == comment.author_id) {
		deleteBtn = (<button className={this.state.viewClass + " comment-delete-btn btn btn-link btn-xs deleteBtn"} 
		type="button" onClick={this.props.deleteComment.bind(null,comment.id)}>&times;</button>);
    } else {
      reportBtn = (<button className="comment-report-btn btn btn-link btn-xs" 
        type="button" onClick={this.reportComment.bind(null,comment.id)}>report abuse</button>);
    }
	if (paramObj.me.id == comment.author_id) {
		editBtn = (<span onClick={this.editComment.bind(null, comment.id, comment)} className={this.state.viewClass + " editCommentButton"}></span>);
    }
    return (
	<div className="article-comment  media">
		<a className="media-left" href={"/user/profile/"+comment.author_id}>
		  <img className="comment-img" src={comment.user_image} alt={comment.user_name} />
		</a>
		<div className="media-body">
			{deleteBtn}
			{editBtn}
			{reportBtn}
			<div className="comment-blue-text">
				{comment.user_name}
				<span style={{'font-size':'14px','margin-left':'10px'}} className="comment-date articlesDetailsTime">{jiyoFromNow(comment.utc)}</span>
			</div>
			<div className="widthheight20"></div>
			<div style={{'color':'#000000'}} className={this.state.viewClass +" comment-text"}>{comment.text}</div>
			<form className={this.state.editClass} onSubmit={this.editCommentSubmit}>
				<textarea className="form-control textareaFormControl" name="comment">{comment.text}</textarea>
				<input name="comment_id" type="hidden" value={comment.id} />
				<div className="height10 clearfix"></div>
				<button className="btn btn-primary pull-right orangeBtn">Save</button>
			</form>
		</div>
    </div> );
	}
	
});


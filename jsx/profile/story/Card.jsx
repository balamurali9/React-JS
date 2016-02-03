var ProfileStoryCard = React.createClass({
	mixins:[ServerPostMixin, HandleAssetLoadMixin],
	handleStoryEdit:function(storyId){
		var self = this;
		 Api.getData('/story/view/' + storyId +{},function(response){ 
		 	JiyoEvent.fire('showBeingCreateModal',response.data); 
		 });
	},
	deleteStory:function(storyId){
		var self = this;
		   if (confirm("Are you sure you want to delete this story?")) {
		   Api.getData('/story/update-status/'+ storyId +'/TRASH',{},function(response){
			if (response.success) {
				JiyoEvent.fire('reload_stories','TRASH');
				JiyoEvent.fire('reload_stories','PUBLISHED');
				JiyoEvent.fire('reload_stories','DRAFT');
			} else {
				alert("Remove or Delete story an unsuccessful");
			}
		  });
		}
		return false;
    },
	componentDidUpdate :function() {
		var images = $("#story_"+this.props.story.id+ " .contentImamge");
		if (images.length == 0) {
			return;
		}
		var status = images[0].completed;
		console.log("Status : ",status)
		if (status && this.props.onTileLoad) {
			this.props.onTileLoad();
		} 
	},
	renderContentSection:function() {
		var story = this.props.story;
		return [
			(<div className="panel-heading" >
				<div className="media clearfix">
					<div className="media-body">
						<a className="articlesTextCus" href={story.url}>
							<strong><TextEllipsis text={story.title} maxlimit="32" /></strong>
						</a>
					</div>
				</div>
			</div>),
			(<div className="panel-image midImage" >
				<a  href={story.url}>
					<img   src={story.image} className="contentImage img-responsive" 
						onLoad={this.handleImageLoad}   onError={this.handleImageError}/>
				</a>
			</div>)
		];
	},
	renderDraft : function() {
		var draft = this.props.story;
		if(draft == undefined) {
			return (<div></div>);
		}
	    return ( 
			<div className="custom-panel">
				{this.renderContentSection()}
				<div className="panel-body">
					<div className="pull-right">
						<a title="Edit" className="pull-right pointer" 
							onClick={this.handleStoryEdit.bind(null,draft.id)} 
							style={{"margin-left":"10px"}}>
							<img alt="Edit" src="/assets/img/svg/edit_icon.svg"  
								style={{'height':'20px', 'width':'20px'}} />
						</a>
						<a title="Remove" className="pull-right" href="#"  
							onClick={this.deleteStory.bind(null,draft.id)}>
							<img alt="Remove" src="/assets/img/svg/div_close.svg"  
							style={{'height':'20px', 'width':'20px'}} />
						</a>
					</div>
				</div>
			</div> 
		);
	},
	renderTrash:function() {
		var trash = this.props.story;
		if (trash == undefined) {
			return (<div></div>);
		}
	    return (
			<div className="custom-panel">
				{this.renderContentSection()}
				<div className="panel-body">
					<div className="pull-right">
						<a title="Edit" className="pointer pull-right" onClick={this.handleStoryEdit.bind(null,trash.id)} >
							<img alt="Edit" src="/assets/img/svg/edit_icon.svg"  style={{'height':'20px', 'width':'20px'}} />
						</a>
					</div>
				</div>
			</div>
		);
	},
	renderPublished:function() {
		var story = this.props.story;
		if(story == undefined) {
			return (<div>Something is wrong</div>);
		}
		var iconViewed = '';
		if (UserStoryViewsManager.hasViewedStory(story.uuid)) {
			iconViewed = (<img height="16" className="articlesSocialMediaIconsSpace5" width="16" 
					src="/assets/img/svg/home_view_green.svg" alt="Views"/>);
		}else {
			iconViewed = (<img height="16" className="articlesSocialMediaIconsSpace5" width="16" 
				src="/assets/img/svg/home_view_grey.svg" alt="Views"/>);
		}
		var clscls="";
		if(paramObj.me.id != paramObj.user.id){
			clscls='hidden';
		}
	    return (
			
					<div className="custom-panel">
						 {this.renderContentSection()}
						<div className="panel-body">
							<div className="articlesSocialMediaIcons pull-left">
								<span className="articlesSocialMediaIconsSpace20" title="Views">
									{iconViewed}
									<span className="articleViewCount">{story.view_count}</span>
								</span>
								<span className="articlesSocialMediaIconsSpace20 pointer" style={{"display":"inline-table"}} title="Likes">
									<ContentLikeUnlike obj={story} />
								</span>
								<span title="Comments" className="pointer">
									<a href={story.url + "#comments"} ><img height="16" className="articlesSocialMediaIconsSpace5" width="16" src="/assets/img/svg/home_chatbubble_grey.svg" alt="Comments"/></a>
									<span className="fontstyleNormal13" style={{"verticalAlign":"middle"}}>{story.comment_count}</span>
								</span>
							</div>
							<div className={"pull-right "+clscls}>
								<a title="Edit" className={"pointer pull-right "+clscls} onClick={this.handleStoryEdit.bind(null,story.id)} style={{"margin-left":"10px"}}>
								  <img alt="Edit" src="/assets/img/svg/edit_icon.svg"  style={{'height':'20px', 'width':'20px'}} />
								</a>
								<a title="Remove" className={"pull-right "+clscls} href="#"  onClick={this.deleteStory.bind(null,story.id)}>
								  <img alt="Remove" src="/assets/img/svg/div_close.svg"  style={{'height':'20px', 'width':'20px'}} />
								</a>
							</div>
						</div>
					</div>
				
		);
	},
	render:function(){ 
		var content = null;
		if (this.props.story.status == 'DRAFT') {
			content =  this.renderDraft();
		} else if (this.props.story.status == 'TRASH') {
			content = this.renderTrash();
		}  else {
			content = this.renderPublished();	
		}
		return (<div id={"story_"+this.props.story.id} className="storyCard invisible" style={{width:"300px"}}>
				<div className="content animate-panel">
					{content}
				</div>
			</div>
				)
  	}	
});

 
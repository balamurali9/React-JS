var ProfileStoryPanel = React.createClass({
	mixins : [ServerPostMixin],
	handleCreateStoryClick:function(){
		JiyoEvent.fire('showBeingCreateModal'); 
	},
	componentDidMount:function() {
		$('.wellBeingSubTab li a').on('shown.bs.tab', function (e) {
			 JiyoEvent.fire('forcelayout_stories')
		})
	},
	render: function() {
		var cls="";
		if(paramObj.me.id != paramObj.user.id){
			 return (<ProfileStoryLoader type="PUBLISHED" url={"/user/stories/"+paramObj.user.id} emptyText="No stories published." />);
		}
        return ( 
        <div>
        <div>
			<ul className={ "nav nav-tabs wellBeingSubTab " +cls} role="tablist" style={{}}>
				<li role="presentation" className="active">
					<a href="#publishedImage"    aria-controls="publishedImage" role="tab" data-toggle="tab" style={{"border": "0 none","backgroundColor":"transparent"}}>
					  <span className="publishedImage"></span>Published</a>
				</li> 
				<li role="presentation" >
					<a href="#draftImage"    aria-controls="draftImage" role="tab" data-toggle="tab" style={{"border": "0 none","backgroundColor":"transparent"}}>
					  <span className="draftImage"></span>Draft</a>
				</li>
				<li role="presentation" >
					<a href="#trashImage" aria-controls="trashImage" role="tab" data-toggle="tab" style={{"border": "0 none","backgroundColor":"transparent"}}>
					  <span className="trashImage"></span>Trash</a>
				</li> 
				<li  className="writeAStoryButton" >
						<button type="button" onClick={this.handleCreateStoryClick} className="btn btn-default">Write a Story</button>
				</li>
			</ul>
			<div className="tab-content" >
				<div role="tabpanel" className="tab-pane active" id="publishedImage">
					<ProfileStoryLoader type="PUBLISHED" url="/user/stories/" emptyText="No published stories." />
				</div> 
				<div role="tabpanel" className="tab-pane" id="draftImage">
					<ProfileStoryLoader type="DRAFT" url="/story/list/DRAFT"/>
				</div>
				<div role="tabpanel" className="tab-pane" id="trashImage"   >
					<ProfileStoryLoader type="TRASH" url="/story/list/TRASH" emptyText="No stories in trash."/>
				</div>
			</div>
		</div>
		<div><ProfileStoryCreateModal /></div>
		</div>
    ); 
    }
});
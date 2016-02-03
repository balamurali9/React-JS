var RecommendUsersList = React.createClass({	  
	mixins:[ServerPostMixin],
	getInitialState:function(){
	return {
		recommendedList:null,
		count:0,
		activeTab:0
	}
	},
	removeUser:function(userId) {
		var self = this;
		for(var idx = 0; self.state.recommendedList.length;idx++) {
			if (self.state.recommendedList[idx].id == userId){
				self.state.recommendedList.splice(idx,1);
				break;
			}
		}
		if (self.state.recommendedList.length == 4) {
			self.loadRecommendations();
		} 
		self.forceUpdate();

	},
	acceptUserRequest:function(userId){
		var self = this;
		Api.postData('/community/connect-with-user',{user_id:userId},function(){ 
			self.removeUser(userId);
		});

	},
	rejectUserRequest:function(userId){
		var self = this;
		Api.getData('/community/remove-recommendation/'+userId,{},function(){
			self.removeUser(userId);
		});
	},  

	loadRecommendations:function() {
		var self = this;
		 Api.getData('/community/community-recommendation',{},function(response){ 		 	
	    	if (self.state.recommendedList == null) {
	    		
	    		if (self.props.onTileLoad) {
	    			self.props.onTileLoad(self);
	    		} else {
	    			$(self.getDOMNode()).removeClass('invisible');
	    		}
	    		self.state.recommendedList = [];
	    	}
	    	for(var idx = 0;idx < response.data.length;idx++){
	    		self.state.recommendedList.push(response.data[idx]);
	    	}
	    	self.forceUpdate();
		 });
	},
	componentDidMount:function(){ 
		var self = this;
		self.loadRecommendations();
		$('#recommendedUserCarousel').on('slide.bs.carousel', function (e) { 
		  self.state.activeTab = $(e.relatedTarget).index();
		  //self.forceUpdate();
		})
	},

	renderUserList:function(user){
		var name= user.first_name;
		if(name == null){
			name = user.display_name;
		}
		return (<div className="media">
					<div className="pull-left">           
				        <a href={'/user/profile/'+user.id}>
				        	<img className="media-object media-middle img-circle " src={user.profile_image_url} alt={user.profile_image_url} width="35" height="35"/>
				        </a>
					</div>
					<div className="pull-right">
						<button title="Add Friend" className="btn btn-primary accept-user-btn" onClick={this.acceptUserRequest.bind(null,user.id)}></button>
						<button title="Remove" className="btn btn-primary reject-user-btn" onClick={this.rejectUserRequest.bind(null,user.id)}></button>
					</div> 
					<div className="media-heading">
				        <p>
				        	<span><a href={'/user/profile/'+user.id} className="fontstyle13px">{name} </a></span><br/>
				        </p>
					</div>  
				</div>);
	},
	showMoreRecommendUsers:function(){

	},
	render:function() {
	 
		var self=this;
		var recommendationDiv = [];		
		var recommendedList = self.state.recommendedList;
	 	 var view_all_div = '';
		if (recommendedList) {

			if (recommendedList.length == 0) {
				recommendationDiv.push((<div className="text-center recommendationDiv" style={{"marginBottom":"10px"}}>No More users </div>))
			} else {		   
				for(var idx =0;idx < 5;idx++) {
			  		var user = recommendedList[idx];
			  		var u1 = self.renderUserList(user);		  		
			  		recommendationDiv.push(<li className="list-group-item">{u1}</li>);
			  	}

			}
			
		}
		
	    return (<div className="userRecommendationTile invisible">
	    		<div className="recommendedUsersList clearfix custom-panel">
					<div className="content clearfix" >
						<div className="artilce-teaser-panel">
							<div>
								<h4 className="text-center">People similar to You</h4>
							</div>
							<hr></hr>
							<ul className="recommededRequest">
							 		{recommendationDiv} 						
		    				</ul>
		    				{view_all_div}
						</div>
					</div>
				</div>
			</div> );
	}
});
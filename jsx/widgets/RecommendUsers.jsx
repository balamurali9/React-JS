var RecommendUsers = React.createClass({	  
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
	    		self.props.onTileLoad(self);
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
	renderUser:function(user){
		var name= user.first_name;
		if(name == null){
			name = user.display_name;
		}
		return (<div className={"text-center itemDiv "+user.id} style={{"width":"50%","float":"left"}}>
					<button className="deleteUser" type="button" onClick={this.rejectUserRequest.bind(null,user.id)}>&times;</button>
				 	<div style={{"marginTop":"-22px"}}>
					 	<a href={'/user/profile/'+user.id}>
				           <img src={user.profile_image_url} className="img-70px-circle" />      
				        </a>
			        </div>
			        <div className="textellipsis"><a href={'/user/profile/'+user.id}>{name}</a></div>
			        <div className="clearfix">
			        <button className="btn btn-primary btn-sm orangeBtn" onClick={this.acceptUserRequest.bind(null,user.id)}><span className="addFriendImg"></span><span>Add Friend</span></button>
			        </div>
				</div>);
	},
	render:function() {
	 
		var self=this;
		var recommendationDiv = [];		
		var recommendedList = self.state.recommendedList;
	 
		if (recommendedList) {

			if (recommendedList.length == 0) {
				recommendationDiv.push((<div className="text-center recommendationDiv">No More users </div>))
			} else {
				var tabIdx = 0;
				if ( recommendedList.length <= self.state.activeTab * 2 ) {
			  		self.state.activeTab = 0;
			  	} 
				for(var idx =0;idx < recommendedList.length;idx+=2) {
			  		var user = recommendedList[idx];
			  		var cls = ''; 
			  		
			  		if (tabIdx == self.state.activeTab) {
			  			cls = 'active tm_'+(new Date().getTime());
			  		}

			  		var u1 = self.renderUser(user);
			  		var u2 = null;
			  		if (idx+1 < recommendedList.length) {
			      		var user2 = recommendedList[idx+1]
			      		u2 = self.renderUser(user2);
			      	} 
			  		recommendationDiv.push(
						<div className={"item " + cls}>
						 	{u1}
						 	{u2}
						</div>
					);
					tabIdx++;
			  	}

			}
			
		}
		
	    return (
			<div className="recommendedUsers custom-panel">
			<div className="content clearfix" >
					<div className="artilce-teaser-panel">
						<div>
							<h4 className="text-center">People similar to You</h4>
						</div>
						<hr></hr>
						<div id="recommendedUserCarousel" className="carousel slide" data-interval="false" data-wrap="false" >
							<div className="carousel-inner">
						 		{recommendationDiv}
						 	<a id="corouselLeftBtn" className="left carousel-control" href="#recommendedUserCarousel" role="button" data-slide="prev">&lsaquo;	
							</a>
							<a id="corouselRightBtn" className="right carousel-control" href="#recommendedUserCarousel" role="button" data-slide="next">&rsaquo;								
							</a>							 							 	
							</div>	
												 	
						</div>
					</div>
				</div>
			</div> 
	    );
	}
});
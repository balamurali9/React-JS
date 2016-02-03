var InviteFriends = React.createClass({
	mixins:[ServerPostMixin],
	getInitialState:function(){
		return { 
			message:"", 
			errorMessage:null
		}
	},
	componentDidMount:function(){
		var self = this;
		if (this.props.onTileLoad) {
			this.props.onTileLoad(self);
		} 
		
		self.forceUpdate();
		
	},
	handleInviteFriendSubmit:function(e){
		var self = this;
		var formData = $('#inviteFriendsForm').serializeToObject();
		self.setState({errorMessage:null});
		$('#inviteFriendSubmit').attr('disabled','disabled');
		Api.postData('/community/invite-friends-via-email/',formData,function(response){ 
		
		   if (response.success) {
		    alert("Thank you for inviting your friend(s)");
			$("#exampleInputEmail1").val('');
            $('#messageTextArea').val($('#messageTextArea').text());
            $('#jiyoDiscoverContent').masonry({isFitWidth:true});
		   } else {
			  self.setState({errorMessage:response.message});
			  $('#jiyoDiscoverContent').masonry({isFitWidth:true});
		   }
		   $('#inviteFriendSubmit').removeAttr('disabled');
		});
		return this.stopEvent(e) ;
	},
	facebookHandleClick:function(){
		FB.ui({
		  method: 'send',
		  link: 'http://www.jiyo.com',
		});
	},
    render:function() {
		var self = this;
		var name = self.props.me.first_name;
        if(name == '' || name == null) {
            name = self.props.me.display_name;
        }
		var inviteMessage = null;

		if(self.state.message){
			inviteMessage = (<div className="alert alert-success" 
					role="alert">{self.state.message}</div>);
		}
		
		var fbInviteButton  = (<div>
					<a onClick={this.facebookHandleClick} 
					className="btn btn-block btn-social btn-facebook" 
					style={{"position": "relative", "top":"96px"}}>
					<i className="fa fa-facebook"></i> <span className="text-center" style={{display:"block"}}>Invite Facebook Friends</span>
					</a>
			  </div>);
		
		var errorMessage = null;
		var height = 253;
		if (this.state.errorMessage) {
			  errorMessage = (<div className="text-danger text-center" style={{"padding":"10px"}}>{this.state.errorMessage}</div>)
			  height = 287;
		}
        return (
			<div className="InviteFriendsPanel InvitePanelForConnection custom-panel">
				<div className="content">
					<div className="artilce-teaser-panel">
					<div style={{"padding":"0 0 5px 0"}}>
						<h4 className="text-center" style={{"margin-bottom":"18px"}}>Get your friends into the community! </h4>
						<hr style={{"margin":"0"}}></hr>
					</div>
					<div className="panel-body" style={{padding:"0px"}}>				 
						<div>
							<ul className="nav nav-tabs inviteFriends-tab" role="tablist">
								<li role="mail" className="active" >
								<a href="#mail" title="mail"   aria-controls="mail" role="tab" data-toggle="tab" style={{"border": "0 none","backgroundColor":"transparent"}}>
								  <span className="mail-icon"></span>
								  </a>
								</li>
								<li role="facebook">
									<a href="#facebook"  title="facebook"   aria-controls="facebook" role="tab" data-toggle="tab" style={{"border": "0 none","backgroundColor":"transparent"}}>
								  		<span className="facebook-icon"></span>
								  	</a>
								</li> 
								<li role="google" >
									<a href="#google-tab"  title="Google"   aria-controls="google" role="tab" data-toggle="tab" style={{"border": "0 none","backgroundColor":"transparent"}}>
								  		<span className="google-icon"></span>
								  	</a>
								</li> 
							</ul>
						  <div className="tab-content" >								
								<div role="tabpanel" className="tab-pane active" id="mail" style={{"height":height+"px"}}>
								<div>{errorMessage}</div>
									<form id="inviteFriendsForm" onSubmit={self.handleInviteFriendSubmit} className="clearfix">
									  <div className="form-group required" style={{"margin-bottom":"0px"}}>
										<label for="exampleInputEmail1">Email ID:</label>
										<input name="email_ids" className="form-control" id="exampleInputEmail1" placeholder=""/>
									  </div>
									  <small style={{"color":"#0066cc","marginBottom":"10px"}}>Add as many email ids as you&#39;d like</small>
									  <div className="form-group" style={{"marginTop":"15px"}}>
										<label for="messageTextArea">Message:</label>
										<textarea name="message" onKeyUp={self.updateMessageCharactersCount} id="messageTextArea" className="form-control" rows="3"  >{ name +" wants you be a part of their journey on Jiyo. See you there!"}</textarea>
									  </div>
									  <div className="clearfix text-center">
										  <button id="inviteFriendSubmit" className="btn orangeBtn">Invite</button>
										  <div className="height10"></div>
									   </div>
									</form>
								</div>
								<div role="tabpanel" className="tab-pane" id="facebook" style={{"height":height+"px"}}>
									{fbInviteButton}
								</div> 

								<div role="tabpanel" className="tab-pane" id="google-tab" style={{"height":height+"px"}}>
									<GoogleInvitePanel />
								</div> 
						  </div>
						</div>
					</div>
					</div>
				</div>
			</div> 
        );
    }
});

var GoogleInvitePanel = React.createClass({

	getInitialState:function(){
		return {
			contactList:null,
			accessToken :null
		}
	},
	componentDidMount:function(){

	},
	loadContacts:function(){

	},
	handleAuth:function(){ 
		var self = this;
        var config = {
          'client_id': '553186704884-e2oe337fff0lckjluh4j8s85ia75fnah.apps.googleusercontent.com',
          'scope': ['https://www.googleapis.com/auth/contacts.readonly',
          'https://www.googleapis.com/auth/plus.me',
          'https://www.googleapis.com/auth/plus.login']
        };
        gapi.auth.authorize(config, function(resp) {
        	var token = gapi.auth.getToken().access_token;
        	$.getJSON('https://www.google.com/m8/feeds/contacts/default/full/?access_token=' + 
             token + "&alt=json&v=3.0&max-results=200&callback=?", function(result){
			      // console.log(result);
			      var contactList = [];
			      // console.log('resut ',result);/
			      for(var idx = 0;idx < result.feed.entry.length;idx++) {
			      	var e = result.feed.entry[idx];
			      	var pic = null;

			      	for(var k=0;k < e['link'].length;k++) {
			      		if (e['link'][k].type.indexOf('image') != -1 && typeof(e['link'][k]['gd$etag']) != 'undefined') {
			      			pic = e['link'][k].href;
			      			break;
			      		}
			      	}

			      	if (typeof e['gd$email'] == 'undefined'){
			      		continue;
			      	}

			      	if (e['gd$email'].length == 0){
			      		continue;
			      	}

			      	if (pic != null) {
			      		pic += "&access_token="+token;
			      	} else {
			      		pic ="/assets/img/profile_default.png";
			      	}
			      	var name = e['gd$email'][0]['address'];
			      	if (typeof e['gd$name'] != 'undefined') {
			      		var nameObj = e['gd$name'];
			      		if (typeof nameObj['gd$fullName'] != 'undefined'){
			      			name = nameObj['gd$fullName']["$t"];
			      		} else if (typeof nameObj['gd$givenName'] != 'undefined'){
			      			name = nameObj['gd$givenName']["$t"];
			      		}
			      	}

			 		contactList.push({
			 			email:e['gd$email'][0]['address'],
			 			image:pic,
			 			name:name
			 		});
			      }

			    contactList = _.shuffle(contactList);
			    self.setState({contactList:contactList}) 
			}); 
        });
      
	},
	onSendClick:function(email,name){
		console.log('Email ',email);
		var self = this;
		var formData = {
			email_ids:email,
			message: paramObj.me.display_name +" wants you be a part of their journey on Jiyo. see you there!"
		};
		self.removeMe(email);
		Api.postData('/community/invite-friends-via-email/',formData,function(response){ 
		   if (response.success) {
		    	alert("Thank you for inviting your friend(s)");
		   } else {
			  	alert(response.message)
		   } 
		  
		}); 
	},
	removeMe:function(email){
		for(var idx =0;idx < this.state.contactList.length;idx++) {
			if (this.state.contactList[idx].email ==email) {
				this.state.contactList.splice(idx,1);
			}
		}
		this.forceUpdate();
	},
	renderUser:function(data){ 


		return (
			<div className="friendRequestTab">
				<div className="faceBookFriendRequestTeaser">
					<div className="media">
						<div className="pull-right" style={{" margin-top":"10px"}}>
							<button title="Send invite"  
								onClick={this.onSendClick.bind(null,data.email)} 
								className="btn btn-primary accept-button"></button>
							<button title="Remove"  
								onClick={this.removeMe.bind(null,data.email)} 
								className="btn btn-primary reject-button"></button>
						</div> 
						<div className="pull-left">           
							<img className="media-object media-middle img-circle" 
									src={data.image} 
									alt="" 
									width="35" 
									height="35"  />
							  
						</div>     
						<div className="media-heading">
							<p>
							<span>
								<h5 style={{" margin-top":"-6px"}}>
									<TextEllipsis text={data.name} maxlimit="16" />
								</h5>
							</span>
							</p>
						</div>      
					</div>
				</div>
			</div>
		);
	},
	render:function(){

		if (this.state.contactList == null) {
			return (
				<div>
					<a onClick={this.handleAuth} 
					className="btn btn-block btn-social btn-google-plus" 
					style={{"position": "relative", "top":"96px"}}>
					<i className="fa fa-google"></i><span className="text-center" style={{display:"block"}}>Invite Gmail Contacts</span>
					</a>
			  </div>
			);
		}
		var contacts = [];
		if (this.state.contactList) {
			var count = 0;
			for (var i = this.state.contactList.length - 1; i >= 0 && count++ < 4; i--) {
				var item = this.state.contactList[i];
				contacts.push(this.renderUser(item));
			};
			if (this.state.contactList.length == 0) {
				contacts.push(<h4 className="text-center">No more contacts </h4>)
			}
		}
		return (<div>{contacts}</div>);
	}
})
/*
var FacebookPanel = React.createClass({
	getInitialState:function(){
		return {
			fbFriendList:[],
			message:"",
			searchTerm:'',
			errorMessage:null
		}
	},
	facebookHandleClick:function(){
		var self = this;
		FB.login(function(response) {
		   if (response.authResponse) {
				self.loadFacebookFriends();
		   }
		 },{scope: 'email,user_friends'});
	},
	loadFacebookFriends:function(){
		var self = this;
		var fbAFriendList = [];
		FB.api('/me/permissions',function(resp) {
			var hasPermssion = false;
			for (var idx = 0;idx < resp.data.length;idx++) {
				if (resp.data[idx].permission == 'user_friends') {
					hasPermssion = true;
				}
			}
			if (hasPermssion) {
				gFacebookConnected = true;
				FB.api('/me/invitable_friends?fields=name,picture',function(response){ 
					if (response.data){
						self.setState({fbFriendList:response.data})
						self.forceUpdate();	
					}
				});
			} else {
				gFacebookConnected = false;
				self.forceUpdate();
			}
		});
			
	},
	removeChild:function(id,message) {
		for(var idx=0;idx < this.state.fbFriendList.length;idx++) {
				if (this.state.fbFriendList[idx].id == id) {
					this.state.fbFriendList.splice(idx,1);
					break;
				}
		}
		this.setState({message:message});
	},
	renderFeacebookFriends:function(){
		var fbAFriendList  = [];
		for(var idx = 0;fbAFriendList.length < 4 && idx < this.state.fbFriendList.length;idx++) {
			var user = this.state.fbFriendList[idx]
			if (user.name.toLowerCase().indexOf(this.state.searchTerm) == -1) {
				continue;
			}
			var react = (
			  <FacebookFriendBlock fbUser={user} removeChild={this.removeChild} />
			  );
			fbAFriendList.push(react);

		  } 
		 return fbAFriendList;
	},
	componentDidMount:function(){
		JiyoEvent.subscribe('facebook_auth_changed',function(){
			if (!gFacebookConnected) {
				return;
			}  
			self.loadFacebookFriends();
		});
		if (gFacebookConnected == true) {
			self.loadFacebookFriends();
		}

		JiyoEvent.subscribe('fb_friend_search',function(term){
			self.setState({searchTerm:term.toLowerCase()})
		});
	},
	render:function(){
		var facebookConnectedBtn = null;
		if (gFacebookConnected == true) {
			facebookConnectedBtn = this.renderFeacebookFriends();
		} else {
			facebookConnectedBtn = (
				<div>
					<a onClick={this.facebookHandleClick} 
					className="btn btn-block btn-social btn-facebook" 
					style={{"position": "relative", "top":"96px"}}>
					<i className="fa fa-facebook"></i> Connect Facebook Friends
					</a>
			  </div>
			);
	    }
	}
})

var FacebookFriendBlock = React.createClass({
	onSendClick:function(id){
		var self = this;
		var data = self.props.fbUser;
			FB.ui({method: 'apprequests',
			  message: " Come be a part of my journey on Jiyo. Look forward to seeing you there.",
			  to: id
			}, function(response){
				if (!response.error_code) {
					self.props.removeChild(data.id,"Invite Sent to " + data.name);
				}
			});
	},
	removeMe:function(id){
			this.props.removeChild(id)
	},
	render:function() {
		var self  = this;
		var data = self.props.fbUser;
		return (
			<div className="friendRequestTab">
				<div className="faceBookFriendRequestTeaser">
					<div className="media">
						<div className="pull-right" style={{" margin-top":"10px"}}>
							<button title="Send invite"  onClick={this.onSendClick.bind(null,data.id)} className="btn btn-primary accept-button"></button>
							<button title="Remove"  onClick={this.removeMe.bind(null,data.id)} className="btn btn-primary reject-button"></button>
						</div> 
						<div className="pull-left">           
							 <a href="#">
								<img className="media-object media-middle img-circle" src={data.picture.data.url} alt="" width="32" height="32" />
							 </a>
						</div>     
						<div className="media-heading">
							<p>
							<span>
								<h5 style={{" margin-top":"-6px"}}>
									<TextEllipsis text={data.name} maxlimit="16" />
								</h5>
							</span>
							</p>
						</div>      
					</div>
				</div>
			</div>
		);
	}
});*/
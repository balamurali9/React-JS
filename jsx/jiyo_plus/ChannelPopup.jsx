var JiyoPlusChannelPopup = React.createClass({
	getInitialState:function(){
    	return {
			channel : {
				name:'nothing',
				video_url:''
			}
    	};
  	},
  	componentWillUnmount:function(){
  		 JiyoEvent.removeSubscribers('showVideoModal');
  	},
    componentDidMount:function(){
	    var self = this;
		JiyoEvent.subscribe('showVideoModal',function(obj){
			self.setState({channel:obj},function(){
				$("#channelsVideoModal").modal('show');
				setTimeout(function(){
					var width = $('.videoWrapper').width();
			   		 var height = width*9/16;
			   		 $("#feat-video").css({
			   		 	width:width,
			   		 	height:height
			   		 });
				},500);
			});
			
		});
		
		$('#channelsVideoModal').on('hidden.bs.modal', function (e) {
			  //$("#feat-video").attr('src','');
			  
			self.setState({channel:{
				name:'',
				video_url:'/assets/img/loading.gif'
			}});
		});
    },
   render: function () {
	   var channel = this.state.channel;
	   var videoURL = '';
	  
		if (channel.video_url != null) {
			videoURL = (
				<div className="videoWrapper">
					<iframe id="feat-video" style={{border:'none'}} src={channel.video_url} frameborder="0"  allowfullscreen></iframe>
				</div>
			);
		} else {
			videoURL = (
				<div>
					<img  src={channel.banner_url} className="img-responsive imgAuto" alt={channel.name} ></img>
				</div>
			);
		}
        return (
			<div className="modal fade JiyoDefaultModalWindow" tabindex="-1" 
				role="dialog" 
				aria-labelledby="myModalLabel" 
				aria-hidden="false" id="channelsVideoModal">
				<div className="modal-dialog modal-lg-channel">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button"  className="close btn btn-link" style={{ outline: "0px"}} data-dismiss="modal" aria-label="Close">
								<i className="ion-ios-close-empty" style={{ '' :'none', 'fontSize':'42px', 'line-height':'42px'}}></i>
							</button>
							<span className="modal-title"><div className="taskHeader">{channel.name}</div></span>
						</div>
						<div className="modal-body">
								{videoURL}
						</div>    
					</div>
				</div>
			</div>
		);
	}
});
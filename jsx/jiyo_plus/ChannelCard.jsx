var JiyoPlusChannelCard = React.createClass({ 
	channelVideoClick:function(url){
	 	JiyoEvent.fire('showVideoModal', this.props.channel); 
	 },
	render : function() { 
	var channel = this.props.channel;
	var cls = "col-xs-12 col-sm-12 col-md-12 col-lg-12 paddingLeftRight0"
	var channelCls = cls;
	var playIcon = null;
	if (channel.video_url != null) {
		playIcon = (<span className="play-live" onClick={this.channelVideoClick.bind(null, channel)}></span>)
	}
	var channelContent = (
		<div  className="minHeight650">
			<div className ="imageCus custom1" style={{position:"relative"}}>
				<img  src={channel.banner_url} 
					className="img-responsive imgAuto" alt={channel.name} ></img>
				<span className="Comingsoon-icon"></span>
				<span>{playIcon}</span>
			</div>
			<div className="clearfix"></div>
				<hr style={{"margin":"5px"}}></hr>
			<div className="clearfix"></div>
			<div style={{"padding":"0px 20px 20px 20px"}}>	
				<div style={{"fontSize":"20px","color":"#000000"}}>{channel.name}</div>
			<div className="clearfix"></div>
				<div style={{"fontSize":"14px"}}><a href="#">{channel.author_name}</a></div>
			<div className="height5"></div>
			<div style={{"fontSize":"14px","color":"#666666"}}>
				<p>{channel.description}</p>
			</div>
			</div>
		</div>
	)
	var broadCast = null;
	if (channel.broadcast == null) {
		cls = "col-xs-12 col-sm-12 col-md-6 col-lg-6 paddingLeftRight0";
	} else {
		channelCls = "col-xs-12 col-sm-12 col-md-6 col-lg-6 paddingLeftRight0";
		broadCast = (
	<div className="col-md-6 col-lg-6 col-sm-12 col-xs-12 minHeight650" style={{"backgroundColor":"#ffffff", "padding":"20px"}}>
				<div className="channel-image-container">
					<img  src={channel.broadcast.banner} className="img-responsive imgAuto" alt={channel.name} ></img>
					<div className="channelCaption-Live">Live</div>
					 <div className="channelCaption hidden">
					 <div style={{"fontSize":"20px"}}>{channel.name}</div>
						 <div>{channel.author}</div>
					 </div>
				</div>
				<div className="clearfix"></div>
				<div className="height10"></div>
					<div style={{"text-align":"center"}}>
						<a href="/broadcast" style={{"backgroundColor": "#29b473","border": "none", "color": "#ffffff" , margin:"10px" }}className="btn btn-primary  btn-sm">Join Live Broadcast</a>
					</div>
				<div className="height10"></div>
				<div className="clearfix"></div>
			</div>
		)
	}
	channelCls += " plus-content-panel";
	return (
			<div className={cls} style={{"margin-bottom":"30px;"}}>
				<div className={channelCls }   style={{"backgroundColor":"#ffffff", "padding":"0px"}}>
					{channelContent}
				</div>
				<div>
					{broadCast}
				</div>
			</div>
		 );
  }
});
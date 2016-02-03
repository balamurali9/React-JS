//Discover special tile for invite friends and recommended users
var DiscoverSpecialCard = React.createClass({

  getdefaultPops:function(){
    return {
      onTileLoad : null
    };
  },
  componentDidMount:function(){
    var self = this;
    if (self.props.onTileLoad){
      self.props.onTileLoad(this); 
    }
  },
  childLoaded:function(item){
    $(item.getDOMNode()).removeClass('invisible');
  },
  render:function(){
    var self = this;
    var content = (<div><QustionnaireCard onTileLoad ={self.childLoaded} /></div>)
	var follow = (<div><SocialFollow onTileLoad={self.childLoaded} /></div>)
    return (
		<div className="clearfix invisible userRecommendationTile">
			{follow}
			<InviteFriends me={self.props.me} onTileLoad={self.childLoaded} />
			<RecommendUsers onTileLoad={self.childLoaded}  />
			{content}
		</div>
	);
  }
})
var ProfileActivityPanel = React.createClass({
  activityLoad:function(){ 
      JiyoEvent.fire('feed_reload','jiyoActivityFeed');
  
  },
  communityLoad : function(){
      JiyoEvent.fire('feed_reload','jiyoCommunityFeed');
  },
  render: function() {
      if(this.props.me.id != this.props.user.id){
        return (<div className="col-md-12 col-sm-12 col-lg-12 col-xs-12">
            <ProfileActivityFeed contentType="jiyoActivityFeed" me={this.props.me} user={this.props.user} />
          </div>);
      }      
        return ( 
        <div >
        <ul className="nav nav-tabs jiyoProfileSubTab" role="tablist" style={{}}>
          <li role="presentation" className="active someClass" >
            <a href="#home" id="meLink" onClick={this.activityLoad}  aria-controls="home" role="tab" data-toggle="tab" style={{"border": "0 none","backgroundColor":"transparent"}}>
              <span className="activityImage"></span>Me</a>
            </li>
          <li role="presentation" className="someClass">
            <a href="#profile"id="weLink" onClick={this.communityLoad} aria-controls="profile" role="tab" data-toggle="tab" style={{"border": "0 none","backgroundColor":"transparent"}}>
              <span className="communityImage"></span>We</a>
            </li> 
        </ul>
  
      <div className="tab-content" >
        <div role="tabpanel" className="tab-pane active" id="home"><ProfileActivityFeed me={this.props.me} user={this.props.user} contentType="jiyoActivityFeed" /></div>
        <div role="tabpanel" className="tab-pane" id="profile"><ProfileActivityFeed me={this.props.me} user={this.props.user} contentType="jiyoCommunityFeed" /></div> 
      </div>
    </div>
    ); 
    }
});
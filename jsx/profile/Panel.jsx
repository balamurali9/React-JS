var UserProfileComponent = React.createClass({
  componentDidMount:function(){
    var self = this;
    JiyoEvent.subscribe('make_profile_tab_active',function(name){
      self.setTabs();
    });
    self.setTabs();
  },
  setTabs:function(){
    $("#profile_sub_tabs .tab").addClass('hidden');
    $("#profile_sub_tabs #"+paramObj.activeTab).removeClass('hidden');
  },
  componentWillUnmount : function(){
    JiyoEvent.removeSubscribers('make_profile_tab_active');
  },
  render:function () {

    var menuList = [];
    var tabList = [];

    if (paramObj.me.id == paramObj.user.id) {

    } else {

    }

    return (<div className="user-profile-component">
      <div className="profile-picture text-center"  
          style={{background:"url("+paramObj.user.cover_image_url+");"}}>
          <div id="userProfileImage">
              <img  title="Profile Photo" id="user_profile_image" 
                  className="img-circle" src={paramObj.user.profile_image_url}  />
          </div>
          <div  style={{ position:"absolute",bottom:"-8px",right:"47%" }}>
            <ProfileConnectButton user={paramObj.user} me={paramObj.me} />
          </div>
          <div className="stats-label text-color" style={{marginTop:"4px"}}>
              <span className="font-extra-bold font-uppercase" 
                style={{color:"white",fontSize:"20px"}}>
                  {paramObj.user.display_name}
              </span>
          </div> 
          <div  className="fontstyle18" style={{marginTop:"2px"}}>
            <ProfileStatusUpdater user={paramObj.user} me={paramObj.me} />
          </div> 
      </div>
      <div className="text-center btn-link-container" >
          <div className="btn-group" role="group" id="profile_tab_buttons" aria-label="Justified button group">
              <a href={"#profile/"+paramObj.user.screen_name+"/journey"} className="btn btn-link btn-link-group" id="btnActivity" role="button">
                  <div className="btnActivity"></div>
                  <div className="btnTextactivity">Journey</div>
              </a>
              <a href={"#profile/"+paramObj.user.screen_name+"/insights"} className="btn btn-link btn-link-group" id="btnInsights" role="button">
                <div className="btnInsights"></div>
                <div className="btnTextinsights">Insights</div>
              </a>
               <a href={"#profile/"+paramObj.user.screen_name+"/connections"} className="btn btn-link btn-link-group" id="btnFriends" role="button">
                <div className="btnFriends"></div>
                <div className="btnTextfriends">Connections</div>
              </a>
               <a href={"#profile/"+paramObj.user.screen_name+"/story"} className="btn btn-link btn-link-group" id="btnwellBeingStory" role="button">
                <div className="btnwellBeingStory"></div>
                <div className="btnTextwellBeingStory">Wellbeing Story</div>
              </a>
          </div>
      </div>
      <div id="profile_sub_tabs">
        <div id="journey" className="tab">
          <ProfileActivityPanel me={paramObj.me} user={paramObj.user} />
        </div>
        <div id="insights" className="hidden tab">
          <ProfileInsightsPanel me={paramObj.me} user={paramObj.user} />
        </div>
        <div id="connections" className="hidden tab">
          <ProfileConnectionsPanel me={paramObj.me} user={paramObj.user} />
        </div>
        <div id="story" className="hidden tab">
          <ProfileStoryPanel me={paramObj.me} user={paramObj.user} />
        </div> 
      </div>
  </div> );
  }
});
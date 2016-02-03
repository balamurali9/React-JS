var SettingsPrivacyManager = React.createClass({
  mixins:[ServerPostMixin],
    getInitialState : function() {
    return {
      errorMessage:'',  
      msgUpdatePassword:'',
      stateUpdateInfo:'',
      msgUpdatePassword:'',
      stateUpdatePassword:'',
      stateUpdatePrvcySetngs:'',
      msgUpdatePrvcySetngs:'',
      settings:null,
      errorMessages : {
        display_name:'',
        screen_name:'',
        bio:'',
        password:'',
        password_confirmation:'',
      }
    };
  },
  componentDidMount:function(){
    
    var curPage="";
     var self = this;
    
    $("#manageDeviceMenu").addClass('active'); 
    $("#settingMenu a").click(function() { 
        $("#settingMenu li").removeClass('active');
        $(this).parent().addClass('active');
        $(".tabContent").addClass('hidden');
        var id = $(this).data("page");
        $("#"+id).removeClass('hidden');
                self.state.errorMessages.screen_name = '';
                self.state.errorMessages.display_name = '';
                self.state.errorMessages.bio = '';
                self.state.errorMessages.password = '';
                self.state.errorMessages.password_confirmation = '';

        self.setState({
          msgUpdateInfo:null,
          stateUpdateInfo:'hidden'
        });
    });
    $('#close').click(function(){
    this.parentNode.parentNode.parentNode
        .removeChild(this.parentNode.parentNode);
        return false;
    });
    
    Api.getData('/user/privacy-settings/',{},function(response){ 
        self.setState({settings:response.data});
    }); 
  },
  handleInfoChange:function(event){
    var map = $("#info_edit_form").serializeToObject();
    var self = this;
    
    this.postData('/user/update-info',map,function(state){
      var resp = state.response;
      if (resp.success) { 
        self.props.me = resp.data;
        state.stateUpdateInfo = 'alert alert-success';
        state.msgUpdateInfo = resp.message;
      }  else {
          state.stateUpdateInfo = 'hidden';
          self.props.me = map;
      }
      self.setState(state);
    });

    return this.stopEvent(event);
  },
  handleSettingsChange:function(event){
    var map = $("#settings_edit_form").serializeToObject(); 
    var self = this;
    this.postData('/user/privacy-settings',map,function(state){
      var resp = state.response;
      if (resp.success) { 
        state.stateUpdatePrvcySetngs = 'alert alert-success';
        state.msgUpdatePrvcySetngs = 'Settings successfully saved';
      }  else {
        state.stateUpdatePrvcySetngs = 'hidden';
      }

      self.setState(state);
    });
    return this.stopEvent(event);;
  },
  render:function() {
    var em = this.state.errorMessages; 
    var oauthConnections = []; 
    var me = this.props.me;
    var settings = this.state.settings; 
    var insightsOptions = {
      'everyone' : "Everyone",
      'friends' : "Friends",
      'me' : 'Me'
    }  
    var insightsSelect = [];    
    var insightsSelected = 0;
    for(var key in insightsOptions ) {
        insightsSelected = 0;
        if(settings != null && key == settings.settings_insights) {
            insightsSelected = 1;
        }
      insightsSelect.push((<option selected={insightsSelected} value={key}>{insightsOptions[key]}</option>));
    } 
    var activityOptions = {
      'everyone' : "Everyone",
      'friends' : "Friends",
      'me' : 'Me'
    } 
    var activitySelect = [];
    var activitySelected = 0;
    for(var key in activityOptions ) {
        activitySelected = 0;
        if(settings != null && key == settings.settings_activity_feed) {
            activitySelected = 1;
        }
      activitySelect.push((<option selected={activitySelected} value={key}>{insightsOptions[key]}</option>));
    } 
   return (  <div className="row">
      <div className="text-center btn-link-container" id="settingMenu">
        
          </div>
          <div className="settingContent">
            <div className="row">
                <div  className="setting-section">
                  <h3>Settings</h3>
                   <form id="settings_edit_form" onSubmit={this.handleSettingsChange} role="form" >
                   <div className={this.state.stateUpdatePrvcySetngs} >{this.state.msgUpdatePrvcySetngs}</div>
                  <div className="privacy_sec">
                  <span>Privacy</span>
                  <div className="secHeader"><img src="" alt=""/></div>
                    <div>Set who gets to see your Jiyo updates.</div>
                    <div className="col-lg-6">
                      <label for="activity_feed" className="col-sm-4 control-label">Activity Feed :</label>
                      <div className="col-sm-8">
                            <select name="settings_activity_feed" className="form-control">
                              {activitySelect}
                            </select>
                      </div>                      
                    </div>
                    <div className="col-lg-6">
                    <label for="insights" className="col-sm-4 control-label">Insights:</label>
                    <div className="col-sm-8">
                         <select name="settings_insights" className="form-control">
                            {insightsSelect}
                          </select>
                    </div>                    
                    </div> 
                  </div>                   
                  <div><input type="hidden" name="_token" value={gAppConfig.CSRFToken} />
                  <button className="btn orangeBtn pull-right" type="submit">Save Changes</button></div>
                  </form>
                </div>              
              </div>
          </div>
    </div>
    );
  }
});

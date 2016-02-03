var SettingsChangePassword = React.createClass({
  mixins:[ServerPostMixin],
    getInitialState : function() {
    return {
      errorMessage:'',  
      msgUpdatePassword:'',
      stateUpdateInfo:'',
      msgUpdatePassword:'',
      stateUpdatePassword:'',

      errorMessages : {
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
    
  },
 
  handlePasswordChange:function(event){
    var map = $("#password_edit_form").serializeToObject(); 
    var self = this;
    this.postData('/user/update-password',map,function(state){

       var resp = state.response;
      if (resp.success) { 
        state.stateUpdatePassword = 'alert alert-success';
        state.msgUpdatePassword = resp.message;
      }  else {
          state.stateUpdatePassword = 'hidden';
      }

      self.setState(state);
    });
    return this.stopEvent(event);;
  },
  
  render:function() {
    var em = this.state.errorMessages; 
    var oauthConnections = []; 
    var me = this.props.me;
   return (  <div className="row">
          <div className="text-center btn-link-container" id="settingMenu">
        
          </div>
           <div className="settingContent">
            <div className="row">
                <h3 style={{marginBottom:"20px",display:"block"}}>Change Password</h3>

                <span className="text-mute">You can update your password here</span>
                  <form id="password_edit_form" onSubmit={this.handlePasswordChange} role="form" style={{marginTop:"20px"}}>
                  <div className={this.state.stateUpdatePassword} >{this.state.msgUpdatePassword}</div>
                 <div className="col-lg-6">
                  <label for="password" className="col-sm-4 control-label">Password :</label>
                  <div className="col-sm-8"><HtmlFormGroupPassword name="password" type="password" errorMsg={em.password}  placeholder="********"/></div>
                 </div>
                 <div className="col-lg-6">
                  <label for="password_confirmation" className="col-sm-4 control-label">Confirm Password :</label>
                 <div className="col-sm-8"><HtmlFormGroupPassword name="password_confirmation" type="password" placeholder="********"/></div> 
                 </div>  
                 <input type="hidden" name="_token" value={gAppConfig.CSRFToken} />
                  <button className="btn orangeBtn pull-right" type="submit">Save Changes</button>
                  </form>
                </div>
          </div>
    </div>
    );
  }
});

var SettingsGeneral = React.createClass({
  mixins:[ServerPostMixin],
  getInitialState : function() {
    return {
      errorMessage:'',
      mailId:{},

      errorMessages : {
        mailId:{}
      }
    };
  },
  componentDidMount:function(){
    var self = this;
     Api.getData('/user/profile-info/'+this.props.user.id,{},function(resp){
       self.setState({mailId:resp.data.user.email})
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
    render:function() {
        var em = this.state.errorMessages; 
        var oauthConnections = [];  

     
        var me = this.props.me;
        return ( 
            <div className="row">
              <div className="text-center btn-link-container" id="settingMenu">
              </div>
              <div className="settingContent">
                <div className="row">
                    <h3>Profile Details</h3>
                    <span>You can update your name</span>
                      <form id="info_edit_form" onSubmit={this.handleInfoChange} role="form" >
                      <div className={this.state.stateUpdateInfo} >{this.state.msgUpdateInfo}</div>
                     <div className="col-lg-6">
                      <label for="display_name" className="col-sm-2 control-label">Name :</label>
                      <div className="col-sm-10"><HtmlFormGroupText  name="display_name" placeholder="Name" errorMsg={em.display_name} val={me.display_name}/></div>
                      <div><a href="#" onClick={this.handleChangePassword}>Change Password</a></div>
                      <input type="hidden" name="local_time" value={moment().format('YY-MM-DD HH:mm:ss')} /> 
                     </div>
                     <div className="col-lg-6">
                      <label for="emailId" className="col-sm-2 control-label">Email ID :</label>
                     <div className="col-sm-10" style={{"padding-top":"24px"}}>{this.state.mailId}</div> 
                     </div>  
                      <input type="hidden" name="_token" value={gAppConfig.CSRFToken} />
                      <button className="btn orangeBtn text-center" type="submit" style={{"margin-left":"45%"}}>Save Changes</button>                
                      </form>
                    </div>
                </div>
        </div> );
    }
}); 

 
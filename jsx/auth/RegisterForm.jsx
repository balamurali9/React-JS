var AuthRegisterForm = React.createClass({
  mixins:[ServerPostMixin],
  getInitialState : function(){
    return {
      response : {
        success : false
      },
      errorMessages : {
        email:'',
        name:'',
        password:'',
        password_confirmation:'', 
      }
    }
  },
  componentDidMount:function(){  
    var self = this;
    JiyoEvent.subscribe('clear_auth_ui',function(){
      var state = self.state;
        state.errorMessages.email = '';
        state.errorMessages.name = '';
        state.errorMessages.password = ''; 
        state.errorMessages.password_confirmation = '';  
        self.setState(state);
    });
    if (navigator.userAgent.toLowerCase().indexOf('chrome') >= 0) {
    setTimeout(function () {
        document.getElementById('email').autocomplete = 'off';
    }, 1);
    }
  },
  handleFormSubmit : function(event) {  
    var self = this;
    var data = $("#registration_form").serializeToObject();   
    self.postData('/auth/register',data,function(state){

      if (state.errorMessages.name != null) {
        state.errorMessages.email = state.errorMessages.name;
        state.errorMessages.name = null;
      } 
      if (state.errorMessages.password != null) {
        state.errorMessages.password_confirmation = state.errorMessages.password;
        state.errorMessages.password = null;
      } 
      self.setState(state);
    }); 
    return this.stopEvent(event);
  },
  limitNameChrs: function(event) {
    var len = event.target.value.length;
    if (len > 50) {
      event.target.value = event.target.value.substring(0, 50);
    }
  },
  render : function() {

      var errorMessages = this.state.errorMessages; 
      var cls = 'hidden'
        if (errorMessages.name && errorMessages.name != '') {
            cls = "text-danger";
        } else {
            errorMessages.name = '';
        } 
      var content = '';
      if (this.state.response.success) {
        content = (<div className="alert alert-success"  >{this.state.response.message}</div>);
      } else {
        content = (<div className="row"> 
            <div className="col-sm-6">
              <div className={"form-group name"}>
                <input onKeyUp={this.limitNameChrs} minlength="2" className="form-control" id="name" ref="inputElement" autocomplete="off" placeholder="Name" type="text" name="name" /> 
                <div className={cls + 'ion-alert-circled'} >{errorMessages.name}</div>
              </div>
              <HtmlFormGroupText name="email" label ="" placeholder="Email Id" errorMsg={errorMessages.email} autocomplete="off"/>
              <HtmlFormGroupPassword name="password" placeholder="Password" errorMsg={errorMessages.password}/>
              <HtmlFormGroupPassword name="password_confirmation" placeholder="Confirm Password" errorMsg={errorMessages.password_confirmation}/>
              <input type="hidden" name="_token" value={this.props.token} />
            </div>
            <div className="col-sm-4 col-sm-offset-1">
              <div className="form-group hidden g-recaptcha" data-sitekey="6LdVzf8SAAAAALU9obc0tbXSnDEu6wiNCtMofrar"></div>
              <div className="checkbox"> By clicking 'Sign Up' you are agreeing that you have read and agreed to our 
			  <a href="/page/tos" target="_blank"> Terms of Use </a> and <a href="/page/policy" target="_blank"> Privacy Policy </a></div>
			  <div className="height20 hidden-sm hidden-md hidden-lg"></div>
              <button type="submit"  className="btn btn-success btn-md">Sign Up</button>
            </div>
        </div>)
      }
      return (<form id="registration_form"   onSubmit={this.handleFormSubmit} role="form" autocomplete="off">
        {content}
      </form>);
    }

});
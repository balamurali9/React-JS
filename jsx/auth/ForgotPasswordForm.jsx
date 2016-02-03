var AuthForgotPasswordForm  = React.createClass({
  mixins:[ServerPostMixin], 
  getInitialState : function(){
    return { 
      response : {
        success : false
      },
      errorMessages : {
        email:''
      }
    }
  },
  handleFormSubmit:function(event){
    
    var self = this;
    var data = $("#forgot_password_form").serializeToObject();   
    self.postData('/auth/forgot-password',data,function(state){
        self.setState(state);
    }); 
    return this.stopEvent(event);
  },
  componentDidMount:function(){  
    var self = this;
    JiyoEvent.subscribe('clear_auth_ui',function(){
      var state = self.state;
        state.errorMessages.email = ''; 
        self.setState(state);
    });
    if (navigator.userAgent.toLowerCase().indexOf('chrome') >= 0) {
    setTimeout(function () {
        document.getElementById('email').autocomplete = 'off';
    }, 1);
    }
  },
  render :function(){
    var errorMessages = this.state.errorMessages; 

    var userOption = (<div><div className="height20"></div> <button type="submit" className="btn btn-success btn-md">Reset My Password</button></div>);
    if (this.state.response.success) {
      userOption = (<div className="alert alert-success form-alert-message"  >{this.state.response.message}</div>)
    }
    return ( 
      <form id="forgot_password_form"  action="/auth/login" onSubmit={this.handleFormSubmit} role="form">
			  <div className="forgotpasswordBox"><small>Note: Let&#39;s get your password reset. Enter your email id you used when you signed up.</small></div>
          <HtmlFormGroupText name="email"  placeholder="Email ID" errorMsg={errorMessages.email} autocomplete="off"/> 
          <input type="hidden" name="_token" value={this.props.token} />
          {userOption} 
      </form>  
    );
  }
});
var AuthLoginForm = React.createClass({
  mixins:[ServerPostMixin],
  getInitialState : function() {
    return {
      errorMessage:'',
      inputError:'', 
      errorMessages : {
        email:'',
        password:''
      }
    };
  },
  handleFormSubmit:function(event) {
    var self = this;
    var data = $('#login_form').serializeToObject();
    ga('send', 'event','button','login','click');
    self.postData('/auth/login',data,function(state){
      
      if (state.response && state.response.success) {
        var path = getQueryStringValue('url');
        var result = state.response;
        if (path != ''){
          document.location.href= path;
        } else if (result.data.goto) {
          document.location.href = result.data.goto;
        } else {
          document.location.href = "/";
        }  
        return;
      }
      if (state.errorMessages.email != null) {
        state.errorMessages.password = state.errorMessages.email;
        state.errorMessages.email = null;
      } 
      self.setState(state);
    });
    return this.stopEvent(event);

  },
  componentDidMount:function(){  
    var self = this;
    JiyoEvent.subscribe('clear_auth_ui',function(){
        self.state.errorMessages.email = '';
        self.state.errorMessages.password = '';
        self.setState({
          errorMessage:'hidden',
          inputError:'hidden'
        });
    });
    if (navigator.userAgent.toLowerCase().indexOf('chrome') >= 0) {
    setTimeout(function () {
        document.getElementById('email').autocomplete = 'off';
    }, 1);
    }
    
  },
  clickForgotPassword:function(){
    showForm('forgot_password');
  },
  clickResgister:function(){
    showForm('register');
  },
  render:function() {
    var errorMessages = this.state.errorMessages; 
    return ( 
      <form id="login_form" onSubmit={this.handleFormSubmit} method="POST" role="form" autocomplete="off">
        <input type="hidden" name="_token" value={this.props.token} />
        <div className="row">
          <div className="col-sm-6">
            <div className="form-group">
              <HtmlFormGroupText name="email" placeholder="Email Id" label ="" errorMsg={errorMessages.email} autocomplete="off"/>
            </div>
            <div className="form-group">
              <HtmlFormGroupPassword name="password" placeholder="Password" label ="" errorMsg={errorMessages.password} />           
            </div>  
            <div className="form-group checkbox">
                <label>
                  <input type="checkbox" className="checkbox formCheckbox"/>Keep me signed in
                </label> 
            </div>  
          </div>
          <div className="col-sm-4 col-sm-offset-1">            
            <button type="submit" className="btn btn-success btn-login btn-md">Sign In</button>
          </div>
        </div>
      </form>
    );
  }
});








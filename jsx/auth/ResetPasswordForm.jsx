var AuthResetPasswordForm = React.createClass({
  mixins:[ServerPostMixin], 
  getInitialState : function(){
    return {  
      response : {
        success : false
      },
      errorMessages : {
        password:null,
        password_confirmation:null
      }
    }
  },
  componentDidMount:function(){  
    var self = this;
    JiyoEvent.subscribe('clear_auth_ui',function(){
      var state = self.state;
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
  handleFormSubmit:function(event){
    
    var self = this;
    var data = $("#reset_password_form").serializeToObject();   
    self.postData('/auth/reset-password',data,function(state){
        self.setState(state);
    }); 
    return this.stopEvent(event);
  },
  render :function(){
    var self = this;
    var errorMessages = this.state.errorMessages; 
    var content = '';
    if(self.state.response.success) {
      content = (<div className="alert alert-success"  >{this.state.response.message}</div>);
    } else {
      content = (
          <div>
            <HtmlFormGroupPassword name="password" label ="" placeholder="Password" errorMsg={errorMessages.password} />
            <HtmlFormGroupPassword name="password_confirmation" placeholder="Confirm Password" label ="" />
            <input type="hidden" name="reset_token" value={this.props.reset_token} />
            <input type="hidden" name="_token" value={this.props.token} />
            <button type="submit" className="btn btn-success btn-sm" style={{"margin-top":"10px"}}>Submit</button>
      </div>)
    }
    return ( 
        <form id="reset_password_form"  action="/auth/reset-password" onSubmit={this.handleFormSubmit} role="form">
           {content}
        </form> 
    );
  }
});
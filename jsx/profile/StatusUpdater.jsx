var ProfileStatusUpdater = React.createClass({
  mixins:[ServerPostMixin],
  getInitialState:function(){
    return {
      inputVisible:"hidden",
      addStatus:"", 
      statusVisible:"",
      statusError:'hidden'
    }
  },
  showStatusForm:function(){
    this.setState({
      inputVisible:"",
      addStatus:"hidden",
      statusVisible:"hidden"
    })
  },
  
  handleFormSubmit:function(event){
    var obj = $("#userStatusUpdateForm").serializeToObject(); 
    var self = this;
    if ($.trim(obj.status_text) == '') {
      self.setState({
        statusError:''
      })
    } else {

       Api.postData("/user/update-status",obj,function(response){
          self.props.me = response.data;
          self.props.user = response.data;
          self.setState({
            inputVisible:"hidden",
            addStatus:"", 
            statusError:'hidden',
            statusVisible:""
          });
          JiyoEvent.fire('update_activity');
        });
    }
   
    this.stopEvent(event);
  },
  componentDidMount: function(){
      $("#formTextItem").val(this.props.user.public_status);
  },
  render:function(){
    var text= '';
    var publicStatusstyle = '';
    if(this.props.me.id != this.props.user.id) {
      if ((this.props.me.public_status == '')||(this.props.me.public_status == null)){
      return (<div className={"publicStatus"} style={{"background":"none"}}arguments>{this.props.user.public_status}</div>);
    }
    else{
      return (<div className="">{this.props.user.public_status}</div>);
    }
    }

    if ((this.props.me.public_status == '')||(this.props.me.public_status == null)){
      text = "What's on your mind?";
    }
    var statusSection = null;
    var message = this.props.user.public_status;
    if (message && message != ''){
     message = ''+message+'';
    }
    this.state.changeStatus = 'hidden';
    if (message == '' || message == null) {     
      this.state.changeStatus = '';
      this.state.addStatus = 'hidden';
      message = text;
    }


    if (this.state.inputVisible != 'hidden') {
      this.state.changeStatus = 'hidden';
    }

    if (this.props.me.id == this.props.user.id) {
      statusSection = (<form id="userStatusUpdateForm" onSubmit={this.handleFormSubmit}  className="form-inline">
                  <div className="addStatusDiv">
                        <a  href="#" className={this.state.addStatus+""} onClick={this.showStatusForm}> <span className={this.state.statusVisible +" statusVisible addStatus"}><strong>{message}</strong></span>
                        </a>
                        <div className={this.state.inputVisible+" input-group col-md-3 col-sm-3 col-xs-10 col-lg-4 statusUpdateInput"}>
                              <input id="formTextItem" type="text" name="status_text" ref="nameInput"
                            className="form-control input-sm" placeholder="Add Status Message" maxLength="100" />
                              <span className="input-group-btn">
                            <button className="btn btn-primary btn-sm orangeBtn"> Save</button> 
                            </span>
                        </div> 
                        <a href="#" className={this.state.changeStatus+" changeStatus statusVisible addStatus btn btn-link"} onClick={this.showStatusForm}>{text}
                        </a>
                  </div>   
                  <span className={ this.state.statusError +" alert alert-error"}>Status message can not be empty
                  </span>
    </form>);
    } else {
      statusSection = (<span className={this.state.statusVisible}>{message}</span>);
    }
    return  statusSection;
  }
});
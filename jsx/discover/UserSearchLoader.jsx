//people search
var UserSearch = React.createClass({   
  mixins:[ServerPostMixin],
  getInitialState:function(){
    return {
      peopleList:null,
    }
  }, 
  renderPeopleSearch:function(data){
     var peopleStatus = data.public_status;
     var publicStatusClass = "";
    if(peopleStatus==null){
      publicStatusClass='';
    }
    return(
    <div className="col-xs-12 col-sm-4 col-md-3 col-lg-3" >
      <div className="user-info-teaser clearfix">
        <div className="pull-left">           
             <a href={"/user/profile/"+data.id}>
                <img className="media-object media-middle img-circle" src={data.profile_image_url} alt={data.profile_image_url} width="32" height="32"/>
             </a>
        </div>
        <div className="media-heading">
            <span>
            <span><a href={"/user/profile/"+data.id} className="fontstyle16pxNormal"><TextEllipsis text={data.display_name} maxlimit="20" /></a></span>
               
            </span>
           
			<div className="height20"></div>
        </div>
      </div>
	</div>
    );
  },
  componentDidMount:function() {
	var self = this;    
		Api.getData("community/user-search",{q:this.props.search},function(response){ 
		self.state.peopleList =[];
		for(var idx = 0;idx < response.data.length;idx++) {
		var data = response.data[idx];  
		item = self.renderPeopleSearch(data);
		self.state.peopleList.push(item)
    }
      self.forceUpdate(); 
    });
 },
  render:function(){   
  var self  = this;
  
  var emptyPeople = ''
  
  if(this.state.peopleList == null) {
		return (<LoadingIcon />);
  }
  
  if (this.state.peopleList.length == 0) {
    return (<div >
      <div className="height10"></div>
          <div className="panel panel-default emptypanel">
            <div className="panel-body text-center">
              We don&#39;t have anyone by that name as yet.
            </div>
          </div>
        <div className="height10"></div>
      </div>);
  }
  
    return (
		<div className="media user-connection-teaser" >
			{this.state.peopleList}
		</div>
    );
  }
});
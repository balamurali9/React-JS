var SettingsDeviceManager = React.createClass({
  mixins:[ServerPostMixin],

    getInitialState : function() {
    return {
     providerMap:[]
    };
  },
  componentDidMount:function(){
    
    var curPage="";
       var self = this;
    Api.getData('/user/oauth-status',{},function(resp){
       self.setState({providerMap:resp.data});
    });
  },
  removeDevice:function(url) {
    var self = this;
    Api.getData(url,{},function(resp){
       self.setState({providerMap:resp.data});
    });
  },
  render:function() {
    var em = this.state.errorMessages; 
    var oauthConnections = [];
    var connected = '';
    var oauthMap = this.state.providerMap;
    for(var idx =0;idx < oauthMap.length;idx++) {
      var item = oauthMap[idx];
      if(item.status == true){
        connected = item.connected;
      }
      if (item.status) {

        oauthConnections.push((<div className="devicemap col-md-6 col-sm-6 col-lg-3 col-xs-12">
        <div className="media whiteContent" >        
          <div className="media-left" href="#" ><img src={item.banner_image} /></div>
          <div className="media-body">
           <a className="whiteContentText" href="#"><span className="connectDisconnectImg connectImg"></span>{connected}</a>
          </div>
          </div>
           <div className="deviceHover"><a className="deviceMapText" href="#" onClick={this.removeDevice.bind(null,item.remove_url)}><span className="connectDisconnectImg disconnectImg" ></span>{item.disconnect}</a></div> 
          </div>));
      } else {

        oauthConnections.push((
        <div className="devicemap col-md-6 col-sm-6 col-lg-3 col-xs-12">

          <div className="media whiteContent" >  
              <div className="media-left"><img src={item.banner_image}  /></div>
            <div className="media-body">
              <a className="whiteContentText" href={item.url} target="_blank">{item.connect}</a>              
            </div>
          </div>
            <div className="deviceHover"><a className="deviceMapText" href={item.url} target="_blank"><span className="connectDisconnectImg connectImg"></span>{item.connect}</a> </div> 
        </div>));
      }
    } 
  
   var me = this.props.me;
   return ( <div className="row">
        <div className="text-center btn-link-container" id="settingMenu">
        
          </div> 
        <div className="settingContent">
      <div className="row"> 
      <h3>Connect Devices</h3> 
      <span>Select Apps/Devices from where you want Jiyo to get it’s activity data from.</span> 
        <div id="page1" className="deviceManager">
            {oauthConnections}
        </div></div></div></div>
                
    );
  }
});
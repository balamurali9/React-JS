var ProfileActivityModalPopup = React.createClass({
  getInitialState:function(){
    return {
      obj:null,
      childKey:null,
      errorMessage:null,
	  item : {
			content:''
	  }
    };
  },
    componentDidMount:function(){
      var self = this;     
      JiyoEvent.subscribe('showPageModal',function(state){ 
        self.setState(state);
        $("#activityDetailModal").modal('show');
      });

      JiyoEvent.subscribe('report_popup_open',function  (obj) {
          $("#activityDetailModal").modal('hide');
      });

    	 $('#activityDetailModal').on('hidden.bs.modal', function (e) {
    		  self.setState({obj:null});
    	 });
    },
    render:function(){
	    var item = this.state.item;
	    var self = this;
      var commentsVal = null;
      var stateObj = this.state.obj;     
      var containedObject = null;
      var list = [];
      var innerList = [];
      var stateObjText = '';
      var obj = [];	 
      var expression = null;
      if(stateObj != '') {
        stateObjText = stateObjText.text;
      }
      if (this.state.childKey && stateObj) {
        containedObject = stateObj[this.state.childKey];
      }
      if(!containedObject) {
        containedObject = {
          content_list:[]
        }
      }
	    
      containedObject.view_count = 0;
      var showBig = true;
          if ((this.state.childKey == 'media')) {
              list.push(<img className="img-responsive" id="userImage" onLoad={this.handleAssetLoad}  onError={this.handleAssetError} 
                  src={containedObject["cdn_url"]} />);
          }else if (this.state.childKey == 'task') {
            containedObject.content_list.forEach(function(item){
              switch(item.type){
            case 'image':
              if(item.content != ""){
                showBig = false;				
                innerList.push(<div className="imageContent">
                    <img src={item.content} className="img-responsive imgContentSrc" 
                      onLoad={this.handleAssetLoad} 
                      onError={this.handleAssetError}/><br/></div>);
                 }            
                break;
            case 'audio':
            if(item.content != ""){
                showBig = false;
                innerList.push(<div className="audioVideoContent">
                    <audio controls="controls" style={{"max-width":"100%"}} > 
                    <source src={item.content} type="audio/mpeg" ></source>
                      Your browser does not support the audio element.
                    </audio><br/></div>);
                } 
                break;
             case 'video':
             if(item.content != ""){
                showBig = false;
                  innerList.push(<div className="taskVideo audioVideoContent">       
                        <video controls="controls" id="taskVideo">
                            <source src={item.content} type="video/mp4"></source>
                            Your browser does not support HTML5 video.
                        </video><br/></div>);
               }  
                break;
              case 'text':
                if (item.content != '') {
                  showBig = false;
                   innerList.push(<div className="cover-text">{item.content}<br/></div>);
                }             
                break;
              default:                
               innerList.push(<div className="cover-image"></div>);
          }
             
            })            
            list.push(innerList);          
          }
     

      var header = 'Title';
      var expression = '';
      var component = 'comment Area';
      if (stateObj != null) {
        header = (<ActivityHeadingSection obj={stateObj}  textLimit="100" />);
        component = (<ProfileActivityActionWidget obj={containedObject} hideViewCount='true'/>);
        if(showBig) {
          expression  = (<div><ActivityFeedbackSection obj={stateObj} width={50} height={50}/></div>)
        } else {
          expression = (<div><ActivityFeedbackSection obj={stateObj} width={30} height={30}/></div>)
        }
      }
      return (
       <div className="modal fade JiyoDefaultModalWindow"  id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" id="activityDetailModal">
  <div className="modal-dialog modal-lg">
    <div className="modal-content">
      <div className="modal-header">
        <button type="button"  className="close btn btn-link" data-dismiss="modal" aria-label="Close">
          <i className="ion-ios-close-empty"></i>
        </button>
        <span className="modal-title">
          <div className="taskHeader">
            {header}
          </div>
        </span>
      </div>
      <div className="modal-body row">
        <div className="col-md-6">{list}{expression}</div>
        <div className="col-md-6"> 
          {component}
        </div>
      </div>     
    </div>
  </div>
    </div>);
    }   
});

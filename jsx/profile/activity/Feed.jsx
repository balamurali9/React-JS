var ProfileActivityFeed = React.createClass({
  getInitialState:function(){
    return {
      loadingClass:'hidden', 
      activityMap:null,
      activityLoadCount :0,
      contentLoading:false,
      loadedMap:{},
      recentList:[],
      dataFetchUrl:'',
      dirty:true
    }
  },  
  resetActivities:function(){
    var self = this;
    if (self.activityMap.length > 0 ){
        $('#'+self.props.contentType).masonry({isFitWidth:true});
    }

    self.setState({
      recentList:[],
      activityMap:null,      
      loadingClass:'hidden', 
      activityLoadCount:0,
      contentLoading : false,
      loadedMap : {},
      responseMetaData:{},
      dataFetchUrl:'',
      dirty:true

    });
   },
  tileLoadHandler:function(reactObj){
    var self  =this;
   
    var node = reactObj.getDOMNode();
    var actId = $(node).attr('id');

    if (typeof self.state.loadedMap[actId] != 'undefined') {
      return;
    }
    
    self.state.loadedMap[actId] = true;

    //console.log('Total count '+self.props.contentType+": "
    //+self.state.activityLoadCount + " added So far"+self.state.activityMap.length);

    self.state.activityLoadCount++;
    self.state.recentList.push(node); 

    if (self.state.activityLoadCount !=  self.state.activityMap.length) {
      return;
    } 

    $('#'+self.props.contentType).masonry('addItems', self.state.recentList);
    $('#'+self.props.contentType).masonry('reloadItems', self.state.recentList);
    setTimeout(function(){
       $('#'+self.props.contentType).masonry({isFitWidth:true});   
    },300);
   },
  
  loadMoreActivities:function(cb){
    var self = this; 
    if (self.state.dataFetchUrl == null) {
     $("#"+self.state.contentType+" .loadingGif").hide();
      return;
    } 

    if (self.state.contentLoading) {
      return;
    }
    
    self.state.contentLoading = true;
    // console.log('Loading more acts ',self.state.dataFetchUrl);
    Api.getData(self.state.dataFetchUrl,{},function(response){ 
      if (self.state.activityMap == null) {
        self.state.activityMap = [];
      }
    
      for(var idx = 0;idx < response.data.length;idx++) {
        var item = response.data[idx];
        var react = (
         <ProfileActivityCard onTileLoad={self.tileLoadHandler} activity={item}/>
        );
        self.state.activityMap.push(react);  


      }          
       self.state.dirty = true;    
      $("#"+self.state.contentType+" .loadingGif").hide();
        self.setState({dataFetchUrl : response.meta.next_url});
        if (cb){
          cb();
        }
    });  
  },
  componentDidMount:function(){
      var self = this;
      if (this.props.contentType == 'jiyoActivityFeed') {
        if (this.props.user.id == this.props.me.id) {
          self.state.dataFetchUrl = '/user/feed/';  
        } else {
          self.state.dataFetchUrl = '/user/public-feed/'+this.props.user.id;   
        }  
      } else {
        self.state.dataFetchUrl = '/user/community-feed/';   
      }

      JiyoEvent.subscribe('feed_reload',function(name){
        if (self.props.contentType != name) {
          return;
        }
        if (self.state.activityMap == null){
          return;
        }
        if (self.state.dirty == false) {
          return;
        }
        if (self.state.activityMap.length == 0) {
          return;
        }
        self.state.dirty = false;
         $('#'+self.props.contentType).masonry({isFitWidth:true});   
      });

      JiyoEvent.subscribe('feed_item_delete',function (obj) {
        var actId = obj.actId;
        var uuid  = obj.uuid;
        Api.postData('/user/delete-activity',{uuid:uuid},function(resp){
           if (resp.success) {  
            for(var idx = 0; idx < self.state.activityMap.length;idx++) {
               var item = self.state.activityMap[idx];
                if (item.props.activity.id == actId) {
                  self.state.activityMap.splice(idx,1);
                  break;
                }
            }
            $("#jiyoActivityFeed").masonry('remove',[$("#"+actId)]);
             self.forceUpdate(function  (argument) {
               $('#'+self.props.contentType).masonry({isFitWidth:true});
             });
           } else {
            alert(resp.message);
           }
        })
        console.log('removing activity',obj);
      });
      self.loadMoreActivities(function(){
          if (self.state.activityMap.length == 0) {
            // No data - dont initialize masonry, it messesup with layout
            return;
          }
          $("#"+self.props.contentType).masonry({
            isFitWidth:true,
            isAnimated: false ,
            transitionDuration: 0,
            animationOptions: { duration: 750, easing: 'linear', queue: false }
          });
          $("#"+self.props.contentType).masonry('on','layoutComplete',function(){
            // console.log(self.props.contentType,'Calling the layout complete');
            self.state.contentLoading = false;
            self.state.recentList = [];
              $("#"+self.props.contentType+" .activityTile.invisible")
              .hide()
              .removeClass('invisible')
              .fadeIn();

          });
      });

      $(window).scroll(function() {
        if (self.state.dataFetchUrl == null) {
          //pulled all the data
          return;
        }

        if($(window).scrollTop() == $(document).height() - $(window).height()) {
            $("#"+self.state.contentType+' .loadingGif').show();
            self.loadMoreActivities();
        }
      });
  },
  childLoaded:function(item){
    $(item.getDOMNode()).removeClass('invisible');
  },
  getNoDataMessage : function(){

    var msg = this.props.user.display_name+" hasn't added any bits to the Journey. It would be nice if you shared bits with your friend.";

    if (this.props.me.id == this.props.user.id &&  this.props.contentType == 'jiyoActivityFeed') {
      return (<div className="col-md-9 col-lg-9 col-sm-12 col-xs-12 clearfix removePadding pull-right" >
          <DownloadAppWidget />
        </div>);
    } else  if (this.props.me.id !== this.props.user.id) {
      return (<div className="col-md-12 col-lg-12 col-sm-12 col-xs-12" >
        <div className="jumbotron">
          <h3>{msg}</h3>
          </div>
      </div>);
    } else {  
      // always show 12 column there wont be a myday widget
      return (<div className="col-md-12 col-lg-12 col-sm-12 col-xs-12" >
        <div className="col-md-3 col-lg-3 col-sm-3 col-xs-12">
            <RecommendUsers onTileLoad={this.childLoaded}  />
        </div>
        <div className="jumbotron col-md-9 col-lg-9 col-sm-9 col-xs-12">
          <h3>Connect with community to see their journey on Jiyo</h3>
        </div>
        </div>);
    }
  },
  getMyDayWidget :function() {
    if (this.props.me.id != this.props.user.id) {
      //if not me dont show
      return null;
    }

    if (this.props.contentType != 'jiyoActivityFeed') {
      //if not activity feed dont show
      return null;
    }

    var className = 'activityTile';
    if (this.state.activityMap && this.state.activityMap.length == 0) {
      className = 'col-md-3 col-lg-3 col-xs-12 col-sm-12 myDayTileInitial activityTile';
    }
    return (<div className={className} style={{"margin":"0 17px 20px 17px"}}>
      <div className={"activty-body defaultPointer"}  >
          <UserMyDayWidget me={this.props.me} user={this.props.user} allPendingTasks="YES" />
      </div> 
    </div>);
  },
  render : function(){
    var content = null; 
    var self  = this; 
    var content = null;

    var cls = 'row';

    if (this.state.activityMap == null) {
      content = null;
    } else if (this.state.activityMap.length == 0 ) {
      content = this.getNoDataMessage();
    } else {      
      cls = 'clearfix';
      content = this.state.activityMap;
    }

    var noMoreClass = 'hidden';
    if (this.state.dataFetchUrl == null) {
      //No more data to fetch show no more data.
      noMoreClass = '';
    }

    return (<div> 
      <div className={cls} id={this.props.contentType}> 
        {this.getMyDayWidget()}     
        {content}
      </div>
      <div className="text-center">
          <img src="/assets/img/loading.gif" className="loadingGif" 
            width="30" height="30" style={{"display":"none"}}/>
          <p className={"loadNoMore "+noMoreClass} style={{"padding-bottom":"20px"}} >
            Record your bits and continue your journey
          </p>
      </div>
    </div>)
  }
});
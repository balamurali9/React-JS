var DiscoverContentLoader = React.createClass({
  getInitialState:function(){
    return {
      container:null,
      page:0,
      gotItRendered:false,
      loadingClass:'hidden', 
      noMoreData :false,
      articleList:[],
      loadedArticleCount :0,
      recentList:[],
      nodes:[],
    }
  }, 	
  getDefaultProps : function(){
    return {
      search:'',
      containerName:"jiyoDiscoverContent",
      article_type : "article"
    };
  },
  articleLoaded:function(article) {
    var node = article.getDOMNode();
    var self = this;
    this.state.loadedArticleCount++;
    this.state.recentList.push(node); 
    this.state.nodes.push(node);
    if (this.state.loadedArticleCount < this.state.articleList.length) {
      return;
    }
    $("#"+self.props.containerName).masonry('addItems', this.state.recentList);
    $("#"+self.props.containerName).masonry({isFitWidth:true});
    this.setState({ 
      loadingClass:'hidden'
    });
  },
  resetArticles:function(){
    var self = this;
    $("#"+self.props.containerName).masonry('remove', this.state.nodes )
    this.setState({
      recentList:[],
      articleList:[],
      noMoreData:false,
      loadingClass:'hidden',
      gotItRendered:false,
      page:0, 
      nodes:[],
      loadedArticleCount:0
    });
    this.loadMoreArticles();
  },
  loadMoreArticles:function(){
    var self = this;
    var page = self.state.page; 
    if (self.state.noMoreData) {
      $("#throbber_container").addClass('hidden');
      return;    
    }
    if (self.state.loadingClass == ''){
      return;
    }
    if(self.state.recentList.length > 0) {
      return;
    }
    AppLogger.log('Page changes: '+page);
    self.setState({
      loadingClass:''
    });
    var val = $("#articleSort").val();
    $("#header_search_bar").val(this.props.search);
     
    Api.getData("/content/article-list/"+(page),{
      q:this.props.search,
      type:this.props.srch_param
    },function(response){   
  		if (self.state.articleList.length == 0 && self.props.search == '' ) {
       self.state.articleList.push(<DiscoverSpecialCard me={self.props.me} 
          onTileLoad={self.articleLoaded} />);
  		}      
      for(var idx = 0;idx < response.data.length;idx++) {
        var item = response.data[idx];
         
        self.state.articleList.push(<ArticleCard article={item} 
          onArticleLoad={self.articleLoaded}  />); 

        if (self.state.articleList.length == 30) {
          self.state.articleList.push(<RecommendUsersList onTileLoad={self.articleLoaded} />);
        }
      } 
      if (response.data.length == 0) {
        self.state.noMoreData = true;
        self.state.loadingClass = 'hidden';
      }
      self.state.gotItRendered = false;

      JiyoEvent.subscribe('discover_content_uireload',function(name){
        if (!name){
          name = self.props.containerName;
        }
        if (name == self.props.containerName) {
          $("#"+self.props.containerName).masonry({isFitWidth:true});
        }
      })
      setTimeout(function(){
        if (!self.state.gotItRendered) {
          $("#"+self.props.containerName+" .discover-article-teaser").removeClass('invisible').addClass('animated fadeIn');
        }
      },10000)
      self.setState({
        page:page+1
      })
    });
  },
  componentDidMount:function(){
    var self = this;
    $("#"+self.props.containerName).masonry({isFitWidth:true}); 
    $("#"+self.props.containerName).masonry('on','layoutComplete',function(){
        self.state.gotItRendered = true;
        self.state.recentList.forEach(function(node){
        $(node).removeClass('invisible').addClass('fadeIn');
      }); 
      self.state.recentList = [];
    });
    
    self.loadMoreArticles();
    $(window).scroll(function() {
      var height = $(window).scrollTop();
      if($(window).scrollTop() + $(window).height() + 500 >= $(document).height()) {
        self.loadMoreArticles();
      }
    });
    

  },
  render : function(){
    var self  = this; 
    return (<div  >
      <div className="clearfix jiyoLife" id={this.props.containerName} style={{"margin": "10px auto"}}>
	
      {this.state.articleList}
      </div>
      <div id="throbber_container" className={this.state.loadingClass+" text-center"} style={{"paddingTop":"10px"}}>
        <span className="throbber"></span>
      </div>
    </div>)
  }
});



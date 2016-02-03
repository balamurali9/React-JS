//similar articles
var SimilarArticlesLoader = React.createClass({
  getInitialState:function(){
    return {
      articleList:[]
    }
  },
  onLoad:function(item){
    // $(item).removeClass('invisible');
    $(".article-discover-teaser").removeClass('invisible');
  },
  componentDidMount:function(){
    var self = this;
    Api.getData('/content/similar-articles/'+this.props.article.id+"/"+this.props.article.genre,{},function(response){    
      for(var idx = 0;idx < response.data.length;idx++) {
        var item = response.data[idx];
        var react = (
          <ArticleCard onArticleLoad={self.onLoad} article={item} />
        );
        self.state.articleList.push(react); 
      }
	  self.setState({articleList:self.state.articleList});
    });
  },
  render : function(){
    var self  = this;
    var youMight = '';
    if(self.state.articleList.length != 0) {
        youMight = (<div className="text-left colorBlack"><h4>I am thinking you&#39;ll be interested in this.</h4></div>);
    }
    return (
	  <div className="textCenter">
		  {youMight}
  		<div className="similar-container">
  			{self.state.articleList}
  		</div>
	  </div>
    );
  }
});
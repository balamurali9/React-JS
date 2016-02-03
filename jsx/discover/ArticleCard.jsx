var ArticleCard = React.createClass({
  handleImageLoad:function(){   
    this.props.onArticleLoad(this);
  },
  handleImageError:function(){
    this.props.onArticleLoad(this);
  },  
  handleArticleClick:function(){
    document.location.href = this.props.article.url;
  },
  html_entity_decode:function(txt){
    var randomID = Math.floor((Math.random()*100000)+1);
    $('body').append('<div id="random'+randomID+'"></div>');
    $('#random'+randomID).html(txt);
    var entity_decoded = $('#random'+randomID).html();
    $('#random'+randomID).remove();
    return entity_decoded;
  },
  render : function() { 
    var article = this.props.article;
    var articlePlayIcon = '';
	if(article.content_type == 'video') {
		articlePlayIcon = (<span className="articleVideo icon20"></span>);
	}else if(article.content_type == 'audio') {
		articlePlayIcon = (<span className="articleAudio icon20"></span>);
	}else if(article.content_type == 'image') {
		articlePlayIcon = (<span className="articleImage icon20"></span>);
	}else {
		articlePlayIcon = (<span className="articleImage icon20"></span>);
	}
	var iconViewed = '';
	if (UserViewsManager.hasViewed(article.uuid)) {
		iconViewed = (<span className="articlesSocialMediaIconsSpace5 articleViewGreen icon16" title="Views"></span>);
	}else {
		iconViewed = (<span className="articlesSocialMediaIconsSpace5 articleViewGrey icon16" title="Views"></span>);
	}
    article.title = this.html_entity_decode(article.title);
    return (
				<div className="article-discover-teaser invisible" >
					<div className={"showTypeImg hidden " + article.content_type }>
					</div>
				<div className="content animate-panel custom-panel">
					<div className="artilce-teaser-panel">
						<div className="panel-heading" >
							<div className="media clearfix">
								<a className="pull-left" href={article.url}>
								  <img src={article.author_image} alt={article.author_name} />
								</a>
								<div className="media-body">
									<a className="articlesTextCus" title={article.title} href={article.url}>
										<TextEllipsis text={article.title} maxlimit="40" />
									</a>
									<span className="fontstyleNormal12"><a href={"/search?search_param=article&q="+article.author_name}>{article.author_name}</a></span>
								</div>
							</div>
						</div>
						<div className="panel-image midImage" style={{"backgroundColor":article.teaser_color}}>
							<img src={article.image} onClick={this.handleArticleClick} 
                  alt={article.title} 
                  onLoad={this.handleImageLoad} 
                  onError={this.handleImageError} className="img-responsive pointer" />
							<div className="articlePlayIcon">
								{articlePlayIcon}
								<br/>
								<small><span>{article.content_duration}</span></small>
							</div>
							<div className="title">
								<a href={article.url}></a>
							</div>
						</div>
						<div className="panel-body">
								<div className="articlesSocialMediaIcons">
									<span className="articlesSocialMediaIconsSpace20 icon16" title="Views">
										{iconViewed}
										<span className="articleViewCount">{article.view_count}</span>
									</span>
									<span className="articlesSocialMediaIconsSpace20 pointer" style={{"display":"inline-table"}} title="Likes">
										<ContentLikeUnlike obj={article} />
									</span>
									<span title="Comments pointer">
										<a href={article.url + "#comments"} ><span className="articlesSocialMediaIconsSpace5 commentImg icon16" title="Comments"></span></a>
										<span className="fontstyleNormal13" style={{"verticalAlign":"middle"}}>{article.comment_count}</span>
									</span>
								</div>
						</div>
						</div>
					</div>
				</div> 
	 );
  }
});
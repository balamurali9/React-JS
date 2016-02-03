
//User connections with friends and followers
var ActivityUserConnect = React.createClass({
  mixins:[HandleAssetLoadMixin],
  render : function(){
    var a = this.props.activity;
    return ( <div className="media">
        <div className="media-left">
          <a href={"/user/profile/"+a.user.id }  >
            <img className="img-100px-circle " 
              onLoad={this.handleAssetLoad} 
              onError={this.handleAssetError} 
              src={a.user.profile_image_url} />
          </a>
        </div>
        <div className="media-body" >  
          <span>{a.text}</span>
          <div className="headertime">{jiyoFromNow(a.utc)}</div>
        </div>
        <ProfileActivityActionWidget obj={a.user} hideViewCount="true"/>
      </div>)
  }
});

 //status of the user
var ActivityUserStatus = React.createClass({
  mixins:[HandleAssetLoadMixin],
  render : function(){


    var a = this.props.activity;
    var content = a.post.content;
    var image = null;
    if (a.post.mood_image_url) {
      image = a.post.mood_image_url;
    }
    var moodIcon = null;
    if (a.post.mood_image_icon) {
      if (image == null) {
        image = a.post.mood_image_icon;
      } else {
        moodIcon = (<img src={a.post.mood_image_icon} className="mood-image-icon" style={{height:"60px"}} />)
      }
    }
    if (image == null) {
      image = a.post.user_image_url;
    }
    
    // var content  = "Hey Emoji \ud83d\udeb4\ud83c\udffb\ud83d\udc0d\ud83d\udc91\ud83d\udc7a";

    return (<div>  
        
        <div className="media clearfix" style={{"margin":"15px"}}>
          <a className="media-left" href={'/user/profile/'+a.post.user_id}  >
            <img onLoad={this.handleAssetLoad} onError={this.handleAssetError} src={image} className="img-100px-circle"/>      
          </a>
          <div className="media-body" >
            <div className="activity-status-message"><span></span><span>{a.text} as <div className="status-post">{content}</div></span> {moodIcon}</div>              
            <div className="headertime" >{jiyoFromNow(a.utc)}</div>
          </div>
        </div>
        <ProfileActivityActionWidget obj={a.post} hideViewCount="true"/>
    </div>)
  }
});

 //article component
var ActivityArticleComponent = React.createClass({
  mixins:[HandleAssetLoadMixin],
  render : function(){
    var a = this.props.activity; 
 
    return (<div className="media"> 
         <div className="media-left"> 
          <a href={'/user/profile/'+a.actor.id}  >
              <img onLoad={this.handleAssetLoad} onError={this.handleAssetError} src={a.actor.image} className="img-100px-circle"/>      
          </a>
        </div>
         <div className="media-body">    
            <span> { a.text+"  "}</span><br/>
            <span className="headertime">{jiyoFromNow(a.utc)}</span>           
        </div>      
        <h4 style={{"padding":"10"}}><a href={a.article.url}>{a.article.title}</a></h4> 
      <img onLoad={this.handleAssetLoad} onError={this.handleAssetError} src={a.article.image} style={{"width":"100%"}}/>
      
      <p className="panel-heading">{a.article.teaser_text}</p>        
    <ProfileActivityActionWidget obj={a.article} hideViewCount="true"/>
    </div>)
  }
});

//image 
var ActivityImageComponent = React.createClass({
  mixins:[HandleAssetLoadMixin],
  handleActivityClick:function(){    
  //  JiyoEvent.fire('showPageModal',{obj:this.props.activity,childKey:'media'});
  },
  render : function(){
    var a = this.props.activity;
    return (<div className="media"> 
        <div className="media-left"> 
          <a href={'/user/profile/'+a.media.owner_info.id}  >
              <img onLoad={this.handleAssetLoad} onError={this.handleAssetError} src={a.media.owner_info.image} className="img-100px-circle"/>      
          </a>
        </div>
        <div className="media-body">
          <span>{ a.text+"  "} </span><br/>
          <span className="headertime">{jiyoFromNow(a.utc)}</span>
        </div>
        <div className="cover-image">
        <a  href="#" onClick={this.handleActivityClick} className="userImageEvent" >
          <img className="img-responsive" id="userImage" onLoad={this.handleAssetLoad} onError={this.handleAssetError} src={a.media.cdn_url} />
        </a></div>
        <ProfileActivityActionWidget obj={a.media} hideViewCount="true"/>
    </div>)
  }
});

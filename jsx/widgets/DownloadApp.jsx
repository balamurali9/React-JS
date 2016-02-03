var DownloadAppWidget = React.createClass({    
  getDefaultProps:function(){
    return {
      message:"Download the app here and begin your journey."
    }
  },
 render:function() {
    return (
      <div className="jumbotron" style={{padding:"20px 30px"}}>
          <div   style={{marginTop:"22px"}}>
            <h4 style={{margin:"30px 0px"}}>{this.props.message}</h4>
            <a href="https://itunes.apple.com/in/app/jiyo/id1012604543?mt=8" target="_blank" style={{marginRight:"10px"}}>
              <img src="/assets/img/banners/appstore-download.png" alt="appStore" width="177" height="56" />
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.bmm.jiyo&hl=en" target="_blank" style={{marginRight:"10px"}}>
              <img src="/assets/img/banners/playstore_in.png" alt="PlayStore" width="177" height="56"/>
            </a> 
          </div>  
        </div>
    );
 }
});
function refreshOGFB(){$.post("https://graph.facebook.com/?id="+encodeURIComponent(document.location.href)+"&scrape=true").done(function(e){console.log(e)})}function trackEvent(e,t,n,o){o||(o=1),n||(n=""),t||(t=""),ga("send","event",e,t,n,o)}function handleStageImageLoad(e){var t=(e.width+"_"+e.height,{h:$(e).parent().height(),w:$(e).parent().width()}),n=t.w/t.h,o=e.width/e.height;n>o?$(e).css("width","100%"):$(e).css("height","100%"),$(e).removeClass("hidden")}function getQueryStringValue(e){return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]"+escape(e).replace(/[\.\+\*]/g,"\\$&")+"(?:\\=([^&]*))?)?.*$","i"),"$1"))}function checkAndRenderComponent(e,t,n,o){if(gJsxRenderedParents[n]=e,AppLogger.log("Retrying to render "+e+" .."),"undefined"==typeof window[e])return void setTimeout(function(){gJsxRenderedParents[n]==e&&checkAndRender(e,t,n,o)},500);var i=React.render(React.createElement(window[e],t),document.getElementById(n));o&&o(i)}function jiyoFromNow(e){var t=new Date(1e3*e),n=new Date(1e3*moment().format("X")),o=Math.floor((n-t)/1e3),i=Math.floor(o/60),r=Math.floor(i/60),a=Math.floor(r/24);return dateStr=moment(1e3*e).format("MMM DD, YYYY"),1>=o?"1 second ago":60>o?o+" seconds ago":1==i?i+" minute ago":60>i?i+" minutes ago":1==r?r+" hour ago":24>r?r+" hours ago":1==a?a+" day ago":7>a?a+" days ago":a>=7?moment(1e3*e).format("MMM DD, YYYY"):dateStr}var HandleAssetLoadMixin={handleImageLoad:function(){this.props.onTileLoad(this)},handleImageError:function(){this.props.onTileLoad(this)}};$.fn.serializeToObject=function(){var e=$(this).serializeArray(),t={};return _.reduce(e,function(e,t){return e[t.name]=t.value,e},t),t},"undefined"==typeof window.console&&(window.console={log:function(){}}),_.templateSettings={interpolate:/\{\{(.+?)\}\}/g},$.ajaxPrefilter(function(e){e.beforeSend||(e.beforeSend=function(e){e.setRequestHeader("JIYO-DEVICE-WIDTH",window.screen.width),"undefined"!=typeof gAuth&&e.setRequestHeader("JIYO-ACCESS-TOKEN",gAuth.token)})});var Api={makeRequest:function(e,t){$("#top_error_panel").addClass("hidden"),$.ajax(e).done(function(e){t&&t(e),$("#topErrorMessageArea").addClass("hidden")}).fail(function(e){$("#top_error_panel").html("An Unexpected error occured").removeClass("hidden")}).error(function(e){401==e.status&&(document.location.href="/home"),0==e.status&&0==e.readyState&&$("#topErrorMessageArea").text("Unable to reach server, Please check your network connection ..").removeClass("hidden")})},postData:function(e,t,n){"function"==typeof t&&(n=t,t={}),t._token=gAppConfig.CSRFToken,this.makeRequest({url:e,type:"POST",data:t},n)},postJSON:function(e,t,n){this.makeRequest({url:e,type:"POST",dataType:"json",contentType:"application/json",data:JSON.stringify(t)},n)},deleteData:function(e,t,n){t._token=gCSRFToken,this.makeRequest({url:e,type:"DELETE",data:t},n)},getData:function(e,t,n){"function"==typeof t&&(n=t,t={}),this.makeRequest({url:e,type:"GET",data:t},n)}},JiyoEvent={subscribers:{},unsubscribe:function(e,t){"undefined"==typeof this.subscribers[e]},haveSubscribers:function(e){return"undefined"==typeof this.subscribers[e]?!1:this.subscribers[e].length>0},removeSubscribers:function(e){"undefined"!=typeof this.subscribers[e]&&(this.subscribers[e]=[])},subscribe:function(e,t){"undefined"==typeof this.subscribers[e]&&(this.subscribers[e]=[]),this.subscribers[e].push(t)},fire:function(e,t){var n=this.subscribers[e];if(n)for(var o=0;o<n.length;o++)n[o]&&n[o](t)}},Strings={programSelect:{},facetProgress:{title:"Facet Information"}},ServerPostMixin={stopEvent:function(e){return e.preventDefault(),e.stopPropagation(),!1},postData:function(e,t,n){var o=this,i=o.state;for(var r in i.errorMessages)i.errorMessages[r]=null;Api.postData(e,t,function(e){if(i.response=e,e.success)return void(n&&n(i));var t=e.data;for(var o in t){var r=t[o];i.errorMessages[o]=r}n&&(i.response=e,n(i))})}},gJsxRenderedParents={},AppLogger={log:function(){gAppConfig.debugEnabled&&console.log.apply(console,arguments)}},UserViewsManager={viewedObjects:{},hasViewed:function(e){return 1==this.viewedObjects[e]},init:function(){var e=this;JiyoEvent.subscribe("app_init",function(t){Api.getData("/content/user-article-views",{},function(t){e.viewedObjects=t.data})})}},UserStoryViewsManager={viewedStoryObjects:{},hasViewedStory:function(e){return 1==this.viewedStoryObjects[e]},init:function(){var e=this;JiyoEvent.subscribe("app_init",function(t){Api.getData("/content/user-story-views",{},function(t){e.viewedStoryObjects=t.data})})}};UserViewsManager.init(),UserStoryViewsManager.init();var UserLikesManager={likedObjects:[],like:function(e,t){var n=this;Api.getData("/content/like/"+e,{},function(t){1==t.data.meLiked&&(n.likedObjects.push(e),t.data.uuid=e,JiyoEvent.fire("object_like",t.data))})},unlike:function(e){var t=this;Api.getData("/content/unlike/"+e,{},function(n){0==n.data.meLiked&&(t.likedObjects=_.without(t.likedObjects,e),n.data.uuid=e,JiyoEvent.fire("object_unlike",n.data))})},init:function(){var e=this;JiyoEvent.subscribe("app_init",function(t){Api.getData("/content/user-likes",{},function(t){e.likedObjects=t.data,e.likedObjects.forEach(function(e){JiyoEvent.fire("object_like",{uuid:e})})})})},hasLiked:function(e){for(var t=0;t<this.likedObjects.length;t++)if(this.likedObjects[t]==e)return!0;return!1}};UserLikesManager.init(),$(function(){for(;gInitializerList.length;){var e=gInitializerList.pop();e()}}),$(document).ready(function(){for($(".facebookBtn").click(function(){ga("send","event","button","facebook_connect","click")}),$(".googleplusBtn").click(function(){ga("send","event","button","google_connect","click")}),$(".ga_logout").click(function(){ga("send","event","button","logout","click")});gComponentsToRender.length;){var e=gComponentsToRender.pop();checkAndRenderComponent(e.viewController,e.params,e.container,e.cb)}0!=$("#imageCropForm").length&&($("#imageCropForm").submit(function(e){var t=$("#imageCropForm").serializeToObject();return console.log(t),Api.postData("/user/profile-image",t,function(e){$("#user_profile_image").attr("src",e.data.cdn_url),$("#profileImageCropModal").modal("hide"),JiyoEvent.fire("update_activity"),$("#profileImagePreview").cropper("destroy")}),e.preventDefault(),e.stopPropagation(),!1}),$("form#imageCropForm .modal-header .close").on("click",function(){return $("#profileImageCropModal").modal("hide"),$("#profileImagePreview").cropper("destroy"),!1}),$("#profileImagePreview").on("load",function(){-1==$(this).attr("src").indexOf("loading.gif")&&($("#profileImageBusyState").addClass("hidden"),$("#profileImageCropModal").modal("show"),$("#profileImagePreview").cropper({aspectRatio:1,height:200,done:function(e){$("#crop_media_x").val(e.x),$("#crop_media_y").val(e.y),$("#crop_media_width").val(e.width),$("#crop_media_height").val(e.height)}}))}),$("#profileimage_upload").fileupload({url:"/user/upload?_token={{ csrf_token() }}",dataType:"json",done:function(e,t){var n=t.response();return 0==n.result.success?($("#profileImageBusyState").addClass("hidden"),alert(n.result.message),!1):($("#crop_media_id").val(n.result.data.id),void $("#profileImagePreview").attr("src",n.result.data.cdn_url))},start:function(){$("#profileImageBusyState").removeClass("hidden")},add:function(e,t){var n=t.files[0].name.split(".").pop(),o="jpeg,jpg,png,gif";return n=n.toLowerCase(),o.indexOf(n)<0?(alert("Are you sure this is an image file?"),!1):void t.submit()}}).prop("disabled",!$.support.fileInput).parent().addClass($.support.fileInput?void 0:"disabled"),$("#coverimage_upload").fileupload({url:"/user/upload?_token={{ csrf_token() }}",dataType:"json",done:function(e,t){var n=t.response();return 0==n.result.success?($("#coverImageBusyState").addClass("hidden"),alert(n.result.message),!1):($("#coverImageBusyState").addClass("hidden"),$(".profile-picture").css("background-image","url('"+n.result.data.cdn_url+"')"),void JiyoEvent.fire("update_activity"))},start:function(){$("#coverImageBusyState").removeClass("hidden")},add:function(e,t){var n=t.files[0].name.split(".").pop(),o="jpeg,jpg,png,gif";return n=n.toLowerCase(),o.indexOf(n)<0?(alert("Are you sure this is an image file?"),!1):void t.submit()}}).prop("disabled",!$.support.fileInput).parent().addClass($.support.fileInput?void 0:"disabled"))});
var TextEllipsis=React.createClass({displayName:"TextEllipsis",render:function(){var e=this.props.maxlimit,t=this.props.text;return t.length>e&&t.length>2&&(t=t.substring(0,e-2)+"..."),React.createElement("div",null,t)}}),LoadingIcon=React.createClass({displayName:"LoadingIcon",render:function(){return React.createElement("img",{src:"/assets/img/loading.gif",className:"loading_gif"})}}),LoadingIndicator=React.createClass({displayName:"LoadingIndicator",render:function(){return React.createElement("div",{className:"text-center",style:{padding:"20px"}},React.createElement(LoadingIcon,null))}}),ValPropSetMixin={handleProps:function(e){$(this.refs.inputElement.getDOMNode()).val(e.val)},componentDidMount:function(){this.handleProps(this.props)},componentWillReceiveProps:function(e){this.handleProps(e)}},HtmlFormErrorMessage=React.createClass({displayName:"HtmlFormErrorMessage",render:function(){var e=this.props,t="hidden";return e.errorMsg&&""!=e.errorMsg?t="text-danger":e.errorMsg="",React.createElement("div",{className:t,dangerouslySetInnerHTML:{__html:e.errorMsg}})}}),HtmlFormGroupText=React.createClass({displayName:"HtmlFormGroupText",mixins:[ValPropSetMixin],render:function(){var e=this.props,t="hidden";e.errorMsg&&""!=e.errorMsg?t="text-danger":e.errorMsg="";var r=e.label;return e.placeholder&&(r=e.placeholder),React.createElement("div",{className:"form-group "+e.name},React.createElement("label",{className:"control-label",htmlFor:e.name},e.label),React.createElement("input",{className:"form-control",id:e.name,ref:"inputElement",autocomplete:"off",placeholder:r,type:"text",name:e.name}),React.createElement("div",{className:t},e.errorMsg))}}),HtmlFormColor=React.createClass({displayName:"HtmlFormColor",mixins:[ValPropSetMixin],render:function(){var e=this.props,t="hidden";return e.errorMsg&&""!=e.errorMsg?t="text-danger":e.errorMsg="",React.createElement("div",{className:"form-group"},React.createElement("label",{className:"control-label",htmlFor:e.name},e.label),React.createElement("input",{ref:"inputElement",className:"form-control",autocomplete:"off",id:e.name,type:"color",name:e.name}),React.createElement("div",{className:t},e.errorMsg))}}),HtmlFormGroupPassword=React.createClass({displayName:"HtmlFormGroupPassword",mixins:[ValPropSetMixin],render:function(){var e=this.props,t="hidden";e.errorMsg&&""!=e.errorMsg?t="text-danger":e.errorMsg="";var r=e.label;return e.placeholder&&(r=e.placeholder),React.createElement("div",{className:"form-group "+e.name},React.createElement("label",{className:"control-label",htmlFor:e.name},e.label),React.createElement("input",{ref:"inputElement",className:"form-control",autocomplete:"off",id:e.name,placeholder:r,type:"password",name:e.name}),React.createElement("div",{className:t},e.errorMsg))}}),HtmlFormGroupTextArea=React.createClass({displayName:"HtmlFormGroupTextArea",mixins:[ValPropSetMixin],render:function(){var e=this.props,e=this.props,t="hidden";return e.errorMsg&&""!=e.errorMsg?t="text-danger":e.errorMsg="",React.createElement("div",{className:"form-group"},React.createElement("label",{className:"control-label",htmlFor:e.name},e.label),React.createElement("textarea",{ref:"inputElement",rows:"5",className:"form-control",name:e.name,id:e.name}),React.createElement("div",{className:t},e.errorMsg))}}),HtmlH1=React.createClass({displayName:"HtmlH1",render:function(){return React.createElement("h1",null,this.props.text)}}),HtmlH2Msg=React.createClass({displayName:"HtmlH2Msg",render:function(){return React.createElement("h2",{className:"text-center"},this.props.text)}}),HtmlFormSelect=React.createClass({displayName:"HtmlFormSelect",mixins:[ValPropSetMixin],render:function(){var e=this.props;return React.createElement("div",{className:"form-group"},React.createElement("label",{className:"control-label",htmlFor:e.name},e.label),React.createElement("select",{ref:"inputElement",name:e.name,id:e.name,className:"form-control"},e.items))}}),HtmlFormSelectOption=React.createClass({displayName:"HtmlFormSelectOption",render:function(){var e=this.props;return React.createElement("option",{value:e.value},e.label)}}),ButtonSelectionMap=React.createClass({displayName:"ButtonSelectionMap",render:function(){var e=[],t=this.props.buttonMap;for(var r in t){var a=t[r];e.push(r==this.props.selected?React.createElement("button",{onClick:this.props.handleClick.bind(null,r),className:"btn btn-xs btn-success"},a):React.createElement("button",{onClick:this.props.handleClick.bind(null,r),className:"btn btn-xs btn-primary"},a))}return React.createElement("div",{className:"btn-group"},e)}});
var DownloadAppWidget=React.createClass({displayName:"DownloadAppWidget",getDefaultProps:function(){return{message:"Download the app here and begin your journey."}},render:function(){return React.createElement("div",{className:"jumbotron",style:{padding:"20px 30px"}},React.createElement("div",{style:{marginTop:"22px"}},React.createElement("h4",{style:{margin:"30px 0px"}},this.props.message),React.createElement("a",{href:"https://itunes.apple.com/in/app/jiyo/id1012604543?mt=8",target:"_blank",style:{marginRight:"10px"}},React.createElement("img",{src:"/assets/img/banners/appstore-download.png",alt:"appStore",width:"177",height:"56"})),React.createElement("a",{href:"https://play.google.com/store/apps/details?id=com.bmm.jiyo&hl=en",target:"_blank",style:{marginRight:"10px"}},React.createElement("img",{src:"/assets/img/banners/playstore_in.png",alt:"PlayStore",width:"177",height:"56"}))))}});
var ProfileInsightsPanel=React.createClass({displayName:"ProfileInsightsPanel",getInitialState:function(){return{insightsData:null}},renderCharts:function(){var e=this;e.renderSteps(React.findDOMNode(e.refs.steps)),e.renderSleep(React.findDOMNode(e.refs.sleep)),e.renderActivity(React.findDOMNode(e.refs.calories)),e.renderAchievements(React.findDOMNode(e.refs.achievements)),e.renderCoherence(React.findDOMNode(e.refs.coherence))},initData:function(){var e=this;$(window).resize(function(){e.renderCharts()}),Api.getData("/user/insights2",{},function(t){e.setState({insightsData:t.data},function(){e.renderCharts()})})},componentDidMount:function(){var e=this;gChartReady?e.initData():JiyoEvent.subscribe("charts_ready",function(){e.initData()})},renderSteps:function(e){if(e){for(var t=[["Date","Steps"]],a=this.state.insightsData.steps,i=0;i<a.length;i++){var n=a[i];t.push([moment(1e3*n.tm).format("YYYY-MM-DD"),n.val])}var s=new google.visualization.arrayToDataTable(t),r={chart:{title:"Steps Per Day"},legend:{position:"none"},series:{0:{axis:"date"},1:{axis:"steps"}},axes:{y:{date:{label:"Steps"},steps:{side:"right"}}}},o=new google.charts.Bar(e);o.draw(s,r),$(e).parent().removeClass("invisible")}},renderSleep:function(e){if(e){for(var t=this.state.insightsData.sleep,a=[["Date","Hours"]],i=0;i<t.length;i++){var n=t[i];a.push([moment(1e3*n.tm).format("YYYY-MM-DD"),Math.round(n.val/60*100)/100])}var s=new google.visualization.arrayToDataTable(a),r={chart:{title:"Sleep"},legend:{position:"none"},series:{0:{axis:"date"},1:{axis:"sleep"}},axes:{y:{date:{label:"Hours"},sleep:{side:"right"}}}},o=new google.charts.Bar(e);o.draw(s,r),$(e).parent().removeClass("invisible")}},renderActivity:function(e){if(e){for(var t=this.state.insightsData.calories,a=[["Date","Calories"]],i=0;i<t.length;i++){var n=t[i];a.push([moment(1e3*n.tm).format("YYYY-MM-DD"),n.val])}var s=new google.visualization.arrayToDataTable(a),r={chart:{title:"Calories"},legend:{position:"none"},series:{0:{axis:"date"},1:{axis:"calories"}},axes:{y:{date:{label:"calories"},calories:{side:"right"}}}},o=new google.charts.Bar(e);o.draw(s,r),$(e).parent().removeClass("invisible")}},renderAchievements:function(e){if(e){for(var t=this.state.insightsData.achievements,a=[["Date","Achievements"]],i=0;i<t.length;i++){var n=t[i];a.push([moment(1e3*n.tm).format("YYYY-MM-DD"),n.val])}var s=new google.visualization.arrayToDataTable(a),r={chart:{title:"Achievements"},curveType:"function",legend:{position:"none"}},o=new google.charts.Line(e);o.draw(s,r),$(e).parent().removeClass("invisible")}},renderCoherence:function(e){if(e){for(var t=this.state.insightsData.coherence,a=[["Date","Coherence"]],i=0;i<t.length;i++){var n=t[i];a.push([moment(1e3*n.tm).format("YYYY-MM-DD"),n.val])}var s=new google.visualization.arrayToDataTable(a),r={chart:{title:"Coherence"},curveType:"function",legend:{position:"none"}},o=new google.charts.Line(e);o.draw(s,r),$(e).parent().removeClass("invisible")}},render:function(){var e=this,t=paramObj.me.id;if(void 0!=paramObj.uid&&(t=paramObj.uid),null==e.state.insightsData)return React.createElement("div",{className:"text-center loading-container"},React.createElement(LoadingIcon,null));var a=e.state.insightsData,i=[];for(var n in a)0!=a[n].length&&i.push(React.createElement("div",{id:n,className:"chart-container invisible col-md-6 col-lg-6 col-xs-12 col-sm-12"},React.createElement("div",{className:"chart",ref:n})));return 0==i.length&&i.push(React.createElement("div",{className:"col-xs-12 col-sm-12 col-md-12 col-lg-12 mobileWebSwitch"},React.createElement("div",{className:"web",style:{lineHeight:"30px"}},React.createElement(DownloadAppWidget,{message:"Download the app here, add devices to be able to see your insights here."})),React.createElement("div",{className:"jumbotron mobile",style:{lineHeight:"30px"}},React.createElement("h3",null,"In sometime your insights will be seen here.")))),React.createElement("div",{className:"row"},i)}});
function trackPage(e,t){ga("send","pageview",{page:e,title:t})}var JiyoRouteController=Backbone.Router.extend({routes:{"quiz/:id":"attemptBulkAssessment","quiz-result/:id":"showBulkAssessmentResult","assessment-result/:id":"showAssessmentResult",discover:"loadDiscover",plus:"loadJiyoPlus",insights:"getInsights","profile/:id/:action":"getPublicProfile",profile:"getPublicProfile","profile/:id":"getPublicProfile",settings:"loadSettings","change-password":"changePassword",editProfile:"editProfile","settings-general":"editProfile","manage-devices":"loadDevices","user/:action":"changeSettings",community:"loadCommunity","*path":"defaultRoute"},editProfile:function(){trackPage("/settings-profile","Edit Profile"),checkAndRender("SettingsGeneral",paramObj,"jiyo_content_area")},loadDevices:function(){checkAndRender("SettingsDeviceManager",paramObj,"jiyo_content_area")},changePassword:function(){trackPage("/change-password","Change Password"),checkAndRender("SettingsChangePassword",paramObj,"jiyo_content_area")},loadSettings:function(){trackPage("/settings","Settings"),checkAndRender("SettingsPrivacyManager",paramObj,"jiyo_content_area")},getPublicProfile:function(e,t){e||(e=paramObj.me.id);var a=this;return t||(t="journey"),paramObj.user.id!=e&&paramObj.user.screen_name!=e||!JiyoEvent.haveSubscribers("make_profile_tab_active")?(checkAndRender("LoadingIndicator",paramObj,"jiyo_content_area"),void Api.getData("/user/profile-data/"+e,function(e){paramObj=e.data,paramObj.activeTab=t,a.navigate("/profile/"+e.data.user.screen_name+"/"+t),checkAndRender("UserProfileComponent",paramObj,"jiyo_content_area")})):(paramObj.activeTab=t,void JiyoEvent.fire("make_profile_tab_active"))},loadJiyoPlus:function(){checkAndRender("LoadingIndicator",paramObj,"jiyo_content_area"),checkAndRender("JiyoPlusChannelLoader",paramObj,"jiyo_content_area"),trackPage("/plus","Jiyo Plus")},loadCommunity:function(){checkAndRender("CommunityLeaderBoard",{title:"Task Completion Leader Board",dataSource:"/jiyo/leader-board"},"jiyo_content_area")},loadNotifications:function(e){checkAndRender("UserNotificationComponent",paramObj,"jiyo_content_area")},getInsights:function(){checkAndRender("ProfileInsightsPanel",paramObj,"jiyo_content_area")},loadDiscover:function(){checkAndRender("DiscoverContentLoader",paramObj,"jiyo_content_area"),trackPage("/discover","Discover")},showAssessmentResult:function(e){Api.getData("/qna/attempt-result/"+e,{},function(e){checkAndRender("HtmlDoshaResult",{data:e.data},"jiyo_content_area")})},listAssessments:function(){checkAndRender("LoadingIcon",{},"jiyo_content_area"),Api.getData("/qna/assessment-list",{},function(e){checkAndRender("HtmlListGroup",{items:e.data,baseUrl:"#assessment/"},"jiyo_content_area")})},showBulkAssessmentResult:function(e){Api.getData("/qna/attempt-result/"+e,{},function(e){"Invalid attempt Id"!=e.message?($("#jiyo_content_area").removeClass("invalidattempt"),checkAndRender("AssessmentDoshaResult",{data:e.data},"jiyo_content_area")):$("#jiyo_content_area").addClass("invalidattempt").html("Invalid attempt")}),trackPage("/quiz-result","Dosha Quiz Result")},attemptBulkAssessment:function(e){var t=this;checkAndRender("LoadingIcon",{},"jiyo_content_area"),Api.getData("/qna/attempt-assessment/"+e,{},function(e){return 0==e.success?void checkAndRender("HtmlH2Msg",{text:e.message},"jiyo_content_area"):void Api.getData("/qna/bulk-assessment-questions/"+e.data.attempt.id,{},function(e){t.attemptId=e.data.attempt.id,t.attempt=e.data.attempt,t.question=e.data.questions,checkAndRender("AssessmentQuestionObject",{question:e.data.questions,attempt:t.attempt,parent:t},"jiyo_content_area")})}),trackPage("/quiz/1","Dosha Quiz")},defaultRoute:function(){"/user/insights"==gAppConfig.path?checkAndRender("ProfileInsightsPanel",paramObj,"jiyo_content_area"):this.navigate("#discover",{trigger:!0})}});
function refreshOGFB() {
    $.post('https://graph.facebook.com/?id='+encodeURIComponent(document.location.href)+'&scrape=true')
    .done(function(r) { console.log(r) });
}

function trackEvent(evt,category,label,value) {
  if (!value) {
    value = 1;
  }
  if (!label) {
    label = '';
  }
  if (!category) {
    category = ''
  } 
  ga('send', 'event', evt, category, label, value);
}

var HandleAssetLoadMixin = {
  handleImageLoad:function(){   
        this.props.onTileLoad(this);
  },
  handleImageError:function(){
    this.props.onTileLoad(this);
  },  
}

$.fn.serializeToObject = function(){
  var obj = $(this).serializeArray(); 
  var map = {};
  _.reduce(obj,function(m,o) {
    m[o.name] = o.value;
    return m;
  },map);
  return map;
}

if (typeof window.console == 'undefined') {
  window.console = {
    log :function(){
      //nop
    }
  }
}
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

$.ajaxPrefilter(function( options ) {
    if ( !options.beforeSend) {
        options.beforeSend = function (xhr) { 
            xhr.setRequestHeader('JIYO-DEVICE-WIDTH', window.screen.width);

            if (typeof gAuth != 'undefined') {
              xhr.setRequestHeader('JIYO-ACCESS-TOKEN', gAuth.token);
            }
        }
    }
});

/*
Routes to be defined and move to complete clientside routing

/#discover
/#plus
/#user/giju.eldhose/journey
/#user/poonacha/joureny/list
/#user/giju.eldhose/me
/#user/giju.eldhose/we
/#user/giju.eldhose/insights
/#user/gijue.dhose/settings
/#user/poonacha/journey/act_23232
/#user/poonacha/connections/

/#user/change-password
/#user/add-devices

/#search/articls/How come I can search this 
/#search/bits/search for bits here
/#search/users/notihng can be done
/#article/seo-uq-id
*/

function handleStageImageLoad(item){  
    var wh = item.width+"_"+item.height;
    var sz = { 
      h : $(item).parent().height(),
      w: $(item).parent().width()
    }; 
    var arp = sz.w /sz.h;
    var arm = item.width/item.height; 
    if (arp > arm){ 
      $(item).css('width','100%');
    } else {
      $(item).css('height','100%');
    }
    $(item).removeClass('hidden');
}

function getQueryStringValue (key) {  
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}  


function checkAndRenderComponent(viewController,params,container,cb) { 
    gJsxRenderedParents[container] = viewController;
    AppLogger.log("Retrying to render "+viewController+" ..");
    if (typeof window[viewController] == 'undefined') {
        setTimeout(function(){
          if (gJsxRenderedParents[container] == viewController) {
            checkAndRender(viewController,params,container,cb); 
          }
        },500);
        return;
    } 
    var obj = React.render(React.createElement(window[viewController],  
      params
    ),document.getElementById(container)); 
    if (cb) {
      cb(obj);
    }
}

function jiyoFromNow(utcTime) {
    var datePast = new Date(utcTime*1000);
    var dateNow = new Date((moment().format('X'))*1000);
    var seconds = Math.floor((dateNow - (datePast))/1000);
    var minutes = Math.floor(seconds/60);
    var hours = Math.floor(minutes/60);
    var days = Math.floor(hours/24);
    dateStr = moment(utcTime*1000).format('MMM DD, YYYY');
    if(seconds<=1)
    {
        return "1 second ago";
    }
    else if (seconds<60)
    {
        return seconds+" seconds ago";
    }
    else if (minutes==1)
    {
        return minutes+" minute ago";
    }
    else if (minutes<60)
    {
        return minutes+" minutes ago";
    }
    else if (hours==1)
    {
        return hours+" hour ago";
    }
    else if (hours<24)
    {
        return hours+" hours ago";
    }
    else if (days==1)
    {
        return days+" day ago";
    }
    else if (days<7)
    {
        return days+" days ago";
    }
    else if (days>=7)
    {
        return moment(utcTime*1000).format('MMM DD, YYYY');
    }
    return dateStr;    
}



var Api = {

  makeRequest:function(params,cb) {
    $("#top_error_panel").addClass('hidden');
    $.ajax(params).done(function(result){  
      if (cb){ 
        cb(result);
      }
      $("#topErrorMessageArea").addClass('hidden')
    }).fail(function(jqXHR){
      $("#top_error_panel").html('An Unexpected error occured').removeClass('hidden');
    }).error(function(jqXHR){
      if (jqXHR.status == 401) {
        document.location.href = '/home';
      }
      if (jqXHR.status ==0 && jqXHR.readyState == 0){
        $("#topErrorMessageArea").text('Unable to reach server, Please check your network connection ..').removeClass('hidden');
      }
    });
  },
  postData :function(url,data,cb) { 
    if (typeof data =='function') {
      cb = data;
      data = {};
    }
    data._token = gAppConfig.CSRFToken;
    this.makeRequest({
        url: url,
        type: 'POST',
        data:data
    },cb);
  },
  postJSON:function(url,data,cb) {
     this.makeRequest({
        url: url,
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data:JSON.stringify(data)
    },cb);
  },
  deleteData:function(url,data,cb){ 
    data._token = gCSRFToken;
    this.makeRequest({
        url: url,
        type: 'DELETE',
        data:data
    },cb);
  },
  getData : function(url,data,cb) {
    if (typeof data =='function') {
      cb = data;
      data = {};
    }
    this.makeRequest({
        url: url,
        type: 'GET',
        data:data
    },cb);
  }
};


var JiyoEvent = {
  subscribers:{
  },
  unsubscribe:function(type,func){
    if (typeof this.subscribers[type] == 'undefined'){
      return;
    } 
  },
  haveSubscribers:function(type){
    if (typeof this.subscribers[type] == 'undefined'){
      return false;
    } 
    return this.subscribers[type].length > 0;
  },
  removeSubscribers:function(type){
    if (typeof this.subscribers[type] == 'undefined'){
      return;
    } 
    this.subscribers[type] = [];
  },
  subscribe:function(type,handler){
    if (typeof this.subscribers[type] == 'undefined'){
      this.subscribers[type] = []
    } 
    this.subscribers[type].push(handler);
  },
  fire:function(type,data){
    var handlerList = this.subscribers[type];
    if (!handlerList ) {
      return;
    }
    for(var idx =0;idx < handlerList.length;idx++){
      if (handlerList[idx]){
        handlerList[idx](data); 
      }
    }
  }
}

var Strings = {
  programSelect : {

  },
  facetProgress: {
    title:'Facet Information'
  }
}


var ServerPostMixin = {
  stopEvent:function(event) {
    event.preventDefault();
    event.stopPropagation(); 
    return false;
  },

  postData:function(url,data,cb){
    var self = this;
    var state = self.state;
    for(var key in state.errorMessages) {
      state.errorMessages[key] = null;
    } 

    Api.postData(url,data,function(result){ 
      state.response = result;  
      if (result.success) {
        if (cb){
          cb(state);
        }
        return;
      } 
      var data = result.data; 
      for(var key in data) {
        var list = data[key]; 
        state.errorMessages[key] = list ;
      }  
      if (cb){ 
        state.response = result;
        cb(state);
      }
    }); 
  }
};
 
var gJsxRenderedParents = {
}

var AppLogger = {
  log:function(){
    if (!gAppConfig.debugEnabled) {
      return;
    }
    console.log.apply(console,arguments);
  }
}

var UserViewsManager = {
  viewedObjects :{},
  hasViewed : function(uuid) {
    return this.viewedObjects[uuid] == true;
  },
  init:function(){
    var self = this;
    JiyoEvent.subscribe('app_init',function(data){
      Api.getData('/content/user-article-views',{},function(resp){
        self.viewedObjects = resp.data; 
      });
    });
  }
}

var UserStoryViewsManager = {
  viewedStoryObjects :{},
  hasViewedStory : function(uuid) {
    return this.viewedStoryObjects[uuid] == true;
  },
  init:function(){
    var self = this;
    JiyoEvent.subscribe('app_init',function(data){
      Api.getData('/content/user-story-views',{},function(resp){
        self.viewedStoryObjects = resp.data; 
      });
    });
  }
}

UserViewsManager.init();
UserStoryViewsManager.init();

var UserLikesManager = {
  likedObjects:[],
  like:function(objectId,cb){
    var self = this;
    Api.getData('/content/like/'+objectId,{},function(resp){
      if (resp.data.meLiked == true) {
        self.likedObjects.push(objectId); 
        resp.data.uuid = objectId;
        JiyoEvent.fire('object_like',resp.data)
      } 
    });
  },
  unlike:function(objectId){
    var self = this;
    Api.getData('/content/unlike/'+objectId,{},function(resp){
      if (resp.data.meLiked == false) {
        self.likedObjects = _.without(self.likedObjects,objectId);
        resp.data.uuid = objectId;
        JiyoEvent.fire('object_unlike',resp.data)
      }
    });
  },
  init:function(){
    var self = this;
    JiyoEvent.subscribe('app_init',function(data){
      Api.getData('/content/user-likes',{},function(resp){
        self.likedObjects = resp.data; 
        self.likedObjects.forEach(function(item){ 
          JiyoEvent.fire('object_like',{
            uuid:item
          });
        })
      });
    });
  },
  hasLiked:function(id){ 
    for(var idx =0;idx < this.likedObjects.length;idx++){
      if (this.likedObjects[idx] == id){ 
        return true;
      }
    }
    return false;
  }
}
UserLikesManager.init();
$(function(){
    while(gInitializerList.length) {
      var func = gInitializerList.pop();
      func();
    }
});
$(document).ready(function(){
    $('.facebookBtn').click(function(){
        ga('send', 'event','button','facebook_connect','click');
    });
    $('.googleplusBtn').click(function(){
        ga('send', 'event','button','google_connect','click');
    });
    $('.ga_logout').click(function(){
        ga('send', 'event','button','logout','click');
    });
    
  

    while(gComponentsToRender.length) {
      var item = gComponentsToRender.pop();
      checkAndRenderComponent(item.viewController,
        item.params,
        item.container,
        item.cb);
     }
 
    if ($("#imageCropForm").length == 0) {
      return;
    }
    
    $("#imageCropForm").submit(function(event) {
        /* Act on the event */ 
        var data = $("#imageCropForm").serializeToObject();
        console.log(data);
        Api.postData("/user/profile-image",data,function(response){
            $("#user_profile_image").attr("src",response.data.cdn_url);
             $("#profileImageCropModal").modal('hide');
              JiyoEvent.fire('update_activity');
              $("#profileImagePreview").cropper("destroy");
        });
        event.preventDefault();
        event.stopPropagation(); 
        return false;
    });

    $('form#imageCropForm .modal-header .close').on('click',function(){
        $("#profileImageCropModal").modal('hide');
        $("#profileImagePreview").cropper("destroy");
        return false;
    });

    $("#profileImagePreview").on('load',function(){
      if ($(this).attr('src').indexOf('loading.gif') != -1 ) {
        return;
      }
      $("#profileImageBusyState").addClass('hidden');
      $("#profileImageCropModal").modal('show');
      $("#profileImagePreview").cropper({
        aspectRatio: 1,
        height:200,
        done: function(data) {
          $("#crop_media_x").val(data.x);
          $("#crop_media_y").val(data.y);
          $("#crop_media_width").val(data.width);
          $("#crop_media_height").val(data.height);
        }
      });
    });

    $('#profileimage_upload').fileupload({
        url: '/user/upload?_token={{ csrf_token() }}' , 
        dataType: 'json',
        done: function (e, data) {
            var res= data.response(); 
            if(res.result.success == false) {
                $("#profileImageBusyState").addClass('hidden');
                alert(res.result.message);
                return false;
            }             
            $("#crop_media_id").val(res.result.data.id); 
            $("#profileImagePreview").attr('src',res.result.data.cdn_url);
        },
        start:function(){ 
            $("#profileImageBusyState").removeClass('hidden');
        },
        add: function (e, data) {
            var fileType = data.files[0].name.split('.').pop(), allowdtypes = 'jpeg,jpg,png,gif';
            fileType = fileType.toLowerCase();
            if (allowdtypes.indexOf(fileType) < 0) {
                alert('Are you sure this is an image file?');
                return false;
            }
            data.submit();
        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');  

    $('#coverimage_upload').fileupload({
        url: '/user/upload?_token={{ csrf_token() }}' ,
        dataType: 'json', 
        done: function (e, data) {
            var res= data.response();
            if(res.result.success == false) {
                $("#coverImageBusyState").addClass('hidden');
                alert(res.result.message);
                return false;
            }
            $("#coverImageBusyState").addClass('hidden');
            $(".profile-picture").css("background-image","url('"+res.result.data.cdn_url+"')");
             JiyoEvent.fire('update_activity');
        },
        start:function(){ 
            $("#coverImageBusyState").removeClass('hidden');
        }, 
        add: function (e, data) {
            var fileType = data.files[0].name.split('.').pop(), allowdtypes = 'jpeg,jpg,png,gif';
            fileType = fileType.toLowerCase();
            if (allowdtypes.indexOf(fileType) < 0) {
                alert('Are you sure this is an image file?');
                return false;
            }
            data.submit();
        }
    }).prop('disabled', !$.support.fileInput)
        .parent().addClass($.support.fileInput ? undefined : 'disabled');
});

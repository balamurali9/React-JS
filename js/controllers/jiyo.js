function trackPage (url,title) {
    ga('send', 'pageview', {
        page:url,
        title:title
    });
}  


var JiyoRouteController  = Backbone.Router.extend({
    routes: { 
        "quiz/:id": "attemptBulkAssessment",
        "quiz-result/:id":"showBulkAssessmentResult",
        "assessment-result/:id":"showAssessmentResult",
        
        "discover" :"loadDiscover",
        "plus" : "loadJiyoPlus",
        
        "insights":"getInsights",


        "profile/:id/:action" : "getPublicProfile", 
        "profile" : "getPublicProfile", 
        "profile/:id" : "getPublicProfile", 
        
        "settings":"loadSettings",
        "change-password":"changePassword",        
        "editProfile":"editProfile", 
        "settings-general" : "editProfile",
        "manage-devices":"loadDevices",

        "user/:action":'changeSettings',
        "community":"loadCommunity",
        "*path" :"defaultRoute"
    },
    editProfile:function(){
        trackPage('/settings-profile','Edit Profile'); 
        checkAndRender("SettingsGeneral",paramObj,"jiyo_content_area");
    },
    loadDevices:function(){
      checkAndRender("SettingsDeviceManager",paramObj, "jiyo_content_area" ); 
    }, 
    changePassword:function(){
        trackPage('/change-password','Change Password'); 
        checkAndRender("SettingsChangePassword",paramObj, "jiyo_content_area" );
    },
    loadSettings:function(){
        trackPage('/settings','Settings'); 
      checkAndRender("SettingsPrivacyManager",paramObj, "jiyo_content_area" );
    },
    getPublicProfile:function(id,action){
        if (!id) {
            id = paramObj.me.id;
        }
        var self = this;
        if (!action) {
            action = 'journey';
        }
        if ((paramObj.user.id == id || paramObj.user.screen_name == id ) 
                && JiyoEvent.haveSubscribers('make_profile_tab_active')) {
            paramObj.activeTab = action;
            JiyoEvent.fire('make_profile_tab_active');
            return;
        }

        checkAndRender("LoadingIndicator",paramObj,"jiyo_content_area");
        Api.getData('/user/profile-data/'+id,function (resp) {
            paramObj = resp.data;
            paramObj.activeTab = action;
            self.navigate('/profile/'+resp.data.user.screen_name+"/"+action);
            checkAndRender("UserProfileComponent",paramObj,"jiyo_content_area");
        });
    },
    loadJiyoPlus:function(){
        checkAndRender("LoadingIndicator",paramObj,"jiyo_content_area");
        checkAndRender("JiyoPlusChannelLoader",paramObj,"jiyo_content_area");  
        trackPage('/plus','Jiyo Plus'); 
    },
    loadCommunity:function () {
        checkAndRender("CommunityLeaderBoard",{
            title:"Task Completion Leader Board",
            dataSource:"/jiyo/leader-board"
        },"jiyo_content_area"); 
    },
    loadNotifications:function (argument) {
        checkAndRender( "UserNotificationComponent",paramObj,"jiyo_content_area");
    },
    getInsights:function() {
        checkAndRender("ProfileInsightsPanel",paramObj,"jiyo_content_area");
    },
    loadDiscover:function() { 
        checkAndRender("DiscoverContentLoader",paramObj,"jiyo_content_area");
        trackPage('/discover','Discover'); 
    },
    showAssessmentResult:function(id){
        var self = this;
          Api.getData('/qna/attempt-result/'+id,{ },function(resp){ 
             checkAndRender("HtmlDoshaResult", {data : resp.data},'jiyo_content_area');
         });
    },
    listAssessments : function() {
        checkAndRender("LoadingIcon",{},'jiyo_content_area');
        Api.getData('/qna/assessment-list',{},function(resp){ 
            checkAndRender("HtmlListGroup",{
                items:resp.data ,
                baseUrl:"#assessment/"
            },'jiyo_content_area');
        });
    }, 
    showBulkAssessmentResult:function(id){
        Api.getData('/qna/attempt-result/'+id,{ },function(response){  
            if(response.message != "Invalid attempt Id"){
                $( '#jiyo_content_area' ).removeClass('invalidattempt')
                checkAndRender("AssessmentDoshaResult", {data : response.data},'jiyo_content_area');
             }else{
                $( '#jiyo_content_area' ).addClass('invalidattempt').html("Invalid attempt");
             }   
        });
        trackPage('/quiz-result','Dosha Quiz Result');  
    },
  
    attemptBulkAssessment: function(id) {
        var self = this; 
        checkAndRender("LoadingIcon",{  },'jiyo_content_area');
        Api.getData('/qna/attempt-assessment/'+id,{},function(r1){

            if (r1.success == false) {
                checkAndRender("HtmlH2Msg",{text:r1.message},"jiyo_content_area");
                return;
            }
            Api.getData('/qna/bulk-assessment-questions/'+r1.data.attempt.id,{},function(resp){
                self.attemptId =  resp.data.attempt.id;
                self.attempt = resp.data.attempt; 
                self.question = resp.data.questions;
                checkAndRender("AssessmentQuestionObject",{
                        question:resp.data.questions, 
                        attempt:self.attempt,
                        parent:self
                },'jiyo_content_area');
            });
        });    
        trackPage('/quiz/1','Dosha Quiz');  
    },
    defaultRoute:function() {
        if (gAppConfig.path == '/user/insights') {
            checkAndRender("ProfileInsightsPanel",paramObj,"jiyo_content_area");
        } else {
            this.navigate("#discover",{trigger:true});
        }
    }
});


 
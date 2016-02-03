var ProfileRouteController = Backbone.Router.extend({
    routes: {
        "connections" : "loadConnections",
        "friendRequest" :"friendRequest",
		"wellBeingStory":"loadWellBeingStory",
        "insights":"loadInsights",
        "activity":"loadActivity", 
        "*path":"loadActivity",
    },
  
    loadActivity : function(){
        checkAndRender("ProfileActivityPanel",paramObj, "jiyo_content_area" ); 
        $("#profile_tab_buttons a").removeClass('active');
        $("#btnActivity").addClass('active');
    },
    loadConnections : function(){
        paramObj.activeTab = "connections"
        checkAndRender("ProfileConnectionsPanel",paramObj, "jiyo_content_area" );
        $("#profile_tab_buttons a").removeClass('active');
        $("#btnFriends").addClass('active');
    },
    loadInsights:function(){
        checkAndRender("ProfileInsightsPanel",paramObj, "jiyo_content_area" );
        $("#profile_tab_buttons a").removeClass('active');    
        $("#btnInsights").addClass('active');
    },
    friendRequest:function(){
        paramObj.activeTab = "FriendRequest"
        checkAndRender("ProfileConnectionsPanel",paramObj , "jiyo_content_area" );
         $("#profile_tab_buttons a").removeClass('active');
        $('#btnFriends').addClass('active');
 
    },
    loadWellBeingStory:function(){
        paramObj.activeTab = "wellBeingStory"
        checkAndRender("ProfileStoryPanel",paramObj , "jiyo_content_area" );
        $("#profile_tab_buttons a").removeClass('active');  
        $('#btnwellBeingStory').addClass('active');
    }  
});
    
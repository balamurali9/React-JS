var UniversalSearchAssist = React.createClass({
  componentDidMount:function() {   
    var peopleCount = 0;
    var articleCount = 0;
         // applied typeahead to the text input box
    $('#navbar_univesal_search input.form-control').typeahead(
        {
          hint: false,
          highlight: true,
          minLength: 1
        },         
        {
            name: 'articles',
            displayKey: 'article',
            source: function(query, cb) {
                if(($('#search_param').val()).toLowerCase() == 'article' || ($('#search_param').val()).toLowerCase() == 'all') {
                    Api.getData('/community/article-search',{q:query},function(response){
                     articleCount =response.data.length;
                     cb(response.data);

                   });
                }
            },
            templates: {
              empty: [
                      '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">',
                      "Sorry, we can't find what you're looking for.",
                      '</div>'
              ].join('\n'),
              header: function() {
                 return '<div class="tt-header clearfix"><div  class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="fontstyleNormal14"><img src="/assets/img/svg/search-article_activ.svg" width="24" height="24" style="margin-top:-5px"/><h4 style="display: inline-flex; padding-left: 10px; vertical-align: middle;">Articles</h4><hr style="margin:0;"></hr></div></div></div>';
              },
              footer:function(){
                return "<div class=\"clearfix\" ></div>"
              },
              suggestion: _.template(
                 '<div class="clearfix" ><div class="col-sm-12 pull-right ttsuggestion"><div class="media" style="margin-top:10px;">'+
      '<a class="media-left media-middle" href="#"><img class="img-cirlce" src="{{author_image}}" width="30" height="30"/></a>'+
      '<div class="media-body"><div class="author_name fontstyle2 media-top pointer"><div>{{title}}</div>By: {{author_name}}</div></div></div></div></div>')              
              }
        },
        {
            name: 'people',
            displayKey: 'name',
            source: function(query, cb) {
                if(($('#search_param').val()).toLowerCase() == 'people' || ($('#search_param').val()).toLowerCase() == 'all') {
                    Api.getData('/community/user-search',{q:query},function(response){
                      peopleCount=response.data.length;
                      cb(response.data);

                    });
                }
            },
            updater: function(item){
              if($('a.hc').filter(function(index) { return $(this).text() === item; })){
                
              }
            },
            templates: {      
              empty: [
                      '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">',
                      "We don't have anyone by that name as yet.",
                      '</div>'
              ].join('\n'),
              header : function() {
                return  '<div class="tt-header clearfix"><div  class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="fontstyleNormal14"><img src="/assets/img/svg/search-people_activ.svg" width="24" height="24" style="margin-top:-5px"/><h4 style="display: inline-flex; padding-left: 10px; vertical-align: middle;">People</h4><hr style="margin:0;"></hr></div></div></div>'
              },
              footer:function(){
                return '<div class="clearfix" ><div class="height20"></div></div>'
              }, 
              suggestion: _.template(
                    '<div class="clearfix"><div class="col-sm-12 pull-right ttsuggestion"><div class="media" style="margin-top:10px;">'+
      '<a class="media-left  media-middle" href="#"><img class="img-cirlce" src="{{profile_image_url}}" width="30" height="30"/></a>'+
      '<div class="media-body" style="vertical-align: middle;">'+
      '<div class="display_name fontstyle2 media-top">'+
      '<div class="pointer">{{display_name}}</div></div></div></div></div></div>')
              }
            }
    ); 
    $('#navbar_univesal_search input.form-control').bind('typeahead:selected', function(obj, datum, name) { 
      if (name == "articles") {

      document.location.href = datum.url;
      } else {

      document.location.href = "/user/profile/"+datum.id; 

      }
    });
  },
  render:function(){
  	
    return (
	<div className="input-group input-group-sm input-group-xs searchToggle" style={{width:"100%"}}>
	  <input type="text" style={{height:"34px"}} name="q" id="header_search_bar" className="form-control" autocomplete="off" spellcheck="false" placeholder="Search" aria-describedby="sizing-addon3" />
	</div>
 
      );
  }
});
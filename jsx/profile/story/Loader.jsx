var ProfileStoryLoader = React.createClass({
	mixins:[ServerPostMixin],
	getInitialState:function(){
		return {
			storyList:null,
			page:0,
			loadedCount:0,
			noMoreData:false
		}
	}, 
	getDefaultProps : function() {
		return {
			url:"/story/list/DRAFT",
			type:"DRAFT",
			emptyText:"No stories in Draft."
		}
	},
	tileLoaded :function(){
	var self = this;
		this.state.loadedCount++;
		console.log( this.props.type ,' tile loaded', this.state.loadedCount, " - ", this.state.storyList.length);
		if (this.state.storyList.length > this.state.loadedCount) {
			return;
		}
		console.log('Re rendering masonry for : ',this.props.type);
		$('#storyFeed-'+self.props.type).masonry({
			itemSelector:".storyCard" ,  
			isFitWidth:true})
		$('#storyFeed-'+self.props.type+" .storyCard").removeClass('invisible');
	},
    loadStoryList:function(){
	    var self = this;
		var page = self.state.page;
		
		self.state.storyList = [];

		self.state.loadedCount = 0;
		 
	    Api.getData(self.props.url,{},function(response){ 	
	    	var storyList = [];
			for(var idx = 0;idx < response.data.length;idx++) {
				var story = response.data[idx];
			 	storyList.push((<ProfileStoryCard onTileLoad={self.tileLoaded} story={story}  />));
	      } 
	    console.log('List ',self.props.type, storyList);
		self.setState({storyList:storyList});
	   
		});
    },
	componentDidMount:function(){
		var self = this;
		JiyoEvent.subscribe('reload_stories',function(type){

			if (type == self.props.type) {
				$('#storyFeed-'+self.props.type).masonry('destroy');
				self.setState({storyList:null},function(){
					self.loadStoryList();	
				});
				
			}
		});
		JiyoEvent.subscribe('forcelayout_stories',function(type){
			if (self.state.storyList == null || self.state.storyList.length == 0) {
				return;
			}
			console.log('running layout');
			//if (type == self.props.type) {
				 $('#storyFeed-'+self.props.type).masonry({
					itemSelector:".storyCard" , 
					isFitWidth:true});
			//}
		});
		self.loadStoryList();
    },
    render:function(){
		var self  = this;
		if (self.state.storyList == null) {
			  return (<div className="text-center loading-container"><LoadingIcon /></div>);
		}
		var emptyMessage = '';
		if(self.state.storyList.length == 0) {
			emptyMessage = (<div className="jumbotron"><h4>{self.props.emptyText}</h4></div>);
		}
		if (self.state.storyList.length > 0 ){
			$('#storyFeed-'+self.props.type).masonry({itemSelector:".storyCard" , columnWidth:300 , isFitWidth:true})
		}
		return (
			<div id={"storyFeed-"+this.props.type} style={{'margin':'auto'}}>
				{emptyMessage}
				{self.state.storyList}
			</div>
		);
  }
});
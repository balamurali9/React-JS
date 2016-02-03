var JiyoPlusChannelLoader = React.createClass({
	getInitialState:function(){
		return {
			channelList:[],
			noMoreData:false
		}
	}, 
    loadChannelsList:function(){
    var self = this;
    Api.getData('/content/channels/',{},function(response){ 
		for(var idx = 0;idx < response.data.length;idx++) {
        var item = response.data[idx];
        var react = (
          <JiyoPlusChannelCard channel={item} />
        );
        self.state.channelList.push(react);
      } 
	  self.setState({channelsList:self.state.channelsList});

      if (response.data.length == 0) {
        self.state.noMoreData = true;
      }
		//$('.animate-panel').animatePanel();
    });
  },
  componentDidMount:function(){
    var self = this;
	self.loadChannelsList();
  },
  render:function(){
	var self  = this;
	if(self.state.channelList.length == 0) {
		return (<LoadingIndicator />);
	}
    return (
    	<div>
		<div id="jiyoplusChannelContainer">
			{self.state.channelList}
		</div>
		<JiyoPlusChannelPopup />
		</div>
	);
  }
});


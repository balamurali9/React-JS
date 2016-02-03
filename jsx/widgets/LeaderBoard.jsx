var CommunityLeaderBoard = React.createClass({
    getInitialState:function(){
        return {
            loading:true,
            userList:[],
            timeFilter:'hr_24'
        };
    },
    renderUser:function(user) {
      
        return (   <div className="clearfix" style={{padding:"8px;4px;","border-bottom":"solid 1px #eee"}}>
                <img alt="logo" className="img-circle img-small pull-left" style={
                    {width:"50px",height:"50px","margin-right":"10px"}} src={user.image} />
                <div className="m-t-sm pull-left">
                    <strong><a target="_blank" href={"/user/profile/"+user.id}>{user.display_name}</a></strong> 
                    <p>{user.completed  }</p>
                </div>
        </div>);
    },
    renderInfo:function(){
        return (   <div className="col-md-3">
                <div className="hpanel hbgred">
                    <div className="panel-body">
                        <div className="text-center">
                            <h3>Title text</h3>
                            <p className="text-big font-light">
                                0,43
                            </p>
                            <small>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            </small>
                        </div>
                    </div>
                </div>
            </div>);
    },
    componentDidMount:function(){
        this.handleFilter(this.state.timeFilter);
    },  
    handleFilter:function(val) {
        var self = this;
        this.state.timeFilter = val;
        this.setState({loading:true})
        Api.getData(this.props.dataSource+"/"+self.state.timeFilter,{},function(resp){
            if (resp.meta.title) {
                self.props.title = resp.meta.title;
            }
            self.setState({
                userList:resp.data,
                timeFilter:val,
                loading:false
            });
        })
    },
    render:function() { 
        
         
        var list = [];
        var self = this;
        this.state.userList.forEach(function(item){
            list.push(self.renderUser(item));
        });

        var buttons = [];

        var buttonMap = {
            // today:'Today',
            hr_24:'24 Hours',
            yesterday:'Yesterday',
            last_7:"7 Days",
            allTime:'All Time'
        }
        var loading =null;
        if (this.state.loading) {
            loading = <LoadingIcon />;
        }
 
        return (
        <div className="panel panel-success">
            <div className="panel-heading">
                <h5>{this.props.title} <div className="pull-right">{loading}</div></h5> 
            </div>
            <div className="panel-content">
                <div className="clearfix">
                    <div className="pull-right" style={{margin:"4px"}}>
                       <ButtonSelectionMap buttonMap={buttonMap} 
                       selected={this.state.timeFilter} 
                       handleClick={this.handleFilter}
                       />
                    </div>
                </div>
                <div className="clearfix">
                    {list}
                </div>
            </div>
        </div>)
    }
});
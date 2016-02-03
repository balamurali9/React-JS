/** @jsx React.DOM */ 
var sync = Backbone.sync;
Backbone.sync = function(method, model, options) {
  options.beforeSend = function (xhr) {
    xhr.setRequestHeader('X-XSRF-TOKEN', gAppConfig.EncToken); 
  }; 
  sync(method, model, options);
};

var EditableRowMixin  = {
    handleFormSubmit:function(data){
        this.props.parent.handleFormSubmit(data,this.props.model);
    },
    prepareEdit: function() {  
        this.props.parent.showModal(this.handleFormSubmit,this.props.model); 
    },
    deleteItem : function() {
        var res = confirm('Do you really Want to Delete');
        if (!res) {
            return;
        } 
        this.props.model.destroy({
            error:function(){
                alert('Error While Deleting');
            }
        });   
    },
};

var EditableCollectionMixin= {
    getInitialState : function(){
        return {
            collection :null
        }
    },
    getDefaultProps:function(){
        return {
            submitHandler:this.handleFormSubmit
        }
    },
    setData:function() {

    },
    showModal : function(handler,model){  

        this.props.submitHandler = handler;
        this.editModalRef.props.handleFormSubmit = handler;
        var state = this.state;
        for(var key in state.errors){
            state.errors[key] = null;
        } 
        for(var key in state.obj) {
            state.obj[key] = null;
        }

        if (model) {
            for(var key in state.obj) {
                state.obj[key] = model.get(key);
            }
        } 
        console.log('Object Status :',state.obj,' , Model : ',model);
        this.setState(state);
        $("#edit_modal").modal('show');
    }, 
    handleFormSubmit : function(data,model) {
        var self = this; 
        var state = self.state;
        for(var key in state.errors){
            state.errors[key] = null;
        } 

        if (model) {
            for(var key in data) {
                model.set(key,data[key]);
                state.obj[key] = data[key];
            }
        } else { 
            if (data.id == '') {
                delete data.id;
            }
            model = self.state.collection.add(data);     
        }   


        state.obj = data;
        self.setState(state);

        model.save(null,{ 
            success:function(model,resp){  
                if (resp.success) { 
                    $("#edit_modal").modal('hide');
                } else { 
                    for(var key in resp.data) {
                        var err = resp.data[key].join(',');
                        state.errors[key] = err;
                    } 
                }
                self.state.collection.fetch(); 
            },
            error : function(resp){ 
                alert('Error While saving the data'); 
                $("#edit_modal").modal('hide');
            }
        });
 
        return false;
    },
    componentDidMount:function(){
        var self = this;  

        var col = this.props.collection;  
        col.on('sync',function(){ 
            console.log('Calling collection');
            self.setState({collection:col});  
            self.forceUpdate(); 
          
        }); 

        // col.on('change',function(){
        //     console.log('Change Called');
        //     self.forceUpdate();
        // }); 

        col.on('destroy',function(){
            self.forceUpdate();
        }); 
        col.fetch({error:function(){
            alert('Unknown Error occured plz reload');
        }});
    },
    renderTable : function(title,headers) {
        var self = this;
        self.prepareEditModal();
        var rows = null;
        if (self.state.collection ) {
            var rows = [];
            var idx = 0;
            self.state.collection.forEach(function(item){
                rows.push(self.getRow(++idx,item)); 
            }); 
        }  
        return (
            <div>
                <PanelTable title={title} rows={rows} headers={headers} addHandler={this.handleAddClick}/>
               {self.editModalRef}
            </div>
        );
    }
};

var JiyoDataCollection = Backbone.Collection.extend({
    parse:function(response){
        if (!response.success) {
            alert('An un expected error occured while fetching collection data');
        }
        return response.data;
    }
});

var GenericAutoComplete = React.createClass({
    getDefaultProps:function(){
        return {
            displayKey:'display_text'
        };
    },
    componentWillMount : function(){
        this.componentId  =  this.props.name+"_"+(new Date().getTime())+"_"+Math.floor(Math.random()*100000);  
    }, 
    handleProps:function(props){  
        var self = this;  
        if (props.val){ 
            $("#"+self.componentId+" .hiddenId").val(props.val); 
            $("#"+self.componentId+" .searchbox").val(props.text);
        } else {

            $("#"+self.componentId+" .hiddenId").val(''); 
            $("#"+self.componentId+" .searchbox").val('');
        }
    },
    componentWillReceiveProps:function(newProps) {
        this.handleProps(newProps);
    }, 
    clearInput:function() {

        $("#"+this.componentId+" .hiddenId").val(''); 
        $("#"+this.componentId+" .searchbox").val('');
    },
    
    componentDidMount:function() { 
        var self = this;
        function fetchData(query,cb) {
          Api.getData(self.props.endPoint,{q:query},function(response){
            cb(response.data);
          });
        } 
        var self = this;
        var searchbox = "#"+self.componentId+" input.searchbox";
        $(searchbox).typeahead({
          hint: true,
          highlight: true,
          minLength: 1
        },
        {
          name: 'name',
          displayKey: self.props.displayKey,
          source: fetchData
        });

        $(searchbox).bind('typeahead:selected', function(obj, datum, name) {  
            $("#"+self.componentId+" .hiddenId").val(datum.id); 
            if (self.props.onSelect){
                self.props.onSelect(datum);
            }

        }); 
        this.handleProps(this.props)
    },
    render:function(){  
        var p = this.props;
        var cls = 'hidden'
        if (p.errorMsg && p.errorMsg != '') {
            cls = "text-danger";
        } else {
            p.errorMsg = '';
        } 
        return ( 
            <div id={this.componentId}  className="form-group ">
                <label className="control-label" 
                    htmlFor={p.name}>{p.label}</label> 
                <div className="input-group"> 
                    <input type="text" className="input-sm form-control searchbox" placeholder={p.label}/>
                    <input type="hidden" name={p.name} className="hiddenId" />   
                    <span className="input-group-btn">
                       <button onClick={this.clearInput} type="button" className=" btn btn-sm btn-warning"  >&times;</button>
                    </span>
                </div>
                 <div className={cls} >{p.errorMsg}</div>
            </div>
        );
    }
}); 

var ManageStageComponent = React.createClass({
    stopEvent:function(event) {
        event.preventDefault();
        event.stopPropagation(); 
        return false;
    },
    getInitialState:function(){
        return {
            messageSuccess:null,
            messageError:null, 
            obj : {
                row1_article0:null,
                row1_article1:null,
                row1_article2:null,
                row2_article0:null,
                row2_article1:null,
                row2_article2:null,
                row2_article3:null, 
                row1_article0_title:null,
                row1_article1_title:null,
                row1_article2_title:null,
                row2_article0_title:null,
                row2_article1_title:null,
                row2_article2_title:null,
                row2_article3_title:null,
            },
            errors : {
                row1_article0:null,
                row1_article1:null,
                row1_article2:null,
                row2_article0:null,
                row2_article1:null,
                row2_article2:null,
                row2_article3:null,
            }
        }
        
    },
    setConfigData:function(config){
        var self = this;
        var state = self.state;
        for(var key in state.errors) {
            state.errors[key] = null;
        } 

        var data = $.parseJSON(config.json_data);
        console.log(data);
        var obj = {};

        for(var idx = 0;idx < data.row1.length;idx++) {
            obj['row1_article'+idx] = data.row1[idx].id;
            obj['row1_article'+idx+"_title"] = data.row1[idx].title;
        }

        for(var idx = 0;idx < data.row2.length;idx++) {
            obj['row2_article'+idx] = data.row2[idx].id;
            obj['row2_article'+idx+"_title"] = data.row2[idx].title;
        }
        state.obj = obj;
        self.setState(state);
        console.log(state);

    },
    handleFormSubmit:function(event) {
        var obj = $("#configSaverForm").serializeToObject();
        console.log(obj);
        var self = this;
        var state = self.state; 
        self.setState({
            messageSuccess:null,
            messageError : null
        });
        Api.postData('/backend/meta/save-stage-config',obj,function(response){
            if (response.success) { 
                self.setState({
                    messageSuccess:response.message,
                    messageError : null
                });
                self.setConfigData(response.data); 
            } else { 
                state.errors = response.data;
                state.messageSuccess = null;
                state.messageError = response.message; 
                self.setState(state)
            }
        });
        this.stopEvent(event);
    },
    componentDidMount:function(){
        var self = this;
        Api.getData('/backend/meta/config-value',{key_name : this.props.stageKey},function(response){
            if (!response.data) {
                return;
            }
            self.setConfigData(response.data);
        });
    },
    render:function() {

        var alertClass = 'alert alert-primary';
        var panelClass = 'panel panel-default';
        if (this.props.stageKey == 'jiyoStage.production' ) {
            alertClass = 'alert alert-success';
            panelClass = 'panel panel-primary';
        }
        console.log(this.props);
        var errors = this.state.errors;
        var obj = this.state.obj;
        console.log(errors);
        var stateMessage = null;
        if (this.state.messageError) {
            stateMessage = (<div className="alert alert-danger form-alert-message">{this.state.messageError}</div>)
        } else if (this.state.messageSuccess) {
            stateMessage = (<div className="alert alert-success form-alert-message">{this.state.messageSuccess}</div>)
        }
        return (
            <form id="configSaverForm" onSubmit={this.handleFormSubmit}>
              
                <div className={alertClass} role="alert">
                   <b style={{'font-size':'24px'}}>{this.props.title}</b>
                </div>
                <input type="hidden" name="key_name" value={this.props.stageKey} />
                {stateMessage}
                <div className={panelClass} >
                    <div className="panel-heading">
                        Starge Row 1
                    </div>
                    <div className="panel-body">
                        <GenericAutoComplete endPoint='/backend/meta/article-search/' label="First Article"  
                            name="row1_article0" 
                            errorMsg={errors.row1_article0} 
                            val={obj.row1_article0}
                            text={obj.row1_article0_title} />
                        <GenericAutoComplete endPoint='/backend/meta/article-search/' label="Second Article" 
                            name="row1_article1"  
                            errorMsg={errors.row1_article1} 
                            val={obj.row1_article1}
                            text={obj.row1_article1_title} />
                        <GenericAutoComplete endPoint='/backend/meta/article-search/' label="Third Article"  
                            name="row1_article2"  
                            errorMsg={errors.row1_article2} 
                            val={obj.row1_article2}
                            text={obj.row1_article2_title} />
                    </div>
                </div>


                <div className={panelClass} >
                    <div className="panel-heading">
                        Starge Row 2
                    </div>
                    <div className="panel-body">
                        <GenericAutoComplete endPoint='/backend/meta/article-search/' label="First Article"  
                            name="row2_article0"  
                            errorMsg={errors.row2_article0} 
                            val={obj.row2_article0}
                            text={obj.row2_article0_title} />
                        <GenericAutoComplete endPoint='/backend/meta/article-search/' label="Second Article" 
                            name="row2_article1"  
                            errorMsg={errors.row2_article1} 
                            val={obj.row2_article1}
                            text={obj.row2_article1_title} />
                        <GenericAutoComplete endPoint='/backend/meta/article-search/' label="Third Article"  
                            name="row2_article2"  
                            errorMsg={errors.row2_article2} 
                            val={obj.row2_article2}
                            text={obj.row2_article2_title} />
                        <GenericAutoComplete endPoint='/backend/meta/article-search/' label="Forth Article"  
                            name="row2_article3"  
                            errorMsg={errors.row2_article3} 
                            val={obj.row2_article3}
                            text={obj.row2_article3_title} /> 
                    </div>
                </div>
                <button className="btn btn-primary" >Save Chagnes</button>
            </form>
        );
    }
});
 

var UserManagementComponet = React.createClass({
    getInitialState:function(){
        return {
            user:null
        }
    },  
    activateUser:function(){
        var self = this;
        Api.postData('/backend/manage/activate-user',{user_id:this.state.user.id},function(response){
            console.log(response);

            self.setState({user:response.data});
        })
    },
    blockUser:function() {
        var self = this;
        Api.postData('/backend/manage/block-user',{user_id:this.state.user.id},function(response){
            console.log(response);
            self.setState({user:response.data});
        })
    },
    selectHandler:function(data){ 
        console.log(data);
        this.setState({user:data});
    },
    editUser:function(){

    },
    renderUserBlock:function(){
        if (this.state.user == null) {
            return null;
        }
        var user = this.state.user;
        var btns = [];
            if (user.status == 1) {
                btns.push( (<button className="btn btn-danger btn-sm" onClick={this.blockUser}>Block</button>));
            } else {
                btns.push( (<button className="btn btn-warning btn-sm"  onClick={this.activateUser}>Activate</button>) );
            }
       
           
        
        return (
            <table className="table table-striped">

                <tr><td>id</td><td>{user.id}</td></tr>
                <tr><td>Name</td><td>{user.display_name}</td></tr>
                <tr><td>Pic</td><td><img src={"/page/p/"+user.id+"/W_50"} style={{width:"50px"}}/></td></tr>
                <tr><td>Email</td><td>{user.email}</td></tr>
                <tr><td>Status</td><td>{user.status}</td></tr>
                <tr><td>Device UUID</td><td>{user.device_uuid}</td></tr>
                <tr><td colSpan="2">
                {btns}
                <button className="btn btn-primary btn-sm" onClick={this.editUser} >Edit</button>
                </td></tr>
            </table>
        )
    },
    render : function(){
        return (
            <div>
                <h1>Manage Users</h1>
                <GenericAutoComplete endPoint="/backend/meta/user-search" displayKey='display_name' onSelect={this.selectHandler}/>
                {this.renderUserBlock()}
            </div>
        )
    }
});



var BackendManagement = React.createClass({
    getInitialState:function(){
        return {
            data:[  
            ],
            message:''
        };
    },
    loadStats:function(){
        var self = this;
        Api.getData('/backend/meta/status/',{},function(resp){
            self.setState({
                data:resp.data
            })
        });
    },
    componentDidMount:function(){
       this.loadStats();
       this.loadUserGrowth();

        $(window).resize(function(){
            self.renderCharts();
        });
    },
    renderCharts:function(){
        var table = [['Date','Growth']];
        var data = this.state.userGrowthData;

        for(var idx = 0;idx < data.length;idx++) {
            var item = data[idx];
            table.push( [ 
                item.day,
                item.totalUsers
            ]);
        }

        var data = new google.visualization.arrayToDataTable(table);
        var options = { 
          chart: {
            title: 'User Growth',
             
          },
          legend: { position: 'none' },
          series: {
            0: { axis: 'date' }, // Bind series 0 to an axis named 'distance'.
            1: { axis: 'count' } // Bind series 1 to an axis named 'brightness'.
          },
          axes: {
            y: {
              date: {label: 'count'}, // Left y-axis.
              count: {side: 'right'} // Right y-axis.
            }
          }
        };

        var options = { 
          chart: {
            title: 'User Growth',
 
          },
           curveType: 'function',
          legend: { position: 'none' },
        };

        var chart = new google.charts.Line(document.getElementById('chart_container'));
        chart.draw(data, options);
    },
    loadUserGrowth:function() {
        var self = this;
        Api.getData('/backend/meta/user-growth',{},function(resp){
            self.state.userGrowthData = resp.data;
            self.renderCharts(); 
        });
    },
    reloadGamification:function(){
        var self = this;
        self.setState({message:'<div class="alert alert-warning">Processing request ...</div>'});
        Api.getData('/backend/meta/sync-gamification/',{},function(resp){
            if (resp.success){
                self.setState({message:resp.data});   
            } else {
                self.setState({message:resp.message}); 
            }
        });
    },
    sendNewsletter:function(){
        var self = this;
        self.setState({message:'<div class="alert alert-warning">Processing request ...</div>'});
        Api.getData('/backend/meta/send-newsletter/',{},function(resp){
            if (resp.success){
                self.setState({message:resp.data});   
            } else {
                self.setState({message:resp.message}); 
            }
        });
    },
    loadData:function(name){
        var self = this;
        self.setState({message:'<div class="alert alert-warning">Processing request ...</div>'});
        Api.getData('/backend/meta/sync-tasks/'+name,{},function(resp){
            if (resp.success){
                self.setState({message:resp.data});   
            } else {
                self.setState({message:resp.data}); 
            }
            self.loadStats();
        });
    },
    removeNotification:function(event){
        console.log('remove not')
        $(event.target).addClass('hidden');
    },
    loadArticles:function(name){
        var self = this;
        self.setState({message:'<div class="alert alert-warning">Processing request ...</div>'});
        Api.getData('/backend/meta/sync-articles/'+name,{},function(resp){
            if (resp.success){
                self.setState({message:resp.data});   
            } else {
                self.setState({message:resp.message}); 
            }
            self.loadStats();
        });
    },  
    reloadChannels:function(){
        var self = this;
        self.setState({message:'<div class="alert alert-warning">Processing request ...</div>'});
        Api.getData('/backend/meta/reload-channels/',{},function(resp){
            if (resp.success){
                self.setState({message:resp.data});   
            } else {
                var str = resp.message;
                if (resp.data) {    
                    str += resp.data;
                }
                self.setState({message:str}); 
            }
            self.loadStats();
        });
    },
    render:function(){

        var blocks = [
        ];
        this.state.data.forEach(function(item){
                blocks.push((
                <div className="col-md-4 text-center" >
                    <div style={{background:item.color,margin:"4px",padding:"10px"}}>
                        <h2>{item.number}</h2>
                        <h4>{item.description}</h4>
                    </div>
                </div>));
        });

        return (<div>
            
            <div className="col-md-9 admin-container">
               <div dangerouslySetInnerHTML={{__html:this.state.message}} onDoubleClick={this.removeNotification} style={{cursor:"pointer"}}></div>
               <div style={{height:"200px"}} className="col-md-12" id="chart_container"></div>
               {blocks}
            </div>
            <div className="col-md-3">

            <div className="panel panel-default ">
                <div className="panel-heading">Newsletter</div>
                <div className="panel-body">
                    <button onClick={this.sendNewsletter.bind(null)}  className="btn btn-default btn-block">Send Newsletter</button>
                </div>
                <div className="panel-heading">Update Tasks</div>
                <div className="panel-body">
                    <button onClick={this.loadData.bind(null,'tasks')} className="btn btn-primary btn-block">Mandanna Tasks</button> 
                    <button onClick={this.loadData.bind(null,'tasks-alyssa')} className="btn btn-primary btn-block">Alyssa Tasks</button> 
                    <button onClick={this.loadData.bind(null,'tasks-sarah')} className="btn btn-primary btn-block">Sarah Tasks</button> 
                    <button onClick={this.loadData.bind(null,'tasks-niran')} className="btn btn-primary btn-block">Niran Tasks</button> 
                </div>
                <div className="panel-heading">Update Articles</div>
                <div className="panel-body">
                    <button onClick={this.loadArticles.bind(null,'greatist')}  className="btn btn-default btn-block">Greatist </button>
                    <button onClick={this.loadArticles.bind(null,'blog')}  className="btn btn-default btn-block">blog.jiyo.com </button>
                    <button onClick={this.loadArticles.bind(null,'chopra')}  className="btn btn-default btn-block">Chopra Center</button>
                    <button onClick={this.loadArticles.bind(null,'sonima')}  className="btn btn-default btn-block">Sonima</button> 
                </div>  
                <div className="panel-heading">Update Gamification</div>
                <div className="panel-body">
                    <button onClick={this.reloadGamification.bind(null,'game')}  className="btn btn-default btn-block">Gamification </button>
                    <button onClick={this.reloadChannels.bind(null,'channels')}  className="btn btn-default btn-block">Channels </button>
                </div>  
                  <div className="panel-heading">Useful Links</div>
                <div className="panel-body">
                    <a href="/test/vimeo" target="_blank" className="btn btn-default btn-block">Vimeo Portfolio List</a>
                 
                </div>  

            </div>
            </div> 
        </div>)
    }
})


/*
Handle Programs
*/ 
var UserManagementRow = React.createClass({
    mixins : [EditableRowMixin], 
    render: function() { 
        var m = this.props.model;   
        if (m == null) {
            return null;
        }
        var btn = (<button className="btn btn-danger btn-sm" onClick={this.blockUser}>Block</button>);
        if (m.get('status') != 1) {
            btn = (<button className="btn btn-warning btn-sm"  onClick={this.activateUser}>Activate</button>);
        }
        return (
            <table className="table table-striped">
                <tr><td>Name</td><td>{m.get('display_name')}</td></tr>
                <tr><td>Email</td><td>{m.get('email')}</td></tr>
                <tr><td>Status</td><td>{m.get('status')}</td></tr>
                <tr><td>Device UUID</td><td>{m.get('device_uuid')}</td></tr>
                <tr><td colSpan="2">{btn}
                 <button className="btn btn-xs btn-primary edit_button" 
                            onClick={this.prepareEdit} >Edit</button>  
                </td></tr>
            </table>
        )
    }
});

var UserManagementComponet1  = React.createClass({  
    mixins :[EditableCollectionMixin],
    getDefaultProps : function(){
        var col = new JiyoDataCollection();
        col.url = "/backend/manage/user";
        return {
            collection: col
        }
    },
    getInitialState : function(){
        return {
            errors:{
                id:null,
                display_name:null,
                email:null, 
                status:null
            },
            obj :{
                id:null,
                display_name:null,
                email:null,
                status:null
            }
        }
    }, 
    selectHandler:function(data){ 
        console.log(data);
        // this.setState({obj:data});
    },
    render:function(){ 
      
        var rows = null;  
        var self = this;
        var errors = self.state.errors;
        
        var obj = self.state.obj;

        var formBody = (
        <div>
            <HtmlFormGroupText name="display_name" label="Name" errorMsg={errors.display_name} val={obj.display_name} />
            <input id="id" name="id" type="hidden" value={obj.id} />
            <HtmlFormGroupText name="email" label="Email" errorMsg={errors.email} val={obj.email} /> 
            <HtmlFormGroupText name="status" label="Status" errorMsg={errors.status} val={obj.status} />  
        </div>
        );
        
        row = 
        self.editModalRef = (<ModalForm title="Manage User" 
            formBody={formBody}  handleFormSubmit={this.props.submitHandler} />);  
        return (
            <div>
                <h1>Manage Users</h1>

                <GenericAutoComplete endPoint="/backend/meta/user-search" displayKey='display_name' onSelect={this.selectHandler}/> 
                {row}
               {self.editModalRef}
            </div>
        );
    }
});

 


var PanelTable = React.createClass({
    render:function() { 
        var headers = [];
        this.props.headers.forEach(function(text){
            headers.push((<th>{text}</th>))
        });

        var content = null;
        if (this.props.rows == null) {
            content = (<img src="/assets/img/loading.gif" />)
        } else if (this.props.rows.length == 0) {
            content = (<div className="panel-body">Empty</div>);
        } else {
            content = (<table className="table table-striped table-hover " style={{"min-width":"800px"}}>
                    <thead>
                      <tr>
                        {headers}
                      </tr>
                    </thead>
                    <tbody > 
                        {this.props.rows}
                    </tbody>
                </table>);
        }
        var filter = null;
        if (this.props.onFilter){
            filter =(<span>
            <input type="text" placeholder="filter" value={this.props.filterText} 
            onChange={this.props.onFilter} className="input-xs" style={{color:"#333"}} />&nbsp;&nbsp;</span>)    
        }
        
        return (<div className="panel panel-primary ">
            <div className="panel-heading">{this.props.title} 
                <div className="pull-right">
                    {filter}
                    <button className="btn btn-xs btn-info" 
                        onClick={this.props.addHandler} >
                        <i className="glyphicon glyphicon-plus"></i>
                    </button>
                </div> 
            </div>
            <div className="panel-content" id="table_container">  
                {content}
            </div>
        </div>);
    }
}); 
var HtmlImageUpload  = React.createClass({
 
    componentWillMount : function(){ 
        this.componentId  = "upload_id_"+(new Date().getTime())+"_"+Math.floor(Math.random()*1000000);  
    },

    handleProps:function(props){ 
        var self = this; 
        if (props.val){ 
            $("#"+self.componentId+" .hiddenId").val(props.val);
            $("#"+self.componentId+" .preview_image").attr('src',"/page/v/"+props.val);
            $("#"+self.componentId+" .preview_image").removeClass('hidden');
        } else {
            $("#"+self.componentId+" .preview_image").addClass('hidden');
        }
    },
        
    componentWillReceiveProps:function(newProps) {
        this.handleProps(newProps);
    },
    
    componentDidMount:function() { 
     
        function fetchData(query,cb) {
          Api.getData('/admin/media-search',{q:query},function(response){
            cb(response.data);
          })
        }

        var self = this;
        var searchbox = "#"+self.componentId+" input.searchbox";
        $(searchbox).typeahead({
          hint: true,
          highlight: true,
          minLength: 1
        },
        {
          name: 'media',
          displayKey: 'original_file_name',
          source: fetchData
        });

        $(searchbox).bind('typeahead:selected', function(obj, datum, name) {  
            $("#"+self.componentId+" .hiddenId").val(datum.id);
            $("#"+self.componentId+" .preview_image").attr('src',"/page/v/"+datum.id);
            $("#"+self.componentId+" .preview_image").removeClass('hidden');
        });

        $("#"+self.componentId+" .file-input").fileupload({
            url: '/admin/upload?_token='+gCSRFToken ,  
            dataType: 'json',
            done: function (e, resp,what) {
                var id = resp.result.data.id
                $("#"+self.componentId+" .hiddenId").val(id);
                $("#"+self.componentId+" .preview_image").attr('src',"/page/v/"+id);
                $("#"+self.componentId+" .preview_image").removeClass('hidden');
            },
            start:function(){ 
            },
        }).prop('disabled', !$.support.fileInput)
            .parent()
            .addClass($.support.fileInput ? undefined : 'disabled');  
        this.handleProps(this.props)
    },
    render:function(){  
        var p = this.props;
        return ( 
            <div id={this.componentId}  className="image_upload_button form-group">
                <label className="control-label" 
                htmlFor={p.name}>{p.label}</label>
                <div>
                    <img className="preview_image hidden"  />  
                </div>
                <div  className="input-group">
                  <input type="text" className="input-sm form-control searchbox" placeholder={p.label}/>
                  <input type="hidden" name={p.name} className="hiddenId" />
                  <span className="input-group-btn">
                        <label className="btn btn-sm btn-primary">{p.label}
                            <input className="file-input"  type="file"  name="media" />
                        </label> 
                  </span>
                </div>  
            </div>
        );
    }
});
var FromArticleAutoComplete = React.createClass({
    render:function(){
        return <div></div>
    }
});
var HtmlPanel = React.createClass({
    render:function() {  
        return (<div className="panel panel-primary ">
            <div className="panel-heading">{this.props.title}</div>
            <div className="panel-content clearfix" id="table_container">  
                {this.props.content}
            </div>
        </div>);
    }
});
var ManageModal = React.createClass({
    handleFormSubmit : function(event){
        event.stopPropagation();
        event.preventDefault();
        var data = $("#create_edit_form").serializeToObject(); 
        $("#error_message").addClass('hidden');  
        return this.props.handleFormSubmit(data);;
        
    },
    closeModal : function (event) { 
        $(event.target).parents('.modal').modal('hide');
    },
    render:function(){
        return (
        <div id="edit_modal" className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content modal-lg">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" 
                    aria-hidden="true">&times;</button>
                  <h4 className="modal-title">{this.props.title}</h4>
                </div>
                <div className="modal-body">
                </div>
              </div>
            </div>
        </div>);
    }
});

var ModalForm = React.createClass({

    handleFormSubmit : function(event){
        event.stopPropagation();
        event.preventDefault();
        var data = $("#create_edit_form").serializeToObject(); 
        $("#error_message").addClass('hidden'); 
        return this.props.handleFormSubmit(data);;
    },
    setSubmitHandler : function(handler){
        this.props.handleFormSubmit = handler
    },
    closeModal : function (event) { 
        $(event.target).parents('.modal').modal('hide');
    },
    render:function(){
        return (
        <div id="edit_modal" className="modal fade">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <button type="button" className="close" data-dismiss="modal" 
                    aria-hidden="true">&times;</button>
                  <h4 className="modal-title">{this.props.title}</h4>
                </div>
                <form className="modal-body" id="create_edit_form" 
                    onSubmit={this.handleFormSubmit} action="#"> 
                    {this.props.formBody}   
                    <div className="clearfix">
                      <div className="text-danger  hidden"  
                        id="error_message" ></div>
                      <button className="btn btn-sm btn-primary pull-right" 
                        type="submit" >Submit</button>
                      <button className="btn btn-sm btn-default pull-right"  
                        type="button" onClick={this.closeModal}>Cancel</button>
                    </div>
                </form>
              </div>
            </div>
        </div>);
    }
});

var HtmlListGroup = React.createClass({
 
    render :function(){
        var items = [];
        var self = this;
        this.props.items.forEach(function(item){
            var url = self.props.baseUrl+item.id;
            items.push( (<a href={url} className="list-group-item">
            <h4 className="list-group-item-heading">{item.title}</h4>
            <p className="list-group-item-text">{item.description}</p>
          </a>));
        });
        return  (<div className="list-group">
            {items}
        </div>);
    }
});


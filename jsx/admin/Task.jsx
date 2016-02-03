
/**
 * Handle  Tasks
 */ 
var TaskRow = React.createClass({
    mixins:[EditableRowMixin], 
    render: function() { 
        var m = this.props.model; 
        var manageVariants = "/admin/task-variants/"+m.get('id');
        var manageImpacts = "/admin/task-impacts/"+m.get('id');

        var articleLink = (<b>No Article</b>);
        if (m.get('article_id') > 0) {
            articleLink = (
                <a target="_blank" href={ "/jiyo/article/"+m.get('article_id')}><b>View Article</b></a>
            );
        }

        var status = <div className="label-success label">ACTIVE</div>
        if (m.get('status') == 'INACTIVE') {
            status = <div className="label-warning label">INACTIVE</div>
        }

        return ( 
             <tr>
                <td>{this.props.index}</td>
                <td>{"Title : "+m.get('title')} <br/>
                Icon: <img style={{"height":"24px"}} src={m.get('categoryInfo').image} /> <br/>
                {"Push Message : "} <b>{ m.get('push_message') } </b><br/>
                {"Category : " }<b>{ m.get('category') }</b><br/>
                {"Description : " +m.get('description') } <br/>

                {"ref : " +m.get('ext_source') } <br/>
                </td>
                <td className="col-md-2"> 
                {"TaskId: "+m.get('id') }<br/>
                {"Response: "+m.get('response_type') }<br/>
                { m.get('allowed_start_time') } <b> to </b>
                { m.get('allowed_end_time') }<br/>                  
                {"Zone : " + m.get('allowed_zone') }<br/>   
                { m.get('status') }<br/>  
                {articleLink} <br/>
                {status}
                </td> 
                <td className="col-md-2">
                    <div className="table-btn-group">
                        <button className="btn btn-xs btn-primary hidden btn-block edit_button" 
                            onClick={this.prepareEdit} >Edit</button>   
                           <a className="btn btn-xs btn-primary  btn-block"  href={manageVariants}>Varaiants</a>
                            <a className="btn btn-xs btn-default  btn-block"  href={manageImpacts}>Impacts</a>
                        <button className="btn btn-xs btn-danger hidden  btn-block" 
                            onClick={this.deleteItem} >Delete</button>  
                    </div>
                </td>
            </tr>
        );
    }
});
var TaskTable  = React.createClass({ 
    mixins :[EditableCollectionMixin],
    getDefaultProps : function(){
        var col = new JiyoDataCollection();
        return {
            collection: col,
            facets:[],
        }
    },
    getInitialState:function(){
        return { 
            filterText:'',
            errors:{
                id:null,
                title:null,
                description:null,
                push_message:null,
                response_type:null,
                article_id:null,
                response_mode:null,
                article_id:null,
                ref_article_title:null,
                allowed_end_time:null,
                allowed_start_time:null,
                allowed_zone:null,
                status:null
            },
            obj:{
                id:null,
                title:null,
                description:null,
                push_message:null,
                response_type:null,  
                article_id:null,
                response_mode:null,
                allowed_zone:null,
                allowed_start_time:null,
                allowed_end_time:null,
                article_id:null,
                ref_article_title:null,
                status:null
            }
        };
    },
    handleAddClick : function() {  
        this.showModal(this.handleFormSubmit);
    },
    componentWillMount:function(){
        this.props.collection.url = '/backend/tasks/task/' ;
    },
    componentDidMount:function(){
        var self = this;
    },
    filter:function(event) {
        this.setState({filterText:event.target.value})
    },
    render:function(){ 
      
        var rows = null;
        var self = this;
       
        var itemList = {};
        

        var typeList = {};
        var modeList = {};

        this.props.feedbackModes.forEach(function(item){
              modeList[item.id] =
            (<HtmlFormSelectOption label={item.name} value={item.id}/>);
        });


        this.props.feedbackTypes.forEach(function(item){
              typeList[item.id] =
            (<HtmlFormSelectOption label={item.name} value={item.id}/>);
        });

        var obj = self.state.obj;
        var errors = {};
        var formBody = (
        <div>
            <input id="id" name="id" type="hidden" value={obj.id} />
            <input id="program_id" name="program_id" type="hidden"  value={this.props.program_id} />
            <HtmlFormGroupText name="title" label="Title"  val={obj.title}/>
            <HtmlFormGroupTextArea name="description" label="Description" val={obj.description} /> 
            <HtmlFormGroupTextArea name="push_message" label="Push Message" val={obj.push_message} /> 
            <HtmlFormSelect name="program_facet_id" label=" Facet" items={itemList} val={obj.program_facet_id}   />

            <HtmlFormSelect name="response_type" label="What feedback to collect on Task completion" items={typeList} val={obj.response_type}   />
            <HtmlFormSelect name="response_mode" label="How to collect feedback for task" items={modeList} val={obj.response_mode}   />

            
             <GenericAutoComplete endPoint='/backend/meta/article-search/' 
                            label="Associate an article with the task ?"  
                            name="article_id" 
                            errorMsg={errors.article_id} 
                            val={obj.article_id}
                            text={obj.ref_article_title} />

        </div>
        );
        self.editModalRef = (<ModalForm title="Manage Tasks" 
                formBody={formBody} handleFormSubmit={this.props.submitHandler}  />); 
    
        if (self.state.collection) {
            rows = [];
            var idx = 0;
            var filter = this.state.filterText.toLowerCase();
            self.state.collection.forEach(function(item){
                if (item.get('title').toLowerCase().indexOf(filter) >= 0) {
                    rows.push(<TaskRow model={item} index={++idx} 
                    parent={self} />);
                } else  if (item.get('push_message').toLowerCase().indexOf(filter) >= 0) {
                    rows.push(<TaskRow model={item} index={++idx} 
                    parent={self} />);
                } else  if (item.get('category').toLowerCase().indexOf(filter) >= 0) {
                    rows.push(<TaskRow model={item} index={++idx} 
                    parent={self} />);
                }
                
            });
        }

        var title =  (<span>Tasks - {idx}</span>);

        return (
            <div>
                <PanelTable title={title} onFilter={this.filter} filterText={this.state.filterText} rows={rows} headers={[
                    "#",
                    "Text",  
                    "Info", 
                    "Actions"
                ]} addHandler={this.handleAddClick}/>
               {self.editModalRef}
            </div>
        );
    }
});
 
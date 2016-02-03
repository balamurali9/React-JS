
/*
Handle Programs
*/ 
var ProgramsRow = React.createClass({
    mixins : [EditableRowMixin], 
    render: function() { 
        var m = this.props.model; 

        var aurl ="/admin/program-facets/"+m.get('id');
        var furl = "/admin/program-tasks/"+m.get('id'); 

        var bucketList = [];

        this.props.buckets.forEach(function(item){
            var url = "/admin/program-schedule/"+m.get('id')+"/"+item.id;
            bucketList.push((<li><a href={url}>{item.name}</a></li>))
        });

        return ( 
             <tr>
                <td>{this.props.index}</td>
                <td>{m.get('title')}</td> 
                <td><img className="admin-logo" src={m.get('logo_image_url')} /></td>
                <td>{m.get('namespace') }</td> 
                <td> 
                    <div className="table-btn-group">
                        <button className="btn btn-xs btn-primary edit_button" 
                            onClick={this.prepareEdit} >Edit</button> 
                        <a className="btn btn-xs btn-success" 
                            href={aurl} >Facets</a> 

                        <a className="btn btn-xs btn-warning" 
                            href={furl} >Tasks</a>  
                        <div className="btn-group">
                          <button type="button" className="btn btn-xs btn-default dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                            Manage Schedule <span className="caret"></span>
                          </button>
                          <ul className="dropdown-menu" role="menu">
                           {bucketList}
                          </ul>
                        </div>
                        <button className="btn btn-xs btn-danger" 
                            onClick={this.deleteItem} >Delete</button> 
                    </div>
                </td>
            </tr>
        );
    }
});

var ProgramsTable  = React.createClass({  
    mixins :[EditableCollectionMixin],
    getDefaultProps : function(){
        var col = new JiyoDataCollection();
        col.url = "/backend/programs/program";
        return {
            collection: col
        }
    },
    getInitialState : function(){
        return {
            errors:{
                title:null,
                namespace:null,
                description:null,
                logo_image:null,
                id:null

            },
            obj :{
                id:null,
                title:null,
                description:null,
                logo_image:null,
                namespace:null,
            }
        }
    },
    handleAddClick : function() {  
         this.showModal(this.handleFormSubmit);
    },
    render:function(){ 
      
        var rows = null;  
        var self = this;
        var errors = self.state.errors;
        
        var obj = self.state.obj;

        var formBody = (
        <div>
            <HtmlFormGroupText name="title" label="Title" errorMsg={errors.title} val={obj.title} />
            <input id="id" name="id" type="hidden" value={obj.id} />
            <HtmlFormGroupText name="namespace" label="Namespace" errorMsg={errors.namespace} val={obj.namespace} /> 
            <HtmlFormGroupTextArea name="description" label="Description" errorMsg={errors.description} val={obj.description} /> 
            <HtmlImageUpload name="logo_image" label="Logo Image" errorMsg={errors.logo_image} val={obj.logo_image} /> 
        </div>
        );
      
        self.editModalRef = (<ModalForm title="Manage Program" 
            formBody={formBody}  handleFormSubmit={this.props.submitHandler} />); 

      
        if (self.state.collection ) {
            var rows = [];
            var idx = 0;
            self.state.collection.forEach(function(item){
                rows.push(<ProgramsRow model={item} index={++idx} 
                    buckets = {self.props.buckets}
                    parent={self} />);
            }); 
        } 

        return (
            <div>
                <PanelTable title="Programs" rows={rows} headers={[
                    "#",
                    "Program Name",
                    "Logo",
                    "Namespace",
                    "Actions"
                ]} addHandler={this.handleAddClick}/>
               {self.editModalRef}
            </div>
        );
    }
});

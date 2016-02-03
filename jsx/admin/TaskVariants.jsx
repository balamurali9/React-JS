/**
* 
*  Manage Task Impacts
*/ 
var TaskVaritantsRow = React.createClass({
    mixins : [EditableRowMixin], 
    render: function() { 
        var m = this.props.model;   
    
        return ( 
             <tr>
                <td>{this.props.index}</td>  
                <td>{m.get('variant_type') }</td> 
                <td>{m.get('variant_value') }</td>  
                <td> 
                    <div className="table-btn-group">
                        <button className="btn btn-xs btn-primary edit_button" 
                            onClick={this.prepareEdit} >Edit</button>   
                        <button className="btn btn-xs btn-danger" 
                            onClick={this.deleteItem} >Delete</button> 
                    </div>
                </td>
            </tr>
        );
    }
});
 
var TaskVariantsTable  = React.createClass({  
    mixins :[EditableCollectionMixin],
    getDefaultProps : function(){
        var col = new JiyoDataCollection();
        col.url = "/backend/tasks/variant";
        return {
            collection: col
        }
    },
    getInitialState : function(){
        return {
            errors:{
                id:null,
                task_id:null,
                variant_type:null, 
                variant_value:null, 
            },
            obj :{
                id:null,
                task_id:null,
                variant_type:null, 
                variant_value:null, 
            }
        }
    },
    handleAddClick : function() {  
         this.showModal(this.handleFormSubmit);
    },
    componentWillMount:function(){
        this.props.collection.url = '/backend/tasks/variant/'+this.props.task.id
    },
    render:function(){ 
      
        var self = this;

        var rows = null;  
        var obj = self.state.obj; 
        var errors = self.state.errors;   
        var variants = [];
 
        this.props.variantTypes.forEach(function(item){
            variants.push((<HtmlFormSelectOption label={item.name} value={item.id} />));
        })
        var formBody = ( 
        <div>
            <input id="id" name="id" type="hidden" value={obj.id} /> 
            <input id="task_id" name="task_id" type="hidden" value={obj.task_id} /> 
            <HtmlFormSelect id="variant_type" name="variant_type" label="Variant On " items={variants} type="hidden" val={obj.variant_type} /> 
            <HtmlFormGroupText name="variant_value" label="Value"   errorMsg={errors.variant_value} val={obj.variant_value} />
          </div>
        );
      
        self.editModalRef = (<ModalForm title={"Manage Impacts for "+this.props.task.title }
            formBody={formBody}  handleFormSubmit={this.props.submitHandler} />);  
        


        if (self.state.collection) {
            rows = [];
            var idx = 0;
            self.state.collection.forEach(function(item){ 
                rows.push(<TaskVaritantsRow model={item} index={++idx} 
                    parent={self} />);
            });
        } 

        var title = (<span>Manage Varitants for - <span className="label label-warning">{this.props.task.title}</span></span>);
        return (
            <div>
                <PanelTable title={title} rows={rows} headers={[
                    "#",  
                    "Variant Type", 
                    "Variant Value", 
                    "Actions"
                ]} addHandler={this.handleAddClick}/>
               {self.editModalRef}
            </div>
        );
    }
});
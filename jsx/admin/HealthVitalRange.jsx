
var HealthVitalRangeRow = React.createClass({
    mixins : [EditableRowMixin], 
    render: function() { 
        var m = this.props.model;   
        var name = 'Not Found';
        this.props.buckets.forEach(function(item){
            if (m.get('user_bucket_id') == item.id) {
                name = item.name;
            }
        });
        return ( 
             <tr>
                <td>{this.props.index}</td> 
                <td>{name}</td> 
                <td>{m.get('min_accepted_value') }</td> 
                <td>{m.get('max_accepted_value') }</td>  
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
 
var HealthVitalRangeTable  = React.createClass({  
    mixins :[EditableCollectionMixin],
    getDefaultProps : function(){
        var col = new JiyoDataCollection();
        col.url = "/backend/meta/vital-range";
        return {
            collection: col
        }
    },

    getInitialState : function(){
        return {
            errors:{
                id:null,
                user_bucket_id:null,
                health_vital_id:null, 
                min_accepted_value:null,
                max_accepted_value:null,
            },
            obj :{
                id:null,
                user_bucket_id:null,
                health_vital_id:null, 
                min_accepted_value:null,
                max_accepted_value:null
            }
        }
    },
    handleAddClick : function() {  
         this.showModal(this.handleFormSubmit);
    },
    componentWillMount:function(){
        this.props.collection.url = '/backend/meta/vital-range/'+this.props.vital.id
    },
    render:function(){ 
      
        var rows = null;  
        var self = this;
        var obj = self.state.obj; 
        var errors = self.state.errors;
        var itemList = []; 

        this.props.buckets.forEach(function(item){
            itemList.push( (<HtmlFormSelectOption label={item.name} value={item.id} />))
        });
 
        
        var formBody = ( 
        <div>
            <input id="id" name="id" type="hidden" value={obj.id} /> 
            <input id="health_vital_id" name="health_vital_id" type="hidden" value={obj.health_vital_id} />

            <HtmlFormSelect name="user_bucket_id" label="User Bucket Id" items={itemList} errorMsg={errors.user_bucket_id} val={obj.user_bucket_id} />
            <HtmlFormGroupText name="min_accepted_value" label="Minimum Accepted Value" errorMsg={errors.min_accepted_value} val={obj.min_accepted_value} /> 
            <HtmlFormGroupText name="max_accepted_value" label="Max Accepted Value" errorMsg={errors.max_accepted_value} val={obj.max_accepted_value} />
        </div>
        );
      
        self.editModalRef = (<ModalForm title={"Manage User Bucket Ranges for "+this.props.vital.name }
            formBody={formBody}  handleFormSubmit={this.props.submitHandler} />); 

      

        if (self.state.collection ) {
            rows = [];
            var idx = 0;
            self.state.collection.forEach(function(item){ 
                rows.push(<HealthVitalRangeRow model={item} index={++idx} 
                    buckets = {self.props.buckets}
                    parent={self} />);
            });
        } 
        var title = (<span>Manage User Bucket Ranges for - <span className="label label-success">{this.props.vital.name}</span></span>);
        return (
            <div>
                <PanelTable title={title} rows={rows} headers={[
                    "#", 
                    "Bucket Name",
                    "Min Val",
                    "Max Val",
                    "Actions"
                ]} addHandler={this.handleAddClick}/>
               {self.editModalRef}
            </div>
        );
    }
});


/**
* 
*  Manage Task Impacts
*/ 
var TaskImpactsRow = React.createClass({
    mixins : [EditableRowMixin], 
    render: function() { 
        var m = this.props.model;   
    
        return ( 
             <tr>
                <td>{this.props.index}</td>  
                <td>{m.get('vital_name') }</td> 
                <td>{m.get('polarity') }</td>  
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
 
var TaskImpactsTable  = React.createClass({  
    mixins :[EditableCollectionMixin],
    getDefaultProps : function(){
        var col = new JiyoDataCollection();
        col.url = "/backend/tasks/impact";
        return {
            collection: col
        }
    },

    getInitialState : function(){
        return {
            errors:{
                id:null,
                task_id:null,
                health_vital_id:null, 
                polarity:null, 
            },
            obj :{
                id:null,
                task_id:null,
                health_vital_id:null, 
                polarity:null, 
            }
        }
    },
    handleAddClick : function() {  
         this.showModal(this.handleFormSubmit);
    },
    componentWillMount:function(){
        this.props.collection.url = '/backend/tasks/impact/'+this.props.task.id
    },
    render:function(){ 
      
        var rows = null;  
        var self = this;
        var obj = self.state.obj; 
        var errors = self.state.errors;
        var itemList = []; 

        this.props.polarityList.forEach(function(item){
            itemList.push( (<HtmlFormSelectOption label={item.name} value={item.id} />))
        });
        
        var vitals = [];

        this.props.healthVitals.forEach(function(item){
            vitals.push( (<HtmlFormSelectOption label={item.name} value={item.id} />) );
        })
        
        var formBody = ( 
        <div>
            <input id="id" name="id" type="hidden" value={obj.id} /> 
            <input id="task_id" name="task_id" type="hidden" value={obj.task_id} /> 
            <HtmlFormSelect id="health_vital_id" name="health_vital_id" items={vitals} type="hidden" val={obj.health_vital_id} /> 
            <HtmlFormSelect name="polarity" label="Polarity" items={itemList} errorMsg={errors.polarity} val={obj.polarity} />
          </div>
        );
      
        self.editModalRef = (<ModalForm title={"Manage Impacts for "+this.props.task.title }
            formBody={formBody}  handleFormSubmit={this.props.submitHandler} />);  
      

        if (self.state.collection ) {
            rows = [];
            var idx = 0;
            self.state.collection.forEach(function(item){ 
                rows.push(<TaskImpactsRow model={item} index={++idx} 
                    parent={self} />);
            });
        } 
        var title = (<span>Manage Impacts for - <span className="label label-success">{this.props.task.title}</span></span>);
        return (
            <div>
                <PanelTable title={title} rows={rows} headers={[
                    "#", 
                    "Vital Name",
                    "Polarity", 
                    "Actions"
                ]} addHandler={this.handleAddClick}/>
               {self.editModalRef}
            </div>
        );
    }
});

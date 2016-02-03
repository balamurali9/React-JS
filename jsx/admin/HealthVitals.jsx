
/*
Handle Health Vitals
 
*/ 
var HealthVitalRow = React.createClass({
    mixins : [EditableRowMixin], 
    render: function() { 
        var m = this.props.model;   

        return ( 
             <tr>
                <td>{this.props.index}</td>
                <td>{m.get('name')}</td>  
                <td>{m.get('provider_id') }</td> 
                <td>{m.get('system_id') }</td> 
                <td>{m.get('description') }</td> 
                <td>{m.get('unit_name') }</td> 
                <td> 
                    <div className="table-btn-group">
                        <button className="btn btn-xs btn-primary edit_button" 
                            onClick={this.prepareEdit} >Edit</button>  
                        <a className="btn btn-warning btn-xs" href={"/admin/health-vital-ranges/"+m.get('id')}>Ranges</a>
                        <button className="btn btn-xs btn-danger" 
                            onClick={this.deleteItem} >Delete</button> 
                    </div>
                </td>
            </tr>
        );
    }
});
 
var HealthVitalTable  = React.createClass({  
    mixins :[EditableCollectionMixin],
    getDefaultProps : function(){
        var col = new JiyoDataCollection();
        col.url = "/backend/meta/vital";
        return {
            collection: col
        }
    },
    getInitialState : function(){
        return {
            errors:{
                id:null,
                name:null,
                description:null,
                provider_id:null,
                system_id:null, 
                unit_name:null,
                min_accepted_value:null,
                max_accepted_value:null, 
            },
            obj :{
                id:null,
                name:null,
                description:null,
                provider_id:null,
                system_id:null, 
                unit_name:null,
                min_accepted_value:null,
                max_accepted_value:null,
            }
        }
    },
    handleAddClick : function() {  
         this.showModal(this.handleFormSubmit);
    },
    render:function(){ 
      
        var rows = null;  
        var self = this;
        var obj = self.state.obj; 
        var errors = self.state.errors;
        var itemList = [];
        var provderList = [];
 
        this.props.unitNameList.forEach(function(item){
           itemList.push( (<HtmlFormSelectOption label = {item.name} value={item.id} />) );
        })

        this.props.providerList.forEach(function(item){
            provderList.push( (<HtmlFormSelectOption label = {item.name} value={item.id} />)  );
        })
        var formBody = ( 
        <div>
            <input id="id" name="id" type="hidden" value={obj.id} />
            <HtmlFormGroupText name="name" label="Name" errorMsg={errors.name} val={obj.name} />  
            <HtmlFormSelect name="provider_id" label="ProviderId" items={provderList} errorMsg={errors.provider_id} val={obj.provider_id} />
            <HtmlFormGroupText name="system_id" label="SystemId" errorMsg={errors.system_id} val={obj.system_id} /> 
            <HtmlFormGroupTextArea name="description" label="Description" errorMsg={errors.description} val={obj.description} /> 
            <HtmlFormSelect name="unit_name" label="Unit Name" items={itemList} errorMsg={errors.unit_name} val={obj.unit_name} />
            <HtmlFormGroupText name="min_accepted_value" label="Minimum Accepted Value" errorMsg={errors.min_accepted_value} val={obj.min_accepted_value} /> 
            <HtmlFormGroupText name="max_accepted_value" label="Max Accepted Value" errorMsg={errors.max_accepted_value} val={obj.max_accepted_value} />
        </div>
        );
      
        self.editModalRef = (<ModalForm title="Manage Program" 
            formBody={formBody}  handleFormSubmit={this.props.submitHandler} />); 

      

        if (self.state.collection) {
            rows = [];
            var idx = 0;
            self.state.collection.forEach(function(item){
                rows.push(<HealthVitalRow model={item} index={++idx} 
                    buckets = {self.props.buckets}
                    parent={self} />);
            });
        } 

        return (
            <div>
                <PanelTable title="Manage Vitals " rows={rows} headers={[
                    "#",
                    "Name",
                    "Provider",
                    "SystemId",
                    "Description",
                    "Units",
                    "Actions"
                ]} addHandler={this.handleAddClick}/>
               {self.editModalRef}
            </div>
        );
    }
});
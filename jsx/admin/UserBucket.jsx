
/**
 * Handle User Buckets
 */ 
var UserBucketRow = React.createClass({
    mixins:[EditableRowMixin], 
    render: function() { 
        var m = this.props.model; 
        return ( 
             <tr>
                <td>{this.props.index}</td>
                <td>{m.get('name')}</td>
                <td>{m.get('rule_key') }</td>  
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

var UserBucketTable  = React.createClass({ 
    mixins :[EditableCollectionMixin],
    getDefaultProps : function(){
        var col = new JiyoDataCollection();
        col.url = "/backend/meta/user-bucket";
        return {
            collection: col
        }
    },
    getInitialState : function(){
        return {
            errors: {
                name:null,
                rule_key:null
            },
            obj : {
                id:null,
                name:null,
                rule_key:null 
            }
        };
    },
    handleAddClick : function() {  
        this.showModal(this.handleFormSubmit);
    },
    render:function(){ 
      
        var rows = null;
        var self = this;
        var itemList = {};
        this.props.rule_list.forEach(function(item){
            itemList[item.id] =
            (<HtmlFormSelectOption label={item.name} value={item.id}/>)
        });
        var errors = self.state.errors;
        var obj = self.state.obj;
        var formBody = (
        <div>
            <input id="id" name="id" type="hidden" value={obj.id} />
            <HtmlFormGroupText name="name" label="Unique Name" errorMsg={errors.name} val={obj.name}  />
            <HtmlFormSelect name="rule_key" label="Rule" items={itemList} errorMsg={errors.rule_key} val={obj.rule_key} />
        </div>
        );  

        self.editModalRef = (<ModalForm title="Manage User Buckets" 
                formBody={formBody}  handleFormSubmit={this.props.submitHandler} />); 
 
        if (self.state.collection ) {
            rows = [];
            var idx = 0;
            self.state.collection.forEach(function(item){
                rows.push(<UserBucketRow model={item} index={++idx} 
                    parent={self} />);
            });
        }

        var title = "Mange User Buckets "
        return (
            <div>
                <PanelTable title={title} rows={rows} headers={[
                    "#",
                    "Name",
                    "Rule Key", 
                    "Actions"
                ]} addHandler={this.handleAddClick}/>
               {self.editModalRef}
            </div>
        );
    }
});
  
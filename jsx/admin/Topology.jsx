/*
Handle Topologies
 */ 
var TopologyRow = React.createClass({
    mixins :[ EditableRowMixin ],
    renderEditForm : function() {   
        this.props.parent.showModal(this.handleFormSubmit,this.props.model);
    }, 
    addChild:function(){
        this.props.addChild(this.model.get('parent_id'));
    },
    render: function() { 
        var m = this.props.model; 
        return ( 
             <tr>
                <td>{this.props.index}</td>
                <td>{m.get('term')}</td>
                <td>{m.get('parent_id') }</td>
                <td>{m.get('genre') }</td>
                <td> 
                    <div className="table-btn-group">
                        <button className="btn btn-xs btn-primary edit_button" 
                            onClick={this.renderEditForm} >Edit</button> 
                        <button className="btn btn-xs btn-success" 
                            onClick={this.addChild} >Add child</button> 
                        <button className="btn btn-xs btn-danger" 
                            onClick={this.deleteItem} >Delete</button>
                    </div> 
                </td>
            </tr>
        );
    }
});
var TopologyTable  = React.createClass({ 

    mixins :[EditableCollectionMixin],
    getDefaultProps : function(){
        var col = new JiyoDataCollection();
        col.url = "/backend/meta/topology";
        return {
            collection: col
        };
    },
    getInitialState:function(){
        return {
            errors:{
                id:null,
                term:null,
                genre:null,
                description:null 
            },
            obj : {
                id:null,
                term:null,
                genre:null,
                parent_id:null,
                description:null 
            }
        };
    }, 
    handleAddClick : function() {  
        this.showModal(this.handleFormSubmit);
    },
    addChild : function(parentId) {   
        this.showModal(this.handleFormSubmit);
    },
    render: function() {
        var rows = null; 
        var index = 0;
        var self = this;
        var itemList = {};
        var collection = this.state.collection;

        itemList["null"] = [(<HtmlFormSelectOption label="--" value="NULL" />)];
        if (this.state.collection ) {
            rows = [];
            collection.forEach(function(item) { 
                index++;
                itemList["item_"+item.id] = 
                (<HtmlFormSelectOption label={item.get('term')} 
                        value={item.get('id')} />)
            }); 
        } 
        var obj = this.state.obj;

        var formBody = (
            <div> 
                <HtmlFormGroupText name="term" label="Term" val={obj.term}/>
                <input id="id" name="id" type="hidden" value={obj.id} />
                <HtmlFormSelect name="parent_id" label="Parent" items={itemList} val={obj.parent_id} />
                <HtmlFormGroupText name="genre" label="Genre" val={obj.genre} />
                <HtmlFormGroupTextArea name="description" label="Description" val={obj.description}/>  
            </div>
        )
        var self = this;
        this.editModalRef = (<ModalForm title="Manage Topology" 
                formBody={formBody}
                handleFormSubmit={this.props.submitHandler} />);


        itemList["null"] = [(<option value="NULL" >--</option>)];
        if (this.state.collection ) {
            rows = [];
            var self = this;
            collection.forEach(function(item) { 
                index++;
                rows.push((<TopologyRow model={item} index={index}  
                    addChild={self.addChild} parent={self}/>)
                ); 
            }); 
        }  
        return (
            <div>
            <PanelTable title="Manage Topology" rows={rows} headers={[
                "#",
                "Term",
                "Parent_id",
                "Genre",
                "Actions"
                ]}  addHandler={this.handleAddClick}/>
                {self.editModalRef} 
         </div>
        );
    }
});
 
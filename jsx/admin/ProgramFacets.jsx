/**
 * Handle Program Facets
 */ 
var ProgramFacetRow = React.createClass({
    mixins:[EditableRowMixin], 
    render: function() { 
        var m = this.props.model; 
        var desc = m.get('description').substr(0,100);
        return ( 
             <tr>
                <td>{this.props.index}</td>
                <td>{m.get('title')}</td>
                <td>{m.get('description')}</td>  
                <td> 
                   <div className="table-btn-group">
                        <button type="button" className="btn btn-xs btn-primary edit_button" 
                            onClick={this.prepareEdit} >Edit</button> 
                        <button type="button"  className="btn btn-xs btn-danger" 
                        onClick={this.deleteItem} >Delete</button> 
                    </div> 
                </td>
            </tr>
        );
    }
}); 
var ProgramsFacetTable  = React.createClass({ 
    mixins :[EditableCollectionMixin],
    getDefaultProps : function(){
        var col = new JiyoDataCollection();
        return {
            collection: col
        };
    },
    getInitialState:function(){
        return {
            errors:{
                title:null,
                description:null,
                program_id:null,
                fill_color:null,
                logo_image:null,
                cover_image:null,
                ref_article_id:null,
                ref_article_title:null,
            },
            obj : {
                id:null,
                title:null,
                description:null,
                program_id:null,
                fill_color:null,
                logo_image:null,
                cover_image:null,
                ref_article_id:null,
                ref_article_title:null,
            }
        }
    },
    handleAddClick : function() {  
         this.showModal(this.handleFormSubmit);
    },
    componentWillMount:function(){
        this.props.collection.url = '/backend/programs/program-facet/'+this.props.program_id
    },
    render:function(){ 
      
        var rows = null;
        var self = this;
        var errors = self.state.errors;
        var obj = self.state.obj;
 
        var formBody = (
        <div>
            <HtmlFormGroupText name="title" label="Title" val={obj.title} errorMsg={errors.title} />
            <input id="id" name="id" type="hidden" value={obj.id}  />
            <input id="program_id" name="program_id" type="hidden"  value={this.props.program_id}   errorMsg={errors.program_id}  />
            <HtmlFormGroupTextArea name="description" label="Description" val={obj.description}  errorMsg={errors.description}  /> 
            <HtmlFormColor name="fill_color" label="Facet Color" val={obj.fill_color} errorMsg={errors.fill_color}  />
            <HtmlImageUpload name="logo_image" label="Upload Facet Logo" val={obj.logo_image} errorMsg={errors.logo_image}  />

             <GenericAutoComplete endPoint='/backend/meta/article-search/' 
                            label="Associate an article with the Facet ?"  
                            name="ref_article_id" 
                            errorMsg={errors.ref_article_id} 
                            val={obj.ref_article_id}
                            text={obj.ref_article_title} />

            <HtmlImageUpload name="cover_image" label="Upload Cover Image" val={obj.cover_image} errorMsg={errors.cover_image}  /> 
            
        </div>
        ); 
        
        self.editModalRef = (<ModalForm title="Manage Program Facet" 
                formBody={formBody} handleFormSubmit={this.props.submitHandler}  />); 
         
        
        if (self.state.collection) {
            rows = [];
            var idx = 0;
            self.state.collection.forEach(function(item){
                rows.push(<ProgramFacetRow model={item} index={++idx} 
                    parent={self} />);
            });
        }
        var title =  (<span>Progam Facets -  <span className="label label-success">{this.props.program_title}</span></span>);
        

        return (
            <div>
                <PanelTable title={title} rows={rows} headers={[
                    "#",
                    "Title ",
                    "Description", 
                    "Actions"
                ]} addHandler={this.handleAddClick}/>
               {self.editModalRef}
            </div>
        );
    }
});
 
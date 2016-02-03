
/*
Report Abuse Comments
 
*/ 
var ReportAbuseCommentsRow = React.createClass({
    mixins : [EditableRowMixin], 
    moderateComment : function(commentId) {
        var res = confirm('Do you really Want to Moderate Comment');
        if (!res) {
            return;
        } 
        var self = this;
        Api.postData('/backend/meta/moderate-comments/'+commentId,{},function(response){ 
            if(response.success) {
                self.props.model.destroy({
                    error:function(){
                        alert('Error While Moderating Comment');
                    }
                });
            }
        });
    },
    render: function() { 
        var m = this.props.model;   

        return ( 
             <tr>
                <td>{this.props.index}</td>
                <td>{m.get('comments').text}</td> 
                <td>{m.get('title')}</td> 
                <td>{m.get('type')}</td> 
                <td>{m.get('added_by')}</td> 
                <td>{m.get('moderation_type')}</td>  
                <td>{m.get('message') }</td>
                <td>{m.get('reporter').display_name }</td>
                <td>
                    <button className="btn btn-xs btn-danger" 
                            onClick={this.moderateComment.bind(null,m.get('comments').id)} >Moderate</button> 
                </td>
            </tr>
        );
    }
});
var ReportAbuseCommentsTable  = React.createClass({ 

    mixins :[EditableCollectionMixin],
    getDefaultProps : function(){
        var col = new JiyoDataCollection();
        col.url = "/backend/meta/report-abuse-comments";
        return {
            collection: col
        };
    },
    getInitialState:function(){
        return {
            filterText:'',
            errors:{
                id:null,
                comments:null,
                title:null,
                type:null,
                added_by:null,
                moderation_type:null,
                message:null,
                reporter:null, 
            },
            obj : {
                id:null,
                comments:null,
                title:null,
                type:null,
                added_by:null,
                moderation_type:null,
                message:null,
                reporter:null 
            }
        };
    },
    filter:function(event) {
        this.setState({filterText:event.target.value})
    },
    render: function() {
        var rows = null; 
        var index = 0;
        var self = this;
        var collection = this.state.collection;         
        var obj = this.state.obj;
        var self = this;
        if (this.state.collection ) {
            var filter = this.state.filterText.toLowerCase();
            rows = [];
            collection.forEach(function(item) {
                if (item.get('comments').text.toLowerCase().indexOf(filter) >= 0) {
                    rows.push(<ReportAbuseCommentsRow model={item} index={++index} 
                    parent={self} />);
                } else  if (item.get('added_by').toLowerCase().indexOf(filter) >= 0) {
                    rows.push(<ReportAbuseCommentsRow model={item} index={++index} 
                    parent={self} />);
                } else  if (item.get('reporter').display_name.toLowerCase().indexOf(filter) >= 0) {
                    rows.push(<ReportAbuseCommentsRow model={item} index={++index} 
                    parent={self} />);
                }
                else  if (item.get('message').toLowerCase().indexOf(filter) >= 0) {
                    rows.push(<ReportAbuseCommentsRow model={item} index={++index} 
                    parent={self} />);
                }
                else  if (item.get('title').toLowerCase().indexOf(filter) >= 0) {
                    rows.push(<ReportAbuseCommentsRow model={item} index={++index} 
                    parent={self} />);
                }
                else  if (item.get('type').toLowerCase().indexOf(filter) >= 0) {
                    rows.push(<ReportAbuseCommentsRow model={item} index={++index} 
                    parent={self} />);
                }
            }); 
        }  
        return (
            <div>
            <PanelTable onFilter={this.filter} filterText={this.state.filterText} title="Report Abuse Comments" rows={rows} headers={[
                "#",
                "Comments",
                "Commented On",
                "Type",
                "Commented By",
                "Moderation Type",
                "Message",
                "Reporter"
                ]} />                
         </div>
        );
    }
});
 
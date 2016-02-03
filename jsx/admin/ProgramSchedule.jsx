
/**
 * Handle Program Tasks
 */ 
var ProgramScheduleRow = React.createClass({
    mixins:[EditableRowMixin], 
    render: function() { 
        var m = this.props.model; 
        return ( 
             <tr>
                <td>{this.props.index}</td>
                <td>{m.get('day')}</td>
                <td>{m.get('schedule_time') }</td>  
                <td>{m.get('task_title') }</td>  
                
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



var ProgramSchedule  = React.createClass({ 
    mixins :[EditableCollectionMixin],
    getDefaultProps : function(){
        var col = new JiyoDataCollection(); 
        return {
            collection: col
        }
    },
    componentWillMount:function(){
        var p = this.props;
        this.props.collection.url =  "/backend/programs/program-schedule/"
        +p.programId+"/"+p.bucketId;
    },
    getInitialState : function(){
        return {
            errors: {
                id:null,
                program_id:null,
                user_bucket_id:null,
                day:null,
                schedule_time:null,
                task_id: null,
                task_variant_id:null,
                task_title:null
            },
            obj : { 
                id:null,
                program_id:null,
                user_bucket_id:null,
                day:null,
                schedule_time:null,
                task_id:null,
                task_variant_id:null,
                task_title:null
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
        var p = self.props;
        var errors = self.state.errors;
        var obj = self.state.obj;
        var timeList = [];
        var dayList = [];

        for(var idx = 0;idx < 24;idx++) { 
            if (idx < 10) {
                idx = "0"+idx;
            } 
            var lab = idx+":00";
            var val = lab+":00"
            timeList.push( (<HtmlFormSelectOption label={lab} value={val}/>));

            lab = idx+":30";
            val = lab+":00";
            timeList.push( (<HtmlFormSelectOption label={lab} value={val}/>));
        }

        for(var idx =0;idx <= 90;idx++) {
            var day = "Day "+idx;
            dayList.push( (<HtmlFormSelectOption label={day} value={idx}/>));
        }
 
        var formBody = (
        <div>
            <input id="id" name="id" type="hidden" value={obj.id} />
            <input id="program_id" name="program_id" type="hidden" value={p.programId} />
            <input id="user_bucket_id" name="user_bucket_id" type="hidden" value={p.bucketId} />
            <HtmlFormSelect label="Select Day to Schedule" items={dayList} name="day" val={obj.day} errorMsg={errors.day} />
            <HtmlFormSelect label="Select Time To Schedule" items={timeList} name="schedule_time" val={obj.schedule_time} errorMsg={errors.schedule_time} />
            <GenericAutoComplete endPoint={'/backend/programs/task-search/'+p.programId} 
                label="Select a Task" 
                text={obj.task_title} 
                name="task_variant_id" 
                programId={p.programId} 
                val={obj.task_variant_id} 
                errorMsg={errors.task_variant_id}  />
        </div>
        ); 


        self.editModalRef = (<ModalForm title="Manage Program Schedule" 
                formBody={formBody}  
                handleFormSubmit={p.submitHandler} />); 
    
        console.log("State Col:",self.state.collection);

        if (self.state.collection) {
            rows = [];
            var idx = 0;
            self.state.collection.forEach(function(item){
                rows.push(<ProgramScheduleRow model={item} index={++idx} 
                    parent={self} />);
            });
        }

        var title = (<span >Mange Schedule of <span className="label label-success" > {p.programTitle} </span> 
                for Users <span className="label label-warning" > {p.bucketName}</span></span> );
        return (
            <div>
                <PanelTable title={title} rows={rows} headers={[
                    "#",
                    "Day",
                    "Time",
                    "Task", 
                    "Actions"
                ]} addHandler={this.handleAddClick}/>
               {self.editModalRef}
            </div>
        );
    }
});

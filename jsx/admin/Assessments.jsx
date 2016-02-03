

/*
Handle Assessments / Questionnires
*/ 
var AssessmentsRow = React.createClass({
    mixins : [EditableRowMixin], 
    render: function() { 
        var m = this.props.model;  
        var qurl ="/admin/assessment-questions/"+m.get('id');   
        return ( 
             <tr>
                <td>{this.props.index}</td>
                <td>{m.get('title')}</td>  
                <td>{m.get('status') }</td> 
                <td> 
                    <div className="table-btn-group">
                        <button className="btn btn-xs btn-primary edit_button" 
                            onClick={this.prepareEdit} >Edit</button>   
                        <a className="btn btn-xs btn-success" 
                            href={qurl} >Questions</a> 
                    </div>
                </td>
            </tr>
        );
    }
});

var AssessmentsTable  = React.createClass({  
    mixins :[EditableCollectionMixin],
    getDefaultProps : function(){
        var col = new JiyoDataCollection();
        col.url = "/qna/assessment";
        return {
            collection: col
        }
    },
    getInitialState : function(){
        return {
            errors:{
                title:null, 
                description:null, 
                status:null,
                id:null

            },
            obj :{
                id:null,
                title:null,
                status:null,
                description:null, 
            }
        }
    },
    handleAddClick : function() {  
         this.showModal(this.handleFormSubmit);
    }, 
    prepareEditModal : function() {
        var self = this;
        var errors = self.state.errors; 
        var obj = self.state.obj;
        var itemList = {    
        }; 

        var status = [
            {
                id:'PUBLISHED',
                name:'PUBLISHED'
            },
            {
                id:'DRAFT',
                name:'DRAFT'
            }
        ]; 
        status.forEach(function(item){
              itemList[item.id] =
            (<HtmlFormSelectOption label={item.name} value={item.id}/>);
        });

        var formBody = (
        <div>
            <HtmlFormGroupText name="title" label="Title" errorMsg={errors.title} val={obj.title} />
            <input id="id" name="id" type="hidden" value={obj.id} /> 
            <HtmlFormGroupTextArea name="description" label="Description" errorMsg={errors.description} val={obj.description} />  
            <HtmlFormSelect name="status" label="Status" items={itemList} val={obj.status}   />

        </div>
        ); 
        self.editModalRef = (<ModalForm title="Manage Assessment" 
            formBody={formBody}  handleFormSubmit={this.props.submitHandler} />);  
    },
    getRow:function(idx,item) {
        return  <AssessmentsRow model={item} index={idx} 
                     parent={this} />
    },
    render:function(){  
        return this.renderTable("Assessments",[
            "#",
            "Assessment Title", 
            "Status",
            "Actions"
        ]);
    }
});

 
/*
Handle AssessmentsQuestions
*/ 
var AssessmentQuestionsRow = React.createClass({
    mixins : [EditableRowMixin], 
    render: function() { 
        var m = this.props.model;  
        var qurl ="/admin/assessment-question-answers/"+m.get('id');   
        return ( 
             <tr>
                <td>{this.props.index}</td>
                <td>{m.get('text')}</td>  
                <td>{m.get('display_order') }</td>
                <td>{m.get('status') }</td>

                <td> 
                    <div className="table-btn-group">
                        <button className="btn btn-xs btn-primary edit_button" 
                            onClick={this.prepareEdit} >Edit</button>   
                        <a className="btn btn-xs btn-success" 
                            href={qurl} >Answers</a> 
                    </div>
                </td>
            </tr>
        );
    }
});

var AssessmentQuestionsTable  = React.createClass({  
    mixins :[EditableCollectionMixin],
    getDefaultProps : function(){
        var col = new JiyoDataCollection();
        col.url = "/qna/assessment-question/";
        return {
            collection: col
        }
    },
    getInitialState : function(){
        return {
            errors:{
                text:null,  
                status:null,
                display_order:null,
                id:null

            },
            obj :{
                id:null,
                text:null,
                status:null,
                display_order:null, 
            }
        }
    },
    componentWillMount:function(){
        this.props.collection.url = "/qna/assessment-question/"+this.props.assessmentId
    },
    handleAddClick : function() {  
         this.showModal(this.handleFormSubmit);
    },  
    prepareEditModal : function() {
        var self = this;
        var errors = self.state.errors;    
        var itemList = {    
        }; 
        var obj = self.state.obj;
               var status = [
            {
                id:'ACTIVE',
                name:'ACTIVE'
            },
            {
                id:'INACTIVE',
                name:'INACTIVE'
            }
        ]; 
        status.forEach(function(item){
              itemList[item.id] =
            (<HtmlFormSelectOption label={item.name} value={item.id}/>);
        });

        var formBody = (
        <div>
            <HtmlFormGroupText name="text" label="Text" errorMsg={errors.text} val={obj.text} />  
            <HtmlFormGroupText name="display_order" label="Display Order" errorMsg={errors.display_order} val={obj.display_order} />
            <input id="id" name="id" type="hidden" value={obj.id} />    
            <HtmlFormSelect name="status" label="Status" items={itemList} val={obj.status}   /> 
        </div>
        );
      
        self.editModalRef = (<ModalForm title="Manage Assessment Questions" 
            formBody={formBody}  handleFormSubmit={this.props.submitHandler} />);  
      
    },
    getRow:function(idx,item) {
        return  <AssessmentQuestionsRow model={item} index={idx} 
                     parent={this} />
    },
    render:function(){  
        return this.renderTable("Assessment Questions",[
            "#",
            "Question", 
            "Display Order",
            "Status",
            "Actions"
        ]);
    }
});
 
/*
Handle AssessmentsQuestoinAnswers
*/ 
var AssessmentsQuestionAnswersRow = React.createClass({
    mixins : [EditableRowMixin], 
    render: function() { 
        var m = this.props.model;  
         return ( 
             <tr>
                <td>{this.props.index}</td>
                <td>{m.get('text')}</td>  
                <td>{m.get('points') }</td>   
                <td>{m.get('status') }</td> 
                <td> 
                    <div className="table-btn-group">
                        <button className="btn btn-xs btn-primary edit_button" 
                            onClick={this.prepareEdit} >Edit</button>    
                   
                    </div>
                </td>
            </tr>
        );
    }
});

var AssessmentQuestionAnswersTable  = React.createClass({  
    mixins :[EditableCollectionMixin],
    getDefaultProps : function(){
        var col = new JiyoDataCollection();
        col.url = "/qna/assessment-question-answer/";
        return {
            collection: col
        }
    },
    getInitialState : function(){
        return {
            errors:{
                text:null, 
                points:null,
                status:null,  
                id:null

            },
            obj :{
                id:null,
                text:null, 
                status:null,
                points:null, 
            }
        }
    },
    handleAddClick : function() {  
         this.showModal(this.handleFormSubmit);
    },
    componentWillMount:function(){
        this.props.collection.url = "/qna/assessment-question-answer/"+this.props.questionId
    }, 
    prepareEditModal : function() {
        
        var self = this;
        var errors = self.state.errors; 
        var obj = self.state.obj; 
        var status = [
            {
                id:'ACTIVE',
                name:'ACTIVE'
            },
            {
                id:'INACTIVE',
                name:'INACTIVE'
            }
        ];
        var itemList = {    
        }; 


        status.forEach(function(item){
              itemList[item.id] =
            (<HtmlFormSelectOption label={item.name} value={item.id}/>);
        });


        var formBody = (
        <div>
            <HtmlFormGroupText name="text" label="Text" errorMsg={errors.text} val={obj.text} />
             <HtmlFormGroupText name="points" label="Points" errorMsg={errors.points} val={obj.points} /> 
             <HtmlFormSelect name="status" label="Status" items={itemList} val={obj.status}   />
            <input id="id" name="id" type="hidden" value={obj.id} />   
        </div>
        );
      
        self.editModalRef = (<ModalForm title="Manage Assessment Question Answers" 
            formBody={formBody}  handleFormSubmit={this.props.submitHandler} />);  
      
      
    },
    getRow:function(idx,item) {
        return  <AssessmentsQuestionAnswersRow model={item} index={idx} 
                     parent={this} />
    },
    render:function(){  
        return this.renderTable("Assessment Question Answers",[
            "#",
            "Answer", 
            "Points",
            "Status",
            "Actions"
        ]);
    }
});
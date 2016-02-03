var HtmlDoshaResult = React.createClass({
    render:function(){

        var res = this.props.data.result;

        var rows = [];
        res.items.forEach(function(item){
            rows.push((<tr><td>{item.name}</td><td>{item.score}</td></tr>))
        });
        var rows2 = [];
        var doshas = [];
        res.dosha.forEach(function(dosha) {

            rows2 = [];
            dosha.characteristics.forEach(function(item){
                rows2.push((<tr><td>{item.name}</td><td>{item.info}</td></tr>))
            });

            doshas.push((
                <div>
                <h3>{dosha.name}</h3>
                <p>{dosha.description}</p>
                <table className="table table-striped">
                {rows2}
                </table>
                </div>
            ));
        })
        

        return (<div>
            <img src={res.image} style={{width:"100%"}} />
            <h2>
           {  "Your body Type is "+res.name}</h2>
           <h3>Your Score </h3>
            <table className="table table-striped">
                {rows}
            </table>
           {doshas}
        
        </div>)
    }
});

var HtmlQuestionObject = React.createClass({
    getInitialState:function(){
        return {
            processing:false
        }
    },
    handleAnswerSelect:function(val){
        this.props.parent.handleAnswer(val,this)
        this.setState({processing:true});
    },
    updateQuestion : function(question,attempt) {
        this.props.question = question;
        this.props.attempt = attempt;
        this.setState({processing:false});
    },
    render:function() {
        var q = this.props.question;
        var options = [];
        var self = this;
        q.answers.forEach(function(item){
            var answerId = "answer_"+item.id;
            options.push((
                <div className="form-group">
                <label htmlFor={answerId}>
                <input type="radio" id={answerId} onClick={self.handleAnswerSelect.bind(null,item.id)} className="input-control" /> {item.text}
                </label>
                </div>
            ));
        });
        var content = null;
        if (this.state.processing) {
            content = (<LoadingIcon />); 
        } else {
            options.push((<a className="btn btn-default" href="#home">Later</a>));
            content = (<div>
                <h4>{q.text}</h4>
                <div className="btn-group-vertical col-xs-12" role="group">
                {options} 
            </div>
            </div>);
        }
       
        var a = this.props.attempt;
        return (
            <div className="question-block clearfix">
                <div className="progress">
                  <div className="progress-bar  progress-bar-success" role="progressbar" aria-valuenow={a.progress} 
                  aria-valuemin="0" aria-valuemax="100" style={{width: a.progress+"%"}}>
                    <span className="sr-only">{a.progress}% Complete</span>
                  </div>
                </div>
                {content}
            </div>
        );
    }
});

var AssessmentListGroup = React.createClass({
 
    render :function(){
        var items = [];
        var self = this;
        this.props.items.forEach(function(item){
            var url = self.props.baseUrl+item.id;
            items.push( (<a href={url} className="list-group-item">
            <h4 className="list-group-item-heading">{item.title}</h4>
            <p className="list-group-item-text">{item.description}</p>
          </a>));
        });
        return  (<div className="list-group">
            {items}
        </div>);
    }
});

var AssessmentQuestionObject = React.createClass({
    getInitialState:function(){
        return {
            processing:false
        }
    },
    handleMultipleAnswer:function(val){
        var self = this;
        var QuestionObj={};
         var question_id = "";
         var answer_id = "";
         var attempt_id = "";
         var radios="";
         var radiosList = [];

        for(var i = 1; i <= val; i++) {
         radios = document.getElementById('answer_'+i);       
          if(radios.checked) {
             question_id = radios.getAttribute("data-item");
             answer_id = radios.getAttribute("data-answer");
             attempt_id = radios.getAttribute("data-attempt");             
             QuestionObj = { 
                question_id:question_id,
                answer_id:answer_id,
            };   
            radiosList.push(QuestionObj)             
         }
     }
      self.props.parent.handleAssessmentAnswer(attempt_id,radiosList,this);               
    },

      handleAssessmentAnswer:function(attempt,resp,component){
        var self = this;
        var questionData ={};
        var response = [];
        var attempt_id = attempt;
        
        for(var idx = 0;idx < resp.length;idx++) {
           responseVal = {"q":resp[idx].question_id,"a":resp[idx].answer_id}
           response.push(responseVal);
        }      
        Api.postJSON('/qna/bulk-assessment-response',{
          "attempt_id": attempt_id,
          "response" : response
        },function(resp) {
           if (resp.success == true){
               self.navigate("#/quiz-result/"+attempt);
            }else{
               $( '#errorContainer' ).html(resp.message);
            }
        });
    },
    updateQuestion : function(question,attempt) {
        this.props.question = question;
        this.props.attempt = attempt;
        this.setState({processing:false});
    },
    handleAnswerSubmit:function(event){
        var obj = $("#qna_submit_form").serializeToObject();
       
        var response = [];
        for(var q in obj ) {
            var qid = q.replace("q_","");
            var aid = obj[q];
            response.push({
                q :qid,
                a:aid
            });
        }
        var data = {
            attempt_id : this.props.attempt.id,
            response:response
        }
        console.log(obj,data);
        event.preventDefault();
        event.stopPropagation(); 
        var self  = this;
        Api.postJSON('/qna/bulk-assessment-response',data,function(resp) {
           if (resp.success == true){
               document.location.href = "/#quiz-result/"+self.props.attempt.id;
            }else{
               $( '#errorContainer' ).html(resp.message);
            }
        });

        return false;
    },
    render:function() {
        var q = this.props.question;
        var a = this.props.attempt;
        var options = [];
        var self = this;    
        var itemText= "";
        var answerItemId = "";
        var attemptId = a.id; 
        var val = [];       
        var idx =0;
        q.forEach(function(item){
           itemText = item.text; 
           itemId = item.id;          
           idx++;             
           options.push((<div className="col-lg-12 fontstyle16pxNormal" style={{"padding-left":"0"}}>{idx})&nbsp;&nbsp;{itemText}</div>));
                item.answers.forEach(function(answerItem){
                    var answerId = "answer_"+answerItem.id;
                    answerItemId = answerItem.id;
                    options.push((<div className="col-lg-3 radioBlock">                
                        <label htmlFor={answerId} className="radio-inline">
                        <input type="radio" id={answerId} 
                            name={"q_"+item.id} 
                            value={answerItemId} 
                            className="input-control question" 
                            data-item={itemId} 
                            data-answer={answerItemId} 
                            data-attempt={attemptId}/> {answerItem.text}
                        </label>
                        </div>
                    ));
                });
        });
        var content = null;
        //onClick={self.handleMultipleAnswer.bind(null,answerItemId)}
        if (this.state.processing) {
            content = (<LoadingIcon />); 
        } else {
            content = (<div>              
                <fieldset ><div className="form-group" >{options}</div></fieldset>
                <div className="height10 clearfix"></div>
                <button style={{"display":"table","margin":"20px auto"}} className="btn text-center orangeBtn" >Save</button>
                 <div id="errorContainer"></div> 
                <div className="height10 clearfix"></div>
            </div>);
        }        
        return (
            <div className="question-block clearfix"> 
                <div className="headingDescription">
                    <p style={{"margin":"10px 0 10px"}}>
                       <span id="questionnaireSvg"></span>
                       <h3>Discover your Dosha Type</h3>
                    </p>               
                    <p>
                        This part of the quiz gathers information about your basic nature—the way you were as a child or the basic patterns that have been true most of your life. If you developed an illness in childhood or as an adult, think of how things were for you before that illness. If more than one quality is applicable in each characteristic, choose the one the applies the most.
                    </p>
                    <p>
                        <strong>For fairly objective physical traits, your choice will usually be obvious. For mental traits and behavior, which are more subjective, you should answer 
                            according to how you have felt and acted most of your life, or at least in the past few years.
                        </strong>
                    </p>
                </div>
                <p><b>The Dosha Quiz</b></p>
                <form id="qna_submit_form" onSubmit={this.handleAnswerSubmit}>
                {content}
                </form>
            </div>
        );
    }
});

var AssessmentDoshaResult = React.createClass({  
    reTakeQuiz:function(){
            document.location.href = "#quiz/1";
    },  
    render:function(){
        $("html, body").animate({ scrollTop: 0 }, "slow");
        var resp = this.props.data.result;
        var rows = [];
        resp.items.forEach(function(item){
               rows.push((<tr><td><b>{item.name}:</b></td><td>{item.score}</td></tr>))               
        });
        var rows2 = [];
        var doshas = [];
        resp.dosha.forEach(function(dosha) {
            rows2 = [];
            dosha.characteristics.forEach(function(item){
                rows2.push((<div><div><strong>{item.name}:</strong></div><div className="text-mute" style={{"color":"#929497"}}>{item.info}</div><br/></div>))
            });
            doshas.push((
                <div>                    
                    <p>{dosha.description}</p>
                    
                    <p><strong>{dosha.name} Characteristics</strong></p>  
                    {rows2}                                   
                </div>
            ));
        }) 
        return (
        <div className="questionnaireDiv">
            <p>
               <span id="questionnaireSvg"></span>
               <h3 style={{"position":"relative","top":"-10px"}}>Dosha Quiz Results</h3>
            </p>             
            <div className="text-center">
                <div className="fontstyle24pxBold">Your basic nature is</div>
                <img className="DetailsDiv" src={resp.image} />
            </div>
            <div>
                <table border="1" className="table table-bordered" style={{"width":"19%","margin":"0 auto"}}>
                    <tr><th className="colspan">Score</th><th className="emptyth"></th></tr>
                        {rows}
                </table>
                {doshas}                
            </div> 
            <button style={{"display":"table","margin":"20px auto"}} className="btn text-center orangeBtn" onClick={this.reTakeQuiz}>Retake the Quiz</button>                  
        </div>)
    }
});

var QustionnaireCard = React.createClass({
	mixins:[ServerPostMixin],
	getInitialState:function(){
    	return {
    	}
	},
	componentDidMount:function(){ 
		var self = this;
        Api.getData('/qna/assessment-list',{},function(resp){
            console.log(resp);
            for(var idx =0;idx < resp.data.length;idx++) {
                if (resp.data[idx].result_rule_id == 'dosha_result') {
                    $("#qna_start_link").attr("href","/#quiz/"+resp.data[idx].id);
                }
            }
        });
	},	
	render:function() { 
	    return (<div className="QustionnaireLoader pointer custom-panel">
			<a id="qna_start_link" href="#">
	            <div className="panel-heading" >
					 <span id="questionnaireSvg"></span>
               		 <span className="fontstyle16pxNormal" style={{"position": "relative","top": "6px"}}>Discover your Dosha Type</span>
				</div>
				<hr/>
				<div className="panel-image midImage" >

					<img src="/assets/img/jiyo/qna/Cover-Image-Vata-Pitta-Kapha.png" className="img-responsive pointer" />
				</div>
				<div className="panel-body">
						
				</div></a>
			</div>
	    );
	}
});


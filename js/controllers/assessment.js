var AssessmentRouteController  = Backbone.Router.extend({
    routes: {
        "assessments": "listAssessments",
        "assessment/:id": "loadAssessment",
        "quiz/:id": "attemptBulkAssessment",
        "quiz-result/:id":"showBulkAssessmentResult",
        "assessment-result/:id":"showAssessmentResult",
    },
    listAssessments : function() {
        checkAndRender("LoadingIcon",{},'jiyo_content_area');
        Api.getData('/qna/assessment-list',{},function(resp){ 
            console.log('rendeing assessments');
            checkAndRender("HtmlListGroup",{
                items:resp.data ,
                baseUrl:"#assessment/"
            },'jiyo_content_area');
        });
    }, 
   showBulkAssessmentResult:function(id){
        Api.getData('/qna/attempt-result/'+id,{ },function(response){  
             checkAndRender("AssessmentDoshaResult", {data : response.data},'jiyo_content_area');
        });
    },
    showAssessmentResult:function(id){
        var self = this;
          Api.getData('/qna/attempt-result/'+id,{ },function(resp){ 
             checkAndRender("HtmlDoshaResult", {data : resp.data},'jiyo_content_area');
         });
    },
    handleAnswer:function(resp,component){
        var self = this;
         Api.postData('/qna/assessment-response',{
            question_id : self.question.id,
            attempt_id : self.attemptId,
            answer_id : resp
         },function(resp){ 
            self.question = resp.data.question;
            if (resp.data.question){
                 component.updateQuestion(resp.data.question,resp.data.attempt);
            } else {
               self.navigate("#/assessment-result/"+resp.data.attempt.id,{trigger:true});
            }
         });
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
    attemptBulkAssessment: function(id) {
        var self = this;
        console.log('Loading bulk');
        checkAndRender("LoadingIcon",{  },'jiyo_content_area');
        Api.getData('/qna/attempt-assessment/'+id,{},function(r1){
            Api.getData('/qna/bulk-assessment-questions/'+r1.data.attempt.id,{},function(resp){
                self.attemptId =  resp.data.attempt.id;
                self.attempt = resp.data.attempt; 
                self.question = resp.data.questions;
                checkAndRender("AssessmentQuestionObject",{
                        question:resp.data.questions, 
                        attempt:self.attempt,
                        parent:self
                },'jiyo_content_area');
            });
        });     
    },
    loadAssessment : function(id) {
        var self = this;
        checkAndRender("LoadingIcon",{  },'jiyo_content_area');
        Api.getData('/qna/attempt-assessment/'+id,{},function(resp){
            self.attemptId =  resp.data.attempt.id;
            self.attempt = resp.data.attempt;
            self.question = resp.data.question;
            checkAndRender("HtmlQuestionObject",{
                    question:resp.data.question , 
                    attempt:self.attempt,
                    parent:self
                },'jiyo_content_area');
         });
    },
    defaultRoute:function() {
        if (gAppConfig.path == '/user/insights') {
            checkAndRender("ProfileInsightsPanel",paramObj,"jiyo_content_area");
        } else {
            this.navigate("#discover",{trigger:true});
        }
    }
});


 
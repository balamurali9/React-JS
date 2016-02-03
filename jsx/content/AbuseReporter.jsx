var ContentAbuseReporter = React.createClass({
  mixins : [ServerPostMixin],
  submitReportComment:function(event){
    $("#report_abuse_response").removeClass().addClass('hidden');
    var data = $("#report_abuse_form").serializeToObject();
    $('#report-abuse-button').attr('disabled','disabled');
    Api.postData("/content/report-comment",data,function(response){
      if (response.success) {
        $("#report_abuse_response").html(response.message);
        $("#report_abuse_response").removeClass().addClass('alert alert-success form-alert-message');

         setTimeout(function(){
            $("#report_abuse_modal").modal('hide');
             $("#report_type").val('');
             $("#report_text").val('');
             JiyoEvent.fire('report_popup_close');
         },2000);
      } else {
      $("#report_type").val('');
    $("#report_text").val('');
        $("#report_abuse_response").html(response.message);
        $("#report_abuse_response").removeClass().addClass('alert alert-warning form-alert-message');
      }
      $('#report-abuse-button').removeAttr('disabled');
    });
    return this.stopEvent(event)
  },
  render: function(){
    var reportOptions = {
      'hate_speech' : "Hate speech, violent or crude content",
      'harrassment' : "Harassment",
      'sexist' : 'Sexist Comment',
      'spam' : 'Spam, phishing, or malware',
      'legal' : 'Legal'
    };

    var options = {};
    for(var key in reportOptions ) {
      options[key] = (<HtmlFormSelectOption label={reportOptions[key]} value={key} /> )
    } 

    return (<div className="modal fade" id="report_abuse_modal">
        <div className="modal-dialog">
          <form className="modal-content" id="report_abuse_form" onSubmit={this.submitReportComment}>
          <div className="modal-header">
            <h4 className="modal-title">Report Comment As Abusive</h4>
            <div className="triangle-top"></div>
          </div>
          <div  className="modal-body" >
            <div id="report_abuse_response" ></div>
            <input type="hidden" id="comment_report_id" name="comment_id" /> 
            <HtmlFormSelect name="report_type" items={options} label="Reason"/>
            <HtmlFormGroupTextArea name="report_text" label="Description" /> 
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
            <button className="btn btn-primary" id="report-abuse-button">Report </button>
          </div>
          </form> 
        </div> 
      </div>)
  }
})

function ArticleForm() {
    var $form = null;
    var $content = null;
    var addText = function() {        
        var _tmpl = _.template($('#template-article-content-text').html(), 
                               {type: 'text', content_idx: $content.find('.article-content-item').length});
        $content.append(_tmpl);                           
    }
    var addMedia = function(type) {        
        var $uploadElm = $(_.template($('#template-article-content-media').html(), 
                               {type: type, content_idx: $content.find('.article-content-item').length}));
        $content.append($uploadElm); 
        var uploadOpt = {
            upload_url:'/media/upload',
            input_label: 'Choose '+ type +' file..',
            max_upload_size: 5242880, //5MB
            data: {},
            success: function(response) {
                if(!response.success) { return false; }
                $uploadElm.find('input.uploaded_file').val(response.data.file_system_name);
                $uploadElm.find('label span').text(response.data.file_name)
            }
        };
        switch(type)  {
            case 'image':
                uploadOpt.allow_extensions = 'gif|jpg|jpeg|png|bmp';
            break;
            case 'audio':
                uploadOpt.allow_extensions = 'mp4|mp3';
                uploadOpt.max_upload_size = 52428800; //50MB
            break;
            case 'video':
                uploadOpt.allow_extensions = 'mp4|webm|avi|wmv|mkv|flv|dvi|h264|avc|mov|vod|dat|3gp|mpg|m4v|mtsxvid';
                uploadOpt.max_upload_size = 524288000; //500MB
            break;
        }
        $uploadElm.find('.upload_item').inlineupload(uploadOpt);
    }
    var addYoutubeMedia = function() {

    }
    this.init = function() {
        $form = $('#form-edit-article');
        $editor = $form.find('#editor');
        $form.submit(function() {
           console.log($editor.cleanHtml());
           $('#inp_article_body').val($editor.cleanHtml())
        });
        $editor.wysiwyg({upload:{
                                url:'/story/upload-image-to-gallery',
                                max_size: 524288000, //500MB
                                data: {},
                                extensions:'gif|jpg|jpeg|png|bmp',
                                success: function(response) {
                                    console.log(response);
                                    if(!response.success) { return false; }
                                    
                                    if(response.data.media_id) {
                                        //register the media information with the element
                                        var $elm = $('#media-'+ response.data.data_media_id);
                                        $elm.attr('data-uploaded-media', response.data.content_url);
                                        $elm.attr('data-media-id', response.data.media_id);
                                        $elm.attr('src', response.data.content_url);
                                    }
                                }
                            }
                          });
    }
}
var ProfileStoryCreateModal = React.createClass({
	mixins : [ServerPostMixin],
    componentDidMount:function(){
		var self = this;
		var formArticle = new ArticleForm();
                formArticle.init();
		JiyoEvent.subscribe('showBeingCreateModal',function(data){
			if (!data ) {
                self.clearStoryModalInputs();				
			} else {
				$("#story_modal_title").val(data.title);
				$('#editor').html(data.html_content);
				$("#story_id").val(data.id);
			}
			$("#WellBeingCreateModalID").modal('show');
		});
    },
	handleStorySubmit:function(status){
	$("#wellbeing_story_response").removeClass().addClass('hidden');
		var self = this;
		var data = $('#form-edit-article').serializeToObject();
		data.content = $('#editor').html();
		data.status = status;

		var url ='/story/create/';
		if (data.story_id != "" ) {
			url = '/story/update/'+data.story_id;
		}
			  
		Api.postData(url,data,function(response){
		   if (response.success) {
				if(status == 'DRAFT') {
					$('#story_publish_button').attr('disabled','disabled');
				} else if(status == 'PUBLISHED') {
					$('#story_draft_button').attr('disabled','disabled');
				}
				$("#wellbeing_story_response").html(response.message);
				$("#wellbeing_story_response").removeClass().addClass('alert alert-success form-alert-message');
				 setTimeout(function(){
						$("#WellBeingCreateModalID").modal('hide');
						$("#title").val('');
						$("#editor").html('');
						$("#wellbeing_story_response").html('');
						JiyoEvent.fire('reload_stories','TRASH');
						JiyoEvent.fire('reload_stories','PUBLISHED');
						JiyoEvent.fire('reload_stories','DRAFT');
				 },2000);
						JiyoEvent.fire('reload_stories','TRASH');
						JiyoEvent.fire('reload_stories','PUBLISHED');
						JiyoEvent.fire('reload_stories','DRAFT');	 
		   } else {
				$("#wellbeing_story_response").html(response.message);
				$("#wellbeing_story_response").removeClass().addClass('alert alert-warning form-alert-message');
		   }
		});
		
		return false;
	},
	clearStoryModalInputs:function(){
        $("#story_modal_title").val("");
		$("#story_id").val("");		
		$("#editor").html('');
	    $('#story_publish_button').removeAttr('disabled');
	    $('#story_draft_button').removeAttr('disabled');
	    $("#wellbeing_story_response").html('');
	    $("#wellbeing_story_response").removeClass();
	},
    render: function () {
        return (
			<div className="modal fade JiyoDefaultModalWindow" tabindex="-1" 
				role="dialog" 
				aria-labelledby="myModalLabel" 
				aria-hidden="false" id="WellBeingCreateModalID">
				<div className="modal-dialog modal-lg-channel">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button"  onClick={this.clearStoryModalInputs} className="close btn btn-link" style={{ outline: "0px"}} data-dismiss="modal" aria-label="Close">
								<i className="ion-ios-close-empty" style={{ '' :'none', 'fontSize':'42px', 'line-height':'42px'}}></i>
							</button>
							<span className="modal-title">
								<div>Write a Wellbeing Story</div>
							</span>
						</div>
						<div className="modal-body clearfix">
						<div id="wellbeing_story_response" ></div>
							<form id="form-edit-article"  role="form" name="storySubmitForm" method="post">
							  <div className="form-group">
								<label for="title">Story Title</label>
								<input type="text"  name="title"   className="form-control" id="story_modal_title" placeholder="Title" />
								<input type="hidden" id="story_id" name="story_id" />
							  </div>
							  <div className="form-group">
								<label>Story</label>
									<div className="article-content">			
										<div className="btn-toolbar" data-role="editor-toolbar" data-target="#editor">
											<div className="btn-group">
											  <a className="btn dropdown-toggle" data-toggle="dropdown" title="Font"><i className="fa fa-font"></i><b className="caret"></b></a>
												<ul className="dropdown-menu">
													<li><a data-edit="fontName Serif" style={{'font-family':'Serif'}}>Serif</a></li>
													<li><a data-edit="fontName Sans" style={{'font-family':'Sans'}}>Sans</a></li>
													<li><a data-edit="fontName Arial" style={{'font-family':'Arial'}}>Arial</a></li>
													<li><a data-edit="fontName Arial Black" style={{'font-family':'Arial Black'}}>Arial Black</a></li>
													<li><a data-edit="fontName Courier" style={{'font-family':'Courier'}}>Courier</a></li>
													<li><a data-edit="fontName Courier New" style={{'font-family':'Courier New'}}>Courier New</a></li>
													<li><a data-edit="fontName Comic Sans MS" style={{'font-family':'Comic Sans MS'}}>Comic Sans MS</a></li>
													<li><a data-edit="fontName Helvetica" style={{'font-family':'Helvetica'}}>Helvetica</a></li>
													<li><a data-edit="fontName Impact" style={{'font-family':'Impact'}}>Impact</a></li>
													<li><a data-edit="fontName Lucida Grande" style={{'font-family':'Lucida Grande'}}>Lucida Grande</a></li>
													<li><a data-edit="fontName Lucida Sans" style={{'font-family':'Lucida Sans'}}>Lucida Sans</a></li>
													<li><a data-edit="fontName Tahoma" style={{'font-family':'Tahoma'}}>Tahoma</a></li>
													<li><a data-edit="fontName Times" style={{'font-family':'Times'}}>Times</a></li>
													<li><a data-edit="fontName Times New Roman" style={{'font-family':'Times New Roman'}}>Times New Roman</a></li>
													<li><a data-edit="fontName Verdana" style={{'font-family':'Verdana'}}>Verdana</a></li>
												</ul>
											  </div>
											<div className="btn-group">
											  <a className="btn dropdown-toggle" data-toggle="dropdown" title="Font Size"><i className="fa fa-text-height"></i>&nbsp;<b className="caret"></b></a>
												<ul className="dropdown-menu">
												<li><a data-edit="fontSize 5"><span size="5">Huge</span></a></li>
												<li><a data-edit="fontSize 3"><span size="3">Normal</span></a></li>
												<li><a data-edit="fontSize 1"><span size="1">Small</span></a></li>
												</ul>
											</div>
											<div className="btn-group" role="group">
											  <a className="btn" data-edit="bold" title="Bold (Ctrl/Cmd+B)"><i className="fa fa-bold"></i></a>
											  <a className="btn" data-edit="italic" title="Italic (Ctrl/Cmd+I)"><i className="fa fa-italic"></i></a>
											  <a className="btn" data-edit="strikethrough" title="Strikethrough"><i className="fa fa-strikethrough"></i></a>
											  <a className="btn" data-edit="underline" title="Underline (Ctrl/Cmd+U)"><i className="fa fa-underline"></i></a>
											</div>
											<div className="btn-group">
											  <a className="btn" data-edit="insertunorderedlist" title="Bullet list"><i className="fa fa-list-ul"></i></a>
											  <a className="btn" data-edit="insertorderedlist" title="Number list"><i className="fa fa-list-ol"></i></a>
											  <a className="btn" data-edit="outdent" title="Reduce indent (Shift+Tab)"><i className="fa fa-indent"></i></a>
											  <a className="btn" data-edit="indent" title="Indent (Tab)"><i className="fa fa-outdent"></i></a>
											</div>
											<div className="btn-group">
											  <a className="btn" data-edit="justifyleft" title="Align Left (Ctrl/Cmd+L)"><i className="fa fa-align-left"></i></a>
											  <a className="btn" data-edit="justifycenter" title="Center (Ctrl/Cmd+E)"><i className="fa fa-align-center"></i></a>
											  <a className="btn" data-edit="justifyright" title="Align Right (Ctrl/Cmd+R)"><i className="fa fa-align-right"></i></a>
											  <a className="btn" data-edit="justifyfull" title="Justify (Ctrl/Cmd+J)"><i className="fa fa-align-justify"></i></a>
											</div>
											<div className="btn-group">
												<a className="btn" title="Insert picture (or just drag & drop)"><label htmlFor="inp_insert_media"><i className="fa fa-file-image-o"></i></label></a>
											  <input type="file" data-role="magic-overlay" id="inp_insert_media"  data-edit="insertImage" style={{'display': 'none'}}/>
											</div>
											<div className="btn-group">
											  <a className="btn" data-edit="undo" title="Undo (Ctrl/Cmd+Z)"><i className="fa fa-undo"></i></a>
											  <a className="btn" data-edit="redo" title="Redo (Ctrl/Cmd+Y)"><i className="fa fa-repeat"></i></a>
											</div>
											<input type="text" data-edit="inserttext" id="voiceBtn" x-webkit-speech="" />
										</div>
										 <div id="editor" className="editor editorTextArea"></div>
										<input type="hidden" name="content" id="inp_article_body" />
									</div>	
							  </div>
							  <div className="height20"></div>
							  <div className="pull-right">
								<button  id="story_publish_button" className="btn btn-default"  onClick={this.handleStorySubmit.bind(null,'PUBLISHED')} style= {{'margin-right': '5px'}}>Publish</button>
								<button  id="story_draft_button" onClick={this.handleStorySubmit.bind(null,'DRAFT')} className="btn btn-default">Save as Draft</button>
							  </div>
							</form>
						</div>    
					</div>
				</div>
			</div>
		)
	}
});
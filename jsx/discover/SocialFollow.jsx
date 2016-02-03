var SocialFollow = React.createClass({	
	render : function() {
	return (
			<div>
				<div className="InviteFriendsPanel InvitePanelForConnection custom-panel">
					<div className="content">
						<div className="artilce-teaser-panel" style={{"padding":"10px", "marginTop":"10px"}}>
							<div style={{"padding":"0 0 5px 0"}}>
							<h4 className="text-center" style={{"margin-bottom":"18px"}}>Follow us on</h4>
							<hr style={{"margin":"0"}}></hr>
							</div>
							<div className="panel-body" style={{"text-align":"center"}}>
								<a title="Facebook" href="https://www.facebook.com/JiyoYourBetterHalf?fref=ts" target="_blank" className="btn btn-social-icon btn-facebook">
									<i className="fa fa-facebook"></i>
								</a>
								<a title="Twitter" href="https://twitter.com/jiyo4life" target="_blank" className="btn btn-social-icon btn-twitter" style={{"margin":"0 10px 0 10px"}}>
									<i className="fa fa-twitter"></i>
								</a>
								<a title="Instagram"  href="https://instagram.com/jiyo4life" target="_blank" className="btn btn-social-icon btn-instagram">
									<i className="fa fa-instagram"></i>
								</a>
								<a  title="Pinterest"  href="https://www.pinterest.com/jiyo4life/" target="_blank" className="btn btn-social-icon btn-pinterest"  style={{"margin":"0 0 0 10px"}}>
									<i className="fa fa-pinterest"></i>
								</a>
							</div>
						</div>
					</div>
				</div> 
			</div>
		 );
  }
});
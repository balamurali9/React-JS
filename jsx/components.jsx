var TextEllipsis = React.createClass({
  render: function() {
    var maxlimit = this.props.maxlimit;
    var text = this.props.text;
    if (text.length > maxlimit && text.length > 2) {
        text = text.substring(0,maxlimit-2)+"...";
    }  
    return (
      <div>{text}</div>
    );
  }
});
var LoadingIcon = React.createClass({
    render:function(){        
        return (<img src="/assets/img/loading.gif" className="loading_gif" />);
    }
}) ;

var LoadingIndicator = React.createClass({
    render:function(){
        var st = {
            width:"30px",
            height:"30px"
        }
        return (<div className="text-center" style={{padding:"20px"}}><LoadingIcon /></div>);
    }
}) ;
var ValPropSetMixin = {
    handleProps:function(props){  
        $(this.refs.inputElement.getDOMNode()).val(props.val);
    },
    componentDidMount:function(){
        this.handleProps(this.props); 
    },
    componentWillReceiveProps:function(newProps) {
        this.handleProps(newProps);
    }
};
var HtmlFormErrorMessage = React.createClass({
    render:function() {
        var p = this.props;
        var cls = 'hidden'
        if (p.errorMsg && p.errorMsg != '' ) {
            cls = "text-danger";
        } else {
            p.errorMsg = '';
        }
        return ( <div className={cls}    dangerouslySetInnerHTML={{__html: p.errorMsg}} ></div>);
    }
});
var HtmlFormGroupText = React.createClass({
    mixins:[ValPropSetMixin],
    render:function() {

        var p = this.props;
        var cls = 'hidden'
        if (p.errorMsg && p.errorMsg != '') {
            cls = "text-danger";
        } else {
            p.errorMsg = '';
        } 
        var ph = p.label;
        if (p.placeholder) {
            ph = p.placeholder;
        }
        return (
            <div className={"form-group "+p.name}>
              <label className="control-label" 
                htmlFor={p.name}>{p.label}</label>
              <input className="form-control" 
                id={p.name} ref="inputElement" autocomplete="off" placeholder={ph} type="text" name={p.name} /> 
                <div className={cls} >{p.errorMsg}</div>
            </div>
        );
    }
});
var HtmlFormColor = React.createClass({
    mixins:[ValPropSetMixin],
    render:function() {

        var p = this.props;
        var cls = 'hidden'
        if (p.errorMsg && p.errorMsg != '') {
            cls = "text-danger";
        } else {
            p.errorMsg = '';
        }
        return (
            <div className="form-group">
              <label className="control-label" 
                htmlFor={p.name}>{p.label}</label>
              <input  ref="inputElement" className="form-control" autocomplete="off"
                id={p.name} type="color" name={p.name} /> 
                 <div className={cls} >{p.errorMsg}</div>
            </div>
        );
    }
});
var HtmlFormGroupPassword = React.createClass({
    mixins:[ValPropSetMixin],
    render:function() {
        var p = this.props; 
        var cls = 'hidden'
        if (p.errorMsg && p.errorMsg != '') {
            cls = "text-danger";
        } else {
            p.errorMsg = '';
        }
        var ph = p.label;
        if (p.placeholder) {
            ph = p.placeholder;
        }
        return (
            <div className={"form-group "+p.name}>
                <label className="control-label" 
                    htmlFor={p.name}>{p.label}</label>
                <input  ref="inputElement" className="form-control" autocomplete="off"
                    id={p.name} placeholder={ph} type="password" name={p.name} />

                <div className={cls} >{p.errorMsg}</div>
            </div>
        );
    }
});
var HtmlFormGroupTextArea = React.createClass({
    mixins:[ValPropSetMixin],
    render:function() {
        var p = this.props;
        var p = this.props;
        var cls = 'hidden'
        if (p.errorMsg && p.errorMsg != '') {
            cls = "text-danger";
        } else {
            p.errorMsg = '';
        }
        return (
            <div className="form-group">
              <label className="control-label" 
                htmlFor={p.name}>{p.label}</label>
              <textarea  ref="inputElement" rows="5" className="form-control" 
                name={p.name} id={p.name}></textarea> 
                <div className={cls} >{p.errorMsg}</div>
            </div> 
        );
    }
});
var HtmlH1 = React.createClass({
    render : function(){
        return (
            <h1>{this.props.text}</h1>
        );
    }
});

var HtmlH2Msg = React.createClass({
    render : function(){
        return (
            <h2 className="text-center">{this.props.text}</h2>
        );
    }
});
var HtmlFormSelect = React.createClass({
    mixins:[ValPropSetMixin],
    render:function() {
        var p = this.props;
        return (
            <div className="form-group">
              <label className="control-label" 
                htmlFor={p.name}>{p.label}</label>
              <select ref="inputElement" name={p.name} id={p.name}
                className="form-control">
                {p.items}
              </select>
            </div>
        );
    }
});
var HtmlFormSelectOption = React.createClass({
    render:function() {
        var p = this.props;
        return (<option value={p.value} >{p.label}</option>);
    }
});

var ButtonSelectionMap = React.createClass({
    render:function(){
        var buttons =[];
        var buttonMap = this.props.buttonMap;
        for(var key in buttonMap) {
            var title = buttonMap[key];
            if (key == this.props.selected) {
                 buttons.push(<button onClick={this.props.handleClick.bind(null,key)} 
                className="btn btn-xs btn-success">{title}</button>);
            } else {
                buttons.push(<button onClick={this.props.handleClick.bind(null,key)} 
                className="btn btn-xs btn-primary">{title}</button>);
            }
            
        }
        return <div className="btn-group">{buttons}</div>
    }
});


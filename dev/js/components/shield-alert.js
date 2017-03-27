import React from 'react';

class ShieldAlert extends React.Component {
    constructor(props){
        super();
        this.state ={
            content:props.content,
            title:props.title,
            onOkFunc:props.onOkFunc
        }
    }

    render() {
        return (<div className="shield">
            <div className="shield-alert">
                <div className="alert-header">{this.state.title}</div>
                <div className="alert-content">
                    {this.state.content}
                </div>
                <div className="alert-footer">
                    <button onClick={e=>{this.state.onOkFunc()}} className="btn btn-finish">OK</button>
                </div>
            </div>
        </div>);
    }
}

ShieldAlert.defaultProps = {
}


export default ShieldAlert;
import React from 'react';

class Pager extends React.Component{

    constructor(){
        super();
        this.state = {
            count:0
        }
    }

    componentWillMount(){
        this.setState({count:this.props.count});
    }
    
    componentWillUpdate(){
        console.log('Page update!')
    }

    componentWillReceiveProps(){
        this.setState({count:this.props.count});
    }

    render(){
        console.log(this.state)
        return (<div>I'm pager！
            <h1>{this.state.count}</h1>
        </div> );
    }
}

export default Pager;
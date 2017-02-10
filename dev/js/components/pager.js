import React from 'react';

class Pager extends React.Component{


    constructor(props){
        super();
        this.state = {
            count:props.count
        }
    }

    componentWillReceiveProps(next){
       this.setState({count:next.count});
    }

    handlePlusOnClick(){
        this.props.plusOnClick(this.state.count)
    }

    render(){
        return (<div>I'm pager！
            <h1>{this.state.count}</h1>
            <button onClick={()=>{
                this.handlePlusOnClick();
            }}>+++++</button>
        </div> );
    }
}

export default Pager;
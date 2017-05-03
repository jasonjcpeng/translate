/**
 *
 * Created by JasonPeng on 2017/4/26.
 */
import React from 'react';

class Pagination extends React.Component {
    constructor(props) {
        super();
    }

    render() {
        return (
            <div className="component-option-bar">
                <ul style={{float:'left'}}>
                    <li className="first-child">上一页</li>
                </ul>
                <ul style={{float:'left'}}>
                    <li className="first-child">1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                </ul>
                <ul style={{float:'left'}}>
                    <li className="first-child">下一页</li>
                </ul>
                <ul style={{float:'left'}}>
                    <li className="normal-content">跳转至第<input type="number"/>页</li>
                    <li className="first-child">跳转</li>
                </ul>
            </div>);
    }

}


export default Pagination;
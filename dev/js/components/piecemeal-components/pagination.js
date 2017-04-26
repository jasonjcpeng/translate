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
                </ul>
                <ul style={{float:'left'}}>
                    <li className="first-child">下一页</li>
                </ul>
            </div>);
    }

}


export default Pagination;
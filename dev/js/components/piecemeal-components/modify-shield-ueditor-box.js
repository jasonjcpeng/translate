import React from 'react';
import classnames from 'classnames';

class ModifyShieldUEditorBox extends React.Component {
    constructor(props) {
        super();
    }


    componentWillUnmount(){
        UE.getEditor(this.props.targetID).destroy();
    }

    componentDidMount() {
        let that = this;
        let editor = UE.getEditor(this.props.targetID, {
            //工具栏
           lang: "zh-cn"
            //字体
            , 'fontfamily': [
                {label: '', name: 'songti', val: '宋体,SimSun'},
                {label: '', name: 'kaiti', val: '楷体,楷体_GB2312, SimKai'},
                {label: '', name: 'yahei', val: '微软雅黑,Microsoft YaHei'},
                {label: '', name: 'heiti', val: '黑体, SimHei'},
                {label: '', name: 'lishu', val: '隶书, SimLi'},
                {label: '', name: 'andaleMono', val: 'andale mono'},
                {label: '', name: 'arial', val: 'arial, helvetica,sans-serif'},
                {label: '', name: 'arialBlack', val: 'arial black,avant garde'},
                {label: '', name: 'comicSansMs', val: 'comic sans ms'},
                {label: '', name: 'impact', val: 'impact,chicago'},
                {label: '', name: 'timesNewRoman', val: 'times new roman'}
            ]
            //字号
            , 'fontsize': [10, 11, 12, 14, 16, 18, 20, 24, 36]
            , autoHeightEnabled: false
            , initialFrameHeight: '300'
            , initialFrameWidth: '100%'
            , readonly: this.props.disabled
        });
        let me = this;
        editor.ready(function (ueditor) {
            let value = me.props.data ? me.props.data : '<p></p>';
            editor.setContent(value);
        });
        editor.addListener( 'selectionchange', function(editor) {
            that.props.onChange(UE.getEditor(me.props.targetID).getContent());
        });
    }


    render() {
        return (
            <script id={this.props.targetID}  name="content" type="text/plain">
            </script>
        )
    }
}


export default ModifyShieldUEditorBox;

import React from 'react';
import classnames from 'classnames';
import FineUploaderTraditional from 'fine-uploader-wrappers'
import Gallery from 'react-fine-uploader'
import 'react-fine-uploader/gallery/gallery.css'

/*
*
* 修改遮罩层中的文件上传组件
*
* */
class ModifyShieldUploadBox extends React.Component{
    constructor(props){
        super();
        this.state = {
            itemFieldData:props.itemFieldData,
            apiData:props.itemFieldData.apiData,
            data:props.data,
            onChange:props.onChange,
            disabled:props.itemFieldData.isDisable||props.disabled
        }
    }

    createPreview(){
        if(this.props.data){
            return <div className="img" onClick={e=>{
                console.log(this.props.disabled)
                if(!this.props.disabled){
                    this.props.onChange('');
                }
            }}><img  src={this.props.data} alt="已上传图片"/></div>
        }else{
            return <div className="img"></div>
        }

    }

    createUploadBox(){
        const uploader = new FineUploaderTraditional({
            options: {
                Core:{
                    multiple:false
                },
                chunking: {
                    enabled: true
                },
                deleteFile: {
                    enabled: true,
                    endpoint: ''
                },
                request: {
                    endpoint: ''
                },
                cors:{
                    expected:true,
                    sendCredentials:true
                },
                retry: {
                    enableAuto: false
                },
                callbacks: {
                    onComplete:(id, name, response)=>{
                        console.log(response)
                    },
                    onError:(id, name, errorReason, xhrOrXdr)=> {
                        this.props.sendError(uploader.qq.format("Error on file number {} - {}.  Reason: {}", id, name, errorReason));
                        console.log(uploader.qq.format("Error on file number {} - {}.  Reason: {}", id, name, errorReason));
                    }
                }
            }
        })
            return <div className="upload"><Gallery uploader={uploader} /></div>;
    }

    render(){
        if(this.props.disabled){
            return <div key={this.props.targetID} className="check-box-group drop">{this.createPreview()}</div>
        }else{
            return <div key={this.props.targetID} className="check-box-group drop">{this.createUploadBox()}{this.createPreview()}</div>
        }
    }
}


export default ModifyShieldUploadBox;

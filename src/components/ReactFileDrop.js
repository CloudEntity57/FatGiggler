import React, {Component} from 'react';
import FileDrop from "react-file-drop";

class MyUploader extends Component{
     _handleFileDrop(files, event) {
        console.log(files, event);
    }

    render() {
        return (
            var styles = {border: "1px solid black", width: 600, color: "black", padding: 20};

            <div className="my-uploader" style={{styles}}>
                This is the ".my-uploader" div. Try dragging a file!
                <FileDrop frame={document} onDrop={this._handleFileDrop}>
                    Drop some files here!
                </FileDrop>
            </div>
        );
    }
}

export default MyUploader;

import React from 'react';
import ReactDOM from 'react-dom';
import TinyMCE from 'react-tinymce'; 

class EditorContainer extends React.Component {
	constructor(props) {
		super(props);
	}

	handleEditorChange(e) {
		console.log(e);
    console.log('Content was updated:', e.target.getContent());
  }

	triggerFormSubmit() {
		console.log(this);
		console.log('savehtml clicked');
	}

	componentDidMount() {
		console.log(this);
		window.addEventListener('saveHTMLButtonClicked', (e) => this.triggerFormSubmit(e) );
	}

	render() {
		return (
			<div>
			{this.props.activeEditors.map((cv, i) => {
				return <div className="editorItem">
					<h1>{cv.name}</h1>
					<TinyMCE editorName={cv.name} content={cv.content} config={cv.config} onChange={this.handleEditorChange} key={i}></TinyMCE>
				</div>
			})}
			</div>
		)
	}
}

export default EditorContainer;
import React from 'react';
import ReactDOM from 'react-dom';
import TinyMCE from 'react-tinymce'; 

class EditorContainer extends React.Component {
	constructor() {
		super();
	}

	handleEditorChange(e) {
		console.log(e);
    console.log('Content was updated:', e.target.getContent());
  }

	triggerFormSubmit(e) {
		// React.Children.map( () => { console.log(this)} )
		// console.log(wat)
		console.log(e)
		console.log('savehtml clicked');
	}

	componentDidMount() {
		console.log('---editorContainer---')
		console.log(this);
		window.addEventListener('saveHTMLButtonClicked', (e) => {
			console.log('trigger form submit');
			this.triggerFormSubmit(e);
		})
		// this.refs.forEach((cv)=>{
		// 	console.log(cv)
		// })
		let hey = ReactDOM.findDOMNode(this.refs.editorNumber);
		console.log(hey);
		hey.addEventListener('saveHTMLButtonClicked', (e) => this.triggerFormSubmit(e) );
	}

	render() {
		return (
			<div className="editorItems">
			{this.props.activeEditors.map((cv, i) => {
				return (
					<div className="editorItem">
						<h1>{cv.editor.name}</h1>
						<TinyMCE 
							id={'editorNumber' + i}
							ref="editorNumber"
							editorName={cv.editor.name} 
							content={cv.editor.content} 
							config={cv.editor.config}
							onChange={this.handleEditorChange}
							key={i} />
					</div>
				)
			})}
			</div>
		)
	}
}

export default EditorContainer;
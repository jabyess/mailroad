import React from 'react';
import ReactDOM from 'react-dom';
import TinyMCE from 'react-tinymce';
import EditorType from './EditorType.jsx';
import textEditorDefinitions from './textEditorDefinitions.js';
import classNames from 'classnames'

class EditorTypes extends React.Component {
	constructor() {
		super();
		this.components = textEditorDefinitions;
		this.buttonStyle = {
			padding: 10,
			margin: 50,
			opacity: 1
		}
	}
	
	componentDidMount() {
		console.log('EditorTypes Mounted');
	}
	handleClose() {
		var container = document.getElementById('editor-types')
		ReactDOM.unmountComponentAtNode(container)
	}
	addComponentToPage() {
		const selected = document.getElementById('componentList').value
		let componentToAdd = new Event('addNewEditorToEditorContainer')
		componentToAdd.detail = selected
		window.dispatchEvent(componentToAdd)
	}

	render() {
		return (
			<div className="editor-types-wrapper">
				<div className="editor-types">
					<button onClick={this.handleClose}>Close</button>
					<button onClick={() => this.addComponentToPage()}>Add</button>
					<select multiple className="editor-types__select" id="componentList">
						{Object.keys(this.components).map((value, i) => {
							return <EditorType key={i} component={value}/>
						})}
					</select>
				</div>
			</div>
		);
	}
}

export default EditorTypes;
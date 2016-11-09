import React from 'react';
import EditorContainer from './EditorContainer.jsx';
import editorDefinitions from './editorDefinitions.js';
import AddButton from './addButton.jsx';
import SaveHTMLButton from './saveHTMLButton.jsx';
import textEditorDefinitions from './textEditorDefinitions.js';
import MainTextEditor from './textEditor.jsx';

class MainContainer extends React.Component {

	constructor() {
		super();
		//should init default editorDefinitions somehow.
		this.state = {
			activeEditors: []
		}
		// this.getCurrentValue = this.getCurrentValue.bind(this)
	}

	addEditorToContainer(event) {
		console.log(textEditorDefinitions[event.detail])
		console.log(this.state.activeEditors);
		this.setState((event) => {
			return this.state.activeEditors.push(textEditorDefinitions[event.detail]) 
		});
	}

	// getCurrentValue(compiledValues) {
	// 	console.log(compiledValues);
	// }

	componentDidMount() {
		window.addEventListener('addNewEditorToEditorContainer', (e) => this.addEditorToContainer(e) );
		this.setState(() => { return this.state.activeEditors.push(textEditorDefinitions.minimalEditor) });
	}

	render () {
		return (
			<container className="main-container">
				<AddButton/>
				<EditorContainer activeEditors={this.state.activeEditors}/>
				<SaveHTMLButton activeEditors={this.state.activeEditors} />
			</container>
		)
	}
}

export default MainContainer;

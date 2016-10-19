import React from 'react';
import EditorContainer from './EditorContainer.jsx';
import editorDefinitions from './editorDefinitions.js';
import AddButton from './addButton.jsx';
import SaveHTMLButton from './saveHTMLButton.jsx';

class MainContainer extends React.Component {

	constructor() {
		super();
		//should init default editorDefinitions somehow.
		this.state = {
			activeEditors: [{
				editor: editorDefinitions.MainMCE
			}]
		}
		// this.buttonEventListener = this.buttonEventListener.bind(this);

	}
	addEditorToContainer(event) {
		this.setState(() => {
			return this.state.activeEditors.push({
				editor: editorDefinitions[event.detail],
				id: 'editorNumber'+(this.state.activeEditors.length + 1)
			}) 
		});
	}

	// getCurrentValue(value) {
	// 	console.log(this);
	// 	console.log(value);
	// }

	componentDidMount() {
		console.log(this);
		window.addEventListener('addNewComponentToEditorContainer', (e) => this.addEditorToContainer(e) );
		// window.addEventListener('saveHTMLButtonClicked', () => {
		// 	console.log('save clicked');
		// 	this.getCurrentValue();
		// });
	}

	render () {
		return (
			<container className="main-container">
				<AddButton/>
				<EditorContainer activeEditors={this.state.activeEditors} />
				<SaveHTMLButton activeEditors={this.state.activeEditors}/>
			</container>
		)
	}
}

export default MainContainer;

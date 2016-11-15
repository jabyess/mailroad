import React from 'react'
import EditorContainer from './EditorContainer.jsx'
import AddButton from './AddButton.jsx'
import SaveHTMLButton from './SaveHTMLButton.jsx'
import textEditorDefinitions from './textEditorDefinitions.js'
import editorDefinitions from './editorDefinitions.js'
import MainTextEditor from './MainTextEditor.jsx'
import NavBar from './NavBar.jsx'

export default class MainContainer extends React.Component {

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
		console.log(this.state.activeEditors)
		this.setState((event) => {
			return this.state.activeEditors.push(textEditorDefinitions[event.detail]) 
		});
	}

	componentDidMount() {
		window.addEventListener('addNewEditorToEditorContainer', (e) => this.addEditorToContainer(e) );
		this.setState(() => { return this.state.activeEditors.push(textEditorDefinitions.minimalEditor) });
	}
	componentWillMount() {
		console.log('will mount')
		// loop through editor logic and render all editors with content inside.
	}

	render () {
		return (
			<container className="main-container">
				<NavBar/>
				<AddButton/>
				<EditorContainer activeEditors={this.state.activeEditors}/>
				<SaveHTMLButton />
			</container>
		)
	}
}

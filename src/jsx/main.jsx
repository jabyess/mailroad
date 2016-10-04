import React from 'react';
import NavBar from './navbar.jsx';
import EditorContainer from './editorContainer.jsx';
import editorDefinitions from './editorDefinitions.js';
import AddButton from './addButton.jsx';
import SaveHTMLButton from './saveHTMLButton.jsx';

class MainContainer extends React.Component {

	constructor() {
		super();
		//should init default editorDefinitions somehow.
		this.state = {
			activeEditors: [editorDefinitions.MainMCE]
		}
	}
	addEditorToContainer(event) {
		this.setState(() => { return this.state.activeEditors.push(editorDefinitions[event.detail]) });
	}

	componentWillMount() {

	}

	componentDidMount(){
		console.log(this);
		window.addEventListener('addNewComponentToEditorContainer', (e) => this.addEditorToContainer(e) );
	}

	render () {
		return (
			<container className="main-container">
				<AddButton/>
				<EditorContainer activeEditors={this.state.activeEditors}/>
				<SaveHTMLButton sectionComponents={this.props}/>
			</container>
		)
	}
}

export default MainContainer;

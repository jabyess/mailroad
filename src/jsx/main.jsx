import React from 'react';
import ReactDOM from 'react-dom';
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

	componentWillMount() {

	}

	componentDidMount(){
		console.log(this);
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

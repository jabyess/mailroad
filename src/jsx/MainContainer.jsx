import React from 'react'
import EditorContainer from './editor/EditorContainer.jsx'
import SaveHTMLButton from './SaveHTMLButton.jsx'
import CompileHTMLButton from './CompileHTMLButton.jsx'
import EditorTypes from './editor/EditorTypes.jsx'
import MainTextEditor from './editor/MainTextEditor.jsx'
import NavBar from './NavBar.jsx'

export default class MainContainer extends React.Component {

	constructor() {
		super();
		//should init default editorDefinitions somehow.
	}

	render () {
		return (
			<container className="main-container">
				<NavBar />
				<EditorContainer params={this.props.params} />
				<SaveHTMLButton />
				<CompileHTMLButton />
			</container>
		)
	}
}

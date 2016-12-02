import React from 'react'
import EditorContainer from './EditorContainer.jsx'
import AddButton from './AddButton.jsx'
import SaveHTMLButton from './SaveHTMLButton.jsx'
import CompileHTMLButton from './CompileHTMLButton.jsx'
import MainTextEditor from './MainTextEditor.jsx'
import NavBar from './NavBar.jsx'

export default class MainContainer extends React.Component {

	constructor() {
		super();
		//should init default editorDefinitions somehow.
	}
	componentDidMount() {
		console.log('maincontainer props', this.props);
	}
	
	render () {
		return (
			<container className="main-container">
				<NavBar/>
				<AddButton/>
				<EditorContainer params={this.props.params} />
				<SaveHTMLButton />
				<CompileHTMLButton />
			</container>
		)
	}
}

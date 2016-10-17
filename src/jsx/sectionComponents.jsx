import React from 'react';
import ReactDOM from 'react-dom';
import TinyMCE from 'react-tinymce';
import SectionComponentList from './sectionComponentList.jsx';
import editorDefinitions from './editorDefinitions.js';

class SectionComponents extends React.Component {
	constructor() {
		super();
		this.components = editorDefinitions;
		this.buttonStyle = {
			padding: 10,
			margin: 50,
			opacity: 1
		}
	}
	
	componentDidMount() {
		console.log('SectionComponents Mounted');
	}
	handleClose() {
		var container = document.getElementById('sectionComponentModal');
		ReactDOM.unmountComponentAtNode(container);
	}
	addComponentToPage() {
		const selected = document.getElementById('componentList').value;
		let componentToAdd = new Event('addNewComponentToEditorContainer');
		componentToAdd.detail = selected;
		window.dispatchEvent(componentToAdd);
	}

	render() {
		return (
			<div className="sectionComponentModalWrapper">
				<div className="sectionComponentModal">
					<button onClick={this.handleClose}>Close</button>
					<button onClick={() => this.addComponentToPage()}>Add</button>
					<select multiple className="componentList" id="componentList">
						{Object.keys(this.components).map((value) => {
							return <SectionComponentList component={value}/>
						})}
					</select>
				</div>
			</div>
		);
	}
}

export default SectionComponents;
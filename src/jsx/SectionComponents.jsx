import React from 'react';
import ReactDOM from 'react-dom';
import TinyMCE from 'react-tinymce';
import SectionComponent from './SectionComponent.jsx';
import textEditorDefinitions from './textEditorDefinitions.js';

class SectionComponents extends React.Component {
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
		console.log('SectionComponents Mounted');
	}
	handleClose() {
		var container = document.getElementById('sectionComponentModal');
		ReactDOM.unmountComponentAtNode(container);
	}
	addComponentToPage() {
		const selected = document.getElementById('componentList').value;
		let componentToAdd = new Event('addNewEditorToEditorContainer');
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
						{Object.keys(this.components).map((value, i) => {
							return <SectionComponent key={i} component={value}/>
						})}
					</select>
				</div>
			</div>
		);
	}
}

export default SectionComponents;
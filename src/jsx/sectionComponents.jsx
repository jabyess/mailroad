import React from 'react';
import ReactDOM from 'react-dom';
import TinyMCE from 'react-tinymce';
import SectionComponentList from './sectionComponentList.jsx';

class Header extends React.Component {
	render() {
		return (
			<TinyMCE 
			content="<span>Header</span>"
			config={{
				toolbar: 'undo redo | bold italic'
			}}
			/>
		);
	}
}

class Byline extends React.Component {
	render() {
		return (
			<TinyMCE 
			content="<span>Byline</span>"
			config={{
				toolbar: 'undo redo | bold italic'
			}}
			/>
		);
	}
};

class SectionComponents extends React.Component {
	constructor() {
		super();
		this.buttonStyle = {
			padding: 10,
			margin: 50,
			opacity: 1
		}
	}
	
	componentWillMount() {
		this.components = ['Byline', 'Header'];
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
		console.log(this);
		this.handleClose();
	}

	render() {
		return (
			<div className="sectionComponentModalWrapper">
				<div className="sectionComponentModal">
					<button onClick={this.handleClose}>Close</button>
					<button onClick={() => this.addComponentToPage()}>Add</button>
					<select multiple className="componentList" id="componentList">
						{this.components.map((cv) => {
							return <SectionComponentList component={cv}/>
						})}
					</select>
				</div>
			</div>
		);
	}
}

export default SectionComponents;
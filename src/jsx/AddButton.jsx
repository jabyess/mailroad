import React from 'react';
import ReactDOM from 'react-dom';
import EditorTypes from './EditorTypes.jsx';

class AddButton extends React.Component {
	constructor() {
		super()
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick() {
		ReactDOM.render(
			<EditorTypes/>,
			document.getElementById('editor-types')
		);
	}

	render() {
		return (
			<button 
				className="addButton" 
				onClick={this.handleClick}>Add a thing</button>
		);
	}
};

export default AddButton;
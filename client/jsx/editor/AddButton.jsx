import React from 'react';

class AddButton extends React.Component {
	constructor() {
		super()
		this.handleClick = this.handleClick.bind(this)
		this.state = {
			isEditModeActive: false
		}
	}

	handleClick() {
		console.log('clicked addbutton')
		if(this.props.toggleEditorTypeSelect) {
			this.props.toggleEditorTypeSelect(true)
		}
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
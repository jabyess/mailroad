import React from 'react';
import ReactDOM from 'react-dom';
import SectionComponents from './SectionComponents.jsx';

class AddButton extends React.Component {
	handleClick() {
		ReactDOM.render(
			<SectionComponents/>,
			document.getElementById('sectionComponentModal')
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
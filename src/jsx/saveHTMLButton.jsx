import React from 'react';
// import ReactDOM from 'react-dom';

class SaveHTMLButton extends React.Component {

	anotherClick() {
		
	}

	handleClick() {
		let htmlButtonClicked = new Event('saveHTMLButtonClicked');
		window.dispatchEvent(htmlButtonClicked);
	}

	render() {
		return (
			<button onClick={this.handleClick}>Save HTML</button>
		);
	}
}

export default SaveHTMLButton;
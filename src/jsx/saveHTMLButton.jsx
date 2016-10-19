import React from 'react';

class SaveHTMLButton extends React.Component {
	constructor() {
		super();
		this.handleClick = this.handleClick.bind(this);
	}

	anotherClick() {
		
	}

	handleClick() {
		let htmlButtonClicked = new Event('saveHTMLButtonClicked');
		console.log('dispatch saveHTMLButtonClicked')
		window.dispatchEvent(htmlButtonClicked);
		// this.props.activeEditors.forEach((cv, i) => {
		// 	let wat = document.getElementById(cv.id);
		// 	wat.dispatchEvent(htmlButtonClicked, {detail: 'i'});
		// });
		// window.dispatchEvent(htmlButtonClicked);
	}

	render() {
		return (
			<button onClick={this.handleClick}>Save HTML</button>
		);
	}
}

export default SaveHTMLButton;
import React from 'react'

class SaveHTMLButton extends React.Component {
	constructor() {
		super()
		this.handleClick = this.handleClick.bind(this)
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
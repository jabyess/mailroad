import React from 'react'
import autoBind from 'react-autobind'

class SaveHTMLButton extends React.Component {
	constructor() {
		super()
		autoBind(this, 'handleClick')
	}

	handleClick() {
		console.log('saveHTMLButtonClicked')
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
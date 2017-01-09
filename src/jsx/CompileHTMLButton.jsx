import React from 'react'
import autoBind from 'react-autobind'

export default class CompileHTMLButton extends React.Component {
	constructor() {
		super()
		autoBind(this, 'handleClick')
	}

	handleClick() {
		let compileButtonClicked = new Event('deleteLocalCopy');
		window.dispatchEvent(compileButtonClicked);
	}

	render() {
		return (
			<button onClick={this.handleClick}>Delete Local</button>
		);
	}
}
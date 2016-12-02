import React from 'react'
import autoBind from 'react-autobind'

export default class CompileHTMLButton extends React.Component {
	constructor() {
		super()
		autoBind(this, 'handleClick')
	}

	handleClick() {
		let compileButtonClicked = new Event('compileTemplateFromSource');
		window.dispatchEvent(compileButtonClicked);
	}

	render() {
		return (
			<button onClick={this.handleClick}>Compile HTML</button>
		);
	}
}
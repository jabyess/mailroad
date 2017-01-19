import React from 'react'

export default class CompileHTMLButton extends React.Component {
	constructor() {
		super()
	}

	handleClick() {
		let compileButtonClicked = new Event('compileHTMLTemplate');
		window.dispatchEvent(compileButtonClicked);
	}

	render() {
		return (
			<button onClick={this.handleClick}>Compile HTML</button>
		);
	}
}
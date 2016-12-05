import React from 'react'
import autoBind from 'react-autobind'

export default class EmailControls extends React.Component {
	constructor() {
		super()

	}

	handleDelete() {

	}

	handleCopy() {
		
	}

	componentDidMount () {
		
	}
	

	render() {
		return (
			<div className="email-controls">
				<div className="email-controls__item" onClick={this.handleDelete}>Delete</div>
				<div className="email-controls__item" onClick={this.handleCopy}>Copy</div>
			</div>
		)
	}
}
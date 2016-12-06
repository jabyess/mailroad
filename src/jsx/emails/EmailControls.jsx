import React from 'react'
import autoBind from 'react-autobind'
import classNames from 'classnames'

export default class EmailControls extends React.Component {
	constructor(props) {
		super(props)

		autoBind(this, 'handleDelete')

		this.state = {
			selectedEmails: this.props.selectedEmails
		}


	}

	handleDelete() {
		fetch('/api/deleteEmail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"selectedEmails":	this.state.selectedEmails
			})
		})
		.then((response) => {
			response.text()
			
		})


	}

	handleCopy() {
		
	}

	componentDidMount () {
		
	}

	render() {
		this.classNames = classNames({
			'email-controls__item': true,
			'disabled': this.state.selectedEmails.length > 1 ? true : false
		})

		return (
			<div className="email-controls">
				<div className="email-controls__item" onClick={this.handleDelete}>Delete</div>
				<div className={this.classNames} onClick={this.handleCopy}>Copy</div>
			</div>
		)
	}
}
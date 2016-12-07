import React from 'react'
import autoBind from 'react-autobind'
import classNames from 'classnames'

export default class EmailControls extends React.Component {
	constructor(props) {
		super(props)

		autoBind(this, 'handleDelete', 'handleCopy')

		this.state = {
			selectedEmails: this.props.selectedCheckboxes
		}
	}

	handleDelete() {
		fetch('/api/deleteEmail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"selectedEmails":	Object.keys(this.state.selectedEmails)
			})
		})
		.then((response) => {
			this.props.refreshEmailList()
			return response.text()
			// success toast with # of deleted emails
		})
	}

	handleCopy() {
		fetch('/api/copyEmail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"id":	Object.keys(this.state.selectedEmails)
			})
		})
		.then((response) => {
			this.props.refreshEmailList()
			return response.text()
		})
	}

	render() {
		this.copyClassNames = classNames({
			'email-controls__item': true,
			'disabled': Object.keys(this.state.selectedEmails).length > 1 ? true : false
		})

		return (
			<div className="email-controls">
				<div className="email-controls__item" onClick={this.handleDelete}>Delete</div>
				<div className={this.copyClassNames} onClick={this.handleCopy}>Copy</div>
			</div>
		)
	}
}
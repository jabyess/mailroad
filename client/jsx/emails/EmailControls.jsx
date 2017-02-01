import React from 'react'
import autoBind from 'react-autobind'
import classNames from 'classnames'
import axios from 'axios'

export default class EmailControls extends React.Component {
	constructor() {
		super()

		autoBind(this, 'handleDelete', 'handleCopy')

	}

	handleDelete() {
		const ids = Object.keys(this.props.selectedCheckboxes)
		
		axios.delete('/api/email', {
			headers: {
				'Content-Type': 'application/json'
			},
			params: { id : [...ids] }
		}).then((success) => {
			console.log(success)
			this.props.refreshEmailList()
		}).catch((error) => {
			console.log(error)
		})
		// .then((response) => {
		// 	this.props.refreshEmailList()
		// 	return response.text()
		// 	// success toast with # of deleted emails
		// })
	}

	handleCopy() {
		fetch('/api/copyEmail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				"id":	Object.keys(this.props.selectedCheckboxes)
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
			'disabled': Object.keys(this.props.selectedCheckboxes).length > 1 ? true : false
		})

		return (
			<div className="email-controls">
				<div className="email-controls__item" onClick={this.handleDelete}>Delete</div>
				<div className={this.copyClassNames} onClick={this.handleCopy}>Copy</div>
			</div>
		)
	}
}
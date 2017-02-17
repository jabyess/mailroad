import React from 'react'

export default class EditorControlsContainer extends React.Component {
	constructor() {
		super()

		this.handleEditClick = this.handleEditClick.bind(this)

	}

	handleEditClick() {
		console.log('clicked')
		let toggleEditMode = new CustomEvent('toggleVisible', {
			detail: 'isEditModeActive'
		})
		window.dispatchEvent(toggleEditMode)
	}

	render() {
		return (
			<div className="editor-controls">
				<button className="button editor-controls--button" onClick={this.handleEditClick}>Edit Mode</button>
			</div>
		)
	}
}